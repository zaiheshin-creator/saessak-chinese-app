export default function TopBar({ title, onBack, onReset }) {
  return (
    <header className="topbar">
      <div className="topbar-left">
        {onBack ? (
          <button type="button" className="back-btn" onClick={onBack}>
            {'\u{2190}'}
          </button>
        ) : (
          <span className="brand">{'\u{1F1E8}\u{1F1F3}'}</span>
        )}
        <h1>{title}</h1>
      </div>
      {onReset && (
        <button
          type="button"
          className="icon-btn"
          onClick={onReset}
          title="이 레벨 처음부터 다시 시작"
        >
          {'↺'}
        </button>
      )}
    </header>
  );
}
