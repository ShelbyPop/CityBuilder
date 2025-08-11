import * as THREE from 'three';
import { createCamera } from './camera_control.js';

export function createScene() {
  // Initialize scene
  const gameWindow = document.getElementById('render-target');
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x888888);

  const camera = createCamera(gameWindow);

  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(gameWindow.offsetWidth, gameWindow.offsetHeight);
  gameWindow.appendChild(renderer.domElement);

  const box_geometry = new THREE.BoxGeometry(1,1,1);
  const box_material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
  const box_mesh = new THREE.Mesh(box_geometry, box_material);
  scene.add(box_mesh);

  function draw() {
    renderer.render(scene, camera.camera);
  }  

  function start() {
    renderer.setAnimationLoop(draw);
  }

  function stop() {
    renderer.setAnimationLoop(null);
  }

  function onMouseDown(event) {
    camera.onMouseDown(event);
  }

  function onMouseUp(event) {
    camera.onMouseUp(event);
  }

  function onMouseMove(event) {
    camera.onMouseMove(event);
  }

  

  return {
    start,
    stop,
    onMouseDown,
    onMouseMove,
    onMouseUp
  }
}
