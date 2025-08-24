import * as THREE from 'three';
import { createCamera } from './camera_control.js';
import { createAssetInstance } from './assets.js';


export function createScene() {
  // Initialize scene
  const gameWindow = document.getElementById('render-target');
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x888888);

  const camera = createCamera(gameWindow);

  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(gameWindow.offsetWidth, gameWindow.offsetHeight);
  gameWindow.appendChild(renderer.domElement);

  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();
  let selectedObject = undefined;

  let terrain = [];
  let buildings = [];

  let onObjectSelected = undefined;

  function initialize(city) {
    scene.clear();
    terrain = [];
    buildings = [];
    for (let x = 0; x < city.size; x++) {
      let column = [];
      for  (let y = 0; y < city.size; y++) {
        const terrainID = city.data[x][y].terrainID;
        const mesh = createAssetInstance(terrainID, x, y);
        scene.add(mesh); // Add mesh to scene
        column.push(mesh) 
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
        const currBuildingID = buildings[x][y]?.userData.ID;
        const newBuildingID = city.data[x][y].buildingID;

        // if remove building, remove from scene
        if (!newBuildingID && currBuildingID) {
          scene.remove(buildings[x][y]);
          buildings[x][y] = undefined;
        }

        // update mesh on data model change
        if (newBuildingID !== currBuildingID) {
          scene.remove(buildings[x][y])
          buildings[x][y] = createAssetInstance(newBuildingID, x, y);
          scene.add(buildings[x][y]);
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

    mouse.x = (event.clientX / renderer.domElement.clientWidth) * 2 - 1; // normalize to [-1, 1]
    mouse.y = -(event.clientY / renderer.domElement.clientHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, camera.camera);
    let intersections = raycaster.intersectObjects(scene.children, false);
    if (intersections.length > 0) {
      if (selectedObject) selectedObject.material.emissive.setHex(0);
      selectedObject = intersections[0].object;
      selectedObject.material.emissive.setHex(0x555555);
      console.log(selectedObject.userData);
      
      if (this.onObjectSelected) {
        this.onObjectSelected(selectedObject);
      }
    }

  }

  function onMouseUp(event) {
    camera.onMouseUp(event);
  }

  function onMouseMove(event) {
    camera.onMouseMove(event);
  }

  return {
    onObjectSelected,
    initialize,
    update,
    start,
    stop,
    onMouseDown,
    onMouseMove,
    onMouseUp
  }
}
