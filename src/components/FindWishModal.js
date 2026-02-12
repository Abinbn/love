export function createFindWishModal() {
  const modal = document.createElement('div');
  modal.id = 'find-wish-modal';
  modal.className = 'modal';
  modal.innerHTML = `
    <div class="modal-content">
      <h2>Find Your Wish</h2>
      <div class="form-group">
        <label for="wish-id">Enter your Wish ID</label>
        <input type="text" id="wish-id" placeholder="e.g., ABC123" maxlength="6">
      </div>
      <button id="find-wish-submit">Find My Wish</button>
    </div>
  `;
  return modal;
}

export function handleFindWish() {
  const wishId = document.getElementById('wish-id').value.trim();
  const modal = document.getElementById('find-wish-modal');
  
  if (wishId) {
    const wish = getWishById(wishId);
    if (wish) {
      modal.style.display = 'none';
      showWishDetails(wishId);
      return true;
    } else {
      alert('Wish ID not found. Please check and try again.');
      return false;
    }
  }
  return false;
}