import { useState, useEffect } from 'react';
import { FORTUNE_DIMENSIONS } from '../data/cards';

export default function FortunePanel({ card, fortune, crystalWhisper, luckyInfo, onClose }) {
  const [showOracle, setShowOracle] = useState(false);
  const [showDimensions, setShowDimensions] = useState(false);
  const [showCrystal, setShowCrystal] = useState(false);
  const [showLucky, setShowLucky] = useState(false);
  const [showClose, setShowClose] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setShowOracle(true), 300);
    const t2 = setTimeout(() => setShowDimensions(true), 1200);
    const t3 = setTimeout(() => setShowCrystal(true), 2000);
    const t4 = setTimeout(() => setShowLucky(true), 2600);
    const t5 = setTimeout(() => setShowClose(true), 3200);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); clearTimeout(t5); };
  }, []);

  // Save to collection
  useEffect(() => {
    try {
      const key = 'crystal-collection';
      const raw = localStorage.getItem(key);
      const coll = raw ? JSON.parse(raw) : [];
      if (!coll.includes(card.id)) {
        coll.push(card.id);
        localStorage.setItem(key, JSON.stringify(coll));
      }
    } catch {}
  }, []);

  function shareResult() {
    const text = `🔮 紫晶谕示 · ${card.name}\n「${card.oracle}」\n今日运势：${Object.entries(fortune).map(([k,v]) => `${k} ${'★'.repeat(v)}${'☆'.repeat(5-v)}`).join(' · ')}\n—— Crystal Oracle`;
    if (navigator.share) {
      navigator.share({ title: '紫晶谕示', text });
    } else {
      navigator.clipboard.writeText(text).then(() => {
        alert('谕示已复制到剪贴板 ✦');
      });
    }
  }

  const starRating = (val) => '★'.repeat(val) + '☆'.repeat(5 - val);

  return (
    <div className="fortune-overlay" onClick={onClose}>
      <div className="fortune-panel" onClick={e => e.stopPropagation()}>

        {/* Close button */}
        {showClose && (
          <button className="fortune-close" onClick={onClose}>✕</button>
        )}

        {/* Card name */}
        <div className={`fortune-card-name ${showOracle ? 'visible' : ''}`}>
          {card.symbol} {card.name}
        </div>

        {/* Oracle text — types in */}
        {showOracle && (
          <div className="fortune-oracle">
            <span className="oracle-quote">「</span>
            {card.oracle}
            <span className="oracle-quote">」</span>
          </div>
        )}

        {/* Explanation */}
        {showOracle && (
          <div className="fortune-explanation" style={{ animationDelay: '0.4s' }}>
            {card.explanation}
          </div>
        )}

        {/* Divider */}
        {showDimensions && <div className="fortune-divider" />}

        {/* Fortune dimensions */}
        <div className={`fortune-dimensions ${showDimensions ? 'visible' : ''}`}>
          <div className="dimensions-title">今日运势</div>
          <div className="dimensions-grid">
            {FORTUNE_DIMENSIONS.map(dim => (
              <div key={dim} className="dimension-row">
                <span className="dim-label">{dim}</span>
                <span className="dim-stars">{starRating(fortune[dim])}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Crystal whisper */}
        {showCrystal && (
          <div className="crystal-whisper">
            <span className="crystal-icon">🔮</span>
            <span>{crystalWhisper}</span>
          </div>
        )}

        {/* Lucky info */}
        {showLucky && (
          <div className="lucky-info">
            <span className="lucky-item">✦ 幸运数字：{luckyInfo.number}</span>
            <span className="lucky-sep">·</span>
            <span className="lucky-item">幸运色：{luckyInfo.color}</span>
            <span className="lucky-sep">·</span>
            <span className="lucky-item">幸运方向：{luckyInfo.direction}</span>
          </div>
        )}

        {/* Collection count */}
        {showLucky && <CollectionBadge />}

        {/* Buttons */}
        {showClose && (
          <div className="fortune-buttons">
            <button className="fortune-btn secondary" onClick={shareResult}>
              ✦ 分享谕示
            </button>
            <button className="fortune-btn primary" onClick={onClose}>
              闭上双眼
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function CollectionBadge() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    try {
      const raw = localStorage.getItem('crystal-collection');
      const coll = raw ? JSON.parse(raw) : [];
      setCount(coll.length);
    } catch {}
  }, []);
  if (count === 0) return null;
  return (
    <div className="collection-badge">
      已发现 {count} / 12 张谕示牌
    </div>
  );
}
