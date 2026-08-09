export default function DoneScreen({ title, stats, showRestart, onRestart, onBack }) {
  return (
    <section className="card done-screen">
      <div className="done-emoji">{'\u{1F389}'}</div>
      <h2>{title}</h2>
      {stats && <p>{stats}</p>}
      {showRestart && (
        <button type="button" className="primary-btn" onClick={onRestart}>
          이 레벨 다시 학습
        </button>
      )}
      <button type="button" className="secondary-btn" onClick={onBack}>
        레벨 선택으로
      </button>
    </section>
  );
}
