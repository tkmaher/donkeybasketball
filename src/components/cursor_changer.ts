const INTERACTIVE_SELECTOR = "button, a, input, textarea, select, label, div, svg";

export const isInteractive = (target: EventTarget) => {
  if (!(target instanceof Element) || (target.children.length && target.closest('svg') == null)) return null;
  const closest = target.closest(INTERACTIVE_SELECTOR) ?? null;
  if (!closest) return null;
  if (closest.classList.contains('play'))
    return "play";
  else if (closest.classList.contains('pause'))
    return "pause";
  if (closest.matches("button") || closest.matches("a"))
    return "donut";
  if (closest.matches("input") || closest.matches("textarea"))
    return "text";
  return "plus";
}
