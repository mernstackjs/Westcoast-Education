export function createTitle(text: string): HTMLHeadingElement {
  const title = document.createElement('h1');
  title.className = 'page-title';
  title.textContent = text;
  return title;
}

export function createCard(): HTMLDivElement {
  const card = document.createElement('div');
  card.className = 'card';
  return card;
}

export function createStatusBadge(
  text: string,
  variant: string,
): HTMLSpanElement {
  const span = document.createElement('span');
  span.classList.add('status');
  if (variant) {
    span.classList.add(variant);
  }
  span.textContent = text;
  return span;
}
