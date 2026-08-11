const CATEGORIES = [
  "All",
  "Day/Night Logic",
  "Sky & Atmosphere",
  "Ground & Lawn",
  "Math & Colour",
  "OpenGL Concepts",
  "Integration",
  "Trap Questions",
];

const QUESTIONS = [
  /* ---- Day/Night core ---- */
  {
    cat: "Day/Night Logic",
    q: "What exactly is the `daylight` value and what range does it have?",
    a: "It is a single float between 0.0 and 1.0 returned by getDaylight() at line 255. 0.0 means full night, 1.0 means full noon, and 0.5 means sunrise or sunset. Every drawing function in the whole project takes this value as a parameter and uses it to blend between a night colour and a day colour.",
  },
  {
    cat: "Day/Night Logic",
    q: "Write and explain the getDaylight() formula.",
    a: "float getDaylight() { if (!autoCycle) return manualDaylight; return 0.5f * (sinf(dayPhase) + 1.0f); }  --  sin(dayPhase) oscillates in [-1, +1]. Adding 1 shifts it to [0, 2], multiplying by 0.5 compresses it to [0, 1]. So the value glides smoothly from night to day and back forever.",
  },
  {
    cat: "Day/Night Logic",
    q: "Why did you use sine instead of a simple counter that increases and resets?",
    a: "A counter produces a linear ramp with a hard jump when it resets, which would make the sky snap from night to day. Sine is continuous and its derivative is also continuous, so the transition eases in and out naturally, exactly like real sunrise and sunset where light changes slowly near the horizon.",
  },
  {
    cat: "Day/Night Logic",
    q: "Where does dayPhase get updated and by how much?",
    a: "Inside timer() at line 2489: dayPhase += 0.0028f. timer() is scheduled every 16 ms by glutTimerFunc, so about 62.5 updates per second.",
  },
  {
    cat: "Day/Night Logic",
    q: "How long does one full day/night cycle take in real time?",
    a: "One cycle is 2*PI radians of dayPhase. 2*PI / 0.0028 = about 2244 frames. At 16 ms per frame that is roughly 36 seconds per full day-night loop.",
    hard: true,
  },
  {
    cat: "Day/Night Logic",
    q: "What do the A, D and N keys do internally?",
    a: "A sets autoCycle = true so getDaylight() uses the sine formula. D sets autoCycle = false and manualDaylight = 1.0f, freezing full day. N sets autoCycle = false and manualDaylight = 0.0f, freezing full night. They are handled in keyboard() at lines 2527 to 2542.",
  },
  {
    cat: "Day/Night Logic",
    q: "If dayPhase keeps growing forever, will it overflow?",
    a: "In practice no. It is a float growing by 0.0028 per frame, so it would take many hours to reach a magnitude where float precision degrades noticeably. sinf() also accepts any real argument. If needed I would wrap it with fmodf(dayPhase, 2*PI) to keep it bounded.",
    hard: true,
  },

  /* ---- Sky ---- */
  {
    cat: "Sky & Atmosphere",
    q: "How does drawSky() produce a gradient?",
    a: "It defines three colour stops: bottom, middle and top. It draws two GL_QUADS, the lower one from y = -1.1 to y = 0.10 and the upper one from y = 0.10 to y = 1.10. Inside each quad I call setColor() before the bottom pair of vertices and again before the top pair. OpenGL then interpolates the colour across the fragments automatically, which is Gouraud interpolation.",
  },
  {
    cat: "Sky & Atmosphere",
    q: "What is the `twilight` variable and why the abs() term?",
    a: "twilight = 1.0f - fabsf(daylight - 0.5f) * 2.0f, clamped to [0,1]. It measures how close daylight is to 0.5. At daylight 0.5 it equals 1 (peak sunrise/sunset), and at daylight 0 or 1 it drops to 0. I use it to fade in a warm orange overlay quad only around dawn and dusk.",
  },
  {
    cat: "Sky & Atmosphere",
    q: "How do the stars fade in?",
    a: "alpha = powf(1.0f - daylight, 1.8f). At daylight = 1 alpha is 0 so nothing is drawn; at daylight = 0 alpha is 1. The exponent 1.8 makes the curve concave, so stars stay dim until the sky is genuinely dark instead of appearing in broad afternoon. There is also an early return when alpha < 0.01 to skip the loop entirely.",
  },
  {
    cat: "Sky & Atmosphere",
    q: "How does each star twinkle?",
    a: "Each star stores its own random phase. Per frame I compute tw = 0.55 + 0.45 * sinf(dayPhase * 2.2 + stars[i].phase) and multiply it into the alpha. Because the phases differ, the stars twinkle out of sync rather than pulsing together.",
  },
  {
    cat: "Sky & Atmosphere",
    q: "How are the sun and moon kept on opposite sides of the sky?",
    a: "I compute one angle sunA = PI * (1.15f - 1.30f * t) where t is the normalised phase, then set moonA = sunA + PI. Adding PI radians is exactly half a revolution, so the moon is always diametrically opposite the sun on the same elliptical arc.",
  },
  {
    cat: "Sky & Atmosphere",
    q: "What are the arc equations for the sun position?",
    a: "sunX = 1.45f * cosf(sunA) and sunY = -0.08f + 0.92f * sinf(sunA). It is a parametric ellipse with x-radius 1.45 and y-radius 0.92, shifted down by 0.08 so the sun rises from and sets below the horizon line.",
  },
  {
    cat: "Sky & Atmosphere",
    q: "Why smoothstep() for sunAlpha and moonAlpha instead of using daylight directly?",
    a: "smoothstep(0.20f, 0.65f, daylight) gives a soft S-curve that is exactly 0 below 0.20 and exactly 1 above 0.65, with an eased ramp in between. Using daylight raw would make the sun visible even in near darkness and would fade linearly, which looks mechanical. It also lets the sun and moon overlap gracefully during twilight.",
  },
  {
    cat: "Sky & Atmosphere",
    q: "Which required lab algorithm appears in your module?",
    a: "The midpoint circle algorithm. drawSunMoon() calls midpointCircleOutline() to stroke the crisp rim of the moon disk, so the mandatory rasterisation algorithm is used in the actual scene and not only in the demo overlay.",
    hard: true,
  },
  {
    cat: "Sky & Atmosphere",
    q: "How is a single cloud constructed?",
    a: "drawCloud() layers four filled ellipses of different radii at slightly offset positions. Overlapping soft ellipses read as a puffy cloud silhouette. Everything is scaled by a size factor s so the same function draws large and small clouds.",
  },
  {
    cat: "Sky & Atmosphere",
    q: "How do the clouds drift, and why did you not move each cloud individually?",
    a: "drawCloudLayer() wraps the four drawCloud() calls in glPushMatrix / glTranslatef(cloudShift, 0, 0) / glPopMatrix. One matrix translation moves the whole layer, so I update a single variable instead of four positions. cloudShift advances by 0.0008 per frame and wraps from +2.6 back to -2.6 so the layer loops seamlessly.",
  },
  {
    cat: "Sky & Atmosphere",
    q: "That glTranslatef is a transformation. Which one?",
    a: "It is a 2D translation, one of the required 2D transformations. It multiplies the current modelview matrix by a translation matrix, and glPushMatrix/glPopMatrix save and restore the matrix so the translation does not leak into anything drawn afterwards.",
  },
  {
    cat: "Sky & Atmosphere",
    q: "What does drawTwilightFog() do?",
    a: "It recomputes the same twilight factor and, if it exceeds 0.05, draws one low translucent white rectangle from y = -0.55 with height 0.22. Its alpha is 0.10 * twilight, so a thin mist band appears only near sunrise and sunset and disappears at noon and midnight.",
  },

  /* ---- Ground ---- */
  {
    cat: "Ground & Lawn",
    q: "How does drawGround() create depth on flat 2D grass?",
    a: "I use two different greens: a brighter near colour at the bottom of the screen and a darker far colour at the top of the grass band. Drawing them as a single GL_QUADS with different vertex colours gives an interpolated gradient, which the eye reads as distance falloff.",
  },
  {
    cat: "Ground & Lawn",
    q: "How is the campus path drawn and why is it not a rectangle?",
    a: "It is a quad() with four independent corners: wide at the bottom (-0.10 to 0.10) and narrow at the top (-0.06 to 0.06). The narrowing simulates linear perspective, so the walkway appears to recede toward the building.",
  },
  {
    cat: "Ground & Lawn",
    q: "What is the ellipse drawn at the end of drawGround()?",
    a: "A wide flat black ellipse with alpha 0.08 + 0.12 * (1 - daylight) at the horizon line. It is an ambient contact shadow that grounds the building against the lawn, and it deepens at night because the term (1 - daylight) grows as light falls.",
  },
  {
    cat: "Ground & Lawn",
    q: "How is a tree built?",
    a: "drawTree() draws a rect() for the trunk and then four overlapping filled ellipses at increasing heights for the canopy, alternating between two leaf shades so the foliage has internal depth. Every dimension is multiplied by the scale parameter s.",
  },
  {
    cat: "Ground & Lawn",
    q: "Why do the trees have different sizes if it is the same function?",
    a: "drawTreeLine() calls drawTree() five times with different x positions and different s values (1.35, 1.22, 1.08, 0.95, 1.02). Varying the scale parameter is a uniform scaling transformation and it breaks the repetition so the lawn does not look cloned.",
  },
  {
    cat: "Ground & Lawn",
    q: "Explain the flag waving mathematics.",
    a: "The flag is a GL_TRIANGLE_STRIP of 31 vertical segments. For segment i, t = i/30 and the vertical offset is wave = 0.018f * sinf(flagPhase + t * 7.0f). Because the sine argument includes t, different columns are at different points of the wave at the same instant, which produces a travelling ripple rather than the whole flag bobbing.",
  },
  {
    cat: "Ground & Lawn",
    q: "What does the 7.0f inside the flag sine control?",
    a: "It is the spatial frequency. Over t from 0 to 1 the phase sweeps 7 radians, giving slightly more than one full wave along the flag length. A larger number would create more ripples across the cloth, a smaller one would flatten it.",
    hard: true,
  },
  {
    cat: "Ground & Lawn",
    q: "Why is a triangle strip used for the flag instead of many quads?",
    a: "A triangle strip reuses the previous two vertices for each new triangle, so 31 vertex pairs describe 60 triangles with no duplicated data. It is fewer vertices, one glBegin/glEnd block, and it guarantees the surface has no gaps between segments.",
    hard: true,
  },
  {
    cat: "Ground & Lawn",
    q: "How is a bench drawn?",
    a: "drawBench() is four rect() calls: two horizontal wooden slats for the seat and back, and two thin vertical metal legs. Wood and metal colours are both blended by daylight so the bench darkens with the rest of the scene. Two benches are placed at x = -1.92 and x = +1.88.",
  },

  /* ---- Math and colour ---- */
  {
    cat: "Math & Colour",
    q: "What does mixColor() actually compute?",
    a: "It is component-wise linear interpolation: result = a + (b - a) * t applied to r, g, b and a separately, with t clamped to [0, 1]. I always call it as mixColor(nightColour, dayColour, daylight), so at daylight 0 I get the night colour and at 1 the day colour.",
  },
  {
    cat: "Math & Colour",
    q: "What is the difference between lerp and smoothstep, and where do you use each?",
    a: "lerp is straight linear interpolation with constant rate of change. smoothstep is the cubic 3t^2 - 2t^3 applied after normalising and clamping, so it starts slow, speeds up, then eases out. I use lerp inside mixColor for colour blending, and smoothstep for the sun and moon opacity where I want a soft fade with a hard cutoff at both ends.",
  },
  {
    cat: "Math & Colour",
    q: "Why do you clamp inside mixColor and smoothstep?",
    a: "Clamping guarantees the interpolation factor never leaves [0, 1]. Without it, a value slightly outside the range would extrapolate and produce colour channels above 1 or below 0, which OpenGL would clip anyway but which could invert intended shading during edge cases such as manual daylight overrides.",
    hard: true,
  },
  {
    cat: "Math & Colour",
    q: "Your colours are floats like 0.52f, not 0-255. Why?",
    a: "OpenGL's glColor4f takes normalised floats in the range 0.0 to 1.0 for each channel. So 0.52f corresponds to about 133 in 8-bit terms. Working in normalised space also makes interpolation arithmetic clean because blending never needs rescaling.",
  },
  {
    cat: "Math & Colour",
    q: "What is the alpha channel doing in your Color struct?",
    a: "Alpha is opacity, used for blending. The project enables GL_BLEND with glBlendFunc(GL_SRC_ALPHA, GL_ONE_MINUS_SRC_ALPHA) in main(), so a colour with alpha 0.2 lets 80 percent of what is already in the framebuffer show through. My twilight overlay, fog band, star fade and ground shadow all rely on it.",
  },

  /* ---- OpenGL concepts ---- */
  {
    cat: "OpenGL Concepts",
    q: "What coordinate system does your scene use?",
    a: "An orthographic 2D system where x runs from about -2.2 to +2.2 and y from -1.1 to +1.1, with the origin at the centre of the screen. Galib's applyCamera() and reshape() set up that orthographic projection, so all my hard-coded vertex values are in these world units, independent of the actual window pixel size.",
  },
  {
    cat: "OpenGL Concepts",
    q: "Why is your module drawn first in display()?",
    a: "This is a 2D painter's-algorithm scene with no depth testing during the 2D pass, so whatever is drawn later covers what came before. The sky and the ground are the background, therefore they must be painted first; the building, people and 3D monuments are then layered on top in back-to-front order.",
  },
  {
    cat: "OpenGL Concepts",
    q: "Which OpenGL primitives do you use and why?",
    a: "GL_QUADS for the sky and grass gradient bands because a quad supports one colour per vertex. GL_LINES for the flag pole, path texture lines and sun rays. GL_TRIANGLE_STRIP for the waving flag. Filled circles and ellipses, which are helper functions built on GL_TRIANGLE_FAN, for the sun, moon, stars, clouds and tree canopies.",
  },
  {
    cat: "OpenGL Concepts",
    q: "What do glPushMatrix and glPopMatrix do in your cloud layer?",
    a: "glPushMatrix saves a copy of the current modelview matrix on the matrix stack. I then apply glTranslatef, draw the four clouds in the shifted frame, and glPopMatrix restores the saved matrix. Without the pop, the translation would remain active and shift the ground, trees and everything drawn afterwards.",
  },
  {
    cat: "OpenGL Concepts",
    q: "Is double buffering used, and why does it matter for your animation?",
    a: "Yes. main() calls glutInitDisplayMode with GLUT_DOUBLE and display() ends with glutSwapBuffers(). The frame is composed off-screen and swapped in one operation, so the user never sees a partially drawn sky. Without it my gradually redrawn sky and ground would flicker.",
    hard: true,
  },

  /* ---- Integration ---- */
  {
    cat: "Integration",
    q: "Which functions from other members do you depend on?",
    a: "Swarup's core utilities: C() to build colours, mixColor(), lerpf(), clampf(), smoothstep(), setColor(), and the 2D primitives rect(), quad(), filledCircle() and filledEllipse(). I also call midpointCircleOutline() for the moon rim.",
  },
  {
    cat: "Integration",
    q: "Which other modules depend on your work?",
    a: "All of them. Shuva's drawWindow() and drawLampPosts() use (1.0f - daylight) to switch on window glow and lamp halos. Hasib's drawBirds() returns early unless daylight is above 0.35 and drawFireworks() returns unless it is below 0.45. Galib's 3D lighting pass positions GL_LIGHT0 to follow the sun, and Swarup's HUD prints the current mode.",
  },
  {
    cat: "Integration",
    q: "Your drawSky() reads currentSeason, which belongs to Hasib. Is that not a violation of module boundaries?",
    a: "It is a deliberate one-way read of shared scene state. Hasib owns writing currentSeason through setSeason(); my module only reads it to select which day and night palettes to blend. The blending logic and every colour constant in the sky and ground remain mine, so the responsibility split is still clean.",
    hard: true,
  },
  {
    cat: "Integration",
    q: "If you deleted your module, what would break?",
    a: "The program would not compile because display() calls seven of my functions and every other draw function takes daylight as a parameter. Even if those calls were stubbed out, the screen would show the building and people floating on the clear colour with no sky, no ground, no time of day, and lamps and windows would never light up.",
  },
  {
    cat: "Integration",
    q: "Why is daylight passed as a parameter rather than each function calling getDaylight() itself?",
    a: "display() calls getDaylight() exactly once per frame and passes the result down. That guarantees every element in a single frame agrees on the same time of day. If each function called it separately the value would still be identical in practice, but the design would allow inconsistency and would repeat the sine computation dozens of times per frame.",
    hard: true,
  },

  /* ---- Trap questions ---- */
  {
    cat: "Trap Questions",
    q: "Your sun uses a circle. Did you rasterise it with the midpoint algorithm or with OpenGL?",
    a: "The filled sun disk uses filledCircle(), which is a triangle fan, because filling with the midpoint algorithm point by point would be slow. The midpoint circle algorithm is used where an outline is needed: midpointCircleOutline() strokes the moon rim, and Swarup's key-1 overlay demonstrates it in isolation with the decision parameter visible.",
    hard: true,
  },
  {
    cat: "Trap Questions",
    q: "You claim smooth transitions, but frame rate can vary. Does your animation depend on frame rate?",
    a: "Yes, it is frame-based: dayPhase advances a fixed amount per timer tick rather than per elapsed millisecond. glutTimerFunc(16, ...) keeps that near 60 Hz so it is stable in practice. The correct fix for a production renderer would be to multiply the increment by the measured delta time, which would make the cycle duration identical on any machine.",
    hard: true,
  },
  {
    cat: "Trap Questions",
    q: "Show me the exact moment the sky is orange. What is daylight then?",
    a: "daylight = 0.5. That is where twilight = 1 - |0.5 - 0.5| * 2 = 1, its maximum, so the warm overlay quad is at full 0.20 alpha and the fog band is at full strength. Press A and watch the transition, or I can set it directly on the slider.",
  },
  {
    cat: "Trap Questions",
    q: "Why does the moon still show when the sun is also faintly visible?",
    a: "Their alpha ranges deliberately overlap. sunAlpha uses smoothstep(0.20, 0.65, daylight) and moonAlpha uses smoothstep(0.20, 0.80, 1 - daylight), so between roughly daylight 0.2 and 0.35 both are partly transparent. That mirrors reality, where the moon is visible in a dim dawn sky.",
    hard: true,
  },
  {
    cat: "Trap Questions",
    q: "What happens to your scene if the user presses N and then a season key?",
    a: "autoCycle stays false so daylight remains 0.0, but currentSeason changes. drawSky() and drawGround() then blend toward the new season's night palette, which differs for winter, monsoon and late autumn. So the sky stays dark but its tint changes, which proves the season selection and the day/night blend are independent inputs to the same interpolation.",
    hard: true,
  },
  {
    cat: "Trap Questions",
    q: "Could you add a real sunrise colour instead of one orange overlay?",
    a: "Yes. The cleanest way is to add a third colour set, a dawn palette, and blend in two stages: first between night and dawn using the twilight factor, then between dawn and day using daylight. The current single overlay is a cheaper approximation that costs one extra quad instead of three more interpolations per frame.",
    hard: true,
  },
];
