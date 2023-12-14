import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { useEffect, useRef } from 'react';

// IMPORT CUSTOM CLASSES:
import Box from './assets/box';
import Car from './assets/car';

function MyThree() {
  const refContainer = useRef(null);
  useEffect(() => {
    //PARAMETERS FOR THE SCENE CAMERA
    const fov = 75;
    const aspectRatio = window.innerWidth / window.innerHeight;
    const near = 0.01
    const far = 10000;

    // SETUP THE SCENE WITH CAMERA AND RENDERER
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(fov, aspectRatio, near, far);
    var renderer = new THREE.WebGLRenderer();

    //SET CAMERA POSITON
    camera.position.y = 5;
    camera.position.z = 10;
    camera.rotation.x = -0.5;

    //SET THE RENDERER
    renderer.shadowMap.enabled = true; // Enable shadows
    renderer.setSize(window.innerWidth, window.innerHeight);
    refContainer.current && refContainer.current.appendChild( renderer.domElement );

    //ADDITIONAL GRAPHICAL AXIS WILL BE REMOVED WHEN DEVELOPMENT IS READY
    scene.add(new THREE.AxesHelper(5))

    //ORBIT CONTROLS FOR LOOKING AROUND THE SCENE
    const controls = new OrbitControls(camera, renderer.domElement)

    //CREATE PHYSICS WORLD WITH CANNON.JS
    const gravity = 9.81;
    const world = new CANNON.World({
      // Apply negative gravity on the y-axis
      gravity: new CANNON.Vec3(0, -gravity, 0) 
    });

    //MATERIALS:
    const groundMaterial = new CANNON.Material('groundMaterial');
    const wheelMaterial = new CANNON.Material('wheel');
    const wheelGroundContactMaterial = new CANNON.ContactMaterial(wheelMaterial, groundMaterial, {
      friction: 0.4,
      restitution: 1,
      contactEquationStiffness: 10
    });
    world.addContactMaterial(wheelGroundContactMaterial);
  
    //GROUND:
    const groundGeo = new THREE.PlaneGeometry(500, 500);
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0x383a3b,
      side: THREE.DoubleSide,
      wireframe: false
    });
    const groundMesh = new THREE.Mesh(groundGeo, groundMat);
    scene.add(groundMesh);
    groundMesh.receiveShadow = true;
    //Physical body:
    const groundBody = new CANNON.Body({
      shape: new CANNON.Plane(),
      type: CANNON.Body.STATIC,
    })
    groundBody.quaternion.setFromEuler(-Math.PI/2, 0, 0);
    world.addBody(groundBody);

    // Vehicle body:
    const vehicleBody = new Box({
      width: 2, 
      height: 0.5,
      depth: 4,
      color: '#b208c3',
      position: {
        x:0,
        y:4,
        z:-9
      },
      mass: 80
    }); 

    //Vehicle:
    const car = new Car({
      vehicleBody: vehicleBody, 
      world: world,
      scene: scene
    })
    car.addToWorld(world);

     //LIGHTS
     const light = new THREE.DirectionalLight(0xffffff, 3, 100)
     light.position.y = 2;
     light.position.z = 3;
     light.castShadow = true; // Make this light cast a shadow
     scene.add(light);
 
    //Store key state
    const keyState = {
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

    const maxForce = 15;
    const maxSteerVal = Math.PI / 15;
    //KEYDOWN EVENTLISTENER
    window.addEventListener('keydown', (event) =>{  
      switch(event.key) {
        case 'a':
          keyState.a.pressed = true
          break 
        case 'd':
          keyState.d.pressed = true
          break
        case 'w':
          keyState.w.pressed = true
          break
        case 's':
          keyState.s.pressed = true
          break
        default:
          break  
      }  
    });

    //KEY UP EVENTLISTENER
    window.addEventListener('keyup', (event) =>{
      switch(event.key) {
        case 'a':
          keyState.a.pressed = false
          car.setSteeringValue(0, 2);
          car.setSteeringValue(0, 3);
          break
        case 'd':
          keyState.d.pressed = false
          car.setSteeringValue(0, 2);
          car.setSteeringValue(0, 3);
          break
        case 'w':
          keyState.w.pressed = false
          car.applyEngineForce(0, 0);
          car.applyEngineForce(0, 1);
          break
        case 's':
          keyState.s.pressed = false
          car.applyEngineForce(0, 0);
          car.applyEngineForce(0, 1);
          break
        default:
          break
      }
    });

    const timeStep = 1.0 / 60.0;
    world.fixedStep = timeStep;

//ANIMATION LOOP
    function animate() {
      requestAnimationFrame( animate );
      renderer.render( scene, camera );
      world.step(timeStep)
      //controls.update();

      //Vehicle Movement
      if (keyState.a.pressed) {
        car.setSteeringValue(Math.PI/8, 2);
        car.setSteeringValue(Math.PI/8, 3);

      }if(keyState.d.pressed) {
    
        car.setSteeringValue(-Math.PI/8, 2);
        car.setSteeringValue(-Math.PI/8, 3);

      } if(keyState.w.pressed) {
        car.applyEngineForce(300, 0);
        car.applyEngineForce(300, 1);

      } if (keyState.s.pressed) {
        car.applyEngineForce(-300, 0);
        car.applyEngineForce(-300, 1);
      } 
      //PLANE POSITION:
      groundMesh.position.copy(groundBody.position);
      groundMesh.quaternion.copy(groundBody.quaternion);

      //Vehicle
      car.update();

      //camera.position.x = vehicleBody.position.x;
      //camera.position.z = vehicleBody.position.z +10;
    }
    //Call the animation function
    animate();
  }, []);
  return (
    <div ref={refContainer}></div>
  );
}

export default MyThree