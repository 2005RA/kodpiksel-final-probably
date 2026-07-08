import { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { flyReward } from '../components/RewardFly';
import { useAuth } from './AuthContext';
import { useCountdown } from '../hooks/useCountdown';
import { supabase } from '../lib/supabase';
import { getPuzzleCycleIndex, getPuzzleCycleEnd } from '../lib/puzzleCycle';
// ── 5×5 PIXEL ART BOARDS ─────────────────────────────────────────────────────
// Each cell: { color: '#hex' } — the target picture.
// PUZZLE_BOARDS is an ordered list — every player's board automatically
// advances to the next entry the moment their 30-day countdown ends
// (wrapping back to the start once it reaches the end of the list).
// To add the next picture: just push a new 64-cell array below.
// Make sure everything above this line is completely closed off!

const KEY_BOARD = [
  // Row 1: Top loop of the key head
  { color: '#0D1B2A' }, { color: '#0D1B2A' }, { color: '#F4A600' }, { color: '#F4A600' }, { color: '#F4A600' }, { color: '#F4A600' }, { color: '#0D1B2A' }, { color: '#0D1B2A' },
  // Row 2: Hollow center of key head
  { color: '#0D1B2A' }, { color: '#F4A600' }, { color: '#0D1B2A' }, { color: '#0D1B2A' }, { color: '#0D1B2A' }, { color: '#0D1B2A' }, { color: '#F4A600' }, { color: '#0D1B2A' },
  // Row 3: Bottom loop of key head
  { color: '#0D1B2A' }, { color: '#0D1B2A' }, { color: '#F4A600' }, { color: '#F4A600' }, { color: '#F4A600' }, { color: '#F4A600' }, { color: '#0D1B2A' }, { color: '#0D1B2A' },
  // Row 4: Key shaft starts
  { color: '#0D1B2A' }, { color: '#0D1B2A' }, { color: '#0D1B2A' }, { color: '#F4A600' }, { color: '#F4A600' }, { color: '#0D1B2A' }, { color: '#0D1B2A' }, { color: '#0D1B2A' },
  // Row 5: Key shaft / first tooth
  { color: '#0D1B2A' }, { color: '#0D1B2A' }, { color: '#0D1B2A' }, { color: '#F4A600' }, { color: '#F4A600' }, { color: '#F4A600' }, { color: '#F4A600' }, { color: '#0D1B2A' },
  // Row 6: Key shaft gap
  { color: '#0D1B2A' }, { color: '#0D1B2A' }, { color: '#0D1B2A' }, { color: '#F4A600' }, { color: '#F4A600' }, { color: '#0D1B2A' }, { color: '#0D1B2A' }, { color: '#0D1B2A' },
  // Row 7: Second key tooth
  { color: '#0D1B2A' }, { color: '#0D1B2A' }, { color: '#0D1B2A' }, { color: '#F4A600' }, { color: '#F4A600' }, { color: '#F4A600' }, { color: '#F4A600' }, { color: '#0D1B2A' },
  // Row 8: Key tip
  { color: '#0D1B2A' }, { color: '#0D1B2A' }, { color: '#0D1B2A' }, { color: '#F4A600' }, { color: '#F4A600' }, { color: '#0D1B2A' }, { color: '#0D1B2A' }, { color: '#0D1B2A' }
];

export const PUZZLE_BOARDS = [
  KEY_BOARD,
  // Next picture goes here, e.g.:
  // [
  //   { color: '#...' }, { color: '#...' }, ... (64 cells total)
  // ],
];
// ─────────────────────────────────────────────────────────────────────────────

// ── BUBBLE REWARDS ────────────────────────────────────────────────────────────
export const BUBBLES = [
  {
    id:      'small',
    label:   '10 Piksel Balonu',
    cost:    10,
    emoji:   '🫧',
    rewards: [
      { type: 'key',  amount: 5 },
      { type: 'hourglass', amount: 3  },
    ],
    color:   '#00D4AA',
  },
  {
    id:      'medium',
    label:   '20 Piksel Balonu',
    cost:    20,
    emoji:   '🫧',
    rewards: [
      { type: 'key',       amount: 8  },
      { type: 'hourglass', amount: 5 },
    ],
    color:   '#a78bfa',
  },
  {
    id:      'large',
    label:   '30 Piksel Balonu',
    cost:    30,
    emoji:   '🫧',
    rewards: [
      { type: 'key',       amount: 10  },
      { type: 'hourglass', amount: 8  },
    ],
    color:   '#F4A600',
  },
];
// ─────────────────────────────────────────────────────────────────────────────

const PuzzleContext = createContext(null);

// ── BUMP THIS to launch a new board design/reward cycle ──
// Changing this number resets everyone's board + restarts the 30-day
// countdown, the next time their profile loads. Leaving it alone means
// nothing resets except the normal 30-day expiry.
export const PUZZLE_VERSION = 2;

export function PuzzleProvider({ children }) {
  const { profile, updateProfile } = useAuth();
  const [revealed,  setRevealed]  = useState(new Set());
  const [repeated,  setRepeated]  = useState(0);
  const [hasNewPixel, setHasNewPixel] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const completeFiredRef = useRef(false);

  // cycleIndex and deadline are GLOBAL — every player is on the same
  // picture at the same time, computed purely from wall-clock time
  // (see lib/puzzleCycle.js), not stored per-user. This re-derives on
  // every render, which is cheap and means it can't drift out of sync.
  const cycleIndex = getPuzzleCycleIndex();
  const boardTarget = PUZZLE_BOARDS[cycleIndex % PUZZLE_BOARDS.length];
  const deadline = getPuzzleCycleEnd();

  // The countdown hitting zero (or loading mid-cycle-change, handled in the
  // hydrate effect below) is the only thing that starts a new board.
  // Finishing early doesn't matter — everyone switches pictures together.
  function handlePuzzleExpire() {
    setRevealed(new Set());
    completeFiredRef.current = false;
  }

  const countdownLabel = useCountdown(deadline, handlePuzzleExpire);

  // repeated (the bubble currency) is server-authoritative now — it lives
  // in profiles.repeated_pixels, credited via increment_repeated_pixel()
  // and debited via claim_puzzle_bubble(). This just mirrors it into local
  // state whenever the profile is (re)loaded, so the UI has something to
  // render without waiting on a network round trip for every render.
  useEffect(() => {
    if (profile) setRepeated(profile.repeated_pixels ?? 0);
  }, [profile?.repeated_pixels]);

  useEffect(() => {
    if (profile && !hydrated) {
      const saved = profile.puzzle_state ?? { revealed: [] };
      const savedVersion = saved.version ?? PUZZLE_VERSION;

      // Discard saved progress if the code version changed, OR if the
      // global cycle has moved on since this player last saved (e.g. they
      // haven't opened the app in over 30 days — the countdown's onExpire
      // never got a chance to fire for them).
      if (savedVersion !== PUZZLE_VERSION || saved.cycleIndex !== cycleIndex) {
        setRevealed(new Set());
        completeFiredRef.current = false;
      } else {
        setRevealed(new Set(saved.revealed ?? []));
      }
      setHydrated(true);
    }
  }, [profile, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    // Only cosmetic board state (which tiles are revealed, which global
    // cycle they belong to) is persisted here. The bubble currency
    // (`repeated`) is no longer part of this — it's server-tracked in
    // profiles.repeated_pixels, credited/debited only through
    // increment_repeated_pixel() and claim_puzzle_bubble(), so it can't be
    // forged via a plain profile update.
    updateProfile({
      puzzle_state: {
        revealed: Array.from(revealed),
        cycleIndex,
        version: PUZZLE_VERSION,
      },
    });
  }, [revealed, cycleIndex]);

  // ── Fire completion event once when board fills up ──
  useEffect(() => {
    if (!hydrated) return;
    if (revealed.size >= 64 && !completeFiredRef.current) {
      completeFiredRef.current = true;
      window.dispatchEvent(new CustomEvent('puzzle-complete'));
    }
  }, [revealed]);

  const earnPixel = useCallback(({ fromEl, x, y } = {}) => {
    setRevealed(prev => {
      const totalPieces = 64;
      let pick;

      const unrevealedPieces = [];
      for (let i = 0; i < totalPieces; i++) {
        if (!prev.has(i)) unrevealedPieces.push(i);
      }

      if (unrevealedPieces.length > 0 && Math.random() < 0.60) {
        const randomUnrevealedIndex = Math.floor(Math.random() * unrevealedPieces.length);
        pick = unrevealedPieces[randomUnrevealedIndex];
      } else {
        pick = Math.floor(Math.random() * totalPieces);
      }

      if (prev.has(pick)) {
        setRepeated(r => r + 1); // optimistic — reconciled from profile.repeated_pixels above
        setHasNewPixel(true);
        flyReward({ type: 'pixel', fromEl, x, y });
        if (profile) {
          supabase.rpc('increment_repeated_pixel').then(({ error }) => {
            if (error) console.error('increment_repeated_pixel failed:', error);
          });
        }
        return prev;
      }

      const next = new Set(prev);
      next.add(pick);
      setHasNewPixel(true);
      flyReward({ type: 'pixel', fromEl, x, y });
      return next;
    });
  }, [profile]);

  // Listen for 'earn-pixel' events dispatched by RewardContext when a
  // race-end or weekly-end reward includes pixels. Decouples PuzzleContext
  // from RewardContext (no circular import needed).
  useEffect(() => {
    function handler() { earnPixel(); }
    window.addEventListener('earn-pixel', handler);
    return () => window.removeEventListener('earn-pixel', handler);
  }, [earnPixel]);

  // claimBubbleFromServer is RewardContext's wrapper around the
  // claim_puzzle_bubble RPC — cost and reward amounts are hardcoded
  // server-side, so this is just a client-side affordability pre-check
  // for instant button feedback. The server re-checks the real balance
  // regardless, so nothing bad happens if this drifts stale.
  const claimBubble = useCallback(async (bubbleId, claimBubbleFromServer) => {
    const bubble = BUBBLES.find(b => b.id === bubbleId);
    if (!bubble) return false;
    if (repeated < bubble.cost) return false;

    const updated = await claimBubbleFromServer(bubbleId);
    if (!updated) return false;

    setRepeated(updated.repeated_pixels ?? 0);
    return true;
  }, [repeated]);

  const clearNewPixel = useCallback(() => setHasNewPixel(false), []);

  return (
    <PuzzleContext.Provider value={{
      revealed, repeated, hasNewPixel,
      earnPixel, claimBubble, clearNewPixel,
      boardTarget,
      bubbles:     BUBBLES,
      countdownLabel, deadline,
    }}>
      {children}
    </PuzzleContext.Provider>
  );
}
export function usePuzzle() {
  return useContext(PuzzleContext);
}