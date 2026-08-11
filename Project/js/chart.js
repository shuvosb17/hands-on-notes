const CHART_COLORS = ["#58a6ff", "#d29922", "#3fb950"];

function buildCurveData() {
  return [
    {
      name: "Star alpha (1-d)^1.8",
      data: Array.from({ length: 11 }, (_, i) => Number(Math.pow(1 - i / 10, 1.8).toFixed(3))),
    },
    {
      name: "Twilight 1-|d-0.5|*2",
      data: Array.from({ length: 11 }, (_, i) =>
        Number(clampf(1 - Math.abs(i / 10 - 0.5) * 2, 0, 1).toFixed(3)),
      ),
    },
    {
      name: "Sun alpha smoothstep",
      data: Array.from({ length: 11 }, (_, i) =>
        Number(smoothstep(0.2, 0.65, i / 10).toFixed(3)),
      ),
    },
  ];
}

function renderLineChart(container, series, height = 230) {
  const W = 800;
  const H = height;
  const pad = { l: 48, r: 16, t: 24, b: 36 };
  const plotW = W - pad.l - pad.r;
  const plotH = H - pad.t - pad.b;
  const n = series[0]?.data.length ?? 0;

  const toX = (i) => pad.l + (i / (n - 1)) * plotW;
  const toY = (v) => pad.t + plotH - v * plotH;

  let html = `<svg viewBox="0 0 ${W} ${H}" class="chart-svg" preserveAspectRatio="xMidYMid meet">`;

  [0, 0.25, 0.5, 0.75, 1].forEach((v) => {
    html += `<g>
      <line x1="${pad.l}" y1="${toY(v)}" x2="${W - pad.r}" y2="${toY(v)}" stroke="#30363d" stroke-width="1"/>
      <text x="${pad.l - 8}" y="${toY(v) + 4}" text-anchor="end" font-size="10" fill="#6e7681">${v.toFixed(2)}</text>
    </g>`;
  });

  series.forEach((s, si) => {
    const pts = s.data.map((v, i) => `${toX(i)},${toY(v)}`).join(" ");
    html += `<g>
      <polyline points="${pts}" fill="none" stroke="${CHART_COLORS[si % CHART_COLORS.length]}" stroke-width="2"/>`;
    s.data.forEach((v, i) => {
      html += `<circle cx="${toX(i)}" cy="${toY(v)}" r="3" fill="${CHART_COLORS[si % CHART_COLORS.length]}"/>`;
    });
    html += "</g>";
  });

  series.forEach((s, si) => {
    html += `<g transform="translate(${pad.l + si * 180}, 8)">
      <rect width="10" height="10" fill="${CHART_COLORS[si % CHART_COLORS.length]}" rx="2"/>
      <text x="16" y="9" font-size="10" fill="#8b949e">${s.name}</text>
    </g>`;
  });

  html += `<text x="${W / 2}" y="${H - 6}" text-anchor="middle" font-size="10" fill="#6e7681">daylight (0 = night, 1 = day)</text>`;
  html += "</svg>";
  container.innerHTML = html;
}
