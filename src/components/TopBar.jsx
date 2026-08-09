export default function TopBar({ title, onBack, exp, streak }) {
  return (
    <header className="topbar">
      <div className="topbar-left">
        {onBack ? (
          <button type="button" className="back-btn" onClick={onBack}>
            {'\u{2190}'}
          </button>
        ) : (
          <span className="brand">{'\u{1F331}'}</span>
        )}
        <h1>{title}</h1>
      </div>
      {(exp !== undefined || streak !== undefined) && (
        <div className="topbar-stats">
          {streak !== undefined && (
            <span className="stat-chip streak-chip">{'\u{1F525}'} {streak}</span>
          )}
          {exp !== undefined && <span className="stat-chip exp-chip">EXP {exp}</span>}
        </div>
      )}
    </header>
  );
}
