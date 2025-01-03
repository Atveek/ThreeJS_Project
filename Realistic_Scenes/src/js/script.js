import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";

const hdrTextureUrl = new URL(
  "../img/MR_INT-003_Kitchen_Pierre.hdr",
  import.meta.url
);

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
camera.position.set(10, 10, 10);
const orbit = new OrbitControls(camera, renderer.domElement);
orbit.update();

renderer.outputEncoding = THREE.sRGBEncoding;
renderer.toneMapping =  THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.5;

const loader = new RGBELoader();
loader.load(hdrTextureUrl, function (texture) {
  texture.mapping = THREE.EquirectangularReflectionMapping;
  scene.background = texture;
  scene.environment = texture;

  const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(1, 50, 50),
    new THREE.MeshStandardMaterial({
      color: 0xffea00,
      roughness: 0,
      metalness: 0.5,
    })
  );
  scene.add(sphere);
});

window.addEventListener("resize", function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

function animate() {
  renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);
