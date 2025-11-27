export function genBagId() {
  return `BAG-${Math.random().toString(36).slice(2,8).toUpperCase()}`
}
