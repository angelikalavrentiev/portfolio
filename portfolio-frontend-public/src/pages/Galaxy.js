import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
 
const GalaxyCanvas = ({ projects }) => {
    const mountRef = useRef(null);
    const [traveling, setTraveling] = useState(false);
 
    const cameraRef = useRef(null);
    const controlsRef = useRef(null);
    const travelProgress = useRef(0);
    const starSpeedRef = useRef(0.3);
    const travelComplete = useRef(false); 
    const zoomingToPlanet = useRef(false);
    const zoomTarget = useRef(null);
    const zoomStartPos = useRef(null);
    const zoomStartTime = useRef(null);
 
    useEffect(() => {
        if (!projects || projects.length === 0 || !mountRef.current) return;
 
        let scene, renderer, starGeo, stars;
        let animationId;
        const planets = [];
 
        function init() {
            scene = new THREE.Scene();
 
            const camera = new THREE.PerspectiveCamera(
                60,
                mountRef.current.clientWidth / mountRef.current.clientHeight,
                1,
                2000
            );
            camera.position.set(0, 0, 1500);
            cameraRef.current = camera;
 
            renderer = new THREE.WebGLRenderer({ antialias: true });
            renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
 
            if (mountRef.current.children.length === 0) {
                mountRef.current.appendChild(renderer.domElement);
            }
 
            const starCount = 10000;
            const positions = new Float32Array(starCount * 3);
 
            for (let i = 0; i < starCount; i++) {
                positions[i * 3] = Math.random() * 2000 - 1000;
                positions[i * 3 + 1] = Math.random() * 2000 - 1000;
                positions[i * 3 + 2] = Math.random() * 2000 - 1000;
            }
 
            starGeo = new THREE.BufferGeometry();
            starGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
 
            const sprite = new THREE.TextureLoader().load('/star.png');
            const starMaterial = new THREE.PointsMaterial({
                color: 0xffffff,
                size: 1,
                map: sprite,
                alphaTest: 0.5,
                transparent: true
            });
 
            stars = new THREE.Points(starGeo, starMaterial);
            scene.add(stars);
 
            createPlanets();
            animate();
 
            window.addEventListener("resize", onWindowResize);
        }
 
        function createPlanets() {
            projects.forEach((project, idx) => {
                const geometry = new THREE.SphereGeometry(15, 26, 26);
                const color = new THREE.Color();
                color.setHSL(Math.random(), 1, 0.5);
 
                const material = new THREE.MeshStandardMaterial({
                    color: color,
                    emissive: color,
                    emissiveIntensity: 0.5,
                    metalness: 0.3,
                    roughness: 0.4
                });
 
                const mesh = new THREE.Mesh(geometry, material);
                const x = idx % 2 === 0 ? -80 : 80;
                const y = 0;
                const z = -200 - idx * 150;
                mesh.position.set(x, y, z);
                mesh.userData = { project };
 
                console.log(`Planet ${idx}: "${project.title}" at (${x}, ${y}, ${z})`);
                scene.add(mesh);
                planets.push(mesh);
            });
 
            const light = new THREE.PointLight(0xffffff, 3, 1500);
            light.position.set(0, 0, 0);
            scene.add(light);
 
            const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
            scene.add(ambientLight);
 
            const dirLight = new THREE.DirectionalLight(0xffffff, 1);
            dirLight.position.set(0, 100, 100);
            scene.add(dirLight);
 
            const raycaster = new THREE.Raycaster();
            const mouse = new THREE.Vector2();
 
            renderer.domElement.addEventListener("click", (event) => {
                if (!travelComplete.current || zoomingToPlanet.current) return;
 
                const rect = renderer.domElement.getBoundingClientRect();
                mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
                mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
 
                raycaster.setFromCamera(mouse, cameraRef.current);
                const intersects = raycaster.intersectObjects(planets);
                if (intersects.length > 0) {
                    const planet = intersects[0].object;
                    if (controlsRef.current) {
                        controlsRef.current.enabled = false;
                    }

                    const currentCamPos = cameraRef.current.position.clone();
                    const targetPos = planet.position.clone();

                    const direction = targetPos.clone().sub(currentCamPos).normalize();
      
                    const distance = currentCamPos.distanceTo(targetPos);

                    const finalPos = currentCamPos.clone().add(direction.multiplyScalar(distance - 20));

                    zoomingToPlanet.current = true;
                    zoomTarget.current = planet;
                    zoomStartPos.current = currentCamPos;
                    zoomTarget.current.finalPosition = finalPos;
                    zoomTarget.current.lookAtPos = targetPos;
                    zoomStartTime.current = Date.now();
                    
                    console.log(`Zooming vers: ${planet.userData.project.title}`);
                    console.log(`Distance: ${distance.toFixed(2)}, Final distance: 3`);
                }
            });
        }
 
        const travelDuration = 6000;
        let travelStartTime = null;
 
        function animate() {
            if (!cameraRef.current) return;

            if (traveling && !travelComplete.current) {
                if (!travelStartTime) {
                    travelStartTime = Date.now();
                }

                const elapsed = Date.now() - travelStartTime;
                const t = Math.min(elapsed / travelDuration, 1);
                travelProgress.current = t;

                if (t < 0.8) {
                    starSpeedRef.current = 0.3 + (t * 20);
                } else {
                    starSpeedRef.current = 20 * (1 - t) * 5;
                }

                const startZ = 2100;
                const endZ = 30;
                const easedT = easeInOutCubic(t);
                cameraRef.current.position.z = startZ + (endZ - startZ) * easedT;

        
                const center = new THREE.Vector3();
                planets.forEach(p => center.add(p.position));
                center.divideScalar(planets.length);
                cameraRef.current.lookAt(center);

                if (t >= 1) {
                    travelComplete.current = true;
                    travelStartTime = null;
                    starSpeedRef.current = 0.3;
                
                    const center = new THREE.Vector3();
                    planets.forEach(p => center.add(p.position));
                    center.divideScalar(planets.length);
                
                    if (!controlsRef.current) {
                        const controls = new OrbitControls(cameraRef.current, renderer.domElement);
                        controls.enableDamping = true;
                        controls.dampingFactor = 0.05;
                        controls.target.copy(center);
                        controls.minDistance = 5;
                        controls.maxDistance = 500;
                        controls.enablePan = true;
                        controlsRef.current = controls;
                    }
                }
            }

            if (zoomingToPlanet.current && zoomTarget.current) {
                const elapsed = Date.now() - zoomStartTime.current;
                const duration = 2000;
                const t = Math.min(elapsed / duration, 1);

                const easedT = easeInOutCubic(t);
                
                cameraRef.current.position.lerpVectors(
                    zoomStartPos.current, 
                    zoomTarget.current.finalPosition, 
                    easedT
                );
                
                cameraRef.current.lookAt(zoomTarget.current.lookAtPos);
        
                if (t >= 1) {
                    console.log(`Zoom terminé sur: ${zoomTarget.current.userData.project.title}`);
                }
            }

            const positions = starGeo.attributes.position.array;
            for (let i = 0; i < positions.length / 3; i++) {
                positions[i * 3 + 2] += starSpeedRef.current;
            
                if (positions[i * 3 + 2] > 1000) {
                    positions[i * 3 + 2] = -1000;
                    positions[i * 3] = Math.random() * 2000 - 1000;
                    positions[i * 3 + 1] = Math.random() * 2000 - 1000;
                }
            }
            starGeo.attributes.position.needsUpdate = true;

            if (!travelComplete.current) {
                stars.rotation.z += 0.0005;
            }

            planets.forEach(p => p.rotation.y += 0.01);

            if (travelComplete.current && controlsRef.current && !zoomingToPlanet.current) {
                controlsRef.current.update();
            }

            renderer.render(scene, cameraRef.current);
            animationId = requestAnimationFrame(animate);
        }
 
        function easeInOutCubic(t) {
            return t < 0.5
                ? 4 * t * t * t
                : 1 - Math.pow(-2 * t + 2, 3) / 2;
        }
 
        function onWindowResize() {
            if (!mountRef.current || !cameraRef.current || !renderer) return;
            cameraRef.current.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
            cameraRef.current.updateProjectionMatrix();
            renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
        }
 
        init();
 
        return () => {
            cancelAnimationFrame(animationId);
            window.removeEventListener("resize", onWindowResize);
            if (controlsRef.current) controlsRef.current.dispose();
            if (renderer) renderer.dispose();
            if (starGeo) starGeo.dispose();
            planets.forEach(p => {
                p.geometry?.dispose();
                p.material?.dispose();
            });
            if (mountRef.current) mountRef.current.innerHTML = '';
        };
    }, [projects, traveling]);
 
    const handleTravelClick = () => {
        setTraveling(true);
        travelProgress.current = 0;
        travelComplete.current = false; 
    };
 
    return (
        <div style={{
            position: "relative",
            width: "100%",
            height: "80vh",
            overflow: "hidden",
            backgroundColor: "#000"
        }}>
            <div ref={mountRef} style={{ width: "100%", height: "100%" }} />
 
            {!traveling && !travelComplete.current && (
                <button
                    style={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        zIndex: 10,
                        cursor: "pointer",
                        padding: "10px 20px",
                        backgroundColor: "rgba(0, 0, 0, 1)",
                        color: "#fff",
                        border: "2px solid #fff",
                        borderRadius: "12px",
                        fontSize: "20px",
                        fontWeight: "bold",
                        transition: "all 0.3s",
                        textShadow: "0 0 10px rgba(255,255,255,0.5)",
                        borderShadow: "0 0 10px rgba(255,255,255,0.5)",
                    }}
                    onMouseEnter={(e) => {
                        e.target.style.backgroundColor = "#fff";
                        e.target.style.color = "#000000ff";
                        e.target.style.transform = "translate(-50%, -50%) scale(1.01)";
                    }}
                    onMouseLeave={(e) => {
                        e.target.style.backgroundColor = "rgba(0, 0, 0, 1)";
                        e.target.style.color = "#fff";
                        e.target.style.transform = "translate(-50%, -50%) scale(1)";
                    }}
                    onClick={handleTravelClick}
                >
                    Explorez la galaxie
                </button>
            )}
 
            <style>{`
                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.7; }
                }
            `}</style>
        </div>
    );
};
 
export default GalaxyCanvas;