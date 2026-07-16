// Génère une image (carte) d'un niveau via Canvas et déclenche son
// téléchargement — pensé pour être partagé sur Reddit/Discord/réseaux
// sociaux sans dépendre d'un service externe.
const FONT_MONO = "'JetBrains Mono', 'Courier New', monospace"
const FONT_SANS = "'Inter', system-ui, sans-serif"

function wrapText(ctx, text, x, y, maxWidth, lineHeight, maxLines = 4) {
  const words = text.split(' ')
  let line = ''
  let lines = 0
  for (let i = 0; i < words.length; i++) {
    const test = line ? `${line} ${words[i]}` : words[i]
    if (ctx.measureText(test).width > maxWidth && line) {
      ctx.fillText(line, x, y)
      line = words[i]
      y += lineHeight
      lines++
      if (lines >= maxLines - 1) {
        const rest = words.slice(i).join(' ')
        ctx.fillText(ctx.measureText(rest).width > maxWidth ? `${rest.slice(0, 60)}…` : rest, x, y)
        return
      }
    } else {
      line = test
    }
  }
  if (line) ctx.fillText(line, x, y)
}

function drawPill(ctx, x, y, text, color) {
  ctx.font = `600 18px ${FONT_MONO}`
  const width = ctx.measureText(text).width + 28
  const height = 34
  const radius = 17
  ctx.beginPath()
  ctx.moveTo(x + radius, y)
  ctx.arcTo(x + width, y, x + width, y + height, radius)
  ctx.arcTo(x + width, y + height, x, y + height, radius)
  ctx.arcTo(x, y + height, x, y, radius)
  ctx.arcTo(x, y, x + width, y, radius)
  ctx.closePath()
  ctx.fillStyle = `${color}22`
  ctx.fill()
  ctx.strokeStyle = color
  ctx.lineWidth = 1.5
  ctx.stroke()
  ctx.fillStyle = color
  ctx.textBaseline = 'middle'
  ctx.fillText(text, x + 14, y + height / 2 + 1)
  ctx.textBaseline = 'alphabetic'
  return width
}

// Repli simple (pas de normalisation Unicode) : tout ce qui n'est pas
// alphanumérique devient un tiret, suffisant pour un nom de fichier.
function slugify(str) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function downloadLevelCard({ name, className, dangerLabel, description, url }) {
  const canvas = document.createElement('canvas')
  canvas.width = 1000
  canvas.height = 600
  const ctx = canvas.getContext('2d')

  ctx.fillStyle = '#030305'
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  const glowA = ctx.createRadialGradient(150, 120, 10, 150, 120, 420)
  glowA.addColorStop(0, 'rgba(0, 240, 255, 0.10)')
  glowA.addColorStop(1, 'rgba(0, 240, 255, 0)')
  ctx.fillStyle = glowA
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  const glowB = ctx.createRadialGradient(870, 500, 10, 870, 500, 420)
  glowB.addColorStop(0, 'rgba(255, 46, 196, 0.09)')
  glowB.addColorStop(1, 'rgba(255, 46, 196, 0)')
  ctx.fillStyle = glowB
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  ctx.strokeStyle = '#26263a'
  ctx.lineWidth = 2
  ctx.strokeRect(20, 20, canvas.width - 40, canvas.height - 40)

  ctx.fillStyle = '#ffd60a'
  ctx.font = `700 44px ${FONT_MONO}`
  wrapText(ctx, name, 60, 115, 880, 52, 2)

  let cursorX = 60
  cursorX += drawPill(ctx, cursorX, 165, className, '#00f0ff') + 14
  drawPill(ctx, cursorX, 165, dangerLabel, '#ff2d55')

  ctx.fillStyle = '#f2f2fa'
  ctx.font = `22px ${FONT_SANS}`
  wrapText(ctx, description, 60, 250, 880, 34, 5)

  ctx.strokeStyle = '#26263a'
  ctx.beginPath()
  ctx.moveTo(60, 500)
  ctx.lineTo(940, 500)
  ctx.stroke()

  ctx.fillStyle = '#00f0ff'
  ctx.font = `600 20px ${FONT_MONO}`
  ctx.fillText(url, 60, 545)

  ctx.fillStyle = '#8b8ba8'
  ctx.font = `16px ${FONT_MONO}`
  ctx.textAlign = 'right'
  ctx.fillText('BACKROOMS MAP', 940, 545)
  ctx.textAlign = 'left'

  canvas.toBlob((blob) => {
    if (!blob) return
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `${slugify(name) || 'backrooms-level'}.png`
    document.body.appendChild(link)
    link.click()
    link.remove()
    setTimeout(() => URL.revokeObjectURL(link.href), 3000)
  })
}
