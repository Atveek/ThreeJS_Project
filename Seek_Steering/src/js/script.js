// Import necessary modules from Three.js and Yuka
import * as THREE from "three";
import * as YUKA from "yuka";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

//* Renderer and Scene Setup
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
camera.position.set(0, 10, 15);
const controls = new OrbitControls(camera, renderer.domElement);
controls.update();
renderer.setClearColor(0xa3a3a3);

const ambientLight = new THREE.AmbientLight(0x333333, 0.5);
scene.add(ambientLight);

const directionLight = new THREE.DirectionalLight(0xffffff, 1);
scene.add(directionLight);
directionLight.position.set(0, 10, 15);

//* Vehicle Setup
const vehicle = new YUKA.Vehicle();
vehicle.position.set(-2, 0, -2);
vehicle.maxSpeed = 2;

const loader = new GLTFLoader();
loader.load("./assets/SUV.glb", function (gltf) {
  const model = gltf.scene;
  model.matrixAutoUpdate = false;
  scene.add(model);

  // Sync the model with the vehicle
  vehicle.setRenderComponent(model, sync);
  vehicle.scale.set(0.5, 0.5, 0.5);
});

function sync(entity, renderComponent) {
  renderComponent.matrix.copy(entity.worldMatrix);
}

//* Entity Management
const entityManager = new YUKA.EntityManager();
entityManager.add(vehicle);

//* Target Setup
const sphereGeo = new THREE.SphereGeometry(0.1);
const sphereMat = new THREE.MeshPhongMaterial({ color: 0xffea00 });
const targetMesh = new THREE.Mesh(sphereGeo, sphereMat);
targetMesh.matrixAutoUpdate = false;
scene.add(targetMesh);

const target = new YUKA.GameEntity();
target.setRenderComponent(targetMesh, sync);
entityManager.add(target);

//* Random target movement every 2 seconds
setInterval(() => {
  const x = Math.random() * 8;
  const y = Math.random() * 5;
  const z = Math.random() * 8;

  target.position.set(x, y, z);
}, 2000);

//* Seek Behavior for the Vehicle
const seekBehavior = new YUKA.SeekBehavior(target.position);
vehicle.steering.add(seekBehavior);

//* Animation Loop
const time = new YUKA.Time();
function animate() {
  const delta = time.update().getDelta();
  entityManager.update(delta);
  renderer.render(scene, camera);
}
renderer.setAnimationLoop(animate);

//* Responsive Resizing
window.addEventListener("resize", function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
