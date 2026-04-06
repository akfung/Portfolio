import { useState, useEffect, useMemo } from 'react'
import './Flower.css'
import constellationImg from '../assets/constellation.png'

const DEFAULT_SVG_SIZE = 800
const STAR_COUNT = 80   // ← adjust to change how many stars appear in the night sky
const BIRD_COUNT = 12   // ← adjust to change how many birds appear in the day sky
// Base geometry at 800px — all values scale proportionally via the `scale` prop
const BASE_CENTER_R  = 150   // 200 × 0.75
const BASE_PETAL_LEN = 109   // 145 × 0.75
const BASE_PETAL_W   = 75    // 100 × 0.75

const PETALS = [
  { angle: 0,   label: 'About',    shortDesc: 'AI/ML Engineer',         petalDesc: '',         fullDesc: `Machine Learning Engineer with experience in SQL, Python, and NLP. Extensive history of teamwork and collaboration in enterprise AI inference and training.` },
  { angle: 60,  label: 'Skills',   shortDesc: 'At least',      petalDesc: 'some of them',      fullDesc: 'Python · SQL · AWS · GCS · Spark · Pytorch · Tensorflow · SKlearn · XGBoost' },
  { angle: 120, label: 'Education', shortDesc: 'UC Irvine', petalDesc: '', fullDesc: 'MS Biotech · BS Chemistry · BS Immunology' },
  { angle: 180, label: 'Contact',  shortDesc: 'Open to inquiry',        petalDesc: [
    { text: 'amoskfung@gmail.com', url: 'mailto:amoskfung@gmail.com' },
  ],        fullDesc: '',
 },
  { angle: 240, label: 'Github',     shortDesc: 'Some projects',     petalDesc: [{ text: 'Github',             url: 'https://github.com/akfung' }],     fullDesc: '' },
  { angle: 300, label: 'Linkedin',   shortDesc: 'Say Hello!',    petalDesc: [{ text: 'Linkedin',           url: 'https://www.linkedin.com/in/amos-fung-72a265b7/' }],    fullDesc: '' },
]

const PETAL_COLORS = ['#e06c75', '#e5a35a', '#d4b44a', '#56b06c', '#4a9fd4', '#9b7fd4']

function Stars({ count, svgW, svgH }) {
  // Star data uses fractional positions so they stay proportional on resize
  const stars = useMemo(() =>
    Array.from({ length: count }, () => ({
      xFrac:    Math.random(),
      yFrac:    Math.random() / 3,          // upper third of viewport
      r:        Math.random() * 1.2 + 0.4, // 0.4 – 1.6 px radius
      delay:    Math.random() * 10,         // stagger twinkle starts
      duration: Math.random() * 5 + 5,     // 5 – 10 s per cycle
    })),
  [count]) // only regenerate when star count changes

  return (
    <g>
      {stars.map((star, i) => (
        <g key={i} transform={`translate(${(star.xFrac * svgW).toFixed(1)},${(star.yFrac * svgH).toFixed(1)})`}>
          {/* Star body */}
          <circle r={star.r} className="star-body" style={{
            animationDelay:    `-${star.delay.toFixed(2)}s`,
            animationDuration: `${star.duration.toFixed(2)}s`,
          }} />
          {/* Rays — 4 lines through center = 8-pointed sparkle */}
          <g className="star-rays" style={{
            animationDelay:    `-${star.delay.toFixed(2)}s`,
            animationDuration: `${star.duration.toFixed(2)}s`,
          }}>
            {[0, 45, 90, 135].map(angle => (
              <line key={angle} x1={0} y1={-4} x2={0} y2={4}
                stroke="white" strokeWidth={0.7} strokeLinecap="round"
                transform={`rotate(${angle})`}
              />
            ))}
          </g>
        </g>
      ))}
    </g>
  )
}

function Birds({ count, svgW, svgH, scale }) {
  // Bird data uses fractional positions so they stay proportional on resize
  const birds = useMemo(() =>
    Array.from({ length: count }, () => ({
      xFrac:    Math.random(),
      yFrac:    Math.random() / 3,          // upper third of viewport
      delay:    Math.random() * 8,          // stagger flap starts
      duration: Math.random() * 3 + 4,     // 4–7 s per flap cycle
      sizeVar:  Math.random() * 0.5 + 0.75, // 0.75–1.25 size variation
    })),
  [count]) // only regenerate when bird count changes

  return (
    <g>
      {birds.map((bird, i) => {
        const x  = (bird.xFrac * svgW).toFixed(1)
        const y  = (bird.yFrac * svgH).toFixed(1)
        const bs = scale * bird.sizeVar
        const r   = (2.5 * bs).toFixed(2)   // body radius
        const wx  = (11  * bs).toFixed(2)   // wing tip x distance
        const wmx = (5.5 * bs).toFixed(2)   // wing mid-base x
        const wy  = (-7  * bs).toFixed(2)   // wing tip y (above body)
        const wb  = (1.5 * bs).toFixed(2)   // wing base y (inside body circle)
        const animStyle = {
          animationDelay:    `-${bird.delay.toFixed(2)}s`,
          animationDuration: `${bird.duration.toFixed(2)}s`,
          transformOrigin:   '0px 0px',
        }
        return (
          <g key={i} transform={`translate(${x}, ${y})`}>
            {/* Wings rendered before body so the circle covers their base edges */}
            {/* Left wing */}
            <g className="bird-wing-left" style={animStyle}>
              <path d={`M 0 ${wb} L -${wx} ${wy} L -${wmx} ${wb} Z`} fill="black" />
            </g>
            {/* Right wing */}
            <g className="bird-wing-right" style={animStyle}>
              <path d={`M 0 ${wb} L ${wx} ${wy} L ${wmx} ${wb} Z`} fill="black" />
            </g>
            {/* Body on top to cover wing bases */}
            <circle r={r} fill="black" />
          </g>
        )
      })}
    </g>
  )
}

function ThemeToggle({ isDark, onClick, iconX, iconY, scale = 1 }) {
  const R = Math.max(12, Math.round(20 * scale))
  const sunColor = '#FDB813'
  const moonColor = '#C8C8FF'
  const rayInner = R + Math.round(5 * scale)
  const rayOuter = R + Math.round(12 * scale)

  const rays = Array.from({ length: 8 }, (_, i) => {
    const a = i * 45 * Math.PI / 180
    return {
      x1: Math.cos(a) * rayInner, y1: Math.sin(a) * rayInner,
      x2: Math.cos(a) * rayOuter,  y2: Math.sin(a) * rayOuter,
    }
  })

  return (
    <g transform={`translate(${iconX}, ${iconY})`} onPointerUp={(e) => { e.stopPropagation(); onClick() }} style={{ cursor: 'pointer', touchAction: 'manipulation' }}>
      <defs>
        {/* Cutout circle shifted right creates a left-facing crescent */}
        <mask id="moonMask">
          <rect x={-R - 2} y={-R - 2} width={(R + 2) * 2} height={(R + 2) * 2} fill="white" />
          <circle cx={R * 0.38} cy={-R * 0.1} r={R * 0.82} fill="black" />
        </mask>
      </defs>

      {/* Large transparent click target */}
      <circle cx={0} cy={0} r={rayOuter + 4} fill="transparent" />

      {/* Sun rays */}
      <g style={{
        opacity: isDark ? 0 : 1,
        transform: isDark ? 'rotate(30deg) scale(0.6)' : 'rotate(0deg) scale(1)',
        transformBox: 'fill-box',
        transformOrigin: 'center',
        transition: 'opacity 0.45s ease, transform 0.55s ease',
      }}>
        {rays.map((ray, i) => (
          <line key={i} x1={ray.x1} y1={ray.y1} x2={ray.x2} y2={ray.y2}
            stroke={sunColor} strokeWidth={3} strokeLinecap="round" />
        ))}
      </g>

      {/* Sun body */}
      <circle cx={0} cy={0} r={R} fill={sunColor}
        style={{ opacity: isDark ? 0 : 1, transition: 'opacity 0.4s ease' }} />

      {/* Moon body (crescent via mask) */}
      <circle cx={0} cy={0} r={R} fill={moonColor} mask="url(#moonMask)"
        style={{ opacity: isDark ? 1 : 0, transition: 'opacity 0.4s ease' }} />
    </g>
  )
}

function Petal({ angle, label, shortDesc, petalDesc, fullDesc, color, id, cx, cy, onHover, onLeave, onTap, isTapped, isDark, scale, centerR, petalLen, petalW }) {
  const [hovered, setHovered] = useState(false)  // mouse hover (desktop)

  const isOut = hovered || isTapped

  // Desktop: pointer enter/leave drives hover
  const handlePointerEnter = (e) => {
    if (e.pointerType !== 'mouse') return
    setHovered(true)
    onHover({ label, shortDesc, fullDesc })
  }
  const handlePointerLeave = (e) => {
    if (e.pointerType !== 'mouse') return
    setHovered(false)
    if (!isTapped) onLeave()
  }
  // Mobile: pointerUp is more reliable than onClick for detecting touch taps
  const handlePointerUp = (e) => {
    if (e.pointerType !== 'touch') return
    onTap(angle)
  }

  const s = scale
  const popOut = isOut ? Math.round(25 * s) : Math.round(-130 * s)

  const innerY = 0
  const outerY = -(centerR + petalLen)
  const hw     = petalW

  const petalPath = [
    `M ${-hw} ${innerY}`,
    `L ${-hw} ${outerY}`,
    `A ${hw} ${hw} 0 0 1 ${hw} ${outerY}`,
    `L ${hw} ${innerY}`,
    `Z`,
  ].join(' ')

  const arcId    = `arc-${id}`
  const isBottom = angle > 90 && angle < 270

  const spanDeg    = 70
  const labelSize  = Math.round(28 * s)
  const arcOffset  = Math.round(35 * s)
  const topArcD    = petalTipArcD(outerY + arcOffset, hw, spanDeg)
  const bottomArcD = petalTipArcD(outerY - labelSize + arcOffset, hw, spanDeg, true)

  const descRuns       = toRuns(petalDesc)
  // Anchor text positions to centerR so they stay hidden inside the
  // circle at rest (translateY +100s) and clear it when popped (translateY -25s)
  const shortDescY     = -(centerR + Math.round(50 * s))
  const fullDescStartY = shortDescY + Math.round(20 * s)
  const lineHeight     = Math.round(18 * s)

  return (
    <g transform={`translate(${cx}, ${cy}) rotate(${angle})`}>
      <defs>
        <path id={arcId} d={isBottom ? bottomArcD : topArcD} />
      </defs>

      <g
        className="petal-group"
        style={{ '--pop': `${-popOut}px`, touchAction: 'manipulation' }}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
        onPointerUp={handlePointerUp}
      >
        <path
          d={petalPath}
          fill={isDark ? '#c8c8c8' : '#FFFFFF'}
          stroke={isDark ? '#c8c8c8' : 'white'}
          strokeWidth={Math.max(1, 1.5 * s)}
          style={{ transition: 'fill 0.8s ease-in-out, stroke 0.8s ease-in-out' }}
        />

        <text
          fontSize={labelSize}
          fill="#000000"
          fontWeight="700"
          letterSpacing="0.5"
          textAnchor="middle"
        >
          <textPath href={`#${arcId}`} startOffset="50%">
            {label}
          </textPath>
        </text>

        <text
          y={shortDescY}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize={Math.round(16 * s)}
          fill="#000000"
          fontWeight="600"
          transform={isBottom ? `translate(0, ${shortDescY}) rotate(180) translate(0, ${-shortDescY})` : ''}
        >
          {shortDesc}
        </text>

        {descRuns.map((run, i) => {
          const lineY = fullDescStartY + (i * lineHeight)
          const textEl = (
            <text
              y={lineY}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize={Math.round(14 * s)}
              fill={run.url ? '#4a9fd4' : '#000000'}
              fontWeight="500"
              transform={isBottom ? `translate(0, ${lineY}) rotate(180) translate(0, ${-lineY})` : ''}
              style={run.url ? { textDecoration: 'underline', cursor: 'pointer' } : undefined}
            >
              {run.text}
            </text>
          )
          return run.url
            ? <a key={i} href={run.url} target="_blank" rel="noreferrer">{textEl}</a>
            : <g key={i}>{textEl}</g>
        })}
      </g>
    </g>
  )
}

// Arc text path along the outer petal curve (radius hw, centered at petal tip)
function petalTipArcD(outerY, hw, spanDeg, reversed = false) {
  const s = reversed ? 1 : -1
  const startRad = (-90 + s * spanDeg) * (Math.PI / 180)
  const endRad   = (-90 - s * spanDeg) * (Math.PI / 180)
  const x1 = hw * Math.cos(startRad)
  const y1 = outerY + hw * Math.sin(startRad)
  const x2 = hw * Math.cos(endRad)
  const y2 = outerY + hw * Math.sin(endRad)
  return `M ${x1.toFixed(2)} ${y1.toFixed(2)} A ${hw} ${hw} 0 0 ${reversed ? 0 : 1} ${x2.toFixed(2)} ${y2.toFixed(2)}`
}

function splitText(text, maxLen = 22) {
  const words = text.split(' ')
  const lines = []
  let current = ''
  for (const word of words) {
    if ((current + ' ' + word).trim().length > maxLen) {
      if (current) lines.push(current)
      current = word
    } else {
      current = (current + ' ' + word).trim()
    }
  }
  if (current) lines.push(current)
  return lines
}

// Normalise a desc field to [{text, url?}, ...] runs.
// Pass a plain string for auto word-wrap, or a pre-structured array for
// explicit lines with optional URL links: [{text: 'Label', url: 'https://...'}]
function toRuns(desc, maxLen = 22) {
  if (!desc) return []
  if (typeof desc === 'string') return splitText(desc, maxLen).map(text => ({ text }))
  return desc
}

export default function Flower() {
  const [svgW, setSvgW] = useState(window.innerWidth)
  const [svgH, setSvgH] = useState(window.innerHeight)
  const [hoveredPetal, setHoveredPetal] = useState(null)
  const [tappedPetalAngle, setTappedPetalAngle] = useState(null)
  const [isDark, setIsDark] = useState(false)
  const [hasClickedTheme, setHasClickedTheme] = useState(false)

  // Mobile tap: exclusive — tapping a second petal dismisses the first
  const handleTap = (angle) => {
    const petal = PETALS.find(p => p.angle === angle)
    if (tappedPetalAngle === angle) {
      setTappedPetalAngle(null)
      setHoveredPetal(null)
    } else {
      setTappedPetalAngle(angle)
      setHoveredPetal({ label: petal.label, shortDesc: petal.shortDesc, fullDesc: petal.fullDesc })
    }
  }

  const handleThemeClick = () => {
    setIsDark(d => !d)
    setHasClickedTheme(true)
  }

  useEffect(() => {
    const updateSize = () => {
      setSvgW(window.innerWidth)
      setSvgH(window.innerHeight)
    }
    window.addEventListener('resize', updateSize)
    return () => window.removeEventListener('resize', updateSize)
  }, [])

  // Scale all geometry proportionally to the smaller viewport dimension
  const SVG_SIZE = Math.min(svgW, svgH)
  const STEM_WIDTH = 60
  const scale    = SVG_SIZE / DEFAULT_SVG_SIZE
  const CENTER_R = Math.round(BASE_CENTER_R * scale)
  const PETAL_LEN = Math.round(BASE_PETAL_LEN * scale)
  const PETAL_W   = Math.round(BASE_PETAL_W   * scale)
  const CX = svgW / 2
  const CY = svgH / 2 - Math.round(20 * scale)

  return (
    <svg
      width={svgW}
      height={svgH}
      viewBox={`0 0 ${svgW} ${svgH}`}
      className="flower-svg"
    >
      <defs>
        <radialGradient id="centerGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffe566" />
          <stop offset="100%" stopColor="#f0a500" />
        </radialGradient>
        {/* Day sky: deep blue at top fading to pale horizon */}
        <linearGradient id="dayGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#3a8fc7" />
          <stop offset="55%"  stopColor="#74bde0" />
          <stop offset="100%" stopColor="#b8dff0" />
        </linearGradient>
        {/* Night sky: deep navy at top fading to dark indigo */}
        <linearGradient id="nightGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#02051a" />
          <stop offset="55%"  stopColor="#060d38" />
          <stop offset="100%" stopColor="#0d1a5c" />
        </linearGradient>
        <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="rgba(0,0,0,0.4)" />
        </filter>
      </defs>

      {/* Day sky background (always underneath) */}
      <rect width={svgW} height={svgH} fill="url(#dayGrad)" />
      {/* Night sky — fades in/out over the day sky */}
      <rect width={svgW} height={svgH} fill="url(#nightGrad)"
        style={{
          opacity:    isDark ? 1 : 0,
          transition: 'opacity 0.8s ease-in-out',
        }}
      />

      {/* Stars — rendered behind all flower elements, fade with night sky */}
      <g style={{
        opacity: isDark ? 1 : 0,
        transition: 'opacity 0.8s ease-in-out',
        pointerEvents: 'none',
      }}>
        <Stars count={STAR_COUNT} svgW={svgW} svgH={svgH} />
      </g>

      {/* Constellation portrait — outside the opacity group so mix-blend-mode
          blends against the actual background layers, not an offscreen buffer.
          Fade-in is delayed so the sky is dark before the image appears. */}
      <image
        href={constellationImg}
        x={Math.round(15 * scale)}
        y={Math.round(15 * scale)}
        width={Math.round(225 * scale)}
        height={Math.round(280 * scale)}
        preserveAspectRatio="xMinYMin meet"
        style={{
          mixBlendMode: 'screen',
          opacity: isDark ? 1 : 0,
          transition: isDark
            ? 'opacity 0.5s ease-in-out 0.5s'  // wait for sky to darken first
            : 'opacity 0.3s ease-in-out',
          pointerEvents: 'none',
        }}
      />

      {/* Birds — rendered behind all flower elements, fade with day sky */}
      <g style={{
        opacity: isDark ? 0 : 1,
        transition: 'opacity 0.8s ease-in-out',
        pointerEvents: 'none',
      }}>
        <Birds count={BIRD_COUNT} svgW={svgW} svgH={svgH} scale={scale} />
      </g>

      {/* Stem */}
      <rect
        x={CX - 9 - (STEM_WIDTH/3)}
        y={CY + CENTER_R - 2}
        width={STEM_WIDTH}
        height={svgH - (CY + CENTER_R) - 10}
        fill="#3a7d44"
        rx={4}
      />


      {/* Petals (rendered before center so center overlaps them) */}
      {PETALS.map((p, i) => (
        <Petal
          key={p.angle}
          id={i}
          angle={p.angle}
          label={p.label}
          shortDesc={p.shortDesc}
          petalDesc={p.petalDesc}
          fullDesc={p.fullDesc}
          color={PETAL_COLORS[i]}
          cx={CX}
          cy={CY}
          onHover={setHoveredPetal}
          onLeave={() => setHoveredPetal(null)}
          onTap={handleTap}
          isTapped={tappedPetalAngle === p.angle}
          isDark={isDark}
          scale={scale}
          centerR={CENTER_R}
          petalLen={PETAL_LEN}
          petalW={PETAL_W}
        />
      ))}

      {/* Center circle */}
      <circle
        cx={CX}
        cy={CY}
        r={CENTER_R}
        fill={isDark ? '#c49a00' : '#FFE35E'}
        stroke={isDark ? '#c49a00' : 'white'}
        strokeWidth={1.5}
        style={{ transition: 'fill 0.8s ease-in-out, stroke 0.8s ease-in-out' }}
      />

      {/* Center text — shown when a petal is hovered */}
      {hoveredPetal && (() => {
        const labelY     = CY - CENTER_R + Math.round(36 * scale)
        const descStartY = labelY + Math.round(32 * scale)
        const lineHeight = Math.round(18 * scale)
        const fontSize   = Math.round(18 * scale)

        // How many chars fit on one line: ~80% of circle diameter / avg char width
        // (avg char width ≈ 0.55 × fontSize for system-ui; both scale together so
        //  charsPerLine ends up scale-independent, which is correct)
        const charsPerLine = Math.max(10, Math.floor((CENTER_R * 1.6) / (fontSize * 0.55)))

        // How many lines fit before hitting the bottom of the circle (with padding)
        const maxLines = Math.floor((CENTER_R * 2 - Math.round(88 * scale)) / lineHeight)

        const runs = toRuns(hoveredPetal.fullDesc, charsPerLine).slice(0, maxLines)
        return (
          <g>
            {runs.map((run, i) => {
              const y = descStartY + i * lineHeight
              const textEl = (
                <text
                  x={CX} y={y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize={Math.round(18 * scale)}
                  fontWeight="500"
                  fill={run.url ? '#4a9fd4' : '#1a1a2e'}
                  style={run.url ? { textDecoration: 'underline', cursor: 'pointer' } : undefined}
                >
                  {run.text}
                </text>
              )
              return run.url
                ? <a key={i} href={run.url} target="_blank" rel="noreferrer">{textEl}</a>
                : <g key={i}>{textEl}</g>
            })}
          </g>
        )
      })()}

      {/* "Click" hint — hidden after first theme click */}
      {!hasClickedTheme && (() => {
        const hintColor = isDark ? '#d4d4ff' : '#1a3a5c'
        const ix = svgW - Math.round(80 * scale)
        const iy = Math.round(55 * scale)
        const arrowTipX  = ix - Math.round(35 * scale)
        const arrowTailX = arrowTipX - Math.round(22 * scale)
        const textX      = arrowTailX - Math.round(8 * scale)
        return (
          <g className="theme-hint">
            <text x={textX} y={iy + Math.round(5 * scale)} textAnchor="end"
              fontSize={Math.round(15 * scale)} fontWeight="600"
              fill={hintColor}
              style={{ transition: 'fill 0.8s ease-in-out' }}
            > Tap/Click
            </text>
            {/* Arrow shaft */}
            <line x1={arrowTailX} y1={iy} x2={arrowTipX} y2={iy}
              stroke={hintColor} strokeWidth={Math.max(1.5, 3 * scale)} strokeLinecap="round"
              style={{ transition: 'stroke 0.8s ease-in-out' }}
            />
            {/* Arrowhead */}
            <path d={`M ${arrowTipX - Math.round(7 * scale)} ${iy - Math.round(5 * scale)} L ${arrowTipX} ${iy} L ${arrowTipX - Math.round(7 * scale)} ${iy + Math.round(5 * scale)}`}
              fill="none" stroke={hintColor} strokeWidth={Math.max(1.5, 3 * scale)}
              strokeLinecap="round" strokeLinejoin="round"
              style={{ transition: 'stroke 0.8s ease-in-out' }}
            />
          </g>
        )
      })()}

      {/* Sun / Moon toggle — top right corner */}
      <ThemeToggle
        isDark={isDark}
        onClick={handleThemeClick}
        iconX={svgW - Math.round(55 * scale)}
        iconY={Math.round(55 * scale)}
        scale={scale}
      />

    </svg>
  )
}
