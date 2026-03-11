const UPLOAD_KEY = "lol-upload-log";
const MAX_PER_DAY = 2;

interface UploadLog {
  dates: string[]; // ISO date strings (YYYY-MM-DD)
}

function getToday(): string {
  return new Date().toISOString().split("T")[0];
}

function getLog(): UploadLog {
  if (typeof window === "undefined") return { dates: [] };
  try {
    const raw = localStorage.getItem(UPLOAD_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { dates: [] };
}

function saveLog(log: UploadLog) {
  localStorage.setItem(UPLOAD_KEY, JSON.stringify(log));
}

export function getUploadsToday(): number {
  const today = getToday();
  const log = getLog();
  return log.dates.filter((d) => d === today).length;
}

export function getRemainingUploads(): number {
  return Math.max(0, MAX_PER_DAY - getUploadsToday());
}

export function canUpload(): boolean {
  return getUploadsToday() < MAX_PER_DAY;
}

export function recordUpload() {
  const log = getLog();
  log.dates.push(getToday());
  // Only keep today's entries to avoid bloat
  const today = getToday();
  log.dates = log.dates.filter((d) => d === today);
  saveLog(log);
}
