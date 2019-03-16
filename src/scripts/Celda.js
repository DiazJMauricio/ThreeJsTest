import * as THREE from "three";

function Celda(scene, posX, posY) {
  let cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
  let cubeMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff });
  let cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
  cube.castShadow = true;
  cube.receiveShadow = true;

  scene.add(cube);
}
