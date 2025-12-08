import { any as ts } from "code-tag";
import FilesPlaygroundJS from "./FilesPlaygroundJS";

export default function ThreeBasicDemoPreview() {
  return (
    <FilesPlaygroundJS
      files={[
        {
          "/index.ts": {
            code: ts`
import "./styles.css":
import * as THREE from "three";
const width = window.innerWidth;
const height = window.innerHeight;
const element = document.body;


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
    
    `,
          },
        },
      ]}
    />
  );
}
