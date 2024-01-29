import { useEffect, useRef } from 'react';
import Game from './assets/game'
import VehicleMODEL from './assets/vehicleParts/robotVehicleBody1.0.glb'
import WheelMODEL from './assets/vehicleParts/robotVehicleWheelCenter.glb'
import TrackMODEL from './assets/tracks/world1.0.glb'

/**
 * This is the game component developped with Cannon.js and THREE.js
 * @returns The container where the 3D world can run
 */
function MyThree() {
  const refContainer = useRef(null);
  useEffect(() => {
    //Initializing the models of the game
    const config = {
      models: [
          {type: 'vehicleBody', path: VehicleMODEL },
          {type: 'wheel', path: WheelMODEL},
          {type: 'track', path: TrackMODEL}
      ],
  };

  //Create new instance for Game
  const gameInstance = new Game(config, refContainer);

    //Animate function for updating the game continuously:
    function animate() {
      requestAnimationFrame( animate );
      //Call the update method:
      gameInstance.update();
    }
    animate(); 
   
  }, []);
  return (
    <div ref={refContainer}></div>
  );
}

export default MyThree