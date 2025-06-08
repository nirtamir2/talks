---
highlighter: shiki
css: unocss
colorSchema: dark
transition: fade-out
mdc: true
layout: center
glowSeed: 4
lang: en-US
title: "Effortless 3D with react-three-fiber"
addons:
  - slidev-component-zoom
---

![](./nirtamir-animate.svg){.w-30.mt--10.mb-5}

---
layout: center
---

# Effortless 3D with react-three-fiber

---
title: About me
layout: image-right
image: ./nirtamir.png
---

# Nir Tamir

- Senior Frontend developer
- Loves open source and tooling
- <mdi-web /> [nirtamir.com](https://nirtamir.com)

<!--
Before we dive in, let me introduce myself. I'm Nir Tamir, and I'm doing frontend development for the last decade.
-->

---
layout: section
---

# The WOW effect

<!--
The wow effect.

It’s that moment when someone sees your product and goes, ‘Whoa, that’s cool.’
It’s not because of a huge feature or complex logic—it’s usually something subtle.
A smooth transition. A tiny 3D touch. A shadow that reacts to the mouse.

It doesn’t take much.
But it feels like magic.
Because those little moments show that someone cared.
And that’s what makes people remember, engage, and fall in love with your product -->

<div v-click class="text-2xl">Worth it every time</div>

---
layout: section
---

# 3D

<div v-click class="text-2xl">3D is one of the fastest ways to create that wow effect</div>

<!--
3D is one of the fastest ways to create that wow effect.
It’s visual, it’s interactive, and it immediately grabs attention.
Even something super simple—a rotating object, a subtle depth—can make your product stand out
-->

---
layout: section
---

# 3D is for everyone

<div v-click class="text-2xl">Yes, even you — let’s make something that wows.</div>

<!--
There is myth that you need to be a special 3D low-level shaders master or 3D model editor in order to create 3D on the web. 

But 3D isn’t just for experts — it’s a creative tool anyone can use. In this talk, I’ll convince you that building immersive web experiences is within your reach.
-->

---
layout: section
---

# Three.js

![Three.js logo](/three.js%20logo.svg){.w-30.absolute}

A JavaScript library for creating 3D graphics in the browser.

<!--
We are going to use Three.js - which is a JavaScript library for creating 3D graphics in the browser. It's not a low-level WebGL or WebGPU
-->

---
layout: image
image: /three-js-main.png
backgroundSize: contain
title: Three.js structure original
hide: true
---

---
layout: image
image: /three-js-main-figma.svg
backgroundSize: calc(100%-5rem) calc(100%-5rem)
title: Three.js structure
---

<!--
Most Three.js apps have the same core elements.

First we need have a Renderer that handles rendering your 3D scene in the browser using WebGL (a low-level graphics API built into browsers). (or WebGPU).

Then inside the render we have a **Scene** - which is like the stage to play -  it’s the space where all your 3D objects, lights, and cameras live.

The **Camera** is like the eyes of the viewer — it defines what part of the 3D scene is visible and how it’s projected onto the 2D screen.

Then we can have **Light** - so we won't have everything dark

and we have **Meshes** - which are the 3D object you actually see
-->

---
hide: true
title: Three.js structure animate from docs
---

<v-switch>
  <template #0> <img src="/structure/1.svg"/> </template>
  <template #1> <img src="/structure/2.svg"/> </template>
  <template #2> <img src="/structure/3.svg"/> </template>
  <template #3> <img src="/structure/4.svg"/> </template>
</v-switch>

---
hide: true
title: Three.js structure
layout: image
image: /threejs-structure.svg
backgroundSize: contain
class: p-10
---

---
hide: true
title: Three.js Meshe
layout: image
image: /three.js mesh.png
backgroundSize: contain
class: mix-blend-screen hue-rotate-180 contrast-180
---

---
title: Three.js Meshe
dragPos:
  foo: 459,48,83,44
---

<!--
Mesh is made of:

➕ Geometry (the shape) -
It defines the vertices (points in space), faces (triangles built from those points) and the overal shape (cube, sphere, model...)


🎨 Material (the look)

This is the “skin” that wraps the geometry.

It controls:
	•	Color
	•	Shininess
	•	Transparency
	•	Texture maps
	•	How it reacts to light


  -->

<Transform v-drag="[469,239,349,326]" pos="" >
 <img src="/material-normal.png" />
</Transform>

<Transform v-drag="[247,239,292,317]" pos="" >
 <img src="/material-normal-wireframe.png"/>
</Transform>

<v-drag text-6xl pos="444,19,83,44">
Mesh
</v-drag>

<v-drag text-2xl pos="329,248,118,40">
Geometry
</v-drag>

<v-drag text-2xl pos="589,251,97,40">
Material
</v-drag>

<v-drag-arrow pos="470,100,-80,120"/>

<v-drag-arrow pos="550,100,70,120"/>

---
title: Three.js Geometries
layout: image
image: /geometries-demo.png
backgroundSize: contain
---

# Geometries

<!-- TODO: wireframe true -->

<!--
Here are sone geometries with the same normal material. 
Cube Sphere Cyliner Torus Plane - Notice that they all ends with Geometry
-->

---
hide: true
title: Three.js Geometries
---

<!-- <img src="/geometry-normal-material.png"/>  -->

 <!-- <img src="/geometry-wireframe.png"/>  -->

<Transform v-drag pos="" >
 <img src="/geometries-normal.png" />
</Transform>

<v-drag text-6xl pos="444,19,83,44">
Mesh
</v-drag>

<v-drag text-xl pos="329,248,118,40">
Geometry
</v-drag>

<v-drag text-xl pos="589,251,97,40">
Material
</v-drag>

<v-drag text-xl pos="589,251,97,40">
Sphere
</v-drag>

---
hide: true
title: Three.js Geometries vs Material
layout: image
image: /material-geometry.png
backgroundSize: contain
---

<v-drag text-6xl pos="444,200,150,250">
Geometry
</v-drag>

---
title: Three.js Materials
layout: image
image: /materials-demo.png
backgroundSize: contain
---

# Materials

<!--
🎨 Material (the look)

This is the “skin” that wraps the geometry.

It controls:
	•	Color
	•	Shininess
	•	Transparency
	•	Texture maps
	•	How it reacts to light

  Here on the left we have some materials that does not react to light and on the right it do affected by light. I colored the materials in green color.
-->

---
title: UV Map
layout: image
image: /uv-map.png
backgroundSize: contain
---

<v-drag text-6xl pos="336,163,368,250">
UV Map
</v-drag>

<div class="text-black text-[8px] absolute bottom-10 right-10">
"UV Mapping Example" by Tschmits, licensed under CC BY-SA 3.0 / GFDL.
</div>

<!--
For materials we can have the concept of UV Map sometimes.
A UV map is how a 2D image (like a texture) gets wrapped onto a 3D model — it’s like saying:
🧊 “Which part of the image should go on which part of the 3D object?”
-->

---
hide: true
title: Three.js Geometries
layout: image
image: /three.js geometries.png
backgroundSize: contain
class: mix-blend-screen hue-rotate-180 contrast-180
---

---
hide: true
title: Three.js Materials
layout: image
image: /three.js materials.png
backgroundSize: contain
# class: mix-blend-screen hue-rotate-180 contrast-180
---

---
monacoRunAdditionalDeps:
  - three
---

# Three.js code

```ts {monaco-run}
import * as THREE from "three";

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000,
);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: "#433F81" });
const cube = new THREE.Mesh(geometry, material);

scene.add(cube);

const render = function () {
  requestAnimationFrame(render);
  cube.rotation.y += 0.01;
  renderer.render(scene, camera);
};

render();
```

<!--
So let's see how Three.js code looks like.
We create a WebGLRenderer, which set a canvas and we append it to the dom.
Then we create a scene with a camera and then we create a mesh with Box geometry and normal material
-->

---
title: React-three-fiber
layout: section
---

# React-three-fiber (r3f)

![Three.js logo](/three.js%20logo.svg){.w-30.absolute}

React-three-fiber is a React renderer for three.js.

---
hide: true
title: React Reconciler & Renderer
layout: image
image: /reconciler-renderer.png
backgroundSize: contain
class: mix-blend-screen invert hue-rotate-180 contrast-150
---

<!--
https://www.youtube.com/watch?v=ZCuYPiUIONs
-->

---
hide: true
title: React
layout: image
image: /fiber-in-react.png
backgroundSize: contain
class: mix-blend-screen invert hue-rotate-180 contrast-150
# hide: true
---

<!--
https://www.youtube.com/watch?v=ZCuYPiUIONs
-->

---
layout: two-cols-header-gap
hide: true
---

# Basic example

::left::

```tsx
export default function App() {
  return (
    <Canvas>
      <ambientLight />
      <mesh>
        <boxGeometry />
        <meshStandardMaterial />
      </mesh>
    </Canvas>
  );
}
```

::right::

<BrowserWrapper>
  <DemoIframe url="/demo/basic" />
</BrowserWrapper>

---

@@@

```tsx sandpack index=0 {1}
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
export default function App() {
  return (
    <Canvas>
      <OrbitControls />
      <mesh>
        <boxGeometry args={[1, 1, 1]} />
        <meshMatcapMaterial color={"#0066CC"} />
      </mesh>
    </Canvas>
  );
}
```

```tsx sandpack index=1
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
export default function App() {
  return (
    <Canvas>
      <OrbitControls />
      <axesHelper />
      <mesh position={[0, 0, 0]} scale={[1, 1, 1]} rotation={[0, 0, 0]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshMatcapMaterial color={"#0066CC"} />
      </mesh>
    </Canvas>
  );
}
```

```tsx sandpack index=2 file="App.tsx"
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { Box } from "./Box";
import { Canvas } from "@react-three/fiber";
export default function App() {
  return (
    <Canvas>
      <OrbitControls />
      <Box position={[-1.2, 0, 0]} />
      <Box position={[1.2, 0, 0]} />
    </Canvas>
  );
}
```

```tsx sandpack index=2 file="Box.tsx"
import type { ThreeElements } from "@react-three/fiber";
import { useState } from "react";

export function Box(props: ThreeElements["mesh"]) {
  const [hovered, setHover] = useState(false);
  const [active, setActive] = useState(false);

  return (
    <mesh
      {...props}
      scale={active ? 1.5 : 1}
      onClick={() => setActive(!active)}
      onPointerOver={() => setHover(true)}
      onPointerOut={() => setHover(false)}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshMatcapMaterial color={hovered ? "#0066CC" : "#FF5733"} />
    </mesh>
  );
}
```

```tsx sandpack index=3 file="App.tsx"
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { Box } from "./Box";
import { Canvas } from "@react-three/fiber";
export default function App() {
  return (
    <Canvas>
      <OrbitControls />
      <Box position={[-1.2, 0, 0]} />
      <Box position={[1.2, 0, 0]} />
    </Canvas>
  );
}
```

```tsx sandpack index=3 active file="Box.tsx"
import type { ThreeElements } from "@react-three/fiber";
import { useFrame } from "@react-three/fiber";
import { useRef, useState } from "react";

export function Box(props: ThreeElements["mesh"]) {
  const meshRef = useRef<ThreeElements["mesh"]>(null!);

  useFrame((state, delta) => {
    meshRef.current.rotation.x += delta;
  });

  return (
    <mesh {...props} ref={meshRef}>
      <boxGeometry args={[1, 1, 1]} />
      <meshMatcapMaterial color={"#FF5733"} />
    </mesh>
  );
}
```

@@@

---
title: "Import models"
hide: true
---

# Import models

```tsx
/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/

import { useGLTF } from "@react-three/drei";
import React from "react";

export function Model(props) {
  const { nodes, materials } = useGLTF("/suzanne.gltf");
  return (
    <group {...props} dispose={null}>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Suzanne.geometry}
        material={nodes.Suzanne.material}
        position={[0, 0.189, -0.043]}
      />
    </group>
  );
}

useGLTF.preload("/suzanne.gltf");
```

---
hide: true
title: Suzanne
layout: image
image: /suzanne.png
backgroundSize: contain
class: p-10 mix-blend-screen invert
---

---
title: Suzanne Iframe
layout: iframe
url: https://gltf.pmnd.rs/
hide: true
---

---
title: Suzanne Iframe
layout: full
url: https://gltf.pmnd.rs/
---

# Import models

<BrowserWrapper title="gltf.pmnd.rs">
  <DemoIframe url="https://gltf.pmnd.rs/"></DemoIframe>
</BrowserWrapper>

---
title: "Physics"
---

# Physics

@@@

```tsx sandpack index=0
import { OrbitControls, Sphere, Torus } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { CuboidCollider, Physics, RigidBody } from "@react-three/rapier";

export default function App() {
  return (
    <Canvas>
      <OrbitControls />
      <Physics debug>
        <RigidBody colliders="cuboid" rotation={[Math.PI / 4, Math.PI / 4, 0]}>
          <mesh>
            <boxGeometry args={[1, 1, 1]} />
            <meshMatcapMaterial color={"#0066CC"} />
          </mesh>
        </RigidBody>
        <CuboidCollider position={[0, -2, 0]} args={[20, 0.5, 20]} />
      </Physics>
    </Canvas>
  );
}
```

```tsx sandpack index=1 file="MyBox.tsx"
import { RigidBody, RigidBodyProps } from "@react-three/rapier";

export function MyBox(props: RigidBodyProps) {
  return (
    <RigidBody {...props} colliders="cuboid">
      <mesh>
        <boxGeometry args={[1, 1, 1]} />
        <meshMatcapMaterial color={"#0066CC"} />
      </mesh>
    </RigidBody>
  );
}
```

```tsx sandpack index=1 file="MySphere.tsx"
import { RigidBody, RigidBodyProps } from "@react-three/rapier";

export function MySphere(props: RigidBodyProps) {
  return (
    <RigidBody {...props} colliders="ball">
      <mesh>
        <sphereGeometry />
        <meshMatcapMaterial color={"#FF5733"} />
      </mesh>
    </RigidBody>
  );
}
```

```tsx sandpack index=1 file="MyThorus.tsx"
import { RigidBody, RigidBodyProps } from "@react-three/rapier";

export function MyThorus(props: RigidBodyProps) {
  return (
    <RigidBody {...props} colliders="trimesh">
      <mesh>
        <torusGeometry />
        <meshMatcapMaterial color={"#50C878"} />
      </mesh>
    </RigidBody>
  );
}
```

```tsx sandpack index=1 file="App.tsx"
import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { CuboidCollider, Physics } from "@react-three/rapier";
import { MyBox } from "./MyBox";
import { MySphere } from "./MySphere";
import { MyThorus } from "./MyThorus";

export default function App() {
  return (
    <Canvas>
      <OrbitControls />
      <Physics debug>
        <MyBox rotation={[Math.PI / 4, Math.PI / 4, 0]} />
        <MySphere position={[0, 10, 0]} />
        <MyThorus position={[2, 0, 0]} />
        <CuboidCollider position={[0, -2, 0]} args={[20, 0.5, 20]} />
      </Physics>
    </Canvas>
  );
}
```

@@@

---
title: "Demo wow"
---

# Demo

<BrowserWrapper>
  <DemoIframe url="/demo/wow"></DemoIframe>
</BrowserWrapper>

---
layout: section
---

# Go build stuff

---
layout: center
---

# [nirtamir.com](https://www.nirtamir.com)

---
layout: end
---
