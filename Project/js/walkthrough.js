const WALKTHROUGH_BLOCKS = [
  {
    title: "1. getDaylight() — the heart of the whole project",
    lines: "main.cpp 255–258",
    defaultOpen: true,
    code: `float getDaylight() {
    if (!autoCycle) return manualDaylight;
    return 0.5f * (sinf(dayPhase) + 1.0f);
}`,
    annotations: [
      {
        line: "if (!autoCycle)",
        note: "When the user presses D or N, autoCycle becomes false and we bypass the animation completely, returning the frozen value instead.",
      },
      {
        line: "return manualDaylight;",
        note: "D sets this to 1.0 (permanent day), N sets it to 0.0 (permanent night). Both are set in keyboard() at lines 2532 to 2541.",
      },
      {
        line: "sinf(dayPhase)",
        note: "dayPhase grows by 0.0028 every frame in timer(), so this produces a value smoothly sweeping between -1 and +1.",
      },
      {
        line: "0.5f * (... + 1.0f)",
        note: "Adding 1 shifts the range from [-1,1] to [0,2]; multiplying by 0.5 compresses it to [0,1] — exactly the range every draw function expects.",
      },
    ],
    takeaway:
      "This four-line function is the single input that controls the colour of every pixel in the scene. Nothing else in my module is as important.",
  },
  {
    title: "2. drawSky() — gradient interpolation and the twilight overlay",
    lines: "main.cpp 801–871",
    code: `void drawSky(float daylight) {
    float twilight = 1.0f - fabsf(daylight - 0.5f) * 2.0f;
    twilight = clampf(twilight, 0.0f, 1.0f);

    Color topDay = C(0.36f, 0.72f, 0.96f);   // deep blue overhead
    Color midDay = C(0.64f, 0.88f, 1.00f);   // pale blue
    Color botDay = C(0.90f, 0.96f, 1.00f);   // near-white horizon
    Color topNight = C(0.02f, 0.04f, 0.10f);
    Color midNight = C(0.04f, 0.08f, 0.16f);
    Color botNight = C(0.09f, 0.12f, 0.22f);

    switch (currentSeason) { /* per-season palette overrides */ }

    Color top = mixColor(topNight, topDay, daylight);
    Color mid = mixColor(midNight, midDay, daylight);
    Color bot = mixColor(botNight, botDay, daylight);

    glBegin(GL_QUADS);                       // lower half of the sky
    setColor(bot); glVertex2f(-2.2f, -1.1f); glVertex2f( 2.2f, -1.1f);
    setColor(mid); glVertex2f( 2.2f, 0.10f); glVertex2f(-2.2f, 0.10f);
    glEnd();

    glBegin(GL_QUADS);                       // upper half of the sky
    setColor(mid); glVertex2f(-2.2f, 0.10f); glVertex2f( 2.2f, 0.10f);
    setColor(top); glVertex2f( 2.2f, 1.10f); glVertex2f(-2.2f, 1.10f);
    glEnd();

    Color warm = C(1.00f, 0.58f, 0.22f, 0.20f * twilight);
    glBegin(GL_QUADS);                       // sunrise / sunset glow
    setColor(warm); glVertex2f(-2.2f, -0.15f); glVertex2f( 2.2f, -0.15f);
    setColor(C(warm.r, warm.g, warm.b, 0.0f));
    glVertex2f( 2.2f, 0.55f); glVertex2f(-2.2f, 0.55f);
    glEnd();
}`,
    annotations: [
      {
        line: "1.0f - fabsf(daylight - 0.5f) * 2.0f",
        note: "Distance from 0.5, inverted. It equals 1 exactly at sunrise and sunset, and falls to 0 at both midnight and noon.",
      },
      {
        line: "three colour stops",
        note: "Real sky is darkest overhead and brightest at the horizon, so I use three stops instead of two — the extra stop is what makes it look natural.",
      },
      {
        line: "switch (currentSeason)",
        note: "Season overrides only replace the constants. The blending logic below is unchanged, so seasons and day/night are independent inputs.",
      },
      {
        line: "mixColor(night, day, daylight)",
        note: "Linear interpolation per channel. This exact line pattern is repeated in every drawing function in the project.",
      },
      {
        line: "setColor() between glVertex2f pairs",
        note: "OpenGL stores a colour per vertex and interpolates across the fragments — that is Gouraud shading, and it is why I get a gradient without drawing a single extra polygon.",
      },
      {
        line: "alpha 0.20f * twilight then 0.0f",
        note: "The overlay quad fades from warm orange at the horizon to fully transparent higher up, and the whole thing scales with twilight so it vanishes at noon and midnight.",
      },
    ],
    takeaway:
      "Three interpolated colour stops plus one alpha-faded overlay quad — that is the entire sky. Total cost is three quads per frame.",
  },
  {
    title: "3. drawStars() — non-linear fade and independent twinkle",
    lines: "main.cpp 873–882",
    code: `void drawStars(float daylight) {
    float alpha = powf(1.0f - daylight, 1.8f);
    if (alpha < 0.01f) return;                  // early out in daytime

    for (int i = 0; i < STAR_COUNT; ++i) {
        float tw = 0.55f + 0.45f * sinf(dayPhase * 2.2f + stars[i].phase);
        Color sc = C(1.0f, 1.0f, 0.96f, alpha * tw);
        filledCircle(stars[i].x, stars[i].y, stars[i].s, sc);
    }
}`,
    annotations: [
      {
        line: "powf(1.0f - daylight, 1.8f)",
        note: "Inverted so stars are brightest at night. The 1.8 exponent bends the curve so they stay invisible until the sky is genuinely dark.",
      },
      {
        line: "if (alpha < 0.01f) return;",
        note: "An optimisation: during daytime we skip the 42-iteration loop entirely instead of drawing invisible circles.",
      },
      {
        line: "stars[i].phase",
        note: "Each star got a random phase in initStars(), so they twinkle out of step. Without it all 42 stars would pulse in unison and look artificial.",
      },
      {
        line: "0.55f + 0.45f * sinf(...)",
        note: "Maps the sine to the range 0.10 to 1.00, so a star dims but never disappears completely mid-twinkle.",
      },
      {
        line: "alpha * tw",
        note: "The global night fade multiplied by the per-star twinkle — two independent effects combined into one alpha value.",
      },
    ],
    takeaway:
      "A global fade term times a per-object random-phase term is the standard trick for making many identical objects feel alive.",
  },
  {
    title: "4. drawSunMoon() — parametric arcs and smoothstep opacity",
    lines: "main.cpp 884–937",
    code: `void drawSunMoon(float daylight) {
    float t = fmodf(dayPhase / (2.0f * PI), 1.0f);
    if (t < 0.0f) t += 1.0f;

    float sunA  = PI * (1.15f - 1.30f * t);   // sweeps across the sky
    float moonA = sunA + PI;                  // always exactly opposite

    float sunX  = 1.45f * cosf(sunA);
    float sunY  = -0.08f + 0.92f * sinf(sunA);
    float moonX = 1.45f * cosf(moonA);
    float moonY = -0.08f + 0.92f * sinf(moonA);

    float sunAlpha  = smoothstep(0.20f, 0.65f, daylight);
    float moonAlpha = smoothstep(0.20f, 0.80f, 1.0f - daylight);

    if (sunAlpha > 0.01f) {
        filledCircle(sunX, sunY, 0.09f, C(1.0f, 0.93f, 0.28f, 0.95f*sunAlpha));
        filledCircle(sunX, sunY, 0.14f, C(1.0f, 0.88f, 0.20f, 0.12f*sunAlpha));
        for (int i = 0; i < 12; ++i) {        // 12 rays, 30 degrees apart
            float a = i * 30.0f * PI / 180.0f;
            glBegin(GL_LINES);
            glVertex2f(sunX + 0.11f*cosf(a), sunY + 0.11f*sinf(a));
            glVertex2f(sunX + 0.18f*cosf(a), sunY + 0.18f*sinf(a));
            glEnd();
        }
    }

    if (moonAlpha > 0.01f) {
        filledCircle(moonX, moonY, 0.115f, /* soft outer glow  */ ...);
        filledCircle(moonX, moonY, 0.092f, /* bright moon disk */ ...);
        filledEllipse(/* four subtle craters */);
        midpointCircleOutline(moonX, moonY, 0.092f, /* crisp rim */ ...);
    }
}`,
    annotations: [
      {
        line: "fmodf(dayPhase / (2*PI), 1.0f)",
        note: "Normalises the ever-growing dayPhase into a repeating 0-to-1 position within the current cycle.",
      },
      {
        line: "moonA = sunA + PI",
        note: "Adding PI radians is half a revolution, which guarantees the moon is diametrically opposite the sun. One line replaces a whole second set of equations.",
      },
      {
        line: "1.45f * cosf, 0.92f * sinf",
        note: "Parametric equation of an ellipse. The x-radius is larger than the y-radius so the arc is wide and shallow, like the real sun's path.",
      },
      {
        line: "-0.08f +",
        note: "Vertical offset that pushes the arc centre below the horizon so both bodies actually rise and set instead of circling in mid-air.",
      },
      {
        line: "smoothstep(0.20f, 0.65f, daylight)",
        note: "Hard 0 below 0.20, hard 1 above 0.65, eased cubic in between. The sun and moon ranges deliberately overlap so both can be faintly visible at dawn.",
      },
      {
        line: "midpointCircleOutline(...)",
        note: "This is the required midpoint circle algorithm being used in the real scene, not just in the demo overlay — it strokes the moon's rim.",
      },
    ],
    takeaway:
      "Two bodies, one angle. Everything else is a parametric ellipse and a smoothstep fade.",
  },
  {
    title: "5. drawCloudLayer() — one transformation moves four clouds",
    lines: "main.cpp 939–968",
    code: `void drawCloud(float cx, float cy, float s, float daylight) {
    Color cc = mixColor(nightC, dayC, daylight);
    filledEllipse(cx - 0.12f*s, cy,            0.12f*s, 0.07f*s,  cc);
    filledEllipse(cx,           cy + 0.02f*s,  0.16f*s, 0.09f*s,  cc);
    filledEllipse(cx + 0.15f*s, cy,            0.13f*s, 0.075f*s, cc);
    filledEllipse(cx + 0.03f*s, cy - 0.03f*s,  0.18f*s, 0.08f*s,  cc);
}

void drawCloudLayer(float daylight) {
    glPushMatrix();
    glTranslatef(cloudShift, 0.0f, 0.0f);
    drawCloud(-1.45f, 0.72f, 1.1f, daylight);
    drawCloud(-0.45f, 0.80f, 1.0f, daylight);
    drawCloud( 0.65f, 0.74f, 1.2f, daylight);
    drawCloud( 1.55f, 0.84f, 0.9f, daylight);
    glPopMatrix();
}`,
    annotations: [
      {
        line: "four overlapping ellipses",
        note: "No cloud texture is used. Overlapping soft ellipses of different radii give a convincing puffy silhouette from primitives alone.",
      },
      {
        line: "everything multiplied by s",
        note: "A single scale parameter, so one function draws every cloud size. This is a uniform scaling transformation done arithmetically.",
      },
      {
        line: "glPushMatrix()",
        note: "Saves the current modelview matrix onto the stack so I can modify it safely.",
      },
      {
        line: "glTranslatef(cloudShift, 0, 0)",
        note: "A 2D translation applied once to the whole group. I animate one variable instead of updating four separate positions.",
      },
      {
        line: "glPopMatrix()",
        note: "Restores the matrix. Without this the translation would leak and shift the ground, the building and everything drawn after the clouds.",
      },
    ],
    takeaway:
      "Push, transform, draw the group, pop. This is the standard OpenGL pattern for a moving group of objects and it is a required 2D transformation.",
  },
  {
    title: "6. drawGround() — depth cues without any 3D",
    lines: "main.cpp 970–1033",
    code: `void drawGround(float daylight) {
    Color grassNearDay   = C(0.52f, 0.82f, 0.30f);  // brighter, close
    Color grassFarDay    = C(0.42f, 0.74f, 0.26f);  // darker, distant
    Color grassNearNight = C(0.10f, 0.24f, 0.10f);
    Color grassFarNight  = C(0.08f, 0.18f, 0.08f);

    switch (currentSeason) { /* winter white, autumn olive, etc. */ }

    Color nearG = mixColor(grassNearNight, grassNearDay, daylight);
    Color farG  = mixColor(grassFarNight,  grassFarDay,  daylight);

    glBegin(GL_QUADS);                       // grass with depth gradient
    setColor(nearG); glVertex2f(-2.2f, -1.10f); glVertex2f(2.2f, -1.10f);
    setColor(farG);  glVertex2f( 2.2f, -0.30f); glVertex2f(-2.2f,-0.30f);
    glEnd();

    // narrowing walkway = linear perspective
    quad(-0.10f, -1.05f,  0.10f, -1.05f,
          0.06f, -0.35f, -0.06f, -0.35f, path1);

    for (int i = 0; i < 5; ++i) {            // paving joint lines
        float y = -0.99f + i * 0.13f;
        glBegin(GL_LINES);
        glVertex2f(-0.09f + i*0.008f, y);
        glVertex2f( 0.09f - i*0.008f, y);
        glEnd();
    }

    // contact shadow, darker at night
    filledEllipse(0.02f, -0.35f, 1.35f, 0.055f,
                  C(0,0,0, 0.08f + 0.12f*(1.0f-daylight)));
}`,
    annotations: [
      {
        line: "near brighter than far",
        note: "Atmospheric perspective: distant surfaces lose contrast. Two greens in one quad produce that illusion for free.",
      },
      {
        line: "quad() with narrowing top",
        note: "The walkway is 0.20 wide at the bottom and 0.12 at the top. That convergence is linear perspective faked in a purely 2D orthographic scene.",
      },
      {
        line: "-0.09f + i*0.008f",
        note: "The paving lines also shorten as they recede, keeping them consistent with the narrowing path edges.",
      },
      {
        line: "0.08f + 0.12f*(1.0f-daylight)",
        note: "Base shadow of 0.08 always present, growing to 0.20 at night. The (1 - daylight) idiom appears throughout the project wherever something intensifies in darkness.",
      },
    ],
    takeaway:
      "Three cheap tricks give a flat 2D lawn real depth: a near/far colour gradient, a converging path, and a contact shadow at the horizon.",
  },
  {
    title: "7. drawFlag() — a travelling wave on a triangle strip",
    lines: "main.cpp 1319–1340",
    code: `void drawFlag(float daylight) {
    Color pole = mixColor(C(0.18f,0.18f,0.22f), C(0.72f,0.72f,0.75f), daylight);
    setColor(pole);
    glLineWidth(3.0f);
    glBegin(GL_LINES);
    glVertex2f(-1.56f, -0.35f);              // pole base
    glVertex2f(-1.56f,  0.30f);              // pole top
    glEnd();

    glBegin(GL_TRIANGLE_STRIP);
    for (int i = 0; i <= 30; ++i) {
        float t = i / 30.0f;                          // 0 -> 1 along cloth
        float x = -1.56f + t * 0.24f;
        float wave = 0.018f * sinf(flagPhase + t * 7.0f);
        setColor(C(0.00f, 0.42f, 0.18f));             // Bangladesh green
        glVertex2f(x, 0.28f + wave);                  // top edge
        glVertex2f(x, 0.18f + wave);                  // bottom edge
    }
    glEnd();

    filledCircle(-1.46f, 0.23f, 0.026f, C(0.88f, 0.08f, 0.08f));  // red disk
}`,
    annotations: [
      {
        line: "31 iterations, 2 vertices each",
        note: "A triangle strip reuses the previous two vertices, so 62 vertices describe 60 triangles with no gaps and no duplicated data.",
      },
      {
        line: "flagPhase + t * 7.0f",
        note: "flagPhase is the time term and t * 7 is the space term. Because the phase differs along the cloth, the wave travels along the flag instead of the whole flag bobbing.",
      },
      {
        line: "0.018f *",
        note: "Amplitude. Small enough that the flag ripples rather than folding over itself.",
      },
      {
        line: "both vertices share the same wave",
        note: "Adding the identical offset to the top and bottom edge keeps the cloth a constant height while it ripples.",
      },
      {
        line: "filledCircle red on green",
        note: "The national flag of Bangladesh, positioned slightly left of centre exactly as the official specification requires.",
      },
    ],
    takeaway:
      "sin(time + position) is the general formula for any travelling wave — flags, water, ropes. Only amplitude and frequency change.",
  },
  {
    title: "8. timer() and keyboard() — where your variables actually change",
    lines: "main.cpp 2485–2489, 2527–2542",
    code: `void timer(int) {
    cloudShift += 0.0008f;                       // clouds drift
    if (cloudShift > 2.6f) cloudShift = -2.6f;   // wrap seamlessly

    flagPhase += 0.08f;                          // cloth flutters fast
    dayPhase  += 0.0028f;                        // day advances slowly
    /* ... other members' updates ... */
    glutPostRedisplay();
    glutTimerFunc(16, timer, 0);                 // reschedule ~60 FPS
}

void keyboard(unsigned char key, int, int) {
    case 'a': case 'A':  autoCycle = true;                        break;
    case 'd': case 'D':  autoCycle = false; manualDaylight = 1.0f; break;
    case 'n': case 'N':  autoCycle = false; manualDaylight = 0.0f; break;
}`,
    annotations: [
      {
        line: "cloudShift wrap at 2.6",
        note: "The layer is 5.2 units wide in total, so jumping from +2.6 to -2.6 lands on an identical-looking position and the loop is invisible.",
      },
      {
        line: "0.08 vs 0.0028",
        note: "The flag phase moves about 28 times faster than the day phase, which is why the cloth flutters while the sun crawls.",
      },
      {
        line: "glutPostRedisplay()",
        note: "Marks the window dirty so GLUT will call display() — it does not draw anything itself.",
      },
      {
        line: "glutTimerFunc(16, timer, 0)",
        note: "GLUT timers are one-shot, so timer() must reschedule itself. 16 ms gives roughly 62.5 frames per second.",
      },
      {
        line: "autoCycle flag",
        note: "This single boolean is the switch getDaylight() checks first. A and D/N never touch dayPhase, so pressing A resumes the cycle from where it was.",
      },
    ],
    takeaway:
      "My module has exactly three pieces of per-frame state and three keys. That is the whole control surface.",
  },
];
