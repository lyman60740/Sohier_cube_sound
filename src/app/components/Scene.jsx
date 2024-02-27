'use client';
import React from 'react';
import { Canvas } from '@react-three/fiber';
import Model from './Model';
import { Environment } from '@react-three/drei';

export default function Scene(){
    return (
        <Canvas style={{background: '#010101'}}>
            <directionalLight position={[0, 3, 2]} intensity={0} />
            <Environment preset='city' />
            
        <Model />
        </Canvas>
    );
}