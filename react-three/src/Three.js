import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

import { useEffect, useRef } from "react";

function MyThree() {
  const refContainer = useRef(null);
  useEffect(() => {
    // === Setup the scene camera and renderer ===
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);
    var renderer = new THREE.WebGLRenderer();

    const controls = new OrbitControls(camera, renderer.domElement)

    renderer.setSize(window.innerWidth, window.innerHeight);
    refContainer.current && refContainer.current.appendChild( renderer.domElement );

    //Cube
    var geometry = new THREE.BoxGeometry(1, 2, 1);
    var material = new THREE.MeshStandardMaterial({ color: 0xff0000 });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    //Lights
    const light1 = new THREE.PointLight(0xffffff, 250, 100)
    light1.position.set(0, 10, 10);
    const light2 = new THREE.PointLight(0xffffff, 250, 100)
    light1.position.set(10, 5, 20);
    scene.add(light1);
    scene.add(light2);


    camera.position.z = 5;
    controls.update();

    //This is important because without it we will only see blank screen
    function animate() {
      requestAnimationFrame( animate );
      renderer.render( scene, camera );
      controls.update();
    }
    animate();

  }, []);
  return (
    <div ref={refContainer}></div>
  );
}

export default MyThree