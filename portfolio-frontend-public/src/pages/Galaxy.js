import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
 
const GalaxyCanvas = ({ projects }) => {
    const mountRef = useRef(null);
    const [traveling, setTraveling] = useState(false);
    const [selectedProject, setSelectedProject] = useState(null);
 
    const cameraRef = useRef(null);
    const controlsRef = useRef(null);
    const travelProgress = useRef(0);
    const starSpeedRef = useRef(0.3);
    const travelComplete = useRef(false); 
    const zoomingToPlanet = useRef(false);
    const cameraLocked = useRef(false);
    const zoomTarget = useRef(null);
    const zoomStartPos = useRef(null);
    const zoomStartTime = useRef(null);
 
    useEffect(() => {
        const rawList = Array.isArray(projects)
            ? projects
            : projects && projects['hydra:member']
            ? projects['hydra:member']
            : Object.values(projects || {});

        const projectList = (rawList || []).filter(p => p && typeof p === 'object');
        const validProjects = projectList.filter(p => p.title || p.name || (p.id !== undefined));
        if (!validProjects || validProjects.length === 0 || !mountRef.current) return;

        const projectsToUse = validProjects;
 
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
            projectList.forEach((project, idx) => {
                if (!project || typeof project !== 'object') {
                    return;
                }
                const geometry = new THREE.SphereGeometry(15, 32, 32);
                const color = new THREE.Color();
                color.setHSL(Math.random(), 0.8, 0.5);
 
                const material = new THREE.MeshStandardMaterial({
                    color: color,
                    emissive: color,
                    emissiveIntensity: 0.05,
                    metalness: 0.5,
                    roughness: 0.3,
                    flatShading: false
                });
 
                const mesh = new THREE.Mesh(geometry, material);
               
                const radius = 150;
                const totalProjects = projectList.filter(p => p && typeof p === 'object').length;
                const angleStep = Math.PI / Math.max(totalProjects + 1, 2);
                const angle = (idx + 1) * angleStep;
                
                const x = Math.cos(angle) * radius - radius / 2;
                const y = 0;
                const z = -Math.sin(angle) * radius - 100;
                
                mesh.position.set(x, y, z);
                mesh.userData = { project };

                const title = project.title || project.name || 'Untitled';
                scene.add(mesh);
                planets.push(mesh);
            });
 
            const light = new THREE.PointLight(0xffffff, 2.5, 1500);
            light.position.set(0, 0, 0);
            scene.add(light);
 
            const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
            scene.add(ambientLight);
 
            const dirLight = new THREE.DirectionalLight(0xffffff, 1.5);
            dirLight.position.set(50, 100, 100);
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

                    const offset = new THREE.Vector3(40, 10, 0);
                    const finalPos = targetPos.clone().add(offset);

                    zoomingToPlanet.current = true;
                    zoomTarget.current = planet;
                    zoomStartPos.current = currentCamPos;
                    zoomTarget.current.finalPosition = finalPos;
                    zoomTarget.current.lookAtPos = targetPos;
                    zoomStartTime.current = Date.now();
                    
                    const zoomTitle = planet.userData?.project?.title || planet.userData?.project?.name || 'Untitled';
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
                    const project = zoomTarget.current?.userData?.project;
                    if (project) {
                        setSelectedProject(project);
                    }
                    cameraLocked.current = true;
                    zoomingToPlanet.current = false;
                    if (controlsRef.current) {
                        controlsRef.current.enabled = false;
                    }
                    zoomTarget.current = null;
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

            if (travelComplete.current && controlsRef.current && !zoomingToPlanet.current && !cameraLocked.current) {
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

    const handleBackToPlanets = () => {
        setSelectedProject(null);
        cameraLocked.current = false;
        if (cameraRef.current && controlsRef.current) {
            controlsRef.current.enabled = true;
            const center = new THREE.Vector3();
            cameraRef.current.position.set(0, 0, 30);
            controlsRef.current.target.copy(center);
        }
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

            {selectedProject && (
                <div style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    zIndex: 20,
                    backgroundColor: "rgba(10, 31, 68, 0.95)",
                    color: "#fff",
                    padding: "3rem",
                    borderRadius: "20px",
                    maxWidth: "600px",
                    width: "90%",
                    maxHeight: "80%",
                    overflowY: "auto",
                    border: "2px solid rgba(0, 212, 255, 0.5)",
                    boxShadow: "0 10px 50px rgba(0, 0, 0, 0.5)"
                }}>
                    <button
                        onClick={handleBackToPlanets}
                        style={{
                            position: "absolute",
                            top: "1rem",
                            right: "1rem",
                            padding: "0.5rem 1.5rem",
                            backgroundColor: "transparent",
                            color: "#00d4ff",
                            border: "2px solid #00d4ff",
                            borderRadius: "50px",
                            cursor: "pointer",
                            fontSize: "1rem",
                            fontWeight: "bold",
                            transition: "all 0.3s"
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.backgroundColor = "rgba(0, 212, 255, 0.1)";
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.backgroundColor = "transparent";
                        }}
                    >
                        ← Retour aux planètes
                    </button>
                    
                    <h2 style={{ marginTop: "0", color: "#00d4ff" }}>{selectedProject.title}</h2>
                    <div style={{ marginTop: "1.5rem", lineHeight: "1.6" }}>{selectedProject.description}</div>
                    
                    {selectedProject.lien_git && (
                        <div style={{ marginTop: "1rem" }}>
                            <a 
                                href={selectedProject.lien_git} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                style={{
                                    color: "#00d4ff",
                                    textDecoration: "none",
                                    border: "1px solid #00d4ff",
                                    padding: "0.5rem 1rem",
                                    borderRadius: "8px",
                                    display: "inline-block",
                                    transition: "all 0.3s"
                                }}
                                onMouseEnter={(e) => {
                                    e.target.style.backgroundColor = "rgba(0, 212, 255, 0.2)";
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.backgroundColor = "transparent";
                                }}
                            >
                                🔗 Voir sur GitHub
                            </a>
                        </div>
                    )}
                    
                    {selectedProject.images && selectedProject.images.length > 0 && (
                        <div style={{ marginTop: "2rem" }}>
                            <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", marginTop: "1rem" }}>
                                {selectedProject.images.map((image, index) => (
                                    <img 
                                        key={index} 
                                        src={`http://localhost:8000/img_projects/${image.src}`} 
                                        alt={image.alt || selectedProject.title}
                                        style={{
                                            maxWidth: "300px",
                                            maxHeight: "200px",
                                            objectFit: "cover",
                                            borderRadius: "8px",
                                            border: "1px solid rgba(0, 212, 255, 0.5)"
                                        }}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                    
                    {selectedProject.competences && selectedProject.competences.length > 0 && (
                        <div style={{ marginTop: "2rem" }}>
                            <h3 style={{ color: "#00d4ff", fontSize: "1.2rem" }}>Compétences:</h3>
                            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginTop: "1rem" }}>
                                {selectedProject.competences.map(c => (
                                    <span key={c.id} style={{
                                        padding: "0.5rem 1rem",
                                        backgroundColor: "rgba(0, 212, 255, 0.2)",
                                        borderRadius: "20px",
                                        fontSize: "0.9rem",
                                        border: "1px solid rgba(0, 212, 255, 0.5)"
                                    }}>
                                        {c.name}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
 
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