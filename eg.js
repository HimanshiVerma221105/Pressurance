import * as THREE from 'three';
import { FBXLoader } from 'three/examples/js/loaders/FBXLoader';

let scene, camera, renderer, model;
const viewerContainer = document.getElementById('viewerContainer');

// Function to set up the 3D scene
function initScene() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    viewerContainer.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0x404040);  // Ambient light
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);  // Directional light
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    camera.position.z = 5;

    // Handle resizing of the window
    window.addEventListener('resize', onWindowResize);
}

// Resize handler
function onWindowResize() {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
}

// Function to load the 3D model (humanModel.fbx)
function loadModel() {
    const loader = new FBXLoader();
    loader.load('./../models/humanModel.fbx', (loadedModel) => {
        model = loadedModel;
        scene.add(model);
        animate();
    }, undefined, (error) => {
        console.error('Error loading the 3D model:', error);
    });
}

// Animation loop to rotate the model
function animate() {
    requestAnimationFrame(animate);
    if (model) {
        model.rotation.y += 0.01;  // Rotate the model slowly
    }
    renderer.render(scene, camera);
}

// When the button is clicked, initialize the scene and load the model
document.getElementById('loadButton').addEventListener('click', () => {
    // Hide the button once clicked
    document.getElementById('loadButton').style.display = 'none';
    
    // Show the viewer container
    viewerContainer.style.display = 'block';

    // Initialize the 3D scene and load the model
    initScene();
    loadModel();
});
