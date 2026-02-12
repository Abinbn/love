export function createRecentWishesSection() {
  const section = document.createElement('section');
  section.className = 'recent-wishes';
  section.innerHTML = `
    <h2>Recent Wishes</h2>
    <div class="wishes-grid"></div>
  `;
  return section;
}

export function updateRecentWishes(wishes) {
  const grid = document.querySelector('.recent-wishes .wishes-grid');
  if (grid) {
    grid.innerHTML = wishes
      .slice(-6)
      .reverse()
      .map(wish => `
        <div class="wish-card" data-wish-id="${wish.id}">
          <div class="wish-id">#${wish.id}</div>
          <span class="wish-likes">Likes: ${wish.reactions['❤️'] || 0}</span>
          <p class="wish-text">${wish.text.length > 100 ? wish.text.substring(0, 100) + '...' : wish.text}</p>
          <div class="wish-footer">
            <span class="wish-author">${wish.anonymous ? 'Anonymous' : wish.name}</span>
            
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