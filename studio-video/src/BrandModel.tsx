import { useEffect, useMemo } from "react";
import { ThreeCanvas } from "@remotion/three";
import { useCurrentFrame, interpolate } from "remotion";
import { Box3, BufferGeometry, ExtrudeGeometry, Vector3 } from "three";
import { SVGLoader } from "three/addons/loaders/SVGLoader.js";
import logoSvg from "./logo-svg.json";
import { clamp, color, ease } from "./design";

const Model = ({ light }: { light: boolean }) => {
  const frame = useCurrentFrame();
  const geometry = useMemo(() => {
    const paths = new SVGLoader().parse(logoSvg).paths;
    const result = paths
      .flatMap((path) => SVGLoader.createShapes(path))
      .map(
        (shape) =>
          new ExtrudeGeometry(shape, {
            depth: 5.2,
            bevelEnabled: true,
            bevelSize: 0.6,
            bevelThickness: 0.8,
            bevelSegments: 3,
            curveSegments: 16,
          }),
      );
    const bounds = new Box3();
    result.forEach((item) => {
      item.computeBoundingBox();
      if (item.boundingBox) bounds.union(item.boundingBox);
    });
    const centre = bounds.getCenter(new Vector3());
    const scale = 4.35 / bounds.getSize(new Vector3()).y;
    result.forEach((item) => {
      item.translate(-centre.x, -centre.y, -centre.z);
      item.scale(scale, -scale, scale);
      item.computeVertexNormals();
    });
    return result;
  }, []);
  const orbit = useMemo(
    () =>
      new BufferGeometry().setFromPoints(
        Array.from({ length: 161 }, (_, i) => {
          const angle = (i / 160) * Math.PI * 2;
          return new Vector3(Math.cos(angle) * 3.05, Math.sin(angle) * 3.05, 0);
        }),
      ),
    [],
  );
  useEffect(
    () => () => {
      geometry.forEach((item) => item.dispose());
      orbit.dispose();
    },
    [geometry, orbit],
  );
  const spin = interpolate(frame, [0, 50], [Math.PI * 1.65, 0.15], {
    ...clamp,
    easing: ease,
  });
  const secondSpin = interpolate(frame, [82, 125], [0, Math.PI * 2], {
    ...clamp,
    easing: ease,
  });
  return (
    <group
      rotation={[
        Math.sin(frame / 95) * 0.12 - 0.08,
        spin + secondSpin + Math.sin(frame / 80) * 0.13,
        -0.1,
      ]}
    >
      <group
        scale={interpolate(frame, [0, 40], [0.78, 1], {
          ...clamp,
          easing: ease,
        })}
      >
        {geometry.map((item, i) => (
          <mesh key={i} geometry={item}>
            <meshStandardMaterial
              attach="material-0"
              color={light ? "#00a76b" : "#32d79a"}
              metalness={0.42}
              roughness={0.24}
            />
            <meshStandardMaterial
              attach="material-1"
              color="#075839"
              metalness={0.65}
              roughness={0.22}
            />
          </mesh>
        ))}
      </group>
      {[0, 1, 2].map((i) => {
        const angle = frame * 0.013 + i * 2.1;
        return (
          <group
            key={i}
            rotation={[
              0.72 + i * 0.63,
              -0.45 + i * 0.44,
              i * 1.1 + frame * 0.0015,
            ]}
          >
            <lineLoop geometry={orbit}>
              <lineBasicMaterial
                color={light ? color.green : color.mint}
                transparent
                opacity={light ? 0.26 : 0.36}
              />
            </lineLoop>
            <mesh
              position={[Math.cos(angle) * 3.05, Math.sin(angle) * 3.05, 0]}
            >
              <sphereGeometry args={[0.045, 10, 10]} />
              <meshStandardMaterial
                color={color.mint}
                emissive={color.green}
                emissiveIntensity={1.5}
              />
            </mesh>
          </group>
        );
      })}
    </group>
  );
};

export const BrandModel = ({
  size,
  light = false,
}: {
  size: number;
  light?: boolean;
}) => (
  <ThreeCanvas
    width={size}
    height={size}
    dpr={1}
    camera={{ position: [0, 0, 12.5], fov: 35 }}
    gl={{ alpha: true, antialias: true }}
    style={{ width: size, height: size }}
  >
    <ambientLight intensity={1.7} />
    <directionalLight position={[-4, 6, 7]} intensity={4} color="#e2fff2" />
    <directionalLight position={[5, 0, -4]} intensity={4} color="#72ffc6" />
    <pointLight position={[0, -5, 5]} intensity={12} color="#7ae4ae" />
    <Model light={light} />
  </ThreeCanvas>
);
