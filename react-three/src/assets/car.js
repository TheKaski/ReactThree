// This is a simple class to construct rigidVehciles with chassis and four wheels
import * as THREE from 'three';
import * as CANNON from 'cannon-es';
// IMPORT CUSTOM CLASSES:
import Cylinder from './cylinder';


class Car extends CANNON.RigidVehicle {
    constructor({vehicleBody, tireRadius, tireWidth, tireColor, tireRotation, tireMass, tireFriction, tireAngularDamping, axis }) {
        super(new CANNON.RigidVehicle({chassisBody: vehicleBody}));
        //Defining options for the car base
        this.options = {
            tireRadius,
            tireWidth,
            tireColor,
            tireRotation,
            tireMass,
            tireFriction,
            tireAngularDamping,
            axis,
            maxSteerVal: Math.PI / 6, // Same for all the cars
            maxForce: 15,
        }
        const chassis = vehicleBody;
        //Create the wheels and store them in this.wheels
        this.wheels = this.createWheels();
    
        //Add the created wheels to the car:
        this.addWheels();
    }
    update()
    {
        this.wheels.frontRight.update();
        this.wheels.frontLeft.update();
        this.wheels.rearRight.update();
        this.wheels.rearLeft.update();
    }
    createWheels() {
        var wheelBodies = {
            frontRight: null,
            frontLeft: null,
            rearRight: null,
            rearLeft: null
        }
        for(let tire in wheelBodies)
        {
            wheelBodies[tire] = new Cylinder({
                radius: this.options.tireRadius, 
                height: this.options.tireWidth,
                color: this.options.tireColor,
                rotation: this.options.tireRotation,
                mass: this.options.tireMass
            });
        }
        return wheelBodies;
    }
    addWheels(){
        // This needs to be further improved when we want to build
        //Cars with custom chassies
        this.addWheel({
            body: this.wheels.rearRight,
            position: new CANNON.Vec3(1.5, 0, 1.5),
            axis: this.options.axis,
            direction: new CANNON.Vec3(0, 1, 0),
            friction: this.options.tireFriction
        })
        this.addWheel({
          body: this.wheels.rearLeft,
          position: new CANNON.Vec3(1.5, 0, -1.5),
          axis: this.options.axis,
          direction: new CANNON.Vec3(0, 1, 0),
          friction: this.options.tireFriction
        })
    
        this.addWheel({
          body: this.wheels.frontRight,
          position: new CANNON.Vec3(-1.5, 0, 1.5),
          axis: this.options.axis,
          direction: new CANNON.Vec3(0, 1, 0),
          friction: this.options.tireFriction
        })
    
        this.addWheel({
          body: this.wheels.frontLeft,
          position: new CANNON.Vec3(-1.5, 0, -1.5),
          axis: this.options.axis,
          direction: new CANNON.Vec3(0, 1, 0),
          friction: this.options.tireFriction,
          suspensionMaxLength: 2,
          suspensionStiffness: 10,
        })
    }

    //TODO: Mdify the car class so that steering is always done for the fornt wheels
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
       
        this.applyWheelForce(-this.options.maxForce, 2);
        this.applyWheelForce(-this.options.maxForce, 3);

    }
    moveBackward()
    {
        this.applyWheelForce(this.options.maxForce, 2);
        this.applyWheelForce(this.options.maxForce, 3);
    }

}
export default Car;