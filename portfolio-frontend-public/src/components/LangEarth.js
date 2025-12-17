import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
 
const LangEarth = ({  }) => {

window.THREE = THREE; 
const w = window.innerWidth;
const h = window.innerHeight;

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(w, h); 
document.body.appendChild(renderer.domElement); 


const fov = 75; 
const aspect = w / h; 
const near = 0.1;
const far = 1000; 
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
camera.position.z = 2; 

const scene = new THREE.Scene();
scene.rotation.z = -23.4 * Math.PI / 180; 
new OrbitControls(camera, renderer.domElement);
const loader = new THREE.TextureLoader();
const geo = new THREE.IcosahedronGeometry(1, 12);
const mat = new THREE.MeshStandardMaterial({
    map: loader.load('earthmap1k.jpg'),
});
const cube = new THREE.Mesh(geo, mat); 
scene.add(cube);

const lightsMat = new THREE.MeshBasicMaterial({
    map: loader.load('earthlights1k.jpg'),
    blending: THREE.AdditiveBlending,
});
const lightsMesh = new THREE.Mesh(geo, lightsMat); 
scene.add(lightsMesh); 
const dirLight = new THREE.DirectionalLight(0xffffff, 1);
dirLight.position.set(-2, 0.5, 1.5);
scene.add(dirLight);

function animate(t = 0) { 
   requestAnimationFrame(animate);

   cube.rotation.y += 0.001;
   lightsMesh.rotation.y += 0.001;
   renderer.render(scene, camera); 
}

animate(); 
    return (<div></div>);
}

export default LangEarth;