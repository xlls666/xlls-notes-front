export function formatTime(time) {
  if (!time) return ''
  return time.split('T')[0] // 输出：2025-04-30
}