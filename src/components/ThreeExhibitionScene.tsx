import React, { useRef, useEffect, useState, Suspense, useMemo } from 'react'
import { Canvas, useFrame, useThree, useLoader } from '@react-three/fiber'
import { Text, Html } from '@react-three/drei'
import * as THREE from 'three'
import { TextureLoader } from 'three'
import { useApp } from '../context/AppContext'
import { Artwork } from '../types'

// File-level constants for the gallery corridor limits
const MAX_Z = 5
const MIN_Z = -35

// Vincent van Gogh's Starry Night static artwork object
const starryNightArtwork: Artwork = {
  id: 'starry-night-popular',
  title: 'The Starry Night',
  category: 'digital-art',
  subCategory: 'concept-art',
  artist: {
    id: 'vincent-van-gogh',
    name: 'Vincent van Gogh',
    email: '',
    college: 'Museum of Modern Art',
    branch: '',
    year: '1889',
    avatar: null,
    bio: 'Vincent Willem van Gogh was a Dutch Post-Impressionist painter who is among the most famous and influential figures in the history of Western art.',
    joinedDate: new Date('1889-06-01')
  },
  votes: 9999,
  imageUrl: '/starry-night.jpg',
  thumbnailUrl: '/starry-night.jpg',
  videoUrl: null,
  description: 'The Starry Night is an oil-on-canvas painting by the Dutch Post-Impressionist painter Vincent van Gogh. Painted in June 1889, it depicts the view from the east-facing window of his asylum room at Saint-Rémy-de-Provence, just before sunrise, with the addition of an imaginary village.',
  status: 'approved',
  comments: [],
  createdAt: new Date('1889-06-01')
}

// Procedural texture generator for a polished dark slate tiled floor
const useProceduralTileTexture = () => {
  return useMemo(() => {
    if (typeof window === 'undefined') return null
    const canvas = document.createElement('canvas')
    canvas.width = 1024
    canvas.height = 1024
    const ctx = canvas.getContext('2d')
    if (!ctx) return null

    // Base creme tile color
    ctx.fillStyle = '#f2eae1'
    ctx.fillRect(0, 0, 1024, 1024)

    const cols = 4
    const rows = 4
    const tileWidth = 1024 / cols
    const tileHeight = 1024 / rows

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = c * tileWidth
        const y = r * tileHeight

        // Subtle tile-to-tile color variations
        const brightness = (Math.random() - 0.5) * 8
        ctx.fillStyle = `rgb(${242 + brightness}, ${234 + brightness}, ${225 + brightness})`
        ctx.fillRect(x + 2, y + 2, tileWidth - 4, tileHeight - 4)

        // Add subtle stone texture
        ctx.fillStyle = 'rgba(0, 0, 0, 0.015)'
        for (let n = 0; n < 8; n++) {
          ctx.fillRect(
            x + Math.random() * tileWidth,
            y + Math.random() * tileHeight,
            1 + Math.random() * 3,
            1 + Math.random() * 3
          )
        }

        // Add veins
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.02)'
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.moveTo(x + Math.random() * tileWidth, y)
        ctx.lineTo(x + Math.random() * tileWidth, y + tileHeight)
        ctx.stroke()
      }
    }

    // Draw clean grout lines
    ctx.strokeStyle = '#d8cdbf'
    ctx.lineWidth = 4
    for (let i = 0; i <= cols; i++) {
      const x = i * tileWidth
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, 1024)
      ctx.stroke()
    }
    for (let i = 0; i <= rows; i++) {
      const y = i * tileHeight
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(1024, y)
      ctx.stroke()
    }

    const texture = new THREE.CanvasTexture(canvas)
    texture.wrapS = THREE.RepeatWrapping
    texture.wrapT = THREE.RepeatWrapping
    // Repeat tile texture along the corridor
    texture.repeat.set(2, 16)
    return texture
  }, [])
}

// Renders artwork image as a Three.js texture on a plane — no Html portal
interface PaintingProps {
  artwork: Artwork
  position: [number, number, number]
  rotation: [number, number, number]
  onSelect: (artwork: Artwork) => void
  isMobile: boolean
  selectedArtwork: Artwork | null
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

const Painting: React.FC<PaintingProps> = ({ artwork, position, rotation, onSelect, isMobile, selectedArtwork }) => {
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
      {/* Wall Hook / Peg */}
      <mesh position={[0, 1.45, -0.04]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.03, 0.03, 0.06, 8]} />
        <meshStandardMaterial color="#C9A84C" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Hanging Wire Left */}
      <mesh position={[-0.6, 1.325, -0.038]} rotation={[0, 0, -Math.atan2(0.25, 1.2)]}>
        <boxGeometry args={[1.23, 0.008, 0.008]} />
        <meshBasicMaterial color="#111111" />
      </mesh>

      {/* Hanging Wire Right */}
      <mesh position={[0.6, 1.325, -0.038]} rotation={[0, 0, Math.atan2(0.25, 1.2)]}>
        <boxGeometry args={[1.23, 0.008, 0.008]} />
        <meshBasicMaterial color="#111111" />
      </mesh>

      {/* Soft Contact Drop Shadow on Wall */}
      <mesh position={[0, 0, -0.039]}>
        <planeGeometry args={[3.4, 2.6]} />
        <meshBasicMaterial color="#000000" opacity={0.3} transparent />
      </mesh>

      {/* Gold frame */}
      <mesh ref={meshRef} castShadow receiveShadow>
        <boxGeometry args={[3.2, 2.4, 0.08]} />
        <meshStandardMaterial
          color={hovered ? '#E5C158' : '#C9A84C'}
          metalness={0.85}
          roughness={0.15}
        />
      </mesh>

      {/* Artwork image as texture or Html portal for video */}
      {artwork.videoUrl && selectedArtwork?.id === artwork.id ? (
        <mesh position={[0, 0, 0.06]}>
          <planeGeometry args={[2.8, 2.0]} />
          <meshBasicMaterial color="#000" />
          <Html transform distanceFactor={1.5} position={[0, 0, 0.01]} scale={2.8 / 840} zIndexRange={[100, 0]}>
            <div 
              style={{ width: '840px', height: '600px', background: 'black', pointerEvents: 'auto' }}
              onClick={(e) => e.stopPropagation()}
              onPointerDown={(e) => e.stopPropagation()}
            >
              {artwork.videoUrl.includes('drive.google.com') || artwork.videoUrl.includes('/preview') ? (
                <iframe
                  src={artwork.videoUrl}
                  title={artwork.title}
                  width="100%"
                  height="100%"
                  style={{ border: 'none' }}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <video
                  src={artwork.videoUrl}
                  poster={artwork.imageUrl || undefined}
                  controls
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                />
              )}
            </div>
          </Html>
        </mesh>
      ) : (
        <Suspense fallback={<FallbackPlane />}>
          <PaintingTexture url={imageUrl} hovered={hovered} isMobile={isMobile} />
        </Suspense>
      )}

      {/* Wall wash light */}
      <pointLight
        position={[0, -1.5, 0.5]}
        intensity={hovered ? 4.5 : (isMobile ? 2.5 : 1.2)}
        distance={isMobile ? 5.5 : 4.5}
        color="#C9A84C"
      />

      {/* Overhead Spotlight (reflects warm light on floor and wall) */}
      <pointLight
        position={[0, 1.8, 0.8]}
        intensity={hovered ? 4.0 : 2.0}
        distance={6.0}
        color="#FFF9E6"
      />
    </group>
  )
}

interface GalleryEnvironmentProps {
  isMobile: boolean
  floorTexture: THREE.CanvasTexture | null
}

const GalleryEnvironment: React.FC<GalleryEnvironmentProps> = ({ isMobile, floorTexture }) => {
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
      <ambientLight intensity={isMobile ? 0.85 : 0.65} color="#fff1e6" />
      <directionalLight position={[0, 10, 0]} intensity={isMobile ? 0.8 : 0.5} color="#ffe8cc" />
      
      {/* Aesthetic warm floor uplights for atmosphere */}
      <pointLight position={[-wallX + 0.5, -1.8, -10]} intensity={3.5} color="#ff9d00" distance={6} />
      <pointLight position={[wallX - 0.5, -1.8, -20]} intensity={3.5} color="#ff9d00" distance={6} />
      <pointLight position={[-wallX + 0.5, -1.8, -30]} intensity={3.5} color="#ff9d00" distance={6} />
      
      <spotLight
        ref={lightRef}
        position={[0, 6, -10]}
        angle={0.6}
        penumbra={1}
        intensity={isMobile ? 12 : 8}
        color="#C9A84C"
        castShadow
      />
      {/* Floor - Polished Slate Tiled Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, -20]} receiveShadow>
        <planeGeometry args={[floorCeilingWidth, 80]} />
        <meshStandardMaterial 
          map={floorTexture || undefined} 
          roughness={0.18} 
          metalness={0.2} 
        />
      </mesh>
      {/* Ceiling */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 4, -20]}>
        <planeGeometry args={[floorCeilingWidth, 80]} />
        <meshStandardMaterial color="#f2eae1" roughness={0.8} />
      </mesh>
      
      {/* Left Wall - Colored (Warm Ivory/Creme) */}
      <mesh rotation={[0, Math.PI / 2, 0]} position={[-wallX, 1, -20]} receiveShadow>
        <planeGeometry args={[80, 6]} />
        <meshStandardMaterial color="#f2eae1" roughness={0.8} />
      </mesh>
      
      {/* Right Wall - Colored (Warm Ivory/Creme) */}
      <mesh rotation={[0, -Math.PI / 2, 0]} position={[wallX, 1, -20]} receiveShadow>
        <planeGeometry args={[80, 6]} />
        <meshStandardMaterial color="#f2eae1" roughness={0.8} />
      </mesh>
      
      {/* Back Wall - Colored (Warm Ivory/Creme) */}
      <mesh position={[0, 1, -37]} receiveShadow>
        <planeGeometry args={[floorCeilingWidth, 6]} />
        <meshStandardMaterial color="#f2eae1" roughness={0.8} />
      </mesh>

      {/* Gold Baseboards (Floor Trim) */}
      <mesh position={[-wallX + 0.02, -1.9, -20]}>
        <boxGeometry args={[0.04, 0.2, 80]} />
        <meshStandardMaterial color="#C9A84C" metalness={0.85} roughness={0.15} />
      </mesh>
      <mesh position={[wallX - 0.02, -1.9, -20]}>
        <boxGeometry args={[0.04, 0.2, 80]} />
        <meshStandardMaterial color="#C9A84C" metalness={0.85} roughness={0.15} />
      </mesh>

      {/* Gold Crown Moldings (Ceiling Trim) */}
      <mesh position={[-wallX + 0.02, 3.9, -20]}>
        <boxGeometry args={[0.04, 0.2, 80]} />
        <meshStandardMaterial color="#C9A84C" metalness={0.85} roughness={0.15} />
      </mesh>
      <mesh position={[wallX - 0.02, 3.9, -20]}>
        <boxGeometry args={[0.04, 0.2, 80]} />
        <meshStandardMaterial color="#C9A84C" metalness={0.85} roughness={0.15} />
      </mesh>

      {/* 3D Motivational Quote above Starry Night (Charcoal for high contrast on cream wall) */}
      <Suspense fallback={null}>
        <Text
          position={[0, 2.65, -36.9]}
          rotation={[0, 0, 0]}
          fontSize={0.14}
          maxWidth={isMobile ? 5.5 : 7.5}
          color="#1c1c1c"
          textAlign="center"
          anchorX="center"
          anchorY="middle"
        >
          "Great things are done by a series of small things brought together."
          {"\n"}— Vincent van Gogh
        </Text>
      </Suspense>

      <gridHelper args={[80, 40, '#C9A84C', '#222']} position={[0, -1.98, -20]} />
    </>
  )
}

interface CameraControllerProps {
  scrollPercent: number
  maxZ: number
  minZ: number
  focusedArtwork: Artwork | null
  paintings: {
    pos: [number, number, number]
    rot: [number, number, number]
    artwork: Artwork
  }[]
}

const CameraController: React.FC<CameraControllerProps> = ({ 
  scrollPercent, 
  maxZ, 
  minZ, 
  focusedArtwork, 
  paintings 
}) => {
  const { camera, size } = useThree()
  const lookTargetRef = useRef(new THREE.Vector3(0, 1.0, -10))

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

  useFrame((state) => {
    const targetPos = new THREE.Vector3()
    const targetLook = new THREE.Vector3()

    if (focusedArtwork) {
      const p = paintings.find((x) => x.artwork.id === focusedArtwork.id)
      if (p) {
        const [px, py, pz] = p.pos
        // Determine camera target position based on where the painting is mounted
        if (px < -0.1) {
          // Left wall painting
          targetPos.set(px + 2.8, py, pz)
        } else if (px > 0.1) {
          // Right wall painting
          targetPos.set(px - 2.8, py, pz)
        } else {
          // Back wall painting (Starry Night)
          targetPos.set(px, py, pz + 3.2)
        }
        targetLook.set(px, py, pz)
      } else {
        const targetZ = maxZ - scrollPercent * (maxZ - minZ)
        targetPos.set(0, 1.0, targetZ)
        targetLook.set(0, 1.0, targetZ - 10)
      }
    } else {
      // Default path following scroll
      const targetZ = maxZ - scrollPercent * (maxZ - minZ)
      const bobbing = Math.sin(state.clock.elapsedTime * 1.2) * 0.03
      targetPos.set(0, 1.0 + bobbing, targetZ)
      targetLook.set(0, 1.0 + bobbing, targetZ - 10)
    }

    // Lerp camera position
    camera.position.lerp(targetPos, 0.05)

    // Lerp camera look target
    lookTargetRef.current.lerp(targetLook, 0.05)
    camera.lookAt(lookTargetRef.current)
  })

  return null
}

interface ThreeExhibitionSceneProps {
  onArtworkSelect: (artwork: Artwork) => void
  artworks?: Artwork[]
  selectedArtwork?: Artwork | null
}

const ThreeExhibitionScene: React.FC<ThreeExhibitionSceneProps> = ({ 
  onArtworkSelect, 
  artworks: propArtworks,
  selectedArtwork
}) => {
  const { artworks: contextArtworks } = useApp()
  const artworks = propArtworks ?? contextArtworks
  const [scrollPercent, setScrollPercent] = useState(0)
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' && window.innerWidth / window.innerHeight < 1.25)
  const containerRef = useRef<HTMLDivElement>(null)

  const [focusedArtwork, setFocusedArtwork] = useState<Artwork | null>(null)
  const floorTexture = useProceduralTileTexture()

  useEffect(() => {
    if (selectedArtwork === null) {
      setFocusedArtwork(null)
    } else if (selectedArtwork) {
      setFocusedArtwork(selectedArtwork)
    }
  }, [selectedArtwork])

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

  const getPaintingPositions = () => {
    const positions: {
      pos: [number, number, number]
      rot: [number, number, number]
      artwork: Artwork
    }[] = []
    
    // Allocate space down the corridor
    const stepZ = (MAX_Z - MIN_Z - 12) / Math.max(approvedArtworks.length, 1)

    const wallX = isMobile ? 3.4 : 5.0
    const paintingX = wallX - 0.04

    approvedArtworks.forEach((artwork, index) => {
      const isLeft = index % 2 === 0
      const xPos = isLeft ? -paintingX : paintingX
      const zPos = MAX_Z - 6 - index * stepZ
      const yRot = isLeft ? Math.PI / 2 : -Math.PI / 2

      positions.push({
        pos: [xPos, 1.0, zPos],
        rot: [0, yRot, 0],
        artwork,
      })
    })

    // Add Starry Night at the end of the corridor
    positions.push({
      pos: [0, 1.0, MIN_Z - 1.96],
      rot: [0, 0, 0],
      artwork: starryNightArtwork,
    })

    return positions
  }

  const paintings = getPaintingPositions()

  const handlePaintingClick = (artwork: Artwork) => {
    setFocusedArtwork(artwork)
    // Delay opening the details by 900ms to allow the user to see the camera pan in 3D
    setTimeout(() => {
      onArtworkSelect(artwork)
    }, 900)
  }

  return (
    <div ref={containerRef} className="w-full h-full">
      <Canvas
        shadows
        camera={{ position: [0, 1.0, MAX_Z], fov: 60 }}
        style={{ background: '#080808' }}
      >
        <fog attach="fog" args={['#080808', isMobile ? 8 : 5, isMobile ? 40 : 25]} />
        <GalleryEnvironment isMobile={isMobile} floorTexture={floorTexture} />

        {paintings.map((p) => (
          <Painting
            key={p.artwork.id}
            artwork={p.artwork}
            position={p.pos}
            rotation={p.rot}
            onSelect={handlePaintingClick}
            isMobile={isMobile}
            selectedArtwork={selectedArtwork}
          />
        ))}

        <CameraController 
          scrollPercent={scrollPercent} 
          maxZ={MAX_Z} 
          minZ={MIN_Z} 
          focusedArtwork={focusedArtwork}
          paintings={paintings}
        />
      </Canvas>
    </div>
  )
}

export default ThreeExhibitionScene
