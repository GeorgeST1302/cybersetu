/* ==========================================================================
   CyberSetu — national monument skyline
   ---------------------------------------------------------------------------
   Drawn across a 2400x300 viewBox so the monuments are distributed over the
   ENTIRE width rather than clustered on one side. Rendered with
   preserveAspectRatio="xMidYMax slice" so the strip always covers the full
   viewport edge to edge at any width, cropping only the low filler blocks at
   the extreme margins.
   ========================================================================== */

const GROUND = 300;

/* Every monument is drawn with its base at local y=0 and grows upward
   (negative y), then positioned with a single translate. */
const M = {
  /* ---- Qutub Minar, Delhi ------------------------------------------- */
  qutub: `
    <path d="M-19 0 L-15 -66 L-12 -122 L-9 -170 L-8 -202 L8 -202 L9 -170 L12 -122 L15 -66 L19 0 Z"/>
    <rect x="-21" y="-70" width="42" height="7" rx="2"/>
    <rect x="-18" y="-126" width="36" height="6" rx="2"/>
    <rect x="-15" y="-174" width="30" height="6" rx="2"/>
    <path d="M-9 -202 h18 v-10 a9 9 0 0 0 -18 0 Z"/>
    <rect x="-1.6" y="-224" width="3.2" height="12" rx="1.6"/>`,

  /* ---- Charminar, Hyderabad ----------------------------------------- */
  charminar: `
    <rect x="-78" y="-86" width="156" height="86"/>
    <path d="M-52 0 v-44 a18 18 0 0 1 36 0 V0 Z" fill="none" stroke-width="0"/>
    <g fill="var(--sky-cut)">
      <path d="M-50 0 v-42 a17 17 0 0 1 34 0 V0 Z"/>
      <path d="M16 0 v-42 a17 17 0 0 1 34 0 V0 Z"/>
    </g>
    <rect x="-84" y="-98" width="168" height="14" rx="3"/>
    <g>
      <rect x="-80" y="-176" width="17" height="80"/>
      <path d="M-80 -176 h17 v-13 a8.5 8.5 0 0 0 -17 0 Z"/>
      <rect x="-73" y="-201" width="3" height="13" rx="1.5"/>
      <rect x="63" y="-176" width="17" height="80"/>
      <path d="M63 -176 h17 v-13 a8.5 8.5 0 0 0 -17 0 Z"/>
      <rect x="70" y="-201" width="3" height="13" rx="1.5"/>
      <rect x="-48" y="-160" width="14" height="64"/>
      <path d="M-48 -160 h14 v-11 a7 7 0 0 0 -14 0 Z"/>
      <rect x="34" y="-160" width="14" height="64"/>
      <path d="M34 -160 h14 v-11 a7 7 0 0 0 -14 0 Z"/>
    </g>
    <path d="M-16 -98 h32 v-16 a16 16 0 0 0 -32 0 Z"/>`,

  /* ---- Hawa Mahal, Jaipur ------------------------------------------- */
  hawamahal: `
    <rect x="-96" y="-34" width="192" height="34"/>
    <rect x="-84" y="-68" width="168" height="34"/>
    <rect x="-70" y="-100" width="140" height="32"/>
    <rect x="-54" y="-130" width="108" height="30"/>
    <rect x="-36" y="-158" width="72" height="28"/>
    <path d="M-20 -158 h40 v-18 a20 20 0 0 0 -40 0 Z"/>
    <g fill="var(--sky-cut)">
      <rect x="-88" y="-28" width="13" height="20" rx="6"/><rect x="-64" y="-28" width="13" height="20" rx="6"/>
      <rect x="-40" y="-28" width="13" height="20" rx="6"/><rect x="-16" y="-28" width="13" height="20" rx="6"/>
      <rect x="8" y="-28" width="13" height="20" rx="6"/><rect x="32" y="-28" width="13" height="20" rx="6"/>
      <rect x="56" y="-28" width="13" height="20" rx="6"/>
      <rect x="-76" y="-62" width="12" height="19" rx="6"/><rect x="-52" y="-62" width="12" height="19" rx="6"/>
      <rect x="-28" y="-62" width="12" height="19" rx="6"/><rect x="-4" y="-62" width="12" height="19" rx="6"/>
      <rect x="20" y="-62" width="12" height="19" rx="6"/><rect x="44" y="-62" width="12" height="19" rx="6"/>
      <rect x="-60" y="-94" width="11" height="18" rx="5.5"/><rect x="-38" y="-94" width="11" height="18" rx="5.5"/>
      <rect x="-16" y="-94" width="11" height="18" rx="5.5"/><rect x="6" y="-94" width="11" height="18" rx="5.5"/>
      <rect x="28" y="-94" width="11" height="18" rx="5.5"/>
      <rect x="-44" y="-124" width="10" height="17" rx="5"/><rect x="-22" y="-124" width="10" height="17" rx="5"/>
      <rect x="0" y="-124" width="10" height="17" rx="5"/><rect x="22" y="-124" width="10" height="17" rx="5"/>
      <rect x="-26" y="-152" width="10" height="16" rx="5"/><rect x="-4" y="-152" width="10" height="16" rx="5"/>
      <rect x="18" y="-152" width="10" height="16" rx="5"/>
    </g>`,

  /* ---- Taj Mahal, Agra ---------------------------------------------- */
  taj: `
    <rect x="-150" y="-16" width="300" height="16"/>
    <rect x="-84" y="-96" width="168" height="80"/>
    <path d="M-46 -16 v-46 a23 23 0 0 1 46 0 v46 Z" transform="translate(23,0)" fill="var(--sky-cut)"/>
    <path d="M-44 -96 C-44 -150 -22 -172 0 -172 C22 -172 44 -150 44 -96 Z"/>
    <path d="M-3 -172 h6 v-14 a3 3 0 0 0 -6 0 Z"/>
    <rect x="-1.5" y="-198" width="3" height="14" rx="1.5"/>
    <g>
      <rect x="-124" y="-118" width="15" height="102"/>
      <path d="M-124 -118 h15 v-11 a7.5 7.5 0 0 0 -15 0 Z"/>
      <rect x="-118" y="-140" width="2.6" height="12" rx="1.3"/>
      <rect x="109" y="-118" width="15" height="102"/>
      <path d="M109 -118 h15 v-11 a7.5 7.5 0 0 0 -15 0 Z"/>
      <rect x="115" y="-140" width="2.6" height="12" rx="1.3"/>
      <rect x="-146" y="-104" width="13" height="88"/>
      <path d="M-146 -104 h13 v-10 a6.5 6.5 0 0 0 -13 0 Z"/>
      <rect x="133" y="-104" width="13" height="88"/>
      <path d="M133 -104 h13 v-10 a6.5 6.5 0 0 0 -13 0 Z"/>
    </g>
    <g>
      <path d="M-72 -96 C-72 -118 -62 -128 -52 -128 C-42 -128 -32 -118 -32 -96 Z"/>
      <path d="M32 -96 C32 -118 42 -128 52 -128 C62 -128 72 -118 72 -96 Z"/>
    </g>`,

  /* ---- India Gate, New Delhi ---------------------------------------- */
  indiagate: `
    <rect x="-84" y="-22" width="168" height="22"/>
    <rect x="-62" y="-158" width="124" height="136"/>
    <path d="M-32 -22 v-72 a32 32 0 0 1 64 0 v72 Z" fill="var(--sky-cut)"/>
    <rect x="-70" y="-176" width="140" height="20" rx="3"/>
    <rect x="-30" y="-192" width="60" height="17" rx="3"/>
    <path d="M-9 -192 h18 v-13 a9 9 0 0 0 -18 0 Z"/>`,

  /* ---- Sanchi Stupa, Madhya Pradesh --------------------------------- */
  sanchi: `
    <rect x="-96" y="-14" width="192" height="14"/>
    <path d="M-74 -14 A74 74 0 0 1 74 -14 Z"/>
    <rect x="-17" y="-102" width="34" height="12"/>
    <rect x="-2.4" y="-124" width="4.8" height="24"/>
    <path d="M-26 -124 h52 v6 h-52 Z"/>
    <path d="M-20 -138 h40 v5.5 h-40 Z"/>
    <path d="M-14 -150 h28 v5 h-28 Z"/>
    <g>
      <rect x="-102" y="-84" width="9" height="70"/>
      <rect x="93" y="-84" width="9" height="70"/>
      <rect x="-110" y="-92" width="25" height="6"/>
      <rect x="85" y="-92" width="25" height="6"/>
      <rect x="-108" y="-106" width="21" height="6"/>
      <rect x="87" y="-106" width="21" height="6"/>
    </g>`,

  /* ---- Konark Sun Temple wheel, Odisha ------------------------------ */
  konark: `
    <path d="M-58 0 L-46 -128 L46 -128 L58 0 Z"/>
    <path d="M-40 -128 L-26 -196 L26 -196 L40 -128 Z"/>
    <path d="M-12 -196 h24 v-12 a12 12 0 0 0 -24 0 Z"/>
    <g transform="translate(0,-58)">
      <circle cx="0" cy="0" r="46" fill="var(--sky-cut)"/>
      <circle cx="0" cy="0" r="46" fill="none" stroke="var(--sky-ink)" stroke-width="7"/>
      <circle cx="0" cy="0" r="12" fill="var(--sky-ink)"/>
      <g stroke="var(--sky-ink)" stroke-width="4.5" stroke-linecap="round">
        <line x1="0" y1="-42" x2="0" y2="42"/>
        <line x1="-42" y1="0" x2="42" y2="0"/>
        <line x1="-29.7" y1="-29.7" x2="29.7" y2="29.7"/>
        <line x1="-29.7" y1="29.7" x2="29.7" y2="-29.7"/>
        <line x1="-16.1" y1="-38.8" x2="16.1" y2="38.8"/>
        <line x1="16.1" y1="-38.8" x2="-16.1" y2="38.8"/>
        <line x1="-38.8" y1="-16.1" x2="38.8" y2="16.1"/>
        <line x1="38.8" y1="-16.1" x2="-38.8" y2="16.1"/>
      </g>
    </g>`,

  /* ---- Lotus Temple, New Delhi -------------------------------------- */
  lotus: `
    <rect x="-108" y="-18" width="216" height="18" rx="3"/>
    <g>
      <path d="M-100 -18 C-96 -66 -74 -92 -56 -100 C-62 -70 -60 -40 -54 -18 Z"/>
      <path d="M100 -18 C96 -66 74 -92 56 -100 C62 -70 60 -40 54 -18 Z"/>
      <path d="M-62 -18 C-60 -80 -42 -116 -24 -128 C-30 -92 -30 -48 -26 -18 Z"/>
      <path d="M62 -18 C60 -80 42 -116 24 -128 C30 -92 30 -48 26 -18 Z"/>
      <path d="M-30 -18 C-30 -92 -14 -142 0 -158 C14 -142 30 -92 30 -18 Z"/>
    </g>`,

  /* ---- Golden Temple, Amritsar -------------------------------------- */
  golden: `
    <rect x="-96" y="-20" width="192" height="20"/>
    <rect x="-64" y="-88" width="128" height="68"/>
    <g fill="var(--sky-cut)">
      <path d="M-42 -20 v-34 a13 13 0 0 1 26 0 v34 Z"/>
      <path d="M16 -20 v-34 a13 13 0 0 1 26 0 v34 Z"/>
    </g>
    <rect x="-70" y="-100" width="140" height="12" rx="2"/>
    <path d="M-34 -100 C-34 -134 -18 -150 0 -150 C18 -150 34 -134 34 -100 Z"/>
    <path d="M-3 -150 h6 v-12 a3 3 0 0 0 -6 0 Z"/>
    <rect x="-1.4" y="-176" width="2.8" height="15" rx="1.4"/>
    <g>
      <path d="M-64 -100 C-64 -118 -56 -128 -48 -128 C-40 -128 -32 -118 -32 -100 Z"/>
      <path d="M32 -100 C32 -118 40 -128 48 -128 C56 -128 64 -118 64 -100 Z"/>
    </g>`,

  /* ---- Meenakshi Temple gopuram, Madurai ---------------------------- */
  gopuram: `
    <rect x="-72" y="-34" width="144" height="34"/>
    <path d="M-66 -34 L-58 -74 L58 -74 L66 -34 Z"/>
    <path d="M-56 -74 L-49 -112 L49 -112 L56 -74 Z"/>
    <path d="M-47 -112 L-41 -148 L41 -148 L47 -112 Z"/>
    <path d="M-39 -148 L-34 -180 L34 -180 L39 -148 Z"/>
    <path d="M-32 -180 L-28 -208 L28 -208 L32 -208 L32 -208 Z"/>
    <path d="M-32 -180 L-28 -208 L28 -208 L32 -180 Z"/>
    <g fill="var(--sky-cut)">
      <rect x="-52" y="-68" width="104" height="4"/>
      <rect x="-44" y="-106" width="88" height="4"/>
      <rect x="-36" y="-142" width="72" height="4"/>
      <rect x="-14" y="-30" width="28" height="30" rx="14"/>
    </g>
    <g>
      <path d="M-28 -208 h8 v-13 a4 4 0 0 0 -8 0 Z"/>
      <path d="M-4 -208 h8 v-15 a4 4 0 0 0 -8 0 Z"/>
      <path d="M20 -208 h8 v-13 a4 4 0 0 0 -8 0 Z"/>
    </g>`,

  /* ---- Gateway of India, Mumbai ------------------------------------- */
  gateway: `
    <rect x="-92" y="-18" width="184" height="18"/>
    <rect x="-70" y="-140" width="140" height="122"/>
    <path d="M-34 -18 v-66 a34 34 0 0 1 68 0 v66 Z" fill="var(--sky-cut)"/>
    <rect x="-78" y="-152" width="156" height="14" rx="3"/>
    <path d="M-30 -152 C-30 -184 -14 -198 0 -198 C14 -198 30 -184 30 -152 Z"/>
    <rect x="-1.4" y="-216" width="2.8" height="20" rx="1.4"/>
    <g>
      <rect x="-96" y="-104" width="20" height="86"/>
      <path d="M-96 -104 h20 v-14 a10 10 0 0 0 -20 0 Z"/>
      <rect x="76" y="-104" width="20" height="86"/>
      <path d="M76 -104 h20 v-14 a10 10 0 0 0 -20 0 Z"/>
    </g>`,

  /* ---- Rashtrapati Bhavan, New Delhi -------------------------------- */
  rashtrapati: `
    <rect x="-160" y="-58" width="320" height="58"/>
    <g fill="var(--sky-cut)">
      <rect x="-146" y="-48" width="11" height="38"/><rect x="-122" y="-48" width="11" height="38"/>
      <rect x="-98" y="-48" width="11" height="38"/><rect x="98" y="-48" width="11" height="38"/>
      <rect x="122" y="-48" width="11" height="38"/><rect x="146" y="-48" width="11" height="38"/>
    </g>
    <rect x="-74" y="-92" width="148" height="34"/>
    <g fill="var(--sky-cut)">
      <rect x="-60" y="-86" width="10" height="24"/><rect x="-38" y="-86" width="10" height="24"/>
      <rect x="-16" y="-86" width="10" height="24"/><rect x="6" y="-86" width="10" height="24"/>
      <rect x="28" y="-86" width="10" height="24"/><rect x="50" y="-86" width="10" height="24"/>
    </g>
    <rect x="-56" y="-104" width="112" height="12" rx="2"/>
    <path d="M-44 -104 C-44 -152 -22 -172 0 -172 C22 -172 44 -152 44 -104 Z"/>
    <rect x="-1.6" y="-190" width="3.2" height="20" rx="1.6"/>`,

  /* ---- Howrah Bridge, Kolkata --------------------------------------- */
  howrah: `
    <rect x="-190" y="-26" width="380" height="12"/>
    <g stroke="var(--sky-ink)" stroke-width="6" fill="none" stroke-linejoin="round">
      <path d="M-150 -26 v-108 h300 v108"/>
      <path d="M-150 -134 L-70 -26 M-70 -134 L-150 -26 M-70 -134 L10 -26 M10 -134 L-70 -26
               M10 -134 L90 -26 M90 -134 L10 -26 M90 -134 L150 -26 M150 -134 L90 -26"/>
      <path d="M-190 -26 L-150 -84 M190 -26 L150 -84"/>
    </g>
    <rect x="-156" y="-152" width="14" height="24"/>
    <rect x="142" y="-152" width="14" height="24"/>`,

  /* ---- Statue of Unity, Gujarat ------------------------------------- */
  unity: `
    <rect x="-52" y="-42" width="104" height="42"/>
    <rect x="-38" y="-64" width="76" height="22"/>
    <path d="M-20 -64 C-20 -96 -16 -120 -12 -142 L12 -142 C16 -120 20 -96 20 -64 Z"/>
    <path d="M-12 -142 C-12 -158 -8 -168 0 -168 C8 -168 12 -158 12 -142 Z"/>
    <circle cx="0" cy="-182" r="12"/>
    <path d="M-20 -132 L-30 -96 L-23 -94 L-13 -128 Z"/>
    <path d="M20 -132 L30 -96 L23 -94 L13 -128 Z"/>`,

  /* ---- Vidhana Soudha, Bengaluru ------------------------------------ */
  vidhana: `
    <rect x="-120" y="-52" width="240" height="52"/>
    <g fill="var(--sky-cut)">
      <rect x="-106" y="-44" width="10" height="34"/><rect x="-84" y="-44" width="10" height="34"/>
      <rect x="-62" y="-44" width="10" height="34"/><rect x="52" y="-44" width="10" height="34"/>
      <rect x="74" y="-44" width="10" height="34"/><rect x="96" y="-44" width="10" height="34"/>
    </g>
    <rect x="-56" y="-84" width="112" height="32"/>
    <g fill="var(--sky-cut)">
      <rect x="-44" y="-78" width="9" height="22"/><rect x="-24" y="-78" width="9" height="22"/>
      <rect x="-4" y="-78" width="9" height="22"/><rect x="16" y="-78" width="9" height="22"/>
      <rect x="36" y="-78" width="9" height="22"/>
    </g>
    <rect x="-42" y="-94" width="84" height="10" rx="2"/>
    <path d="M-32 -94 C-32 -130 -16 -146 0 -146 C16 -146 32 -130 32 -94 Z"/>
    <path d="M-2.6 -146 h5.2 v-11 a2.6 2.6 0 0 0 -5.2 0 Z"/>
    <rect x="-1.3" y="-170" width="2.6" height="14" rx="1.3"/>`,

  /* ---- Mysore Palace domes (filler with character) ------------------- */
  mysore: `
    <rect x="-88" y="-46" width="176" height="46"/>
    <g fill="var(--sky-cut)">
      <path d="M-64 0 v-26 a11 11 0 0 1 22 0 v26 Z"/>
      <path d="M-11 0 v-26 a11 11 0 0 1 22 0 v26 Z"/>
      <path d="M42 0 v-26 a11 11 0 0 1 22 0 v26 Z"/>
    </g>
    <rect x="-70" y="-58" width="140" height="12" rx="2"/>
    <path d="M-26 -58 C-26 -88 -13 -102 0 -102 C13 -102 26 -88 26 -58 Z"/>
    <rect x="-1.2" y="-120" width="2.4" height="20" rx="1.2"/>
    <path d="M-62 -58 C-62 -74 -55 -82 -48 -82 C-41 -82 -34 -74 -34 -58 Z"/>
    <path d="M34 -58 C34 -74 41 -82 48 -82 C55 -82 62 -74 62 -58 Z"/>`,

  /* ---- generic city block, used to fill the extreme edges ----------- */
  block(w, h, windows = true) {
    let s = `<rect x="${-w / 2}" y="${-h}" width="${w}" height="${h}"/>`;
    if (windows) {
      s += '<g fill="var(--sky-cut)">';
      for (let y = -h + 12; y < -10; y += 20) {
        for (let x = -w / 2 + 8; x < w / 2 - 10; x += 18) {
          s += `<rect x="${x}" y="${y}" width="8" height="10" rx="1.5"/>`;
        }
      }
      s += '</g>';
    }
    return s;
  }
};

/* Placement across the full 2400 width. `far` monuments sit slightly smaller
   and drift the opposite way on scroll, which reads as depth. */
const PLACEMENT = [
  { x: 40,   s: 0.62, m: M.block(90, 118),  layer: 'far'  },
  { x: 140,  s: 0.70, m: M.block(64, 86),   layer: 'far'  },
  { x: 232,  s: 0.90, m: M.qutub,           layer: 'near' },
  { x: 386,  s: 0.74, m: M.mysore,          layer: 'far'  },
  { x: 556,  s: 0.86, m: M.charminar,       layer: 'near' },
  { x: 742,  s: 0.80, m: M.hawamahal,       layer: 'far'  },
  { x: 962,  s: 0.94, m: M.taj,             layer: 'near' },
  { x: 1178, s: 0.82, m: M.sanchi,          layer: 'far'  },
  { x: 1330, s: 0.86, m: M.indiagate,       layer: 'near' },
  { x: 1494, s: 0.80, m: M.lotus,           layer: 'far'  },
  { x: 1652, s: 0.84, m: M.golden,          layer: 'near' },
  { x: 1806, s: 0.78, m: M.konark,          layer: 'far'  },
  { x: 1940, s: 0.82, m: M.gopuram,         layer: 'near' },
  { x: 2088, s: 0.66, m: M.vidhana,         layer: 'far'  },
  { x: 2214, s: 0.74, m: M.gateway,         layer: 'near' },
  { x: 2344, s: 0.60, m: M.block(78, 104),  layer: 'far'  }
];

/* A second, wider composition used on the home hero where there is more
   vertical room — includes Howrah Bridge, Rashtrapati Bhavan and the
   Statue of Unity. */
const PLACEMENT_WIDE = [
  { x: 30,   s: 0.58, m: M.block(84, 112),      layer: 'far'  },
  { x: 122,  s: 0.66, m: M.block(60, 80),       layer: 'far'  },
  { x: 210,  s: 0.86, m: M.qutub,               layer: 'near' },
  { x: 330,  s: 0.68, m: M.mysore,              layer: 'far'  },
  { x: 486,  s: 0.80, m: M.charminar,           layer: 'near' },
  { x: 648,  s: 0.72, m: M.hawamahal,           layer: 'far'  },
  { x: 830,  s: 0.62, m: M.unity,               layer: 'far'  },
  { x: 970,  s: 0.90, m: M.taj,                 layer: 'near' },
  { x: 1180, s: 0.74, m: M.sanchi,              layer: 'far'  },
  { x: 1320, s: 0.80, m: M.indiagate,           layer: 'near' },
  { x: 1466, s: 0.70, m: M.lotus,               layer: 'far'  },
  { x: 1606, s: 0.78, m: M.golden,              layer: 'near' },
  { x: 1746, s: 0.66, m: M.konark,              layer: 'far'  },
  { x: 1872, s: 0.76, m: M.gopuram,             layer: 'near' },
  { x: 2010, s: 0.58, m: M.rashtrapati,         layer: 'far'  },
  { x: 2180, s: 0.52, m: M.howrah,              layer: 'far'  },
  { x: 2330, s: 0.66, m: M.gateway,             layer: 'near' }
];

function render(list) {
  const far = list.filter(p => p.layer === 'far');
  const near = list.filter(p => p.layer === 'near');
  const group = items => items.map(p =>
    `<g transform="translate(${p.x},${GROUND}) scale(${p.s})">${p.m}</g>`
  ).join('');

  return `
<svg viewBox="0 0 2400 300" preserveAspectRatio="xMidYMax slice" role="img"
     aria-label="Silhouettes of Indian monuments including the Qutub Minar, Charminar, Hawa Mahal, Taj Mahal, India Gate, Sanchi Stupa, Lotus Temple, Golden Temple, Konark wheel, Meenakshi gopuram and the Gateway of India">
  <defs>
    <linearGradient id="skygrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="var(--sky-top)"/>
      <stop offset="100%" stop-color="var(--sky-bottom)"/>
    </linearGradient>
  </defs>
  <g fill="url(#skygrad)" style="--sky-ink:var(--sky-top)">
    <g class="layer-far" opacity=".55">${group(far)}</g>
    <g class="layer-near">${group(near)}</g>
  </g>
</svg>`;
}

/**
 * Mounts the skyline into every `.skyline` element on the page.
 * `data-variant="wide"` selects the taller hero composition.
 */
export function mountSkyline() {
  document.querySelectorAll('.skyline').forEach(el => {
    const wide = el.dataset.variant === 'wide';
    el.innerHTML = render(wide ? PLACEMENT_WIDE : PLACEMENT);
  });

  /* gentle horizontal parallax as the hero scrolls away */
  const layers = document.querySelectorAll('.skyline');
  if (!layers.length) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  let ticking = false;
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const shift = Math.min(window.scrollY / 600, 1);
      layers.forEach(l => l.style.setProperty('--sky-shift', shift.toFixed(3)));
      ticking = false;
    });
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}
