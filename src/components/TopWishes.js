export function createTopWishesSection() {
  const section = document.createElement('section');
  section.className = 'top-wishes';
  section.innerHTML = `
    <h2>Most Loved Wishes</h2>
    <div class="wishes-grid"></div>
  `;
  return section;
}

export function updateTopWishes(wishes) {
  const sortedWishes = [...wishes].sort((a, b) =>
    (b.reactions['❤️'] || 0) - (a.reactions['❤️'] || 0)
  ).slice(0, 6);

  const grid = document.querySelector('.top-wishes .wishes-grid');
  if (grid) {
    grid.innerHTML = sortedWishes
      .map(wish => `
        <div class="wish-card" data-wish-id="${wish.id}">
          <div class="wish-id">#${wish.id}</div>
          <p class="wish-text">${wish.text.length > 100 ? wish.text.substring(0, 100) + '...' : wish.text}</p>
          <div class="wish-footer">
            <span class="wish-author">${wish.anonymous ? 'Anonymous' : wish.name}</span>
            <span class="wish-likes">Likes: ${wish.reactions['❤️'] || 0}</span>
          </div>
        </div>
      `)
      .join('');

    // Add event listeners for opening wish details
    grid.querySelectorAll('.wish-card').forEach(card => {
      card.addEventListener('click', () => {
        const wishId = card.dataset.wishId;
        showWishDetails(wishId);
      });
    });
  }
}