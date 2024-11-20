/* eslint-disable react/no-unknown-property */
/* react/no-unknown-property is having issues with three + react three fiber */
'use client'

import { Environment, MeshTransmissionMaterial, OrbitControls, Stats } from '@react-three/drei'
import { Canvas, type MeshProps } from '@react-three/fiber'
import { Color } from 'three'

function SummerBlob(props: MeshProps) {
  return (
    <mesh {...props} receiveShadow scale={0.5}>
      <sphereGeometry args={[1, 32, 32]} />
      <MeshTransmissionMaterial
        anisotropy={0.1}
        attenuationColor="#ffffff"
        attenuationDistance={0.8}
        backside={false}
        background={
          new Color( // random color from the list
            ['#c9ffa1', '#ff6b6b', '#f9ed69', '#f08a5d', '#b83b5e'][Math.floor(Math.random() * 5)],
          )
        }
        chromaticAberration={0.06}
        clearcoat={1}
        color="#c9ffa1"
        distortion={0}
        distortionScale={0.3}
        ior={2.5}
        resolution={2048}
        roughness={0.2}
        samples={10}
        temporalDistortion={0.5}
        thickness={3.5}
        transmission={1}
        transmissionSampler={false}
      />
    </mesh>
  )
}

export function BlobAnimation() {
  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
      }}
    >
      <Canvas shadows camera={{ position: [0, 10, 0], fov: 45 }}>
        <Stats />
        <ambientLight intensity={0.5 * Math.PI} />
        <spotLight decay={0} position={[5, 5, -10]} angle={0.15} penumbra={1} />
        <pointLight decay={0} position={[-10, -10, -10]} />

        {Array.from({ length: 10 }).map((_, index) => (
          <SummerBlob
            key={index}
            position={[
              (Math.random() - 0.5) * 10,
              (Math.random() - 0.5) * 10,
              (Math.random() - 0.5) * 10,
            ]}
          />
        ))}
        <Environment files="https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/aerodynamics_workshop_1k.hdr" />
        <OrbitControls />
      </Canvas>
    </div>
  )
}
