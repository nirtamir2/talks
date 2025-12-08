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
  - slidev-addon-react
---

![](./nirtamir-animate.svg){.w-30.mt--10.mb-5}

<!--
Effortless 3D with react-three-fiber
-->

---
layout: center
---

# Effortless 3D with react-three-fiber

---
layout: section
---

# The WOW effect

<div class="text-2xl">Worth it every time</div>

<!--
The wow effect.

It’s that moment when someone sees your product and goes, ‘Whoa, that’s cool.’
It’s not because of a huge feature or complex logic—it’s usually something subtle.
A smooth transition. A tiny 3D touch. A shadow that reacts to the mouse.

It doesn’t take much.
But it feels like magic.
Because those little moments show that someone cared.
And that’s what makes people remember, engage, and fall in love with your product
-->

---
layout: section
---

# 3D

<div class="text-2xl">3D is one of the fastest ways to create that wow effect</div>

<!--
3D is one of the fastest ways to create that wow effect.
It’s visual, it’s interactive, and it immediately grabs attention.
Even something super simple—a rotating object, a subtle depth—can make your product stand out
-->

---
layout: section
---

# 3D is for everyone

<div class="text-2xl">Yes, even you — let’s make something that wows.</div>

<!--
There is myth that you need to be a special 3D low-level shaders master or 3D model editor in order to create 3D on the web. 

But 3D isn’t just for experts — it’s a creative tool anyone can use. In this talk, I’ll convince you that building immersive web experiences is within your reach.
-->

---
title: "About me"
layout: intro
glowSeed: 15
glowOpacity: 0.3
class: pl-25
---

# Nir Tamir

- Senior Frontend developer
- Loves open source and tooling
- <mdi-web /> [nirtamir.com](https://nirtamir.com)
<!-- - <mdi-github /> [@nirtamir2](https://github.com/nirtamir2) -->
- <mdi-twitter /> [@NirTamir](https://twitter.com/NirTamir)
<!-- - <mdi-linkedin /> [@nirtamir2](https://linkedin.com/in/nirtamir2) -->

<!--
My name is Nir. Nir Tamir.
I've been doing frontend for over a decade.
You can find more about me at nirtamir.com.
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
---

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

---
title: Three.js Geometries
layout: image
image: /geometries-demo.png
backgroundSize: contain
---

# Geometries

<!-- TODO: wireframe true -->

<!--
Here are some geometries with the same normal material. 
Cube Sphere Cylinder Torus Plane - Notice that they all ends with Geometry
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

```ts {1|3-5|7|9-10|12-14|16|18|all}
import * as THREE from "three";

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
```

<Transform v-drag="[610,136,305,286]">
  <React draggable is="ThreeBasicDemoPreview" />
</Transform>

<!--
So let's see what vanilla Three.js code looks like.
[click]
First, we create a WebGLRenderer - this creates a canvas element and handles all the low-level WebGL rendering.
[click]
Then we create a Scene - think of it as a container for everything in our 3D world.
[click]
We add a PerspectiveCamera to define our viewpoint.
[click]
Finally, we create a mesh by combining a BoxGeometry with a MeshBasicMaterial.
[click]
Then we need to add the mesh to the scene
[click]
and render it with our camera
[click]
Notice how verbose this is - we'll see how R3F simplifies this in a moment.
-->

---
title: React-three-fiber
layout: section
---

# React-three-fiber (r3f)

![Three.js logo](/three.js%20logo.svg){.w-30.absolute}

React-three-fiber is a React renderer for three.js.

<!--
So we've seen Three.js - it's powerful but verbose.
This is where react-three-fiber comes in.
R3F is a React renderer for Three.js - which means it uses React's reconciliation to manage your 3D scene.
Instead of imperatively creating objects and adding them to the scene, you declare what you want using JSX.
It handles all the setup boilerplate and gives you React's component model for free.
-->

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

```tsx sandpack index=0
import { OrbitControls } from "@react-three/drei";
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
import { OrbitControls } from "@react-three/drei";
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
import { OrbitControls } from "@react-three/drei";
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
import { OrbitControls } from "@react-three/drei";
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

<!--
Here’s the same example, but written with React Three Fiber.

<Canvas> replaces all the setup code — the renderer, the scene, the render loop — it’s all handled for us.

Inside it, we add `<OrbitControls />` so the user can rotate and zoom with the mouse.

Then we create a <mesh> with a box geometry and a Matcap material, just like in Three.js, but here we write it as JSX.

[move]

I've added an axesHelper - the red line is X, green is Y, blue is Z.
Notice the mesh has position, scale, and rotation properties.
Position moves it in 3D space - [x, y, z].
Scale changes its size - [1, 1, 1] is normal size.
Rotation turns it - measured in radians, not degrees.
Play with these values to get a feel for 3D coordinates.

[click]

Now let's understand 3D space better.
I've added an axesHelper - the red line is X, green is Y, blue is Z.
Notice the mesh has position, scale, and rotation properties.
Position moves it in 3D space - [x, y, z].
Scale changes its size - [1, 1, 1] is normal size.
Rotation turns it - measured in radians, not degrees.
Play with these values to get a feel for 3D coordinates.

[click]
Now we're seeing React's real power.
I've extracted the box into its own component.
This lets us reuse it - see how we render two boxes at different positions?
The Box component also has state - it tracks hover and active states.
Click a box to scale it up. Hover to change its color.
This is the magic of R3F - 3D objects behave like React components with props, state, and events.

[click]
Let's add animation.
useFrame is R3F's animation hook - it runs every frame, about 60 times per second.
We get delta, which is the time since the last frame.
By rotating the box by delta each frame, we get smooth, frame-rate-independent animation.
The ref gives us access to the actual Three.js mesh object.
This is how you create any animation in R3F - update values in useFrame.
-->

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

# What if I want something cooler than a box?

- נעל / מקבוק מודל תלת מימדי

---

# GLTF!

<BrowserWrapper title="sketchfab.com">
  <DemoIframe url="https://sketchfab.com/3d-models/rubiks-cube-4cc7c1bf585f4b929ddd32f6cab3ba58"></DemoIframe>
</BrowserWrapper>

---

# So how do I use gltf in React?

<BrowserWrapper title="gltf.pmnd.rs">
  <DemoIframe url="https://gltf.pmnd.rs/"></DemoIframe>
</BrowserWrapper>

<!--
Of course, you don't have to model everything from primitives.
You can import models created in Blender, Maya, or other 3D software.
The standard format is GLTF - think of it as the JPEG of 3D.
The gltfjsx tool converts GLTF files into React components automatically.
It parses the model and generates code with all the meshes, materials, and hierarchies.
Visit gltf.pmnd.rs to try it yourself - drag any GLTF file and get React code instantly.

להציג מודל נעל
-->

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

<!--
Now for something really cool - physics.
React-three/rapier brings realistic physics to your 3D scenes.
Wrap objects in RigidBody components and they become physical objects.
They'll fall, collide, bounce - all automatically.

[click]

The colliders property tells Rapier the shape for collision detection.
'cuboid' for boxes, 'ball' for spheres, 'trimesh' for complex meshes.
The debug mode shows the collision shapes - turn it off for production.
Watch what happens when these objects fall and hit the ground.

[click]
Now if we change the Sphere collider to from ball to cuboid the physics engine will treat it like a cube. (DEMO)
-->

---
title: "Demo wow"
---

# Demo

<BrowserWrapper>
  <DemoIframe url="https://play.nirtamir.com"></DemoIframe>
</BrowserWrapper>

<!--
This is a model of myself that I built, using the same principles

Here's a more complete example of what you can build.
This uses everything we've covered - models, materials, physics, interactivity.
The key insight is that each of these effects is just a few lines of code.
You don't need to be a graphics programmer or a 3D artist.
You just need to understand the building blocks we've covered today.
-->

---

So that's it! You now know:

- The core Three.js concepts: scene, camera, mesh, geometry, material
- How R3F makes it declarative with React components
- How to add interactivity with events and state
- How to animate with useFrame
- How to add physics with Rapier
- How to import 3D models

---
layout: section
---

# The best way to learn is by doing.

<!--

Start small - make a rotating cube. [TODO: slide of just a box]
Add some interaction. [TODO: slide of just a box rotating]
Import a model and before you know it, you'll be creating those wow moments. [TODO: slide of just a rubik cube rotating]
-->

# Go build stuff

---
layout: intro
class: text-center pb-5
glowX: 50
glowY: 120
---

<h1 class="text-4xl">
Thank you!
</h1>

<div class="my-4">
<p>Slides: <b><a href="https://nirtamir.com">nirtamir.com</a></b></p>
</div>

<QRCode class="m-auto w-40 mix-blend-lighten" text="https://talks.nirtamir.com/2025/react-next/"/>

<div class="mt-8 text-sm opacity-75">
<p>Questions? Find me after or at nirtamir.com</p>
</div>

<!--
Thank you for your time!
The slides are available at nirtamir.com
I'm happy to answer questions after the talk or you can reach me through my website.
-->

---
layout: end
---
