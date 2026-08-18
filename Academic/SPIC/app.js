const HUES = {
  purple: "var(--purple)",
  green: "var(--green)",
  cyan: "var(--cyan)",
  pink: "var(--pink)",
  blue: "var(--blue)",
  orange: "var(--orange)",
  yellow: "var(--yellow)",
};

const PARTS = [
  { id: "ethics", label: "Ethics" },
  { id: "theory", label: "Ethical theory" },
  { id: "professional", label: "Professional ethics" },
  { id: "computer", label: "Computer ethics" },
  { id: "ip", label: "Intellectual property" },
  { id: "errors", label: "Part 3 · Errors" },
  { id: "privacy", label: "Part 4 · Privacy" },
  { id: "ai", label: "Part 5 · AI ethics" },
];

const state = {
  part: "ethics",
  hide: false,
  picked: {},
  open: {},
};

function key(text, color = "yellow") {
  return `<span class="key ${color}">${text}</span>`;
}

function layoutDAG(nodes, edges) {
  const nodeW = 88;
  const nodeH = 88;
  const rankGap = 70;
  const nodeGap = 28;
  const padding = 20;
  const ids = nodes.map((n) => n.id);
  const incoming = Object.fromEntries(ids.map((id) => [id, []]));
  const outgoing = Object.fromEntries(ids.map((id) => [id, []]));
  edges.forEach((e) => {
    outgoing[e.from].push(e.to);
    incoming[e.to].push(e.from);
  });
  const rank = {};
  const queue = ids.filter((id) => incoming[id].length === 0);
  queue.forEach((id) => {
    rank[id] = 0;
  });
  for (let i = 0; i < queue.length; i += 1) {
    const u = queue[i];
    outgoing[u].forEach((v) => {
      rank[v] = Math.max(rank[v] ?? 0, rank[u] + 1);
      if (!queue.includes(v)) queue.push(v);
    });
  }
  ids.forEach((id) => {
    if (rank[id] === undefined) rank[id] = 0;
  });
  const byRank = {};
  ids.forEach((id) => {
    (byRank[rank[id]] ||= []).push(id);
  });
  const ranks = Object.keys(byRank)
    .map(Number)
    .sort((a, b) => a - b);
  const maxCount = Math.max(...ranks.map((r) => byRank[r].length));
  const width = padding * 2 + maxCount * nodeW + (maxCount - 1) * nodeGap;
  const height = padding * 2 + ranks.length * nodeH + (ranks.length - 1) * rankGap;
  const pos = {};
  ranks.forEach((r, ri) => {
    const row = byRank[r];
    const rowW = row.length * nodeW + (row.length - 1) * nodeGap;
    let x = (width - rowW) / 2;
    const y = padding + ri * (nodeH + rankGap);
    row.forEach((id) => {
      pos[id] = { x, y, cx: x + nodeW / 2, cy: y + nodeH / 2 };
      x += nodeW + nodeGap;
    });
  });
  return { pos, width, height, r: 18 };
}

function graphView(id, hue, nodes, edges) {
  const picked = state.picked[id] || nodes[0].id;
  const { pos, width, height, r } = layoutDAG(nodes, edges);
  const stroke = HUES[hue];
  const byId = Object.fromEntries(nodes.map((n) => [n.id, n]));
  const pickedNode = byId[picked];
  const lines = edges
    .map(
      (e) =>
        `<line x1="${pos[e.from].cx}" y1="${pos[e.from].cy}" x2="${pos[e.to].cx}" y2="${pos[e.to].cy}" stroke="${stroke}" stroke-width="1.5" />`,
    )
    .join("");
  const circles = nodes
    .map((n) => {
      const p = pos[n.id];
      const active = n.id === picked;
      const label = n.label;
      return `<g data-pick="${id}:${n.id}" style="cursor:pointer">
        <circle cx="${p.cx}" cy="${p.cy}" r="${r}" fill="${active ? "var(--fill-2)" : "var(--fill)"}" stroke="${stroke}" stroke-width="${active ? 2.5 : 1.5}" />
        <text class="node-label" x="${p.cx}" y="${p.cy + r + 16}" text-anchor="middle">${label}</text>
      </g>`;
    })
    .join("");
  const extra = pickedNode.detail ? ` · ${pickedNode.label}: ${pickedNode.detail}` : "";
  return `<div class="graph-wrap">
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">${lines}${circles}</svg>
  </div>
  <p class="caption">This graph has ${nodes.length} nodes · ${edges.length} edges${extra}</p>`;
}

function splitOnLetter(letter, meaning) {
  const i = meaning.toLowerCase().indexOf(letter.toLowerCase());
  if (i < 0) return { before: "", hit: letter, after: meaning };
  return {
    before: meaning.slice(0, i),
    hit: meaning.slice(i, i + 1),
    after: meaning.slice(i + 1),
  };
}

function keywordMap(mapId, word, hue, items) {
  const accent = HUES[hue];
  const open = state.open[mapId] || [];
  let idx = 0;
  const tiles = [...word]
    .map((ch, i) => {
      if (ch === " ") return `<div class="gap"></div>`;
      const item = items[idx];
      idx += 1;
      const on = !state.hide || open.includes(item.id);
      return `<button class="tile ${on ? "on" : ""}" data-toggle="${mapId}:${item.id}" style="color:${accent};border-color:${on ? accent : "var(--stroke)"}">${ch}</button>`;
    })
    .join("");
  const rows = items
    .map((item) => {
      const shown = !state.hide || open.includes(item.id);
      const parts = splitOnLetter(item.letter, item.meaning);
      const meaning = shown
        ? `<span class="before">${parts.before}</span><span class="hit" style="color:${accent}">${parts.hit}</span><span>${parts.after}</span>${item.extra ? `<span class="extra">  ·  ${item.extra}</span>` : ""}`
        : `<span class="blank">tap to recall</span>`;
      return `<button class="krow" data-toggle="${mapId}:${item.id}">
        <span class="kletter" style="color:${accent}">${item.letter}</span>
        <span class="eq">=</span>
        <span>${meaning}</span>
      </button>`;
    })
    .join("");
  return `<div class="tiles">${tiles}</div><div>${rows}</div>`;
}

function renderPart() {
  const hide = state.hide;
  switch (state.part) {
    case "ethics":
      return `<div class="stack">
        <h2>Part-2: Ethics and Professional Ethics</h2>
        <h3>What is Ethics?</h3>
        <p>Ethics is a study what is ${key("right")} and ${key("wrong", "pink")} and ${key("what should we do", "cyan")}.</p>
        <p>Also, ethics is a branch of ${key("philosophy", "purple")}</p>
        ${graphView("ethics-split", "purple", [
          { id: "ethics", label: "Ethics" },
          { id: "desc", label: "Descriptive", detail: "what people actually do or believe · what is" },
          { id: "norm", label: "Normative", detail: "Determined what people should do · what should be" },
        ], [
          { from: "ethics", to: "desc" },
          { from: "ethics", to: "norm" },
        ])}
      </div>`;
    case "theory":
      return `<div class="stack">
        <h2>Ethical theory</h2>
        ${graphView("ethical-theory", "purple", [
          { id: "et", label: "Ethical theory" },
          { id: "v", label: "Virtue Ethics", detail: "Individual person character" },
          { id: "u", label: "Utilitarianism", detail: "Result · focus on outcome. 100 patients over the 5 patients" },
          { id: "d", label: "Deontology", detail: "Follows the moral rule or duty, even if the result is bad" },
          { id: "vc", label: "character" },
          { id: "ur", label: "Result" },
          { id: "dr", label: "rule / duty" },
        ], [
          { from: "et", to: "v" },
          { from: "et", to: "u" },
          { from: "et", to: "d" },
          { from: "v", to: "vc" },
          { from: "u", to: "ur" },
          { from: "d", to: "dr" },
        ])}
        <p>Deontology: Follows the moral ${key("rule")} or ${key("duty", "cyan")}, even if the result is ${key("bad", "pink")}</p>
      </div>`;
    case "professional":
      return `<div class="stack">
        <h2>Professional Ethics</h2>
        <p>Responsibilities and ethical behavior of professionals towards customers, coworkers, employers, users and ${key("everyone", "green")} affected by their work.</p>
        <h3>Professional Ethical qualities · HITACORL</h3>
        ${keywordMap("hitacorl", "HITACORL", "green", [
          { id: "H", letter: "H", meaning: "Honesty" },
          { id: "I", letter: "I", meaning: "Integrity" },
          { id: "T", letter: "T", meaning: "Transparency" },
          { id: "A", letter: "A", meaning: "Accountability" },
          { id: "C", letter: "C", meaning: "Confidentiality" },
          { id: "O", letter: "O", meaning: "Objectivity" },
          { id: "R", letter: "R", meaning: "Respectfulness" },
          { id: "L", letter: "L", meaning: "Obedience to Law" },
        ])}
        <hr />
        <h3>Whistleblowing</h3>
        <p>Whistleblowing means reporting serious wrongdoing illegal activity, fraud or corruption to an authority or the public.</p>
        <h3>The 3Rs of Ethics</h3>
        ${keywordMap("3rs", "R R R", "green", [
          { id: "rules", letter: "R", meaning: "Rules" },
          { id: "resp", letter: "R", meaning: "Responsibility" },
          { id: "respct", letter: "R", meaning: "Respect" },
        ])}
        <h3>Code of Ethics</h3>
        ${graphView("code", "green", [
          { id: "c", label: "Code of Ethics" },
          { id: "g", label: "guidance" },
          { id: "p", label: "responsible behavior" },
          { id: "d", label: "discourage unethical" },
          { id: "e", label: "educate" },
          { id: "t", label: "public trust" },
        ], [
          { from: "c", to: "g" },
          { from: "c", to: "p" },
          { from: "c", to: "d" },
          { from: "c", to: "e" },
          { from: "c", to: "t" },
        ])}
      </div>`;
    case "computer":
      return `<div class="stack">
        <h2>Computer Ethics</h2>
        <h3>Don't · HISSPUC</h3>
        ${keywordMap("hisspuc", "HISSPUC", "cyan", [
          { id: "H", letter: "H", meaning: "Harm" },
          { id: "I", letter: "I", meaning: "Interference" },
          { id: "S1", letter: "S", meaning: "Snoop" },
          { id: "S2", letter: "S", meaning: "Steal" },
          { id: "P", letter: "P", meaning: "Pirate" },
          { id: "U", letter: "U", meaning: "unauthorized use" },
          { id: "C", letter: "C", meaning: "copy" },
        ])}
        <h3>Types</h3>
        ${graphView("ce-types", "cyan", [
          { id: "t", label: "Types" },
          { id: "cc", label: "Cyber crimes", detail: "Personal Information" },
          { id: "pr", label: "Privacy" },
          { id: "prop", label: "Property" },
          { id: "cr", label: "Copyright" },
        ], [
          { from: "t", to: "cc" },
          { from: "t", to: "pr" },
          { from: "t", to: "prop" },
          { from: "t", to: "cr" },
        ])}
      </div>`;
    case "ip":
      return `<div class="stack">
        <h2>Part 2 → Intellectual Property</h2>
        <p>Intellectual property is a creation of human mind that receive legal protection.</p>
        ${graphView("ip4", "blue", [
          { id: "four", label: "4 Types" },
          { id: "c", label: "Copyright" },
          { id: "p", label: "Patent" },
          { id: "t", label: "Trademark" },
          { id: "s", label: "Trade secret" },
          { id: "ce", label: "creative expression" },
          { id: "inv", label: "Invention" },
          { id: "bi", label: "Brand Identity" },
          { id: "sbi", label: "Secret business information" },
        ], [
          { from: "four", to: "c" },
          { from: "four", to: "p" },
          { from: "four", to: "t" },
          { from: "four", to: "s" },
          { from: "c", to: "ce" },
          { from: "p", to: "inv" },
          { from: "t", to: "bi" },
          { from: "s", to: "sbi" },
        ])}
      </div>`;
    case "errors":
      return `<div class="stack">
        <h2>Part-3: Errors; Failure and Risks</h2>
        <h3>3 categories of Problems</h3>
        ${graphView("problems", "orange", [
          { id: "p", label: "Problems" },
          { id: "ind", label: "Individual", detail: "Affect one/few people · incorrect electricity bill" },
          { id: "sys", label: "System failures", detail: "Affects many people or cost huge amount of money · Banking system outage" },
          { id: "sc", label: "Safety critical", detail: "Injury, death or property damage" },
        ], [
          { from: "p", to: "ind" },
          { from: "p", to: "sys" },
          { from: "p", to: "sc" },
        ])}
        <h3>Why computer system fail? · TSCOM</h3>
        ${keywordMap("tscom", "TSCOM", "orange", [
          { id: "T", letter: "T", meaning: "Insufficient testing" },
          { id: "S", letter: "S", meaning: "Specification changes" },
          { id: "C", letter: "C", meaning: "Coding or software issue" },
          { id: "O", letter: "O", meaning: "overconfidence" },
          { id: "M", letter: "M", meaning: "mismanagement" },
        ])}
        <h3>A safety critical system needs · THRHPA</h3>
        ${keywordMap("thrhpa", "THRHPA", "orange", [
          { id: "T", letter: "T", meaning: "Testing" },
          { id: "H1", letter: "H", meaning: "Hardware safety mechanism" },
          { id: "R", letter: "R", meaning: "Redundancy" },
          { id: "H2", letter: "H", meaning: "Human oversight" },
          { id: "P", letter: "P", meaning: "Proper investigation" },
          { id: "A", letter: "A", meaning: "Accountability" },
        ])}
        <h3>Reliability and Safety</h3>
        ${graphView("rel-safe", "orange", [
          { id: "rel", label: "Reliability", detail: "How constantly a system performs correctly without failure." },
          { id: "saf", label: "Safety", detail: "Protection of people/property from harm caused by the system." },
        ], [{ from: "rel", to: "saf" }])}
      </div>`;
    case "privacy":
      return `<div class="stack">
        <h2>Part 4: Privacy and cybercrime</h2>
        <h3>Cyber Issues · PASSH</h3>
        ${keywordMap("passh", "PASSH", "pink", [
          { id: "P", letter: "P", meaning: "Privacy violation", extra: "having control over personal info, how its collected and shared" },
          { id: "A", letter: "A", meaning: "unAuthorized Access", extra: "Access data/system without permission" },
          { id: "S1", letter: "S", meaning: "Social engineering/Phishing", extra: "tricking people" },
          { id: "S2", letter: "S", meaning: "Security breach" },
          { id: "H", letter: "H", meaning: "Hacking" },
        ])}
      </div>`;
    case "ai":
      return `<div class="stack">
        <h2>Part 5: AI Ethics and Fairness</h2>
        <p>treating people equally without unfair ${key("bias", "pink")} and ${key("discrimination")}.</p>
        <h3>Types of AI Bias</h3>
        ${graphView("bias-types", "blue", [
          { id: "b", label: "AI Bias" },
          { id: "g", label: "Gender bias", detail: "rejects women" },
          { id: "r", label: "Racial bias", detail: "darker skin tone" },
          { id: "a", label: "Age bias", detail: "older get cut" },
          { id: "d", label: "Disability bias" },
          { id: "l", label: "Language bias" },
        ], [
          { from: "b", to: "g" },
          { from: "b", to: "r" },
          { from: "b", to: "a" },
          { from: "b", to: "d" },
          { from: "b", to: "l" },
        ])}
        <h3>Why AI bias happen · BB US</h3>
        ${keywordMap("bbus", "BB US", "blue", [
          { id: "B1", letter: "B", meaning: "Bad data" },
          { id: "B2", letter: "B", meaning: "Bad model" },
          { id: "U", letter: "U", meaning: "unfair decision" },
          { id: "S", letter: "S", meaning: "Social harm" },
        ])}
        <p class="muted">Also → Biased training data · poor algorithm · Historical inequality</p>
        <h3>How to reduce AI Bias</h3>
        ${graphView("reduce", "blue", [
          { id: "red", label: "Reduce bias" },
          { id: "bef", label: "Before training", detail: "Diverse data" },
          { id: "dur", label: "During training", detail: "Fairness-aware Algorithm" },
          { id: "aft", label: "After training", detail: "Audit prediction" },
          { id: "cont", label: "And continuously", detail: "Human oversight + monitoring" },
        ], [
          { from: "red", to: "bef" },
          { from: "bef", to: "dur" },
          { from: "dur", to: "aft" },
          { from: "aft", to: "cont" },
        ])}
        <h3>AI Ethical Risk · P B S L J M D</h3>
        ${keywordMap("pbsljmd", "PBSLJMD", "blue", [
          { id: "P", letter: "P", meaning: "Privacy" },
          { id: "B", letter: "B", meaning: "Bias" },
          { id: "S", letter: "S", meaning: "Security" },
          { id: "L", letter: "L", meaning: "Loss of human control" },
          { id: "J", letter: "J", meaning: "Job displacement" },
          { id: "M", letter: "M", meaning: "Misinformation" },
          { id: "D", letter: "D", meaning: "Deepfakes" },
        ])}
      </div>`;
    default:
      return "";
  }
}

function render() {
  const tabs = document.getElementById("tabs");
  tabs.innerHTML = PARTS.map(
    (p) =>
      `<button class="pill ${state.part === p.id ? "active" : ""}" data-part="${p.id}">${p.label}</button>`,
  ).join("");
  const drill = document.getElementById("drill");
  drill.textContent = state.hide ? "Drill on" : "Show all";
  drill.className = state.hide ? "btn on" : "btn";
  document.getElementById("view").innerHTML = renderPart();
}

document.getElementById("tabs").addEventListener("click", (e) => {
  const btn = e.target.closest("[data-part]");
  if (!btn) return;
  state.part = btn.dataset.part;
  render();
});

document.getElementById("drill").addEventListener("click", () => {
  state.hide = !state.hide;
  render();
});

document.getElementById("view").addEventListener("click", (e) => {
  const pick = e.target.closest("[data-pick]");
  if (pick) {
    const [gid, nid] = pick.dataset.pick.split(":");
    state.picked[gid] = nid;
    render();
    return;
  }
  const tog = e.target.closest("[data-toggle]");
  if (tog) {
    const [mid, iid] = tog.dataset.toggle.split(":");
    const open = state.open[mid] || [];
    state.open[mid] = open.includes(iid) ? open.filter((x) => x !== iid) : [...open, iid];
    render();
  }
});

render();
