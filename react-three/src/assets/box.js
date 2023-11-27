import * as THREE from 'three';
import * as CANNON from 'cannon-es';

// CLASS FOR CREATING BoxS WITH CANNON.JS and THREE.js
class Box extends CANNON.Body {
    //TODO: UPDATE THIS TO WORK WITH THE CANNON:JS PHYSICS
    constructor({width, height, depth, color='#00ff00', position= {x:0,y:0,z:0}, mass=0, castShadow = true}) {
      super(
        //Create the graphical body with measurements and color
        new CANNON.Body({
          mass,
          position: new CANNON.Vec3(position.x, position.y, position.z)
        })); 
        //The shape needs to be added through a const to make the physics work
        const shape = new CANNON.Box(new CANNON.Vec3(width/2, height/2, depth/2));
        this.addShape(shape); 

        //Visuals for this object
        const BoxGeo = new THREE.BoxGeometry(width, height, depth); // The geometry is the distance from center of the object
        const BoxMat = new THREE.MeshStandardMaterial({color, wireframe: false});
        this.mesh = new THREE.Mesh(BoxGeo, BoxMat);
        this.mesh.castShadow = castShadow;
      }    
      update()
      {
        this.mesh.position.copy(this.position);
        this.mesh.quaternion.copy(this.quaternion);
      } 
};
export default Box