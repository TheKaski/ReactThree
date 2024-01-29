import * as CANNON from 'cannon-es';
/**
 * Track is a class for storing tracks that are created from basic gltf files
 */
class Track extends CANNON.Body{
    constructor({mesh=undefined, position={x:0, y:0, x:0}, world, scene}) {
        super(new CANNON.Body({
            position: new CANNON.Vec3(position.x, position.y, position.z) }));
        //If custommesh is defined:
        if(mesh)
        {
            this.mesh = mesh;
        }
  
        scene.add(this.mesh)
        const quaternion = new CANNON.Quaternion();
        quaternion.setFromEuler(-Math.PI/2, 0, 0);

        //The floor
        this.addShape(new CANNON.Plane(), new CANNON.Vec3(0,0.2,0), quaternion)
        //The walls:
        //NOTE: This could be made by taking simply the dimensions of the scene and converting them to the coordinates of the walls
        //However this is the test version which can later be enhanced in this version the origin of the 3D mesh was not centered
        //So inorder to make it dynamically in the future the origin needs to be centered for the 3D mesh
        this.addShape(new CANNON.Box(new CANNON.Vec3(80, 10, 2)),new CANNON.Vec3(0, 0, -80))
        this.addShape(new CANNON.Box(new CANNON.Vec3(80, 10, 2)),new CANNON.Vec3(0, 0, 125))

        this.addShape(new CANNON.Box(new CANNON.Vec3(2, 10, 100)),new CANNON.Vec3(-82, 0, 0))
        this.addShape(new CANNON.Box(new CANNON.Vec3(2, 10, 100)),new CANNON.Vec3(67, 0, 0))

        //Add this track tot he world:
        world.addBody(this);

    }
    /**
     * Method for removing the track from the scene and world
     */
    remove(scene, world)
    {

    }

    /**TODO for the V1 tracks won't have any height so therefore the body for the track will be a 
     * plane which size will be defined by the track and mesh is set just below this plane
     * 
     * @param {*} scene 
     * @param {*} world 
     */
    setPosition(scene, world)
    {

    }

}
export default Track;