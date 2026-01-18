import { Suspense, useState, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Environment, Html, useProgress, PerspectiveCamera } from '@react-three/drei';
import { Button } from '@/components/ui/button';
import { Maximize2, Minimize2, RotateCcw, Move3D, Loader2, Play, Pause } from 'lucide-react';
import * as THREE from 'three';

// Demo room with interactive 3D experience
function DemoRoom() {
  const groupRef = useRef<THREE.Group>(null);
  
  return (
    <group ref={groupRef}>
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.5, 0]} receiveShadow>
        <planeGeometry args={[12, 12]} />
        <meshStandardMaterial color="#e8e4de" roughness={0.8} />
      </mesh>
      
      {/* Walls */}
      <mesh position={[0, 1, -6]} receiveShadow>
        <boxGeometry args={[12, 5, 0.2]} />
        <meshStandardMaterial color="#f5f5f0" roughness={0.9} />
      </mesh>
      <mesh position={[-6, 1, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <boxGeometry args={[12, 5, 0.2]} />
        <meshStandardMaterial color="#f5f5f0" roughness={0.9} />
      </mesh>
      <mesh position={[6, 1, 0]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
        <boxGeometry args={[12, 5, 0.2]} />
        <meshStandardMaterial color="#f5f5f0" roughness={0.9} />
      </mesh>
      
      {/* Window */}
      <mesh position={[0, 1.5, -5.85]}>
        <boxGeometry args={[4, 2.5, 0.1]} />
        <meshStandardMaterial color="#87CEEB" transparent opacity={0.3} roughness={0.1} metalness={0.1} />
      </mesh>
      <mesh position={[0, 1.5, -5.8]}>
        <boxGeometry args={[4.2, 2.7, 0.05]} />
        <meshStandardMaterial color="#ffffff" roughness={0.5} />
      </mesh>
      
      {/* Sofa */}
      <group position={[0, -0.8, 0]}>
        <mesh position={[0, 0, 0]} castShadow>
          <boxGeometry args={[3, 0.8, 1.2]} />
          <meshStandardMaterial color="#5a5a5a" roughness={0.7} />
        </mesh>
        <mesh position={[0, 0.6, -0.5]} castShadow>
          <boxGeometry args={[3, 0.8, 0.3]} />
          <meshStandardMaterial color="#5a5a5a" roughness={0.7} />
        </mesh>
        {/* Cushions */}
        <mesh position={[-0.8, 0.5, 0.1]} castShadow>
          <boxGeometry args={[0.6, 0.5, 0.5]} />
          <meshStandardMaterial color="#7cb342" roughness={0.8} />
        </mesh>
        <mesh position={[0.8, 0.5, 0.1]} castShadow>
          <boxGeometry args={[0.6, 0.5, 0.5]} />
          <meshStandardMaterial color="#7cb342" roughness={0.8} />
        </mesh>
      </group>
      
      {/* Coffee Table */}
      <mesh position={[0, -1.1, 2]} castShadow>
        <boxGeometry args={[1.5, 0.1, 0.8]} />
        <meshStandardMaterial color="#8B4513" roughness={0.6} />
      </mesh>
      <mesh position={[-0.6, -1.3, 1.7]} castShadow>
        <cylinderGeometry args={[0.05, 0.05, 0.3]} />
        <meshStandardMaterial color="#5D3A1A" roughness={0.6} />
      </mesh>
      <mesh position={[0.6, -1.3, 1.7]} castShadow>
        <cylinderGeometry args={[0.05, 0.05, 0.3]} />
        <meshStandardMaterial color="#5D3A1A" roughness={0.6} />
      </mesh>
      <mesh position={[-0.6, -1.3, 2.3]} castShadow>
        <cylinderGeometry args={[0.05, 0.05, 0.3]} />
        <meshStandardMaterial color="#5D3A1A" roughness={0.6} />
      </mesh>
      <mesh position={[0.6, -1.3, 2.3]} castShadow>
        <cylinderGeometry args={[0.05, 0.05, 0.3]} />
        <meshStandardMaterial color="#5D3A1A" roughness={0.6} />
      </mesh>
      
      {/* TV Stand */}
      <mesh position={[0, -1, -4.5]} castShadow>
        <boxGeometry args={[2.5, 0.6, 0.5]} />
        <meshStandardMaterial color="#2c2c2c" roughness={0.5} />
      </mesh>
      {/* TV */}
      <mesh position={[0, 0, -4.8]} castShadow>
        <boxGeometry args={[2, 1.2, 0.08]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.3} metalness={0.5} />
      </mesh>
      <mesh position={[0, 0, -4.75]}>
        <boxGeometry args={[1.9, 1.1, 0.02]} />
        <meshStandardMaterial color="#111827" roughness={0.2} />
      </mesh>
      
      {/* Side Table with Lamp */}
      <mesh position={[3.5, -1, -1]} castShadow>
        <boxGeometry args={[0.6, 0.8, 0.6]} />
        <meshStandardMaterial color="#DEB887" roughness={0.7} />
      </mesh>
      {/* Lamp */}
      <mesh position={[3.5, -0.2, -1]} castShadow>
        <cylinderGeometry args={[0.05, 0.05, 0.6]} />
        <meshStandardMaterial color="#C0C0C0" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[3.5, 0.3, -1]}>
        <coneGeometry args={[0.25, 0.35, 32]} />
        <meshStandardMaterial color="#FFF8DC" roughness={0.9} transparent opacity={0.9} />
      </mesh>
      
      {/* Plant */}
      <group position={[-4, -1.5, -4]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.3, 0.25, 0.5]} />
          <meshStandardMaterial color="#D2691E" roughness={0.8} />
        </mesh>
        <mesh position={[0, 0.6, 0]}>
          <sphereGeometry args={[0.5, 16, 16]} />
          <meshStandardMaterial color="#228B22" roughness={0.9} />
        </mesh>
      </group>
      
      {/* Rug */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.48, 1]}>
        <planeGeometry args={[4, 3]} />
        <meshStandardMaterial color="#8B7355" roughness={1} />
      </mesh>
      
      {/* Bookshelf */}
      <group position={[-5, 0, 2]}>
        <mesh castShadow>
          <boxGeometry args={[0.8, 2.5, 0.3]} />
          <meshStandardMaterial color="#DEB887" roughness={0.7} />
        </mesh>
        {/* Shelves */}
        {[-0.6, 0, 0.6].map((y, i) => (
          <mesh key={i} position={[0, y, 0]}>
            <boxGeometry args={[0.7, 0.05, 0.28]} />
            <meshStandardMaterial color="#C4A76B" roughness={0.7} />
          </mesh>
        ))}
        {/* Books */}
        <mesh position={[-0.15, -0.3, 0]} rotation={[0, 0, 0.1]}>
          <boxGeometry args={[0.15, 0.4, 0.2]} />
          <meshStandardMaterial color="#DC143C" roughness={0.8} />
        </mesh>
        <mesh position={[0.1, -0.25, 0]}>
          <boxGeometry args={[0.12, 0.35, 0.2]} />
          <meshStandardMaterial color="#4169E1" roughness={0.8} />
        </mesh>
        <mesh position={[0.25, -0.28, 0]} rotation={[0, 0, -0.05]}>
          <boxGeometry args={[0.1, 0.38, 0.2]} />
          <meshStandardMaterial color="#32CD32" roughness={0.8} />
        </mesh>
      </group>
    </group>
  );
}

// Auto-rotate camera
function AutoRotateCamera({ isAutoRotating }: { isAutoRotating: boolean }) {
  const { camera } = useThree();
  const angleRef = useRef(0);
  
  useFrame((_, delta) => {
    if (isAutoRotating) {
      angleRef.current += delta * 0.2;
      const radius = 8;
      camera.position.x = Math.sin(angleRef.current) * radius;
      camera.position.z = Math.cos(angleRef.current) * radius;
      camera.lookAt(0, 0, 0);
    }
  });
  
  return null;
}

function LoadingScreen() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div className="flex flex-col items-center gap-3 text-white">
        <Loader2 className="h-8 w-8 animate-spin" />
        <p className="text-sm font-medium">Lade 3D-Szene... {progress.toFixed(0)}%</p>
      </div>
    </Html>
  );
}

interface GaussianSplatViewerProps {
  className?: string;
}

export function GaussianSplatViewer({ className }: GaussianSplatViewerProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isAutoRotating, setIsAutoRotating] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      containerRef.current?.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
    setIsFullscreen(!isFullscreen);
  };

  const resetCamera = () => {
    // Reset is handled by OrbitControls
    setIsAutoRotating(false);
  };

  return (
    <div 
      ref={containerRef}
      className={`relative rounded-xl overflow-hidden bg-gradient-to-br from-slate-900 to-slate-800 ${className}`}
      style={{ aspectRatio: isFullscreen ? undefined : '16/9', height: isFullscreen ? '100vh' : undefined }}
    >
      <Canvas shadows>
        <Suspense fallback={<LoadingScreen />}>
          <PerspectiveCamera makeDefault position={[6, 3, 6]} fov={50} />
          <AutoRotateCamera isAutoRotating={isAutoRotating} />
          
          {/* Lighting */}
          <ambientLight intensity={0.4} />
          <directionalLight
            position={[5, 8, 5]}
            intensity={1}
            castShadow
            shadow-mapSize={[2048, 2048]}
          />
          <pointLight position={[3.5, 1, -1]} intensity={0.5} color="#FFF8DC" />
          
          {/* Environment for reflections */}
          <Environment preset="apartment" />
          
          {/* 3D Room */}
          <DemoRoom />
          
          {/* Controls */}
          <OrbitControls 
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            minDistance={3}
            maxDistance={15}
            maxPolarAngle={Math.PI / 2}
            onStart={() => setIsAutoRotating(false)}
          />
        </Suspense>
      </Canvas>
      
      {/* Controls Overlay */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-black/50 backdrop-blur-md px-4 py-2 rounded-full">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-white hover:bg-white/20"
          onClick={() => setIsAutoRotating(!isAutoRotating)}
          title={isAutoRotating ? 'Auto-Rotation stoppen' : 'Auto-Rotation starten'}
        >
          {isAutoRotating ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-white hover:bg-white/20"
          onClick={resetCamera}
          title="Kamera zurücksetzen"
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
        <div className="w-px h-6 bg-white/30" />
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-white hover:bg-white/20"
          onClick={toggleFullscreen}
          title={isFullscreen ? 'Vollbild beenden' : 'Vollbild'}
        >
          {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
        </Button>
      </div>
      
      {/* Instructions */}
      <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-md px-3 py-2 rounded-lg">
        <div className="flex items-center gap-2 text-white text-xs">
          <Move3D className="h-4 w-4" />
          <span>Ziehen zum Drehen • Scrollen zum Zoomen</span>
        </div>
      </div>
      
      {/* Demo Badge */}
      <div className="absolute top-4 right-4 bg-accent/90 backdrop-blur-md px-3 py-1.5 rounded-full">
        <span className="text-accent-foreground text-xs font-medium">3D Demo</span>
      </div>
    </div>
  );
}