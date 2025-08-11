import * as THREE from 'three';
import { update } from 'three/examples/jsm/libs/tween.module.js';

export function createCamera(gameWindow) {
  const DEG2RAD = Math.PI / 180;
  // mouse button encoding
  const LEFT_MOUSE_BUTTON = 0;
  const MIDDLE_MOUSE_BUTTON = 1;
  const RIGHT_MOUSE_BUTTON = 2; 
  
  const MIN_CAMERA_ZOOM = 2; // camera radius 
  const MAX_CAMERA_ZOOM = 10;
  const MIN_CAMERA_ELEVATION = 30;
  const MAX_CAMERA_ELEVATION = 90;
  const ROTATION_SENS = 0.5;
  const PAN_SENS = -0.01;
  const ZOOM_SENS = 0.02;
  const Y_AXIS = new THREE.Vector3(0, 1, 0) // y unit vector

  const camera = new THREE.PerspectiveCamera(75, gameWindow.offsetWidth / gameWindow.offsetHeight, 0.1, 1000);
  let cameraOrigin = new THREE.Vector3(); // 0 vector init
  let cameraRadius = 4;
  let cameraElevation = 0;
  let cameraAzimuth = 0; // twin angle to 'elevation' for camera (y-z angle)
  let isLeftMouseDown = false;
  let isRightMouseDown = false;
  let isMiddleMouseDown = false;
  let prevMouseX = 0;
  let prevMouseY = 0;
  updateCameraPosition(); // init camera pos

  function onMouseDown(event) {
    console.log('mousedown');

    if (event.button === LEFT_MOUSE_BUTTON) {
      isLeftMouseDown = true;
    }
    if (event.button === MIDDLE_MOUSE_BUTTON) {
      isMiddleMouseDown = true;
    }
    if (event.button === RIGHT_MOUSE_BUTTON) {
      isRightMouseDown = true;
    }
  }

  function onMouseUp(event) {
    console.log('mouseup');
    
    if (event.button === LEFT_MOUSE_BUTTON) {
      isLeftMouseDown = false;
    }
    if (event.button === MIDDLE_MOUSE_BUTTON) {
      isMiddleMouseDown = false;
    }
    if (event.button === RIGHT_MOUSE_BUTTON) {
      isRightMouseDown = false;
    }
  }

  function onMouseMove(event) {
    console.log('mousemove');

    const deltaX = (event.clientX - prevMouseX);
    const deltaY = (event.clientY - prevMouseY);

    // Rotation of camera
    if (isLeftMouseDown) {
      cameraAzimuth += -((deltaX) * ROTATION_SENS);
      cameraElevation += ((deltaY) * ROTATION_SENS);
      cameraElevation = Math.min(MAX_CAMERA_ELEVATION, Math.max(MIN_CAMERA_ELEVATION, cameraElevation)); // clamp elevation to between horizon and origin-pole
      updateCameraPosition();
    }

    // Panning of camera
    if (isMiddleMouseDown) {
      const forward = new THREE.Vector3(0, 0, 1).applyAxisAngle(Y_AXIS, cameraAzimuth * DEG2RAD); // z unit vector, rotate around y-axis by camera Azimuth
      const left = new THREE.Vector3(1, 0, 0).applyAxisAngle(Y_AXIS, cameraAzimuth * DEG2RAD); // x unit vector, rotate around y-axis by camera Azimuth
      cameraOrigin.add(forward.multiplyScalar(PAN_SENS * deltaY));
      cameraOrigin.add(left.multiplyScalar(PAN_SENS * deltaX));
      updateCameraPosition();
    }

    // Zoom of camera
    if (isRightMouseDown) {
      cameraRadius += (deltaY) * ZOOM_SENS;
      cameraRadius = Math.min(MAX_CAMERA_ZOOM, Math.max(MIN_CAMERA_ZOOM, cameraRadius)) // camera radius/zoom clamp
      updateCameraPosition();
    }

    prevMouseX = event.clientX;
    prevMouseY = event.clientY;
  }

  function updateCameraPosition() {
    camera.position.x = cameraRadius * Math.sin(cameraAzimuth * DEG2RAD) * Math.cos(cameraElevation * DEG2RAD);
    camera.position.y = cameraRadius * Math.sin(cameraElevation * DEG2RAD);
    camera.position.z = cameraRadius * Math.cos(cameraAzimuth * DEG2RAD) * Math.cos(cameraElevation * DEG2RAD);
    camera.position.add(cameraOrigin);
    camera.lookAt(cameraOrigin); // start origin
    camera.updateMatrix();
  }

  return {
    camera,
    onMouseDown,
    onMouseUp,
    onMouseMove
  }
}