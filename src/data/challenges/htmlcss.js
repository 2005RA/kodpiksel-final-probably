// src/data/challenges/htmlcss.js
import { parseBody } from '../validateHelper.js';

export const HTMLCSS_CHALLENGES = {
  // ── 1. HTML-only — ASAN ─────────────────────────────────────────────
  1: {
    id: 1, tag: 'HTML Çalışma', title: 'Özünü Tanıt',
    difficulty: 'ASAN', urlPath: 'challenge-1',
    chips: 2, keys: 0, hourglasses: 0, pixels: 1,
    taskHtml: `<p>Sən kimsən? Gəl bunu bir cümlə ilə göstərək! 🙋</p><ul><li><span class="code-chip">&lt;h1&gt;</span> içində adını yaz</li><li><span class="code-chip">&lt;p&gt;</span> içində özün haqqında ən azı 5 sözlük məlumat yaz (nəyi sevirsən, nə ilə maraqlanırsan və s.)</li></ul>`,
    starter: '<html>\n<body>\n\n</body>\n</html>',
    errorMsg: 'h1 düzgün bağlanmalı və ad yazılmalıdır. p içində ən azı 5 söz olmalıdır.',
    chests: [
      { cost: 1, hint: '<span class="code-chip">&lt;h1&gt;</span> teqini aç, daxilinə adını yaz, sonra bağla: <span class="code-chip">&lt;h1&gt;Adın&lt;/h1&gt;</span>', code: null },
      { cost: 2, hint: '<span class="code-chip">&lt;p&gt;</span> daxilinə nə etməyi sevdiyini ən azı 5 sözlə yaz.', code: null },
      { cost: 5, hint: 'Tam nümunə:', code: '<h1>Aygün</h1>\n<p>Rəsm çəkməyi və kitab oxumağı çox sevirəm.</p>' },
    ],
    validate: (code) => {
      const p = parseBody(code);
      if (!p) return false;
      if (!p.balanced('h1') || !p.balanced('p')) return false;
      const h1 = p.body.querySelector('h1');
      if (!h1?.textContent.trim()) return false;
      const para = p.body.querySelector('p');
      if (!para) return false;
      return para.textContent.trim().split(/\s+/).length >= 5;
    },
  },

  // ── 2. HTML-only — ASAN ─────────────────────────────────────────────
  2: {
    id: 2, tag: 'HTML Çalışma', title: 'Sevimli Siyahı',
    difficulty: 'ASAN', urlPath: 'challenge-2',
    chips: 2, keys: 0, hourglasses: 0, pixels: 1,
    taskHtml: `<p>Ən çox sevdiyin 3 şeyi düşün — filmlər, heyvanlar, yeməklər, nə olursa! Onları bir siyahı kimi göstər. 🍕🐶🎮</p><ul><li><span class="code-chip">&lt;ul&gt;</span> istifadə et</li><li>İçində ən azı <strong>3</strong> <span class="code-chip">&lt;li&gt;</span> elementi olsun</li></ul>`,
    starter: '<html>\n<body>\n\n</body>\n</html>',
    errorMsg: 'ul düzgün bağlanmalı və içində ən azı 3 li elementi olmalıdır.',
    chests: [
      { cost: 1, hint: '<span class="code-chip">&lt;ul&gt;</span> teqini aç.', code: null },
      { cost: 2, hint: 'Hər sevdiyin şeyi ayrı bir <span class="code-chip">&lt;li&gt;</span> daxilinə yaz — ən azı 3 dənə.', code: null },
      { cost: 5, hint: 'Tam nümunə:', code: '<ul>\n  <li>Pizza</li>\n  <li>Pişiklər</li>\n  <li>Video oyunlar</li>\n</ul>' },
    ],
    validate: (code) => {
      const p = parseBody(code);
      if (!p) return false;
      if (!p.balanced('ul') || !p.balanced('li')) return false;
      const ul = p.body.querySelector('ul');
      if (!ul) return false;
      return ul.querySelectorAll('li').length >= 3;
    },
  },

  // ── 3. HTML-only — ORTA ─────────────────────────────────────────────
  3: {
    id: 3, tag: 'HTML Çalışma', title: 'Keçid Qur',
    difficulty: 'ORTA', urlPath: 'challenge-3',
    chips: 3, keys: 1, hourglasses: 0, pixels: 1,
    taskHtml: `<p>İnternetdə ən çox girdiyin sayt hansıdır? Onun linkini burada yaradaq! 🔗</p><ul><li><span class="code-chip">&lt;a&gt;</span> teqi ilə istənilən real sayta keçid yarat</li><li><span class="code-chip">href</span> <span class="code-chip">https://</span> ilə başlamalıdır</li><li>Keçidin üzərindəki mətn ən azı 2 söz olsun</li></ul>`,
    starter: '<html>\n<body>\n\n</body>\n</html>',
    errorMsg: 'a teqi düzgün bağlanmalı, href="https://..." olmalı və üzərindəki mətn ən azı 2 söz olmalıdır.',
    chests: [
      { cost: 1, hint: '<span class="code-chip">&lt;a&gt;</span> teqini aç.', code: null },
      { cost: 2, hint: '<span class="code-chip">href="https://..."</span> atributunu dırnaq içində əlavə et.', code: null },
      { cost: 5, hint: 'Tam nümunə:', code: '<a href="https://youtube.com">YouTube-a get</a>' },
    ],
    validate: (code) => {
      const p = parseBody(code);
      if (!p) return false;
      if (!p.balanced('a')) return false;
      if (!p.hasAttr('href')) return false;
      const a = p.body.querySelector('a[href]');
      if (!a) return false;
      const href = a.getAttribute('href') || '';
      if (!/^https?:\/\//i.test(href)) return false;
      return a.textContent.trim().split(/\s+/).length >= 2;
    },
  },

  // ── 4. HTML-only — ORTA ─────────────────────────────────────────────
  4: {
    id: 4, tag: 'HTML Çalışma', title: 'Mini Profil Kartı',
    difficulty: 'ORTA', urlPath: 'challenge-4',
    chips: 4, keys: 1, hourglasses: 0, pixels: 2,
    taskHtml: `<p>Özünə kiçik bir profil kartı hazırla — sanki oyun personajı yaradırsan! 🎮</p><ul><li><span class="code-chip">&lt;h2&gt;</span> — adın</li><li><span class="code-chip">&lt;p&gt;</span> — harada yaşadığın</li><li><span class="code-chip">&lt;ul&gt;</span> və içində ən azı 2 <span class="code-chip">&lt;li&gt;</span> — bacarıqların</li></ul>`,
    starter: '<html>\n<body>\n\n</body>\n</html>',
    errorMsg: 'h2, p və ən azı 2 li olan ul — hamısı düzgün bağlanmalıdır.',
    chests: [
      { cost: 1, hint: '<span class="code-chip">&lt;h2&gt;</span> daxilinə adını yaz.', code: null },
      { cost: 2, hint: '<span class="code-chip">&lt;p&gt;</span> daxilinə şəhərini yaz, sonra <span class="code-chip">&lt;ul&gt;</span> aç.', code: null },
      { cost: 5, hint: 'Tam nümunə:', code: '<h2>Nihad</h2>\n<p>Bakıda yaşayıram.</p>\n<ul>\n  <li>Kod yazmaq</li>\n  <li>Futbol</li>\n</ul>' },
    ],
    validate: (code) => {
      const p = parseBody(code);
      if (!p) return false;
      if (!p.balanced('h2') || !p.balanced('p') || !p.balanced('ul') || !p.balanced('li')) return false;
      const h2  = p.body.querySelector('h2');
      const para = p.body.querySelector('p');
      const ul  = p.body.querySelector('ul');
      if (!h2?.textContent.trim() || !para?.textContent.trim() || !ul) return false;
      return ul.querySelectorAll('li').length >= 2;
    },
  },

  // ── 5. HTML-only — ORTA ─────────────────────────────────────────────
  5: {
    id: 5, tag: 'HTML Çalışma', title: 'Şəkil + Başlıq',
    difficulty: 'ORTA', urlPath: 'challenge-5',
    chips: 3, keys: 1, hourglasses: 0, pixels: 1,
    taskHtml: `<p>Sevdiyin bir şeyin (heyvan, oyunçu, yer — nə desən) şəklini tap və altında nə olduğunu izah et. 🖼️</p><ul><li><span class="code-chip">&lt;img&gt;</span> — <span class="code-chip">src</span> və <span class="code-chip">alt</span> atributları dolu olsun</li><li>Altında <span class="code-chip">&lt;p&gt;</span> ilə qısa açıqlama yaz</li></ul>`,
    starter: '<html>\n<body>\n\n</body>\n</html>',
    errorMsg: 'img teqinin src="..." və alt="..." atributları olmalı, altında p teqi olmalıdır.',
    chests: [
      { cost: 1, hint: '<span class="code-chip">&lt;img&gt;</span> teqini yaz — bağlanış teqinə ehtiyac yoxdur.', code: null },
      { cost: 2, hint: '<span class="code-chip">src="..."</span> və <span class="code-chip">alt="..."</span> atributlarını dırnaq içində doldur.', code: null },
      { cost: 5, hint: 'Tam nümunə:', code: '<img src="https://example.com/pisik.jpg" alt="Mənim pişiyim">\n<p>Bu mənim pişiyimdir, adı Bars.</p>' },
    ],
    validate: (code) => {
      const p = parseBody(code);
      if (!p) return false;
      if (!p.balanced('p')) return false;
      if (!p.hasAttr('src') || !p.hasAttr('alt')) return false;
      const img = p.body.querySelector('img');
      if (!img) return false;
      const src = img.getAttribute('src') || '';
      const para = p.body.querySelector('p');
      return src.trim().length > 0 && !!para?.textContent.trim();
    },
  },

  // ── 6. MİXED — ORTA/ÇƏTİN ────────────────────────────────────────────
  6: {
    id: 6, tag: 'HTML+CSS Çalışma', title: 'Rəngli Başlıq',
    difficulty: 'ÇƏTİN', urlPath: 'challenge-6',
    chips: 5, keys: 2, hourglasses: 1, pixels: 2,
    taskHtml: `<p>Diqqət çəkən bir elan lövhəsi düzəlt — sanki mağazada "ENDİRİM!" yazısı kimi. Aşağıdakı nümunəyə bax:</p><div style="background-color:yellow;color:blue;font-weight:bold;padding:8px 12px;display:inline-block;border-radius:4px;margin:8px 0;">Mənim Başlığım</div><ul><li><span class="code-chip">&lt;h1&gt;</span> yaz</li><li>Mətni <strong>mavi</strong>, arxa fonu isə <strong>sarı</strong> rəngə boya (inline <span class="code-chip">style</span> ilə)</li></ul>`,
    starter: '<html>\n<body>\n\n</body>\n</html>',
    errorMsg: 'h1 düzgün bağlanmalı, style="color:blue;background-color:yellow" olmalıdır.',
    chests: [
      { cost: 1, hint: '<span class="code-chip">&lt;h1 style=""&gt;</span> yaz — bütün rəng əmrləri <span class="code-chip">style</span> daxilinə gedəcək.', code: null },
      { cost: 2, hint: 'Mətn rəngi üçün: <span class="code-chip">color: blue;</span>', code: null },
      { cost: 6, hint: 'Tam nümunə:', code: '<h1 style="color: blue; background-color: yellow;">Mənim Başlığım</h1>' },
    ],
    validate: (code) => {
      const p = parseBody(code);
      if (!p) return false;
      if (!p.balanced('h1')) return false;
      const h1 = p.body.querySelector('h1');
      if (!h1) return false;
      const style = (h1.getAttribute('style') || '').replace(/\s/g, '').toLowerCase();
      return /color:blue/.test(style) && /background-color:yellow/.test(style);
    },
  },

  // ── 7. CSS-only — ASAN ───────────────────────────────────────────────
  7: {
    id: 7, tag: 'CSS Çalışma', title: 'Qalın Mətn',
    difficulty: 'ASAN', urlPath: 'challenge-7',
    chips: 1, keys: 0, hourglasses: 0, pixels: 0,
    taskHtml: `<p>Vacib bir sözü necə fərqləndirərsən? Onu qalınlaşdıraraq! Bir cümlə yaz və onu qalın et. 💪</p><ul><li><span class="code-chip">&lt;p&gt;</span> yaz</li><li><span class="code-chip">style</span> ilə mətni qalınlaşdır</li></ul>`,
    starter: '<html>\n<body>\n\n</body>\n</html>',
    errorMsg: 'p düzgün bağlanmalı, style="font-weight: bold;" olmalıdır.',
    chests: [
      { cost: 1, hint: '<span class="code-chip">&lt;p style=""&gt;</span> yaz.', code: null },
      { cost: 2, hint: 'style daxilinə: <span class="code-chip">font-weight: bold;</span>', code: null },
      { cost: 4, hint: 'Tam nümunə:', code: '<p style="font-weight: bold;">Bu mətn qalındır!</p>' },
    ],
    validate: (code) => {
      const p = parseBody(code);
      if (!p || !p.balanced('p')) return false;
      const para = p.body.querySelector('p');
      if (!para) return false;
      const style = (para.getAttribute('style') || '').replace(/\s/g, '').toLowerCase();
      return /(?:^|;)font-weight:bold(;|$)/.test(style);
    },
  },

  // ── 8. CSS-only — ASAN ───────────────────────────────────────────────
  8: {
    id: 8, tag: 'CSS Çalışma', title: 'Xətti Sil',
    difficulty: 'ASAN', urlPath: 'challenge-8',
    chips: 1, keys: 0, hourglasses: 0, pixels: 0,
    taskHtml: `<p>Adi linklərin altında xətt olur, elə deyilmi? Gəl onu sildirək — daha təmiz görünəcək. 🔗</p><ul><li><span class="code-chip">&lt;a&gt;</span> (istənilən href) yaz</li><li><span class="code-chip">style</span> ilə alt xəttini sil</li></ul>`,
    starter: '<html>\n<body>\n\n</body>\n</html>',
    errorMsg: 'a düzgün bağlanmalı, href olmalı, style="text-decoration: none;" olmalıdır.',
    chests: [
      { cost: 1, hint: '<span class="code-chip">&lt;a href="https://..." style=""&gt;</span> yaz.', code: null },
      { cost: 2, hint: 'style daxilinə: <span class="code-chip">text-decoration: none;</span>', code: null },
      { cost: 4, hint: 'Tam nümunə:', code: '<a href="https://example.com" style="text-decoration: none;">Keçid</a>' },
    ],
    validate: (code) => {
      const p = parseBody(code);
      if (!p || !p.balanced('a')) return false;
      const a = p.body.querySelector('a[href]');
      if (!a) return false;
      const style = (a.getAttribute('style') || '').replace(/\s/g, '').toLowerCase();
      return /(?:^|;)text-decoration:none(;|$)/.test(style);
    },
  },

  // ── 9. MİXED — ORTA ──────────────────────────────────────────────────
  9: {
    id: 9, tag: 'HTML+CSS Çalışma', title: 'Yumru Künclər',
    difficulty: 'ORTA', urlPath: 'challenge-9',
    chips: 2, keys: 0, hourglasses: 0, pixels: 1,
    taskHtml: `<p>Kəskin künclər bezdirici olur — gəl onları yumşaldaq! Rəngli, yumru künclü bir qutu düzəlt. 🍪</p><ul><li><span class="code-chip">&lt;div&gt;</span> yarat</li><li>Ona rəng ver (<span class="code-chip">background-color</span>)</li><li>Künclərini 10px-dən çox yumşalt (<span class="code-chip">border-radius</span>)</li></ul>`,
    starter: '<html>\n<body>\n\n</body>\n</html>',
    errorMsg: 'div-in style-ında background-color olmalı, border-radius 10px-dən böyük olmalıdır.',
    chests: [
      { cost: 1, hint: '<span class="code-chip">&lt;div style=""&gt;&lt;/div&gt;</span> yaz, görünmək üçün <span class="code-chip">width</span> və <span class="code-chip">height</span> ver.', code: null },
      { cost: 2, hint: 'style daxilinə: <span class="code-chip">background-color</span> və <span class="code-chip">border-radius: 20px;</span> əlavə et.', code: null },
      { cost: 5, hint: 'Tam nümunə:', code: '<div style="width: 100px; height: 100px; background-color: teal; border-radius: 20px;"></div>' },
    ],
    validate: (code) => {
      const p = parseBody(code);
      if (!p || !p.balanced('div')) return false;
      const div = p.body.querySelector('div');
      if (!div) return false;
      const style = (div.getAttribute('style') || '').replace(/\s/g, '').toLowerCase();
      if (!/(?:^|;)background(-color)?:[a-z]+(;|$)/.test(style)) return false;
      const m = style.match(/(?:^|;)border-radius:(\d+)px(;|$)/);
      return !!m && Number(m[1]) > 10;
    },
  },

  // ── 10. MİXED — ORTA ─────────────────────────────────────────────────
  10: {
    id: 10, tag: 'HTML+CSS Çalışma', title: 'Ölçülü Qutu',
    difficulty: 'ORTA', urlPath: 'challenge-10',
    chips: 2, keys: 0, hourglasses: 0, pixels: 1,
    taskHtml: `<p>Böyük, gözə çarpan bir kvadrat düzəlt. 📦</p><ul><li><span class="code-chip">&lt;div&gt;</span> yarat</li><li><span class="code-chip">width</span> və <span class="code-chip">height</span> hər ikisi 50px-dən böyük olsun</li><li>Görünsün deyə rəng ver</li></ul>`,
    starter: '<html>\n<body>\n\n</body>\n</html>',
    errorMsg: 'div-in style-ında width>50px, height>50px, background-color olmalıdır.',
    chests: [
      { cost: 1, hint: '<span class="code-chip">&lt;div style=""&gt;&lt;/div&gt;</span> yaz.', code: null },
      { cost: 2, hint: 'style daxilinə: <span class="code-chip">width: 100px; height: 100px;</span> yaz, sonra rəng ver.', code: null },
      { cost: 5, hint: 'Tam nümunə:', code: '<div style="width: 120px; height: 120px; background-color: orange;"></div>' },
    ],
    validate: (code) => {
      const p = parseBody(code);
      if (!p || !p.balanced('div')) return false;
      const div = p.body.querySelector('div');
      if (!div) return false;
      const style = (div.getAttribute('style') || '').replace(/\s/g, '').toLowerCase();
      const w = style.match(/(?:^|;)width:(\d+)px(;|$)/);
      const h = style.match(/(?:^|;)height:(\d+)px(;|$)/);
      if (!w || Number(w[1]) <= 50) return false;
      if (!h || Number(h[1]) <= 50) return false;
      return /(?:^|;)background(-color)?:[a-z]+(;|$)/.test(style);
    },
  },

  // ── 11. MİXED — ORTA ─────────────────────────────────────────────────
  11: {
    id: 11, tag: 'HTML+CSS Çalışma', title: 'Şəffaflıq',
    difficulty: 'ORTA', urlPath: 'challenge-11',
    chips: 2, keys: 0, hourglasses: 0, pixels: 1,
    taskHtml: `<p>Bir kağızın arxasından işıq keçdiyini görmüsən? Elementə həmin effekti ver — yarı-şəffaf et. 👻</p><ul><li><span class="code-chip">&lt;p&gt;</span> yaz, rəng ver</li><li><span class="code-chip">opacity</span> ilə 0 və 1 arasında (məs. 0.5) şəffaflıq təyin et</li></ul>`,
    starter: '<html>\n<body>\n\n</body>\n</html>',
    errorMsg: 'p-nin style-ında opacity 0-dan böyük, 1-dən kiçik olmalıdır (məs. 0.5).',
    chests: [
      { cost: 1, hint: '<span class="code-chip">&lt;p style=""&gt;</span> yaz, sonra <span class="code-chip">background-color</span> ver ki, effekt görünsün.', code: null },
      { cost: 2, hint: 'style daxilinə: <span class="code-chip">opacity: 0.5;</span> yaz.', code: null },
      { cost: 5, hint: 'Tam nümunə:', code: '<p style="background-color: red; opacity: 0.5;">Mətnim</p>' },
    ],
    validate: (code) => {
      const p = parseBody(code);
      if (!p || !p.balanced('p')) return false;
      const para = p.body.querySelector('p');
      if (!para) return false;
      const style = (para.getAttribute('style') || '').replace(/\s/g, '').toLowerCase();
      const m = style.match(/(?:^|;)opacity:(0?\.\d+|1)(;|$)/);
      return !!m && Number(m[1]) > 0 && Number(m[1]) < 1;
    },
  },

  // ── 12. MİXED — ÇƏTİN ────────────────────────────────────────────────
  12: {
    id: 12, tag: 'HTML+CSS Çalışma', title: 'Kölgə Effekti',
    difficulty: 'ÇƏTİN', urlPath: 'challenge-12',
    chips: 4, keys: 1, hourglasses: 0, pixels: 2,
    taskHtml: `<p>Qutunun altına kölgə düşsün, sanki yerdən qalxıb havada dayanır. ✨</p><ul><li><span class="code-chip">&lt;div&gt;</span> yarat, ölçü və rəng ver</li><li><span class="code-chip">box-shadow</span> əlavə et (format: <span class="code-chip">Npx Npx Npx rəng</span>)</li></ul>`,
    starter: '<html>\n<body>\n\n</body>\n</html>',
    errorMsg: 'div-də width, height, background-color və box-shadow (Npx Npx Npx rəng) olmalıdır.',
    chests: [
      { cost: 1, hint: '<span class="code-chip">&lt;div style=""&gt;&lt;/div&gt;</span> yaz, sonra width, height, background-color əlavə et.', code: null },
      { cost: 3, hint: 'style-ın sonuna: <span class="code-chip">box-shadow: 5px 5px 10px gray;</span> yaz.', code: null },
      { cost: 6, hint: 'Tam nümunə:', code: '<div style="width: 100px; height: 100px; background-color: teal; box-shadow: 5px 5px 10px gray;"></div>' },
    ],
    validate: (code) => {
      const p = parseBody(code);
      if (!p || !p.balanced('div')) return false;
      const div = p.body.querySelector('div');
      if (!div) return false;
      const style = (div.getAttribute('style') || '').replace(/\s/g, '').toLowerCase();
      if (!/(?:^|;)width:\d+px(;|$)/.test(style)) return false;
      if (!/(?:^|;)height:\d+px(;|$)/.test(style)) return false;
      if (!/(?:^|;)background(-color)?:[a-z]+(;|$)/.test(style)) return false;
      return /box-shadow:\d+px\d+px\d+px[a-z]+/.test(style);
    },
  },
};

export const TOTAL_CHALLENGES = Object.keys(HTMLCSS_CHALLENGES).length;

export function getChallengeRewards(id) {
  const c = HTMLCSS_CHALLENGES[id];
  if (!c) return {};
  return { chips: c.chips||0, keys: c.keys||0, hourglasses: c.hourglasses||0, pixels: c.pixels||0 };
}