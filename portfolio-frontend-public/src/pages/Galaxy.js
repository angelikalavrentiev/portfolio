import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const GalaxyCanvas = ({ projects }) => {
    const mountRef = useRef(null);
    const [traveling, setTraveling] = useState(false);
    const travelingRef = useRef(false);

    useEffect(() => {
        travelingRef.current = traveling;
    }, [traveling]);

    useEffect(() => {
        if (!projects || projects.length === 0 || !mountRef.current) return;

        let scene, camera, renderer, starGeo, stars;
        let animationId;
        const planets = [];
        const state = { cameraStopped: false }; 

        function init() {
            scene = new THREE.Scene();

            camera = new THREE.PerspectiveCamera(
                60, 
                mountRef.current.clientWidth / mountRef.current.clientHeight, 
                1, 
                1000
            );
            camera.position.z = 1;
            camera.rotation.x = Math.PI / 2;

            renderer = new THREE.WebGLRenderer({ antialias: true });
            renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);

            if (mountRef.current.children.length === 0) {
                mountRef.current.appendChild(renderer.domElement);
            }

            const starCount = 6000;
            const positions = new Float32Array(starCount * 3);
            const velocities = new Float32Array(starCount);
            const accelerations = new Float32Array(starCount); 

            for (let i = 0; i < starCount; i++) {
                positions[i * 3] = Math.random() * 2000 - 1000; // x
                positions[i * 3 + 1] = Math.random() * 2000 - 1000; // y
                positions[i * 3 + 2] = Math.random() * 2000 - 1000; // z
                velocities[i] = 0;
                accelerations[i] = 0.3; 
            }

            starGeo = new THREE.BufferGeometry();
            starGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

           
            const sprite = new THREE.TextureLoader().load('/star.png'); 
            const starMaterial = new THREE.PointsMaterial({
                color: 0xaaaaaa,
                size: 0.7,
                map: sprite,
                transparent: true,
                alphaTest: 0.5 
            });

            stars = new THREE.Points(starGeo, starMaterial);
            scene.add(stars);

            createPlanets();
            animate(velocities, accelerations);

            window.addEventListener("resize", onWindowResize);
        }

        function createPlanets() {
            
            projects.forEach((project, idx) => {
                const geometry = new THREE.SphereGeometry(15, 32, 32); 
                const material = new THREE.MeshStandardMaterial({ 
                    color: idx === 0 ? 0xff0000 : 0x00ff00, 
                    emissive: idx === 0 ? 0xff0000 : 0x00ff00,
                    emissiveIntensity: 0.5,
                    metalness: 0.3,
                    roughness: 0.4
                });
                const mesh = new THREE.Mesh(geometry, material);

                const x = idx % 2 === 0 ? -50 : 50;
                const y = 0;
                const z = -400 - idx * 80; 
                mesh.position.set(x, y, z);
                mesh.userData = { project };
                
                console.log(`  Planet ${idx}: "${project.title}" at (${x}, ${y}, ${z})`);
                
                scene.add(mesh);
                planets.push(mesh);
            });

          
            const light = new THREE.PointLight(0xffffff, 3, 1000); 
            light.position.set(0, 0, 0); 
            scene.add(light);

            const ambientLight = new THREE.AmbientLight(0xffffff, 1.5); 
            scene.add(ambientLight);

            const dirLight = new THREE.DirectionalLight(0xffffff, 1);
            dirLight.position.set(0, 100, 100);
            scene.add(dirLight);

            const raycaster = new THREE.Raycaster();
            const mouse = new THREE.Vector2();
            
            const onClick = (event) => {
                const rect = renderer.domElement.getBoundingClientRect();
                mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
                mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

                raycaster.setFromCamera(mouse, camera);
                const intersects = raycaster.intersectObjects(planets);
                
                if (intersects.length > 0) {
                    const planet = intersects[0].object;
                    alert(`Projet: ${planet.userData.project.title}\n${planet.userData.project.description}`);
                }
            };
            
            renderer.domElement.addEventListener("click", onClick);
        }

        function animate(velocities, accelerations) {
            const positions = starGeo.attributes.position.array;
            const starCount = velocities.length;

         
            if (travelingRef.current && !state.cameraStopped) {
                for (let i = 0; i < starCount; i++) {
                    velocities[i] += accelerations[i];
                    positions[i * 3 + 1] -= velocities[i];

                    if (positions[i * 3 + 1] < -1000) {
                        positions[i * 3 + 1] = 1000;
                        velocities[i] = 0;
                    }
                }

                starGeo.attributes.position.needsUpdate = true;

                const speed = camera.position.z > -60 ? 3 : 1;
                camera.position.z -= speed;
              
                if (camera.position.z <= -380) {
                    camera.position.z = -380;
                    state.cameraStopped = true;
                    new OrbitControls(camera, renderer.domElement);
                }
            }

            stars.rotation.y += 0.002;

            planets.forEach((planet) => {
                planet.rotation.y += 0.01;
            });

            renderer.render(scene, camera);
            animationId = requestAnimationFrame(() => animate(velocities, accelerations));
        }

        function onWindowResize() {
            if (!mountRef.current) return;
            camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
        }

        init();

        return () => {
            cancelAnimationFrame(animationId);
            window.removeEventListener("resize", onWindowResize);
            if (renderer) renderer.dispose();
            if (starGeo) starGeo.dispose();
            planets.forEach(p => {
                p.geometry?.dispose();
                p.material?.dispose();
            });
            if (mountRef.current) mountRef.current.innerHTML = '';
        };
    }, [projects]);

    return (
        <div style={{ 
            position: "relative", 
            width: "100%", 
            height: "80vh", 
            overflow: "hidden",
            backgroundColor: "#000"
        }}>
            <div
                ref={mountRef}
                style={{ width: "100%", height: "100%" }}
            />

            {!traveling && (
                <div
                    style={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        zIndex: 1,
                        cursor: "pointer",
                        padding: "10px 20px",
                        backgroundColor: "#000000ff",
                        color: "#fff",
                        border: "2px solid #fff",
                        borderRadius: "8px"
                    }}
                    onClick={() => setTraveling(true)}
                >
                    Explore the Galaxy
                </div>
            )}

            {traveling && (
                <div style={{
                    position: "absolute",
                    bottom: 20,
                    left: "50%",
                    transform: "translateX(-50%)",
                    color: "#fff",
                    fontSize: "14px",
                    textAlign: "center",
                    zIndex: 1,
                    backgroundColor: "rgba(0, 0, 0, 0.7)",
                    padding: "10px 20px",
                    borderRadius: "8px"
                }}>
                     Click on planets to discover projects 
                </div>
            )}
        </div>
    );
};

export default GalaxyCanvas;