import * as THREE from 'three';
import * as CANNON from 'cannon-es';
/**
 * Box is a class for creating physical Box objects/box bodies with a mesh using THREE.js graphics.
 * This class wraps the functionality for updating the graphics together with the physics world
 */
class Box extends CANNON.Body {
    constructor({width=1, height=0.25, depth=1, color='#00ff00', position= {x:0,y:0,z:0}, mass=0, castShadow = true, mesh = undefined}) {
      super(
        //Create the graphical body with measurements and color
        new CANNON.Body({
          mass,
          position: new CANNON.Vec3(position.x, position.y, position.z)
        })); 

        //Use custom mesh for creating the box body
        if(mesh) {
          this.mesh = mesh;
          const shape = new CANNON.Box(new CANNON.Vec3(width/2, height/2, depth/2));
          this.addShape(shape); 
          this.mesh.castShadow = castShadow;    

        } else{
          //Manually make the box and the visuals
          const shape = new CANNON.Box(new CANNON.Vec3(width/2, height/2, depth/2));
          this.addShape(shape); 
          //create the Box Visuals for this object
          const BoxGeo = new THREE.BoxGeometry(width, height, depth); // The geometry is the distance from center of the object
          const BoxMat = new THREE.MeshStandardMaterial({color, wireframe: true});
          this.mesh = new THREE.Mesh(BoxGeo, BoxMat);
          this.mesh.castShadow = castShadow;
        }
        this.update();
      }    
      /**
       * Method for updating the position of the mesh with the physics of the box
       */
      update()
      {
        this.mesh.position.copy(this.position);
        this.mesh.quaternion.copy(this.quaternion);
      } 
};
export default Box