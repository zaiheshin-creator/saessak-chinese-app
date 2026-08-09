export default function LevelScreen({ levels, summaries, dueCount, onSelect, onReview }) {
  return (
    <section className="card level-screen">
      <p className="level-intro">레벨을 선택해서 학습을 시작하세요</p>

      {dueCount > 0 && (
        <button type="button" className="review-due-card" onClick={onReview}>
          <span className="review-due-emoji">{'\u{1F4CC}'}</span>
          <span className="review-due-text">오늘 복습할 단어 ({dueCount})</span>
        </button>
      )}

      <div className="level-list">
        {levels.map((lv) => {
          const s = summaries[lv.id];
          const pct = s.total ? Math.round((s.mastered / s.total) * 100) : 0;
          return (
            <div key={lv.id} className="level-card" onClick={() => onSelect(lv.id)}>
              <div className="level-badge">{lv.emoji}</div>
              <div className="level-info">
                <div className="level-name">{lv.name}</div>
                <div className="level-sub">
                  {lv.sub} · {s.mastered} / {s.total} · 회차 {s.roundNo}/{s.totalRounds}
                </div>
                <div className="level-progress-bar">
                  <div className="level-progress-fill" style={{ width: `${pct}%` }} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
