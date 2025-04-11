import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass.js';


const scene = new THREE.Scene();
scene.background = new THREE.Color(0xf0f0f0);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 0.4, 3);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);

// Create composer for postprocessing
const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));

// Outline pass setup
const outlinePass = new OutlinePass(
  new THREE.Vector2(window.innerWidth, window.innerHeight),
  scene,
  camera
);
outlinePass.edgeStrength = 5;
outlinePass.edgeGlow = 1;
outlinePass.edgeThickness = 2;
outlinePass.pulsePeriod = 0;
outlinePass.visibleEdgeColor.set('#00ffff');  // Neon cyan
outlinePass.hiddenEdgeColor.set('#000000');
composer.addPass(outlinePass);


document.body.appendChild(renderer.domElement);

renderer.shadowMap.enabled = false;

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;

// Lighting
scene.add(new THREE.AmbientLight(0xffffff, 2));
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(1, 2, 2);
directionalLight.castShadow = false;
scene.add(directionalLight);

// Store clickable pain zones here for raycasting
const painZones = [];

// Function to create transparent clickable boxes
function createPainZoneBox(x, y, z, name, posX, posY, posZ) {
  const box = new THREE.Mesh(
    new THREE.BoxGeometry(x, y, z),
    new THREE.MeshBasicMaterial({ color: 0x0000ff, transparent: true, opacity: 0})
  );
  box.name = name;
  box.position.set(posX, posY, posZ);
  scene.add(box);
  painZones.push(box); // Track for raycasting
  return box;
}

// Load FBX
const loader = new FBXLoader();
loader.load('./../models/humanModel.fbx', (fbx) => {
  fbx.scale.set(0.1, 0.1, 0.1);
  fbx.position.set(0, -16.4, 0);
  scene.add(fbx);
  // Create all head pain zones
  createPainZoneBox(0.2, 0.5, 0.7, 'Temple_Pain', 0.7, 0.6, 0.1);
  createPainZoneBox(0.2, 0.5, 0.7, 'Temple_Pain', -0.7, 0.6, 0.1);
  createPainZoneBox(0.3, 0.4, 0.2, 'Mid_Forehead_Pain', 0, 1, 0.9);
  createPainZoneBox(0.3, 0.4, 0.2, 'Forehead_Left', 0.4, 1, 0.9);
  createPainZoneBox(0.3, 0.4, 0.2, 'Forehead_Right', -0.4, 1, 0.9);
  createPainZoneBox(0.3, 0.6, 0.45, 'Ear_Pain', 0.8, 0.24, -0.27);
  createPainZoneBox(0.3, 0.6, 0.45, 'Ear_Pain', -0.8, 0.24, -0.27);
  createPainZoneBox(1.3, 0.2, 1.3, 'Skull_Pain', 0, 1.4, 0);
  createPainZoneBox(0.8, 1, 0.3, 'Back_Neck_Pain', 0, -0.4, -0.7);
  createPainZoneBox(0.5, 0.7, 0.6, 'Jaw_Cheek_Pain', 0.5, -0.07, 0.5);
  createPainZoneBox(0.5, 0.7, 0.6, 'Jaw_Cheek_Pain', -0.5, -0.07, 0.5);
});

// Raycasting
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
const tooltip = document.getElementById('tooltip');
let hoveredObject = null;


let currentlyGlowing = null; // Track the selected glow box

function onClick(event) {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(painZones, true);

  if (intersects.length > 0) {
    const clicked = intersects[0].object;
    const region = clicked.name;

    if (currentlyGlowing === clicked) {
      // 🔄 Toggle off if clicked again
      outlinePass.selectedObjects = [];
      currentlyGlowing = null;
      console.log(`❎ Deselected: ${region}`);
    } else {
      // ✅ Set new glow
      outlinePass.selectedObjects = [clicked];
      currentlyGlowing = clicked;
      console.log(`✅ Selected: ${region}`);

      // Log to server
      fetch('http://localhost:5000/log-click', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ region })
      })
      .then(response => response.text())
      .then(data => console.log('✅ Server response:', data))
      .catch(error => console.error('❌ Error sending log:', error));
    }
  }
}
function onPointerMove(event) {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(painZones, true);

  if (intersects.length > 0) {
    hoveredObject = intersects[0].object;
    tooltip.style.display = 'block';
    tooltip.textContent = hoveredObject.name.replace(/_/g, ' ');
    tooltip.style.left = event.clientX + 10 + 'px';
    tooltip.style.top = event.clientY + 10 + 'px';
  } else {
    hoveredObject = null;
    tooltip.style.display = 'none';
  }
}
window.addEventListener('mousemove', onPointerMove);




window.addEventListener('click', onClick);

// Animate
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  composer.render();  // ✅ Use composer instead of renderer
}
animate();
