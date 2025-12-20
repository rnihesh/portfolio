import React, { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import * as random from "maath/random/dist/maath-random.esm";

function Stars(props) {
  const ref = useRef();
  // Ensure the buffer size is divisible by 3 (x, y, z for each point)
  // 5000 points * 3 coordinates = 15000 floats
  const sphere = useMemo(
    () => random.inSphere(new Float32Array(5000 * 3), { radius: 1.5 }),
    []
  );

  useFrame((state, delta) => {
    ref.current.rotation.x -= delta / 10;
    ref.current.rotation.y -= delta / 15;
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled={false} {...props}>
        <PointMaterial
          transparent
          color="#888"
          size={0.005}
          sizeAttenuation={true}
          depthWrite={false}
        />
      </Points>
    </group>
  );
}

const ParticleBackground = () => {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none bg-gradient-to-b from-gray-50 to-gray-200 dark:from-black dark:to-gray-900">
      <Canvas camera={{ position: [0, 0, 1] }}>
        <Stars />
      </Canvas>
    </div>
  );
};

export default ParticleBackground;
