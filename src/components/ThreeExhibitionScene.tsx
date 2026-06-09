import React, { useRef, useEffect, useState, Suspense } from 'react'
import { Canvas, useFrame, useThree, useLoader } from '@react-three/fiber'
import * as THREE from 'three'
import { TextureLoader } from 'three'
import { useApp } from '../context/AppContext'
import { Artwork } from '../types'

// Renders artwork image as a Three.js texture on a plane — no Html portal
interface PaintingProps {
  artwork: Artwork
  position: [number, number, number]
  rotation: [number, number, number]
  onSelect: (artwork: Artwork) => void
  isMobile: boolean
}

const PaintingTexture: React.FC<{ url: string; hovered: boolean; isMobile: boolean }> = ({ url, hovered, isMobile }) => {
  const texture = useLoader(TextureLoader, url)
  return (
    <mesh position={[0, 0, 0.06]}>
      <planeGeometry args={[2.8, 2.0]} />
      <meshBasicMaterial
        map={texture}
        toneMapped={false}
        opacity={hovered ? 1 : (isMobile ? 0.98 : 0.92)}
        transparent
      />
    </mesh>
  )
}

const FallbackPlane: React.FC = () => (
  <mesh position={[0, 0, 0.06]}>
    <planeGeometry args={[2.8, 2.0]} />
    <meshBasicMaterial color="#1a1a1a" />
  </mesh>
)

const Painting: React.FC<PaintingProps> = ({ artwork, position, rotation, onSelect, isMobile }) => {
  const meshRef = useRef<THREE.Mesh>(null)
  const [hovered, setHovered] = useState(false)

  const imageUrl =
    artwork.thumbnailUrl ||
    artwork.imageUrl ||
    'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=600'

  return (
    <group
      position={position}
      rotation={rotation}
      onClick={() => onSelect(artwork)}
      onPointerOver={() => {
        setHovered(true)
        document.body.style.cursor = 'pointer'
      }}
      onPointerOut={() => {
        setHovered(false)
        document.body.style.cursor = 'auto'
      }}
    >
      {/* Gold frame */}
      <mesh ref={meshRef}>
        <boxGeometry args={[3.2, 2.4, 0.08]} />
        <meshStandardMaterial
          color={hovered ? '#E5C158' : '#C9A84C'}
          metalness={0.85}
          roughness={0.15}
        />
      </mesh>

      {/* Artwork image as texture — no Html portal */}
      <Suspense fallback={<FallbackPlane />}>
        <PaintingTexture url={imageUrl} hovered={hovered} isMobile={isMobile} />
      </Suspense>

      {/* Wall wash light */}
      <pointLight
        position={[0, -1.5, 0.5]}
        intensity={hovered ? 4.5 : (isMobile ? 2.5 : 1.2)}
        distance={isMobile ? 5.5 : 4.5}
        color="#C9A84C"
      />
    </group>
  )
}

interface GalleryEnvironmentProps {
  isMobile: boolean
}

const GalleryEnvironment: React.FC<GalleryEnvironmentProps> = ({ isMobile }) => {
  const lightRef = useRef<THREE.SpotLight>(null)

  useFrame((state) => {
    if (lightRef.current) {
      lightRef.current.position.x = Math.sin(state.clock.elapsedTime * 0.5) * 5
      lightRef.current.position.y = 4 + Math.cos(state.clock.elapsedTime * 0.5) * 1
    }
  })

  const wallX = isMobile ? 3.4 : 5.0
  const floorCeilingWidth = isMobile ? 6.8 : 10.0

  return (
    <>
      <ambientLight intensity={isMobile ? 0.65 : 0.4} />
      <directionalLight position={[0, 10, 0]} intensity={isMobile ? 0.75 : 0.5} color="#fff" />
      <spotLight
        ref={lightRef}
        position={[0, 6, -10]}
        angle={0.6}
        penumbra={1}
        intensity={isMobile ? 12 : 8}
        color="#C9A84C"
        castShadow
      />
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, -20]}>
        <planeGeometry args={[floorCeilingWidth, 80]} />
        <meshStandardMaterial color="#050505" roughness={0.9} />
      </mesh>
      {/* Ceiling */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 4, -20]}>
        <planeGeometry args={[floorCeilingWidth, 80]} />
        <meshStandardMaterial color="#030303" roughness={1} />
      </mesh>
      {/* Left Wall */}
      <mesh rotation={[0, Math.PI / 2, 0]} position={[-wallX, 1, -20]}>
        <planeGeometry args={[80, 6]} />
        <meshStandardMaterial color="#090909" roughness={0.8} />
      </mesh>
      {/* Right Wall */}
      <mesh rotation={[0, -Math.PI / 2, 0]} position={[wallX, 1, -20]}>
        <planeGeometry args={[80, 6]} />
        <meshStandardMaterial color="#090909" roughness={0.8} />
      </mesh>
      <gridHelper args={[80, 40, '#C9A84C', '#222']} position={[0, -1.98, -20]} />
    </>
  )
}

interface CameraControllerProps {
  scrollPercent: number
  maxZ: number
  minZ: number
}

const CameraController: React.FC<CameraControllerProps> = ({ scrollPercent, maxZ, minZ }) => {
  const { camera, size } = useThree()

  useEffect(() => {
    const aspect = size.width / size.height
    if (aspect < 1.25) {
      // Scale fov wider on portrait viewports to keep walls visible
      const targetFov = Math.min(100, Math.max(60, 2 * Math.atan(0.72 / aspect) * 180 / Math.PI))
      camera.fov = targetFov
    } else {
      camera.fov = 60
    }
    camera.updateProjectionMatrix()
  }, [size.width, size.height, camera])

  useFrame(() => {
    const targetZ = maxZ - scrollPercent * (maxZ - minZ)
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ, 0.05)
    camera.position.y = THREE.MathUtils.lerp(
      camera.position.y,
      1.0 + Math.sin(Date.now() * 0.001) * 0.05,
      0.05
    )
  })

  return null
}

interface ThreeExhibitionSceneProps {
  onArtworkSelect: (artwork: Artwork) => void
}

const ThreeExhibitionScene: React.FC<ThreeExhibitionSceneProps> = ({ onArtworkSelect }) => {
  const { artworks } = useApp()
  const [scrollPercent, setScrollPercent] = useState(0)
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' && window.innerWidth / window.innerHeight < 1.25)
  const containerRef = useRef<HTMLDivElement>(null)

  const approvedArtworks = artworks.filter((art) => art.status === 'approved')

  useEffect(() => {
    const handleScroll = () => {
      const el = containerRef.current?.closest('[data-corridor]') as HTMLElement | null
      if (!el) {
        const docHeight = document.documentElement.scrollHeight - window.innerHeight
        if (docHeight <= 0) return
        setScrollPercent(window.scrollY / docHeight)
        return
      }
      const rect = el.getBoundingClientRect()
      const scrollable = el.offsetHeight - window.innerHeight
      const scrolled = -rect.top
      const percent = Math.min(1, Math.max(0, scrolled / scrollable))
      setScrollPercent(percent)
    }

    const handleResize = () => {
      setIsMobile(window.innerWidth / window.innerHeight < 1.25)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  const maxZ = 5
  const minZ = -35

  const getPaintingPositions = () => {
    const positions: {
      pos: [number, number, number]
      rot: [number, number, number]
      artwork: Artwork
    }[] = []
    const stepZ = (maxZ - minZ - 10) / Math.max(approvedArtworks.length, 1)

    const paintingX = isMobile ? 3.25 : 4.85

    approvedArtworks.forEach((artwork, index) => {
      const isLeft = index % 2 === 0
      const xPos = isLeft ? -paintingX : paintingX
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
    <div ref={containerRef} className="w-full h-full">
      <Canvas
        shadows
        camera={{ position: [0, 1.0, maxZ], fov: 60 }}
        style={{ background: '#080808' }}
      >
        <fog attach="fog" args={['#080808', 5, 25]} />
        <GalleryEnvironment isMobile={isMobile} />

        {paintings.map((p) => (
          <Painting
            key={p.artwork.id}
            artwork={p.artwork}
            position={p.pos}
            rotation={p.rot}
            onSelect={onArtworkSelect}
            isMobile={isMobile}
          />
        ))}

        <CameraController scrollPercent={scrollPercent} maxZ={maxZ} minZ={minZ} />
      </Canvas>
    </div>
  )
}

export default ThreeExhibitionScene
