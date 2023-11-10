import * as THREE from 'three';

import { useEffect, useRef } from "react";

function MyThree() {
  const refContainer = useRef(null);
  useEffect(() => {
    // === Setup the scene camera and renderer ===
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    var renderer = new THREE.WebGLRenderer();

    renderer.setSize(window.innerWidth, window.innerHeight);
    refContainer.current && refContainer.current.appendChild( renderer.domElement );

    var geometry = new THREE.BoxGeometry(1, 2, 1);
    var material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    var cube = new THREE.Mesh(geometry, material);
    
    scene.add(cube);
    camera.position.z = 5;

    //This is important because without it we will only see blank screen
    function animate() {
      requestAnimationFrame( animate );
      renderer.render( scene, camera );
    }
    animate();

  }, []);
  return (
    <div ref={refContainer}></div>
  );
}

export default MyThree