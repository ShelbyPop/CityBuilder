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

  let terrain = [];
  let buildings = [];

  function initialize(city) {
    scene.clear();
    terrain = [];
    buildings = [];
    for (let x = 0; x < city.size; x++) {
      let column = [];
      for  (let y = 0; y < city.size; y++) {
        // GRASS
        // Load mesh @ x,y tile-coordinate
        const box_geometry = new THREE.BoxGeometry(1,1,1);
        const box_material = new THREE.MeshLambertMaterial({ color: 0x00cc00 }); // Lambert to avoid gloss 
        const box_mesh = new THREE.Mesh(box_geometry, box_material);
        box_mesh.position.set(x, -0.5, y); // top-down from y-axis, x-z graph (why 'y' in z-axis slot)
        scene.add(box_mesh); // Add mesh to scene
        column.push(box_mesh) 
      }
      terrain.push(column); // push mesh to meshes
      buildings.push([...Array(city.size)]); // 2dimensional grid of undef columns
    }
    initLights();
  }

  function update(city) {
    for (let x = 0; x < city.size; x++) {
      for  (let y = 0; y < city.size; y++) {
        // BUILDING Geometry
        const tile = city.data[x][y];
        // null check first
        if (tile.building && tile.building.startsWith('building')) {
          const height = tile.building.slice(-1); // last char is block-height
          const building_geometry = new THREE.BoxGeometry(1,height,1);
          const building_material = new THREE.MeshLambertMaterial({ color: 0xaaaaaa }); // Lambert to avoid gloss 
          const building_mesh = new THREE.Mesh(building_geometry, building_material);
          building_mesh.position.set(x, height/2, y); // top-down from y-axis, x-z graph (why 'y' in z-axis slot)
          if (buildings[x][y]) {
            scene.remove(buildings[x][y]);
          }
          scene.add(building_mesh); // Add mesh to scene
          buildings[x][y] = building_mesh;
        }      
      }
    }
  }


  function initLights() {
    const lights = [
      new THREE.AmbientLight(0xffffff, 0.1), // ambient white lighting
      new THREE.DirectionalLight(0xffffff, 0.6),
      new THREE.DirectionalLight(0xffffff, 0.3),
      new THREE.DirectionalLight(0xffffff, 0.3)
    ];
    lights[1].position.set(0, 1, 0);
    lights[2].position.set(1, 1, 0);
    lights[3].position.set(0, 1, 1);

    scene.add(...lights); // need to add every light indep. hence '...'
  }

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
    initialize,
    update,
    start,
    stop,
    onMouseDown,
    onMouseMove,
    onMouseUp
  }
}
