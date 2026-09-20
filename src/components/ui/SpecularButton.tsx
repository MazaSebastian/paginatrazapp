import React, { useRef, useEffect } from 'react'
import './SpecularButton.css'

const PAD = 20

export interface SpecularButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode
  size?: 'sm' | 'md' | 'lg'
  radius?: number
  tint?: string
  tintOpacity?: number
  blur?: number
  textColor?: string
  lineColor?: string
  baseColor?: string
  intensity?: number
  shineSize?: number
  shineFade?: number
  thickness?: number
  speed?: number
  followMouse?: boolean
  proximity?: number
  autoAnimate?: boolean
  disabled?: boolean
  onClick?: React.MouseEventHandler<HTMLButtonElement>
  className?: string
  type?: 'button' | 'submit' | 'reset'
  style?: React.CSSProperties
}

export function SpecularButton({
  children = 'Get Started',
  size = 'lg',
  radius = 18,
  tint = '#ffffff',
  tintOpacity = 0,
  blur = 0,
  textColor = '#f5f5f5',
  lineColor = '#ffffff',
  baseColor = '#525252',
  intensity = 1,
  shineSize = 10,
  shineFade = 40,
  thickness = 1,
  speed = 0.35,
  followMouse = true,
  proximity = 250,
  autoAnimate = false,
  disabled = false,
  onClick,
  className = '',
  type = 'button',
  style = {},
  ...rest
}: SpecularButtonProps) {
  const btnRef = useRef<HTMLButtonElement>(null)
  const fxRef = useRef<HTMLSpanElement>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  const propsRef = useRef({
    radius,
    lineColor,
    baseColor,
    intensity,
    shineSize,
    shineFade,
    thickness,
    speed,
    followMouse,
    proximity,
    autoAnimate
  })

  propsRef.current = {
    radius,
    lineColor,
    baseColor,
    intensity,
    shineSize,
    shineFade,
    thickness,
    speed,
    followMouse,
    proximity,
    autoAnimate
  }

  useEffect(() => {
    const btn = btnRef.current
    const fx = fxRef.current
    if (!btn || !fx) return

    let isMounted = true
    const canvas = document.createElement('canvas')
    canvasRef.current = canvas
    fx.appendChild(canvas)

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const sizeRef = { w: 0, h: 0 }
    const resize = () => {
      if (!btn || !isMounted) return
      const rect = btn.getBoundingClientRect()
      const w = Math.round(rect.width)
      const h = Math.round(rect.height)
      if (w === 0 || h === 0) return

      sizeRef.w = w
      sizeRef.h = h

      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.round((w + PAD * 2) * dpr)
      canvas.height = Math.round((h + PAD * 2) * dpr)
      canvas.style.width = `${w + PAD * 2}px`
      canvas.style.height = `${h + PAD * 2}px`
    }

    const ro = new ResizeObserver(resize)
    ro.observe(btn)
    resize()

    let pointerAngle: number | null = null
    let proximityT = 0

    const onPointerMove = (e: MouseEvent) => {
      if (!btn || !isMounted) return
      const rect = btn.getBoundingClientRect()
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2
      const dx = Math.max(rect.left - e.clientX, 0, e.clientX - rect.right)
      const dy = Math.max(rect.top - e.clientY, 0, e.clientY - rect.bottom)
      const dist = Math.hypot(dx, dy)

      if (dist === 0) {
        const nx = (e.clientX - cx) / (rect.width / 2 || 1)
        const ny = (cy - e.clientY) / (rect.height / 2 || 1)
        pointerAngle = Math.atan2(2 / (rect.height || 1), -2 / (rect.width || 1)) + nx * 0.3 + ny * 0.15
      } else {
        pointerAngle = Math.atan2(cy - e.clientY, e.clientX - cx)
      }

      const t = Math.max(0, 1 - dist / Math.max(propsRef.current.proximity, 1))
      proximityT = t * t * (3 - 2 * t)
    }

    window.addEventListener('pointermove', onPointerMove, { passive: true })

    let angle = 2.4
    let idleAngle = 2.4
    let bright = 0
    let last = performance.now()
    let raf = 0

    const update = (now: number) => {
      if (!isMounted) return

      const dt = Math.min((now - last) / 1000, 0.05)
      last = now
      const p = propsRef.current

      idleAngle += p.speed * dt
      const steer = p.followMouse && pointerAngle != null && (!p.autoAnimate || proximityT > 0)
      const target = steer && pointerAngle != null ? pointerAngle : idleAngle
      const diff = ((target - angle + Math.PI * 3) % (Math.PI * 2)) - Math.PI
      angle += diff * (1 - Math.exp(-dt * 7))

      const brightTarget = p.autoAnimate ? 1 : proximityT
      bright += (brightTarget - bright) * (1 - Math.exp(-dt * 8))

      const { w, h } = sizeRef
      if (w > 0 && h > 0 && ctx) {
        const dpr = Math.min(window.devicePixelRatio || 1, 2)
        ctx.save()
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
        ctx.clearRect(0, 0, w + PAD * 2, h + PAD * 2)

        const r = Math.min(p.radius, Math.min(w, h) / 2)
        const cx = PAD + w / 2
        const cy = PAD + h / 2

        // Posición del resplandor en el contorno
        const hx = cx + Math.cos(angle) * (w / 2)
        const hy = cy - Math.sin(angle) * (h / 2)

        // Trazo base sutil
        ctx.beginPath()
        if (typeof ctx.roundRect === 'function') {
          ctx.roundRect(PAD, PAD, w, h, r)
        } else {
          ctx.rect(PAD, PAD, w, h)
        }
        ctx.lineWidth = p.thickness
        ctx.strokeStyle = p.baseColor
        ctx.globalAlpha = 0.35
        ctx.stroke()

        // Resplandor especular dinámico
        if (bright > 0.005) {
          ctx.beginPath()
          if (typeof ctx.roundRect === 'function') {
            ctx.roundRect(PAD, PAD, w, h, r)
          } else {
            ctx.rect(PAD, PAD, w, h)
          }

          const spread = Math.max(w, h) * 0.45
          const grad = ctx.createRadialGradient(hx, hy, 0, hx, hy, spread)
          grad.addColorStop(0, p.lineColor)
          grad.addColorStop(0.3, p.lineColor)
          grad.addColorStop(1, 'transparent')

          ctx.lineWidth = p.thickness * 1.6
          ctx.strokeStyle = grad
          ctx.globalAlpha = Math.min(1, p.intensity * bright)
          ctx.shadowColor = p.lineColor
          ctx.shadowBlur = 10 * p.intensity * bright
          ctx.stroke()
        }

        ctx.restore()
      }

      raf = requestAnimationFrame(update)
    }

    raf = requestAnimationFrame(update)

    return () => {
      isMounted = false
      cancelAnimationFrame(raf)
      ro.disconnect()
      window.removeEventListener('pointermove', onPointerMove)
      if (canvas.parentNode === fx) {
        fx.removeChild(canvas)
      }
    }
  }, [])

  return (
    <button
      ref={btnRef}
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`specular-button specular-button--${size}${className ? ` ${className}` : ''}`}
      style={{
        '--sb-radius': `${radius}px`,
        '--sb-tint': tint,
        '--sb-tint-opacity': tintOpacity,
        '--sb-blur': `${blur}px`,
        '--sb-text-color': textColor,
        ...style
      } as React.CSSProperties}
      {...rest}
    >
      <span ref={fxRef} className="specular-button__fx" aria-hidden="true" />
      <span className="specular-button__label">{children}</span>
    </button>
  )
}

export default SpecularButton
