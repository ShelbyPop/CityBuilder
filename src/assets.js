import * as THREE from 'three';

const geometry = new THREE.BoxGeometry(1,1,1);

const assets = { 
  'grass': (x,y) => {
    // GRASS
    // Load mesh @ x,y tile-coordinate
    const material = new THREE.MeshLambertMaterial({ color: 0x339933 }); // Lambert to avoid gloss 
    const mesh = new THREE.Mesh(geometry, material);
    mesh.userData = { ID: 'grass', x, y };
    mesh.position.set(x, -0.5, y); // top-down from y-axis, x-z graph (why 'y' in z-axis slot)
    return mesh;
  },
  'building-1': (x,y) => {
    const material = new THREE.MeshLambertMaterial({ color: 0xbb5555 }); // Lambert to avoid gloss 
    const mesh = new THREE.Mesh(geometry, material);
    mesh.userData = { ID: 'building-1', x, y };
    mesh.position.set(x, 0.5, y); // top-down from y-axis, x-z graph (why 'y' in z-axis slot)
    return mesh;
  },
  'building-2': (x,y) => {
    const material = new THREE.MeshLambertMaterial({ color: 0xbbbb55 }); // Lambert to avoid gloss 
    const mesh = new THREE.Mesh(geometry, material);
    mesh.userData = { ID: 'building-2', x, y };
    mesh.scale.set(1,2,1);
    mesh.position.set(x, 1.0, y); // top-down from y-axis, x-z graph (why 'y' in z-axis slot)
    return mesh;
  },
  'building-3': (x,y) => {
    const material = new THREE.MeshLambertMaterial({ color: 0x5555bb }); // Lambert to avoid gloss 
    const mesh = new THREE.Mesh(geometry, material);
    mesh.userData = { ID: 'building-3', x, y };
    mesh.scale.set(1,3,1);
    mesh.position.set(x, 1.5, y); // top-down from y-axis, x-z graph (why 'y' in z-axis slot)
    return mesh;
  }
}

export function createAssetInstance(assetID, x, y) {
  if (assetID in assets) {
    return assets[assetID](x,y);
  } else {
    console.warn(`Asset ID ${assetID} is not found`)
    return undefined;
  }
}