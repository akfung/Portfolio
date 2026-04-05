import { useState, useEffect } from 'react'
import './Flower.css'

const DEFAULT_SVG_SIZE = 800
const CENTER_R = 200
const PETAL_LEN = 145
const PETAL_W = 100
const SEMI_R = PETAL_W / 2

const PETALS = [
  { angle: 0,   label: 'About',    shortDesc: 'Who I am',         petalDesc: 'MLE',         fullDesc: `` },
  { angle: 60,  label: 'Skills',   shortDesc: 'What I know',      petalDesc: 'What I know',      fullDesc: 'React · Node.js · SVG · CSS · Firebase · Python · TypeScript' },
  { angle: 120, label: 'Projects', shortDesc: 'What I\'ve built', petalDesc: 'What I\'ve built', fullDesc: 'Dashboards, games, portfolio sites, and open-source tools.' },
  { angle: 180, label: 'Contact',  shortDesc: 'Say hello',        petalDesc: 'Say hello',        fullDesc: 'hello@example.com  ·  github.com/example' },
  { angle: 240, label: 'Blog',     shortDesc: 'What I write',     petalDesc: 'What I write',     fullDesc: 'Web dev, design systems, and creative coding deep-dives.' },
  { angle: 300, label: 'Resume',   shortDesc: 'My background',    petalDesc: 'My background',    fullDesc: 'Available for freelance and full-time opportunities.' },
]

const PETAL_COLORS = ['#e06c75', '#e5a35a', '#d4b44a', '#56b06c', '#4a9fd4', '#9b7fd4']

function ThemeToggle({ isDark, onClick, iconX, iconY }) {
  const R = 20
  const sunColor = '#FDB813'
  const moonColor = '#C8C8FF'
  const rayInner = R + 5
  const rayOuter = R + 12

  const rays = Array.from({ length: 8 }, (_, i) => {
    const a = i * 45 * Math.PI / 180
    return {
      x1: Math.cos(a) * rayInner, y1: Math.sin(a) * rayInner,
      x2: Math.cos(a) * rayOuter,  y2: Math.sin(a) * rayOuter,
    }
  })

  return (
    <g transform={`translate(${iconX}, ${iconY})`} onClick={onClick} style={{ cursor: 'pointer' }}>
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

function Petal({ angle, label, shortDesc, petalDesc, fullDesc, color, id, cx, cy, onHover, onLeave, isDark }) {
  const [hovered, setHovered] = useState(false)

  const handleEnter = () => { setHovered(true);  onHover({ label, shortDesc, fullDesc }) }
  const handleLeave = () => { setHovered(false); onLeave() }

  const popOut = hovered ? 60 : -150

  const innerY = 0
  const outerY = -(CENTER_R + PETAL_LEN)
  const hw = PETAL_W / 1

  const petalPath = [
    `M ${-hw} ${innerY}`,
    `L ${-hw} ${outerY}`,
    `A ${hw} ${hw} 0 0 1 ${hw} ${outerY}`,
    `L ${hw} ${innerY}`,
    `Z`,
  ].join(' ')

  const arcId = `arc-${id}`
  const isBottom = angle > 90 && angle < 270

  const spanDeg = 70
  const fontSize = 28
  const topArcD    = petalTipArcD(outerY + 35, hw, spanDeg)
  const bottomArcD = petalTipArcD(outerY - fontSize + 35, hw, spanDeg, true)

  const descLines = splitText(petalDesc)

  const shortDescY = -330
  const fullDescStartY = shortDescY + 20

  return (
    <g transform={`translate(${cx}, ${cy}) rotate(${angle})`}>
      <defs>
        <path id={arcId} d={isBottom ? bottomArcD : topArcD} />
      </defs>

      <g
        className="petal-group"
        style={{ '--pop': `${-popOut}px` }}
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
      >
        <path
          d={petalPath}
          fill={isDark ? '#c8c8c8' : '#FFFFFF'}
          stroke={isDark ? '#c8c8c8' : 'white'}
          strokeWidth={1.5}
          style={{ transition: 'fill 0.8s ease-in-out, stroke 0.8s ease-in-out' }}
        />

        <text
          fontSize={28}
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
          fontSize={16}
          fill="#000000"
          fontWeight="600"
          transform={isBottom ? `translate(0, ${shortDescY}) rotate(180) translate(0, ${-shortDescY})` : ''}
        >
          {shortDesc}
        </text>

        {descLines.map((line, i) => {
          const lineY = fullDescStartY + (i * 18)
          return (
            <text
              key={i}
              y={lineY}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize={14}
              fill="#000000"
              fontWeight="500"
              transform={isBottom ? `translate(0, ${lineY}) rotate(180) translate(0, ${-lineY})` : ''}
            >
              {line}
            </text>
          )
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

export default function Flower() {
  const [svgSize, setSvgSize] = useState(DEFAULT_SVG_SIZE)
  const [hoveredPetal, setHoveredPetal] = useState(null)
  const [isDark, setIsDark] = useState(false)
  const [hasClickedTheme, setHasClickedTheme] = useState(false)

  const handleThemeClick = () => {
    setIsDark(d => !d)
    setHasClickedTheme(true)
  }

  useEffect(() => {
    const updateSize = () => {
      const size = Math.min(window.innerWidth, window.innerHeight) * 0.95
      setSvgSize(Math.max(size, DEFAULT_SVG_SIZE))
    }
    updateSize()
    window.addEventListener('resize', updateSize)
    return () => window.removeEventListener('resize', updateSize)
  }, [])

  const SVG_SIZE = svgSize
  const CX = SVG_SIZE / 2
  const CY = SVG_SIZE / 2 - 20  // shift center up a bit for the stem

  return (
    <svg
      width={SVG_SIZE}
      height={SVG_SIZE + 60}
      viewBox={`0 0 ${SVG_SIZE} ${SVG_SIZE + 60}`}
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
      <rect width={SVG_SIZE} height={SVG_SIZE + 60} fill="url(#dayGrad)" />
      {/* Night sky — sweeps top-to-bottom with a gradient blend at the wipe front.
          The mask is 3× the element height: top third = transparent (hidden),
          middle third = gradient blend, bottom third = black (fully shown).
          Animating mask-position from 0% (transparent over element) to 100%
          (black over element) moves the blend band through the screen. */}
      <rect width={SVG_SIZE} height={SVG_SIZE + 60} fill="url(#nightGrad)"
        style={{
          maskImage:          'linear-gradient(to bottom, transparent 0%, transparent 40%, black 60%, black 100%)',
          maskSize:           '100% 300%',
          maskRepeat:         'no-repeat',
          maskPosition:       `0% ${isDark ? '100%' : '0%'}`,
          WebkitMaskImage:    'linear-gradient(to bottom, transparent 0%, transparent 40%, black 60%, black 100%)',
          WebkitMaskSize:     '100% 300%',
          WebkitMaskRepeat:   'no-repeat',
          WebkitMaskPosition: `0% ${isDark ? '100%' : '0%'}`,
          transition:         'mask-position 0.8s ease-in-out, -webkit-mask-position 0.8s ease-in-out',
        }}
      />

      {/* Stem */}
      <rect
        x={CX - 9}
        y={CY + CENTER_R - 2}
        width={18}
        height={SVG_SIZE + 60 - (CY + CENTER_R) - 10}
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
          isDark={isDark}
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
        const labelY    = CY - CENTER_R + 36
        const descStartY = labelY + 32
        const lineHeight = 18
        const descLines  = splitText(hoveredPetal.fullDesc, 33)
        return (
          <g>
            {/* <text */}
            {/*   x={CX} */}
            {/*   y={labelY} */}
            {/*   textAnchor="middle" */}
            {/*   dominantBaseline="middle" */}
            {/*   fontSize={22} */}
            {/*   fontWeight="700" */}
            {/*   fill="#1a1a2e" */}
            {/* > */}
            {/*   {hoveredPetal.label} */}
            {/* </text> */}
            {descLines.map((line, i) => (
              <text
                key={i}
                x={CX}
                y={descStartY + i * lineHeight}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize={18}
                fontWeight="500"
                fill="#1a1a2e"
              >
                {line}
              </text>
            ))}
          </g>
        )
      })()}

      {/* "Click" hint — hidden after first theme click */}
      {!hasClickedTheme && (() => {
        const hintColor = isDark ? '#d4d4ff' : '#1a3a5c'
        const ix = SVG_SIZE - 80  // icon center x
        const iy = 55              // icon center y
        const arrowTipX  = ix - 35 // just clears the sun rays
        const arrowTailX = arrowTipX - 22
        const textX      = arrowTailX - 8
        return (
          <g className="theme-hint">
            <text x={textX} y={iy + 5} textAnchor="end"
              fontSize={15} fontWeight="600"
              fill={hintColor}
              style={{ transition: 'fill 0.8s ease-in-out' }}
            >
            </text>
            {/* Arrow shaft */}
            <line x1={arrowTailX} y1={iy} x2={arrowTipX} y2={iy}
              stroke={hintColor} strokeWidth={5} strokeLinecap="round"
              style={{ transition: 'stroke 0.8s ease-in-out' }}
            />
            {/* Arrowhead */}
            <path d={`M ${arrowTipX - 7} ${iy - 5} L ${arrowTipX} ${iy} L ${arrowTipX - 7} ${iy + 5}`}
              fill="none" stroke={hintColor} strokeWidth={5}
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
        iconX={SVG_SIZE - 55}
        iconY={55}
      />

    </svg>
  )
}
