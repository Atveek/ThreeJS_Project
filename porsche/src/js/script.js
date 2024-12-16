import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(6, 6, 6);
const orbit = new OrbitControls(camera, renderer.domElement);
orbit.update();

renderer.setClearColor(0xa3a3a3);

const grid = new THREE.GridHelper(30, 30);
scene.add(grid);

// const ambientLight = new THREE.AmbientLight(0xededed, 0.8);
// scene.add(ambientLight);

// const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
// scene.add(directionalLight);
// directionalLight.position.set(10, 11, 7);

const gltfLoader = new GLTFLoader();
const rgbeLoader = new RGBELoader();

let car;
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 4;

rgbeLoader.load("./assets/MR_INT-005_WhiteNeons_NAD.hdr", function (texture) {
  texture.mapping = THREE.EquirectangularReflectionMapping;
  scene.environment = texture;

  gltfLoader.load("./assets/scene.gltf", function (gltf) {
    const model = gltf.scene;
    scene.add(model);
    car = model;
  });
});

window.addEventListener("resize", function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

function animate(time) {
  if (car) {
    car.rotation.y = time / 3000;
  }
  renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);
