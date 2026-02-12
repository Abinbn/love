import { showWishDetails, handleReaction, findWish } from '../wishes/wishSystem.js';

export function setupEventListeners() {
  // Make Wish button
  document.getElementById('make-wish-btn')?.addEventListener('click', () => {
    const modal = document.getElementById('wish-form-modal');
    if (modal) {
      modal.style.display = 'flex';
      // Reset form and anonymous checkbox state
      const form = modal.querySelector('#wish-form');
      const anonymousCheck = form.querySelector('#anonymous-check');
      const nameGroup = form.querySelector('#name-group');
      const emailInput = form.querySelector('#email');

      form.reset();
      nameGroup.style.display = anonymousCheck.checked ? 'none' : 'block';
      emailInput.required = !anonymousCheck.checked;
    }
  });

  // Handle anonymous checkbox
  document.getElementById('anonymous-check')?.addEventListener('change', (e) => {
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    if (nameInput && emailInput) {
      if (e.target.checked) {
        nameInput.removeAttribute('required');
        nameInput.style.display = 'none';
        emailInput.removeAttribute('required');
      } else {
        nameInput.setAttribute('required', 'required');
        nameInput.style.display = 'block';
        emailInput.setAttribute('required', 'required');
      }
    }
  });

  // Find Wish button
  document.getElementById('find-wish-btn')?.addEventListener('click', () => {
    document.getElementById('find-wish-modal').style.display = 'flex';
  });

  // Find Wish submit
  document.getElementById('find-wish-submit')?.addEventListener('click', async () => {
    const wishId = document.getElementById('wish-id').value.trim();
    if (wishId) {
      const found = await findWish(wishId);
      if (found) {
        document.getElementById('find-wish-modal').style.display = 'none';
      }
    }
  });

  // Add close buttons to all modals
  document.querySelectorAll('.modal').forEach(modal => {
    // Add close button to modal content
    const closeBtn = document.createElement('button');
    closeBtn.className = 'modal-close-btn';
    closeBtn.innerHTML = '×';
    closeBtn.onclick = () => modal.style.display = 'none';
    modal.querySelector('.modal-content').prepend(closeBtn);

    // Close on outside click
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.style.display = 'none';
      }
    });
  });

  // Handle love reactions
  document.addEventListener('click', async (e) => {
    const reactionBtn = e.target.closest('.love-reaction');
    if (reactionBtn) {
      const wishId = reactionBtn.dataset.wishId;
      if (wishId) {
        const success = await handleReaction(wishId);
        if (success) {
          // Update all instances of this wish's reaction count
          const countSpans = document.querySelectorAll(`.love-reaction[data-wish-id="${wishId}"] .reaction-count`);
          countSpans.forEach(span => {
            const newCount = parseInt(span.textContent) + 1;
            span.textContent = newCount;
          });

          // Add animation class
          reactionBtn.classList.add('reaction-added');
          setTimeout(() => {
            reactionBtn.classList.remove('reaction-added');
          }, 1000);
        }
      }
    }
  });
}