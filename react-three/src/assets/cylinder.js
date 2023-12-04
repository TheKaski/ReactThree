import * as THREE from 'three';
import * as CANNON from 'cannon-es';

 // CLASS FOR CREATING CYLINDER SHAPED PHYSICAL OBJECTS
 class Cylinder extends CANNON.Body {
    constructor({radius, height, color='#00ff00', position= {x:0,y:0,z:0},rotation=0, mass=0, castShadow = true}) {
      super(
        //Create the graphical body with measurements and color
        new CANNON.Body({
          mass,
          position: new CANNON.Vec3(position.x, position.y, position.z),
        })); 
        this.quaternion = new CANNON.Quaternion();
        this.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), rotation);

        //The shape needs to be added through a const to make the physics work
        const shape = new CANNON.Cylinder(radius, radius, height, 32);
        this.addShape(shape, new CANNON.Vec3(), this.quaternion); 

        //Visuals for this object
        const cylinderGeo = new THREE.CylinderGeometry(radius, radius, height, 32); // The geometry is the distance from center of the object
        const cylinderMat = new THREE.MeshStandardMaterial({color, wireframe: false});
        this.mesh = new THREE.Mesh(cylinderGeo, cylinderMat);
        this.mesh.geometry.rotateX(rotation);
        this.mesh.castShadow = castShadow;
        this.rotate(rotation);
      }    
      //Update the mesh position with the physical position
      update()
      {
        this.mesh.position.copy(this.position);
        this.mesh.quaternion.copy(this.quaternion);
      }

      // Rotate the object
      rotate(rotation)
      {
        this.quaternion.setFromAxisAngle(new CANNON.Vec3(1,0,0), rotation);
        this.update(); // Update the visual mesh after rotation
      }
  }
  export default Cylinder;