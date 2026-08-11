const TABS = [
  { id: "live", label: "Live Scene" },
  { id: "functions", label: "My Functions" },
  { id: "walkthrough", label: "Code Walkthrough" },
  { id: "connections", label: "How It Connects" },
  { id: "qa", label: "Interview Q&A" },
  { id: "script", label: "Presentation Script" },
];

const FUNCTIONS = [
  ["255–258", "getDaylight()", "Returns 0 (night) to 1 (day)", "0.5 * (sin(dayPhase) + 1)"],
  ["801–871", "drawSky()", "Three-stop gradient sky + warm twilight overlay", "Per-vertex colour on GL_QUADS"],
  ["873–882", "drawStars()", "42 twinkling stars that fade in at night", "alpha = (1 - daylight)^1.8"],
  ["884–937", "drawSunMoon()", "Sun and moon on opposite elliptical arcs", "moonA = sunA + PI"],
  ["939–955", "drawCloud()", "One cloud from four layered ellipses", "Overlapping soft shapes"],
  ["957–968", "drawCloudLayer()", "Drifts four clouds as one group", "glPushMatrix + glTranslatef"],
  ["970–1033", "drawGround()", "Grass gradient, campus path, contact shadow", "Near/far colour = depth cue"],
  ["1262–1309", "drawTree()", "Trunk rect + four canopy ellipses", "All sizes scaled by s"],
  ["1311–1317", "drawTreeLine()", "Places five trees at varied scales", "Uniform scaling transform"],
  ["1319–1340", "drawFlag()", "Pole + rippling national flag", "sin(flagPhase + t * 7)"],
  ["1342–1350", "drawBench()", "Two wooden slats + two metal legs", "Four rect() calls"],
  ["1797–1804", "initStars()", "Randomises star x, y, size, twinkle phase", "Runs once in main()"],
  ["1881–1888", "drawTwilightFog()", "Low mist band at dawn and dusk", "alpha = 0.10 * twilight"],
  ["2485–2489", "timer() block", "Advances cloudShift, flagPhase, dayPhase", "Frame-based animation"],
];

const liveState = {
  auto: true,
  manual: 0.85,
  season: "SUMMER",
  labels: true,
  others: true,
  phase: 1.2,
  activeTab: "live",
  qaCat: "All",
  qaQuery: "",
  qaHardOnly: false,
};

let rafId = 0;

function escapeHtml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function getDaylightValue() {
  return liveState.auto ? 0.5 * (Math.sin(liveState.phase) + 1) : liveState.manual;
}

function getSceneState(daylight) {
  if (daylight > 0.75) return "Full day";
  if (daylight > 0.55) return "Afternoon";
  if (daylight > 0.35) return "Golden hour";
  if (daylight > 0.15) return "Dusk / dawn";
  return "Full night";
}

function setTab(tabId) {
  liveState.activeTab = tabId;
  document.querySelectorAll(".tab-panel").forEach((el) => el.classList.add("hidden"));
  document.getElementById(`tab-${tabId}`).classList.remove("hidden");
  document.querySelectorAll("#tabs-nav .pill").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.tab === tabId);
  });
}

function updateLiveScene() {
  const daylight = getDaylightValue();
  const twilight = clampf(1 - Math.abs(daylight - 0.5) * 2, 0, 1);
  const starAlpha = Math.pow(1 - daylight, 1.8);
  const sunAlpha = smoothstep(0.2, 0.65, daylight);
  const moonAlpha = smoothstep(0.2, 0.8, 1 - daylight);

  document.getElementById("live-scene").innerHTML = renderLiveScene({
    daylight,
    phase: liveState.phase,
    season: liveState.season,
    showLabels: liveState.labels,
    showOthers: liveState.others,
  });

  const slider = document.getElementById("daylight-slider");
  slider.value = daylight.toFixed(2);
  document.getElementById("daylight-value").textContent = daylight.toFixed(2);

  document.getElementById("live-stats").innerHTML = `
    <div class="stat"><div class="stat-value">${getSceneState(daylight)}</div><div class="stat-label">Scene state</div></div>
    <div class="stat"><div class="stat-value">${twilight.toFixed(2)}</div><div class="stat-label">twilight factor</div></div>
    <div class="stat"><div class="stat-value">${starAlpha.toFixed(2)}</div><div class="stat-label">star alpha</div></div>
    <div class="stat"><div class="stat-value">${sunAlpha.toFixed(2)}</div><div class="stat-label">sun alpha</div></div>
    <div class="stat"><div class="stat-value">${moonAlpha.toFixed(2)}</div><div class="stat-label">moon alpha</div></div>
  `;

  document.querySelectorAll("#tab-live [data-mode]").forEach((btn) => {
    const mode = btn.dataset.mode;
    const active =
      (mode === "auto" && liveState.auto) ||
      (mode === "day" && !liveState.auto && liveState.manual === 1) ||
      (mode === "night" && !liveState.auto && liveState.manual === 0);
    btn.classList.toggle("active", active);
  });

  document.querySelectorAll("#season-buttons .pill").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.season === liveState.season);
  });
}

function tick() {
  liveState.phase += 0.0028 * 6;
  if (liveState.activeTab === "live") updateLiveScene();
  rafId = requestAnimationFrame(tick);
}

function initTabs() {
  const nav = document.getElementById("tabs-nav");
  nav.innerHTML = TABS.map(
    (t) => `<button type="button" class="pill${t.id === "live" ? " active" : ""}" data-tab="${t.id}">${t.label}</button>`,
  ).join("");
  nav.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-tab]");
    if (btn) setTab(btn.dataset.tab);
  });
}

function initLiveTab() {
  const seasonRow = document.getElementById("season-buttons");
  seasonRow.innerHTML = SEASON_KEYS.map(
    (k) =>
      `<button type="button" class="pill${k === liveState.season ? " active" : ""}" data-season="${k}">${SEASONS[k].label} <kbd>${SEASONS[k].key}</kbd></button>`,
  ).join("");

  seasonRow.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-season]");
    if (btn) {
      liveState.season = btn.dataset.season;
      updateLiveScene();
    }
  });

  document.getElementById("tab-live").addEventListener("click", (e) => {
    const modeBtn = e.target.closest("[data-mode]");
    if (!modeBtn) return;
    const mode = modeBtn.dataset.mode;
    if (mode === "auto") liveState.auto = true;
    else if (mode === "day") {
      liveState.auto = false;
      liveState.manual = 1;
    } else if (mode === "night") {
      liveState.auto = false;
      liveState.manual = 0;
    }
    updateLiveScene();
  });

  document.getElementById("chk-labels").addEventListener("change", (e) => {
    liveState.labels = e.target.checked;
    updateLiveScene();
  });
  document.getElementById("chk-others").addEventListener("change", (e) => {
    liveState.others = e.target.checked;
    updateLiveScene();
  });
  document.getElementById("daylight-slider").addEventListener("input", (e) => {
    liveState.auto = false;
    liveState.manual = Number(e.target.value);
    updateLiveScene();
  });

  document.addEventListener("keydown", (e) => {
    if (liveState.activeTab !== "live") return;
    const k = e.key.toLowerCase();
    if (k === "a") {
      liveState.auto = true;
      updateLiveScene();
    } else if (k === "d") {
      liveState.auto = false;
      liveState.manual = 1;
      updateLiveScene();
    } else if (k === "n") {
      liveState.auto = false;
      liveState.manual = 0;
      updateLiveScene();
    }
  });
}

function initFunctionsTab() {
  document.getElementById("functions-table").innerHTML = FUNCTIONS.map(
    ([lines, fn, purpose, idea]) =>
      `<tr><td class="mono">${lines}</td><td class="mono">${fn}</td><td>${purpose}</td><td>${idea}</td></tr>`,
  ).join("");
  renderLineChart(document.getElementById("curve-chart"), buildCurveData());
}

function initWalkthroughTab() {
  document.getElementById("walkthrough-blocks").innerHTML = WALKTHROUGH_BLOCKS.map(
    (block) => `
      <details class="section"${block.defaultOpen ? " open" : ""}>
        <summary>
          <span>${escapeHtml(block.title)}</span>
          <span class="badge">${escapeHtml(block.lines)}</span>
        </summary>
        <div class="content stack">
          <pre class="code">${escapeHtml(block.code)}</pre>
          <div class="table-wrap">
            <table>
              <thead><tr><th>Code fragment</th><th>What you say out loud</th></tr></thead>
              <tbody>
                ${block.annotations
                  .map(
                    (a) =>
                      `<tr><td class="mono">${escapeHtml(a.line)}</td><td>${escapeHtml(a.note)}</td></tr>`,
                  )
                  .join("")}
              </tbody>
            </table>
          </div>
          <div class="callout">
            <div class="callout-title">Takeaway</div>
            ${escapeHtml(block.takeaway)}
          </div>
        </div>
      </details>`,
  ).join("");
}

function getQaCounts() {
  const m = { All: QUESTIONS.length };
  for (const item of QUESTIONS) m[item.cat] = (m[item.cat] ?? 0) + 1;
  return m;
}

function filterQuestions() {
  const q = liveState.qaQuery.trim().toLowerCase();
  return QUESTIONS.filter((item) => {
    if (liveState.qaCat !== "All" && item.cat !== liveState.qaCat) return false;
    if (liveState.qaHardOnly && !item.hard) return false;
    if (!q) return true;
    return item.q.toLowerCase().includes(q) || item.a.toLowerCase().includes(q);
  });
}

function renderQa() {
  const filtered = filterQuestions();
  const hardCount = QUESTIONS.filter((x) => x.hard).length;
  const counts = getQaCounts();

  document.getElementById("qa-stats").innerHTML = `
    <div class="stat"><div class="stat-value">${QUESTIONS.length}</div><div class="stat-label">Total questions</div></div>
    <div class="stat"><div class="stat-value">${hardCount}</div><div class="stat-label">Hard / trap questions</div></div>
    <div class="stat"><div class="stat-value">${filtered.length}</div><div class="stat-label">Currently shown</div></div>
  `;

  document.getElementById("qa-categories").innerHTML = CATEGORIES.map(
    (c) =>
      `<button type="button" class="pill${liveState.qaCat === c ? " active" : ""}" data-cat="${c}">${c}${counts[c] ? ` · ${counts[c]}` : ""}</button>`,
  ).join("");

  const list = document.getElementById("qa-list");
  if (filtered.length === 0) {
    list.innerHTML = '<div class="callout">No question matches that filter.</div>';
    return;
  }
  list.innerHTML = filtered
    .map(
      (item, i) => `
      <details class="section">
        <summary>
          <span>${escapeHtml(item.q)}</span>
          <span class="badge">${item.hard ? "hard" : escapeHtml(item.cat)}</span>
        </summary>
        <div class="qa-answer">${escapeHtml(item.a)}</div>
      </details>`,
    )
    .join("");
}

function initQaTab() {
  document.getElementById("qa-categories").addEventListener("click", (e) => {
    const btn = e.target.closest("[data-cat]");
    if (btn) {
      liveState.qaCat = btn.dataset.cat;
      renderQa();
    }
  });
  document.getElementById("qa-search").addEventListener("input", (e) => {
    liveState.qaQuery = e.target.value;
    renderQa();
  });
  document.getElementById("qa-hard-only").addEventListener("change", (e) => {
    liveState.qaHardOnly = e.target.checked;
    renderQa();
  });
  renderQa();
}

function init() {
  initTabs();
  initLiveTab();
  initFunctionsTab();
  initWalkthroughTab();
  initQaTab();
  updateLiveScene();
  rafId = requestAnimationFrame(tick);
}

document.addEventListener("DOMContentLoaded", init);
