import { useState, useEffect } from 'react'
import './Flower.css'

const DEFAULT_SVG_SIZE = 800
const CENTER_R = 200
const PETAL_LEN = 145
const PETAL_W = 85
const SEMI_R = PETAL_W / 2

const PETALS = [
  { angle: 0,   label: 'About',    shortDesc: 'Who I am',         fullDesc: 'Creative developer building beautiful, interactive web experiences.' },
  { angle: 60,  label: 'Skills',   shortDesc: 'What I know',      fullDesc: 'React · Node.js · SVG · CSS · Firebase · Python · TypeScript' },
  { angle: 120, label: 'Projects', shortDesc: 'What I\'ve built', fullDesc: 'Dashboards, games, portfolio sites, and open-source tools.' },
  { angle: 180, label: 'Contact',  shortDesc: 'Say hello',        fullDesc: 'hello@example.com  ·  github.com/example' },
  { angle: 240, label: 'Blog',     shortDesc: 'What I write',     fullDesc: 'Web dev, design systems, and creative coding deep-dives.' },
  { angle: 300, label: 'Resume',   shortDesc: 'My background',    fullDesc: 'Available for freelance and full-time opportunities.' },
]

const PETAL_COLORS = ['#e06c75', '#e5a35a', '#d4b44a', '#56b06c', '#4a9fd4', '#9b7fd4']

// Arc text path helper (in petal-local space, origin = SVG center)
function arcPathD(radius, spanDeg) {
  const startRad = (-90 - spanDeg) * (Math.PI / 180)
  const endRad   = (-90 + spanDeg) * (Math.PI / 180)
  const x1 = radius * Math.cos(startRad)
  const y1 = radius * Math.sin(startRad)
  const x2 = radius * Math.cos(endRad)
  const y2 = radius * Math.sin(endRad)
  return `M ${x1.toFixed(2)} ${y1.toFixed(2)} A ${radius} ${radius} 0 0 1 ${x2.toFixed(2)} ${y2.toFixed(2)}`
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

  // Petal component defined inside Flower to access CX, CY
  function Petal({ angle, label, shortDesc, fullDesc, color, id }) {
    const [hovered, setHovered] = useState(false)

    const popOut = hovered ? 60 : -80

    // Petal geometry in local coords (pointing up = -Y)
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

    // Arc text at the very tip of the petal
    const arcR = CENTER_R + PETAL_LEN
    const arcId = `arc-${id}`

    // Whether this petal is in the bottom half (text would be upside-down if not handled)
    const isBottom = angle > 90 && angle < 270

    // For bottom petals, reverse the arc so text reads outward
    const bottomArcD = (() => {
      const spanDeg = 28
      const startRad = (-90 + spanDeg) * (Math.PI / 180)
      const endRad   = (-90 - spanDeg) * (Math.PI / 180)
      const x1 = arcR * Math.cos(startRad)
      const y1 = arcR * Math.sin(startRad)
      const x2 = arcR * Math.cos(endRad)
      const y2 = arcR * Math.sin(endRad)
      return `M ${x1.toFixed(2)} ${y1.toFixed(2)} A ${arcR} ${arcR} 0 0 0 ${x2.toFixed(2)} ${y2.toFixed(2)}`
    })()

    const topArcD = arcPathD(arcR, 28)

    // Description text lines
    const descLines = splitText(fullDesc)
    const midY = -(CENTER_R + PETAL_LEN / 2)

    // Text positioning — negative Y points outward from petal center
    const shortDescY = -250
    const fullDescStartY = -170

    return (
      <g transform={`translate(${CX}, ${CY}) rotate(${angle})`}>
        <defs>
          <path id={arcId} d={isBottom ? bottomArcD : topArcD} />
        </defs>

        {/* Animated translation layer */}
        <g
          className="petal-group"
          style={{ '--pop': `${-popOut}px` }}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          {/* Petal shape */}
          <path
            d={petalPath}
            fill="#FFFFFF"
            stroke="white"
            strokeWidth={1.5}
            opacity={1}
          />

          {/* Arc label at base */}
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

          {/* Short desc — initially covered, visible when popped */}
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

          {/* Full desc — initially covered, visible when popped */}
          {descLines.map((line, i) => {
            const lineY = fullDescStartY - (i * 12)
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

  const handleBgClick = () => {
    // clicking background deselects — handled per petal
  }

  return (
    <svg
      width={SVG_SIZE}
      height={SVG_SIZE + 60}
      viewBox={`0 0 ${SVG_SIZE} ${SVG_SIZE + 60}`}
      className="flower-svg"
      onClick={handleBgClick}
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
          fullDesc={p.fullDesc}
          color={PETAL_COLORS[i]}
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

    </svg>
  )
}
