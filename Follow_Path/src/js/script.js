// Import necessary modules from Three.js and Yuka
import * as THREE from "three";
import * as YUKA from "yuka";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

//* Renderer and Scene Setup
// Initializes the WebGL renderer, sets up the scene, and configures the camera.
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
camera.lookAt(scene.position);
const controls = new OrbitControls(camera, renderer.domElement);
controls.update();
renderer.setClearColor(0xa3a3a3);

const ambientLight = new THREE.AmbientLight(0x333333, 0.5);
scene.add(ambientLight);

const directionLight = new THREE.DirectionalLight(0xffffff, 1);
scene.add(directionLight);
directionLight.position.set(0, 10, 15);

const loader = new GLTFLoader();

//* Vehicle Setup
// Creates the visual (mesh) and logical (Yuka vehicle) components for the vehicle.
// Links the Yuka vehicle logic to the Three.js mesh for synchronization.
// const vehicleGeo = new THREE.ConeGeometry(0.1, 0.5, 8);
// const vehicleMat = new THREE.MeshNormalMaterial();
// const vehicleMesh = new THREE.Mesh(vehicleGeo, vehicleMat);
// vehicleMesh.matrixAutoUpdate = false;
// scene.add(vehicleMesh);
// vehicleGeo.rotateX(Math.PI / 2);

const vehicle = new YUKA.Vehicle();

loader.load("./assets/SUV.glb", function (gltf) {
  const model = gltf.scene;
  model.matrixAutoUpdate = false;
  scene.add(model);
  vehicle.scale = new YUKA.Vector3(0.5, 0.5, 0.5);
  vehicle.setRenderComponent(model, sync);
});
// Sync function ensures that the Three.js mesh follows the position and orientation of the Yuka vehicle.
function sync(entity, renderComponent) {
  renderComponent.matrix.copy(entity.worldMatrix);
}

//* Path and Behaviors
// Defines a closed path with waypoints for the vehicle to follow.
const path = new YUKA.Path();
path.add(new YUKA.Vector3(-6, 0, 4));
path.add(new YUKA.Vector3(-12, 0, 0));
path.add(new YUKA.Vector3(-6, 0, -12));
path.add(new YUKA.Vector3(0, 0, 0));
path.add(new YUKA.Vector3(8, 0, -8));
path.add(new YUKA.Vector3(10, 0, 0));
path.add(new YUKA.Vector3(4, 0, 4));
path.add(new YUKA.Vector3(0, 0, 6));
path.loop = true; // Enables looping, so the vehicle continuously follows the path.

vehicle.position.copy(path.current()); // Starts the vehicle at the first waypoint.

// Adds path-following and on-path behaviors to the vehicle.
const followPathBehavior = new YUKA.FollowPathBehavior(path, 3);
vehicle.steering.add(followPathBehavior);
vehicle.maxSpeed = 3;

const onPathBehavior = new YUKA.OnPathBehavior(path);
// onPathBehavior.radius = 0.8;
vehicle.steering.add(onPathBehavior);

//* Path Visualization
// Creates a visual representation of the path using a line loop.
const position = [];
for (let i = 0; i < path._waypoints.length; i++) {
  const waypoint = path._waypoints[i];
  position.push(waypoint.x, waypoint.y, waypoint.z);
}

const lineGeo = new THREE.BufferGeometry();
lineGeo.setAttribute("position", new THREE.Float32BufferAttribute(position, 3));
const lineMat = new THREE.LineBasicMaterial({ color: 0xffffff });
const lines = new THREE.LineLoop(lineGeo, lineMat);
scene.add(lines);

//* Entity Management and Animation
// Adds the vehicle to an entity manager, which updates all entities in the scene.
const entityManager = new YUKA.EntityManager();
entityManager.add(vehicle);

// The animation loop updates the Yuka entity and renders the scene.
const time = new YUKA.Time();
function animate() {
  const delta = time.update().getDelta();
  entityManager.update(delta); // Updates vehicle behavior.
  renderer.render(scene, camera); // Renders the updated scene.
}
renderer.setAnimationLoop(animate);

//* Responsive Resizing
// Adjusts the renderer and camera settings when the window size changes.
window.addEventListener("resize", function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
