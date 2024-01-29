import * as CANNON from 'cannon-es';
import Wheel from './wheel';

/**
 * Car is a wrapper class for a RaycastVehicle instance to contain the functionality of the raycastVehicle
 * with the added visual bodies for chassis and tires of the vehicle
 * Idea is that you can create various cars with different chassies and different wheels
 * And be able to adjust and modify the suspension etc settings of each Car object
 */

class Car extends CANNON.RaycastVehicle {
    constructor({vehicleBody, tireRadius, tireWidth, tireColor, tireRotation, tireMass, tireFriction, tireAngularDamping, axis, world, scene, wheelMesh = undefined }) {
        super(new CANNON.RaycastVehicle({chassisBody: vehicleBody, 
            indexRightAxis: 0,
			indexUpAxis: 1,
			indexForwardAxis: 2
        }));
        //Defining options for the car wheels
        //TODO USE THE PARAMETERS AND GIVE THEM DEFAULT VALUES
        this.options = {
            radius: 0.20,
            directionLocal: new CANNON.Vec3(0, -1, 0),
            suspensionStiffness: 20,
            suspensionRestLength: 0.25,
            frictionSlip: 0.8,
            skidInfo: 0.6,
            dampingRelaxation: 2,
            dampingCompression: 2.4,
            maxSuspensionForce: 500,
            rollInfluence:  0.2,
            axleLocal: new CANNON.Vec3(-1, 0, 0),
            chassisConnectionPointLocal: new CANNON.Vec3(1, 0,0),
            maxSuspensionTravel: 0.6,
            customSlidingRotationalSpeed: 5,
            useCustomSlidingRotationalSpeed: true
          };

          this.constants = {
            maxSteerVal: Math.PI/10,
            maxForce: 70,
            maxRpm: 8000,
            peakRpm: 6000,
            maxPowerOutput: 500,
          }

        this.world = world;
        this.scene = scene;
        
        if(wheelMesh) this.wheelMesh = wheelMesh;

        //Add the body mesh to the scene
        this.scene.add(vehicleBody.mesh);
        //Add the car to the world
        this.addToWorld(this.world);

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
              width: wheel.radius/2,
              rotation: Math.PI/2,
              mass: 2,
              mesh: this.wheelMesh.clone()
            })
            this.wheelBodies.push(newWheel);
            this.scene.add(newWheel.mesh);
            this.world.addBody(newWheel);
          }); 
        

    }
    addWheels(){
         
        //TODO: Allow to position the wheels with parameters

        //rearRight wheel
        this.options.chassisConnectionPointLocal.set(0.55, this.options.radius, 0.5);
        this.addWheel(this.options);

        //rearLeft wheel
        this.options.chassisConnectionPointLocal.set(-0.55, this.options.radius, 0.5);
        this.addWheel(this.options);

        this.options.frictionSlip = 1.0;
        //frontLeft wheel
        this.options.chassisConnectionPointLocal.set(-0.55, this.options.radius, -0.5);
        this.addWheel(this.options);

        //frontRight wheel 
        this.options.chassisConnectionPointLocal.set(0.55, this.options.radius, -0.5);
        this.addWheel(this.options);

    }

    turnRight()
    {
        this.setSteeringValue(-this.constants.maxSteerVal, 0);
        this.setSteeringValue(-this.constants.maxSteerVal, 1);
    }
    turnLeft()
    {
        this.setSteeringValue(this.constants.maxSteerVal, 0);
        this.setSteeringValue(this.constants.maxSteerVal, 1);
    }
    centerSteering()
    {
        this.setSteeringValue(0, 2);
        this.setSteeringValue(0, 3);
    }
    moveForward()
    {
        this.applyEngineForce(-this.constants.maxForce, 2);
        this.applyEngineForce(-this.constants.maxForce, 3);
    }
    moveBackward()
    {
        this.applyEngineForce(this.constants.maxForce, 2);
        this.applyEngineForce(this.constants.maxForce, 3);
    }


}
export default Car;