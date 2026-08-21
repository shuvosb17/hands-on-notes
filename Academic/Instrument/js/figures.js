(function () {
  const ink = "#e8e8e8";
  const mute = "#9a9a9a";
  const line = "#8a8a8a";
  const fill = "#2a2a2a";
  const accent = "#81a1c1";

  function box(x, y, w, h, label, stroke) {
    return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="4" fill="${fill}" stroke="${stroke || line}"/>
      <text x="${x + w / 2}" y="${y + h / 2 + 4}" text-anchor="middle" fill="${ink}" font-size="11" font-family="ui-sans-serif,system-ui">${label}</text>`;
  }
  function arrow(x1, y1, x2, y2) {
    return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${accent}" stroke-width="1.5"/>
      <polygon points="${x2},${y2} ${x2 - 7},${y2 - 4} ${x2 - 7},${y2 + 4}" fill="${accent}"/>`;
  }
  function wrap(inner, h, caption) {
    return `<div class="fig"><svg viewBox="0 0 520 ${h}" role="img" aria-label="${caption}">${inner}</svg><small>${caption}</small></div>`;
  }

  const FIGS = {
    transducer: () => wrap(
      box(20, 58, 130, 48, "Physical qty") + arrow(158, 82, 188, 82) +
      box(196, 50, 130, 64, "Transducer", accent) + arrow(334, 82, 364, 82) +
      box(372, 58, 130, 48, "Electrical signal"),
      168, "Fig. Physical quantity → transducer → electrical signal"),
    primary: () => wrap(
      `<text x="20" y="28" fill="${mute}" font-size="11">Pressure</text>` +
      box(20, 44, 110, 70, "Diaphragm") +
      `<text x="75" y="132" text-anchor="middle" fill="${mute}" font-size="10">PRIMARY</text>` +
      arrow(138, 78, 178, 78) + box(186, 44, 130, 70, "Strain gauge", accent) +
      `<text x="251" y="132" text-anchor="middle" fill="${mute}" font-size="10">SECONDARY</text>` +
      arrow(324, 78, 364, 78) + box(372, 52, 128, 54, "Electrical out"),
      168, "Fig. Primary senses · Secondary converts"),
    rtd: () => wrap(
      `<rect x="40" y="36" width="36" height="90" rx="4" fill="${fill}" stroke="${line}"/>
       <rect x="46" y="78" width="24" height="42" rx="2" fill="${accent}" opacity="0.45"/>
       <text x="58" y="142" text-anchor="middle" fill="${mute}" font-size="10">Heat</text>` +
      arrow(88, 80, 128, 80) +
      `<rect x="136" y="40" width="160" height="80" rx="4" fill="${fill}" stroke="${line}"/>
       <path d="M156 80 h18 l6-14 6 28 6-28 6 28 6-28 6 28 6-14 h18" fill="none" stroke="${accent}" stroke-width="2"/>
       <text x="216" y="136" text-anchor="middle" fill="${mute}" font-size="10">Platinum coil</text>` +
      arrow(304, 80, 344, 80) +
      `<text x="360" y="76" fill="${ink}" font-size="14">T ↑  →  R ↑</text>
       <text x="360" y="98" fill="${mute}" font-size="11">PTC</text>`,
      168, "Fig. RTD: heat the metal → resistance rises (PTC)"),
    pressure: () => wrap(
      `<rect x="210" y="18" width="80" height="28" rx="3" fill="${fill}" stroke="${line}"/>
       <text x="250" y="37" text-anchor="middle" fill="${ink}" font-size="12">Force F</text>
       <rect x="242" y="46" width="16" height="70" fill="${accent}"/>
       <polygon points="242,116 258,116 250,148" fill="${accent}"/>
       <line x1="80" y1="150" x2="440" y2="150" stroke="${line}"/>
       <text x="280" y="80" fill="${ink}" font-size="14">P = F / A</text>`,
      168, "Fig. P = F / A  · same force, smaller area → bigger pressure"),
    "pressure-types": () => wrap(
      `<line x1="48" y1="20" x2="48" y2="160" stroke="${line}"/>
       <text x="20" y="24" fill="${mute}" font-size="10">P</text>
       <rect x="70" y="28" width="70" height="132" fill="${fill}" stroke="${accent}"/>
       <text x="105" y="96" text-anchor="middle" fill="${ink}" font-size="10">Abs</text>
       <rect x="170" y="70" width="70" height="90" fill="${fill}" stroke="${line}"/>
       <text x="205" y="118" text-anchor="middle" fill="${ink}" font-size="10">Atm</text>
       <rect x="270" y="70" width="70" height="50" fill="${accent}" opacity="0.35" stroke="${accent}"/>
       <text x="305" y="98" text-anchor="middle" fill="${ink}" font-size="10">Gauge</text>
       <line x1="48" y1="160" x2="400" y2="160" stroke="${line}"/>
       <text x="48" y="176" fill="${mute}" font-size="10">Vacuum = 0</text>`,
      188, "Fig. Absolute from vacuum 0 · Gauge from atmosphere"),
    "diff-p": () => wrap(
      `<text x="40" y="50" fill="${ink}" font-size="12">P1</text>` +
      `<line x1="70" y1="46" x2="170" y2="70" stroke="${accent}" stroke-width="1.5"/>` +
      box(178, 54, 140, 56, "Sensor") +
      `<line x1="70" y1="120" x2="170" y2="96" stroke="${line}" stroke-width="1.5"/>
       <text x="40" y="126" fill="${ink}" font-size="12">P2</text>` +
      arrow(326, 82, 380, 82) +
      `<text x="390" y="86" fill="${ink}" font-size="12">P1 − P2</text>`,
      168, "Fig. Differential: output = P1 − P2"),
    emech: () => wrap(
      box(16, 56, 90, 52, "Pressure") + arrow(112, 82, 142, 82) +
      `<path d="M150 50 Q 210 110 270 50" fill="none" stroke="${accent}" stroke-width="2"/>
       <text x="210" y="128" text-anchor="middle" fill="${mute}" font-size="10">Diaphragm</text>` +
      arrow(278, 82, 308, 82) + box(316, 56, 100, 52, "Strain gauge") +
      arrow(422, 82, 450, 82) + `<text x="458" y="86" fill="${ink}" font-size="12">V</text>`,
      168, "Fig. Pressure → diaphragm bends → strain gauge → voltage"),
    strain: () => wrap(
      `<text x="24" y="36" fill="${mute}" font-size="11">Normal</text>
       <path d="M24 70 h20 l8-12 8 24 8-24 8 24 8-12 h16" fill="none" stroke="${line}" stroke-width="2"/>
       <text x="240" y="36" fill="${mute}" font-size="11">Stretched</text>
       <path d="M240 70 h28 l12-16 12 32 12-32 12 32 12-32 12 32 12-16 h28" fill="none" stroke="${accent}" stroke-width="2"/>
       <text x="24" y="130" fill="${ink}" font-size="12">R = ρ L / A</text>
       <text x="240" y="130" fill="${ink}" font-size="12">L ↑  A ↓  R ↑</text>`,
      168, "Fig. Stretch: longer, thinner → R increases"),
    cap: () => wrap(
      `<rect x="140" y="28" width="200" height="10" fill="${line}"/>
       <text x="240" y="22" text-anchor="middle" fill="${mute}" font-size="10">Fixed plate</text>
       <rect x="140" y="88" width="200" height="10" fill="${accent}"/>
       <text x="240" y="118" text-anchor="middle" fill="${mute}" font-size="10">Diaphragm</text>
       <line x1="352" y1="33" x2="352" y2="93" stroke="${accent}" stroke-dasharray="3 3"/>
       <text x="362" y="68" fill="${ink}" font-size="12">d</text>
       <text x="20" y="68" fill="${ink}" font-size="12">Pressure</text>` +
      arrow(90, 78, 130, 92),
      168, "Fig. C = εA / d  · pressure moves the diaphragm, d changes"),
    "cap-diff": () => wrap(
      `<rect x="80" y="24" width="160" height="8" fill="${line}"/>
       <rect x="80" y="78" width="160" height="8" fill="${accent}"/>
       <rect x="80" y="132" width="160" height="8" fill="${line}"/>
       <text x="280" y="50" fill="${ink}" font-size="12">C1</text>
       <text x="280" y="120" fill="${ink}" font-size="12">C2</text>
       <text x="280" y="86" fill="${mute}" font-size="11">diaphragm</text>
       <text x="360" y="86" fill="${ink}" font-size="12">C1 ↑  C2 ↓</text>`,
      168, "Fig. Differential: C1 increases, C2 decreases"),
    flow: () => wrap(
      `<rect x="40" y="48" width="440" height="70" rx="28" fill="${fill}" stroke="${line}"/>
       <polygon points="160,78 180,78 170,68" fill="${accent}"/>
       <polygon points="220,78 240,78 230,68" fill="${accent}"/>
       <polygon points="280,78 300,78 290,68" fill="${accent}"/>
       <text x="260" y="108" text-anchor="middle" fill="${mute}" font-size="10">fluid flow</text>
       <circle cx="90" cy="118" r="8" fill="${accent}"/>
       <circle cx="430" cy="48" r="8" fill="${line}"/>
       <path d="M98 110 Q 260 20 422 54" fill="none" stroke="${accent}" stroke-width="1.5"/>
       <text x="40" y="152" fill="${mute}" font-size="10">TX / RX</text>`,
      168, "Fig. Downstream is faster · upstream is slower · Δt → velocity"),
    level: () => wrap(
      `<rect x="180" y="16" width="140" height="150" fill="none" stroke="${line}"/>
       <rect x="182" y="110" width="136" height="54" fill="${accent}" opacity="0.25"/>
       <circle cx="250" cy="28" r="7" fill="${accent}"/>
       <line x1="250" y1="36" x2="250" y2="110" stroke="${accent}" stroke-dasharray="4 3"/>
       <text x="340" y="70" fill="${ink}" font-size="12">go + return</text>
       <text x="340" y="92" fill="${mute}" font-size="11">divide time by 2</text>
       <text x="250" y="180" text-anchor="middle" fill="${mute}" font-size="10">liquid</text>`,
      188, "Fig. Ping the surface, time the echo. d = v t / 2"),
    condition: () => wrap(
      box(16, 58, 90, 48, "Sensor") + arrow(112, 82, 140, 82) +
      box(148, 50, 160, 64, "Conditioning", accent) + arrow(316, 82, 346, 82) +
      box(354, 58, 90, 48, "ADC") +
      `<text x="148" y="132" fill="${mute}" font-size="10">amplify · filter · isolate · convert</text>`,
      168, "Fig. Raw sensor signal is cleaned before the ADC"),
    amp: () => wrap(
      `<path d="M24 82 q 16 -16 32 0 q 16 16 32 0" fill="none" stroke="${line}" stroke-width="1.5"/>
       <text x="56" y="118" text-anchor="middle" fill="${mute}" font-size="10">small</text>
       <polygon points="140,40 140,124 220,82" fill="${fill}" stroke="${accent}"/>
       <text x="156" y="86" fill="${ink}" font-size="11">Amp</text>
       <path d="M240 82 q 24 -40 48 0 q 24 40 48 0 q 24 -40 48 0" fill="none" stroke="${accent}" stroke-width="1.8"/>
       <text x="360" y="140" text-anchor="middle" fill="${mute}" font-size="10">large</text>`,
      168, "Fig. Small signal in · large signal out"),
    z: () => wrap(
      box(16, 54, 100, 56, "Sensor") +
      `<text x="170" y="78" text-anchor="middle" fill="${ink}" font-size="11">High Zin</text>
       <polygon points="230,46 230,118 300,82" fill="${fill}" stroke="${accent}"/>
       <text x="360" y="78" fill="${ink}" font-size="11">Low Zout</text>` +
      box(420, 54, 80, 56, "Next"),
      168, "Fig. High Zin does not load the sensor · Low Zout drives the next stage"),
    opamp: () => wrap(
      `<text x="40" y="58" fill="${ink}" font-size="12">+</text>
       <text x="40" y="118" fill="${ink}" font-size="12">−</text>
       <line x1="58" y1="54" x2="140" y2="54" stroke="${line}"/>
       <line x1="58" y1="114" x2="140" y2="114" stroke="${line}"/>
       <polygon points="140,28 140,140 280,84" fill="${fill}" stroke="${accent}"/>
       <line x1="280" y1="84" x2="380" y2="84" stroke="${accent}" stroke-width="1.6"/>
       <text x="390" y="88" fill="${ink}" font-size="12">Vout</text>`,
      168, "Fig. Op-amp: two inputs, one output. Amplifies V+ − V−"),
    inamp: () => wrap(
      `<text x="16" y="58" fill="${ink}" font-size="12">Sensor +</text>
       <text x="16" y="118" fill="${ink}" font-size="12">Sensor −</text>
       <line x1="90" y1="54" x2="160" y2="54" stroke="${line}"/>
       <line x1="90" y1="114" x2="160" y2="114" stroke="${line}"/>` +
      box(168, 48, 180, 72, "In-amp", accent) + arrow(356, 84, 410, 84) +
      `<text x="418" y="88" fill="${ink}" font-size="12">Vout</text>`,
      168, "Fig. Instrumentation amp reads the difference between sensor + and −"),
    noise: () => wrap(
      `<path d="M20 84 C 80 40 140 128 200 84 S 320 40 380 84 S 480 128 510 84" fill="none" stroke="${line}" stroke-width="1.6"/>
       <path d="M20 84 L 40 70 60 96 80 68 100 100 120 72 140 98 160 74 180 102 200 70 220 100 240 76 260 104 280 72 300 98 320 68 340 100 360 74 380 96 400 70 420 102 440 76 460 98 480 72 510 90" fill="none" stroke="${accent}" stroke-width="1"/>
       <text x="20" y="140" fill="${mute}" font-size="11">clean wave</text>
       <text x="200" y="140" fill="${ink}" font-size="11">+ noise</text>`,
      168, "Fig. Desired signal plus unwanted noise"),
    adc: () => wrap(
      `<path d="M20 84 C 50 40 80 128 110 84 S 170 40 200 84" fill="none" stroke="${line}" stroke-width="1.6"/>` +
      box(220, 56, 90, 56, "ADC", accent) +
      `<text x="330" y="88" fill="${ink}" font-size="14" font-family="ui-monospace,monospace">101101</text>`,
      168, "Fig. Analog wave in · binary out"),
    "adc-steps": () => wrap(
      box(12, 56, 110, 52, "Analog") + arrow(128, 82, 150, 82) +
      box(158, 56, 100, 52, "Sampling", accent) + arrow(264, 82, 286, 82) +
      box(294, 56, 110, 52, "Quantize", accent) + arrow(410, 82, 430, 82) +
      box(438, 56, 70, 52, "Bits"),
      168, "Fig. Three steps: Sample → Quantize → Encode"),
    sample: () => wrap(
      `<path d="M20 84 C 80 28 140 140 200 84 S 320 28 380 84 S 480 140 510 84" fill="none" stroke="${line}" stroke-width="1.4"/>
       <circle cx="70" cy="52" r="4" fill="${accent}"/>
       <circle cx="140" cy="112" r="4" fill="${accent}"/>
       <circle cx="210" cy="70" r="4" fill="${accent}"/>
       <circle cx="280" cy="48" r="4" fill="${accent}"/>
       <circle cx="350" cy="108" r="4" fill="${accent}"/>
       <circle cx="420" cy="72" r="4" fill="${accent}"/>`,
      168, "Fig. Sampling = snapshots of the wave at regular times"),
    nyquist: () => wrap(
      `<text x="24" y="50" fill="${ink}" font-size="16">fs ≥ 2 fmax</text>
       <text x="24" y="84" fill="${mute}" font-size="12">If fmax = 5 kHz, sample at ≥ 10 kHz</text>
       <text x="24" y="118" fill="${mute}" font-size="12">Too slow → aliasing</text>`,
      168, "Fig. Sample at least twice the highest frequency: fs ≥ 2 fmax"),
    alias: () => wrap(
      `<path d="M20 84 C 50 20 80 148 110 84 S 170 20 200 84 S 260 148 290 84 S 350 20 380 84 S 440 148 470 84" fill="none" stroke="${line}" stroke-width="1.2"/>
       <circle cx="70" cy="48" r="5" fill="${accent}"/>
       <circle cx="200" cy="84" r="5" fill="${accent}"/>
       <circle cx="330" cy="48" r="5" fill="${accent}"/>
       <circle cx="460" cy="84" r="5" fill="${accent}"/>
       <path d="M70 48 Q 200 140 330 48 T 460 84" fill="none" stroke="${accent}" stroke-width="1.6"/>`,
      168, "Fig. Too few samples make a fast wave look slow — that lie is aliasing"),
    quant: () => wrap(
      [0, 1, 2, 3].map((lvl) =>
        `<line x1="40" y1="${140 - lvl * 32}" x2="280" y2="${140 - lvl * 32}" stroke="${line}"/>
         <text x="16" y="${144 - lvl * 32}" fill="${mute}" font-size="10">${lvl} V</text>`
      ).join("") +
      `<circle cx="180" cy="${140 - 2.3 * 32}" r="5" fill="${accent}"/>
       <text x="300" y="70" fill="${ink}" font-size="12">2.3 V → 2 V</text>
       <text x="300" y="92" fill="${mute}" font-size="11">quantization error</text>`,
      168, "Fig. 2.3 V is rounded to the nearest allowed step"),
    encode: () => wrap(
      ["00", "01", "10", "11"].map((b, i) =>
        `<rect x="${24 + i * 120}" y="50" width="100" height="56" rx="4" fill="${fill}" stroke="${i === 2 ? accent : line}"/>
         <text x="${74 + i * 120}" y="74" text-anchor="middle" fill="${mute}" font-size="10">Level ${i}</text>
         <text x="${74 + i * 120}" y="94" text-anchor="middle" fill="${ink}" font-size="14" font-family="ui-monospace,monospace">${b}</text>`
      ).join(""),
      168, "Fig. 2-bit ADC: 4 levels named 00, 01, 10, 11")
  };

  window.examFigure = function (kind) {
    return FIGS[kind] ? FIGS[kind]() : "";
  };
})();
