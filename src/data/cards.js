// ═══════════════════════════════════════════
// 12张神秘塔罗牌 — 谕示与背面插画
// ═══════════════════════════════════════════

export const CARDS = [
  {
    id: 0,
    name: '虚空之眼',
    prediction: '你凝望深渊时，深渊也在计算你的哈希值。\n—— 某个东西正在注视你，但不是恶意的。它只是好奇。',
    seed: 0,
  },
  {
    id: 1,
    name: '倒吊的月亮',
    prediction: '月亮今晚不会落下。不是因为轨道，是因为它忘了。\n—— 拖延已久的事，明天也不会做。接受它。',
    seed: 1,
  },
  {
    id: 2,
    name: '破碎王冠',
    prediction: '王冠碎了，但你的头还在。\n—— 权威是一种幻觉。你真正需要的是一顶更舒服的帽子。',
    seed: 2,
  },
  {
    id: 3,
    name: '双面镜',
    prediction: '镜中的人不是你，是平行宇宙里做了相反选择的那个。\n—— 他活得很好，你也一样。别羡慕自己。',
    seed: 3,
  },
  {
    id: 4,
    name: '无门之门',
    prediction: '门没有把手。不是因为它锁了，是因为它根本不需要打开。\n—— 有些路不需要走，答案会自己走到你面前。',
    seed: 4,
  },
  {
    id: 5,
    name: '星之骸',
    prediction: '一颗死去的星星落进你的口袋。\n—— 你拥有远超自己想象的能量，只是它正在冷却。趁热。',
    seed: 5,
  },
  {
    id: 6,
    name: '缠绕之蛇',
    prediction: '蛇在追自己的尾巴。你也在追。\n—— 循环不会被打破，但可以被重新定义。换个方向跑。',
    seed: 6,
  },
  {
    id: 7,
    name: '七层塔',
    prediction: '塔的每一层都是同一个房间。\n—— 你以为在上升，其实在学习同一课的不同难度。你已经很接近毕业了。',
    seed: 7,
  },
  {
    id: 8,
    name: '泪之井',
    prediction: '井里没有水，只有回声。\n—— 你的悲伤不是无用的。它们在井底变成了别的东西。去听听看。',
    seed: 8,
  },
  {
    id: 9,
    name: '蜘蛛女王',
    prediction: '她在编织一张你永远看不见的网。\n—— 有些连接不是线，是因果关系。你已经在网的中心了。',
    seed: 9,
  },
  {
    id: 10,
    name: '齿轮心脏',
    prediction: '你的心跳是机械的。但那不是故障，是设计。\n—— 被设定好的节奏也可以跳出新的舞蹈。你是舞者也是编舞。',
    seed: 10,
  },
  {
    id: 11,
    name: '空之书',
    prediction: '书是空的。每一页都在等你写。\n—— 预言不是说出来的，是活出来的。下一行是你。',
    seed: 11,
  },
]

// ─── 每张牌背面插画绘制函数 ───
export function drawCardBack(ctx, w, h, seed) {
  ctx.save()
  // 背景 — 深紫
  const bgGrad = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w * 0.7)
  bgGrad.addColorStop(0, '#1a0a2e')
  bgGrad.addColorStop(0.6, '#0d0520')
  bgGrad.addColorStop(1, '#050010')
  ctx.fillStyle = bgGrad
  ctx.fillRect(0, 0, w, h)

  // 边框装饰
  ctx.strokeStyle = '#7b4fbf40'
  ctx.lineWidth = 2
  ctx.strokeRect(8, 8, w - 16, h - 16)
  ctx.strokeStyle = '#9b6fd440'
  ctx.lineWidth = 1
  ctx.strokeRect(12, 12, w - 24, h - 24)

  // 随机种子 → 荒诞插画
  const rng = mulberry32(seed * 1337 + 42)

  switch (seed % 12) {
    case 0: drawEye(ctx, w, h, rng); break        // 虚空之眼
    case 1: drawMoon(ctx, w, h, rng); break       // 倒吊的月亮
    case 2: drawCrown(ctx, w, h, rng); break      // 破碎王冠
    case 3: drawMirror(ctx, w, h, rng); break     // 双面镜
    case 4: drawDoor(ctx, w, h, rng); break       // 无门之门
    case 5: drawStar(ctx, w, h, rng); break       // 星之骸
    case 6: drawSnake(ctx, w, h, rng); break      // 缠绕之蛇
    case 7: drawTower(ctx, w, h, rng); break      // 七层塔
    case 8: drawWell(ctx, w, h, rng); break       // 泪之井
    case 9: drawSpider(ctx, w, h, rng); break     // 蜘蛛女王
    case 10: drawGear(ctx, w, h, rng); break      // 齿轮心脏
    case 11: drawBook(ctx, w, h, rng); break      // 空之书
  }

  // 顶部神秘符号
  ctx.fillStyle = '#c9a0ff60'
  ctx.font = '18px serif'
  ctx.textAlign = 'center'
  const symbols = ['✦', '⧖', '◈', '⫸', '⬡', '◉', '≋', '⧊', '◬', '⬟', '⫷', '◈']
  ctx.fillText(symbols[seed % 12], w / 2, 32)

  ctx.restore()
}

// ─── 确定性随机 ───
function mulberry32(a) {
  return function () {
    a |= 0; a = a + 0x6D2B79F5 | 0
    let t = Math.imul(a ^ a >>> 15, 1 | a)
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t
    return ((t ^ t >>> 14) >>> 0) / 4294967296
  }
}

function rnd(rng, min, max) {
  return min + rng() * (max - min)
}

// ─── 0: 虚空之眼 ───
function drawEye(ctx, w, h, rng) {
  const cx = w / 2, cy = h / 2 + 10
  const rr = w * 0.18

  // 眼眶
  ctx.fillStyle = '#1a0a30'
  ctx.beginPath()
  ctx.ellipse(cx, cy, rr * 1.6, rr * 0.9, 0, 0, Math.PI * 2)
  ctx.fill()
  ctx.strokeStyle = '#7b4fbf'
  ctx.lineWidth = 2
  ctx.stroke()

  // 眼球
  const g = ctx.createRadialGradient(cx, cy, rr * 0.1, cx, cy, rr * 0.7)
  g.addColorStop(0, '#ffd700')
  g.addColorStop(0.4, '#ff8c00')
  g.addColorStop(0.7, '#4a0080')
  g.addColorStop(1, '#0a0020')
  ctx.fillStyle = g
  ctx.beginPath()
  ctx.ellipse(cx, cy, rr * 0.7, rr * 0.55, 0, 0, Math.PI * 2)
  ctx.fill()

  // 瞳孔
  ctx.fillStyle = '#000'
  ctx.beginPath()
  ctx.ellipse(cx, cy - 2, rr * 0.2, rr * 0.35, 0, 0, Math.PI * 2)
  ctx.fill()

  // 周围小眼
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2 + rng() * 0.5
    const sx = cx + Math.cos(a) * rr * 1.3
    const sy = cy + Math.sin(a) * rr * 0.7
    ctx.fillStyle = '#7b4fbf'
    ctx.beginPath()
    ctx.arc(sx, sy, 3 + rng() * 2, 0, Math.PI * 2); ctx.fill()
  }
}

// ─── 1: 倒吊的月亮 ───
function drawMoon(ctx, w, h, rng) {
  const cx = w / 2, cy = h / 2 + 5
  // 月亮
  ctx.fillStyle = '#e8d5b7'
  ctx.beginPath(); ctx.arc(cx, cy, w * 0.22, 0, Math.PI * 2); ctx.fill()
  // 阴影
  ctx.fillStyle = '#0d0520'
  ctx.beginPath(); ctx.arc(cx - w * 0.08, cy - w * 0.04, w * 0.18, 0, Math.PI * 2); ctx.fill()
  // 绳子
  ctx.strokeStyle = '#9b6fd460'
  ctx.lineWidth = 1
  ctx.beginPath(); ctx.moveTo(cx, cy - w * 0.22); ctx.lineTo(cx, 12); ctx.stroke()
  // 星星
  for (let i = 0; i < 8; i++) {
    const sx = rnd(rng, 20, w - 20), sy = rnd(rng, 20, h - 20)
    ctx.fillStyle = '#ffd70080'; ctx.beginPath()
    ctx.arc(sx, sy, rnd(rng, 1, 2), 0, Math.PI * 2); ctx.fill()
  }
}

// ─── 2: 破碎王冠 ───
function drawCrown(ctx, w, h, rng) {
  const cx = w / 2, cy = h / 2 - 10
  ctx.fillStyle = '#ffd700'
  // 王冠底座
  ctx.fillRect(cx - 35, cy + 15, 70, 12)
  // 锯齿
  for (let i = 0; i < 5; i++) {
    const px = cx - 30 + i * 15
    ctx.beginPath()
    ctx.moveTo(px, cy + 15); ctx.lineTo(px + 3, cy - 8); ctx.lineTo(px + 12, cy + 15)
    ctx.fill()
  }
  // 裂纹
  ctx.strokeStyle = '#000'
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(cx - 5, cy - 8); ctx.lineTo(cx, cy + 5); ctx.lineTo(cx + 12, cy + 27)
  ctx.stroke()
  // 掉落的碎片
  ctx.fillStyle = '#ffd700'
  ctx.fillRect(cx + 18, cy + 30, 6, 3)
  ctx.fillRect(cx + 28, cy + 35, 4, 2)
}

// ─── 3: 双面镜 ───
function drawMirror(ctx, w, h, rng) {
  const cx = w / 2, cy = h / 2
  // 镜框
  ctx.fillStyle = '#2a1a3e'
  ctx.beginPath(); ctx.ellipse(cx, cy, 30, 45, 0, 0, Math.PI * 2); ctx.fill()
  ctx.strokeStyle = '#c9a0ff'; ctx.lineWidth = 2
  ctx.beginPath(); ctx.ellipse(cx, cy, 30, 45, 0, 0, Math.PI * 2); ctx.stroke()
  // 镜面
  const mg = ctx.createLinearGradient(cx - 25, cy, cx + 25, cy)
  mg.addColorStop(0, '#2a1a4060'); mg.addColorStop(0.5, '#c9a0ff30'); mg.addColorStop(1, '#2a1a4060')
  ctx.fillStyle = mg
  ctx.beginPath(); ctx.ellipse(cx, cy, 26, 41, 0, 0, Math.PI * 2); ctx.fill()
  // 裂痕
  ctx.strokeStyle = '#fff3'
  ctx.lineWidth = 0.5
  ctx.beginPath(); ctx.moveTo(cx - 10, cy - 30); ctx.lineTo(cx + 5, cy + 5); ctx.lineTo(cx + 15, cy + 35); ctx.stroke()
}

// ─── 4: 无门之门 ───
function drawDoor(ctx, w, h, rng) {
  const cx = w / 2, dy = h / 2 + 10
  // 门框
  ctx.strokeStyle = '#7b4fbf'
  ctx.lineWidth = 3
  ctx.strokeRect(cx - 25, dy - 40, 50, 70)
  // 门板 — 空白，没有把手
  ctx.fillStyle = '#0d052080'
  ctx.fillRect(cx - 23, dy - 38, 46, 66)
  // 门缝光
  const lg = ctx.createLinearGradient(cx, dy - 40, cx, dy + 30)
  lg.addColorStop(0, '#ffd70000'); lg.addColorStop(0.5, '#ffd70030'); lg.addColorStop(1, '#ffd70000')
  ctx.fillStyle = lg
  ctx.fillRect(cx - 1, dy - 38, 2, 66)
}

// ─── 5: 星之骸 ───
function drawStar(ctx, w, h, rng) {
  const cx = w / 2, cy = h / 2
  // 裂开的星
  ctx.fillStyle = '#ffd70040'
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2
    ctx.beginPath()
    ctx.moveTo(cx, cy)
    ctx.lineTo(cx + Math.cos(a) * 25, cy + Math.sin(a) * 25)
    ctx.lineTo(cx + Math.cos(a + 0.3) * 12, cy + Math.sin(a + 0.3) * 12)
    ctx.fill()
  }
  // 碎片
  ctx.fillStyle = '#ff8c00'
  for (let i = 0; i < 5; i++) {
    ctx.beginPath()
    ctx.arc(cx + rnd(rng, -20, 20), cy + rnd(rng, -15, 25), rnd(rng, 2, 4), 0, Math.PI * 2)
    ctx.fill()
  }
}

// ─── 6: 缠绕之蛇 ───
function drawSnake(ctx, w, h, rng) {
  const cx = w / 2, cy = h / 2
  ctx.strokeStyle = '#44cc88'
  ctx.lineWidth = 3
  ctx.beginPath()
  for (let t = 0; t < Math.PI * 3; t += 0.1) {
    const r = 12 + t * 4
    const x = cx + Math.cos(t * 2.5) * r * 0.8
    const y = cy + Math.sin(t * 1.8) * r * 0.6
    if (t === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y)
  }
  ctx.stroke()
  // 蛇头
  const hr = 12 + Math.PI * 3 * 4
  const hx = cx + Math.cos(Math.PI * 3 * 2.5) * hr * 0.8
  const hy = cy + Math.sin(Math.PI * 3 * 1.8) * hr * 0.6
  ctx.fillStyle = '#44cc88'; ctx.beginPath()
  ctx.arc(hx, hy, 5, 0, Math.PI * 2); ctx.fill()
  // 眼睛
  ctx.fillStyle = '#ff0000'; ctx.beginPath()
  ctx.arc(hx - 1, hy - 1, 2, 0, Math.PI * 2); ctx.fill()
}

// ─── 7: 七层塔 ───
function drawTower(ctx, w, h, rng) {
  const cx = w / 2
  ctx.strokeStyle = '#7b4fbf'; ctx.lineWidth = 1.5
  for (let i = 0; i < 7; i++) {
    const by = h * 0.8 - i * 18
    const bw = 40 - i * 3
    ctx.fillStyle = `rgba(123,79,191,${0.2 + i * 0.08})`
    ctx.fillRect(cx - bw / 2, by - 12, bw, 12)
    ctx.strokeRect(cx - bw / 2, by - 12, bw, 12)
    // 窗户
    ctx.fillStyle = '#ffd70030'
    ctx.fillRect(cx - 4, by - 9, 8, 6)
  }
}

// ─── 8: 泪之井 ───
function drawWell(ctx, w, h, rng) {
  const cx = w / 2, cy = h / 2 + 5
  // 井壁
  ctx.strokeStyle = '#7b4fbf'; ctx.lineWidth = 2
  ctx.beginPath(); ctx.ellipse(cx, cy, 25, 12, 0, 0, Math.PI * 2); ctx.stroke()
  ctx.strokeStyle = '#9b6fd4'
  ctx.beginPath(); ctx.ellipse(cx, cy - 30, 25, 12, 0, 0, Math.PI * 2); ctx.stroke()
  ctx.beginPath(); ctx.moveTo(cx - 25, cy); ctx.lineTo(cx - 25, cy - 30); ctx.stroke()
  ctx.beginPath(); ctx.moveTo(cx + 25, cy); ctx.lineTo(cx + 25, cy - 30); ctx.stroke()
  // 泪滴
  ctx.fillStyle = '#4488ff60'
  for (let i = 0; i < 3; i++) {
    ctx.beginPath()
    ctx.arc(cx + rnd(rng, -8, 8), cy + 8 + i * 8, 2, 0, Math.PI * 2)
    ctx.fill()
  }
}

// ─── 9: 蜘蛛女王 ───
function drawSpider(ctx, w, h, rng) {
  const cx = w / 2, cy = h / 2 + 10
  // 身体
  ctx.fillStyle = '#1a0a30'
  ctx.beginPath(); ctx.ellipse(cx, cy, 10, 14, 0, 0, Math.PI * 2); ctx.fill()
  ctx.beginPath(); ctx.ellipse(cx, cy - 16, 7, 9, 0, 0, Math.PI * 2); ctx.fill()
  // 腿
  ctx.strokeStyle = '#7b4fbf'; ctx.lineWidth = 1
  for (let i = 0; i < 8; i++) {
    const side = i < 4 ? -1 : 1
    const sx = cx - side * 8
    const sy = cy - 5 + (i % 4) * 4
    ctx.beginPath()
    ctx.moveTo(sx, sy)
    ctx.quadraticCurveTo(sx + side * 18, sy - 8, sx + side * 22, sy + 8)
    ctx.stroke()
  }
  // 王冠（蜘蛛女王）
  ctx.fillStyle = '#ffd700'
  ctx.fillRect(cx - 6, cy - 30, 12, 6)
  for (let i = 0; i < 3; i++) {
    ctx.beginPath()
    ctx.moveTo(cx - 4 + i * 4, cy - 30); ctx.lineTo(cx - 3 + i * 4, cy - 36); ctx.lineTo(cx + i * 4, cy - 30)
    ctx.fill()
  }
  // 蛛网
  ctx.strokeStyle = '#9b6fd420'; ctx.lineWidth = 0.5
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2
    ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + Math.cos(a) * 30, cy + Math.sin(a) * 40); ctx.stroke()
  }
}

// ─── 10: 齿轮心脏 ───
function drawGear(ctx, w, h, rng) {
  const cx = w / 2, cy = h / 2
  // 齿轮
  ctx.fillStyle = '#7b4fbf60'
  ctx.strokeStyle = '#c9a0ff'
  ctx.lineWidth = 2
  drawGearShape(ctx, cx, cy, 16, 20, 8)
  ctx.fill(); ctx.stroke()
  // 小齿轮
  drawGearShape(ctx, cx - 18, cy - 6, 8, 10, 6)
  ctx.fill(); ctx.stroke()
  // 心形叠加
  ctx.fillStyle = '#ff446640'
  ctx.beginPath()
  drawHeartPath(ctx, cx + 4, cy - 2, 10)
  ctx.fill()
}

function drawGearShape(ctx, cx, cy, ir, or, teeth) {
  ctx.beginPath()
  for (let i = 0; i < teeth * 2; i++) {
    const a = (i / (teeth * 2)) * Math.PI * 2 - Math.PI / 2
    const r = i % 2 === 0 ? or : ir
    const x = cx + Math.cos(a) * r, y = cy + Math.sin(a) * r
    if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y)
  }
  ctx.closePath()
}

function drawHeartPath(ctx, cx, cy, s) {
  ctx.moveTo(cx, cy + s * 0.7)
  ctx.bezierCurveTo(cx - s * 1.1, cy - s * 0.3, cx - s, cy - s * 0.7, cx, cy - s * 0.1)
  ctx.bezierCurveTo(cx + s, cy - s * 0.7, cx + s * 1.1, cy - s * 0.3, cx, cy + s * 0.7)
}

// ─── 11: 空之书 ───
function drawBook(ctx, w, h, rng) {
  const cx = w / 2, cy = h / 2
  // 书封
  ctx.fillStyle = '#2a1a3e'
  ctx.beginPath()
  ctx.moveTo(cx - 22, cy - 30); ctx.lineTo(cx - 22, cy + 20)
  ctx.quadraticCurveTo(cx, cy + 30, cx + 22, cy + 20)
  ctx.lineTo(cx + 22, cy - 30)
  ctx.quadraticCurveTo(cx, cy - 20, cx - 22, cy - 30)
  ctx.fill()
  ctx.strokeStyle = '#c9a0ff'; ctx.lineWidth = 1.5
  ctx.stroke()
  // 书脊线
  ctx.beginPath(); ctx.moveTo(cx, cy - 28); ctx.lineTo(cx, cy + 22); ctx.stroke()
  // 空白页 — 飘出的纸
  ctx.fillStyle = '#ffd70015'
  ctx.beginPath(); ctx.ellipse(cx + 15, cy - 20, 8, 12, 0.3, 0, Math.PI * 2); ctx.fill()
  ctx.fillStyle = '#ffd70010'
  ctx.beginPath(); ctx.ellipse(cx + 8, cy - 25, 6, 10, -0.2, 0, Math.PI * 2); ctx.fill()
  // 问号
  ctx.fillStyle = '#c9a0ff60'
  ctx.font = '22px serif'; ctx.textAlign = 'center'
  ctx.fillText('?', cx, cy - 2)
}
