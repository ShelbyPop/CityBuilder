import * as THREE from 'three';

export function createScene() {
  // Initialize scene
  const gameWindow = document.getElementById('render-target');
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x888888);

  const camera = new THREE.PerspectiveCamera(75, gameWindow.offsetWidth / gameWindow.offsetHeight, 0.1, 1000);
  camera.position.z = 10;

  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(gameWindow.offsetWidth, gameWindow.offsetHeight);
  gameWindow.appendChild(renderer.domElement);

  const box_geometry = new THREE.BoxGeometry(1,1,1);
  const box_material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
  const box_mesh = new THREE.Mesh(box_geometry, box_material);
  scene.add(box_mesh);

  function draw() {
    box_mesh.rotation.x += 0.01;
    box_mesh.rotation.y += 0.01;
    renderer.render(scene, camera);
  }  

  function start() {
    renderer.setAnimationLoop(draw);
  }

  function stop() {
    renderer.setAnimationLoop(null);
  }

  return {
    start,
    stop
  }
}
