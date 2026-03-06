import { createTitle } from '../../scripts/dom.js';

export function dashboardPage(container) {
  const title = createTitle('Dashboard');

  container.appendChild(title);
}
