import { loadWishes, saveWish, getWishById, updateWish } from './wishStorage.js';
import { generateWishId } from '../utils/wishIdGenerator.js';
import { createWishStar } from '../components/WishStar.js';
import { createRecentWishesSection, updateRecentWishes } from '../components/RecentWishes.js';
import { createTopWishesSection, updateTopWishes } from '../components/TopWishes.js';
import { createFindWishModal } from '../components/FindWishModal.js';
import { createLoveEffect } from '../effects/loveEffect.js';

export function initWishSystem() {
  const wishForm = document.getElementById('wish-form');
  const anonymousCheck = document.getElementById('anonymous-check');
  const nameGroup = document.getElementById('name-group');

  // Handle anonymous checkbox
  anonymousCheck?.addEventListener('change', (e) => {
    if (nameGroup) {
      nameGroup.style.display = e.target.checked ? 'none' : 'block';
    }
  });

  wishForm?.addEventListener('submit', handleWishSubmission);

  // Initialize sections
  document.body.appendChild(createRecentWishesSection());
  document.body.appendChild(createTopWishesSection());
  document.body.appendChild(createFindWishModal());

  // Update wish displays
  const wishes = loadWishes();
  updateRecentWishes(wishes);
  updateTopWishes(wishes);
}

export function handleWishSubmission(event) {
  event.preventDefault();

  const formData = new FormData(event.target);
  const isAnonymous = formData.get('anonymous') === 'on';
  const name = isAnonymous ? 'Anonymous' : formData.get('name')?.trim();

  const wish = {
    id: generateWishId(),
    text: formData.get('wish-text')?.trim(),
    name: name || 'Anonymous',
    anonymous: isAnonymous,
    date: new Date().toISOString(),
    reactions: { '❤️': 0 },
    starPosition: {
      x: (Math.random() - 0.5) * 100,
      y: (Math.random() - 0.5) * 100,
      z: -Math.random() * 50
    }
  };

  if (!wish.text) {
    alert('Please enter your Valentine\'s message');
    return false;
  }

  if (!isAnonymous && !wish.name) {
    alert('Please enter your name or choose to stay anonymous');
    return false;
  }

  saveWish(wish);

  // Close modal and reset form
  event.target.reset();
  event.target.closest('.modal').style.display = 'none';

  // Show wish ID popup
  showWishIdPopup(wish.id);

  // Update displays
  const wishes = loadWishes();
  updateRecentWishes(wishes);
  updateTopWishes(wishes);

  return false;
}

function showWishIdPopup(wishId) {
  const popup = document.createElement('div');
  popup.className = 'wish-id-popup modal';
  popup.innerHTML = `
    <div class="modal-content">
      <h3>Your Wish Has Been Sent! 💖</h3>
      <p>Your Wish ID is:</p>
      <div class="wish-id">${wishId}</div>
      <p class="note">Save this ID to find your wish later</p>
      <button onclick="this.parentElement.parentElement.remove()">Close</button>
    </div>
  `;
  document.body.appendChild(popup);
  popup.style.display = 'flex';
}

export async function findWish(wishId) {
  const wish = getWishById(wishId);
  if (wish) {
    showWishDetails(wish.id);
    return true;
  } else {
    alert('Wish ID not found. Please check and try again.');
    return false;
  }
}

export async function handleReaction(wishId) {
  const wish = getWishById(wishId);
  if (wish) {
    // Increment snow reaction count
    wish.reactions['❤️'] = (wish.reactions['❤️'] || 0) + 1;

    // Update wish in storage
    updateWish(wishId, wish);

    // Create snow effect
    createLoveEffect();

    // Update displays
    const wishes = loadWishes();
    updateRecentWishes(wishes);
    updateTopWishes(wishes);

    return true;
  }
  return false;
}

export function showWishDetails(wishId) {
  const wish = getWishById(wishId);
  if (wish) {
    const modal = document.getElementById('wish-details-modal');
    const content = modal.querySelector('.modal-content');
    content.dataset.wishId = wishId;

    const totalLikes = wish.reactions['❤️'] || 0;

    const details = document.getElementById('wish-details');
    details.innerHTML = `
      <div class="wish-content">
        <p class="wish-text">${wish.text}</p>
      </div>
      <div class="wish-footer">
        <p class="wish-author">${wish.anonymous ? 'Anonymous' : wish.name}</p>
        <span class="wish-likes">Likes: ${totalLikes}</span>
      </div>
      <div class="wish-reactions">
        <button class="love-reaction" data-wish-id="${wishId}">
          ❤️ <span class="reaction-count">${totalLikes}</span>
        </button>
      </div>
      <div class="wish-actions">
        <button id="share-wish-btn">Share Wish</button>
        <button id="send-cheer-btn">Send Love & Hugs</button>
      </div>
      <div class="wish-id">#${wishId}</div>
    `;

    // Add other event listeners
    setupWishDetailsEvents(wish);
    modal.style.display = 'flex';
  }
}

function setupWishDetailsEvents(wish) {
  // Share button
  document.getElementById('share-wish-btn')?.addEventListener('click', () => {
    showShareModal(wish);
  });

  // Send cheer button
  document.getElementById('send-cheer-btn')?.addEventListener('click', () => {
    sendHolidayCheer(wish);
  });
}

function showShareModal(wish) {
  const shareModal = document.createElement('div');
  shareModal.className = 'modal share-modal';
  shareModal.innerHTML = `
    <div class="modal-content">
      <h3>Share This Wish</h3>
      <div class="share-buttons">
        <button class="share-btn twitter" data-platform="twitter">
          <img src="/icons/twitter.svg" alt="Twitter">
          Twitter
        </button>
        <button class="share-btn facebook" data-platform="facebook">
          <img src="/icons/facebook.svg" alt="Facebook">
          Facebook
        </button>
        <button class="share-btn whatsapp" data-platform="whatsapp">
          <img src="/icons/whatsapp.svg" alt="WhatsApp">
          WhatsApp
        </button>
        <button class="share-btn telegram" data-platform="telegram">
          <img src="/icons/telegram.svg" alt="Telegram">
          Telegram
        </button>
      </div>
      <button class="modal-close-btn">×</button>
    </div>
  `;

  document.body.appendChild(shareModal);
  shareModal.style.display = 'flex';

  // Setup share buttons
  const shareButtons = shareModal.querySelectorAll('.share-btn');
  shareButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const platform = btn.dataset.platform;
      const text = `Check out this Valentine's wish: ${wish.text}`;
      const url = `${window.location.origin}/wish/${wish.id}`;

      const shareUrls = {
        twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
        whatsapp: `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`,
        telegram: `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`
      };

      window.open(shareUrls[platform], '_blank');
    });
  });

  // Close button
  shareModal.querySelector('.modal-close-btn').addEventListener('click', () => {
    shareModal.remove();
  });
}

function sendHolidayCheer(wish) {
  createLoveEffect();
  const cheerMessages = [
    '💖 Sending love and hugs your way!',
    '🌹 Your wish is as sweet as a rose!',
    '💝 Love is in the air!',
    '✨ Spreading Valentine\'s magic to your wish!'
  ];

  const message = cheerMessages[Math.floor(Math.random() * cheerMessages.length)];
  alert(message);
}