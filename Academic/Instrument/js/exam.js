(function () {
  const KEY = "instr-2mark-known";
  const parts = window.PARTS;
  const questions = window.QUESTIONS;
  const coreCount = questions.filter((q) => q.core).length;

  const state = {
    mode: "all",
    part: "All",
    query: "",
    done: loadDone()
  };

  function loadDone() {
    try { return JSON.parse(localStorage.getItem(KEY) || "[]"); } catch { return []; }
  }
  function saveDone() {
    localStorage.setItem(KEY, JSON.stringify(state.done));
  }
  function esc(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }
  function matches(q) {
    const s = state.query.trim().toLowerCase();
    if (!s) return true;
    const blob = [
      q.n, q.title, q.part, q.formula || "", q.example || "",
      ...(q.points || []),
      ...((q.defs || []).flat())
    ].join(" ").toLowerCase();
    return blob.includes(s);
  }
  function filtered() {
    return questions.filter((q) => {
      if (state.mode === "core" && !q.core) return false;
      if (state.part !== "All" && q.part !== state.part) return false;
      return matches(q);
    });
  }

  function answerHtml(q) {
    let h = "";
    if (q.fig) h += window.examFigure(q.fig);
    (q.defs || []).forEach(([term, def]) => {
      h += `<p><b>${esc(term)}:</b> ${esc(def)}</p>`;
    });
    if (q.points) {
      h += "<ul>" + q.points.map((p) => `<li>${esc(p)}</li>`).join("") + "</ul>";
    }
    if (q.formula) h += `<div class="fx">${esc(q.formula)}</div>`;
    if (q.table) {
      h += "<table class=\"cmp\"><thead><tr>" +
        q.table.headers.map((x) => `<th>${esc(x)}</th>`).join("") +
        "</tr></thead><tbody>" +
        q.table.rows.map((r) => "<tr>" + r.map((c) => `<td>${esc(c)}</td>`).join("") + "</tr>").join("") +
        "</tbody></table>";
    }
    if (q.example) h += `<div class="ex"><b>Example</b>${esc(q.example)}</div>`;
    return h;
  }

  function render() {
    const list = filtered();
    document.getElementById("stat-known").textContent = state.done.length + "/60";
    document.getElementById("stat-core").textContent = String(coreCount);
    document.getElementById("showing").textContent =
      "Showing " + list.length + " · known in view " + list.filter((q) => state.done.includes(q.n)).length;

    document.querySelectorAll("[data-mode]").forEach((el) => {
      el.classList.toggle("on", el.getAttribute("data-mode") === state.mode);
    });
    document.querySelectorAll("[data-part]").forEach((el) => {
      el.classList.toggle("on", el.getAttribute("data-part") === state.part);
    });

    const showMap = state.part === "All" && !state.query && state.mode === "all";
    const mapEl = document.getElementById("topic-map");
    const mapTitle = document.getElementById("map-title");
    mapEl.hidden = !showMap;
    if (mapTitle) mapTitle.hidden = !showMap;
    if (showMap) {
      mapEl.innerHTML = parts.map((p) => {
        const items = questions.filter((q) => q.part === p.id);
        const known = items.filter((q) => state.done.includes(q.n)).length;
        return `<div class="map-item">
          <div><span class="swatch c-${p.color}"></span><b>${esc(p.id)}</b></div>
          <small>${esc(p.qs)} · ${known}/${items.length} known</small>
        </div>`;
      }).join("");
    }

    const root = document.getElementById("groups");
    if (!list.length) {
      root.innerHTML = `<p class="empty">No matching question. Try another word.</p>`;
      return;
    }
    root.innerHTML = parts.map((p) => {
      const items = list.filter((q) => q.part === p.id);
      if (!items.length) return "";
      return `<section class="group">
        <div class="group-h">
          <span class="swatch c-${p.color}"></span>
          <h2>${esc(p.id)}</h2>
          <span class="qs">${esc(p.qs)}</span>
        </div>
        ${items.map((q) => {
          const known = state.done.includes(q.n);
          return `<details class="q">
            <summary>
              <span class="q-title">Q${q.n}. ${esc(q.title)}</span>
              ${q.core ? `<span class="core">Core</span>` : ""}
              <label class="known" onclick="event.stopPropagation()">
                <input type="checkbox" data-n="${q.n}" ${known ? "checked" : ""}/> Known
              </label>
            </summary>
            <div class="ans">${answerHtml(q)}</div>
          </details>`;
        }).join("")}
      </section>`;
    }).join("");
  }

  document.getElementById("pills-mode").addEventListener("click", (e) => {
    const btn = e.target.closest("[data-mode]");
    if (!btn) return;
    state.mode = btn.getAttribute("data-mode");
    render();
  });
  document.getElementById("pills-part").addEventListener("click", (e) => {
    const btn = e.target.closest("[data-part]");
    if (!btn) return;
    state.part = btn.getAttribute("data-part");
    render();
  });
  document.getElementById("search").addEventListener("input", (e) => {
    state.query = e.target.value;
    render();
  });
  document.getElementById("groups").addEventListener("change", (e) => {
    const n = Number(e.target.getAttribute("data-n"));
    if (!n) return;
    if (e.target.checked) {
      if (!state.done.includes(n)) state.done.push(n);
    } else {
      state.done = state.done.filter((x) => x !== n);
    }
    saveDone();
    render();
  });

  const partRow = document.getElementById("pills-part");
  partRow.innerHTML =
    `<button class="pill on" data-part="All">All topics</button>` +
    parts.map((p) => `<button class="pill" data-part="${esc(p.id)}">${esc(p.id)}</button>`).join("");

  render();
})();
