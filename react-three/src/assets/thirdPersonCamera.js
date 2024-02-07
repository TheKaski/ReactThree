import { Vector3 } from "three";
/**
 * ThirdPersonCamera is a class for containing usefull logicfor creating and updating the position of a third person camera instance used in many types of games 
 * */
class ThirdPersonCamera {
    constructor(targetBody, offset, lookAt, camera){

        this.target = targetBody;
        this.offset = offset;
        this.lookAt = lookAt;
        this.camera = camera;

        this.currentPosition = new Vector3();
        this.currentLookAt = new Vector3();
    }
    /**
     * Update function for updating the position of third person camera
     * @param {*} timeElapsed time between the update frames
     */
    update(timeElapsed) {
        const offset = this.calculateOffset();
        const lookAt = this.calculateLookAt();

        this.currentPosition.lerp(offset, timeElapsed);
        this.currentLookAt.lerp(lookAt, timeElapsed)

        this.camera.position.copy(this.currentPosition);
        this.camera.lookAt(this.currentLookAt);
    }
    /**
     * Function for calculating the correct offset of the camera instance
     */
    calculateOffset() {
        const offset = this.offset.clone();
        offset.applyQuaternion(this.target.quaternion);
        offset.add(this.target.position);
        return offset;
    }
    /**
     * Function for Calculating the correct point to look at 
     */
    calculateLookAt() {
        const lookAt = this.lookAt.clone();
        lookAt.applyQuaternion(this.target.quaternion);
        lookAt.add(this.target.position);
        return lookAt;

    }
        
}
export default ThirdPersonCamera;