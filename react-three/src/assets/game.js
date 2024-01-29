import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

import Track from './track'
import Box from './box'
import Car from './car'
/**
 * This is a class for wrapping the basic functionality of a Game instance wrapping together the elements of the game
 * including, CANNON.js physics, THREE.js graphics, lights and various other classes developped for the game.
 * The goal for this class is to offer a simple easy to use interface for the main program to control the game logic, updates and lifecycle of the game instance itself
 */

class Game {
    //CONSTANTS:
    fov = 75;
    aspectRatio = window.innerWidth / window.innerHeight;
    near = 0.01
    far = 10000;
    gravity = 9.81;
    timeStep = 1.0 / 60.0;

    //PROPERTIES
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(this.fov, this.aspectRatio, this.near, this.far);
    renderer = new THREE.WebGLRenderer();
    gltfLoader =  new GLTFLoader();
    controls = new OrbitControls(this.camera, this.renderer.domElement) //Maybe let this be here as a togled on off property
    world = new CANNON.World({
        // Apply negative gravity on the y-axis
         gravity: new CANNON.Vec3(0, -this.gravity, 0),
         fixedStep: this.timeStep 
    });    

    car;
    track;

     //Store key state
    #keyState = {
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

    //This is a simple container for all the loaded models our game has
    models = {
        vehicleChassis: [],
        wheels: [],
        tracks : [],
    }

    constructor(modelFiles, refContainer)
    {
        //SET CAMERA POSITON
        this.camera.position.y = 5;
        this.camera.position.z = 10;
        this.camera.rotation.x = -0.5;
        this.initRenderer(refContainer);
        this.modelsLoaded = false;
        this.initLight();
        //Here we start loading the models:
        this.initModels(modelFiles); 
           //ADDITIONAL GRAPHICAL AXIS WILL BE REMOVED WHEN DEVELOPMENT IS READY
        this.scene.add(new THREE.AxesHelper(5))
    }
    //This is function for setting up the game constructing certain Car, track and wheelModels
    async setup()
    {
        //Setup witht he first track and first chassis with first wheels
        await Promise.all([
            this.initCar(this.models.vehicleChassis[0], this.models.wheels[0]),
            this.initTrack(this.models.tracks[0])
        ]);
        this.initSteeringControls();
       
    }

    update()
    {
        //Only start updating when the models are loaded:
        if(this.modelsLoaded)
        {
            this.renderer.render(this.scene, this.camera);
            this.world.step(this.timeStep)
            
         //Vehicle Movement
           if (this.#keyState.a.pressed) {
             this.car.setSteeringValue(Math.PI/8, 0);
             this.car.setSteeringValue(Math.PI/8, 1);
           }
       
           if(this.#keyState.d.pressed) {
             this.car.setSteeringValue(-Math.PI/8, 0);
             this.car.setSteeringValue(-Math.PI/8, 1);  
           } 
       
           if(this.#keyState.w.pressed) {
             this.car.moveForward()
           } 
       
           if (this.#keyState.s.pressed) {
             this.car.moveBackward();
           } 
           this.car.update();
        }
    }
    restart()
    {

    }

    initRenderer(refContainer)
    {
        //RENDERER
        this.refContainer = refContainer;
        this.renderer.shadowMap.enabled = true; // Enable shadows
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.refContainer.current && this.refContainer.current.appendChild( this.renderer.domElement );
    }

    async loadModel(model) {
        return new Promise((resolve, reject) => {
          this.gltfLoader.load(model, (gltfScene) => {
            // Resolve the promise with the loaded scene
            resolve(gltfScene.scene);
          }, undefined, reject);
        });
      }
  
    /**
     * 
     * @param {*} model .glb file for certain type of object in the game
     * @param {*} type  type such as track or vehiclebody or wheel to be used the model as in the game
     * @throws Error if the model type provided is unexpected
     */
    async initModels(modelFiles)
    {
        //This function will be easy to update and also add additional information about the objects
        for(const model of modelFiles.models){
            try {
                const loadedScene = await this.loadModel(model.path);
                    switch (model.type)
                    {
                        case 'vehicleBody':
                            console.log("Fine with vheicle")
                            this.models.vehicleChassis.push(loadedScene)
                            break;
                        case 'wheel':
                            console.log("Fine with wheel")
                            this.models.wheels.push(loadedScene)
                            break;
                        case 'track':
                            console.log("Fine with track")
                            this.models.tracks.push(loadedScene)
                            break;
                        default:
                            throw new Error(`Unexpected model type: ${model.type}`);
                    }
                } catch(error) {
                    //Handle any errors that might occur
                    console.log('Error loading 3D model:', error)
            }
        
        }
        await this.setup();
        this.modelsLoaded = true;
    }

    //Function for constructing instance of Car with given models:
    async initCar(chassis, wheels)
    {
        //Create the vehicleBody needed to construct a Raycastvehicle
        const vehicleBody = new Box({
            width: 2, 
            height: 0.10,
            depth: 4,
            position: {
                x:0,
                y:4,
                z:-3
            },
            mass: 60,
            mesh: chassis,
        })

        //Setup the car
        this.car = new Car( {
            vehicleBody: vehicleBody,
            world: this.world,
            scene: this.scene, 
            wheelMesh: wheels
        })
        

    }
    //Function for constructing instance of Track with given model:
    async initTrack(track)
    {
        
        this.track = new Track({mesh: track, world: this.world, scene:this.scene })
    }

    initLight()
    {
         //LIGHTS
        const light = new THREE.DirectionalLight(0xffffff, 3, 100)
        light.position.y = 2;
        light.position.z = 3;
        light.castShadow = true; // Make this light cast a shadow
        this.scene.add(light);
    }


    initSteeringControls()
    {
        //KEYDOWN EVENTLISTENER
        window.addEventListener('keydown', (event) =>{  
            switch(event.key) {
            case 'a':
                this.#keyState.a.pressed = true
                break 
            case 'd':
                this.#keyState.d.pressed = true
                break
            case 'w':
                this.#keyState.w.pressed = true
                break
            case 's':
                this.#keyState.s.pressed = true
                break
            default:
                break  
            }  
        });

        //KEY UP EVENTLISTENER
        window.addEventListener('keyup', (event) =>{
            switch(event.key) {
            case 'a':
                this.#keyState.a.pressed = false
                this.car.setSteeringValue(0, 0);
                this.car.setSteeringValue(0, 1);
                break
            case 'd':
                this.#keyState.d.pressed = false
                this.car.setSteeringValue(0, 0);
                this.car.setSteeringValue(0, 1);
                break
            case 'w':
                this.#keyState.w.pressed = false
                this.car.applyEngineForce(0, 2);
                this.car.applyEngineForce(0, 3);
                break
            case 's':
                this.#keyState.s.pressed = false
                this.car.applyEngineForce(0, 2);
                this.car.applyEngineForce(0, 3);
                break
            default:
                break
            }
        });
    }

}

export default Game