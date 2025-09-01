export function buildCells(cities, containerSelector = '#container') {
  const container = document.querySelector(containerSelector);

  for (const city of cities) {
    const cell = document.createElement('div');
    cell.className = 'cell';
    cell.id = city.id;
    cell.style.backgroundColor = city.bg;

    cell.innerHTML = `
      <img src="${city.titleImg}" alt="${city.alt}">
      <audio preload="auto" src="${city.audio}" id="${city.id}-audio"></audio>
      <div class="progress"></div>
    `;

    container.appendChild(cell);
  }

  return container;
}
