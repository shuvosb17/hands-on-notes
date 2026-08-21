function sceneCloud(cx, cy, s, fill) {
  const puffs = [
    [cx - 0.12 * s, cy, 0.12 * s, 0.07 * s],
    [cx, cy + 0.02 * s, 0.16 * s, 0.09 * s],
    [cx + 0.15 * s, cy, 0.13 * s, 0.075 * s],
    [cx + 0.03 * s, cy - 0.03 * s, 0.18 * s, 0.08 * s],
  ];
  return puffs
    .map(
      ([px, py, rx, ry]) =>
        `<ellipse cx="${SX(px)}" cy="${SY(py)}" rx="${rx * SCALE}" ry="${ry * SCALE}" fill="${fill}"/>`
    )
    .join("");
}

function sceneTree(x, y, s, trunk, leaf1, leaf2) {
  return `<g>
    <rect x="${SX(x - 0.018 * s)}" y="${SY(y + 0.18 * s)}" width="${0.036 * s * SCALE}" height="${0.18 * s * SCALE}" fill="${trunk}"/>
    <ellipse cx="${SX(x - 0.06 * s)}" cy="${SY(y + 0.18 * s)}" rx="${0.09 * s * SCALE}" ry="${0.08 * s * SCALE}" fill="${leaf1}"/>
    <ellipse cx="${SX(x + 0.05 * s)}" cy="${SY(y + 0.2 * s)}" rx="${0.1 * s * SCALE}" ry="${0.09 * s * SCALE}" fill="${leaf2}"/>
    <ellipse cx="${SX(x)}" cy="${SY(y + 0.26 * s)}" rx="${0.13 * s * SCALE}" ry="${0.1 * s * SCALE}" fill="${leaf1}"/>
    <ellipse cx="${SX(x + 0.01 * s)}" cy="${SY(y + 0.14 * s)}" rx="${0.14 * s * SCALE}" ry="${0.08 * s * SCALE}" fill="${leaf2}"/>
  </g>`;
}

function sceneBench(x, y, s, wood, metal) {
  const bar = (bx, by, w, h, fill) =>
    `<rect x="${SX(bx)}" y="${SY(by + h)}" width="${w * SCALE}" height="${h * SCALE}" fill="${fill}"/>`;
  return `<g>
    ${bar(x + 0.01 * s, y - 0.025 * s, 0.008 * s, 0.025 * s, metal)}
    ${bar(x + 0.08 * s, y - 0.025 * s, 0.008 * s, 0.025 * s, metal)}
    ${bar(x, y, 0.1 * s, 0.012 * s, wood)}
    ${bar(x, y + 0.03 * s, 0.1 * s, 0.012 * s, wood)}
  </g>`;
}

function sceneLabel(x, y, txt) {
  const w = txt.length * 6.1 + 8;
  return `<g>
    <rect x="${SX(x) - 2}" y="${SY(y) - 11}" width="${w}" height="15" rx="3" fill="#161b22" opacity="0.88"/>
    <text x="${SX(x) + 2}" y="${SY(y)}" font-size="10" fill="#8b949e" font-family="JetBrains Mono, monospace">${txt}</text>
  </g>`;
}

function renderLiveScene({ daylight, phase, season, showLabels, showOthers }) {
  const p = SEASONS[season];
  const twilight = clampf(1 - Math.abs(daylight - 0.5) * 2, 0, 1);
  const top = mixColor(p.topNight, p.topDay, daylight);
  const mid = mixColor(p.midNight, p.midDay, daylight);
  const bot = mixColor(p.botNight, p.botDay, daylight);

  const BANDS = 30;
  const lowerBands = Array.from({ length: BANDS }, (_, i) => ({
    y0: lerpf(-1.1, 0.1, i / BANDS),
    y1: lerpf(-1.1, 0.1, (i + 1) / BANDS),
    c: mixColor(bot, mid, (i + 0.5) / BANDS),
  }));
  const upperBands = Array.from({ length: BANDS }, (_, i) => ({
    y0: lerpf(0.1, 1.1, i / BANDS),
    y1: lerpf(0.1, 1.1, (i + 1) / BANDS),
    c: mixColor(mid, top, (i + 0.5) / BANDS),
  }));

  const tNorm = (((phase / (2 * PI)) % 1) + 1) % 1;
  const sunA = PI * (1.15 - 1.3 * tNorm);
  const moonA = sunA + PI;
  const sunX = 1.45 * Math.cos(sunA);
  const sunY = -0.08 + 0.92 * Math.sin(sunA);
  const moonX = 1.45 * Math.cos(moonA);
  const moonY = -0.08 + 0.92 * Math.sin(moonA);
  const sunAlpha = smoothstep(0.2, 0.65, daylight);
  const moonAlpha = smoothstep(0.2, 0.8, 1 - daylight);
  const starAlpha = Math.pow(1 - daylight, 1.8);

  const nearG = mixColor(p.grassNearNight, p.grassNearDay, daylight);
  const farG = mixColor(p.grassFarNight, p.grassFarDay, daylight);
  const GBANDS = 16;
  const groundBands = Array.from({ length: GBANDS }, (_, i) => ({
    y0: lerpf(-1.1, -0.3, i / GBANDS),
    y1: lerpf(-1.1, -0.3, (i + 1) / GBANDS),
    c: mixColor(nearG, farG, (i + 0.5) / GBANDS),
  }));
  const path1 = mixColor(C(0.18, 0.18, 0.2), C(0.79, 0.77, 0.72), daylight);

  const trunk = mixColor(C(0.1, 0.07, 0.05), C(0.4, 0.26, 0.12), daylight);
  const leaf1 = mixColor(p.leafNight, p.leafDay, daylight);
  const leaf2 = mixColor(p.leafNight, p.leafDay, daylight * 0.88);
  const wood = mixColor(C(0.14, 0.1, 0.08), C(0.52, 0.34, 0.18), daylight);
  const metal = mixColor(C(0.18, 0.2, 0.24), C(0.7, 0.72, 0.75), daylight);
  const pole = mixColor(C(0.18, 0.18, 0.22), C(0.72, 0.72, 0.75), daylight);

  let cloudDay = C(1, 1, 1, 0.96);
  let cloudNight = C(0.42, 0.46, 0.56, 0.5);
  if (season === "MONSOON") {
    cloudDay = C(0.48, 0.52, 0.58, 0.92);
    cloudNight = C(0.14, 0.16, 0.2, 0.72);
  } else if (season === "HEMANTA") {
    cloudDay = C(0.88, 0.84, 0.76, 0.88);
    cloudNight = C(0.28, 0.26, 0.24, 0.55);
  }
  const cloudC = css(mixColor(cloudNight, cloudDay, daylight));
  const cloudShift = (((phase * 0.29) % 5.2) + 5.2) % 5.2 - 2.6;

  const flagPts = [];
  const flagBack = [];
  for (let i = 0; i <= 30; i++) {
    const ft = i / 30;
    const fx = -1.56 + ft * 0.24;
    const wave = 0.018 * Math.sin(phase * 28 + ft * 7);
    flagPts.push(`${SX(fx)},${SY(0.28 + wave)}`);
    flagBack.unshift(`${SX(fx)},${SY(0.18 + wave)}`);
  }

  let html = `<svg viewBox="0 0 880 440" class="scene-svg">`;

  lowerBands.forEach((b, i) => {
    html += `<rect x="0" y="${SY(b.y1)}" width="880" height="${SY(b.y0) - SY(b.y1) + 1}" fill="${css(b.c)}"/>`;
  });
  upperBands.forEach((b, i) => {
    html += `<rect x="0" y="${SY(b.y1)}" width="880" height="${SY(b.y0) - SY(b.y1) + 1}" fill="${css(b.c)}"/>`;
  });
  html += `<rect x="0" y="${SY(0.55)}" width="880" height="${SY(-0.15) - SY(0.55)}" fill="${css(C(1.0, 0.58, 0.22, 0.2 * twilight))}"/>`;

  if (starAlpha > 0.01) {
    STARS.forEach((s, i) => {
      const tw = 0.55 + 0.45 * Math.sin(phase * 2.2 + s.phase);
      html += `<circle cx="${SX(s.x)}" cy="${SY(s.y)}" r="${Math.max(1.2, s.s * SCALE * 2.2)}" fill="${css(C(1, 1, 0.96, starAlpha * tw))}"/>`;
    });
  }

  if (sunAlpha > 0.01) {
    html += `<g>
      <circle cx="${SX(sunX)}" cy="${SY(sunY)}" r="${0.14 * SCALE}" fill="${css(C(1, 0.88, 0.2, 0.12 * sunAlpha))}"/>`;
    for (let i = 0; i < 12; i++) {
      const a = (i * 30 * PI) / 180;
      html += `<line x1="${SX(sunX + 0.11 * Math.cos(a))}" y1="${SY(sunY + 0.11 * Math.sin(a))}" x2="${SX(sunX + 0.18 * Math.cos(a))}" y2="${SY(sunY + 0.18 * Math.sin(a))}" stroke="${css(C(1, 0.92, 0.25, 0.9 * sunAlpha))}" stroke-width="1.5"/>`;
    }
    html += `<circle cx="${SX(sunX)}" cy="${SY(sunY)}" r="${0.09 * SCALE}" fill="${css(C(1, 0.93, 0.28, 0.95 * sunAlpha))}"/></g>`;
  }

  if (moonAlpha > 0.01) {
    html += `<g>
      <circle cx="${SX(moonX)}" cy="${SY(moonY)}" r="${0.115 * SCALE}" fill="${css(C(0.78, 0.86, 1, 0.08 * moonAlpha))}"/>
      <circle cx="${SX(moonX)}" cy="${SY(moonY)}" r="${0.092 * SCALE}" fill="${css(C(0.96, 0.97, 1, 0.96 * moonAlpha))}" stroke="${css(C(1, 1, 1, 0.55 * moonAlpha))}" stroke-width="1"/>
      <ellipse cx="${SX(moonX - 0.026)}" cy="${SY(moonY + 0.022)}" rx="${0.014 * SCALE}" ry="${0.009 * SCALE}" fill="${css(C(0.72, 0.75, 0.82, 0.28 * moonAlpha))}"/>
      <ellipse cx="${SX(moonX + 0.03)}" cy="${SY(moonY - 0.018)}" rx="${0.011 * SCALE}" ry="${0.007 * SCALE}" fill="${css(C(0.7, 0.73, 0.8, 0.24 * moonAlpha))}"/>
    </g>`;
  }

  html += `<g transform="translate(${cloudShift * SCALE}, 0)">
    ${sceneCloud(-1.45, 0.72, 1.1, cloudC)}
    ${sceneCloud(-0.45, 0.8, 1.0, cloudC)}
    ${sceneCloud(0.65, 0.74, 1.2, cloudC)}
    ${sceneCloud(1.55, 0.84, 0.9, cloudC)}
  </g>`;

  if (twilight > 0.05) {
    html += `<rect x="0" y="${SY(-0.33)}" width="880" height="${0.22 * SCALE}" fill="${css(C(0.92, 0.94, 0.98, 0.1 * twilight))}"/>`;
  }

  groundBands.forEach((b) => {
    html += `<rect x="0" y="${SY(b.y1)}" width="880" height="${SY(b.y0) - SY(b.y1) + 1}" fill="${css(b.c)}"/>`;
  });
  html += `<rect x="0" y="${SY(-0.34)}" width="880" height="${0.04 * SCALE}" fill="${css(mixColor(C(0.05, 0.1, 0.05, 0.9), C(0.34, 0.62, 0.2, 0.7), daylight))}"/>`;
  html += `<ellipse cx="${SX(0.02)}" cy="${SY(-0.35)}" rx="${1.35 * SCALE}" ry="${0.055 * SCALE}" fill="${css(C(0, 0, 0, 0.08 + 0.12 * (1 - daylight)))}"/>`;
  html += `<polygon points="${SX(-0.1)},${SY(-1.05)} ${SX(0.1)},${SY(-1.05)} ${SX(0.06)},${SY(-0.35)} ${SX(-0.06)},${SY(-0.35)}" fill="${css(path1)}"/>`;

  if (showOthers) {
    html += `<g opacity="0.42">
      <rect x="${SX(-0.95)}" y="${SY(0.34)}" width="${1.9 * SCALE}" height="${0.72 * SCALE}" fill="#30363d"/>
      <rect x="${SX(-0.28)}" y="${SY(0.46)}" width="${0.56 * SCALE}" height="${0.84 * SCALE}" fill="#484f58"/>
    </g>`;
  }

  html += sceneTree(-1.85, -0.43, 1.35, css(trunk), css(leaf1), css(leaf2));
  html += sceneTree(-1.62, -0.43, 1.22, css(trunk), css(leaf1), css(leaf2));
  html += sceneTree(-1.38, -0.43, 1.08, css(trunk), css(leaf1), css(leaf2));
  html += sceneTree(1.82, -0.43, 0.95, css(trunk), css(leaf1), css(leaf2));
  html += sceneTree(1.62, -0.43, 1.02, css(trunk), css(leaf1), css(leaf2));

  html += `<line x1="${SX(-1.56)}" y1="${SY(-0.35)}" x2="${SX(-1.56)}" y2="${SY(0.3)}" stroke="${css(pole)}" stroke-width="3"/>`;
  html += `<polygon points="${[...flagPts, ...flagBack].join(" ")}" fill="${css(C(0.0, 0.42, 0.18))}"/>`;
  html += `<circle cx="${SX(-1.46)}" cy="${SY(0.23)}" r="${0.026 * SCALE}" fill="${css(C(0.88, 0.08, 0.08))}"/>`;

  html += sceneBench(-1.92, -0.5, 0.75, css(wood), css(metal));
  html += sceneBench(1.88, -0.5, 0.75, css(wood), css(metal));

  if (showLabels) {
    html += sceneLabel(-2.12, 0.95, "drawSky()");
    if (sunAlpha > 0.3) html += sceneLabel(sunX - 0.18, sunY + 0.26, "drawSunMoon()");
    if (moonAlpha > 0.3) html += sceneLabel(moonX - 0.18, moonY + 0.26, "drawSunMoon()");
    if (starAlpha > 0.3) html += sceneLabel(-2.12, 0.62, "drawStars()");
    html += sceneLabel(0.35, 0.86, "drawCloudLayer()");
    html += sceneLabel(-2.12, -0.55, "drawGround()");
    html += sceneLabel(-1.9, 0.14, "drawTree()");
    html += sceneLabel(-1.56, 0.4, "drawFlag()");
    html += sceneLabel(1.55, -0.52, "drawBench()");
    if (twilight > 0.3) html += sceneLabel(0.9, -0.4, "drawTwilightFog()");
  }

  html += "</svg>";
  return html;
}
