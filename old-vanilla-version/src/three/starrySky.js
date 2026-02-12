import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { createBackgroundStars } from './backgroundStars.js';
import { createWishStar } from '../components/WishStar.js';
import { loadWishes } from '../wishes/wishStorage.js';
import { showWishTooltip, hideWishTooltip } from '../ui/tooltip.js';
import { showWishDetails } from '../wishes/wishSystem.js';

let scene, camera, renderer, controls;
let raycaster = new THREE.Raycaster();
let mouse = new THREE.Vector2();

export function initStarrySky() {
  // Setup scene
  scene = new THREE.Scene();

  // Get canvas and check if it exists
  const canvas = document.getElementById('starry-sky-canvas');
  if (!canvas) {
    console.error('Canvas element not found');
    return;
  }

  // Setup camera
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );

  // Setup renderer
  renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
    alpha: true
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);

  // Setup camera position
  camera.position.z = 5;

  // Setup controls
  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.maxDistance = 100;
  controls.minDistance = 3;
  controls.mouseButtons = {
    RIGHT: THREE.MOUSE.ROTATE,
    MIDDLE: THREE.MOUSE.NONE,
    LEFT: THREE.MOUSE.NONE
  };
  controls.touches = {
    TWO: THREE.TOUCH.ROTATE,
    THREE: THREE.TOUCH.NONE
  };
  controls.enableZoom = false;
  controls.keyEvents = true;

  // Add event listeners
  window.addEventListener('resize', onWindowResize, false);
  renderer.domElement.addEventListener('mousemove', onMouseMove, false);
  renderer.domElement.addEventListener('click', onStarClick, false);

  // Create stars
  createBackgroundStars(scene);
  createWishStars();

  // Start animation
  animate();
}

function createWishStars() {
  const wishes = loadWishes();
  wishes.forEach(wish => {
    const totalReactions = wish.reactions['❤️'] || 0;
    const brightness = 0.5 + Math.min(totalReactions * 0.1, 0.5);

    const star = createWishStar();
    star.scale.setScalar(0.1 + brightness * 0.1);

    const position = wish.starPosition;
    star.position.set(position.x, position.y, position.z);
    star.userData.wishId = wish.id;
    star.userData.wishText = wish.text;

    scene.add(star);
    stars.set(wish.id, star);
  });
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function onMouseMove(event) {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(scene.children);

  if (intersects.length > 0) {
    const star = intersects[0].object;
    if (star.userData.wishText) {
      showWishTooltip(star.userData.wishText, event.clientX, event.clientY);
    }
  } else {
    hideWishTooltip();
  }
}

function onStarClick(event) {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(scene.children);

  if (intersects.length > 0) {
    const star = intersects[0].object;
    if (star.userData.wishId) {
      showWishDetails(star.userData.wishId);
    }
  }
}

function handleZoom(event) {
  // Only allow zooming when shift key is pressed
  if (!event.shiftKey) {
    event.preventDefault();
    event.stopPropagation();
    return false;
  }
}

function animate() {
  requestAnimationFrame(animate);

  // Update controls
  controls.update();

  // Rotate background stars
  scene.children.forEach(child => {
    if (child instanceof THREE.Points) {  // Background stars
      child.rotation.y += 0.0005;
      child.rotation.x += 0.0005;
    }
  });
  controls.update();
  renderer.render(scene, camera);
}

// Add these styles to ensure proper canvas positioning
const styles = document.createElement('style');
styles.textContent = `
  #starry-sky {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
    pointer-events: none;
  }
  
  #starry-sky canvas {
    width: 100% !important;
    height: 100% !important;
    pointer-events: auto;
  }
  
  #content-wrapper {
    position: relative;
    z-index: 2;
    min-height: 100vh;
    pointer-events: auto;
  }
`;
document.head.appendChild(styles);