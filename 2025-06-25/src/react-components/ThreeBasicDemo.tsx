import { useEffect, useId } from "react";
import * as THREE from "three";

export default function ThreeBasicDemo() {
  const elementId = useId();
  useEffect(() => {
    const element = document.querySelector(`#${elementId}`);
    if (element == null) {
      return;
    }
    const { width, height } = element.getBoundingClientRect();

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    element.append(renderer.domElement);

    const scene = new THREE.Scene();
    
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 2;

    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: "#433F81" });
    const cube = new THREE.Mesh(geometry, material);

    scene.add(cube);

    renderer.render(scene, camera);
  }, []);

  return <div id={elementId} className="size-36" />;
}
