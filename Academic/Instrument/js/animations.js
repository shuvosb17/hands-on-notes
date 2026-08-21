window.Anim = (function () {
  const { useState, useEffect, useRef } = React;

  function Stage({ title, children, controls }) {
    return (
      <div className="stage">
        <div className="stage-top"><span className="dot"></span> Live animation · {title}</div>
        <div className="stage-body">{children}</div>
        {controls ? <div className="ctrl">{controls}</div> : null}
      </div>
    );
  }

  function Slider({ label, min, max, step, value, onChange, fmt }) {
    return (
      <>
        <label>{label}</label>
        <input type="range" min={min} max={max} step={step || 1} value={value}
          onChange={(e) => onChange(Number(e.target.value))} />
        <span className="val">{fmt ? fmt(value) : value}</span>
      </>
    );
  }

  /* ---------- 1. Transducer ---------- */
  function Transducer() {
    const [t, setT] = useState(40);
    return (
      <Stage title="Physical quantity → electrical signal" controls={
        <Slider label="Temperature" min={0} max={100} value={t} onChange={setT} fmt={(v) => v + " °C"} />
      }>
        <svg viewBox="0 0 720 210">
          <defs>
            <linearGradient id="g1" x1="0" x2="1"><stop offset="0" stopColor="#54e6ff"/><stop offset="1" stopColor="#a97bff"/></linearGradient>
          </defs>
          <rect x="20" y="55" rx="16" width="150" height="90" fill="#12182c" stroke="#54e6ff55"/>
          <text x="95" y="92" textAnchor="middle" fill="#e8edff" fontSize="13" fontWeight="700">Heat / Force</text>
          <text x="95" y="114" textAnchor="middle" className="svg-val">{t} °C</text>
          <text x="200" y="95" fill="#54e6ff" fontSize="28">→</text>
          <rect x="230" y="45" rx="18" width="180" height="110" fill="url(#g1)" opacity=".18" stroke="#54e6ff"/>
          <text x="320" y="88" textAnchor="middle" fill="#54e6ff" fontSize="14" fontWeight="700">TRANSDUCER</text>
          <text x="320" y="112" textAnchor="middle" fill="#9aa6c7" fontSize="11">converts energy</text>
          <rect x="268" y="128" width="104" height="10" rx="5" fill="#1a2238"/>
          <rect x="268" y="128" width={t * 1.04} height="10" rx="5" fill="#54e6ff"/>
          <text x="430" y="95" fill="#54e6ff" fontSize="28">→</text>
          <rect x="470" y="55" rx="16" width="220" height="90" fill="#12182c" stroke="#7dffb255"/>
          <text x="580" y="90" textAnchor="middle" fill="#7dffb2" fontSize="13" fontWeight="700">Electrical signal</text>
          <text x="580" y="118" textAnchor="middle" className="svg-val">{(100 + t * 0.385).toFixed(1)} Ω</text>
        </svg>
      </Stage>
    );
  }

  /* ---------- 2. Primary / Secondary ---------- */
  function PrimarySecondary() {
    const [p, setP] = useState(40);
    const bend = 18 + p * 0.22;
    return (
      <Stage title="Primary feels it · Secondary converts it" controls={
        <Slider label="Pressure" min={0} max={100} value={p} onChange={setP} fmt={(v) => v + " %"} />
      }>
        <svg viewBox="0 0 720 230">
          <text x="80" y="28" fill="#9aa6c7" fontSize="11">PRESSURE</text>
          <rect x="40" y="40" width="18" height="140" rx="6" fill="#1a2238"/>
          <rect x="40" y={180 - p * 1.4} width="18" height={p * 1.4} rx="6" fill="#ffcf5c"/>
          <path d={`M90 70 Q 160 ${70 + bend} 230 70`} fill="none" stroke="#54e6ff" strokeWidth="4"/>
          <text x="160" y="58" textAnchor="middle" fill="#54e6ff" fontSize="12">PRIMARY · diaphragm</text>
          <rect x="250" y="88" width="160" height="70" rx="14" fill="#12182c" stroke="#a97bff"/>
          <text x="330" y="118" textAnchor="middle" fill="#a97bff" fontSize="12" fontWeight="700">SECONDARY</text>
          <text x="330" y="138" textAnchor="middle" fill="#9aa6c7" fontSize="11">strain gauge</text>
          <text x="430" y="128" fill="#7dffb2" fontSize="22">→</text>
          <text x="520" y="122" fill="#7dffb2" fontSize="16" fontWeight="700">{(p * 0.08).toFixed(2)} V</text>
          <text x="520" y="144" fill="#9aa6c7" fontSize="11">electrical output</text>
        </svg>
      </Stage>
    );
  }

  /* ---------- 3. RTD ---------- */
  function Rtd() {
    const [t, setT] = useState(25);
    const R0 = 100, alpha = 0.00385;
    const R = R0 * (1 + alpha * t);
    const h = 40 + t * 1.1;
    return (
      <Stage title="RTD · PTC: temperature up, resistance up" controls={
        <Slider label="Temperature" min={0} max={150} value={t} onChange={setT} fmt={(v) => v + " °C"} />
      }>
        <svg viewBox="0 0 720 240">
          <rect x="40" y="40" width="90" height="160" rx="12" fill="#1a2238" stroke="#ff7a9055"/>
          <rect x="48" y={192 - h} width="74" height={h} rx="8" fill="#ff7a90" opacity=".85"/>
          <text x="85" y="30" textAnchor="middle" fill="#ff7a90" fontSize="12">HEAT</text>
          <text x="85" y="220" textAnchor="middle" className="svg-val">{t}°C</text>
          <text x="150" y="120" fill="#54e6ff" fontSize="26">→</text>
          <rect x="190" y="70" width="220" height="100" rx="16" fill="#12182c" stroke="#54e6ff"/>
          <text x="300" y="100" textAnchor="middle" fill="#e8edff" fontSize="13">Platinum RTD coil</text>
          <path d="M210 130 h20 l8-12 8 24 8-24 8 24 8-24 8 24 8-12 h20" fill="none" stroke="#54e6ff" strokeWidth="3"
            strokeDasharray="6 4" style={{ animation: "slide 1.4s linear infinite" }}/>
          <text x="300" y="155" textAnchor="middle" fill="#9aa6c7" fontSize="11">PTC metal</text>
          <text x="430" y="120" fill="#7dffb2" fontSize="26">→</text>
          <text x="520" y="108" fill="#7dffb2" fontSize="22" fontWeight="800">{R.toFixed(2)} Ω</text>
          <text x="520" y="132" fill="#9aa6c7" fontSize="12">R = R0 (1 + αT)</text>
          <text x="520" y="154" fill="#ffcf5c" fontSize="12">T ↑  ⇒  R ↑</text>
        </svg>
      </Stage>
    );
  }

  function RtdMaterial() {
    return (
      <Stage title="Industrial RTD material — HSS">
        <svg viewBox="0 0 720 180">
          {[["High α", "Predictable change", "#54e6ff"], ["Stable R–T", "Same reading always", "#7dffb2"], ["Strong", "Chem + mechanical", "#ffcf5c"]].map((c, i) => (
            <g key={c[0]} transform={`translate(${50 + i * 230},40)`}>
              <rect width="200" height="100" rx="16" fill="#12182c" stroke={c[2]}/>
              <text x="100" y="48" textAnchor="middle" fill={c[2]} fontSize="18" fontWeight="700">{c[0]}</text>
              <text x="100" y="74" textAnchor="middle" fill="#9aa6c7" fontSize="12">{c[1]}</text>
            </g>
          ))}
        </svg>
      </Stage>
    );
  }

  function Thermistor() {
    const [t, setT] = useState(25);
    const rtd = 100 * (1 + 0.00385 * t);
    const therm = 10000 * Math.exp(3500 * (1 / (t + 273) - 1 / 298));
    return (
      <Stage title="Thermistor vs metal RTD" controls={
        <Slider label="Temperature" min={0} max={80} value={t} onChange={setT} fmt={(v) => v + " °C"} />
      }>
        <svg viewBox="0 0 720 220">
          <rect x="40" y="40" width="300" height="140" rx="16" fill="#12182c" stroke="#a97bff"/>
          <text x="190" y="72" textAnchor="middle" fill="#a97bff" fontSize="14" fontWeight="700">Thermistor (NTC)</text>
          <text x="190" y="108" textAnchor="middle" className="svg-val">{therm.toFixed(0)} Ω</text>
          <text x="190" y="132" textAnchor="middle" fill="#9aa6c7" fontSize="12">Tiny · super sensitive</text>
          <text x="190" y="154" textAnchor="middle" fill="#ffcf5c" fontSize="11">T ↑  usually R ↓</text>
          <rect x="380" y="40" width="300" height="140" rx="16" fill="#12182c" stroke="#54e6ff"/>
          <text x="530" y="72" textAnchor="middle" fill="#54e6ff" fontSize="14" fontWeight="700">Metal RTD (PTC)</text>
          <text x="530" y="108" textAnchor="middle" className="svg-val">{rtd.toFixed(1)} Ω</text>
          <text x="530" y="132" textAnchor="middle" fill="#9aa6c7" fontSize="12">Larger · more linear</text>
          <text x="530" y="154" textAnchor="middle" fill="#7dffb2" fontSize="11">T ↑  R ↑</text>
        </svg>
      </Stage>
    );
  }

  /* ---------- Pressure ---------- */
  function Pressure() {
    const [f, setF] = useState(50);
    const [a, setA] = useState(20);
    const P = f / Math.max(a, 1);
    const nailW = 8 + a * 0.9;
    return (
      <Stage title="P = F / A  · same force, smaller area → bigger pressure" controls={
        <>
          <Slider label="Force F" min={10} max={100} value={f} onChange={setF} fmt={(v) => v + " N"} />
          <Slider label="Area A" min={4} max={80} value={a} onChange={setA} fmt={(v) => v + " cm²"} />
        </>
      }>
        <svg viewBox="0 0 720 230">
          <rect x="260" y="20" width="80" height="50" rx="8" fill="#a97bff55" stroke="#a97bff"/>
          <text x="300" y="50" textAnchor="middle" fill="#e8edff" fontSize="13">F = {f} N</text>
          <rect x={300 - nailW / 2} y="70" width={nailW} height="90" fill="#54e6ff"/>
          <polygon points={`${300 - nailW / 2},160 ${300 + nailW / 2},160 300,200`} fill="#54e6ff"/>
          <rect x="80" y="200" width="560" height="12" rx="4" fill="#1a2238"/>
          <text x="520" y="90" fill="#ffcf5c" fontSize="28" fontWeight="800">{P.toFixed(2)}</text>
          <text x="520" y="118" fill="#9aa6c7" fontSize="13">Pressure (relative)</text>
          <text x="520" y="142" fill="#7dffb2" fontSize="12">Sharp nail = tiny A = huge P</text>
        </svg>
      </Stage>
    );
  }

  function PressureTypes() {
    const [mode, setMode] = useState("abs");
    const atm = 101, gauge = 35;
    const abs = atm + gauge;
    return (
      <Stage title="AVG — Absolute / Gauge / Differential" controls={
        <>
          <button className={"btn" + (mode === "abs" ? " on" : "")} onClick={() => setMode("abs")}>Absolute</button>
          <button className={"btn" + (mode === "gauge" ? " on" : "")} onClick={() => setMode("gauge")}>Gauge</button>
          <button className={"btn" + (mode === "diff" ? " on" : "")} onClick={() => setMode("diff")}>Differential</button>
        </>
      }>
        <svg viewBox="0 0 720 250">
          <line x1="80" y1="220" x2="80" y2="30" stroke="#9aa6c755"/>
          <rect x="120" y={220 - abs * 1.1} width="70" height={abs * 1.1} rx="8" fill="#54e6ff55" stroke="#54e6ff"/>
          <text x="155" y="240" textAnchor="middle" fill="#54e6ff" fontSize="11">Absolute</text>
          <rect x="250" y={220 - atm * 1.1} width="70" height={atm * 1.1} rx="8" fill="#9aa6c733" stroke="#9aa6c7"/>
          <text x="285" y="240" textAnchor="middle" fill="#9aa6c7" fontSize="11">Atmosphere</text>
          <rect x="380" y={220 - gauge * 1.1} width="70" height={gauge * 1.1} rx="8" fill="#ffcf5c55" stroke="#ffcf5c"/>
          <text x="415" y="240" textAnchor="middle" fill="#ffcf5c" fontSize="11">Gauge</text>
          <rect x="510" y="90" width="70" height="80" rx="8" fill="#7dffb255" stroke="#7dffb2"/>
          <rect x="600" y="130" width="70" height="40" rx="8" fill="#a97bff55" stroke="#a97bff"/>
          <text x="545" y="80" textAnchor="middle" fill="#7dffb2" fontSize="11">P1</text>
          <text x="635" y="120" textAnchor="middle" fill="#a97bff" fontSize="11">P2</text>
          <text x="400" y="24" textAnchor="middle" fill="#e8edff" fontSize="14" fontWeight="700">
            {mode === "abs" ? "Absolute = from vacuum 0  ·  " + abs + " kPa"
              : mode === "gauge" ? "Gauge = from atmosphere  ·  " + gauge + " kPa"
              : "Differential = P1 − P2  ·  filter loss"}
          </text>
        </svg>
      </Stage>
    );
  }

  const AbsPressure = PressureTypes;
  const GaugePressure = PressureTypes;
  const DiffPressure = PressureTypes;

  /* ---------- Electro-mechanical ---------- */
  function Emech() {
    const [p, setP] = useState(45);
    const y = 70 + p * 0.5;
    return (
      <Stage title="Pressure → movement → electricity" controls={
        <Slider label="Pressure" min={0} max={100} value={p} onChange={setP} fmt={(v) => v + " kPa"} />
      }>
        <svg viewBox="0 0 720 240">
          <rect x="30" y="30" width="120" height="180" rx="10" fill="#1a2238" stroke="#ffcf5c55"/>
          <rect x="40" y={200 - p * 1.5} width="100" height={p * 1.5} rx="6" fill="#ffcf5c88"/>
          <text x="90" y="22" textAnchor="middle" fill="#ffcf5c" fontSize="11">PRESSURE</text>
          <path d={`M160 70 Q 230 ${y} 300 70`} fill="none" stroke="#54e6ff" strokeWidth="5"/>
          <text x="230" y="55" textAnchor="middle" fill="#54e6ff" fontSize="12">Diaphragm bends</text>
          <path d={`M310 ${90 + p * 0.15} h90`} stroke="#a97bff" strokeWidth="8" strokeLinecap="round"/>
          <text x="355" y="78" textAnchor="middle" fill="#a97bff" fontSize="11">strain gauge</text>
          <rect x="430" y="80" width="250" height="90" rx="14" fill="#12182c" stroke="#7dffb2"/>
          <text x="555" y="118" textAnchor="middle" fill="#7dffb2" fontSize="13">Electrical signal</text>
          <text x="555" y="148" textAnchor="middle" className="svg-val">{(p * 0.05).toFixed(2)} V</text>
        </svg>
      </Stage>
    );
  }

  function Diaphragm() {
    return <Emech />;
  }

  /* ---------- Strain gauge ---------- */
  function Strain() {
    const [s, setS] = useState(20);
    const L = 140 + s * 1.4;
    const R = 120 * (1 + s * 0.012);
    return (
      <Stage title="Stretch → longer, thinner → R increases" controls={
        <Slider label="Strain" min={0} max={80} value={s} onChange={setS} fmt={(v) => v + " % stretch"} />
      }>
        <svg viewBox="0 0 720 210">
          <text x="40" y="36" fill="#9aa6c7" fontSize="12">R = ρ L / A</text>
          <path d={`M80 110 ${zig(L)}`} fill="none" stroke="#54e6ff" strokeWidth="3"/>
          <circle cx="80" cy="110" r="8" fill="#ffcf5c"/>
          <circle cx={80 + L} cy="110" r="8" fill="#ffcf5c"/>
          <text x="360" y="50" fill="#e8edff" fontSize="14">Length {L.toFixed(0)}</text>
          <text x="360" y="170" fill="#7dffb2" fontSize="22" fontWeight="800">{R.toFixed(1)} Ω</text>
          <text x="360" y="194" fill="#9aa6c7" fontSize="12">Stretched: L ↑  A ↓  R ↑</text>
        </svg>
      </Stage>
    );
  }
  function zig(len) {
    const n = 10;
    const step = len / n;
    let d = "";
    for (let i = 0; i < n; i++) d += `l ${step / 2} ${i % 2 ? 22 : -22} `;
    return d;
  }

  /* ---------- Capacitive ---------- */
  function Cap() {
    const [p, setP] = useState(30);
    const d = 70 - p * 0.4;
    const C = (8.85 * 40 / Math.max(d, 8)).toFixed(2);
    return (
      <Stage title="C = εA / d  · pressure moves the plate" controls={
        <Slider label="Pressure" min={0} max={100} value={p} onChange={setP} fmt={(v) => v + " kPa"} />
      }>
        <svg viewBox="0 0 720 240">
          <rect x="180" y="40" width="280" height="14" rx="4" fill="#54e6ff"/>
          <text x="320" y="32" textAnchor="middle" fill="#54e6ff" fontSize="12">Fixed plate</text>
          <rect x="180" y={40 + d} width="280" height="14" rx="4" fill="#ffcf5c"/>
          <text x="320" y={74 + d} textAnchor="middle" fill="#ffcf5c" fontSize="12">Diaphragm (movable plate)</text>
          <line x1="470" y1="47" x2="470" y2={47 + d} stroke="#7dffb2" strokeDasharray="4 3"/>
          <text x="482" y={50 + d / 2} fill="#7dffb2" fontSize="12">d</text>
          <text x="40" y="120" fill="#e8edff" fontSize="13">Pressure {p}</text>
          <text x="520" y="110" fill="#a97bff" fontSize="26" fontWeight="800">C = {C}</text>
          <text x="520" y="138" fill="#9aa6c7" fontSize="12">relative pF</text>
        </svg>
      </Stage>
    );
  }

  function CapDiff() {
    const [p, setP] = useState(40);
    const c1 = 20 + p * 0.2, c2 = 40 - p * 0.2;
    return (
      <Stage title="Differential: C1 up, C2 down" controls={
        <Slider label="Pressure" min={0} max={100} value={p} onChange={setP} />
      }>
        <svg viewBox="0 0 720 210">
          <rect x="80" y="40" width="200" height="14" fill="#54e6ff"/>
          <rect x="80" y={90 + p * 0.4} width="200" height="14" fill="#ffcf5c"/>
          <rect x="80" y="170" width="200" height="14" fill="#54e6ff"/>
          <text x="180" y="30" textAnchor="middle" fill="#9aa6c7" fontSize="11">Fixed</text>
          <text x="400" y="90" fill="#7dffb2" fontSize="18">C1 = {c1.toFixed(1)}</text>
          <text x="400" y="130" fill="#ff7a90" fontSize="18">C2 = {c2.toFixed(1)}</text>
          <text x="400" y="168" fill="#ffcf5c" fontSize="13">One up · one down · more accurate</text>
        </svg>
      </Stage>
    );
  }

  /* ---------- Flowmeter ---------- */
  function Flowmeter() {
    const [v, setV] = useState(40);
    const tDown = 40 - v * 0.18, tUp = 40 + v * 0.18;
    return (
      <Stage title="Sound with the flow is fast · against is slow" controls={
        <Slider label="Flow speed" min={0} max={80} value={v} onChange={setV} fmt={(v) => v + " %"} />
      }>
        <svg viewBox="0 0 720 230">
          <rect x="80" y="70" width="560" height="90" rx="45" fill="#12182c" stroke="#54e6ff55"/>
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <polygon key={i} points={`${140 + i * 80 + v * 0.3},115 ${160 + i * 80 + v * 0.3},115 ${150 + i * 80 + v * 0.3},105`} fill="#54e6ff66"/>
          ))}
          <circle cx="140" cy="160" r="14" fill="#7dffb2"/>
          <circle cx="580" cy="70" r="14" fill="#ffcf5c"/>
          <text x="140" y="190" textAnchor="middle" fill="#7dffb2" fontSize="11">TX / RX</text>
          <text x="580" y="55" textAnchor="middle" fill="#ffcf5c" fontSize="11">TX / RX</text>
          <path d="M150 150 Q 360 40 570 80" fill="none" stroke="#7dffb2" strokeWidth="2" strokeDasharray="8 6">
            <animate attributeName="stroke-dashoffset" from="0" to="-40" dur="1.2s" repeatCount="indefinite"/>
          </path>
          <text x="360" y="210" textAnchor="middle" fill="#e8edff" fontSize="13">
            Downstream {tDown.toFixed(1)} µs · Upstream {tUp.toFixed(1)} µs · Δt = {(tUp - tDown).toFixed(1)} µs
          </text>
        </svg>
      </Stage>
    );
  }

  /* ---------- TOF / Level ---------- */
  function Tof() {
    const [level, setLevel] = useState(55);
    const gap = 160 - level * 1.1;
    const t = (gap / 80) * 2;
    const d = (340 * t) / 2;
    return (
      <Stage title="d = v t / 2  · ping the surface, time the echo" controls={
        <Slider label="Liquid level" min={10} max={90} value={level} onChange={setLevel} fmt={(v) => v + " %"} />
      }>
        <svg viewBox="0 0 720 260">
          <rect x="240" y="30" width="200" height="210" rx="8" fill="#12182c" stroke="#54e6ff55"/>
          <rect x="244" y={230 - level * 1.9} width="192" height={level * 1.9} fill="#54e6ff33"/>
          <circle cx="340" cy="48" r="12" fill="#ffcf5c"/>
          <line x1="340" y1="60" x2="340" y2={220 - level * 1.9} stroke="#ffcf5c" strokeDasharray="5 4">
            <animate attributeName="stroke-dashoffset" from="0" to="-18" dur=".8s" repeatCount="indefinite"/>
          </line>
          <text x="480" y="90" fill="#e8edff" fontSize="13">Round trip t = {t.toFixed(2)} ms</text>
          <text x="480" y="118" fill="#7dffb2" fontSize="18" fontWeight="700">d = {d.toFixed(1)} cm</text>
          <text x="480" y="144" fill="#9aa6c7" fontSize="12">÷ 2 because go + return</text>
        </svg>
      </Stage>
    );
  }
  const Level = Tof;

  /* ---------- Signal conditioning ---------- */
  function Conditioning() {
    const [on, setOn] = useState(true);
    return (
      <Stage title="A FILC — Amplify, Filter, Isolate, Linearize, Convert" controls={
        <button className={"btn" + (on ? " on" : "")} onClick={() => setOn(!on)}>{on ? "Conditioning ON" : "Raw noisy signal"}</button>
      }>
        <svg viewBox="0 0 720 180">
          <path d={on
            ? "M20 90 C 60 90 80 40 120 90 S 180 140 220 90 S 280 40 320 90"
            : "M20 90 C 40 20 50 160 80 90 S 120 10 160 140 S 200 20 240 150 S 280 40 320 90"}
            fill="none" stroke={on ? "#7dffb2" : "#ff7a90"} strokeWidth="3"/>
          <rect x="360" y="50" width="160" height="80" rx="14" fill="#12182c" stroke="#54e6ff"/>
          <text x="440" y="95" textAnchor="middle" fill="#54e6ff" fontSize="13">Conditioning</text>
          <path d="M540 90 C 580 90 600 70 640 90 S 700 110 710 90" fill="none" stroke="#54e6ff" strokeWidth="3"/>
        </svg>
      </Stage>
    );
  }

  /* ---------- Amplifier ---------- */
  function Amp() {
    const [g, setG] = useState(10);
    const vin = 10;
    return (
      <Stage title="Small in, large out" controls={
        <Slider label="Gain" min={1} max={50} value={g} onChange={setG} fmt={(v) => "×" + v} />
      }>
        <svg viewBox="0 0 720 200">
          <path d="M40 100 q 20 -20 40 0 q 20 20 40 0 q 20 -20 40 0" fill="none" stroke="#9aa6c7" strokeWidth="2"/>
          <text x="100" y="140" textAnchor="middle" fill="#9aa6c7" fontSize="12">{vin} mV</text>
          <polygon points="220,50 220,150 340,100" fill="#54e6ff22" stroke="#54e6ff"/>
          <text x="250" y="108" fill="#54e6ff" fontSize="13">Amp</text>
          <path d={`M380 100 q 30 -${g} 60 0 q 30 ${g} 60 0 q 30 -${g} 60 0`} fill="none" stroke="#7dffb2" strokeWidth="3"/>
          <text x="530" y="160" textAnchor="middle" fill="#7dffb2" fontSize="14">{vin * g} mV</text>
        </svg>
      </Stage>
    );
  }

  function Impedance() {
    return (
      <Stage title="High Zin · Low Zout">
        <svg viewBox="0 0 720 180">
          <rect x="40" y="50" width="180" height="80" rx="14" fill="#12182c" stroke="#ffcf5c"/>
          <text x="130" y="85" textAnchor="middle" fill="#ffcf5c" fontSize="13">SENSOR</text>
          <text x="130" y="108" textAnchor="middle" fill="#9aa6c7" fontSize="11">do not steal current</text>
          <text x="250" y="95" fill="#54e6ff" fontSize="18">HIGH Zin →</text>
          <polygon points="380,50 380,130 470,90" fill="#54e6ff22" stroke="#54e6ff"/>
          <text x="500" y="95" fill="#7dffb2" fontSize="18">→ LOW Zout</text>
          <rect x="620" y="55" width="80" height="70" rx="12" fill="#12182c" stroke="#7dffb2"/>
          <text x="660" y="95" textAnchor="middle" fill="#7dffb2" fontSize="11">next</text>
        </svg>
      </Stage>
    );
  }

  function Opamp() {
    const [vp, setVp] = useState(1.2);
    const [vn, setVn] = useState(1.0);
    const out = Math.max(-10, Math.min(10, (vp - vn) * 20));
    return (
      <Stage title="Op-amp amplifies the difference V+ − V−" controls={
        <>
          <Slider label="V+" min={0} max={3} step={0.1} value={vp} onChange={setVp} fmt={(v) => v.toFixed(1) + " V"} />
          <Slider label="V−" min={0} max={3} step={0.1} value={vn} onChange={setVn} fmt={(v) => v.toFixed(1) + " V"} />
        </>
      }>
        <svg viewBox="0 0 720 210">
          <polygon points="260,40 260,180 460,110" fill="#12182c" stroke="#54e6ff" strokeWidth="2"/>
          <text x="140" y="80" fill="#7dffb2" fontSize="13">+  {vp.toFixed(1)} V</text>
          <text x="140" y="150" fill="#ff7a90" fontSize="13">−  {vn.toFixed(1)} V</text>
          <line x1="200" y1="75" x2="260" y2="75" stroke="#7dffb2"/>
          <line x1="200" y1="145" x2="260" y2="145" stroke="#ff7a90"/>
          <line x1="460" y1="110" x2="560" y2="110" stroke="#ffcf5c" strokeWidth="3"/>
          <text x="580" y="116" fill="#ffcf5c" fontSize="18" fontWeight="700">{out.toFixed(1)} V</text>
          <text x="330" y="118" fill="#54e6ff" fontSize="12">op-amp</text>
        </svg>
      </Stage>
    );
  }

  function Cmrr() {
    const [noise, setNoise] = useState(30);
    return (
      <Stage title="Common-mode: same on both wires — reject it" controls={
        <Slider label="Interference" min={0} max={80} value={noise} onChange={setNoise} />
      }>
        <svg viewBox="0 0 720 200">
          <path d={`M40 70 ${wave(noise)}`} fill="none" stroke="#ff7a90" strokeWidth="2"/>
          <path d={`M40 130 ${wave(noise)}`} fill="none" stroke="#ff7a90" strokeWidth="2"/>
          <text x="40" y="50" fill="#ff7a90" fontSize="11">same noise on both</text>
          <polygon points="360,50 360,150 470,100" fill="#12182c" stroke="#54e6ff"/>
          <line x1="470" y1="100" x2="640" y2="100" stroke="#7dffb2" strokeWidth="3"/>
          <text x="500" y="90" fill="#7dffb2" fontSize="13">almost 0 — rejected</text>
        </svg>
      </Stage>
    );
  }
  function wave(n) {
    let d = "";
    for (let i = 0; i < 12; i++) d += `l 20 ${i % 2 ? n * 0.4 : -n * 0.4} `;
    return d;
  }

  function Inamp() {
    const [rg, setRg] = useState(10);
    const gain = (1 + 20 / rg) * 1;
    return (
      <Stage title="Gain knob is RG — smaller RG, bigger gain" controls={
        <Slider label="RG (kΩ)" min={1} max={20} value={rg} onChange={setRg} fmt={(v) => v + " kΩ"} />
      }>
        <svg viewBox="0 0 720 210">
          <text x="40" y="70" fill="#7dffb2">Sensor +</text>
          <text x="40" y="150" fill="#ff7a90">Sensor −</text>
          <rect x="180" y="50" width="280" height="120" rx="16" fill="#12182c" stroke="#a97bff"/>
          <text x="320" y="100" textAnchor="middle" fill="#a97bff" fontSize="14" fontWeight="700">Instrumentation Amp</text>
          <text x="320" y="128" textAnchor="middle" fill="#9aa6c7" fontSize="12">Aᵥ = (1 + 2R / RG)(R3/R2)</text>
          <text x="520" y="110" fill="#ffcf5c" fontSize="22" fontWeight="800">Gain {gain.toFixed(2)}</text>
        </svg>
      </Stage>
    );
  }

  /* ---------- Noise ---------- */
  function Noise() {
    const [n, setN] = useState(25);
    return (
      <Stage title="Unwanted guest sitting on your signal" controls={
        <Slider label="Noise" min={0} max={80} value={n} onChange={setN} />
      }>
        <svg viewBox="0 0 720 180">
          <path d="M20 90 C 80 40 140 140 200 90 S 320 40 380 90 S 500 140 560 90 S 680 40 710 90"
            fill="none" stroke="#54e6ff" strokeWidth="2"/>
          <path d={noisePath(n)} fill="none" stroke="#ff7a90" strokeWidth="1.5" opacity=".9"/>
          <text x="20" y="30" fill="#54e6ff" fontSize="12">desired</text>
          <text x="20" y="48" fill="#ff7a90" fontSize="12">noise</text>
        </svg>
      </Stage>
    );
  }
  function noisePath(n) {
    let d = "M20 90 ";
    for (let x = 20; x < 710; x += 8) d += `L ${x} ${90 + (Math.sin(x * 0.4) + Math.sin(x * 1.7)) * n * 0.35} `;
    return d;
  }

  function Resolution() {
    const [bits, setBits] = useState(3);
    const steps = 2 ** bits;
    return (
      <Stage title="Resolution = smallest step the system can still see" controls={
        <Slider label="Bits" min={1} max={6} value={bits} onChange={setBits} fmt={(v) => v + " bit · " + (2 ** v) + " levels"} />
      }>
        <svg viewBox="0 0 720 160">
          {Array.from({ length: steps }, (_, i) => (
            <rect key={i} x={40 + i * (640 / steps)} y="50" width={640 / steps - 4} height="60" rx="4"
              fill="#54e6ff" opacity={0.3 + i / steps}/>
          ))}
          <text x="360" y="140" textAnchor="middle" fill="#9aa6c7" fontSize="13">
            Smaller step = better resolution
          </text>
        </svg>
      </Stage>
    );
  }

  function NoiseTypes() {
    return (
      <Stage title="Internal is born inside · External walks in">
        <svg viewBox="0 0 720 180">
          <rect x="50" y="40" width="280" height="110" rx="16" fill="#12182c" stroke="#ffcf5c"/>
          <text x="190" y="85" textAnchor="middle" fill="#ffcf5c" fontSize="16">INTERNAL</text>
          <text x="190" y="112" textAnchor="middle" fill="#9aa6c7" fontSize="12">thermal noise of resistors</text>
          <rect x="390" y="40" width="280" height="110" rx="16" fill="#12182c" stroke="#ff7a90"/>
          <text x="530" y="85" textAnchor="middle" fill="#ff7a90" fontSize="16">EXTERNAL</text>
          <text x="530" y="112" textAnchor="middle" fill="#9aa6c7" fontSize="12">EMI from motors</text>
        </svg>
      </Stage>
    );
  }

  function Thermal() {
    const [T, setT] = useState(300);
    const dots = useRef([]);
    const [, tick] = useState(0);
    useEffect(() => {
      dots.current = Array.from({ length: 28 }, () => ({ x: 80 + Math.random() * 300, y: 50 + Math.random() * 90 }));
      const id = setInterval(() => {
        const k = T / 180;
        dots.current.forEach((d) => {
          d.x += (Math.random() - 0.5) * k;
          d.y += (Math.random() - 0.5) * k;
          d.x = Math.max(70, Math.min(390, d.x));
          d.y = Math.max(45, Math.min(145, d.y));
        });
        tick((n) => n + 1);
      }, 60);
      return () => clearInterval(id);
    }, [T]);
    return (
      <Stage title="Heat shakes charges → thermal noise" controls={
        <Slider label="Temperature" min={100} max={600} value={T} onChange={setT} fmt={(v) => v + " K"} />
      }>
        <svg viewBox="0 0 720 190">
          <rect x="50" y="30" width="360" height="130" rx="14" fill="#12182c" stroke="#ffcf5c"/>
          {dots.current.map((d, i) => <circle key={i} cx={d.x} cy={d.y} r="3.2" fill="#ffcf5c"/>)}
          <text x="460" y="90" fill="#e8edff" fontSize="14">Hotter → more random motion</text>
          <text x="460" y="114" fill="#9aa6c7" fontSize="12">exists even with no EMI</text>
        </svg>
      </Stage>
    );
  }

  function Shot() {
    const [t, setT] = useState(0);
    useEffect(() => {
      const id = setInterval(() => setT((x) => x + 1), 80);
      return () => clearInterval(id);
    }, []);
    const drops = Array.from({ length: 12 }, (_, i) => ((t * 7 + i * 40) % 260));
    return (
      <Stage title="Current is raindrops, not a smooth river">
        <svg viewBox="0 0 720 180">
          <rect x="200" y="30" width="40" height="120" rx="6" fill="#1a2238" stroke="#54e6ff"/>
          {drops.map((y, i) => <circle key={i} cx="220" cy={30 + y * 0.4} r="4" fill="#54e6ff"/>)}
          <text x="280" y="90" fill="#e8edff" fontSize="14">Discrete charges → shot noise</text>
        </svg>
      </Stage>
    );
  }

  function Pink() {
    return (
      <Stage title="Pink = 1/f  · more power at low frequency">
        <svg viewBox="0 0 720 180">
          <path d="M40 40 Q 200 50 360 90 T 680 160" fill="none" stroke="#ff7a90" strokeWidth="3"/>
          <text x="40" y="170" fill="#9aa6c7" fontSize="12">low f</text>
          <text x="640" y="170" fill="#9aa6c7" fontSize="12">high f</text>
          <text x="300" y="30" fill="#ff7a90" fontSize="14">P ∝ 1/f</text>
        </svg>
      </Stage>
    );
  }

  /* ---------- ADC ---------- */
  function Adc() {
    return (
      <Stage title="Wave in, bits out">
        <svg viewBox="0 0 720 160">
          <path d="M30 80 C 70 20 110 140 150 80 S 230 20 270 80" fill="none" stroke="#54e6ff" strokeWidth="3"/>
          <rect x="300" y="45" width="120" height="70" rx="14" fill="#12182c" stroke="#ffcf5c"/>
          <text x="360" y="86" textAnchor="middle" fill="#ffcf5c" fontSize="16">ADC</text>
          <text x="460" y="90" fill="#7dffb2" fontSize="22" fontFamily="JetBrains Mono, monospace">10110101</text>
        </svg>
      </Stage>
    );
  }

  function AdcSteps() {
    const [step, setStep] = useState(0);
    const labels = ["Analog", "Sampling", "Quantization", "Encoding"];
    useEffect(() => {
      const id = setInterval(() => setStep((s) => (s + 1) % 4), 1400);
      return () => clearInterval(id);
    }, []);
    return (
      <Stage title="SQE — Sample, Quantize, Encode" controls={
        labels.map((l, i) => (
          <button key={l} className={"btn" + (step === i ? " on" : "")} onClick={() => setStep(i)}>{l}</button>
        ))
      }>
        <svg viewBox="0 0 720 210">
          {labels.map((l, i) => (
            <g key={l} transform={`translate(${30 + i * 175},60)`}>
              <rect width="150" height="80" rx="14" fill={step === i ? "#54e6ff22" : "#12182c"} stroke={step === i ? "#54e6ff" : "#ffffff22"}/>
              <text x="75" y="46" textAnchor="middle" fill={step === i ? "#54e6ff" : "#9aa6c7"} fontSize="14">{l}</text>
            </g>
          ))}
          <text x="360" y="180" textAnchor="middle" fill="#ffcf5c" fontSize="14">
            {["Smooth wave", "Take snapshots", "Round to nearest step", "Name it in binary"][step]}
          </text>
        </svg>
      </Stage>
    );
  }

  function Sampling() {
    const [fs, setFs] = useState(8);
    const pts = [];
    for (let i = 0; i <= fs; i++) {
      const x = 40 + (i / fs) * 640;
      const y = 90 - Math.sin((i / fs) * Math.PI * 4) * 50;
      pts.push([x, y]);
    }
    return (
      <Stage title="Sampling = snapshots of the wave" controls={
        <Slider label="Samples" min={4} max={24} value={fs} onChange={setFs} />
      }>
        <svg viewBox="0 0 720 180">
          <path d="M40 90 C 120 20 200 160 280 90 S 440 20 520 90 S 640 160 700 90" fill="none" stroke="#54e6ff55" strokeWidth="2"/>
          {pts.map((p, i) => <circle key={i} cx={p[0]} cy={p[1]} r="5" fill="#ffcf5c"/>)}
        </svg>
      </Stage>
    );
  }

  function Nyquist() {
    const [fs, setFs] = useState(8);
    const fmax = 4;
    const ok = fs >= 2 * fmax;
    return (
      <Stage title="f_s ≥ 2 f_max" controls={
        <Slider label="Sampling f_s" min={3} max={16} value={fs} onChange={setFs} fmt={(v) => v + " Hz"} />
      }>
        <svg viewBox="0 0 720 190">
          <text x="40" y="40" fill={ok ? "#7dffb2" : "#ff7a90"} fontSize="18" fontWeight="700">
            {ok ? "OK — Nyquist satisfied" : "TOO SLOW — aliasing risk"}
          </text>
          <text x="40" y="70" fill="#9aa6c7" fontSize="13">f_max = 4 Hz · need f_s ≥ 8 Hz · now {fs} Hz</text>
          {Array.from({ length: fs }, (_, i) => {
            const x = 40 + (i / Math.max(fs - 1, 1)) * 640;
            const y = 130 - Math.sin((i / fs) * Math.PI * 8) * 40;
            return <circle key={i} cx={x} cy={y} r="5" fill={ok ? "#7dffb2" : "#ff7a90"}/>;
          })}
        </svg>
      </Stage>
    );
  }

  function Aliasing() {
    const [slow, setSlow] = useState(true);
    const n = slow ? 5 : 18;
    return (
      <Stage title="Too few snapshots → the wave pretends to be slower" controls={
        <button className={"btn" + (slow ? " on" : "")} onClick={() => setSlow(!slow)}>
          {slow ? "Under-sampled (alias)" : "Proper sampling"}
        </button>
      }>
        <svg viewBox="0 0 720 190">
          <path d="M30 95 C 70 20 110 170 150 95 S 230 20 270 95 S 350 170 390 95 S 470 20 510 95 S 590 170 630 95 S 690 20 710 95"
            fill="none" stroke="#54e6ff33" strokeWidth="2"/>
          {Array.from({ length: n }, (_, i) => {
            const x = 40 + (i / (n - 1)) * 640;
            const y = 95 - Math.sin((x / 720) * Math.PI * 10) * 70;
            return <circle key={i} cx={x} cy={y} r="6" fill={slow ? "#ff7a90" : "#7dffb2"}/>;
          })}
          {slow ? <path d="M40 95 Q 200 20 360 95 T 680 95" fill="none" stroke="#ff7a90" strokeWidth="3"/> : null}
          <text x="40" y="175" fill={slow ? "#ff7a90" : "#7dffb2"} fontSize="13">
            {slow ? "False slow wave appears — ALIASING" : "True high frequency captured"}
          </text>
        </svg>
      </Stage>
    );
  }

  function Quantize() {
    const [v, setV] = useState(2.3);
    const levels = [0, 1, 2, 3];
    const q = levels.reduce((best, L) => Math.abs(L - v) < Math.abs(best - v) ? L : best, 0);
    return (
      <Stage title="Round to the nearest allowed step" controls={
        <Slider label="Analog V" min={0} max={3} step={0.1} value={v} onChange={setV} fmt={(x) => x.toFixed(1) + " V"} />
      }>
        <svg viewBox="0 0 720 210">
          {levels.map((L) => (
            <g key={L}>
              <line x1="80" y1={180 - L * 40} x2="500" y2={180 - L * 40} stroke="#ffffff22"/>
              <text x="40" y={184 - L * 40} fill="#9aa6c7" fontSize="12">{L} V</text>
            </g>
          ))}
          <circle cx="300" cy={180 - v * 40} r="8" fill="#54e6ff"/>
          <circle cx="420" cy={180 - q * 40} r="10" fill="#ffcf5c"/>
          <text x="520" y="80" fill="#54e6ff" fontSize="14">input {v.toFixed(1)} V</text>
          <text x="520" y="110" fill="#ffcf5c" fontSize="18" fontWeight="700">→ {q} V</text>
          <text x="520" y="140" fill="#ff7a90" fontSize="12">error {(v - q).toFixed(1)} V</text>
        </svg>
      </Stage>
    );
  }

  function Encode() {
    const [lvl, setLvl] = useState(2);
    const map = ["00", "01", "10", "11"];
    return (
      <Stage title="Each level gets a binary name · 2^n levels" controls={
        <Slider label="Level" min={0} max={3} value={lvl} onChange={setLvl} fmt={(v) => "level " + v} />
      }>
        <svg viewBox="0 0 720 180">
          {map.map((b, i) => (
            <g key={b} transform={`translate(${60 + i * 160},50)`}>
              <rect width="130" height="80" rx="14" fill={lvl === i ? "#54e6ff22" : "#12182c"} stroke={lvl === i ? "#54e6ff" : "#ffffff22"}/>
              <text x="65" y="38" textAnchor="middle" fill="#9aa6c7" fontSize="12">{i}</text>
              <text x="65" y="62" textAnchor="middle" fill={lvl === i ? "#7dffb2" : "#e8edff"} fontSize="22" fontFamily="JetBrains Mono, monospace">{b}</text>
            </g>
          ))}
        </svg>
      </Stage>
    );
  }

  const MAP = {
    transducer: Transducer,
    "primary-secondary": PrimarySecondary,
    rtd: Rtd,
    "rtd-material": RtdMaterial,
    thermistor: Thermistor,
    pressure: Pressure,
    "abs-pressure": AbsPressure,
    "gauge-pressure": GaugePressure,
    "diff-pressure": DiffPressure,
    "pressure-types": PressureTypes,
    emech: Emech,
    diaphragm: Diaphragm,
    strain: Strain,
    cap: Cap,
    "cap-diff": CapDiff,
    flowmeter: Flowmeter,
    tof: Tof,
    level: Level,
    conditioning: Conditioning,
    amp: Amp,
    impedance: Impedance,
    opamp: Opamp,
    cmrr: Cmrr,
    inamp: Inamp,
    noise: Noise,
    resolution: Resolution,
    "noise-types": NoiseTypes,
    thermal: Thermal,
    shot: Shot,
    pink: Pink,
    adc: Adc,
    "adc-steps": AdcSteps,
    sampling: Sampling,
    nyquist: Nyquist,
    aliasing: Aliasing,
    quantize: Quantize,
    encode: Encode
  };

  function Render({ kind }) {
    const C = MAP[kind];
    if (!C) return null;
    return <C />;
  }

  return { Render };
})();
