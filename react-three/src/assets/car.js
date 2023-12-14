// This is a simple class to construct rigidVehciles with chassis and four wheels
import * as THREE from 'three';
import * as CANNON from 'cannon-es';
// IMPORT CUSTOM CLASSES:
import Wheel from './wheel';

/**
 * Car is a wrapper class for RaycastVehicle to contain the functionality of the raycastVehicle
 * with the added visual bodies for chassis and tires of the car
 * Idea is that you can create various cars with different chassies and different wheelsetups
 * And be able to adjust and modify the suspension etc settings of each Car object
 */

class Car extends CANNON.RaycastVehicle {
    constructor({vehicleBody, tireRadius, tireWidth, tireColor, tireRotation, tireMass, tireFriction, tireAngularDamping, axis, world, scene }) {
        super(new CANNON.RaycastVehicle({chassisBody: vehicleBody, 
            indexRightAxis: 0,
			indexUpAxis: 1,
			indexForwardAxis: 2
        }));
        //Defining options for the car wheels
        this.options = {
            radius: 0.5,
            directionLocal: new CANNON.Vec3(0, -1, 0),
            suspensionStiffness: 20,
            suspensionRestLength: 1,
            frictionSlip: 5,
            dampingRelaxation: 2,
            dampingCompression: 2.4,
            maxSuspensionForce: 500,
            rollInfluence:  0.01,
            axleLocal: new CANNON.Vec3(-1, 0, 0),
            chassisConnectionPointLocal: new CANNON.Vec3(1, 0,0),
            maxSuspensionTravel: 0.6,
            customSlidingRotationalSpeed: 30,
            useCustomSlidingRotationalSpeed: true
          };

        this.world = world;
        this.scene = scene;

        //Add the body mesh to the scene
        scene.add(vehicleBody.mesh);

        this.wheelBodies = [];
        
        //Add wheels based on this.options to the vehicle. These wheels are stored in this.wheelInfos of the raycastVehicle:
        this.addWheels();
      
        //Create the wheel obejcts and store them in this.wheelBodies
        this.createWheelBodies();
        
        //Call the update method to make sure everything is synced at start:
        this.update();
         
    }
    update()
    {
        //Update the position of wheelBodies to match the new position of RayCastVehicle wheels:   
        let index = 0;
        let r;
        this.wheelInfos.forEach(wheel =>{
          this.updateWheelTransform(index);
          const t = wheel.worldTransform;
          this.wheelBodies[index].mesh.position.copy(t.position);
          this.wheelBodies[index].mesh.quaternion.copy(t.quaternion);
          index++; 
        });

        //Update the position of the chassisBody:
        this.chassisBody.update();
        
    }
    createWheelBodies() {

        this.wheelInfos.forEach( wheel =>{
            const newWheel = new Wheel({
              radius: wheel.radius,
              width: wheel.radius,
              rotation: Math.PI/2,
              mass: 2
            })
            this.wheelBodies.push(newWheel);
            this.scene.add(newWheel.mesh);
            this.world.addBody(newWheel);
          }); 

    }
    addWheels(){
         
        //TODO: Allow to position the wheels with parameters

        //rearRight wheel
        this.options.chassisConnectionPointLocal.set(1, this.options.radius, 1.5);
        this.addWheel(this.options);

        //rearLeft wheel
        this.options.chassisConnectionPointLocal.set(-1, this.options.radius, 1.5);
        this.addWheel(this.options);

        //frontLeft wheel
        this.options.chassisConnectionPointLocal.set(-1, this.options.radius, -1.5);
        this.addWheel(this.options);

        //frontRight wheel
        this.options.chassisConnectionPointLocal.set(1, this.options.radius, -1.5);
        this.addWheel(this.options);

    }

    turnRight()
    {
        this.setSteeringValue(-this.options.maxSteerVal, 0);
        this.setSteeringValue(-this.options.maxSteerVal, 1);
    }
    turnLeft()
    {
        this.setSteeringValue(this.options.maxSteerVal, 0);
        this.setSteeringValue(this.options.maxSteerVal, 1);
    }
    centerSteering()
    {
        this.setSteeringValue(0, 0);
        this.setSteeringValue(0, 1);
    }
    moveForward()
    {
        this.applyEngineForce(this.options.maxForce, 2);
        this.applyEngineForce(this.options.maxForce, 3);
    }
    moveBackward()
    {
        this.applyEngineForce(-this.options.maxForce, 2);
        this.applyEngineForce(-this.options.maxForce, 3);
    }


}
export default Car;