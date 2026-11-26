import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { Eye, RotateCcw, Sun, Radio, Mountain } from 'lucide-react';

export default function CelestialDome3D({
  activeSite,
  currentStep,
  mode
}) {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const sunMeshRef = useRef(null);
  const earthMeshRef = useRef(null);
  const sunBeamRef = useRef(null);
  const earthBeamRef = useRef(null);
  const craterMeshRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 500;
    const height = container.clientHeight || 340;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x040711);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    cameraRef.current = camera;
    camera.position.set(0, 35, 55);
    camera.lookAt(0, 5, 0);

    // 2. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    rendererRef.current = renderer;
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 3. Ambient & Grid
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    // Lunar Ground Plane
    const groundGeo = new THREE.CircleGeometry(25, 48);
    const groundMat = new THREE.MeshBasicMaterial({
      color: 0x0f172a,
      wireframe: false,
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    scene.add(ground);

    // Ground Grid
    const gridHelper = new THREE.PolarGridHelper(25, 8, 4, 36, 0x1e293b, 0x334155);
    gridHelper.position.y = 0.05;
    scene.add(gridHelper);

    // Lander Pad Marker (Center)
    const padGeo = new THREE.CylinderGeometry(1.2, 1.4, 0.4, 16);
    const padMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
    const pad = new THREE.Mesh(padGeo, padMat);
    pad.position.y = 0.2;
    scene.add(pad);

    // 4. Sky Dome Wireframe
    const domeGeo = new THREE.SphereGeometry(30, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2);
    const domeMat = new THREE.MeshBasicMaterial({
      color: 0x1e293b,
      wireframe: true,
      transparent: true,
      opacity: 0.25,
    });
    const dome = new THREE.Mesh(domeGeo, domeMat);
    scene.add(dome);

    // 5. Sun Mesh & Light
    const sunGeo = new THREE.SphereGeometry(1.4, 16, 16);
    const sunMat = new THREE.MeshBasicMaterial({ color: 0xfbbf24 });
    const sunMesh = new THREE.Mesh(sunGeo, sunMat);
    scene.add(sunMesh);
    sunMeshRef.current = sunMesh;

    // Sun Beam Line
    const beamMatSun = new THREE.LineBasicMaterial({ color: 0xf59e0b, linewidth: 2 });
    const beamGeoSun = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0.2, 0), new THREE.Vector3(0, 10, 0)]);
    const sunBeam = new THREE.Line(beamGeoSun, beamMatSun);
    scene.add(sunBeam);
    sunBeamRef.current = sunBeam;

    // 6. Earth Mesh
    const earthGeo = new THREE.SphereGeometry(1.6, 16, 16);
    const earthMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
    const earthMesh = new THREE.Mesh(earthGeo, earthMat);
    scene.add(earthMesh);
    earthMeshRef.current = earthMesh;

    // Earth Beam Line
    const beamMatEarth = new THREE.LineBasicMaterial({ color: 0x38bdf8, linewidth: 2 });
    const beamGeoEarth = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0.2, 0), new THREE.Vector3(0, 10, 0)]);
    const earthBeam = new THREE.Line(beamGeoEarth, beamMatEarth);
    scene.add(earthBeam);
    earthBeamRef.current = earthBeam;

    // Mouse Interaction for rotating the 3D scene
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;
    let rotationAngleX = 0;
    let rotationAngleY = 0.5;

    const onMouseDown = (e) => {
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const onMouseMove = (e) => {
      if (!isDragging) return;
      const dx = e.clientX - prevMouseX;
      const dy = e.clientY - prevMouseY;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;

      rotationAngleX += dx * 0.01;
      rotationAngleY = Math.max(0.1, Math.min(1.4, rotationAngleY + dy * 0.01));

      const radius = 60;
      camera.position.x = radius * Math.sin(rotationAngleX) * Math.cos(rotationAngleY);
      camera.position.y = radius * Math.sin(rotationAngleY);
      camera.position.z = radius * Math.cos(rotationAngleX) * Math.cos(rotationAngleY);
      camera.lookAt(0, 4, 0);
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    const domElement = renderer.domElement;
    domElement.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    // Animation Loop
    let animId;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!container || !rendererRef.current || !cameraRef.current) return;
      const newW = container.clientWidth;
      const newH = container.clientHeight || 340;
      cameraRef.current.aspect = newW / newH;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(newW, newH);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      domElement.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, []);

  // Update Crater Horizon 3D ring whenever activeSite changes
  useEffect(() => {
    if (!sceneRef.current || !activeSite) return;
    const scene = sceneRef.current;

    if (craterMeshRef.current) {
      scene.remove(craterMeshRef.current);
    }

    const horizon = activeSite.horizon_profile || [];
    const count = horizon.length;
    if (count === 0) return;

    // Create 3D wall representing crater skyline obstacles
    const radius = 24.5;
    const vertices = [];
    const indices = [];

    for (let i = 0; i <= count; i++) {
      const idx = i % count;
      const elevDeg = horizon[idx];
      // Convert azimuth to angle around circle
      const azRad = (idx * (360 / count) * Math.PI) / 180;
      const x = radius * Math.sin(azRad);
      const z = -radius * Math.cos(azRad);

      // Height proportional to elevation angle (deg)
      const h = Math.max(0.2, (elevDeg / 10) * 8);

      // Bottom vertex
      vertices.push(x, 0, z);
      // Top vertex
      vertices.push(x, h, z);
    }

    for (let i = 0; i < count; i++) {
      const b1 = i * 2;
      const t1 = b1 + 1;
      const b2 = (i + 1) * 2;
      const t2 = b2 + 1;

      // Triangle 1
      indices.push(b1, t1, b2);
      // Triangle 2
      indices.push(b2, t1, t2);
    }

    const geom = new THREE.BufferGeometry();
    geom.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    geom.setIndex(indices);
    geom.computeVertexNormals();

    const mat = new THREE.MeshBasicMaterial({
      color: 0x475569,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.6,
      wireframe: false,
    });

    const craterMesh = new THREE.Mesh(geom, mat);
    scene.add(craterMesh);
    craterMeshRef.current = craterMesh;
  }, [activeSite]);

  // Update Sun and Earth 3D positions whenever currentStep updates
  useEffect(() => {
    if (!currentStep) return;

    const rDome = 28;
    const toVector3 = (azDeg, elDeg) => {
      const azRad = (azDeg * Math.PI) / 180;
      const elRad = (elDeg * Math.PI) / 180;
      const y = rDome * Math.sin(elRad);
      const horizR = rDome * Math.cos(elRad);
      const x = horizR * Math.sin(azRad);
      const z = -horizR * Math.cos(azRad);
      return new THREE.Vector3(x, y, z);
    };

    const sunPos = toVector3(currentStep.sun_azimuth, currentStep.sun_elevation);
    const earthPos = toVector3(currentStep.earth_azimuth, currentStep.earth_elevation);

    if (sunMeshRef.current) {
      sunMeshRef.current.position.copy(sunPos);
    }

    if (earthMeshRef.current) {
      earthMeshRef.current.position.copy(earthPos);
    }

    // Update Sun beam
    if (sunBeamRef.current) {
      const geo = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0.2, 0), sunPos]);
      sunBeamRef.current.geometry.dispose();
      sunBeamRef.current.geometry = geo;
      sunBeamRef.current.material.color.set(currentStep.is_sunlit ? 0xfbbf24 : 0xef4444);
    }

    // Update Earth beam
    if (earthBeamRef.current) {
      const geo = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0.2, 0), earthPos]);
      earthBeamRef.current.geometry.dispose();
      earthBeamRef.current.geometry = geo;
      earthBeamRef.current.material.color.set(currentStep.is_dte_active ? 0x38bdf8 : 0xef4444);
    }
  }, [currentStep]);

  const resetCamera = () => {
    if (cameraRef.current) {
      cameraRef.current.position.set(0, 35, 55);
      cameraRef.current.lookAt(0, 5, 0);
    }
  };

  return (
    <div className="bg-space-900 border border-slate-800 rounded-2xl p-4 lg:p-6 shadow-xl mb-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-3">
        <div>
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-white">
              3D Local Celestial Dome & Ray-Tracing Visualizer
            </h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-950/70 border border-blue-500/30 text-blue-300">
              Three.js WebGL Engine
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            {mode === 'planner'
              ? 'Local topocentric horizon dome at the landing site. Shaded wall represents 3D crater rim skyline. Drag with mouse to orbit view.'
              : 'Interact in 3D! Yellow sphere is the Sun shining rays down to the lander. Blue sphere is planet Earth. If the beam turns red, crater mountains are blocking the view!'}
          </p>
        </div>

        <button
          onClick={resetCamera}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-space-850 hover:bg-slate-800 border border-slate-700 text-xs font-mono text-slate-300 transition"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Vantage Point</span>
        </button>
      </div>

      {/* 3D WebGL Canvas Container */}
      <div className="relative w-full h-80 rounded-2xl border border-slate-800 overflow-hidden bg-[#040711]">
        <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

        {/* HUD Overlay Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 pointer-events-none">
          <div className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-space-950/80 border border-slate-800 text-[11px] font-mono backdrop-blur-sm">
            <Sun className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-slate-300">Sun:</span>
            <span className="font-bold text-amber-300">
              El {currentStep?.sun_elevation}° | Az {currentStep?.sun_azimuth}°
            </span>
          </div>

          <div className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-space-950/80 border border-slate-800 text-[11px] font-mono backdrop-blur-sm">
            <Radio className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-slate-300">Earth:</span>
            <span className="font-bold text-cyan-300">
              El {currentStep?.earth_elevation}° | Az {currentStep?.earth_azimuth}°
            </span>
          </div>
        </div>

        {/* 3D Instructions watermark */}
        <div className="absolute bottom-3 right-3 text-[10px] font-mono text-slate-500 bg-space-950/80 px-2 py-0.5 rounded border border-slate-800 pointer-events-none">
          Click & Drag to Orbit 3D Sky Dome
        </div>
      </div>
    </div>
  );
}
