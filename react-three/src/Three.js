import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { useEffect, useRef } from "react";

function MyThree() {
  const refContainer = useRef(null);
  useEffect(() => {
    // === Setup the scene camera and renderer ===
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);
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
      width: 10,
      height: 0.5,
      depth: 10,
      color: '#0000ff',
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

    //Set camera position and update controls
    camera.position.z = 5;

    //Add key status
    const keys = {
      a: {
        pressed: false
      },
      d: {
        pressed: false
      }
    }


    //Add controls
    window.addEventListener('keydown', (event) =>{
      switch(event.code) {
        case 'KeyA':
          keys.a.pressed = true
          break
        case 'KeyD':
          keys.d.pressed = true
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
        default:
          break
      }
    });



    //Animation loop to show stuff
    function animate() {
      requestAnimationFrame( animate );
      renderer.render( scene, camera );
      controls.update();

      //Cube Movement
      cube.velocity.x = 0;
      if (keys.a.pressed) {
        cube.velocity.x = -0.05;
      } else if(keys.d.pressed) {
        cube.velocity.x = 0.05

      }




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