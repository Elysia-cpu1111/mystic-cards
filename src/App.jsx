import { useState, useEffect, useCallback, useRef } from 'react';
import Scene3D from './components/Scene3D';
import FortunePanel from './components/FortunePanel';
import useGesture from './hooks/useGesture';
import useAudio from './hooks/useAudio';
import { CARDS, FORTUNE_DIMENSIONS, CRYSTAL_WHISPERS } from './data/cards';
import './App.css';

export default function App() {
  const { gesture, phase, error, videoRef, startCamera } = useGesture();
  const audio = useAudio();
  const [speedMultiplier, setSpeedMultiplier] = useState(1);
  const [facingCard, setFacingCard] = useState(0);
  const [revealedCard, setRevealedCard] = useState(null);
  const [showFortune, setShowFortune] = useState(false);
  const [openPalmDuration, setOpenPalmDuration] = useState(0);
  const [drawnCard, setDrawnCard] = useState(null);
  const palmStartRef = useRef(null);

  // Track open palm duration
  useEffect(() => {
    if (gesture === 'Open_Palm') {
      if (!palmStartRef.current) palmStartRef.current = Date.now();
      const elapsed = (Date.now() - palmStartRef.current) / 1000;
      setOpenPalmDuration(elapsed);
      setSpeedMultiplier(1 + Math.min(elapsed * 0.8, 3));
    } else {
      palmStartRef.current = null;
      if (speedMultiplier > 1 && gesture !== 'Closed_Fist') {
        setSpeedMultiplier(1);
      }
    }
  }, [gesture]);

  // Handle fist = draw card
  const drawRef = useRef(false);
  useEffect(() => {
    if (gesture === 'Closed_Fist' && !drawRef.current && revealedCard === null && phase === 'active') {
      drawRef.current = true;
      setRevealedCard(facingCard);
      setDrawnCard(CARDS[facingCard]);
      audio.playDraw();
    }
    if (gesture !== 'Closed_Fist') {
      drawRef.current = false;
    }
  }, [gesture, facingCard, revealedCard, phase]);

  // Card reveal done → show fortune
  const handleRevealDone = useCallback(() => {
    audio.playReveal();
    setTimeout(() => {
      setShowFortune(true);
      audio.playWhisper();
    }, 400);
  }, []);

  // Generate fortune ratings
  const [fortune] = useState(() => {
    const dims = {};
    FORTUNE_DIMENSIONS.forEach(d => {
      dims[d] = Math.floor(Math.random() * 3) + 3; // 3-5 stars
    });
    return dims;
  });

  const [crystalWhisper] = useState(() =>
    CRYSTAL_WHISPERS[Math.floor(Math.random() * CRYSTAL_WHISPERS.length)]
  );

  const [luckyInfo] = useState(() => ({
    number: Math.floor(Math.random() * 9) + 1,
    color: ['银紫色', '深蓝色', '金橙色', '月白色', '星灰色'][Math.floor(Math.random() * 5)],
    direction: ['东南', '西北', '正北', '西南', '正东'][Math.floor(Math.random() * 5)],
  }));

  // Reset
  function reset() {
    setShowFortune(false);
    setRevealedCard(null);
    setDrawnCard(null);
    setSpeedMultiplier(1);
    setOpenPalmDuration(0);
  }

  return (
    <div className="app">
      <Scene3D
        speedMultiplier={speedMultiplier}
        onCardFacing={setFacingCard}
        revealedCard={revealedCard}
        onRevealDone={handleRevealDone}
        openPalmDuration={openPalmDuration}
      />

      {/* ── Top HUD ── */}
      <div className="hud-top">
        <h1 className="title">紫 晶 谕 示</h1>
        <div className="subtitle">Crystal Oracle</div>
      </div>

      {/* ── Gesture hint ── */}
      <div className={`gesture-hint ${gesture === 'Open_Palm' ? 'active' : ''} ${revealedCard !== null ? 'hidden' : ''}`}>
        {revealedCard !== null ? '' :
          gesture === 'Open_Palm' ? '✦ 命运正在加速...' :
          '✋ 张开手掌感受命运　✊ 握拳锁定命运'}
      </div>

      {/* ── Loading ── */}
      {phase === 'loading' && (
        <div className="loading-screen">
          <div className="crystal-loader" />
          <p className="loading-text">紫晶在低语...</p>
        </div>
      )}

      {/* ── Ready ── */}
      {phase === 'ready' && (
        <div className="loading-screen">
          <button className="start-btn" onClick={startCamera}>
            <span className="btn-icon">🔮</span>
            唤醒紫晶
          </button>
          <p className="btn-hint">命运需要你的目光</p>
        </div>
      )}

      {/* ── Error ── */}
      {phase === 'error' && (
        <div className="error-banner">
          <p className="error-title">紫晶沉寂</p>
          <p className="error-msg">{error}</p>
          <button className="start-btn retry" onClick={startCamera}>重新唤醒</button>
        </div>
      )}

      {/* ── Camera mini (active) ── */}
      {phase === 'active' && (
        <div className={`camera-mini ${revealedCard !== null ? 'dimmed' : ''}`}>
          <video ref={el => { if (el && videoRef.current) { el.srcObject = videoRef.current.srcObject; } }} autoPlay playsInline muted className="cam-video" />
          <div className={`gesture-badge ${gesture !== 'None' ? 'active' : ''}`}>
            {gesture === 'Open_Palm' ? '✋ 感应中' :
             gesture === 'Closed_Fist' ? '✊ 锁定' : '...'}
          </div>
        </div>
      )}

      {/* ── Fortune Panel ── */}
      {showFortune && drawnCard && (
        <FortunePanel
          card={drawnCard}
          fortune={fortune}
          crystalWhisper={crystalWhisper}
          luckyInfo={luckyInfo}
          onClose={reset}
        />
      )}

      {/* ── Footer ── */}
      <div className="footer">Created by 恋</div>
    </div>
  );
}
