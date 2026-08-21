window.THEORY = (function () {
  const parts = [
    { id: 1,  name: "RTD & Temperature",        short: "RTD",     ico: "🌡️", color: "#54e6ff" },
    { id: 2,  name: "Pressure Measurement",     short: "Pressure", ico: "⚖️", color: "#7dffb2" },
    { id: 3,  name: "Electro-Mechanical",       short: "E-Mech",   ico: "⚙️", color: "#a97bff" },
    { id: 4,  name: "Resistive Pressure",       short: "Resistive",ico: "〰️", color: "#ffcf5c" },
    { id: 5,  name: "Capacitive Pressure",      short: "Capacitive",ico:"🔋", color: "#54e6ff" },
    { id: 6,  name: "Ultrasonic Flowmeter",     short: "Flow",     ico: "🌊", color: "#7dffb2" },
    { id: 7,  name: "Liquid Level",             short: "Level",    ico: "📏", color: "#a97bff" },
    { id: 8,  name: "Signal Conditioning",      short: "Condition",ico: "🧹", color: "#ffcf5c" },
    { id: 9,  name: "Amplifiers",               short: "Amp",      ico: "📢", color: "#54e6ff" },
    { id: 10, name: "Operational Amplifier",    short: "Op-Amp",   ico: "△",  color: "#7dffb2" },
    { id: 11, name: "Instrumentation Amp",      short: "In-Amp",   ico: "🎯", color: "#a97bff" },
    { id: 12, name: "Noise",                    short: "Noise",    ico: "📶", color: "#ff7a90" },
    { id: 13, name: "ADC",                      short: "ADC",      ico: "🔢", color: "#ffcf5c" }
  ];

  const questions = [
    {
      n: 1, part: 1, star: false,
      q: "Define transduction and transducer. Give advantages of electrical transducers.",
      hook: "TRANS = TRANSFER. Transducer = the transfer device.",
      script: "Transduction is converting one form of energy into another. A transducer is a device that converts a physical quantity into a usable electrical signal. Electrical transducers win because the signal is easy to send far, easy to amplify, and easy to feed into a computer.",
      points: [
        "Transduction: converting one energy / physical quantity into another form.",
        "Transducer: device that turns a physical quantity into a usable electrical signal.",
        "Example: temperature → electrical resistance."
      ],
      listTitle: "Advantages of electrical transducers",
      list: [
        "Easy to transmit over long distances",
        "Easy to amplify and process",
        "Can connect to computers / controllers",
        "Best for automatic measurement"
      ],
      flow: ["Physical quantity", "Transducer", "Electrical signal", "Computer"],
      real: "A factory temperature sensor converts heat into an electrical signal and sends it to a control computer.",
      anim: "transducer"
    },
    {
      n: 2, part: 1, star: false,
      q: "Differentiate between primary and secondary transducer.",
      hook: "PRIMARY feels it. SECONDARY converts it.",
      script: "The primary transducer directly senses the physical quantity. The secondary transducer takes that first output and turns it into an electrical signal. Chain: Physical quantity → Primary → Secondary → Electrical output.",
      table: {
        heads: ["Primary transducer", "Secondary transducer"],
        rows: [
          ["Directly senses the physical quantity", "Converts primary output into an electrical signal"],
          ["First stage of measurement", "Second stage of measurement"],
          ["Example: diaphragm", "Example: strain gauge"]
        ]
      },
      flow: ["Physical quantity", "Primary", "Secondary", "Electrical output"],
      real: "In a pressure sensor, a diaphragm moves because of pressure (primary). A strain gauge turns that movement into electricity (secondary).",
      anim: "primary-secondary"
    },
    {
      n: 3, part: 1, star: true,
      q: "Explain the working principle of RTD. What does PTC mean?",
      hook: "RTD = Resistance Tells Degree. PTC = Plus Temp, Plus R.",
      script: "An RTD is a Resistance Temperature Detector. Metal resistance changes with temperature. For common metal RTDs, temperature up means resistance up. That is Positive Temperature Coefficient, PTC.",
      formula: { fx: "T ↑  ⇒  R ↑", fn: "PTC — Positive Temperature Coefficient" },
      points: [
        "RTD = Resistance Temperature Detector.",
        "Principle: resistance of a metal changes with temperature.",
        "PTC: temperature increases → resistance increases."
      ],
      flow: ["Temperature ↑", "Metal resistance ↑", "Electrical measurement", "Temperature found"],
      real: "An RTD can measure the temperature of a chemical processing tank.",
      anim: "rtd"
    },
    {
      n: 4, part: 1, star: false,
      q: "List three important characteristics of an industrial RTD material.",
      hook: "HSS — High coefficient, Stable, Strong.",
      script: "A good industrial RTD material needs a high and predictable temperature coefficient, a stable resistance-temperature relationship, and good chemical plus mechanical stability. It must stay accurate after thousands of hours.",
      list: [
        "High and predictable temperature coefficient",
        "Stable resistance–temperature relationship",
        "Good chemical and mechanical stability"
      ],
      real: "Industrial sensors must stay accurate even after running for thousands of hours.",
      anim: "rtd-material"
    },
    {
      n: 5, part: 1, star: false,
      q: "Define thermistor. Compare it with a metal RTD.",
      hook: "THERMISTOR = THERMal resISTOR. Tiny, super sensitive.",
      script: "A thermistor is a temperature-sensitive resistor whose resistance changes a lot with temperature. Compared with a metal RTD, it is smaller, more sensitive, usually made of semiconductor, and may have NTC or PTC.",
      table: {
        heads: ["Property", "Thermistor", "Metal RTD"],
        rows: [
          ["Temperature coefficient", "Usually NTC or PTC", "Usually PTC"],
          ["Size", "Very small", "Generally larger"],
          ["Sensitivity", "Very high", "Lower"],
          ["Material", "Semiconductor", "Metals such as platinum"]
        ]
      },
      real: "Thermistors sit inside phones and chargers because they are small and highly sensitive.",
      anim: "thermistor"
    },
    {
      n: 6, part: 2, star: false,
      q: "What is pressure?",
      hook: "P = F over A. Same force, smaller area → bigger pressure.",
      script: "Pressure is the force acting per unit area. Formula P = F / A. Unit is Pascal, Pa. A sharp nail makes high pressure because the same force sits on a tiny area.",
      formula: { fx: "P = F / A", fn: "P = pressure, F = force, A = area · Unit: Pascal (Pa)" },
      real: "A sharp nail produces high pressure because the force acts on a very small area.",
      anim: "pressure"
    },
    {
      n: 7, part: 2, star: false,
      q: "Define absolute pressure.",
      hook: "ABSOLUTE starts from ZERO vacuum. Nothing below it.",
      script: "Absolute pressure is pressure measured relative to a perfect vacuum. Formula: P_absolute = P_atmospheric + P_gauge. Use it for vacuum systems.",
      formula: { fx: "P_abs = P_atm + P_gauge", fn: "Reference = perfect vacuum (0 Pa)" },
      flow: ["Perfect vacuum 0 Pa", "Absolute pressure", "Atmospheric pressure"],
      real: "Absolute pressure is important when measuring pressure inside vacuum systems.",
      anim: "abs-pressure"
    },
    {
      n: 8, part: 2, star: false,
      q: "Define gauge pressure.",
      hook: "GAUGE = Garage tyre. It ignores the air around you.",
      script: "Gauge pressure is pressure measured relative to atmospheric pressure. Formula: P_g = P_absolute − P_atmospheric. A car tyre gauge shows gauge pressure.",
      formula: { fx: "P_g = P_abs − P_atm", fn: "Reference = atmospheric pressure" },
      real: "A car tyre pressure gauge shows gauge pressure, not absolute pressure.",
      anim: "gauge-pressure"
    },
    {
      n: 9, part: 2, star: false,
      q: "Define differential pressure.",
      hook: "DIFFERENTIAL = difference. Two sides, one answer: P1 − P2.",
      script: "Differential pressure is the difference between two pressures. P_d = P1 − P2. Used to find pressure loss across a pipe filter.",
      formula: { fx: "P_d = P1 − P2", fn: "Reference = another pressure, not vacuum or air" },
      real: "Differential pressure can show how clogged a pipe filter is.",
      anim: "diff-pressure"
    },
    {
      n: 10, part: 2, star: true,
      q: "Differentiate absolute, gauge and differential pressure.",
      hook: "AVG: Absolute→Vacuum, Gauge→Atmosphere, Differential→Another pressure.",
      script: "Absolute uses vacuum as zero. Gauge uses atmosphere as zero. Differential uses another pressure as the other side. Remember AVG.",
      table: {
        heads: ["Type", "Reference"],
        rows: [
          ["Absolute pressure", "Perfect vacuum"],
          ["Gauge pressure", "Atmospheric pressure"],
          ["Differential pressure", "Another pressure"]
        ]
      },
      real: "Tyre = gauge. Space / vacuum chamber = absolute. Filter across a pipe = differential.",
      anim: "pressure-types"
    },
    {
      n: 11, part: 3, star: false,
      q: "What are electro-mechanical pressure measurement systems?",
      hook: "PRESS → MOVE → ELECTRIC. Mechanical first, then electrical.",
      script: "These systems convert pressure into an electrical signal using mechanical movement plus an electrical transducer. Pressure makes a part move, then that movement becomes electricity.",
      flow: ["Pressure", "Mechanical movement", "Electrical transducer", "Electrical signal"],
      real: "Used in industrial pressure monitoring systems.",
      anim: "emech"
    },
    {
      n: 12, part: 3, star: false,
      q: "What are the two main elements?",
      hook: "Two actors: SENSOR feels, SECONDARY speaks electricity.",
      script: "The two main elements are the sensing element and the secondary transducer. The sensing element detects pressure and produces mechanical movement. The secondary transducer converts that movement into an electrical signal.",
      list: [
        "Sensing element — detects pressure, produces mechanical movement",
        "Secondary transducer — converts movement into an electrical signal"
      ],
      anim: "emech"
    },
    {
      n: 13, part: 3, star: false,
      q: "What is a sensing element?",
      hook: "Sensing element = the part that BENDS when the quantity hits it.",
      script: "A sensing element is the part that directly responds to the physical quantity being measured. For pressure, it deforms or moves. Examples: diaphragm, bellows, Bourdon tube.",
      list: ["Diaphragm", "Bellows", "Bourdon tube"],
      real: "A diaphragm bends when pressure is applied to it.",
      anim: "diaphragm"
    },
    {
      n: 14, part: 3, star: false,
      q: "What is a secondary transducer?",
      hook: "Secondary never feels pressure. It only reads the movement.",
      script: "A secondary transducer converts the mechanical output of the sensing element into an electrical signal. Example: Pressure → Diaphragm → Strain gauge → Electrical signal.",
      flow: ["Pressure", "Diaphragm", "Strain gauge", "Electrical signal"],
      anim: "emech"
    },
    {
      n: 15, part: 3, star: false,
      q: "Why are these systems called secondary transducers?",
      hook: "SECONDARY because they are second in line — they do not touch the original quantity.",
      script: "They are called secondary transducers because they do not directly sense the original physical quantity. Pressure hits the sensing element first. Only then does the secondary transducer work on that mechanical displacement.",
      flow: ["Pressure", "Sensing element", "Mechanical displacement", "Secondary transducer", "Electrical output"],
      anim: "emech"
    },
    {
      n: 16, part: 3, star: true,
      q: "Explain the working principle.",
      hook: "4 steps: Apply → Move → Detect → Signal.",
      script: "Pressure is applied to the sensing element. The sensing element moves or deforms. A secondary transducer detects that mechanical change. Then it produces an electrical signal. This is how industrial pressure transmitters work.",
      list: [
        "Pressure is applied to the sensing element",
        "The sensing element moves / deforms",
        "Secondary transducer detects the mechanical change",
        "Secondary transducer produces an electrical signal"
      ],
      real: "This is used in industrial pressure transmitters.",
      anim: "emech"
    },
    {
      n: 17, part: 4, star: true,
      q: "How does a strain gauge work?",
      hook: "STRETCH it → LONGER, THINNER → Resistance UP. R = ρL/A.",
      script: "A strain gauge works because its electrical resistance changes when it is stretched or compressed. R = ρL/A. When stretched, length L increases, area A decreases, so resistance R increases. Used for pressure, force and weight.",
      formula: { fx: "R = ρ L / A", fn: "Stretch: L ↑, A ↓  ⇒  R ↑" },
      points: [
        "Resistance changes when the gauge is stretched or compressed.",
        "Stretched: length increases, area decreases, resistance increases."
      ],
      real: "Strain gauges can measure pressure, force and weight.",
      anim: "strain"
    },
    {
      n: 18, part: 4, star: false,
      q: "Why is silicon commonly used in strain gauges?",
      hook: "SILICON = SUPER SENSITIVE. Tiny bend, big resistance change.",
      script: "Silicon is commonly used because it has high sensitivity to mechanical strain. Even a small deformation produces a noticeable change in resistance. That makes highly sensitive pressure sensors possible.",
      real: "Silicon strain gauges are useful for highly sensitive pressure sensors.",
      anim: "strain"
    },
    {
      n: 19, part: 4, star: false,
      q: "Identify a resistive pressure transducer.",
      hook: "Resistive pressure transducer = strain-gauge pressure transducer.",
      script: "A strain-gauge pressure transducer is a resistive pressure transducer. Pressure bends a diaphragm, the strain gauge changes resistance, and that becomes an electrical output.",
      flow: ["Pressure", "Diaphragm bends", "Strain gauge ΔR", "Electrical output"],
      anim: "strain"
    },
    {
      n: 20, part: 4, star: false,
      q: "What are the disadvantages of resistive pressure sensors?",
      hook: "TWSC — Temperature, Wear, Signal-conditioning, small Change.",
      script: "Main disadvantages: resistance is affected by temperature, mechanical wear can occur, they may need signal conditioning, and small resistance changes are hard to measure. So temperature compensation is often required.",
      list: [
        "Resistance can be affected by temperature",
        "Mechanical wear can occur",
        "They may require signal conditioning",
        "Small resistance changes can be difficult to measure"
      ],
      real: "Temperature compensation may be required in an industrial pressure sensor.",
      anim: "strain"
    },
    {
      n: 21, part: 5, star: true,
      q: "Explain the working principle of capacitive pressure transducers.",
      hook: "C = εA / d. Pressure moves the plate, d changes, C changes.",
      script: "A capacitor has two plates. Capacitance C = εA / d. When pressure moves a diaphragm, the distance d between plates changes, so capacitance changes. That capacitance change is the electrical output.",
      formula: { fx: "C = ε A / d", fn: "Pressure ↑ → diaphragm moves → d changes → C changes" },
      real: "Used for accurate pressure measurement in industrial equipment.",
      anim: "cap"
    },
    {
      n: 22, part: 5, star: false,
      q: "What is a diaphragm-based capacitive sensor?",
      hook: "The diaphragm IS one plate of the capacitor.",
      script: "It is a capacitive pressure sensor where a flexible diaphragm acts as one capacitor plate. When pressure is applied, the diaphragm moves and changes capacitance.",
      real: "Used in electronic pressure sensors.",
      anim: "cap"
    },
    {
      n: 23, part: 5, star: false,
      q: "Difference between single and differential capacitor designs.",
      hook: "SINGLE = one C. DIFFERENTIAL = one up, one down — more accurate.",
      script: "A single capacitor uses one variable capacitance. A differential design uses two capacitances: one increases while the other decreases. Differential is more accurate and more stable.",
      table: {
        heads: ["Single capacitor", "Differential capacitor"],
        rows: [
          ["Uses one variable capacitance", "Uses two capacitances"],
          ["One side changes mainly due to diaphragm movement", "One increases while the other decreases"],
          ["More affected by unwanted changes", "Better accuracy and stability"]
        ]
      },
      anim: "cap-diff"
    },
    {
      n: 24, part: 5, star: false,
      q: "Why are capacitive sensors highly accurate?",
      hook: "They feel TINY moves. Low mechanical loading.",
      script: "They are highly accurate because they can detect very small changes in capacitance and displacement. They also have low mechanical loading, so they do not disturb the quantity much.",
      real: "Useful when pressure changes are very small and accurate measurement is required.",
      anim: "cap"
    },
    {
      n: 25, part: 6, star: true,
      q: "Explain the working principle of an ultrasonic flowmeter.",
      hook: "Sound WITH the flow is FAST. Sound AGAINST the flow is SLOW. Time gap = velocity.",
      script: "An ultrasonic flowmeter measures flow using ultrasonic sound waves sent through the fluid. The difference in travel time of the waves is related to fluid velocity. Used to measure water flow in large pipelines.",
      flow: ["TX sends wave", "RX receives wave", "Time difference", "Flow velocity"],
      real: "Used to measure water flow in large pipelines.",
      anim: "flowmeter"
    },
    {
      n: 26, part: 6, star: false,
      q: "Construction, components, advantages and limitations.",
      hook: "No moving parts. Clamp on. But fluid and install must be right.",
      script: "Main parts: ultrasonic transmitter, receiver, pipe, and signal processing unit. Advantages: no moving parts, no obstruction, many industrial uses. Limitations: depends on fluid conditions, installation must be correct, electronics can be complex.",
      listTitle: "Main components",
      list: ["Ultrasonic transmitter", "Ultrasonic receiver", "Pipe", "Signal processing unit"],
      extraLists: [
        { title: "Advantages", items: ["No moving parts", "Does not obstruct the pipe", "Suitable for many industrial applications"] },
        { title: "Limitations", items: ["Performance can depend on fluid conditions", "Installation must be appropriate", "Electronics can be relatively complex"] }
      ],
      anim: "flowmeter"
    },
    {
      n: 27, part: 7, star: false,
      q: "What is the time-of-flight method?",
      hook: "TOF = Time Of Flight. Send, bounce, come back. Clock the trip.",
      script: "Time-of-flight is measuring distance by calculating how long a signal takes to travel to an object and return. Used to find how much liquid is in a storage tank.",
      real: "Used to determine the amount of liquid inside a storage tank.",
      anim: "tof"
    },
    {
      n: 28, part: 7, star: false,
      q: "How is distance calculated?",
      hook: "Divide by 2 because it went AND came back. d = v t / 2.",
      script: "Distance d = v t / 2. d is distance, v is speed of sound, t is round-trip time. We divide by 2 because the signal goes to the liquid and comes back.",
      formula: { fx: "d = v t / 2", fn: "Divide by 2 = go + return" },
      anim: "tof"
    },
    {
      n: 29, part: 7, star: true,
      q: "Explain ultrasonic level measurement.",
      hook: "PING the surface. TIME the echo. FILL the tank number.",
      script: "Sensor sends an ultrasonic pulse. Pulse hits the liquid surface and reflects back. Sensor measures return time. Distance is calculated, then liquid level is found. A factory can auto-check if a water tank is empty or full.",
      list: [
        "Sensor sends an ultrasonic pulse",
        "Pulse reaches the liquid surface",
        "Pulse is reflected back",
        "Sensor measures the return time",
        "Distance to liquid is calculated",
        "Liquid level is determined"
      ],
      real: "A factory can automatically determine whether a water tank is almost empty or full.",
      anim: "level"
    },
    {
      n: 30, part: 8, star: false,
      q: "What is signal conditioning?",
      hook: "RAW is dirty. Conditioning makes it CLEAN and usable.",
      script: "Signal conditioning is modifying a sensor's output so it becomes suitable for further processing or measurement. Path: Sensor → raw signal → signal conditioning → clean usable signal → ADC / computer.",
      flow: ["Sensor", "Raw signal", "Signal conditioning", "Clean signal", "ADC / Computer"],
      anim: "conditioning"
    },
    {
      n: 31, part: 8, star: false,
      q: "Why is signal conditioning necessary?",
      hook: "Sensors are SHY: small, noisy, nonlinear, wrong voltage.",
      script: "Sensor signals may be very small, noisy, nonlinear, or not at the required voltage. Signal conditioning makes them clean, suitable and measurable. A weak temperature signal may need amplification before a microcontroller can read it.",
      list: ["Very small", "Noisy", "Nonlinear", "Not at the required voltage level"],
      real: "A weak temperature sensor signal may need amplification before a microcontroller can read it.",
      anim: "conditioning"
    },
    {
      n: 32, part: 8, star: false,
      q: "Main processes in signal conditioning.",
      hook: "A FILC — Amplify, Filter, Isolate, Linearize, Convert.",
      script: "Five common processes: Amplification increases strength. Filtering removes noise. Isolation protects circuits. Linearization makes nonlinear signals easier. Conversion changes the signal into a suitable form.",
      list: [
        "Amplification — increases signal strength",
        "Filtering — removes unwanted noise",
        "Isolation — protects circuits",
        "Linearization — makes nonlinear signals easier to interpret",
        "Conversion — changes the signal into a suitable form"
      ],
      anim: "conditioning"
    },
    {
      n: 33, part: 9, star: false,
      q: "What is an amplifier?",
      hook: "Amplifier = volume knob for voltage. Small in, large out.",
      script: "An amplifier is an electronic circuit that increases the amplitude or strength of a signal. A sensor may produce 10 mV, which needs amplification before processing.",
      flow: ["Small signal", "Amplifier", "Large signal"],
      real: "A sensor may produce a 10 mV signal, which needs amplification before processing.",
      anim: "amp"
    },
    {
      n: 34, part: 9, star: true,
      q: "Why high input impedance and low output impedance?",
      hook: "HIGH IN = don't steal from sensor. LOW OUT = push the next circuit.",
      script: "High input impedance prevents the amplifier from drawing much current from the sensor, so the original signal is not disturbed. Low output impedance lets the amplifier deliver the signal effectively to the next circuit.",
      points: [
        "High input impedance: don't disturb the sensor.",
        "Low output impedance: drive the next circuit well."
      ],
      anim: "impedance"
    },
    {
      n: 35, part: 9, star: false,
      q: "Why are amplifiers needed in instrumentation?",
      hook: "Sensors whisper. Amplifiers shout so ADC can hear.",
      script: "Sensors often produce very small electrical signals. Amplifiers raise them to a suitable level for measurement, processing, ADC, and display or control systems.",
      list: ["Measurement", "Processing", "ADC", "Display / control systems"],
      real: "A small pressure sensor signal can be amplified before being read by a microcontroller.",
      anim: "amp"
    },
    {
      n: 36, part: 9, star: false,
      q: "Characteristics of a good amplifier.",
      hook: "HI-LO-GAIN-QUIET-STABLE-CLEAN. Six good habits.",
      script: "A good amplifier should have high input impedance, low output impedance, high gain, low noise, good stability and low distortion.",
      list: [
        "High input impedance",
        "Low output impedance",
        "High gain",
        "Low noise",
        "Good stability",
        "Low distortion"
      ],
      anim: "amp"
    },
    {
      n: 37, part: 10, star: false,
      q: "What is an operational amplifier?",
      hook: "OP-AMP = difference hunter. It amplifies V+ minus V−, with huge gain.",
      script: "An operational amplifier is a high-gain electronic amplifier that amplifies the difference between two input voltages. Used in amplification, filtering and signal conditioning.",
      real: "Op-amps are used in amplification, filtering and signal conditioning.",
      anim: "opamp"
    },
    {
      n: 38, part: 10, star: false,
      q: "What is open-loop gain?",
      hook: "OPEN loop = NO feedback. Gain is HUGE. A_v = Vout / Vin.",
      script: "Open-loop gain is the gain of an op-amp when there is no feedback from output to input. A_v = Vout / Vin. It is usually very high. Idea: input difference × very high gain = output.",
      formula: { fx: "A_v = V_out / V_in", fn: "No feedback → gain is very high" },
      anim: "opamp"
    },
    {
      n: 39, part: 10, star: false,
      q: "What is common-mode gain?",
      hook: "COMMON = same on BOTH wires. Good amp should almost IGNORE it.",
      script: "Common-mode gain is the gain given to a signal that is present equally at both inputs. Ideally an instrumentation amplifier has very low common-mode gain, so it rejects interference that hits both sensor wires.",
      real: "If the same electrical interference reaches both sensor wires, the amplifier should reject it.",
      anim: "cmrr"
    },
    {
      n: 40, part: 10, star: false,
      q: "Advantages of op-amps.",
      hook: "HIGH-HIGH-LOW + small, versatile, useful. HHLSVU.",
      script: "Main advantages: high gain, high input impedance, low output impedance, small size, versatile, and useful for amplification and signal processing.",
      list: [
        "High gain",
        "High input impedance",
        "Low output impedance",
        "Small size",
        "Versatile",
        "Useful for amplification and signal processing"
      ],
      anim: "opamp"
    },
    {
      n: 41, part: 11, star: false,
      q: "What is an instrumentation amplifier?",
      hook: "IN-AMP = precision pair reader. Built for tiny differential sensor signals.",
      script: "An instrumentation amplifier is a precision amplifier designed mainly for measuring small differential signals. Sensor plus and sensor minus go in, a clean output comes out.",
      flow: ["Sensor +", "Instrumentation amplifier", "Output"],
      anim: "inamp"
    },
    {
      n: 42, part: 11, star: false,
      q: "Why is it preferred in measurement systems?",
      hook: "Four H's: High accuracy, High Zin, High differential gain, High noise rejection.",
      script: "It is preferred because it gives high accuracy, high input impedance, high differential gain, and good rejection of common-mode noise. Used for tiny signals from medical sensors and strain gauges.",
      list: [
        "High accuracy",
        "High input impedance",
        "High differential gain",
        "Good rejection of common-mode noise"
      ],
      real: "Used to amplify tiny signals from medical sensors and strain gauges.",
      anim: "inamp"
    },
    {
      n: 43, part: 11, star: true,
      q: "Write the gain equation.",
      hook: "Gain knob is R_G. Smaller R_G → bigger gain.",
      script: "For a common three-op-amp instrumentation amplifier, A_v = (1 + 2R / R_G) × (R3 / R2). Exact notation may vary. For the exam: remember gain is controlled by resistor values, especially the gain-setting resistor R_G.",
      formula: { fx: "A_v = (1 + 2R / R_G) (R3 / R2)", fn: "R_G is the gain-setting resistor" },
      anim: "inamp"
    },
    {
      n: 44, part: 11, star: false,
      q: "Advantages of instrumentation amplifier.",
      hook: "HAIL AS — High Zin, Accuracy, Isolation of noise (CMRR), Low noise, Adjustable gain, Small signals.",
      script: "Advantages: high input impedance, high accuracy, high common-mode rejection, low noise, adjustable gain, and suitable for small sensor signals. Used with ECG sensors, load cells and pressure sensors.",
      list: [
        "High input impedance",
        "High accuracy",
        "High common-mode rejection",
        "Low noise",
        "Adjustable gain",
        "Suitable for small sensor signals"
      ],
      real: "Used with ECG sensors, load cells and pressure sensors.",
      anim: "inamp"
    },
    {
      n: 45, part: 12, star: false,
      q: "What is noise?",
      hook: "NOISE = the uninvited guest sitting on your signal.",
      script: "Noise is an unwanted electrical signal that interferes with the desired signal. Electrical interference from motors can introduce noise into sensor measurements.",
      real: "Electrical interference from motors can introduce noise into sensor measurements.",
      anim: "noise"
    },
    {
      n: 46, part: 12, star: false,
      q: "How does noise affect measurement?",
      hook: "Noise makes the reading DANCE. Accuracy down, quality down.",
      script: "Noise can reduce accuracy, make the signal hard to detect, cause fluctuating readings, and reduce measurement quality. A temperature display may keep jumping because of electrical noise.",
      list: [
        "Reduce accuracy",
        "Make the signal difficult to detect",
        "Cause fluctuating readings",
        "Reduce measurement quality"
      ],
      real: "A temperature display may continuously fluctuate because of electrical noise.",
      anim: "noise"
    },
    {
      n: 47, part: 12, star: false,
      q: "Define resolution.",
      hook: "RESOLUTION = smallest step the system can still SEE.",
      script: "Resolution is the smallest change in a physical quantity that a measurement system can detect. If a thermometer can detect 0.1 °C changes, its resolution is 0.1 °C.",
      real: "If a thermometer can detect changes of 0.1 °C, its resolution is 0.1 °C.",
      anim: "resolution"
    },
    {
      n: 48, part: 12, star: false,
      q: "What are internal and external noise?",
      hook: "INTERNAL is born inside. EXTERNAL walks in from outside.",
      script: "Internal noise is generated inside the electronic system, for example thermal noise of resistors. External noise comes from outside, for example electromagnetic interference from motors.",
      table: {
        heads: ["Internal noise", "External noise"],
        rows: [
          ["Generated inside the electronic system", "Comes from outside the system"],
          ["Example: thermal noise of resistors", "Example: EMI from motors"]
        ]
      },
      anim: "noise-types"
    },
    {
      n: 49, part: 12, star: false,
      q: "Explain thermal noise.",
      hook: "HEAT shakes charges. Shaking charges = thermal noise. Also called Johnson noise.",
      script: "Thermal noise is caused by the random movement of charge carriers due to temperature. It exists in resistors and other components. Circuits produce some noise even with no external interference.",
      real: "Electronic circuits produce some noise even when no external interference is present.",
      anim: "thermal"
    },
    {
      n: 50, part: 12, star: false,
      q: "Explain shot noise.",
      hook: "Current is RAINDROPS, not a smooth river. Those drops = shot noise.",
      script: "Shot noise is caused by the random movement of charge carriers across electronic devices. It comes from the discrete nature of electric charge. Current is not perfectly smooth, so it fluctuates.",
      flow: ["Current flow", "Not perfectly smooth", "Random fluctuation", "Shot noise"],
      anim: "shot"
    },
    {
      n: 51, part: 12, star: false,
      q: "Explain pink noise.",
      hook: "PINK = 1/f. More power at LOW frequency, less at HIGH.",
      script: "Pink noise is noise whose power decreases as frequency increases, approximately following a 1/f relationship. It is also called 1/f noise. It can appear in measurement systems especially at lower frequencies.",
      formula: { fx: "P ∝ 1 / f", fn: "Also called 1/f noise" },
      real: "It can appear in electronic and measurement systems, especially at lower frequencies.",
      anim: "pink"
    },
    {
      n: 52, part: 13, star: false,
      q: "What is an ADC?",
      hook: "ADC = Analog to Digital Converter. Wave in, bits out.",
      script: "ADC means Analog-to-Digital Converter. It converts a continuous analog signal into a digital binary representation. A microphone is analog; the computer needs digital data.",
      flow: ["Analog signal", "ADC", "Digital data 101101…"],
      real: "A microphone produces an analog signal, which an ADC converts into digital data for a computer.",
      anim: "adc"
    },
    {
      n: 53, part: 13, star: false,
      q: "Why is an ADC required?",
      hook: "Sensors speak ANALOG. Computers speak BINARY. ADC is the translator.",
      script: "Computers and digital controllers understand digital binary data, while many sensors produce analog signals. So Analog Sensor → ADC → Digital System. A temperature sensor voltage is converted for an Arduino.",
      formula: { fx: "Analog sensor → ADC → Digital system", fn: "Translator between sensor and computer" },
      real: "A temperature sensor's analog voltage can be converted into digital data for an Arduino.",
      anim: "adc"
    },
    {
      n: 54, part: 13, star: true,
      q: "Explain every step of analog-to-digital conversion.",
      hook: "SQE — Sample, Quantize, Encode. Take, round, name in binary.",
      script: "Three major steps. Sampling: take measurements at regular time intervals. Quantization: convert each sample to the nearest available digital level. Encoding: represent that level using binary code. Example: 2.3 V → nearest 2.25 V → binary 101.",
      list: [
        "Sampling — measure the analog signal at regular time intervals",
        "Quantization — map each sample to the nearest digital level",
        "Encoding — represent the quantized level with binary code"
      ],
      flow: ["Analog signal", "Sampling", "Quantization", "Encoding", "Binary code"],
      real: "This is how a microcontroller turns a sensor voltage into a number it can store.",
      anim: "adc-steps"
    },
    {
      n: 55, part: 13, star: false,
      q: "What is sampling?",
      hook: "SAMPLING = taking snapshots of the wave, again and again.",
      script: "Sampling is measuring an analog signal at regular intervals of time. Audio recording samples a microphone signal many times per second.",
      real: "Audio recording samples a microphone signal many times per second.",
      anim: "sampling"
    },
    {
      n: 56, part: 13, star: true,
      q: "State Nyquist theorem.",
      hook: "NYQUIST = sample at least TWICE the highest frequency. f_s ≥ 2 f_max.",
      script: "The Nyquist theorem states that the sampling frequency must be at least twice the highest frequency present in the signal. f_s ≥ 2 f_max. If highest frequency is 5 kHz, sample at least at 10 kHz.",
      formula: { fx: "f_s ≥ 2 f_max", fn: "If f_max = 5 kHz, then f_s ≥ 10 kHz" },
      anim: "nyquist"
    },
    {
      n: 57, part: 13, star: true,
      q: "What is aliasing? Explain it.",
      hook: "Too few snapshots → the wave PRETENDS to be a slower wave. That lie is aliasing.",
      script: "Aliasing occurs when a signal is sampled below the Nyquist rate. A high-frequency signal then appears as a different lower-frequency signal. Prevent it with f_s ≥ 2 f_max and an anti-aliasing filter before sampling.",
      list: [
        "Cause: sampling frequency lower than Nyquist rate",
        "Effect: wrong lower frequency appears",
        "Prevention: f_s ≥ 2 f_max and an anti-aliasing filter"
      ],
      real: "Poor sampling can make recorded audio sound distorted.",
      anim: "aliasing"
    },
    {
      n: 58, part: 13, star: true,
      q: "What is quantization?",
      hook: "QUANTIZE = round to the nearest allowed step. 2.3 V may become 2 V.",
      script: "Quantization maps each sampled analog value to the nearest available digital level. If levels are 0, 1, 2, 3 V and input is 2.3 V, it may become 2 V. This introduces a small quantization error.",
      formula: { fx: "2.3 V  →  nearest level  →  2 V", fn: "Leftover difference = quantization error" },
      anim: "quantize"
    },
    {
      n: 59, part: 13, star: false,
      q: "What is encoding?",
      hook: "ENCODE = give each level a BINARY NAME. 0→00, 1→01, 2→10, 3→11.",
      script: "Encoding is representing the quantized level using a binary code. Example: 0 → 00, 1 → 01, 2 → 10, 3 → 11. The ADC sends this binary information to a microcontroller.",
      table: {
        heads: ["Quantized level", "Binary code"],
        rows: [["0", "00"], ["1", "01"], ["2", "10"], ["3", "11"]]
      },
      real: "The ADC sends this binary information to a microcontroller.",
      anim: "encode"
    },
    {
      n: 60, part: 13, star: true,
      q: "How is binary code assigned in an ADC?",
      hook: "n-bit ADC has 2^n levels. 2-bit = 4 names: 00, 01, 10, 11.",
      script: "The ADC divides the input voltage range into quantization levels. Each level gets a unique binary number. For an n-bit ADC, number of levels = 2^n. A 2-bit ADC has 4 levels: 00, 01, 10, 11.",
      formula: { fx: "Number of levels = 2^n", fn: "2-bit ADC → 2² = 4 levels" },
      table: {
        heads: ["Level", "Binary"],
        rows: [["0", "00"], ["1", "01"], ["2", "10"], ["3", "11"]]
      },
      flow: ["Analog voltage", "Sampling", "Quantization", "Level selected", "Binary code", "Digital output"],
      real: "A microcontroller uses this binary code to determine the sensor's measured voltage.",
      anim: "encode"
    }
  ];

  const revision = [
    ["Transducer", "Physical quantity → useful signal"],
    ["Primary transducer", "Directly senses quantity"],
    ["Secondary transducer", "Converts primary output into electrical signal"],
    ["RTD", "Temperature changes metal resistance"],
    ["PTC", "Temperature ↑ → Resistance ↑"],
    ["Thermistor", "Very sensitive temperature resistor"],
    ["Pressure", "P = F / A"],
    ["Absolute pressure", "Reference = vacuum"],
    ["Gauge pressure", "Reference = atmosphere"],
    ["Differential pressure", "Difference between two pressures"],
    ["Strain gauge", "Strain → resistance change"],
    ["Capacitive sensor", "Pressure → distance change → C change"],
    ["Ultrasonic flowmeter", "Sound-wave travel time → flow"],
    ["TOF", "Distance from travel time, divide by 2"],
    ["Signal conditioning", "Makes sensor signal usable"],
    ["Amplifier", "Increases signal strength"],
    ["Op-amp", "High-gain differential amplifier"],
    ["Instrumentation amp", "Precise small differential measurement"],
    ["Noise", "Unwanted signal"],
    ["Resolution", "Smallest detectable change"],
    ["Thermal noise", "Random charge movement due to temperature"],
    ["Shot noise", "Random charge-carrier movement"],
    ["Pink noise", "1/f noise"],
    ["ADC", "Analog → Digital"],
    ["Sampling", "Take measurements at intervals"],
    ["Nyquist", "f_s ≥ 2 f_max"],
    ["Aliasing", "Wrong frequency due to insufficient sampling"],
    ["Quantization", "Sample → nearest digital level"],
    ["Encoding", "Level → binary code"],
    ["n-bit ADC", "2^n levels"]
  ];

  const quiz = [
    { q: "PTC means temperature up → resistance…", opts: ["Down", "Up", "Stays same", "Becomes zero"], a: 1, why: "PTC = Positive Temperature Coefficient. T ↑ R ↑." },
    { q: "Gauge pressure is measured from…", opts: ["Perfect vacuum", "Atmospheric pressure", "Another pressure", "Absolute zero"], a: 1, why: "Gauge → atmosphere. Absolute → vacuum." },
    { q: "Memory trick AVG: Absolute refers to…", opts: ["Atmosphere", "Another pressure", "Vacuum", "Voltage"], a: 2, why: "Absolute → Vacuum, Gauge → Atmosphere, Differential → another." },
    { q: "Strain gauge stretched: length ↑, area ↓, so R…", opts: ["Decreases", "Increases", "Unchanged", "Becomes negative"], a: 1, why: "R = ρL/A. L up, A down → R up." },
    { q: "Capacitance formula is…", opts: ["C = εA / d", "C = εd / A", "C = F / A", "C = v t / 2"], a: 0, why: "C = εA/d. Distance d changes with pressure." },
    { q: "TOF distance formula is…", opts: ["d = v t", "d = v t / 2", "d = 2 v t", "d = v / t"], a: 1, why: "Divide by 2 because the wave goes and comes back." },
    { q: "A FILC for signal conditioning starts with…", opts: ["Aliasing", "Amplification", "ADC", "Absolute pressure"], a: 1, why: "A FILC: Amplify, Filter, Isolate, Linearize, Convert." },
    { q: "High input impedance is needed to…", opts: ["Steal current from the sensor", "Not disturb the sensor", "Block the next circuit", "Create noise"], a: 1, why: "High IN = don't disturb sensor. Low OUT = drive next circuit." },
    { q: "Nyquist theorem: f_s must be at least…", opts: ["f_max", "2 f_max", "f_max / 2", "10 f_max"], a: 1, why: "Sampling frequency ≥ twice the highest signal frequency." },
    { q: "Aliasing happens when sampling is…", opts: ["Too fast", "Exactly Nyquist", "Too slow", "Digital only"], a: 2, why: "Too few samples → high frequency pretends to be a low frequency." },
    { q: "For n-bit ADC, number of levels is…", opts: ["n", "2n", "2^n", "n²"], a: 2, why: "2-bit → 4 levels. 8-bit → 256 levels." },
    { q: "Primary transducer example is…", opts: ["Strain gauge", "Diaphragm", "Op-amp", "ADC"], a: 1, why: "Diaphragm directly feels pressure. Strain gauge is secondary." },
    { q: "Pink noise is also called…", opts: ["White noise", "1/f noise", "Shot noise", "Thermal noise"], a: 1, why: "Pink = 1/f. Power falls as frequency rises." },
    { q: "ADC three steps in order are…", opts: ["Encode → Sample → Quantize", "Sample → Quantize → Encode", "Quantize → Encode → Sample", "Filter → Encode → Sample"], a: 1, why: "SQE: Sample, Quantize, Encode." },
    { q: "Differential capacitor: when C1 increases, C2…", opts: ["Also increases", "Decreases", "Stays same", "Becomes zero"], a: 1, why: "One up, one down — that is why it is more accurate." }
  ];

  const top5 = [
    { n: 3,  title: "RTD working principle",        anim: "rtd" },
    { n: 16, title: "Electro-mechanical pressure",  anim: "emech" },
    { n: 21, title: "Capacitive pressure sensor",   anim: "cap" },
    { n: 29, title: "Ultrasonic level measurement", anim: "level" },
    { n: 54, title: "ADC: Sample → Quantize → Encode", anim: "adc-steps" }
  ];

  return { parts, questions, revision, quiz, top5 };
})();
