import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { useEffect, useRef } from "react";

function MyThree() {
  const refContainer = useRef(null);
  useEffect(() => {
    // === Setup the scene camera and renderer ===
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.01, 10000);
    var renderer = new THREE.WebGLRenderer();

    const controls = new OrbitControls(camera, renderer.domElement)

    // Class for simple box geometry objects with specific charasteristics
    class Box extends THREE.Mesh {
      constructor({width, height, depth, color='#00ff00', velocity = {x:0,y:0,z:0}, position= {x:0,y:0,z:0} }) {
        super(
          new THREE.BoxGeometry(width, height, depth),
          new THREE.MeshStandardMaterial({ color }));
          
          this.width = width
          this.height = height
          this.depth = depth

          this.position.set(position.x, position.y, position.z)
          this.bottom = this.position.y - this.height / 2;
          this.top = this.position.y + this.height / 2; 

          this.velocity = velocity
          this.gravity = -0.002
        }
        update(group) {
          this.bottom = this.position.y - this.height / 2;
          this.top = this.position.y + this.height / 2; 
          this.position.x += this.velocity.x;
          this.position.z += this.velocity.z;
          this.applyGravity(); 
        }

        applyGravity() {
          this.velocity.y += this.gravity
          
          //This is where we hit the ground
          if (this.bottom + this.velocity.y <= ground.top){
            this.velocity.y *= 0.7;
            this.velocity.y = -this.velocity.y;
          
          } else this.position.y += this.velocity.y
        }
    }

    // Setup renderer
    renderer.shadowMap.enabled = true;
    renderer.setSize(window.innerWidth, window.innerHeight);
    refContainer.current && refContainer.current.appendChild( renderer.domElement );

    //Create a Cube
    const cube = new Box({
      width: 1, 
      height: 1,
      depth: 1,
      color: '#11c25f',
      velocity: {
        x:0,
        y:-0.01,
        z: 0
      }
    });
    //Show and apply shadows
    cube.castShadow = true;
    scene.add(cube);

    //Create a ground 
    const ground = new Box({
      width: 20,
      height: 0.5,
      depth: 20,
      color: '#577767',
      position: {
        x: 0,
        y:-2,
        z: 0
      }
    });
    //Show and apply shadows
    ground.receiveShadow = true;
    scene.add(ground);

    //Add lights
    const light = new THREE.DirectionalLight(0xffffff,3, 100)
    light.position.y = 2;
    light.position.z = 3;
    //Show and apply shadows
    light.castShadow = true;
    scene.add(light);

    //Set camera position
    camera.position.y = 5;
    camera.rotation.x = -0.5;

    //Add key status
    const keys = {
      a: {
        pressed: false
      },
      d: {
        pressed: false
      },
      w: {
        pressed: false
      },
      s: {
        pressed: false
      }
    }

    //Add controlsnpm
    window.addEventListener('keydown', (event) =>{
      switch(event.code) {
        case 'KeyA':
          keys.a.pressed = true
          break
        case 'KeyD':
          keys.d.pressed = true
          break
        case 'KeyW':
          keys.w.pressed = true
          break
        case 'KeyS':
          keys.s.pressed = true
          break
        default:
          break
      }
    });

    window.addEventListener('keyup', (event) =>{
      switch(event.code) {
        case 'KeyA':
          keys.a.pressed = false
          break
        case 'KeyD':
          keys.d.pressed = false
          break
        case 'KeyW':
          keys.w.pressed = false
          break
        case 'KeyS':
          keys.s.pressed = false
          break
        default:
          break
      }
    });

    //Animation loop to show stuff
    function animate() {
      requestAnimationFrame( animate );
      renderer.render( scene, camera );
      //controls.update();

      //Cube Movement
      cube.velocity.x = 0;
      cube.velocity.z = 0;
      if (keys.a.pressed) {
        cube.velocity.x = -0.1;
      }if(keys.d.pressed) {
        cube.velocity.x = 0.1
      } if(keys.w.pressed) {
        cube.velocity.z = -0.1
      } if (keys.s.pressed) {
        cube.velocity.z = 0.1
      }

      // Move camera with the Cube:
      camera.position.z = cube.position.z + 10;

      //Update the cube position
      cube.update(ground);
    }

    //Call the animation function
    animate();
  }, []);
  return (
    <div ref={refContainer}></div>
  );
}

export default MyThree