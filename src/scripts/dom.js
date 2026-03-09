export function createTitle(text) {
  const title = document.createElement('h1');
  title.className = 'page-title';
  title.textContent = text;

  return title;
}

export function createCard() {
  const card = document.createElement('div');
  card.className = 'card';
  return card;
}

export function createStatusBadge(text, variant) {
  const span = document.createElement('span');
  span.classList.add('status');
  if (variant) {
    span.classList.add(variant);
  }
  span.textContent = text;
  return span;
}
