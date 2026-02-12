import * as THREE from 'three';

export function createWishStar(wish) {
  // Load star texture
  const loader = new THREE.TextureLoader();
  const texture = loader.load('/heart.svg');

  const material = new THREE.SpriteMaterial({
    map: texture,
    color: 0xff4d6d,
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending
  });

  const star = new THREE.Sprite(material);

  // Set initial scale
  star.scale.set(2, 2, 1);

  // Store wish data
  if (wish) {
    star.position.set(wish.starPosition.x, wish.starPosition.y, wish.starPosition.z);
    star.userData = {
      wishId: wish.id,
      wishText: wish.text,
      name: wish.name,
      email: wish.email,
      message: wish.message
    };
  }

  return star;
}