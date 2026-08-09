// 세션을 넘어 지속되는 가벼운 간격반복(라이트너 방식) 오답 복습 큐.
// 박스 0 -> 1일 뒤, 박스 1 -> 3일 뒤, 박스 2 -> 7일 뒤 복습.
// 박스 2에서도 맞히면 큐에서 제거(마스터 처리).

const STORAGE_KEY = 'saessak-chinese-srs-queue-v1';
const INTERVAL_DAYS = [1, 3, 7];

function todayStr() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(
    d.getDate()
  ).padStart(2, '0')}`;
}

function addDays(dateStr, days) {
  const d = new Date(`${dateStr}T00:00:00`);
  d.setDate(d.getDate() + days);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(
    d.getDate()
  ).padStart(2, '0')}`;
}

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function save(queue) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(queue));
}

function sameWord(a, levelId, idx) {
  return a.levelId === levelId && a.idx === idx;
}

// 단어를 틀렸을 때 호출. 이미 큐에 있으면 박스를 0으로 리셋, 없으면 새로 추가.
export function recordWrongWord(levelId, idx) {
  const queue = load();
  const dueDate = addDays(todayStr(), INTERVAL_DAYS[0]);
  const existing = queue.find((e) => sameWord(e, levelId, idx));
  if (existing) {
    existing.box = 0;
    existing.dueDate = dueDate;
  } else {
    queue.push({ levelId, idx, box: 0, dueDate });
  }
  save(queue);
}

// 복습에서 단어를 맞혔을 때 호출. 박스를 한 단계 올리고, 최고 단계를 넘으면 큐에서 제거(마스터).
export function recordReviewCorrect(levelId, idx) {
  const queue = load();
  const i = queue.findIndex((e) => sameWord(e, levelId, idx));
  if (i === -1) return;
  const entry = queue[i];
  const nextBox = entry.box + 1;
  if (nextBox >= INTERVAL_DAYS.length) {
    queue.splice(i, 1);
  } else {
    entry.box = nextBox;
    entry.dueDate = addDays(todayStr(), INTERVAL_DAYS[nextBox]);
  }
  save(queue);
}

// 오늘 복습해야 할(마감일이 지난) 단어 목록.
export function getDueItems() {
  const today = todayStr();
  return load().filter((e) => e.dueDate <= today);
}

export function getDueCount() {
  return getDueItems().length;
}
