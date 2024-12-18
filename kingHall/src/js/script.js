import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { FirstPersonControls } from "three/examples/jsm/controls/FirstPersonControls.js";
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
camera.position.set(-1.7, 0, 8.7);
camera.lookAt(1.7, 0, 8.7);

const gltfLoader = new GLTFLoader();
const rgbeLoader = new RGBELoader();

rgbeLoader.load(
  "./assets/MR_INT-006_LoftIndustrialWindow_Griffintown.hdr",
  function (texture) {
    texture.mapping = THREE.EquirectangularReflectionMapping;
    scene.background = texture;
  }
);

// const orbit = new OrbitControls(camera, renderer.domElement);
// orbit.update();

const controls = new FirstPersonControls(camera, renderer.domElement);
camera.movementSpeed = 80;
camera.lookSpeed = 80;

const clock = new THREE.Clock();
function animate() {
  renderer.render(scene, camera);
  controls.update(clock.getDelta());
}

renderer.setAnimationLoop(animate);

window.addEventListener("resize", function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
