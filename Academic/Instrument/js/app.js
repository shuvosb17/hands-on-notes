(function () {
  const { useState, useEffect, useMemo } = React;
  const { parts, questions, revision, quiz, top5 } = window.THEORY;
  const KEY = "instr-theory-done";

  function AnimStage({ kind }) {
    const C = window.Anim && window.Anim.Render;
    if (!C || !kind) return null;
    return <C kind={kind} />;
  }

  function loadDone() {
    try { return JSON.parse(localStorage.getItem(KEY) || "[]"); } catch { return []; }
  }
  function saveDone(arr) {
    localStorage.setItem(KEY, JSON.stringify(arr));
  }

  function App() {
    const [view, setView] = useState("home");
    const [part, setPart] = useState(null);
    const [open, setOpen] = useState({});
    const [done, setDone] = useState(loadDone);
    const [q, setQ] = useState("");
    const [side, setSide] = useState(false);
    const [fc, setFc] = useState(0);
    const [flip, setFlip] = useState(false);
    const [qi, setQi] = useState(0);
    const [picked, setPicked] = useState(null);
    const [score, setScore] = useState(0);
    const [finished, setFinished] = useState(false);

    useEffect(() => saveDone(done), [done]);

    const filtered = useMemo(() => {
      const s = q.trim().toLowerCase();
      return questions.filter((item) => {
        if (view === "part" && part && item.part !== part) return false;
        if (view === "stars" && !item.star) return false;
        if (!s) return true;
        return (item.q + " " + item.hook + " " + item.script).toLowerCase().includes(s);
      });
    }, [view, part, q]);

    function toggleDone(n) {
      setDone((d) => d.includes(n) ? d.filter((x) => x !== n) : [...d, n]);
    }
    function resetProgress() {
      if (confirm("Clear all mastered ticks?")) setDone([]);
    }
    function goPart(id) {
      setView("part"); setPart(id); setSide(false); window.scrollTo(0, 0);
    }
    function go(v) {
      setView(v); setPart(null); setSide(false); setFlip(false); setPicked(null); setFinished(false); setQi(0); setScore(0); window.scrollTo(0, 0);
    }

    const pct = Math.round((done.length / questions.length) * 100);
    const r = 22, c = 2 * Math.PI * r;
    const dash = c - (pct / 100) * c;

    const list = view === "part" || view === "stars" || view === "search";

    return (
      <div className="app">
        {side ? <div className="scrim" onClick={() => setSide(false)} /> : null}
        <div className="mobile-bar">
          <button className="btn" onClick={() => setSide(true)}>☰ Menu</button>
          <b>Instrumentation Theory</b>
        </div>

        <aside className={"side" + (side ? " show" : "")}>
          <div className="brand">
            <div className="brand-mark">⚡</div>
            <div>
              <h1>Instrumentation</h1>
              <span>Exam dashboard · 2–4 marks</span>
            </div>
          </div>

          <div className="search">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3-3"/></svg>
            <input placeholder="Search any concept…" value={q}
              onChange={(e) => { setQ(e.target.value); setView(e.target.value ? "search" : "home"); }} />
          </div>

          <div className="prog-card">
            <svg className="ring" viewBox="0 0 56 56">
              <defs>
                <linearGradient id="ringGrad" x1="0" x2="1">
                  <stop offset="0" stopColor="#54e6ff"/><stop offset="1" stopColor="#7dffb2"/>
                </linearGradient>
              </defs>
              <circle className="bg" cx="28" cy="28" r={r}/>
              <circle className="fg" cx="28" cy="28" r={r}
                strokeDasharray={c} strokeDashoffset={dash} transform="rotate(-90 28 28)"/>
            </svg>
            <div>
              <b>{pct}%</b>
              <small>{done.length} / {questions.length} mastered</small>
            </div>
            <button className="prog-reset" onClick={resetProgress}>reset</button>
          </div>

          <div className="nav-label">Modes</div>
          <NavBtn active={view === "home"} onClick={() => go("home")} ico="🏠" label="Home studio" />
          <NavBtn active={view === "stars"} onClick={() => go("stars")} ico="⭐" label="Must-draw 5" />
          <NavBtn active={view === "cards"} onClick={() => go("cards")} ico="🃏" label="Flashcards" />
          <NavBtn active={view === "quiz"} onClick={() => go("quiz")} ico="✅" label="Quick quiz" />
          <NavBtn active={view === "rev"} onClick={() => go("rev")} ico="🧠" label="One-line sheet" />

          <div className="nav-label">13 parts · 60 answers</div>
          {parts.map((p) => {
            const all = questions.filter((x) => x.part === p.id);
            const got = all.filter((x) => done.includes(x.n)).length;
            return (
              <div key={p.id}>
                <button className={"nav-item" + (view === "part" && part === p.id ? " active" : "")}
                  onClick={() => goPart(p.id)}>
                  <span className="ico">{p.ico}</span>
                  <span>{p.short}</span>
                  <span className="cnt">{got}/{all.length}</span>
                </button>
                <div className="nav-bar"><i style={{ width: (got / all.length) * 100 + "%" }} /></div>
              </div>
            );
          })}
        </aside>

        <main className="main">
          {view === "home" && !q ? <Home go={go} goPart={goPart} done={done} /> : null}
          {view === "stars" ? <StarsHeader /> : null}
          {view === "cards" ? <Flashcards fc={fc} setFc={setFc} flip={flip} setFlip={setFlip} /> : null}
          {view === "quiz" ? <Quiz qi={qi} setQi={setQi} picked={picked} setPicked={setPicked}
            score={score} setScore={setScore} finished={finished} setFinished={setFinished} /> : null}
          {view === "rev" ? <Revision /> : null}

          {list ? (
            <>
              {view === "part" ? <PartHead id={part} done={done} /> : null}
              {view === "search" ? <h2 style={{ marginTop: 0 }}>Search results ({filtered.length})</h2> : null}
              {filtered.length === 0 ? <div className="empty">No matching concept. Try another word.</div> : null}
              {filtered.map((item, i) => (
                <QuestionCard key={item.n} item={item} i={i}
                  open={!!open[item.n]}
                  onToggle={() => setOpen((o) => ({ ...o, [item.n]: !o[item.n] }))}
                  done={done.includes(item.n)}
                  onDone={() => toggleDone(item.n)} />
              ))}
            </>
          ) : null}

          <div className="footer">Instrumentation Theory · 60 exam scripts · drag sliders on every live diagram · deploy this folder to Cloudflare Pages</div>
        </main>
      </div>
    );
  }

  function NavBtn({ active, onClick, ico, label }) {
    return (
      <button className={"nav-item" + (active ? " active" : "")} onClick={onClick}>
        <span className="ico">{ico}</span>{label}
      </button>
    );
  }

  function Home({ go, goPart, done }) {
    return (
      <>
        <div className="hero">
          <h2>Learn it like a movie. Write it like a 3-mark script.</h2>
          <p>
            Every concept has a one-line memory shortcut, an easy exam script you can say out loud,
            and a live animation you can play with. Tick a card when you can explain it without looking.
          </p>
          <div className="hero-chips">
            <span className="chip">60 answers</span>
            <span className="chip">13 parts</span>
            <span className="chip hot">5 must-draw figures</span>
            <span className="chip">Flashcards + quiz</span>
          </div>
        </div>

        <div className="sec-head">
          <div>
            <h2>Must-draw figures</h2>
            <div className="sub">If time is short, master these five first.</div>
          </div>
          <span className="pill" style={{ cursor: "pointer" }} onClick={() => go("stars")}>Open all ⭐</span>
        </div>
        <div className="top5">
          {top5.map((t) => {
            const item = questions.find((x) => x.n === t.n);
            return (
              <div key={t.n} className="q open" style={{ margin: 0 }}>
                <div className="q-head" style={{ cursor: "default" }}>
                  <div className="q-num">{t.n}</div>
                  <div className="q-title"><span className="star">★</span>{t.title}</div>
                </div>
                <div className="q-body">
                  <div className="hook"><span className="hi">⚡</span><div><b>Shortcut</b><p>{item.hook}</p></div></div>
                  <AnimStage kind={t.anim} />
                </div>
              </div>
            );
          })}
        </div>

        <div className="sec-head" style={{ marginTop: 28 }}>
          <div>
            <h2>All parts</h2>
            <div className="sub">Tap a part. Expand a question. Play the animation. Say the script.</div>
          </div>
        </div>
        <div className="rev-grid">
          {parts.map((p) => {
            const all = questions.filter((x) => x.part === p.id);
            const got = all.filter((x) => done.includes(x.n)).length;
            return (
              <div key={p.id} className="rev" onClick={() => goPart(p.id)} style={{ cursor: "pointer" }}>
                <b>{p.ico}  {p.name}</b>
                <span>Q{all[0].n}–{all[all.length - 1].n} · {got}/{all.length} mastered</span>
              </div>
            );
          })}
        </div>
      </>
    );
  }

  function StarsHeader() {
    return (
      <div className="hero">
        <h2>⭐ The five figures that cover the paper</h2>
        <p>RTD · electro-mechanical pressure · capacitive sensor · ultrasonic level · ADC chain. Draw them in 30 seconds each.</p>
      </div>
    );
  }

  function PartHead({ id, done }) {
    const p = parts.find((x) => x.id === id);
    const all = questions.filter((x) => x.part === id);
    const got = all.filter((x) => done.includes(x.n)).length;
    if (!p) return null;
    return (
      <div className="sec-head">
        <div>
          <h2>{p.ico} {p.name}</h2>
          <div className="sub">Questions {all[0].n}–{all[all.length - 1].n} · {got} mastered</div>
        </div>
        <span className="pill">{all.length} answers</span>
      </div>
    );
  }

  function QuestionCard({ item, i, open, onToggle, done, onDone }) {
    const p = parts.find((x) => x.id === item.part);
    return (
      <article className={"q" + (open ? " open" : "") + (done ? " done" : "")} style={{ animationDelay: (i % 12) * 40 + "ms" }}>
        <div className="q-head" onClick={onToggle}>
          <div className="q-num">{item.n}</div>
          <div className="q-title">{item.star ? <span className="star">★</span> : null}{item.q}</div>
          <span className="q-marks">{p ? p.short : ""} · 2–4</span>
          <button className={"tick" + (done ? " on" : "")} onClick={(e) => { e.stopPropagation(); onDone(); }}
            title="Mark mastered">{done ? "✓" : ""}</button>
          <span className="q-caret">▾</span>
        </div>
        {open ? (
          <div className="q-body">
            <div className="hook">
              <span className="hi">⚡</span>
              <div><b>Shortcut — say this in 3 seconds</b><p>{item.hook}</p></div>
            </div>
            <div className="script">
              <b>Exam script — write this</b>
              <p>{item.script}</p>
            </div>
            {item.formula ? (
              <div className="formula">
                <div className="fx">{item.formula.fx}</div>
                <div className="fn">{item.formula.fn}</div>
              </div>
            ) : null}
            {item.points ? (
              <ul className="blk">{item.points.map((x) => <li key={x}>{x}</li>)}</ul>
            ) : null}
            {item.list ? (
              <>
                {item.listTitle ? <p className="blk"><strong>{item.listTitle}</strong></p> : null}
                <ol className="blk">{item.list.map((x) => <li key={x}>{x}</li>)}</ol>
              </>
            ) : null}
            {item.extraLists ? item.extraLists.map((g) => (
              <div key={g.title}>
                <p className="blk"><strong>{g.title}</strong></p>
                <ul className="blk">{g.items.map((x) => <li key={x}>{x}</li>)}</ul>
              </div>
            )) : null}
            {item.table ? (
              <table className="tbl">
                <thead><tr>{item.table.heads.map((h) => <th key={h}>{h}</th>)}</tr></thead>
                <tbody>{item.table.rows.map((r, ri) => (
                  <tr key={ri}>{r.map((c, ci) => <td key={ci}>{c}</td>)}</tr>
                ))}</tbody>
              </table>
            ) : null}
            {item.flow ? (
              <div className="flow">
                {item.flow.map((n, idx) => (
                  <React.Fragment key={n}>
                    <span className="node" style={{ animationDelay: idx * 80 + "ms" }}>{n}</span>
                    {idx < item.flow.length - 1 ? <span className="arw">→</span> : null}
                  </React.Fragment>
                ))}
              </div>
            ) : null}
            <AnimStage kind={item.anim} />
            {item.real ? <div className="real"><span>🌍</span><div><b>Real world. </b>{item.real}</div></div> : null}
          </div>
        ) : null}
      </article>
    );
  }

  function Flashcards({ fc, setFc, flip, setFlip }) {
    const item = questions[fc];
    return (
      <div className="fc-wrap">
        <div className="hero" style={{ width: "100%", maxWidth: 660 }}>
          <h2>Flashcards</h2>
          <p>Tap the card. Front is the question. Back is the shortcut + script. {fc + 1} / {questions.length}</p>
        </div>
        <div className={"fc" + (flip ? " flip" : "")} onClick={() => setFlip((f) => !f)}>
          <div className="fc-in">
            <div className="fc-face fc-front">
              <div className="fc-tag">Q{item.n} · tap to flip</div>
              <h3>{item.q}</h3>
            </div>
            <div className="fc-face fc-back">
              <div className="fc-tag">Shortcut</div>
              <p><b>{item.hook}</b></p>
              <p>{item.script}</p>
            </div>
          </div>
        </div>
        <div className="fc-nav">
          <button className="btn" onClick={() => { setFc((n) => (n - 1 + questions.length) % questions.length); setFlip(false); }}>← Prev</button>
          <button className="btn" onClick={() => { setFc((n) => (n + 1) % questions.length); setFlip(false); }}>Next →</button>
        </div>
      </div>
    );
  }

  function Quiz({ qi, setQi, picked, setPicked, score, setScore, finished, setFinished }) {
    const item = quiz[qi];
    function choose(i) {
      if (picked !== null) return;
      setPicked(i);
      if (i === item.a) setScore((s) => s + 1);
    }
    function next() {
      if (qi + 1 >= quiz.length) setFinished(true);
      else { setQi(qi + 1); setPicked(null); }
    }
    if (finished) {
      return (
        <div className="quiz">
          <div className="hero">
            <h2>Quiz done</h2>
            <p>You remembered {score} of {quiz.length} core lines.</p>
            <div className="score">{score}/{quiz.length}</div>
            <button className="btn on" onClick={() => { setQi(0); setScore(0); setPicked(null); setFinished(false); }}>Try again</button>
          </div>
        </div>
      );
    }
    return (
      <div className="quiz">
        <div className="hero">
          <h2>Quick quiz</h2>
          <p>15 traps from the shortcuts. {qi + 1} / {quiz.length}</p>
        </div>
        <div className="qz-bar"><i style={{ width: ((qi) / quiz.length) * 100 + "%" }} /></div>
        <h3>{item.q}</h3>
        {item.opts.map((o, i) => (
          <button key={o} disabled={picked !== null}
            className={"opt" + (picked !== null && i === item.a ? " right" : "") + (picked === i && i !== item.a ? " wrong" : "")}
            onClick={() => choose(i)}>{o}</button>
        ))}
        {picked !== null ? (
          <>
            <div className="note">{item.why}</div>
            <button className="btn on" onClick={next}>{qi + 1 >= quiz.length ? "See score" : "Next"}</button>
          </>
        ) : null}
      </div>
    );
  }

  function Revision() {
    return (
      <>
        <div className="hero">
          <h2>One-line memory sheet</h2>
          <p>Read this the night before. If you can finish every line without pausing, you are ready.</p>
        </div>
        <div className="rev-grid">
          {revision.map(([k, v], i) => (
            <div key={k} className="rev" style={{ animationDelay: i * 20 + "ms" }}>
              <b>{k}</b><span>{v}</span>
            </div>
          ))}
        </div>
      </>
    );
  }

  ReactDOM.createRoot(document.getElementById("root")).render(<App />);
})();
