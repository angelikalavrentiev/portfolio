import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { useEffect } from "react";

export default function Scene({ onReady }) {
  useEffect(() => {
    const manager = new THREE.LoadingManager();
    let called = false;
    const call = () => {
      if (!called && typeof onReady === "function") {
        called = true;
        onReady();
      }
    };
    manager.onLoad = () => {
      call();
    };
    const scene = new THREE.Scene();
    const fallback = setTimeout(() => {
      call();
    }, 3000);
    return () => {
      clearTimeout(fallback);
      manager.onLoad = null;
    };
  }, [onReady]);

  return null;
}
