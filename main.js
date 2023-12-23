import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById("app").appendChild(renderer.domElement);
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(
  60, window.innerWidth / window.innerHeight, 0.1, 1000
);
scene.add(new THREE.AxesHelper(100));
camera.position.set(0, 7.5, 15);





// adding plane to the scene
const planeGeometry = new THREE.PlaneGeometry(60, 60);
const planeMaterial = new THREE.MeshStandardMaterial({ color: 0x000000, side: THREE.DoubleSide });
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.rotation.set(-0.5 * Math.PI, 0, 0)
const gridHelper = new THREE.GridHelper(60);
scene.add(plane); scene.add(gridHelper);

// adding objects to scene
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
const loader = new GLTFLoader();
// Load a GLB model
loader.load(
    'F22.glb',
    function (gltf) {
        // Get the loaded model
        const model = gltf.scene;
        // Add the model to the scene
        scene.add(model);
    },
    undefined,
    function (error) {
        console.error('Error loading GLB model', error);
    }
);
// directional light
const directionalLight = new THREE.DirectionalLight(0xFFFFFF, 4);
directionalLight.position.set(-5, 20, -15);
directionalLight.castShadow = true;
const directionallightHelper = new THREE.DirectionalLightHelper(directionalLight, 1);
scene.add(directionalLight);
scene.add(directionallightHelper);
// ambient light
const ambientlight = new THREE.AmbientLight(0xFFFFFF, 0.5);
scene.add(ambientlight);






// ANDROID CONTROLS

const options = {
  zone: document.getElementById('joystick'),
  mode: 'static',
  position: { left: '50%', top: '50%' },
  color: 'blue',
};
const manager = nipplejs.create(options);
let xmov=0;let zmov=0;
// movement of camera logic
function moveCamera(force, angle) {
  xmov=camera.position.x+(Math.cos(angle)*force*0.05);
  if(xmov<30 && xmov>-30){
    camera.position.x=xmov;
  }
  zmov=camera.position.z-(Math.sin(angle)*force*0.05);
  if(zmov<30 && zmov>-30){
    camera.position.z=zmov;
  }
}
// rotation of camera logic
// Variables to handle touch and swipe interactions
let touchStartX = 0;
// Function to handle touch start event
function handleTouchStart(event) {
    touchStartX = event.touches[0].clientX;
}
let Yrotangle=0;
// Function to handle touch move event
function handleTouchMove(event) {
    const touchEndX = event.touches[0].clientX;
    const deltaX = touchEndX - touchStartX;
    // Adjust these sensitivity values based on how much you want the camera to move
    const sensitivityX = 0.001;
    // Update camera orientation based on swipe distance
    camera.rotation.y -= deltaX * sensitivityX;
    Yrotangle=camera.rotation.y;
    touchStartX = touchEndX;
}
// Event listeners for touch events
renderer.domElement.addEventListener('touchstart', handleTouchStart, false);
renderer.domElement.addEventListener('touchmove', handleTouchMove, false);
// Event listener for joystick movement
manager.on('move', (evt, data) => {
  const force = data.force;
  const angle = data.angle.radian;
  console.log(angle)
  // Call function to move the camera based on joystick input
  moveCamera(force, angle+Yrotangle);
  // that Yrotangle need to be added here as nipple js considers 0deg rotation
  // but when camera rotates around yaxis then we require to rotate whole cooridinate system 
  // of veiwer by same angle to calculate its exact position it is pointing at
});





if(window.innerWidth>1080){
// PC controls 
document.addEventListener('keydown',(event)=>{
  if(event.key==="w"){
    if(camera.position.z-0.5<30 && camera.position.z-0.5>-30){camera.position.z-=0.5}
  }else if(event.key==="s"){
    if(camera.position.z+0.5<30 && camera.position.z+0.5>-30){camera.position.z+=0.5}
  }else if(event.key==="a"){
    if(camera.position.x-0.5<30 && camera.position.x-0.5>-30){camera.position.x-=0.5}
  }else if(event.key==="d"){
    if(camera.position.x+0.5<30 && camera.position.x+0.5>-30){camera.position.x+=0.5}
  }
});
// Assuming 'camera' is your Three.js camera object
let isDragging = false;
let previousMousePosition = {
    x: 0,
    y: 0
};
// Add event listeners for mouse movements
window.addEventListener('mousedown', (event) => {
    isDragging = true;
    previousMousePosition = {
        x: event.clientX,
        y: event.clientY
    };
});
window.addEventListener('mouseup', () => {
    isDragging = false;
});
window.addEventListener('mousemove', (event) => {
    if (isDragging) {
        const deltaMove = {
            x: (event.clientX - previousMousePosition.x)*0.01,
            y: (event.clientY - previousMousePosition.y)*0.01
        };
        // Assuming 'camera' rotates around the y-axis
        camera.rotation.y += deltaMove.x;
        // Assuming 'camera' rotates around the x axis
        if(camera.rotation.x + deltaMove.y > -1.047 && camera.rotation.x+deltaMove.y <1.047)
        {camera.rotation.x+=deltaMove.y;} ;
        previousMousePosition = {
            x: event.clientX,
            y: event.clientY
        };
    }
});
}else{
  console.log('innerwidth is ' , window.innerWidth , ' so not capturing dom mouse keyboard events');
}


// ANIMATION LOOP
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();