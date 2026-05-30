import { useState, useEffect, useCallback } from 'react'
import Scene3D from './components/Scene3D'
import useGesture from './hooks/useGesture'
import { CARDS } from './data/cards'
import './App.css'

export default function App() {
  const { gesture, gestureLabel, phase, error, videoRef, startCamera } = useGesture()
  const [speedMultiplier, setSpeedMultiplier] = useState(1)
  const [facingCard, setFacingCard] = useState(0)
  const [revealedCard, setRevealedCard] = useState(null)
  const [revealQueued, setRevealQueued] = useState(false)
  const [showPrediction, setShowPrediction] = useState(false)
  const [lastGesture, setLastGesture] = useState('None')

  // 手势 → 速度
  useEffect(() => {
    if (gesture === 'Open_Palm') {
      setSpeedMultiplier(3.0)
      setLastGesture('Open_Palm')
    } else if (gesture === 'Closed_Fist') {
      if (lastGesture !== 'Closed_Fist' && !revealQueued && revealedCard === null) {
        // 只在非翻牌状态下响应握拳
        setSpeedMultiplier(0.3)
        setRevealQueued(true)
        setRevealedCard(facingCard)
      }
      setLastGesture('Closed_Fist')
    } else {
      if (lastGesture === 'Closed_Fist' || lastGesture === 'Open_Palm') {
        setSpeedMultiplier(1)
      }
      setLastGesture(gesture)
    }
  }, [gesture, facingCard, revealQueued, revealedCard])

  // 翻牌完成 → 显示预言
  const handleResetReveal = useCallback(() => {
    setShowPrediction(true)
  }, [])

  // 关闭预言面板
  function closePrediction() {
    setShowPrediction(false)
    setRevealedCard(null)
    setRevealQueued(false)
    setSpeedMultiplier(1)
  }

  const card = revealedCard !== null ? CARDS[revealedCard] : null

  return (
    <div className="app">
      <Scene3D
        speedMultiplier={speedMultiplier}
        onCardFacing={setFacingCard}
        revealedCard={revealedCard}
        onResetReveal={handleResetReveal}
      />

      {/* ── 顶部 HUD ── */}
      <div className="hud-top">
        <h1 className="title">✦ 神秘塔罗 ✦</h1>
        <div className="subtitle">命运的螺旋在旋转...</div>
      </div>

      {/* ── 手势提示 ── */}
      <div className={`gesture-hint ${gesture === 'Open_Palm' ? 'active' : ''}`}>
        {gesture === 'Open_Palm' ? '✋ 加速旋转中...' :
         gesture === 'Closed_Fist' ? '✊ 正在抽牌...' :
         '✋ 张开手掌加速 · ✊ 握拳抽牌'}
      </div>

      {/* ── 加载 & 启动 ── */}
      {phase === 'loading' && (
        <div className="loading-screen">
          <div className="spinner" />
          <p>正在感应命运的波动...</p>
        </div>
      )}

      {phase === 'ready' && (
        <div className="loading-screen">
          <button className="start-btn" onClick={startCamera}>
            <span className="btn-icon">🔮</span>
            开启神秘仪式
          </button>
          <p className="btn-hint">需要摄像头来感知你的手势</p>
        </div>
      )}

      {phase === 'error' && (
        <div className="error-banner">
          <p className="error-title">仪式中断</p>
          <p className="error-msg">{error}</p>
          <button className="start-btn retry" onClick={startCamera}>重试</button>
        </div>
      )}

      {phase === 'active' && (
        <div className="camera-mini">
          <video
            ref={el => { if (el && videoRef.current) { el.srcObject = videoRef.current.srcObject } }}
            autoPlay playsInline muted
            className="cam-video"
          />
          <div className={`gesture-badge ${gesture !== 'None' ? 'active' : ''}`}>
            {gestureLabel}
          </div>
        </div>
      )}

      {/* ── 翻牌预言面板 ── */}
      {showPrediction && card && (
        <div className="prediction-overlay" onClick={closePrediction}>
          <div className="prediction-panel" onClick={e => e.stopPropagation()}>
            <button className="close-btn" onClick={closePrediction}>✕</button>
            <div className="card-name">{card.name}</div>
            <div className="card-symbol">{['✦','⧖','◈','⫸','⬡','◉','≋','⧊','◬','⬟','⫷','◈'][card.id]}</div>
            <div className="card-divider" />
            <div className="card-prediction">
              {card.prediction.split('\n').map((line, i) => (
                <p key={i}>{line.trim()}</p>
              ))}
            </div>
            <button className="close-panel-btn" onClick={closePrediction}>闭上双眼</button>
          </div>
        </div>
      )}

      {/* ── 底部签名 ── */}
      <div className="footer">Created by 恋</div>
    </div>
  )
}
