import { UNITS } from '../data/units';
import { levelFromExp } from '../lib/progress';

export default function MyPage({ progress }) {
  const level = levelFromExp(progress.exp);

  return (
    <div className="screen mypage-screen">
      <div className="grow-card">
        <span className="grow-emoji">{'\u{1F331}'}</span>
        <div className="lv-name">성장 레벨 {level}</div>
        <div className="lv-sub">HSK1 · 새싹중국어와 함께 자라는 중</div>
      </div>

      <div className="stat-grid">
        <div className="stat">
          <b>{progress.exp}</b>
          <span>EXP</span>
        </div>
        <div className="stat">
          <b>{progress.streak.count}</b>
          <span>연속 학습일</span>
        </div>
        <div className="stat">
          <b>{progress.badges.length}</b>
          <span>배지</span>
        </div>
      </div>

      <div className="section-label">배지</div>
      <div className="badge-grid">
        {UNITS.map((unit) => {
          const earned = progress.badges.includes(`unit-${unit.id}`);
          return (
            <div key={unit.id} className={`mini-badge ${earned ? '' : 'locked'}`} title={unit.title}>
              {earned ? unit.emoji : '\u{1F512}'}
            </div>
          );
        })}
      </div>
    </div>
  );
}
