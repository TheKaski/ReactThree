import * as THREE from 'three';
import * as CANNON from 'cannon-es';

/**
 * Wheel is a class for creating physical cylindershaped Wheel objects with THREE.js graphics.
 * This class wraps the functionality for updating the graphics with the physics world
 */
 class Wheel extends CANNON.Body {
    constructor({radius, width=1, color='#00ff00', position= {x:0,y:0,z:0},rotation=0, mass=0, castShadow = true, mesh = undefined}) {
      super(
        //Create the graphical body with measurements and color
        new CANNON.Body({
          mass,
          position: new CANNON.Vec3(position.x, position.y, position.z),
        })
      ); 
      this.quaternion = new CANNON.Quaternion();
      this.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), rotation);
      //The shape needs to be added through a const to make the physics work
      const shape = new CANNON.Cylinder(radius, radius, width, 32 );
      this.addShape(shape, new CANNON.Vec3(), this.quaternion); 
      
      if(mesh)
      {
        this.mesh = mesh;

      } else {
        //Visuals for this object
        const wheelGeo = new THREE.CylinderGeometry(radius, radius, width, 32); // The geometry is the distance from center of the object
        const wheelMat = new THREE.MeshStandardMaterial({color, wireframe: true});
        
        this.mesh = new THREE.Mesh(wheelGeo, wheelMat);
        this.mesh.geometry.rotateZ(rotation);
        this.mesh.castShadow = castShadow;
        this.rotate(rotation);

      }

      this.update()
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
        //Todo maybe add possibility to rotate either x, y or z axis.
        this.quaternion.setFromAxisAngle(new CANNON.Vec3(0,1,0), rotation);
        this.update(); // Update the visual mesh after rotation
      }
  }
  export default Wheel;