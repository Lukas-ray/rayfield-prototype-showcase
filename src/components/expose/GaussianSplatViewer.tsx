import { Suspense, useState, useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Environment, Html, useProgress, PerspectiveCamera, Splat } from '@react-three/drei';
import { Button } from '@/components/ui/button';
import { Maximize2, Minimize2, RotateCcw, Move3D, Loader2, Play, Pause, Home, ChefHat, Bed, Bath, Sofa } from 'lucide-react';
import * as THREE from 'three';
import { Badge } from '@/components/ui/badge';

// Available room splat sources - using public demo files
const SPLAT_SOURCES = {
  living: {
    name: 'Wohnzimmer',
    icon: Sofa,
    // Using a public demo splat file
    url: 'https://huggingface.co/cakewalk/splat-data/resolve/main/train.splat',
    position: [0, 0, 0] as [number, number, number],
    rotation: [0, 0, 0] as [number, number, number],
    scale: 1,
  },
};

type RoomKey = keyof typeof SPLAT_SOURCES;

// Auto-rotate camera
function AutoRotateCamera({ isAutoRotating, target }: { isAutoRotating: boolean; target: THREE.Vector3 }) {
  const { camera } = useThree();
  const angleRef = useRef(0);
  const radiusRef = useRef(4);
  
  useFrame((_, delta) => {
    if (isAutoRotating) {
      angleRef.current += delta * 0.15;
      camera.position.x = target.x + Math.sin(angleRef.current) * radiusRef.current;
      camera.position.z = target.z + Math.cos(angleRef.current) * radiusRef.current;
      camera.position.y = target.y + 1.5;
      camera.lookAt(target);
    }
  });
  
  return null;
}

function LoadingScreen() {
  const { progress, active } = useProgress();
  return (
    <Html center>
      <div className="flex flex-col items-center gap-4 text-white bg-black/60 backdrop-blur-md px-8 py-6 rounded-2xl">
        <div className="relative">
          <Loader2 className="h-12 w-12 animate-spin text-accent" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xs font-bold">{Math.round(progress)}%</span>
          </div>
        </div>
        <div className="text-center">
          <p className="text-sm font-medium">Lade 3D-Scan...</p>
          <p className="text-xs text-white/60 mt-1">Fotorealistische Besichtigung</p>
        </div>
        <div className="w-48 h-1.5 bg-white/20 rounded-full overflow-hidden">
          <div 
            className="h-full bg-accent rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </Html>
  );
}

// Fallback 3D Room when splat files fail to load
function FallbackRoom() {
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
      
      {/* TV Stand & TV */}
      <mesh position={[0, -1, -4.5]} castShadow>
        <boxGeometry args={[2.5, 0.6, 0.5]} />
        <meshStandardMaterial color="#2c2c2c" roughness={0.5} />
      </mesh>
      <mesh position={[0, 0, -4.8]} castShadow>
        <boxGeometry args={[2, 1.2, 0.08]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.3} metalness={0.5} />
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
    </group>
  );
}

// Gaussian Splat Scene with error handling
function GaussianSplatScene({ 
  currentRoom, 
  isAutoRotating,
  onError 
}: { 
  currentRoom: RoomKey; 
  isAutoRotating: boolean;
  onError: () => void;
}) {
  const roomData = SPLAT_SOURCES[currentRoom];
  const targetRef = useRef(new THREE.Vector3(...roomData.position));
  
  useEffect(() => {
    targetRef.current.set(...roomData.position);
  }, [currentRoom, roomData.position]);

  return (
    <>
      <AutoRotateCamera isAutoRotating={isAutoRotating} target={targetRef.current} />
      
      {/* Lighting */}
      <ambientLight intensity={0.6} />
      <directionalLight
        position={[5, 8, 5]}
        intensity={0.8}
        castShadow
      />
      
      {/* Environment for reflections */}
      <Environment preset="apartment" />
      
      {/* Gaussian Splat */}
      <Suspense fallback={<LoadingScreen />}>
        <group
          position={roomData.position}
          rotation={roomData.rotation}
          scale={roomData.scale}
        >
          <Splat 
            src={roomData.url}
            alphaTest={0.1}
            alphaHash={false}
            chunkSize={25000}
          />
        </group>
      </Suspense>
      
      {/* Controls */}
      <OrbitControls 
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={1}
        maxDistance={20}
        target={roomData.position}
      />
    </>
  );
}

// Fallback Scene (3D mesh room)
function FallbackScene({ isAutoRotating }: { isAutoRotating: boolean }) {
  const targetRef = useRef(new THREE.Vector3(0, 0, 0));
  
  return (
    <>
      <AutoRotateCamera isAutoRotating={isAutoRotating} target={targetRef.current} />
      
      {/* Lighting */}
      <ambientLight intensity={0.5} />
      <directionalLight
        position={[5, 8, 5]}
        intensity={1}
        castShadow
        shadow-mapSize={[2048, 2048]}
      />
      <pointLight position={[3.5, 1, -1]} intensity={0.5} color="#FFF8DC" />
      
      {/* Environment */}
      <Environment preset="apartment" />
      
      {/* Fallback 3D Room */}
      <FallbackRoom />
      
      {/* Controls */}
      <OrbitControls 
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={3}
        maxDistance={15}
        maxPolarAngle={Math.PI / 2}
      />
    </>
  );
}

interface GaussianSplatViewerProps {
  className?: string;
}

export function GaussianSplatViewer({ className }: GaussianSplatViewerProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isAutoRotating, setIsAutoRotating] = useState(true);
  const [currentRoom, setCurrentRoom] = useState<RoomKey>('living');
  const [useFallback, setUseFallback] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  const toggleFullscreen = async () => {
    try {
      if (!isFullscreen) {
        await containerRef.current?.requestFullscreen?.();
      } else {
        await document.exitFullscreen?.();
      }
      setIsFullscreen(!isFullscreen);
    } catch (e) {
      console.log('Fullscreen not supported');
    }
  };

  const handleSplatError = () => {
    console.log('Splat loading failed, using fallback');
    setUseFallback(true);
  };

  // Handle fullscreen change events
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const roomData = SPLAT_SOURCES[currentRoom];
  const RoomIcon = roomData.icon;

  return (
    <div 
      ref={containerRef}
      className={`relative rounded-xl overflow-hidden bg-gradient-to-br from-slate-900 to-slate-800 ${className}`}
      style={{ aspectRatio: isFullscreen ? undefined : '16/9', height: isFullscreen ? '100vh' : undefined }}
    >
      <Canvas 
        shadows 
        gl={{ antialias: true, alpha: false }}
        dpr={[1, 2]}
      >
        <Suspense fallback={<LoadingScreen />}>
          <PerspectiveCamera makeDefault position={[4, 2, 4]} fov={60} />
          
          {useFallback ? (
            <FallbackScene isAutoRotating={isAutoRotating} />
          ) : (
            <GaussianSplatScene 
              currentRoom={currentRoom}
              isAutoRotating={isAutoRotating}
              onError={handleSplatError}
            />
          )}
        </Suspense>
      </Canvas>
      
      {/* Current Room Badge */}
      <div className="absolute top-4 left-4 flex items-center gap-2">
        <Badge className="bg-accent/90 backdrop-blur-md text-accent-foreground gap-1.5 px-3 py-1.5">
          <RoomIcon className="h-3.5 w-3.5" />
          <span className="text-xs font-medium">{roomData.name}</span>
        </Badge>
        {useFallback && (
          <Badge variant="secondary" className="backdrop-blur-md text-xs">
            3D Vorschau
          </Badge>
        )}
      </div>
      
      {/* Controls Overlay */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-black/60 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 text-white hover:bg-white/20"
          onClick={() => setIsAutoRotating(!isAutoRotating)}
          title={isAutoRotating ? 'Auto-Rotation stoppen' : 'Auto-Rotation starten'}
        >
          {isAutoRotating ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </Button>
        
        <div className="w-px h-6 bg-white/30" />
        
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 text-white hover:bg-white/20"
          onClick={() => {
            setIsAutoRotating(false);
          }}
          title="Kamera zurücksetzen"
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
        
        <div className="w-px h-6 bg-white/30" />
        
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 text-white hover:bg-white/20"
          onClick={toggleFullscreen}
          title={isFullscreen ? 'Vollbild beenden' : 'Vollbild'}
        >
          {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
        </Button>
      </div>
      
      {/* Instructions */}
      <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-2 rounded-lg border border-white/10">
        <div className="flex items-center gap-2 text-white text-xs">
          <Move3D className="h-4 w-4 text-accent" />
          <span>Ziehen • Scrollen • Erkunden</span>
        </div>
      </div>
      
      {/* Quality indicator */}
      <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
        <span className="text-white/80 text-xs">
          {useFallback ? '3D Mesh' : 'Gaussian Splat'}
        </span>
      </div>
    </div>
  );
}