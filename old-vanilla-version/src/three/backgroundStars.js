import * as THREE from 'three';

export function createBackgroundStars(scene) {
  const starsGeometry = new THREE.BufferGeometry();
  const starsMaterial = new THREE.PointsMaterial({
    color: 0xFFB3C1,
    size: 0.1,
    transparent: true,
    opacity: 0.8
  });

  const starsVertices = [];
  for (let i = 0; i < 1000; i++) {
    const x = (Math.random() - 0.5) * 2000;
    const y = (Math.random() - 0.5) * 2000;
    const z = -Math.random() * 2000;
    starsVertices.push(x, y, z);
  }

  starsGeometry.setAttribute(
    'position',
    new THREE.Float32BufferAttribute(starsVertices, 3)
  );

  const stars = new THREE.Points(starsGeometry, starsMaterial);
  scene.add(stars);

  return stars;
}