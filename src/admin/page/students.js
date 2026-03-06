import { createTitle } from '../../scripts/dom.js';

export function ListOfStudentsPage(container) {
  const title = createTitle('Students');

  container.appendChild(title);
}
