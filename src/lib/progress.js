const STORAGE_KEY = 'saessak-chinese-progress-v1';

const LEITNER_INTERVAL_DAYS = [1, 3, 7];

function todayStr() {
  return new Date().toLocaleDateString('sv-SE'); // YYYY-MM-DD, local time
}

function addDaysStr(dateStr, days) {
  const d = new Date(`${dateStr}T00:00:00`);
  d.setDate(d.getDate() + days);
  return d.toLocaleDateString('sv-SE');
}

function defaultProgress() {
  return {
    exp: 0,
    streak: { count: 0, lastDate: null },
    badges: [],
    units: {},
    wrongNote: {},
  };
}

export function loadProgress() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultProgress();
    const parsed = JSON.parse(raw);
    return { ...defaultProgress(), ...parsed };
  } catch {
    return defaultProgress();
  }
}

function save(progress) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  return progress;
}

export function touchStreak(progress) {
  const today = todayStr();
  const { lastDate, count } = progress.streak;
  if (lastDate === today) return progress;
  const yesterday = addDaysStr(today, -1);
  const nextCount = lastDate === yesterday ? count + 1 : 1;
  progress.streak = { count: nextCount, lastDate: today };
  return progress;
}

export function addExp(progress, amount) {
  progress.exp = Math.max(0, (progress.exp || 0) + amount);
  return progress;
}

export function getUnitProgress(progress, unitId) {
  return progress.units[unitId] || { flashcards: false, matching: false, dictation: false };
}

export function isUnitFullyComplete(progress, unitId) {
  const u = getUnitProgress(progress, unitId);
  return !!(u.flashcards && u.matching && u.dictation);
}

export function completeStage(progress, unitId, stage, expReward) {
  const unit = { ...getUnitProgress(progress, unitId) };
  const wasComplete = isUnitFullyComplete(progress, unitId);
  unit[stage] = true;
  progress.units = { ...progress.units, [unitId]: unit };
  addExp(progress, expReward);
  touchStreak(progress);

  const nowComplete = isUnitFullyComplete(progress, unitId);
  let badgeEarned = null;
  if (!wasComplete && nowComplete) {
    const badgeId = `unit-${unitId}`;
    if (!progress.badges.includes(badgeId)) {
      progress.badges = [...progress.badges, badgeId];
      addExp(progress, 30);
      badgeEarned = badgeId;
    }
  }
  save(progress);
  return { progress, badgeEarned };
}

export function addWrongWord(progress, unitId, hanzi) {
  const existing = progress.wrongNote[hanzi];
  const misses = (existing?.misses || 0) + 1;
  progress.wrongNote = {
    ...progress.wrongNote,
    [hanzi]: {
      unitId,
      box: 0,
      nextReview: addDaysStr(todayStr(), LEITNER_INTERVAL_DAYS[0]),
      misses,
    },
  };
  save(progress);
  return progress;
}

export function reviewWrongWord(progress, hanzi, knewIt) {
  const entry = progress.wrongNote[hanzi];
  if (!entry) return progress;
  if (knewIt) {
    const nextBox = entry.box + 1;
    if (nextBox >= LEITNER_INTERVAL_DAYS.length) {
      const rest = { ...progress.wrongNote };
      delete rest[hanzi];
      progress.wrongNote = rest;
    } else {
      progress.wrongNote = {
        ...progress.wrongNote,
        [hanzi]: {
          ...entry,
          box: nextBox,
          nextReview: addDaysStr(todayStr(), LEITNER_INTERVAL_DAYS[nextBox]),
        },
      };
    }
    addExp(progress, 5);
  } else {
    progress.wrongNote = {
      ...progress.wrongNote,
      [hanzi]: {
        ...entry,
        box: 0,
        nextReview: addDaysStr(todayStr(), LEITNER_INTERVAL_DAYS[0]),
      },
    };
  }
  touchStreak(progress);
  save(progress);
  return progress;
}

export function getWrongNoteList(progress) {
  return Object.entries(progress.wrongNote).map(([hanzi, entry]) => ({ hanzi, ...entry }));
}

export function getDueWrongWords(progress) {
  const today = todayStr();
  return getWrongNoteList(progress).filter((entry) => entry.nextReview <= today);
}

export function getUpcomingWrongWords(progress) {
  const today = todayStr();
  return getWrongNoteList(progress)
    .filter((entry) => entry.nextReview > today)
    .sort((a, b) => (a.nextReview > b.nextReview ? 1 : -1));
}

export function daysUntil(dateStr) {
  const today = todayStr();
  const diff = Math.round(
    (new Date(`${dateStr}T00:00:00`) - new Date(`${today}T00:00:00`)) / 86400000
  );
  return diff;
}

export function levelFromExp(exp) {
  // 100 EXP 당 1레벨업 느낌의 성장 표시 (레벨 체계 Lv.1=HSK1과는 별개의 "성장 레벨")
  return Math.floor(exp / 100) + 1;
}

export function saveProgress(progress) {
  return save(progress);
}

export { todayStr };
