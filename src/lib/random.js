export function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function pickN(arr, n) {
  return shuffle(arr).slice(0, n);
}

export function pickOther(arr, exclude, n) {
  const pool = arr.filter((item) => item !== exclude);
  return pickN(pool, n);
}
