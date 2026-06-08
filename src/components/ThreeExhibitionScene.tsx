import React, { useRef, useEffect, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import { useApp } from '../context/AppContext'
import { Artwork } from '../types'

// Component representing a single wall-mounted painting in 3D space
interface PaintingProps {
  artwork: Artwork
  position: [number, number, number]
  rotation: [number, number, number]
  onSelect: (artwork: Artwork) => void
}

const Painting: React.FC<PaintingProps> = ({ artwork, position, rotation, onSelect }) => {
  const meshRef = useRef<THREE.Mesh>(null)
  const [hovered, setHovered] = useState(false)

  return (
    <group position={position} rotation={rotation}>
      {/* 3D Frame border */}
      <mesh
        ref={meshRef}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <boxGeometry args={[3.2, 2.4, 0.1]} />
        <meshStandardMaterial
          color={hovered ? '#E5C158' : '#C9A84C'}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>

      {/* Dynamic light below painting to act as a wall wash */}
      <pointLight
        position={[0, -1.5, 0.5]}
        intensity={hovered ? 3 : 1}
        distance={4}
        color="#C9A84C"
      />

      {/* HTML Image component transformed into 3D plane to avoid CORS issues */}
      <Html
        transform
        occlude
        distanceFactor={3}
        position={[0, 0, 0.06]}
        className="pointer-events-none select-none"
      >
        <div
          onClick={() => onSelect(artwork)}
          className={`pointer-events-auto cursor-pointer transition-all duration-500 overflow-hidden flex flex-col items-center bg-[#0d0d0d] border border-exhibition-gold/30 p-2 shadow-2xl ${
            hovered ? 'scale-105 border-exhibition-gold' : ''
          }`}
          style={{ width: '300px', height: '220px' }}
        >
          <img
            src={artwork.imageUrl || 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=600'}
            alt={artwork.title}
            className="w-full h-[150px] object-cover"
          />
          <div className="mt-2 text-center w-full px-1">
            <h4 className="font-serif text-[13px] font-bold text-exhibition-bone truncate">
              {artwork.title}
            </h4>
            <p className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest truncate">
              By {artwork.artist?.name || 'Artist'}
            </p>
          </div>
        </div>
      </Html>
    </group>
  )
}

// 3D Corridor walls, ceiling, floor, and lights
const GalleryEnvironment: React.FC = () => {
  const lightRef = useRef<THREE.SpotLight>(null)

  // Sweep the light slowly back and forth across the hall
  useFrame((state) => {
    if (lightRef.current) {
      lightRef.current.position.x = Math.sin(state.clock.elapsedTime * 0.5) * 5
      lightRef.current.position.y = 4 + Math.cos(state.clock.elapsedTime * 0.5) * 1
    }
  })

  return (
    <>
      {/* Ambient environment lighting */}
      <ambientLight intensity={0.4} />
      <directionalLight position={[0, 10, 0]} intensity={0.5} color="#fff" />

      {/* Moving showcase spotlight */}
      <spotLight
        ref={lightRef}
        position={[0, 6, -10]}
        angle={0.6}
        penumbra={1}
        intensity={8}
        color="#C9A84C"
        castShadow
      />

      {/* Corridor Hallway Mesh structure */}
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, -20]}>
        <planeGeometry args={[10, 80]} />
        <meshStandardMaterial color="#050505" roughness={0.9} />
      </mesh>

      {/* Ceiling */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 4, -20]}>
        <planeGeometry args={[10, 80]} />
        <meshStandardMaterial color="#030303" roughness={1} />
      </mesh>

      {/* Left Wall */}
      <mesh rotation={[0, Math.PI / 2, 0]} position={[-5, 1, -20]}>
        <planeGeometry args={[80, 6]} />
        <meshStandardMaterial color="#090909" roughness={0.8} />
      </mesh>

      {/* Right Wall */}
      <mesh rotation={[0, -Math.PI / 2, 0]} position={[5, 1, -20]}>
        <planeGeometry args={[80, 6]} />
        <meshStandardMaterial color="#090909" roughness={0.8} />
      </mesh>

      {/* Floor grid lines for museum depth */}
      <gridHelper args={[80, 40, '#C9A84C', '#222']} position={[0, -1.98, -20]} rotation={[0, 0, 0]} />
    </>
  )
}

// Camera control based on scroll depth
interface CameraControllerProps {
  scrollPercent: number
  maxZ: number
  minZ: number
}

const CameraController: React.FC<CameraControllerProps> = ({ scrollPercent, maxZ, minZ }) => {
  const { camera } = useThree()

  useFrame(() => {
    // Target camera Z position based on scroll percentage
    const targetZ = maxZ - scrollPercent * (maxZ - minZ)
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ, 0.05)

    // Subtle breathing camera motion
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, 1.0 + Math.sin(Date.now() * 0.001) * 0.05, 0.05)
  })

  return null
}

interface ThreeExhibitionSceneProps {
  onArtworkSelect: (artwork: Artwork) => void
}

const ThreeExhibitionScene: React.FC<ThreeExhibitionSceneProps> = ({ onArtworkSelect }) => {
  const { artworks } = useApp()
  const [scrollPercent, setScrollPercent] = useState(0)

  // Filter only approved artworks to show in the hall
  const approvedArtworks = artworks.filter((art) => art.status === 'approved')

  useEffect(() => {
    const handleScroll = () => {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      if (docHeight <= 0) return
      const percent = window.scrollY / docHeight
      setScrollPercent(percent)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Positions along the Z axis (camera moves from 5 down to -35)
  // Left wall positions are at X = -4.9, Right wall at X = 4.9
  // Distribute approved artworks along the corridor
  const maxZ = 5
  const minZ = -35

  const getPaintingPositions = () => {
    const positions: { pos: [number, number, number]; rot: [number, number, number]; artwork: Artwork }[] = []
    const stepZ = (maxZ - minZ - 10) / Math.max(approvedArtworks.length, 1)

    approvedArtworks.forEach((artwork, index) => {
      const isLeft = index % 2 === 0
      const xPos = isLeft ? -4.85 : 4.85
      const zPos = maxZ - 6 - index * stepZ
      const yRot = isLeft ? Math.PI / 2 : -Math.PI / 2

      positions.push({
        pos: [xPos, 1.0, zPos],
        rot: [0, yRot, 0],
        artwork,
      })
    })

    return positions
  }

  const paintings = getPaintingPositions()

  return (
    <div className="w-full h-full">
      <Canvas
        shadows
        camera={{ position: [0, 1.0, maxZ], fov: 60 }}
        style={{ background: '#080808' }}
      >
        <fog attach="fog" args={['#080808', 5, 25]} />
        <GalleryEnvironment />
        
        {paintings.map((p, idx) => (
          <Painting
            key={p.artwork.id}
            artwork={p.artwork}
            position={p.pos}
            rotation={p.rot}
            onSelect={onArtworkSelect}
          />
        ))}

        <CameraController scrollPercent={scrollPercent} maxZ={maxZ} minZ={minZ} />
      </Canvas>
    </div>
  )
}

export default ThreeExhibitionScene
