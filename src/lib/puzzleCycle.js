// src/lib/puzzleCycle.js
//
// Single source of truth for "which puzzle picture is it, and when does it
// change" — a GLOBAL event, the same for every player, not a per-user timer.
// Every client computes this the same way from the current time, so there's
// nothing to keep in sync and nothing a modified client could spoof to
// trigger an early/extra reset.

// Anchor date: cycle 0 starts here. Change this only if you need to shift
// the whole schedule — doing so resets everyone's board immediately.
const PUZZLE_EPOCH = Date.UTC(2026, 6, 8); // July 8, 2026, 00:00 UTC

const PUZZLE_DURATION_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

/** Which cycle (0, 1, 2, ...) are we in right now? */
export function getPuzzleCycleIndex(now = Date.now()) {
  return Math.floor((now - PUZZLE_EPOCH) / PUZZLE_DURATION_MS);
}

/** Timestamp (ms) the current cycle started. */
export function getPuzzleCycleStart(now = Date.now()) {
  return PUZZLE_EPOCH + getPuzzleCycleIndex(now) * PUZZLE_DURATION_MS;
}

/** Timestamp (ms) the current cycle ends / the next one begins. */
export function getPuzzleCycleEnd(now = Date.now()) {
  return getPuzzleCycleStart(now) + PUZZLE_DURATION_MS;
}