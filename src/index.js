import * as THREE from "three";
const OrbitControls = require("three-orbitcontrols");

var scene, camera, renderer, controls;
var cube;

/**
 * CELDA
 */
class Celda {
  constructor(posX, posZ, lv = 1) {
    this.lv = lv;
    this.posX = posX;
    this.posZ = posZ;
    this.createCelda();
  }
  createCelda() {
    let celdaGeometry = new THREE.BoxGeometry(1, 1, 1);
    let celdaMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff });
    let celda = new THREE.Mesh(celdaGeometry, celdaMaterial);
    celda.castShadow = true;
    celda.receiveShadow = true;
    celda.position.x = this.posX;
    celda.position.z = this.posZ;
    let lev = Math.random() * 0.05 + 0.1;
    celda.scale.y = lev;
    celda.position.y = 0 + lev / 2;
    this.celda = celda;
  }

  get box() {
    return this.celda;
  }
}

/**
 * PLANO
 */
class Plano {
  constructor(height = 1, width = 1, baseLv = 1) {
    this.height = height;
    this.width = width;
    this.baseLv = baseLv;
    this.createPlano();
  }
  createPlano() {
    let group = new THREE.Group();
    for (let i = 0; i < this.height; i += 1) {
      for (let o = 0; o < this.width; o += 1) {
        let celda = new Celda(i, o);
        group.add(celda.box);
      }
    }
    group.position.x -= this.height / 2;
    group.position.z -= this.width / 2;
    this.group = group;
  }

  get migroup() {
    return this.group;
  }
}
/**
 * PROGRAMA
 */

init();
function init() {
  createScene();
  let plano = new Plano(10, 15);
  scene.add(plano.migroup);

  update();
}

function update() {
  render();
  requestAnimationFrame(update);
}

function createScene() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xdddddd);
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.set(0, 30, 50);
  camera.rotation.x -= 0.2;
  //
  let AmbientLight = new THREE.AmbientLight(0xccccef, 0.5);
  scene.add(AmbientLight);
  //
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.render(scene, camera);
  //
  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableZoom = true;
  window.addEventListener("resize", onWindowResize, false); //resize callback
  DirectionalLight();
}

function DirectionalLight() {
  //    Directional Light
  var directionalLight = new THREE.DirectionalLight(0xcacaaa, 0.9, 100);
  directionalLight.position.y += 90;
  directionalLight.position.x += 50;
  directionalLight.position.z += 40;
  directionalLight.castShadow = true;
  scene.add(directionalLight);

  //Set up shadow properties for the light
  directionalLight.shadow.mapSize.width = 2048 * 2;
  directionalLight.shadow.mapSize.height = 2048 * 2;
  directionalLight.shadow.camera.near = 1;
  directionalLight.shadow.camera.far = 200;
  directionalLight.shadow.camera.left = -25;
  directionalLight.shadow.camera.bottom = -25;
  directionalLight.shadow.camera.right = 25;
  directionalLight.shadow.camera.top = 25;
  directionalLight.shadow.bias = 0.0; //  sobre cubrir
  directionalLight.shadow.radius = 0; //  difuminado de la sombra

  var helper = new THREE.CameraHelper(directionalLight.shadow.camera);
  scene.add(helper);
}

function render() {
  renderer.render(scene, camera);
}
function onWindowResize() {
  //resize & align
  let sceneHeight = window.innerHeight;
  let sceneWidth = window.innerWidth;
  renderer.setSize(sceneWidth, sceneHeight);
  camera.aspect = sceneWidth / sceneHeight;
  camera.updateProjectionMatrix();
}
