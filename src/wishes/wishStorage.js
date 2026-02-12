const WISHES_KEY = 'valentine_wishes_2026';

export function loadWishes() {
  const wishes = localStorage.getItem(WISHES_KEY);
  return wishes ? JSON.parse(wishes) : [];
}

export function saveWish(wish) {
  const wishes = loadWishes();
  wishes.push(wish);
  localStorage.setItem(WISHES_KEY, JSON.stringify(wishes));
}

export function getWishById(id) {
  const wishes = loadWishes();
  return wishes.find(wish => wish.id === id);
}

export function updateWish(id, updates) {
  const wishes = loadWishes();
  const index = wishes.findIndex(wish => wish.id === id);

  if (index !== -1) {
    wishes[index] = { ...wishes[index], ...updates };
    localStorage.setItem(WISHES_KEY, JSON.stringify(wishes));
    return true;
  }
  return false;
}