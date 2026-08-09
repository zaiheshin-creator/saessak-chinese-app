export default function UnitComplete({ unit, badgeEarned, dueCount, onHome, onReviewWrongNote }) {
  return (
    <div className="screen unit-complete-screen">
      <div className="result-wrap">
        <div className="result-mascot">{'\u{1F389}'}</div>
        <h2 className="result-title">{unit.title} 학습을 마쳤어요!</h2>
        <p className="result-sub">한자 {unit.words.length}개를 카드뒤집기 · 매칭게임 · 딕테이션까지 모두 끝냈어요.</p>

        <div className="reward-row">
          <span className="reward-chip">{'\u{2B50}'} EXP 획득</span>
          {badgeEarned && <span className="reward-chip badge">{'\u{1F396}'} 새 배지 획득!</span>}
        </div>

        <div className="result-actions">
          {dueCount > 0 && (
            <button type="button" className="cta" onClick={onReviewWrongNote}>
              오답노트 복습하기 ({dueCount})
            </button>
          )}
          <button type="button" className="cta secondary" onClick={onHome}>
            홈으로
          </button>
        </div>
      </div>
    </div>
  );
}
