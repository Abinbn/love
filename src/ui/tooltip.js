export function createTooltip() {
  const tooltip = document.createElement('div');
  tooltip.id = 'wish-tooltip';
  tooltip.style.cssText = `
    position: fixed;
    background: rgba(0, 0, 0, 0.8);
    color: white;
    padding: 8px 12px;
    border-radius: 4px;
    font-size: 14px;
    pointer-events: none;
    z-index: 1000;
    display: none;
    max-width: 200px;
    backdrop-filter: blur(5px);
  `;
  document.body.appendChild(tooltip);
  return tooltip;
}

const tooltip = createTooltip();

export function showWishTooltip(text, x, y) {
  tooltip.textContent = text;
  tooltip.style.display = 'block';
  tooltip.style.left = `${x + 10}px`;
  tooltip.style.top = `${y + 10}px`;
}

export function hideWishTooltip() {
  tooltip.style.display = 'none';
}