"use client"

import { useEffect, useRef } from "react"
import * as THREE from "three"

export function ThreeBackground() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    if (typeof window === "undefined") return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    const scene = new THREE.Scene()

    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000)
    camera.position.z = 12

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
    renderer.setSize(container.clientWidth, container.clientHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    container.appendChild(renderer.domElement)

    const getPrimary = () => {
      const root = getComputedStyle(document.documentElement)
      const h = root.getPropertyValue("--primary").trim()
      if (!h) return "#3b82f6"
      const match = h.match(/^(\d+)\s+(\d+)%\s+(\d+)%$/)
      if (match) return `hsl(${match[1]}, ${match[2]}, ${match[3]})`
      return "#3b82f6"
    }

    const particlesGeo = new THREE.BufferGeometry()
    const count = 800
    const positions = new Float32Array(count * 3)
    for (let i = 0; i < count * 3; i++) {
      positions[i] = (Math.random() - 0.5) * 40
    }
    particlesGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3))

    const color = new THREE.Color(getPrimary())
    const particlesMat = new THREE.PointsMaterial({
      size: 0.06,
      color,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
    })
    const particles = new THREE.Points(particlesGeo, particlesMat)
    scene.add(particles)

    const torusGeo = new THREE.TorusGeometry(2.5, 0.05, 16, 60)
    const torusMat = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.15 })
    const torus = new THREE.Mesh(torusGeo, torusMat)
    torus.rotation.x = Math.PI / 3
    torus.rotation.y = Math.PI / 4
    scene.add(torus)

    const ringGeo = new THREE.RingGeometry(3, 3.08, 64)
    const ringMat = new THREE.MeshBasicMaterial({
      color,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.08,
    })
    const ring = new THREE.Mesh(ringGeo, ringMat)
    ring.rotation.x = Math.PI / 2.5
    ring.rotation.z = Math.PI / 6
    scene.add(ring)

    const mouse = { x: 0, y: 0 }
    function onMouseMove(e: MouseEvent) {
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1
      mouse.y = -(e.clientY / window.innerHeight) * 2 + 1
    }
    window.addEventListener("mousemove", onMouseMove)

    function onResize() {
      if (!container) return
      const w = container.clientWidth
      const h = container.clientHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }
    const ro = new ResizeObserver(onResize)
    ro.observe(container)

    let animId: number
    function animate() {
      animId = requestAnimationFrame(animate)
      particles.rotation.y += 0.0003
      particles.rotation.x += 0.0001
      torus.rotation.y += 0.002
      torus.rotation.x += 0.001
      ring.rotation.z += 0.001

      camera.position.x += (mouse.x * 0.8 - camera.position.x) * 0.02
      camera.position.y += (-mouse.y * 0.8 - camera.position.y) * 0.02
      camera.lookAt(0, 0, 0)

      renderer.render(scene, camera)
    }
    animate()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener("mousemove", onMouseMove)
      ro.disconnect()
      renderer.dispose()
      scene.clear()
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement)
      }
    }
  }, [])

  return <div ref={containerRef} className="absolute inset-0 z-0 pointer-events-none" />
}
