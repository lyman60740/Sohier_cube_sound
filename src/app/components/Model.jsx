import React, { useRef, useEffect } from "react";
import { useGLTF, Text, MeshTransmissionMaterial } from "@react-three/drei";
import { useFrame, useThree, useLoader } from "@react-three/fiber";
import { useControls } from "leva";
import { AudioLoader, AudioListener, Audio, AudioAnalyser, TextureLoader } from "three";
import '../scene.css';

export default function Model() {
  const sphereR = useRef();
  const img = useRef();
  const { viewport, camera } = useThree();
  const analyserRef = useRef(null); // Use a ref to store the analyser

  useEffect(() => {
    const listener = new AudioListener();
    camera.add(listener);

    const sound = new Audio(listener);
    const audioLoader = new AudioLoader();
    audioLoader.load('/medias/paradisio.mp3', (buffer) => {
      sound.setBuffer(buffer);
      sound.setLoop(true);
      sound.setVolume(0.5);
     
    sound.play();
      
      
    });

    const analyser = new AudioAnalyser(sound, 32);
    analyserRef.current = analyser; // Store the analyser in the ref

    return () => {
      camera.remove(listener);
      sound.stop();
    };
  }, [camera]);

  // Use `useFrame` at the top level to adjust the scale of sphereR
  useFrame(() => {
    if (analyserRef.current && sphereR.current) {
      const data = analyserRef.current.getAverageFrequency();
      const scale = data / 500; // Adjust the scale factor as needed
      sphereR.current.scale.set(scale + 0.9, scale + 0.9, scale + 0.9); // Ensure non-zero scale
    }
    sphereR.current.rotation.x += 0.005;
    sphereR.current.rotation.y += 0.005;

  });

  const texture = useLoader(TextureLoader, '/medias/sohier0.jpg');

  const materialProps = useControls({
    thickness: { value: 0.25, min: 0, max: 3, step: 0.05 },
    roughness: { value: 0, min: 0, max: 1, step: 0.1 },
    transmission: { value: 1, min: 0, max: 1, step: 0.1 },
    ior: { value: 1.1, min: 1, max: 3, step: 0.1 },
    chromaticAberration: { value: 0.27, min: 0, max: 1 },
    backside: { value: true },
  });
  

  return (
    <group scale={viewport.width / 3.5}>
      <mesh ref={img} position={[0, 0, -0.7]}>
      <planeGeometry args={[2, 1.5]} /> {/* Ajustez la taille selon vos besoins */}
      <meshBasicMaterial map={texture} />
    </mesh>
      <mesh ref={sphereR} position={[0, 0, -.5]}>
        <boxGeometry  />
        <MeshTransmissionMaterial {...materialProps} />
      </mesh>
    </group>
  );
}
