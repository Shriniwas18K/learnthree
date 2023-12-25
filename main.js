import * as THREE from 'three';
import {FirstPersonControls} from 'three/examples/jsm/Addons';
import nipplejs from 'nipplejs';
const scene=new THREE.Scene();
const camera= new THREE.PerspectiveCamera(
  75,window.innerWidth/window.innerHeight,
  1,1000
);
const renderer= new THREE.WebGLRenderer();
document.getElementById('app').appendChild(renderer.domElement);
renderer.setSize(window.innerWidth,window.innerHeight);
scene.add(new THREE.AxesHelper(27));
camera.position.set(0, 7.5, 15);
const planeGeometry = new THREE.PlaneGeometry(60, 60);
const planeMaterial = new THREE.MeshStandardMaterial({ color: 0x000000, side: THREE.DoubleSide });
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.rotation.set(-0.5 * Math.PI, 0, 0)
const gridHelper = new THREE.GridHelper(60);
scene.add(plane); scene.add(gridHelper);

if(window.innerWidth>1080){
// PC Controls
const controls=new FirstPersonControls(camera,renderer.domElement);
controls.constrainVertical=true
controls.verticalMax=Math.PI/2;
controls.movementSpeed=0.5;
controls.lookSpeed=0.001;
// controls.rollSpeed=0.001;
// controls.dragToLook=true;
function animate(){
  requestAnimationFrame(animate)
  controls.update(2)
  camera.position.y=7.5;
  renderer.render(scene,camera)
}animate()
}else{
  // ANDROID CONTROLS
  const options = {
    zone: document.getElementById('joystick'),
    mode: 'static',
    position: { left: '50%', top: '80%' },
    color: 'white',
  };
  if(screen.orientation.type==="landscape-primary"){
    options.position={ left:'15%' ,top:'50%'};
  }
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
  // Function to handle touch move event
  function handleTouchMove(event) {
      const touchEndX = event.touches[0].clientX;
      const deltaX = touchEndX - touchStartX;
      // Adjust these sensitivity values based on how much you want the camera to move
      const sensitivityX = 0.005;
      // Update camera orientation based on swipe distance
      camera.rotation.y -= deltaX * sensitivityX;
      touchStartX = touchEndX;
  }
  // Event listeners for touch events
  renderer.domElement.addEventListener('touchstart', handleTouchStart, false);
  renderer.domElement.addEventListener('touchmove', handleTouchMove, false);
  // Event listener for joystick movement
  manager.on('move', (evt, data) => {
    const force = data.force;
    const angle = data.angle.radian;
    // Call function to move the camera based on joystick input
    moveCamera(force, angle+camera.rotation.y);
    // that Yrotangle need to be added here as nipple js considers 0deg rotation
    // but when camera rotates around yaxis then we require to rotate whole cooridinate system 
    // of veiwer by same angle to calculate its exact position it is pointing at
  });  
function animate(){
  requestAnimationFrame(animate);
  renderer.render(scene,camera)
}animate()
}