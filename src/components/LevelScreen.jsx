export default function LevelScreen({ levels, summaries, onSelect, onReview }) {
  return (
    <section className="card level-screen">
      <p className="level-intro">레벨을 선택해서 학습을 시작하세요</p>
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
                {s.wrongCount > 0 && (
                  <button
                    type="button"
                    className="wrong-note-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      onReview(lv.id);
                    }}
                  >
                    오답노트 ({s.wrongCount})
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
