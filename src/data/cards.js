// ═══════════════════════════════════════════════
// 紫晶谕示 — 12张命运卡牌
// ═══════════════════════════════════════════════

export const CARDS = [
  {
    id: 0,
    name: '旅者',
    symbol: '✦',
    oracle: '道路在脚下延展，但方向在心间。',
    explanation: '今天适合启程。犹豫已久的决定，现在是付诸行动的时刻。相信你的直觉，它从未迷路。',
  },
  {
    id: 1,
    name: '月影',
    symbol: '☽',
    oracle: '月光照见的并非道路，而是隐藏的足迹。',
    explanation: '今天适合观察而非行动。某些答案已经出现，只是你还没注意到。静下来，让月光说话。',
  },
  {
    id: 2,
    name: '星火',
    symbol: '✦',
    oracle: '一颗火花在黑暗中诞生，它不知道自己是太阳。',
    explanation: '今天你可能忽略了一个微小但重要的灵感。把它记下来——它会燃烧成你无法想象的规模。',
  },
  {
    id: 3,
    name: '深海',
    symbol: '≋',
    oracle: '海面之下的沉默，比任何声音都响亮。',
    explanation: '今天适合深入内心。有些情绪不是要解决，而是要沉到海底去倾听。那里有你遗忘的力量。',
  },
  {
    id: 4,
    name: '王冠',
    symbol: '♛',
    oracle: '王冠的重量不在金属，而在佩戴者的目光。',
    explanation: '今天你被赋予了责任。不要逃避它——你比任何人想象得更适合这份重担，包括你自己。',
  },
  {
    id: 5,
    name: '荆棘',
    symbol: '⧊',
    oracle: '荆棘不为阻挡，只为考验穿过者的决心。',
    explanation: '今天可能遇到阻力。那不是拒绝的信号，而是提醒：你想要的值得付出这些。继续前进。',
  },
  {
    id: 6,
    name: '时钟',
    symbol: '⧖',
    oracle: '指针从未停下，但你完全可以停下来。',
    explanation: '今天允许自己慢下来。有些时刻不需要追赶——它们会在你准备好的时候，自己走进你的生命。',
  },
  {
    id: 7,
    name: '天秤',
    symbol: '⚖',
    oracle: '平衡不是静止，是永恒的微微摇摆。',
    explanation: '今天面临选择。不要追求完美的平衡——微微倾斜也是一种姿态。相信你此刻的判断。',
  },
  {
    id: 8,
    name: '蝴蝶',
    symbol: '◈',
    oracle: '翅膀展开之前，没有人相信它能飞。',
    explanation: '今天你正处在蜕变的边缘。那个你不敢展示自己的自己，即将破茧。给翅膀一点时间。',
  },
  {
    id: 9,
    name: '镜面',
    symbol: '◉',
    oracle: '镜中的你不认识你，因为你已经变成了新的人。',
    explanation: '今天照镜子时，你会看到过去未曾注意的闪光。接受这个新的自己——TA比昨天的你更完整。',
  },
  {
    id: 10,
    name: '灯塔',
    symbol: '⬡',
    oracle: '海浪从未询问礁石是否准备好。',
    explanation: '今天可能出现突发事件。保持冷静——你比自己想象得更可靠。风暴过后，灯塔依然站立。',
  },
  {
    id: 11,
    name: '命运轮',
    symbol: '◉',
    oracle: '轮子转动不是要带你离开，是要带你回来——以新的眼睛。',
    explanation: '今天可能会与过去重逢。一段旧记忆、一个人、一个念头。那不是重复，是螺旋上升中的必经之点。',
  },
];

// ─── 运势维度定义 ───
export const FORTUNE_DIMENSIONS = ['事业', '感情', '财运', '灵感', '行动力'];

// ─── 水晶球补充预言库 ───
export const CRYSTAL_WHISPERS = [
  '未来三小时：留意一个意料之外的消息。',
  '今天有人正在想起你。',
  '你上次忽略的路，今天会再次出现。',
  '注意身边的紫色——它会是今天的信号。',
  '一个微小的善意，会在今天得到回响。',
  '不要拒绝突如其来的邀请。',
  '今天的沉默比言语更有力。',
  '窗外的风带了答案来，去开窗。',
];

// ═══════════════════════════════════════════════
// 牌面 Canvas 绘制 — 正面 (插画 + 文字)
// ═══════════════════════════════════════════════

export function drawCardBack(ctx, w, h, seed) {
  ctx.save();

  // 深紫渐变背景
  const bg = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w * 0.7);
  bg.addColorStop(0, '#1a0a2e');
  bg.addColorStop(0.5, '#0d0520');
  bg.addColorStop(1, '#050010');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);

  // 外边框 — 金
  ctx.strokeStyle = '#ffd70025';
  ctx.lineWidth = 2;
  ctx.roundRect(6, 6, w - 12, h - 12, 14);
  ctx.stroke();

  // 内边框 — 紫
  ctx.strokeStyle = '#7b4fbf30';
  ctx.lineWidth = 1;
  ctx.roundRect(12, 12, w - 24, h - 24, 12);
  ctx.stroke();

  // 神秘符文纹理 — 基于seed生成
  const rng = mulberry32(seed * 7331 + 99);
  ctx.strokeStyle = '#c9a0ff15';
  ctx.lineWidth = 0.5;
  for (let i = 0; i < 12; i++) {
    const x = rnd(rng, 30, w - 30);
    const y = rnd(rng, 40, h - 40);
    const r = rnd(rng, 8, 20);
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.stroke();
    // 小点
    ctx.fillStyle = '#c9a0ff10';
    ctx.beginPath();
    ctx.arc(x, y, 1.5, 0, Math.PI * 2);
    ctx.fill();
  }

  // 十字纹路线
  for (let i = 0; i < 3; i++) {
    const x = rnd(rng, 40, w - 40);
    const y = rnd(rng, 50, h - 50);
    ctx.strokeStyle = '#c9a0ff08';
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    ctx.moveTo(x - 8, y);
    ctx.lineTo(x + 8, y);
    ctx.moveTo(x, y - 8);
    ctx.lineTo(x, y + 8);
    ctx.stroke();
  }

  // 中心水晶图腾 — 菱形
  const cx = w / 2, cy = h / 2;
  ctx.strokeStyle = '#c9a0ff20';
  ctx.lineWidth = 1;
  const d = rnd(rng, 28, 40);
  ctx.beginPath();
  ctx.moveTo(cx, cy - d);
  ctx.lineTo(cx + d * 0.55, cy);
  ctx.lineTo(cx, cy + d);
  ctx.lineTo(cx - d * 0.55, cy);
  ctx.closePath();
  ctx.stroke();

  // 内菱形
  ctx.strokeStyle = '#c9a0ff10';
  ctx.beginPath();
  ctx.moveTo(cx, cy - d * 0.5);
  ctx.lineTo(cx + d * 0.27, cy);
  ctx.lineTo(cx, cy + d * 0.5);
  ctx.lineTo(cx - d * 0.27, cy);
  ctx.closePath();
  ctx.stroke();

  // 四角符号 — 根据seed变化
  const corners = [
    [25, 25], [w - 25, 25], [25, h - 25], [w - 25, h - 25],
  ];
  const cSyms = ['✦', '⧖', '◈', '⫸', '⬡', '◉', '≋', '⧊'];
  ctx.fillStyle = '#c9a0ff18';
  ctx.font = '10px serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  corners.forEach(([cx2, cy2]) => {
    ctx.fillText(cSyms[Math.floor(rng() * cSyms.length)], cx2, cy2);
  });

  // 顶部符号
  ctx.fillStyle = '#c9a0ff30';
  ctx.font = '16px serif';
  ctx.fillText(CARDS[seed % 12].symbol, w / 2, 30);

  ctx.restore();
}

export function drawCardFront(ctx, w, h, cardId) {
  const card = CARDS[cardId];
  ctx.save();

  // 正面深紫背景
  const bg = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w * 0.8);
  bg.addColorStop(0, '#2a1050');
  bg.addColorStop(0.7, '#150830');
  bg.addColorStop(1, '#0a0020');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);

  // 金边框
  ctx.strokeStyle = '#c9a0ff40';
  ctx.lineWidth = 2.5;
  ctx.roundRect(8, 8, w - 16, h - 16, 14);
  ctx.stroke();
  ctx.strokeStyle = '#7b4fbf25';
  ctx.lineWidth = 1;
  ctx.roundRect(14, 14, w - 28, h - 28, 12);
  ctx.stroke();

  // ─── 插画区 (上半部分) ───
  ctx.save();
  ctx.beginPath();
  ctx.roundRect(24, 24, w - 48, h * 0.45, 10);
  ctx.clip();
  drawIllustration(ctx, w, h, cardId);
  ctx.restore();

  // 插画区边框
  ctx.strokeStyle = '#c9a0ff20';
  ctx.lineWidth = 1;
  ctx.roundRect(24, 24, w - 48, h * 0.45, 10);
  ctx.stroke();

  // ─── 牌名 ───
  ctx.fillStyle = '#ffd700';
  ctx.font = 'bold 22px "Georgia", serif';
  ctx.textAlign = 'center';
  ctx.fillText(card.name, w / 2, h * 0.54 + 55);

  // 符号
  ctx.fillStyle = '#c9a0ff30';
  ctx.font = '20px serif';
  ctx.fillText(card.symbol, w / 2, h * 0.54 + 80);

  // 分隔线
  const dy = h * 0.54 + 95;
  ctx.strokeStyle = '#c9a0ff20';
  ctx.lineWidth = 0.7;
  ctx.beginPath();
  ctx.moveTo(w * 0.15, dy);
  ctx.lineTo(w * 0.85, dy);
  ctx.stroke();

  // ─── 谕示 ───
  ctx.fillStyle = '#e0d0ff';
  ctx.font = '13px "Georgia", serif';
  ctx.textAlign = 'center';
  const maxWidth = w - 70;
  const oracleLines = wrapText(ctx, card.oracle, maxWidth);
  const startY = dy + 24;
  oracleLines.forEach((line, i) => {
    ctx.fillText(line, w / 2, startY + i * 20);
  });

  // ─── 解释
  ctx.fillStyle = '#9b6fd4';
  ctx.font = '11px "Georgia", serif';
  const explLines = wrapText(ctx, card.explanation, maxWidth);
  explLines.forEach((line, i) => {
    ctx.fillText(line, w / 2, startY + oracleLines.length * 20 + 16 + i * 18);
  });

  ctx.restore();
}

// ─── 插画绘制 — 每种牌独立画面 ───
function drawIllustration(ctx, w, h, id) {
  const cx = w / 2, cy = h * 0.25;

  switch (id) {
    case 0: drawTraveler(ctx, w, h, cx, cy); break;
    case 1: drawMoonShadow(ctx, w, h, cx, cy); break;
    case 2: drawStarFire(ctx, w, h, cx, cy); break;
    case 3: drawDeepSea(ctx, w, h, cx, cy); break;
    case 4: drawCrownIllus(ctx, w, h, cx, cy); break;
    case 5: drawThorns(ctx, w, h, cx, cy); break;
    case 6: drawClockIllus(ctx, w, h, cx, cy); break;
    case 7: drawScales(ctx, w, h, cx, cy); break;
    case 8: drawButterfly(ctx, w, h, cx, cy); break;
    case 9: drawMirrorIllus(ctx, w, h, cx, cy); break;
    case 10: drawLighthouse(ctx, w, h, cx, cy); break;
    case 11: drawWheel(ctx, w, h, cx, cy); break;
  }
}

// ─── 0: 旅者 — 暮色旷野中孤独身影 ───
function drawTraveler(ctx, w, h, cx, cy) {
  // 天空渐变
  const sky = ctx.createLinearGradient(0, 0, 0, h * 0.45);
  sky.addColorStop(0, '#1a0a40');
  sky.addColorStop(0.5, '#4a2080');
  sky.addColorStop(1, '#2a1050');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, w, h * 0.45);

  // 星点
  ctx.fillStyle = '#ffffff60';
  for (let i = 0; i < 20; i++) {
    const sx = Math.random() * w, sy = Math.random() * h * 0.35;
    ctx.beginPath();
    ctx.arc(sx, sy, 0.8 + Math.random() * 1.2, 0, Math.PI * 2);
    ctx.fill();
  }

  // 地面
  ctx.fillStyle = '#0d0520';
  ctx.fillRect(0, cy + 30, w, h * 0.45 - cy - 30);

  // 远山
  ctx.fillStyle = '#1a0a30';
  ctx.beginPath();
  ctx.moveTo(0, cy + 28);
  ctx.quadraticCurveTo(w * 0.3, cy - 10, w * 0.5, cy + 20);
  ctx.quadraticCurveTo(w * 0.7, cy + 5, w, cy + 25);
  ctx.lineTo(w, h * 0.45);
  ctx.lineTo(0, h * 0.45);
  ctx.fill();

  // 道路
  ctx.strokeStyle = '#7b4fbf30';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(cx, h * 0.45 - 10);
  ctx.quadraticCurveTo(cx + 20, cy + 35, cx + 60, h * 0.45);
  ctx.stroke();

  // 旅者 silhouette
  ctx.fillStyle = '#050015';
  ctx.beginPath();
  ctx.arc(cx - 5, cy + 12, 7, 0, Math.PI * 2); // 头
  ctx.fill();
  ctx.fillRect(cx - 7, cy + 18, 14, 18); // 身体
  ctx.fillRect(cx - 8, cy + 22, 3, 10); // 左腿
  ctx.fillRect(cx + 5, cy + 22, 3, 10); // 右腿

  // 月亮
  ctx.fillStyle = '#ffd70040';
  ctx.beginPath();
  ctx.arc(cx + 50, cy - 35, 16, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#1a0a40';
  ctx.beginPath();
  ctx.arc(cx + 55, cy - 38, 13, 0, Math.PI * 2);
  ctx.fill();
}

// ─── 1: 月影 — 月光下的白狐 ───
function drawMoonShadow(ctx, w, h, cx, cy) {
  // 夜空
  const sky = ctx.createRadialGradient(cx, cy - 15, 0, cx, cy - 15, w * 0.6);
  sky.addColorStop(0, '#2a1a50');
  sky.addColorStop(1, '#050015');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, w, h * 0.45);

  // 大地
  ctx.fillStyle = '#0a0020';
  ctx.fillRect(0, cy + 35, w, h * 0.45 - cy - 35);

  // 圆月
  ctx.fillStyle = '#e8d5b720';
  ctx.beginPath();
  ctx.arc(cx, cy - 18, 28, 0, Math.PI * 2);
  ctx.fill();

  // 月亮光晕
  const glow = ctx.createRadialGradient(cx, cy - 18, 20, cx, cy - 18, 50);
  glow.addColorStop(0, '#e8d5b710');
  glow.addColorStop(1, 'transparent');
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(cx, cy - 18, 50, 0, Math.PI * 2);
  ctx.fill();

  // 白狐 silhouette (用柔和线条)
  ctx.fillStyle = '#c9b8e818';
  // 身体
  ctx.beginPath();
  ctx.ellipse(cx, cy + 18, 22, 10, 0, 0, Math.PI * 2);
  ctx.fill();
  // 头
  ctx.beginPath();
  ctx.ellipse(cx + 20, cy + 10, 8, 7, 0.3, 0, Math.PI * 2);
  ctx.fill();
  // 尾巴
  ctx.beginPath();
  ctx.moveTo(cx - 20, cy + 15);
  ctx.quadraticCurveTo(cx - 35, cy + 5, cx - 28, cy - 5);
  ctx.lineWidth = 3;
  ctx.strokeStyle = '#c9b8e815';
  ctx.stroke();
  ctx.lineWidth = 1;
  // 耳朵
  ctx.beginPath();
  ctx.moveTo(cx + 23, cy + 3);
  ctx.lineTo(cx + 25, cy - 3);
  ctx.lineTo(cx + 28, cy + 5);
  ctx.fill();
}

// ─── 2: 星火 — 黑暗中诞生的火花 ───
function drawStarFire(ctx, w, h, cx, cy) {
  // 全黑背景
  ctx.fillStyle = '#050010';
  ctx.fillRect(0, 0, w, h * 0.45);

  // 火花核心
  const core = ctx.createRadialGradient(cx, cy, 0, cx, cy, 30);
  core.addColorStop(0, '#ffd700');
  core.addColorStop(0.15, '#ff8c00');
  core.addColorStop(0.4, '#ff440030');
  core.addColorStop(0.7, '#ff220010');
  core.addColorStop(1, 'transparent');
  ctx.fillStyle = core;
  ctx.beginPath();
  ctx.arc(cx, cy, 30, 0, Math.PI * 2);
  ctx.fill();

  // 火花射线
  ctx.strokeStyle = '#ffd70030';
  ctx.lineWidth = 0.8;
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2 + (Math.random() - 0.5) * 0.3;
    const len = 15 + Math.random() * 25;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + Math.cos(a) * len, cy + Math.sin(a) * len * 0.7);
    ctx.stroke();
  }

  // 漂浮小火花
  for (let i = 0; i < 15; i++) {
    const sx = cx + (Math.random() - 0.5) * 80;
    const sy = cy + (Math.random() - 0.5) * 50;
    const alpha = Math.random() * 0.4;
    ctx.fillStyle = `rgba(255, 200, 50, ${alpha})`;
    ctx.beginPath();
    ctx.arc(sx, sy, Math.random() * 2.5, 0, Math.PI * 2);
    ctx.fill();
  }
}

// ─── 3: 深海 — 海底光柱与鲸影 ───
function drawDeepSea(ctx, w, h, cx, cy) {
  // 深海渐变
  const sea = ctx.createLinearGradient(0, 0, 0, h * 0.45);
  sea.addColorStop(0, '#020818');
  sea.addColorStop(0.5, '#051030');
  sea.addColorStop(1, '#0a1840');
  ctx.fillStyle = sea;
  ctx.fillRect(0, 0, w, h * 0.45);

  // 海底光柱
  const beam = ctx.createLinearGradient(cx, 0, cx, h * 0.45);
  beam.addColorStop(0, '#4488ff08');
  beam.addColorStop(0.5, '#4488ff20');
  beam.addColorStop(1, '#4488ff05');
  ctx.fillStyle = beam;
  ctx.beginPath();
  ctx.moveTo(cx - 20, 0);
  ctx.lineTo(cx - 50, h * 0.45);
  ctx.lineTo(cx + 50, h * 0.45);
  ctx.lineTo(cx + 20, 0);
  ctx.fill();

  // 气泡
  ctx.strokeStyle = '#4488ff15';
  ctx.lineWidth = 0.5;
  for (let i = 0; i < 10; i++) {
    const bx = cx + (Math.random() - 0.5) * 60;
    const by = Math.random() * h * 0.4;
    ctx.beginPath();
    ctx.arc(bx, by, 2 + Math.random() * 4, 0, Math.PI * 2);
    ctx.stroke();
  }

  // 小鱼群
  ctx.fillStyle = '#4488ff20';
  for (let i = 0; i < 5; i++) {
    const fx = cx - 30 + i * 12;
    const fy = cy + Math.sin(i * 0.8) * 5;
    ctx.beginPath();
    ctx.moveTo(fx + 5, fy);
    ctx.lineTo(fx - 3, fy - 2);
    ctx.lineTo(fx - 3, fy + 2);
    ctx.fill();
  }
}

// ─── 4: 王冠 — 悬浮光之王冠 ───
function drawCrownIllus(ctx, w, h, cx, cy) {
  ctx.fillStyle = '#0d0520';
  ctx.fillRect(0, 0, w, h * 0.45);

  // 光柱
  const beam = ctx.createLinearGradient(cx, cy - 35, cx, cy + 35);
  beam.addColorStop(0, 'transparent');
  beam.addColorStop(0.5, '#ffd70015');
  beam.addColorStop(1, 'transparent');
  ctx.fillStyle = beam;
  ctx.fillRect(cx - 5, cy - 35, 10, 70);

  // 王冠
  ctx.fillStyle = '#ffd700';
  ctx.fillRect(cx - 28, cy + 10, 56, 12); // 底座

  // 锯齿
  for (let i = 0; i < 5; i++) {
    const px = cx - 25 + i * 13;
    ctx.beginPath();
    ctx.moveTo(px, cy + 10);
    ctx.lineTo(px + 2, cy - 12);
    ctx.lineTo(px + 11, cy + 10);
    ctx.fill();
  }

  // 宝石
  ctx.fillStyle = '#7b4fbf';
  ctx.beginPath();
  ctx.arc(cx, cy, 5, 0, Math.PI * 2);
  ctx.fill();

  // 光晕
  const halo = ctx.createRadialGradient(cx, cy - 5, 5, cx, cy - 5, 35);
  halo.addColorStop(0, '#ffd70020');
  halo.addColorStop(1, 'transparent');
  ctx.fillStyle = halo;
  ctx.beginPath();
  ctx.arc(cx, cy - 5, 35, 0, Math.PI * 2);
  ctx.fill();
}

// ─── 5: 荆棘 — 缠绕藤蔓带刺 ───
function drawThorns(ctx, w, h, cx, cy) {
  ctx.fillStyle = '#0a0015';
  ctx.fillRect(0, 0, w, h * 0.45);

  // 藤蔓
  ctx.strokeStyle = '#2a6040';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(cx - 30, h * 0.45);
  for (let t = 0; t < Math.PI * 2; t += 0.15) {
    const r = 15 + t * 6;
    const x = cx + Math.cos(t * 2.2) * r * 0.6;
    const y = cy + 10 + Math.sin(t * 1.5) * r * 0.4;
    ctx.lineTo(x, y);
  }
  ctx.stroke();

  // 刺
  ctx.strokeStyle = '#7b4fbf40';
  ctx.lineWidth = 1;
  for (let i = 0; i < 15; i++) {
    const a = (i / 15) * Math.PI * 2;
    const r = 20 + i * 5;
    const x = cx + Math.cos(a * 2.2) * r * 0.6;
    const y = cy + 10 + Math.sin(a * 1.5) * r * 0.4;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + 5, y - 5);
    ctx.stroke();
  }

  // 花
  ctx.fillStyle = '#c9a0ff40';
  ctx.beginPath();
  for (let i = 0; i < 5; i++) {
    const a = (i / 5) * Math.PI * 2;
    const px = cx + 5 + Math.cos(a) * 10;
    const py = cy + 5 + Math.sin(a) * 10;
    ctx.moveTo(cx + 5, cy + 5);
    ctx.arc(px, py, 5, 0, Math.PI * 2);
  }
  ctx.fill();
}

// ─── 6: 时钟 — 破碎钟面 ───
function drawClockIllus(ctx, w, h, cx, cy) {
  ctx.fillStyle = '#0a0015';
  ctx.fillRect(0, 0, w, h * 0.45);

  // 钟面
  ctx.strokeStyle = '#c9a0ff40';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(cx, cy, 30, 0, Math.PI * 2);
  ctx.stroke();

  // 刻度
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2 - Math.PI / 2;
    const x1 = cx + Math.cos(a) * 26;
    const y1 = cy + Math.sin(a) * 26;
    const x2 = cx + Math.cos(a) * 22;
    const y2 = cy + Math.sin(a) * 22;
    ctx.strokeStyle = '#c9a0ff20';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  }

  // 指针
  ctx.strokeStyle = '#ffd70060';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.lineTo(cx, cy - 18);
  ctx.stroke();
  ctx.strokeStyle = '#ffd70030';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.lineTo(cx + 14, cy + 5);
  ctx.stroke();

  // 裂痕
  ctx.strokeStyle = '#ffffff10';
  ctx.lineWidth = 0.7;
  ctx.beginPath();
  ctx.moveTo(cx - 5, cy - 28);
  ctx.lineTo(cx + 3, cy + 5);
  ctx.lineTo(cx + 20, cy + 22);
  ctx.stroke();

  // 漂浮碎片
  ctx.fillStyle = '#c9a0ff15';
  for (let i = 0; i < 4; i++) {
    const fx = cx + (Math.random() - 0.5) * 50;
    const fy = cy + (Math.random() - 0.5) * 40;
    ctx.fillRect(fx, fy, 4, 2);
  }
}

// ─── 7: 天秤 — 平衡的天秤 ───
function drawScales(ctx, w, h, cx, cy) {
  ctx.fillStyle = '#0a0015';
  ctx.fillRect(0, 0, w, h * 0.45);

  // 支柱
  ctx.strokeStyle = '#c9a0ff30';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(cx, cy + 25);
  ctx.lineTo(cx, cy - 30);
  ctx.stroke();

  // 横梁
  ctx.beginPath();
  ctx.moveTo(cx - 35, cy - 15);
  ctx.lineTo(cx + 35, cy - 20);
  ctx.stroke();

  // 左盘
  ctx.strokeStyle = '#c9a0ff20';
  ctx.beginPath();
  ctx.arc(cx - 35, cy - 5, 12, Math.PI, 0);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(cx - 47, cy - 5);
  ctx.lineTo(cx - 35, cy - 15);
  ctx.moveTo(cx - 23, cy - 5);
  ctx.lineTo(cx - 35, cy - 15);
  ctx.stroke();

  // 右盘
  ctx.beginPath();
  ctx.arc(cx + 35, cy - 10, 12, Math.PI, 0);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(cx + 23, cy - 10);
  ctx.lineTo(cx + 35, cy - 20);
  ctx.moveTo(cx + 47, cy - 10);
  ctx.lineTo(cx + 35, cy - 20);
  ctx.stroke();

  // 左盘内容 — 羽毛
  ctx.fillStyle = '#ffd70020';
  ctx.beginPath();
  ctx.ellipse(cx - 35, cy - 5, 6, 3, 0.2, 0, Math.PI * 2);
  ctx.fill();

  // 右盘内容 — 石头
  ctx.fillStyle = '#7b4fbf30';
  ctx.beginPath();
  ctx.ellipse(cx + 35, cy - 10, 5, 4, 0, 0, Math.PI * 2);
  ctx.fill();
}

// ─── 8: 蝴蝶 — 破茧之蝶 ───
function drawButterfly(ctx, w, h, cx, cy) {
  // 渐变背景
  const sky = ctx.createRadialGradient(cx, cy - 5, 0, cx, cy - 5, 60);
  sky.addColorStop(0, '#2a1a40');
  sky.addColorStop(1, '#0a0015');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, w, h * 0.45);

  // 茧 (下方)
  ctx.strokeStyle = '#c9a0ff20';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.ellipse(cx + 3, cy + 20, 8, 12, -0.2, 0, Math.PI * 2);
  ctx.stroke();

  // 蝴蝶
  ctx.fillStyle = '#c9a0ff30';
  // 上翅左
  ctx.beginPath();
  ctx.ellipse(cx - 12, cy - 10, 14, 10, -0.3, 0, Math.PI * 2);
  ctx.fill();
  // 上翅右
  ctx.beginPath();
  ctx.ellipse(cx + 12, cy - 10, 14, 10, 0.3, 0, Math.PI * 2);
  ctx.fill();
  // 下翅左
  ctx.beginPath();
  ctx.ellipse(cx - 8, cy + 2, 9, 7, 0, 0, Math.PI * 2);
  ctx.fill();
  // 下翅右
  ctx.beginPath();
  ctx.ellipse(cx + 8, cy + 2, 9, 7, 0, 0, Math.PI * 2);
  ctx.fill();
  // 身体
  ctx.fillStyle = '#c9a0ff50';
  ctx.beginPath();
  ctx.ellipse(cx, cy, 3, 14, 0, 0, Math.PI * 2);
  ctx.fill();

  // 粒子光点
  ctx.fillStyle = '#ffd70030';
  for (let i = 0; i < 8; i++) {
    const px = cx + (Math.random() - 0.5) * 40;
    const py = cy + (Math.random() - 0.5) * 35;
    ctx.beginPath();
    ctx.arc(px, py, 1.5, 0, Math.PI * 2);
    ctx.fill();
  }
}

// ─── 9: 镜面 — 裂镜 ───
function drawMirrorIllus(ctx, w, h, cx, cy) {
  ctx.fillStyle = '#0a0015';
  ctx.fillRect(0, 0, w, h * 0.45);

  // 镜框
  ctx.strokeStyle = '#c9a0ff30';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.ellipse(cx, cy, 28, 38, 0, 0, Math.PI * 2);
  ctx.stroke();

  // 镜面
  const mirror = ctx.createLinearGradient(cx - 25, cy, cx + 25, cy);
  mirror.addColorStop(0, '#1a0a3000');
  mirror.addColorStop(0.3, '#c9a0ff15');
  mirror.addColorStop(0.5, '#c9a0ff25');
  mirror.addColorStop(0.7, '#c9a0ff15');
  mirror.addColorStop(1, '#1a0a3000');
  ctx.fillStyle = mirror;
  ctx.beginPath();
  ctx.ellipse(cx, cy, 25, 35, 0, 0, Math.PI * 2);
  ctx.fill();

  // 裂痕
  ctx.strokeStyle = '#ffffff15';
  ctx.lineWidth = 0.8;
  ctx.beginPath();
  ctx.moveTo(cx - 8, cy - 30);
  ctx.lineTo(cx + 2, cy + 5);
  ctx.lineTo(cx - 12, cy + 28);
  ctx.stroke();

  // 反射的微光
  ctx.fillStyle = '#c9a0ff10';
  ctx.beginPath();
  ctx.arc(cx + 5, cy - 5, 8, 0, Math.PI * 2);
  ctx.fill();
}

// ─── 10: 灯塔 — 暴风雨中的灯塔 ───
function drawLighthouse(ctx, w, h, cx, cy) {
  // 暴风雨天空
  const sky = ctx.createLinearGradient(0, 0, 0, h * 0.45);
  sky.addColorStop(0, '#050815');
  sky.addColorStop(0.6, '#0a1030');
  sky.addColorStop(1, '#0d1540');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, w, h * 0.45);

  // 雨线
  ctx.strokeStyle = '#4488ff10';
  ctx.lineWidth = 0.5;
  for (let i = 0; i < 20; i++) {
    const rx = Math.random() * w;
    ctx.beginPath();
    ctx.moveTo(rx, Math.random() * h * 0.2);
    ctx.lineTo(rx - 8, Math.random() * h * 0.2 + 20);
    ctx.stroke();
  }

  // 灯塔主体
  ctx.fillStyle = '#1a1a30';
  ctx.fillRect(cx - 8, cy - 20, 16, 40);
  ctx.fillStyle = '#c9a0ff30';
  ctx.fillRect(cx - 5, cy - 20, 10, 5);

  // 灯塔顶光
  const beam = ctx.createRadialGradient(cx, cy - 22, 0, cx, cy - 22, 30);
  beam.addColorStop(0, '#ffd700');
  beam.addColorStop(0.2, '#ff8c0040');
  beam.addColorStop(0.6, '#ff440005');
  beam.addColorStop(1, 'transparent');
  ctx.fillStyle = beam;
  ctx.beginPath();
  ctx.arc(cx, cy - 22, 30, 0, Math.PI * 2);
  ctx.fill();

  // 光柱
  const pillarBeam = ctx.createLinearGradient(cx, cy - 22, cx - 40, h * 0.45);
  pillarBeam.addColorStop(0, '#ffd70015');
  pillarBeam.addColorStop(1, 'transparent');
  ctx.fillStyle = pillarBeam;
  ctx.beginPath();
  ctx.moveTo(cx - 3, cy - 22);
  ctx.lineTo(cx - 45, h * 0.45);
  ctx.lineTo(cx - 20, h * 0.45);
  ctx.lineTo(cx + 3, cy - 22);
  ctx.fill();

  // 海浪
  ctx.strokeStyle = '#4488ff20';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(0, cy + 30);
  for (let x = 0; x < w; x += 5) {
    ctx.lineTo(x, cy + 30 + Math.sin(x * 0.08) * 6);
  }
  ctx.stroke();
}

// ─── 11: 命运轮 — 旋转的命运之轮 ───
function drawWheel(ctx, w, h, cx, cy) {
  ctx.fillStyle = '#0a0015';
  ctx.fillRect(0, 0, w, h * 0.45);

  // 外圈
  ctx.strokeStyle = '#c9a0ff20';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(cx, cy, 30, 0, Math.PI * 2);
  ctx.stroke();

  // 辐条
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2;
    ctx.strokeStyle = '#c9a0ff10';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + Math.cos(a) * 28, cy + Math.sin(a) * 28);
    ctx.stroke();
  }

  // 内圈
  ctx.strokeStyle = '#c9a0ff30';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(cx, cy, 15, 0, Math.PI * 2);
  ctx.stroke();

  // 中心宝石
  ctx.fillStyle = '#ffd70030';
  ctx.beginPath();
  ctx.arc(cx, cy, 5, 0, Math.PI * 2);
  ctx.fill();

  // 轨道粒子
  ctx.fillStyle = '#c9a0ff25';
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2;
    const px = cx + Math.cos(a) * 25;
    const py = cy + Math.sin(a) * 25;
    ctx.beginPath();
    ctx.arc(px, py, 2, 0, Math.PI * 2);
    ctx.fill();
  }

  // 光晕
  const halo = ctx.createRadialGradient(cx, cy, 20, cx, cy, 45);
  halo.addColorStop(0, '#c9a0ff10');
  halo.addColorStop(1, 'transparent');
  ctx.fillStyle = halo;
  ctx.beginPath();
  ctx.arc(cx, cy, 45, 0, Math.PI * 2);
  ctx.fill();
}

// ═══════════════════════════════════════════════
// 工具函数
// ═══════════════════════════════════════════════

function mulberry32(a) {
  return function () {
    a |= 0; a = a + 0x6D2B79F5 | 0;
    let t = Math.imul(a ^ a >>> 15, 1 | a);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

function rnd(rng, min, max) {
  return min + rng() * (max - min);
}

function wrapText(ctx, text, maxWidth) {
  const words = text.split('');
  const lines = [];
  let currentLine = '';
  for (let i = 0; i < words.length; i++) {
    const testLine = currentLine + words[i];
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth && currentLine.length > 0) {
      lines.push(currentLine);
      currentLine = words[i];
    } else {
      currentLine = testLine;
    }
  }
  if (currentLine) lines.push(currentLine);
  return lines;
}
