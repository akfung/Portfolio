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

function Petal({ angle, label, shortDesc, petalDesc, fullDesc, color, id, cx, cy, onHover, onLeave }) {
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
          fill="#FFFFFF"
          stroke="white"
          strokeWidth={1.5}
          opacity={1}
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
        <radialGradient id="bgGrad" cx="50%" cy="50%" r="70%">
          <stop offset="0%" stopColor="#1a1a2e" />
          <stop offset="100%" stopColor="#0d0d1a" />
        </radialGradient>
        <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="rgba(0,0,0,0.4)" />
        </filter>
      </defs>

      {/* Background */}
      <rect width={SVG_SIZE} height={SVG_SIZE + 60} fill="url(#bgGrad)" />

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
        />
      ))}

      {/* Center circle */}
      <circle
        cx={CX}
        cy={CY}
        r={CENTER_R}
        fill="#FFE35E"
        stroke="white"
        strokeWidth={1.5}
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

    </svg>
  )
}
