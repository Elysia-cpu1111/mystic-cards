import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { CARDS, drawCardBack } from '../data/cards'

const CARD_W = 3.2
const CARD_H = 4.8
const SPIRAL_R = 3.0
const CARD_COUNT = 12

export default function Scene3D({
  speedMultiplier,
  onCardFacing,
  revealedCard,
  onResetReveal,
}) {
  const containerRef = useRef(null)
  const cleanupRef = useRef(null)
  const speedRef = useRef(1)
  const cardsRef = useRef([])
  const revealRef = useRef(null)  // { cardIndex, cardObj, progress }

  // 同步速度
  useEffect(() => { speedRef.current = speedMultiplier }, [speedMultiplier])

  // 翻牌回调
  useEffect(() => {
    if (revealedCard !== null && cardsRef.current.length > 0) {
      const idx = revealedCard
      const cardObj = cardsRef.current[idx]
      if (cardObj && !revealRef.current) {
        revealRef.current = { cardIndex: idx, cardObj, progress: 0 }
      }
    }
  }, [revealedCard])

  // 重置翻牌
  useEffect(() => {
    if (revealedCard === null && revealRef.current) {
      revealRef.current = null
      // 刷新所有贴图
      refreshCardTextures()
    }
  }, [revealedCard])

  // ─── 创建卡牌贴图 ───
  function createCardTexture(seed) {
    const canvas = document.createElement('canvas')
    canvas.width = 320
    canvas.height = 480
    const ctx = canvas.getContext('2d')
    drawCardBack(ctx, canvas.width, canvas.height, seed)
    return new THREE.CanvasTexture(canvas)
  }

  function createFrontTexture(seed) {
    const card = CARDS[seed]
    const canvas = document.createElement('canvas')
    canvas.width = 320
    canvas.height = 480
    const ctx = canvas.getContext('2d')

    // 正面背景
    const bg = ctx.createRadialGradient(160, 240, 0, 160, 240, 300)
    bg.addColorStop(0, '#2a1050')
    bg.addColorStop(1, '#0a0020')
    ctx.fillStyle = bg
    ctx.fillRect(0, 0, 320, 480)

    // 边框
    ctx.strokeStyle = '#c9a0ff'
    ctx.lineWidth = 3
    ctx.roundRect(10, 10, 300, 460, 12)
    ctx.stroke()
    ctx.strokeStyle = '#7b4fbf60'
    ctx.lineWidth = 1
    ctx.roundRect(16, 16, 288, 448, 10)
    ctx.stroke()

    // 卡名
    ctx.fillStyle = '#ffd700'
    ctx.font = 'bold 24px serif'
    ctx.textAlign = 'center'
    ctx.fillText(card.name, 160, 80)

    // 神秘符号
    ctx.fillStyle = '#c9a0ff40'
    ctx.font = '36px serif'
    const syms = ['✦', '⧖', '◈', '⫸', '⬡', '◉', '≋', '⧊', '◬', '⬟', '⫷', '◈']
    ctx.fillText(syms[seed], 160, 130)

    // 分隔线
    ctx.strokeStyle = '#c9a0ff30'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(60, 150); ctx.lineTo(260, 150)
    ctx.stroke()

    // 预言文字
    ctx.fillStyle = '#e0d0ff'
    ctx.font = '15px serif'
    ctx.textAlign = 'center'
    const lines = card.prediction.split('\n')
    lines.forEach((line, i) => {
      ctx.fillText(line.trim(), 160, 185 + i * 26)
    })

    return new THREE.CanvasTexture(canvas)
  }

  function refreshCardTextures() {
    cardsRef.current.forEach((cardObj, i) => {
      cardObj.material.map = cardObj.userData.backTex
      cardObj.material.needsUpdate = true
    })
  }

  // ─── 初始化场景 ───
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // Scene
    const scene = new THREE.Scene()
    scene.background = new THREE.Color('#0a0020')
    scene.fog = new THREE.FogExp2('#0a0020', 0.0003)

    // Camera
    const camera = new THREE.PerspectiveCamera(55, container.clientWidth / container.clientHeight, 0.5, 30)
    camera.position.set(0, 1.8, 9)
    camera.lookAt(0, 0, 0)

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(container.clientWidth, container.clientHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.1
    container.appendChild(renderer.domElement)

    // ─── 灯光 ───
    const ambient = new THREE.AmbientLight('#3a1a5e', 1.5)
    scene.add(ambient)
    const point = new THREE.PointLight('#c9a0ff', 20, 12)
    point.position.set(0, 3, 2)
    scene.add(point)

    // ─── 星空背景 ───
    const starGeo = new THREE.BufferGeometry()
    const starCount = 400
    const starPos = new Float32Array(starCount * 3)
    for (let i = 0; i < starCount; i++) {
      starPos[i * 3] = (Math.random() - 0.5) * 20
      starPos[i * 3 + 1] = (Math.random() - 0.5) * 14
      starPos[i * 3 + 2] = (Math.random() - 0.5) * 10
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3))
    const starMat = new THREE.PointsMaterial({ color: '#c9a0ff', size: 0.03, transparent: true, opacity: 0.6 })
    const stars = new THREE.Points(starGeo, starMat)
    scene.add(stars)

    // ─── 地面光晕 ───
    const glowGeo = new THREE.PlaneGeometry(8, 8)
    const glowMat = new THREE.ShaderMaterial({
      uniforms: { uTime: { value: 0 } },
      vertexShader: `varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
      fragmentShader: `varying vec2 vUv; uniform float uTime;
        void main() {
          float d = length(vUv - 0.5) * 2.0;
          float a = smoothstep(1.0, 0.0, d) * 0.15;
          a *= 0.5 + 0.5 * sin(uTime * 0.8) * 0.3;
          gl_FragColor = vec4(0.55, 0.2, 0.75, a);
        }`,
      transparent: true, depthWrite: false,
    })
    const glowPlane = new THREE.Mesh(glowGeo, glowMat)
    glowPlane.rotation.x = -Math.PI / 2
    glowPlane.position.y = -3.5
    scene.add(glowPlane)

    // ─── 中心光柱 ───
    const pillarGeo = new THREE.CylinderGeometry(0.06, 0.06, 6, 16, 1, true)
    const pillarMat = new THREE.MeshBasicMaterial({ color: '#c9a0ff', transparent: true, opacity: 0.15 })
    const pillar = new THREE.Mesh(pillarGeo, pillarMat)
    pillar.position.y = 3
    scene.add(pillar)

    // ─── 12张螺旋卡牌 ───
    const cardGeo = new THREE.PlaneGeometry(CARD_W, CARD_H)
    const cards = []

    for (let i = 0; i < CARD_COUNT; i++) {
      const angle = (i / CARD_COUNT) * Math.PI * 2
      const yOffset = (i / CARD_COUNT) * 4 - 2  // -2 to +2

      const texture = createCardTexture(i)
      const mat = new THREE.MeshStandardMaterial({
        map: texture,
        side: THREE.DoubleSide,
        roughness: 0.6,
        metalness: 0.1,
      })

      const card = new THREE.Mesh(cardGeo, mat)
      card.position.x = Math.cos(angle) * SPIRAL_R
      card.position.y = yOffset
      card.position.z = Math.sin(angle) * SPIRAL_R
      card.lookAt(0, yOffset, 0)
      card.userData = {
        index: i,
        baseAngle: angle,
        baseY: yOffset,
        backTex: texture,
        frontTex: createFrontTexture(i),
      }
      scene.add(card)
      cards.push(card)
    }

    cardsRef.current = cards

    // ─── 粒子环 ───
    const ringGeo = new THREE.BufferGeometry()
    const ringCount = 200
    const ringPos = new Float32Array(ringCount * 3)
    for (let i = 0; i < ringCount; i++) {
      const a = (i / ringCount) * Math.PI * 2
      const r = SPIRAL_R + 0.5 + Math.random() * 0.3
      ringPos[i * 3] = Math.cos(a) * r
      ringPos[i * 3 + 1] = (Math.random() - 0.5) * 4.5
      ringPos[i * 3 + 2] = Math.sin(a) * r
    }
    ringGeo.setAttribute('position', new THREE.BufferAttribute(ringPos, 3))
    const ringMat = new THREE.PointsMaterial({ color: '#c9a0ff', size: 0.04, transparent: true, opacity: 0.4 })
    const ring = new THREE.Points(ringGeo, ringMat)
    scene.add(ring)

    const refs = { scene, camera, renderer, stars, glowMat, ring, pillar }
    cleanupRef.current = refs

    // ─── 渲染循环 ───
    let disposed = false
    let revealMomentum = 0

    function animate() {
      if (disposed) return
      requestAnimationFrame(animate)
      const ref = cleanupRef.current
      if (!ref) return

      const time = performance.now() * 0.001
      const speed = speedRef.current
      const rotSpeed = 0.15 + (speed - 1) * 0.6  // 基准慢，握拳加速

      // 更新光晕
      ref.glowMat.uniforms.uTime.value = time

      // 星空旋转
      ref.stars.rotation.y += 0.0003 * speed
      ref.stars.rotation.x += 0.00015 * speed

      // 粒子环旋转
      ref.ring.rotation.y += 0.002 * speed

      // 光柱呼吸
      ref.pillar.material.opacity = 0.12 + Math.sin(time * 1.5) * 0.05

      // ─── 卡牌旋转 + 面朝检测 ───
      let facingCardIndex = -1
      let bestFacingDot = -1

      for (let i = 0; i < CARD_COUNT; i++) {
        const card = cards[i]
        const { baseAngle, baseY } = card.userData
        const newAngle = baseAngle + time * rotSpeed
        card.position.x = Math.cos(newAngle) * SPIRAL_R
        card.position.z = Math.sin(newAngle) * SPIRAL_R
        card.position.y = baseY
        card.lookAt(0, baseY, 0)

        // 判断哪张牌正对屏幕（Z轴最大 = 离摄像机最近）
        const dot = card.position.z  // z越大越正对摄像机
        if (dot > bestFacingDot) {
          bestFacingDot = dot
          facingCardIndex = i
        }
      }

      // 通知外部哪张牌正对
      if (facingCardIndex >= 0 && onCardFacing) {
        onCardFacing(facingCardIndex)
      }

      // ─── 翻牌动画 ───
      const rv = revealRef.current
      if (rv) {
        rv.progress = Math.min(1, rv.progress + 0.04)
        if (rv.progress >= 1) {
          // 完全翻开
          rv.cardObj.material.map = rv.cardObj.userData.frontTex
          rv.cardObj.material.needsUpdate = true
          if (onResetReveal) onResetReveal()
        } else {
          // 翻转中
          const t = rv.progress
          rv.cardObj.rotation.y += 0.1
          if (t > 0.5 && rv.cardObj.material.map !== rv.cardObj.userData.frontTex) {
            rv.cardObj.material.map = rv.cardObj.userData.frontTex
            rv.cardObj.material.needsUpdate = true
          }
        }
      }

      // 相机微微呼吸
      ref.camera.position.x = Math.sin(time * 0.15) * 0.3
      ref.camera.position.y = 1.8 + Math.cos(time * 0.2) * 0.15
      ref.camera.lookAt(0, 0, 0)

      ref.renderer.render(ref.scene, ref.camera)
    }
    animate()

    function onResize() {
      if (disposed || !cleanupRef.current) return
      const { camera, renderer } = cleanupRef.current
      camera.aspect = container.clientWidth / container.clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(container.clientWidth, container.clientHeight)
    }
    window.addEventListener('resize', onResize)

    return () => {
      disposed = true
      window.removeEventListener('resize', onResize)
      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement)
      renderer.dispose()
      scene.traverse(obj => {
        if (obj.geometry) obj.geometry.dispose()
        if (obj.material) {
          if (obj.material.map) obj.material.map.dispose()
          obj.material.dispose()
        }
      })
      cleanupRef.current = null
    }
  }, [])

  return <div ref={containerRef} className="scene-container" />
}
