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
Let’s talk about something small—but powerful.
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
3D isn’t just for experts — it’s a creative tool anyone can use. In this talk, I’ll convince you that building immersive web experiences is within your reach.
-->

---
layout: section
---

# Three.js

![Three.js logo](/three.js%20logo.svg){.w-30.absolute}

A JavaScript library for creating 3D graphics in the browser.

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

<!-- <img src="/geometry-normal-material.png"/>  -->

 <!-- <img src="/geometry-wireframe.png"/>  -->

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

---
title: UV Map
layout: image
image: /uv-map.png
backgroundSize: contain
---

<v-drag text-6xl pos="336,163,368,250">
UV Map
</v-drag>

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

# Three.js code

```tsx
const renderer = new THREE.WebGLRenderer();
renderer.setSize(width, height);
// document.querySelector("#canvas-container").appendChild(renderer.domElement);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);

const mesh = new THREE.Mesh();
mesh.geometry = new THREE.BoxGeometry();
mesh.material = new THREE.MeshStandardMaterial();

scene.add(mesh);

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

animate();
```

---
title: React-three-fiber
layout: section
---

# React-three-fiber (r3f)

![Three.js logo](/three.js%20logo.svg){.w-30.absolute}

React-three-fiber is a React renderer for three.js.

---
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

```jsx {monaco-run}
function A() {
  return <h1>Hi</h1>;
}
```

---

<Playground code="
import { OrbitControls, PerspectiveCamera } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
export default function App() {
  return (
    <Canvas>
      <ambientLight />
      <mesh>
        <boxGeometry />
        <meshStandardMaterial />
      </mesh>
    </Canvas>
  )
}
"/>

---
title: "Shit"
mdc: true
code: "import { OrbitControls, PerspectiveCamera } from '@react-three/drei'
  import { Canvas } from '@react-three/fiber'
  export default function App() {
  return (
  <Canvas>
  <ambientLight />
  <mesh>
  <boxGeometry />
  <meshStandardMaterial />
  </mesh>
  </Canvas>
  )
  }"
---

<!-- ::playgrounds{:code='["const a = 1", "const b = 2", "const c = a + b"]'}
:: -->

<!-- ::playgrounds{:code=`["const a = 1", "const b = 2", "const c = a + b"]`}
:: -->

::playgrounds{:code=`["export default function A(){ \n return <h1>hi</h1> }", "const b = 2", "const c = a + b"]`}
::

::playgrounds

---
code:
  - IconNuxt
  - description: Harness the full power of Nuxt and the Nuxt ecosystem.
  - title: Nuxt Architecture.
---

::

---
title: "Demo wow"
---

# Posts

<BrowserWrapper>
  <DemoIframe url="/demo/wow"></DemoIframe>
</BrowserWrapper>

---
title: "Import models"
---

```tsx
/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/

import { useGLTF } from "@react-three/drei";
import React, { useRef } from "react";

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
class: mix-blend-screen invert
---
