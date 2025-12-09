Effortless 3D with react-three-fiber

My name is Nir. Nir Tamir. I've been doing frontend for over a decade. You can find more about me at
nirtamir.com.

The wow effect.
It’s that moment when someone sees your product and goes, ‘Whoa, that’s cool.
’ It’s not because of a
huge feature or complex logic—it’s usually something subtle. A smooth transition. A tiny 3D touch. A
shadow that reacts to the mouse.
It doesn’t take much. But it feels like magic. Because those little moments show that someone cared. And
that’s what makes people remember, engage, and fall in love with your product

3D is one of the fastest ways to create that wow effect. It’s visual, it’s interactive, and it immediately grabs
attention. Even something super simple—a rotating object, a subtle depth—can make your product stand
out

There is myth that you need to be a special 3D low-level shaders master or 3D model editor in order to
create 3D on the web.
But 3D isn’t just for experts — it’s a creative tool anyone can use. In this talk, I’ll convince you that building
immersive web experiences is within your reach.

We are going to use Three.js - which is a JavaScript library for creating 3D graphics in the browser. It's
not a low-level WebGL or WebGPU

Most Three.js apps have the same core elements.
First we need have a Renderer that handles rendering your 3D scene in the browser using WebGL (a low-
level graphics API built into browsers). (or WebGPU).
Then inside the render we have a Scene - which is like the stage to play - it’s the space where all your 3D
objects, lights, and cameras live.
The Camera is like the eyes of the viewer — it defines what part of the 3D scene is visible and how it’s
projected onto the 2D screen.
Then we can have Light - so we won't have everything dark
and we have Meshes - which are the 3D object you actually see

Mesh is made of:
➕ Geometry (the shape) - It defines the vertices (points in space), faces (triangles built from those
points) and the overal shape (cube, sphere, model...)
🎨 Material (the look)
This is the “skin” that wraps the geometry.
It controls: • Color • Shininess • Transparency • Texture maps • How it reacts to light

Here are some geometries with the same normal material. Cube Sphere Cyliner Torus Plane - Notice that
they all ends with Geometry

🎨 Material (the look)
This is the “skin” that wraps the geometry.
It controls: • Color • Shininess • Transparency • Texture maps • How it reacts to light
Here on the left we have some materials that does not react to light and on the right it do affected by
light. I colored the materials in green color.
sometimes. A UV map is how a 2D image (like a
texture) gets wrapped onto a 3D model — it’s like saying: 🧊 “Which part of the image should go on
which part of the 3D object?”

So let's see what vanilla Three.js code looks like. First, we create a WebGLRenderer - this creates a canvas
element and handles all the low-level WebGL rendering. Then we create a Scene - think of it as a
container for everything in our 3D world. We add a PerspectiveCamera to define our viewpoint. Finally,
we create a mesh by combining a BoxGeometry with a MeshBasicMaterial. Notice how verbose this is -
we'll see how R3F simplifies this in a moment.

So we've seen Three.js - it's powerful but verbose. This is where react-three-fiber comes in. R3F is a React
renderer for Three.js - which means it uses React's reconciliation to manage your 3D scene. Instead of
imperatively creating objects and adding them to the scene, you declare what you want using JSX. It
handles all the setup boilerplate and gives you React's component model for free.

ve added an axesHelper - the red line is X, green is Y, blue is Z.
Notice the mesh has position, scale, and rotation properties. Position moves it in 3D space - [x, y, z]. Scale
changes its size - [1, 1, 1] is normal size. Rotation turns it - measured in radians, not degrees. Play with
these values to get a feel for 3D coordinates.

Now let's understand 3D space better. I've added an axesHelper - the red line is X, green is Y, blue is Z.
Notice the mesh has position, scale, and rotation properties. Position moves it in 3D space - [x, y, z]. Scale
changes its size - [1, 1, 1] is normal size. Rotation turns it - measured in radians, not degrees. Play with
these values to get a feel for 3D coordinates.

Now we're seeing React's real power. I've extracted the box into its own component. This lets us
reuse it - see how we render two boxes at different positions? The Box component also has state - it
tracks hover and active states. Click a box to scale it up. Hover to change its color. This is the magic of
R3F - 3D objects behave like React components with props, state, and events.

Let's add animation. useFrame is R3F's animation hook - it runs every frame, about 60 times per
second. We get delta, which is the time since the last frame. By rotating the box by delta each frame, we
get smooth, frame-rate-independent animation. The ref gives us access to the actual Three.js mesh
object. This is how you create any animation in R3F - update values in useFrame.

Of course, you don't have to model everything from primitives. You can import models created in
Blender, Maya, or other 3D software. The standard format is GLTF - think of it as the JPEG of 3D. The
gltfjsx tool converts GLTF files into React components automatically. It parses the model and generates
code with all the meshes, materials, and hierarchies. Visit gltf.pmnd.rs to try it yourself - drag any GLTF
file and get React code instantly.

Now for something really cool - physics. React-three/rapier brings realistic physics to your 3D scenes.
Wrap objects in RigidBody components and they become physical objects. They
'll fall, collide, bounce -
all automatically. The colliders property tells Rapier the shape for collision detection. 'cuboid' for boxes,
'ball' for spheres, 'trimesh' for complex meshes. The debug mode shows the collision shapes - turn it off
for production. Watch what happens when these objects fall and hit the ground.

Here's a more complete example of what you can build. This uses everything we've covered - models,
materials, physics, interactivity. The key insight is that each of these effects is just a few lines of code. You
don't need to be a graphics programmer or a 3D artist. You just need to understand the building blocks
we've covered today.

So that's it! You now know:
The core Three.js concepts: scene, camera, mesh, geometry, material
How R3F makes it declarative with React components
How to add interactivity with events and state
How to animate with useFrame
How to add physics with Rapier
How to import 3D models
The best way to learn is by doing. Start small - make a rotating cube. Add some interaction. Import a
model. Before you know it, you'll be creating those wow moments.
