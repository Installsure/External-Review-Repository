'use client';
import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';

const Avatar3D = ({ persona, emotions = {}, visemes = [], isSpeaking = false, className = '' }) => {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const avatarRef = useRef(null);
  const animationIdRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f0f0);
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000,
    );
    camera.position.set(0, 1.6, 2);

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    mountRef.current.appendChild(renderer.domElement);

    // Lighting setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 10, 5);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    scene.add(directionalLight);

    // Create avatar
    createAvatar(scene, persona);

    // Animation loop
    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate);

      // Update avatar animations
      updateAvatarAnimations(emotions, visemes, isSpeaking);

      renderer.render(scene, camera);
    };
    animate();

    // Handle resize
    const handleResize = () => {
      const width = mountRef.current.clientWidth;
      const height = mountRef.current.clientHeight;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    setIsLoaded(true);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  // Create avatar geometry and materials
  const createAvatar = (scene, persona) => {
    const avatarGroup = new THREE.Group();
    avatarRef.current = avatarGroup;

    // Head
    const headGeometry = new THREE.SphereGeometry(0.3, 32, 32);
    const headMaterial = new THREE.MeshLambertMaterial({
      color: getPersonaSkinColor(persona?.id),
    });
    const head = new THREE.Mesh(headGeometry, headMaterial);
    head.position.y = 1.5;
    head.castShadow = true;
    avatarGroup.add(head);

    // Body
    const bodyGeometry = new THREE.CylinderGeometry(0.2, 0.25, 0.8, 8);
    const bodyMaterial = new THREE.MeshLambertMaterial({
      color: getPersonaClothingColor(persona?.id),
    });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.position.y = 0.8;
    body.castShadow = true;
    avatarGroup.add(body);

    // Arms
    const armGeometry = new THREE.CylinderGeometry(0.05, 0.05, 0.6, 8);
    const armMaterial = new THREE.MeshLambertMaterial({
      color: getPersonaSkinColor(persona?.id),
    });

    const leftArm = new THREE.Mesh(armGeometry, armMaterial);
    leftArm.position.set(-0.3, 0.8, 0);
    leftArm.castShadow = true;
    avatarGroup.add(leftArm);

    const rightArm = new THREE.Mesh(armGeometry, armMaterial);
    rightArm.position.set(0.3, 0.8, 0);
    rightArm.castShadow = true;
    avatarGroup.add(rightArm);

    // Eyes
    const eyeGeometry = new THREE.SphereGeometry(0.02, 8, 8);
    const eyeMaterial = new THREE.MeshLambertMaterial({ color: 0x000000 });

    const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    leftEye.position.set(-0.1, 1.55, 0.25);
    avatarGroup.add(leftEye);

    const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    rightEye.position.set(0.1, 1.55, 0.25);
    avatarGroup.add(rightEye);

    // Mouth
    const mouthGeometry = new THREE.SphereGeometry(0.03, 8, 8);
    const mouthMaterial = new THREE.MeshLambertMaterial({ color: 0x8b0000 });
    const mouth = new THREE.Mesh(mouthGeometry, mouthMaterial);
    mouth.position.set(0, 1.45, 0.25);
    avatarGroup.add(mouth);

    // Store references for animation
    avatarRef.current.head = head;
    avatarRef.current.body = body;
    avatarRef.current.leftArm = leftArm;
    avatarRef.current.rightArm = rightArm;
    avatarRef.current.leftEye = leftEye;
    avatarRef.current.rightEye = rightEye;
    avatarRef.current.mouth = mouth;

    scene.add(avatarGroup);
  };

  // Update avatar animations based on emotions and speech
  const updateAvatarAnimations = (emotions, visemes, isSpeaking) => {
    if (!avatarRef.current) return;

    const time = Date.now() * 0.001;
    const { head, body, leftArm, rightArm, leftEye, rightEye, mouth } = avatarRef.current;

    // Breathing animation
    body.scale.y = 1 + Math.sin(time * 2) * 0.02;

    // Emotion-based animations
    if (emotions.joy > 0.5) {
      // Happy animation - slight bounce
      head.position.y = 1.5 + Math.sin(time * 3) * 0.02;
      // Smile - stretch mouth
      mouth.scale.x = 1.5;
      mouth.scale.y = 0.8;
    } else {
      head.position.y = 1.5;
      mouth.scale.set(1, 1, 1);
    }

    if (emotions.trust > 0.7) {
      // Confident posture - slight lean forward
      body.rotation.x = Math.sin(time * 0.5) * 0.05;
    }

    // Speaking animation
    if (isSpeaking && visemes.length > 0) {
      const currentTime = (Date.now() % 10000) / 1000; // 10 second loop
      const currentViseme = visemes.find(
        (v) => currentTime >= v.at / 1000 && currentTime < (v.at + 200) / 1000,
      );

      if (currentViseme) {
        // Lip sync animation
        const visemeScale = {
          A: { x: 1.2, y: 0.8 },
          E: { x: 1.0, y: 0.6 },
          I: { x: 0.8, y: 0.4 },
          O: { x: 1.5, y: 1.2 },
          U: { x: 0.9, y: 1.0 },
          B: { x: 0.6, y: 0.3 },
          P: { x: 0.6, y: 0.3 },
          M: { x: 0.8, y: 0.4 },
        };

        const scale = visemeScale[currentViseme.viseme] || { x: 1, y: 1 };
        mouth.scale.x = scale.x;
        mouth.scale.y = scale.y;
      }
    } else {
      mouth.scale.set(1, 1, 1);
    }

    // Eye movement
    leftEye.position.x = -0.1 + Math.sin(time * 0.5) * 0.02;
    rightEye.position.x = 0.1 + Math.sin(time * 0.5) * 0.02;

    // Gesture animations based on emotions
    if (emotions.anticipation > 0.6) {
      // Excited gesture - arms slightly raised
      leftArm.rotation.x = Math.sin(time * 2) * 0.1;
      rightArm.rotation.x = Math.sin(time * 2) * 0.1;
    } else {
      leftArm.rotation.x = 0;
      rightArm.rotation.x = 0;
    }
  };

  // Get persona-specific colors
  const getPersonaSkinColor = (personaId) => {
    const skinColors = {
      'dating-hero': 0xffdbb5,
      'construction-smart-alec': 0xf4c2a1,
      'customer-service': 0xffe4c4,
      counselor: 0xf5deb3,
      'retail-sales': 0xffebcd,
      'healthcare-assistant': 0xfff8dc,
    };
    return skinColors[personaId] || 0xffdbb5;
  };

  const getPersonaClothingColor = (personaId) => {
    const clothingColors = {
      'dating-hero': 0xe91e63, // Pink
      'construction-smart-alec': 0xff5722, // Orange
      'customer-service': 0x2196f3, // Blue
      counselor: 0x4caf50, // Green
      'retail-sales': 0x9c27b0, // Purple
      'healthcare-assistant': 0x00bcd4, // Cyan
    };
    return clothingColors[personaId] || 0x2196f3;
  };

  return (
    <div
      className={`avatar-3d-container ${className}`}
      style={{ position: 'relative', width: '100%', height: '400px' }}
    >
      <div
        ref={mountRef}
        style={{ width: '100%', height: '100%' }}
        className="rounded-lg overflow-hidden"
      />

      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            <p className="text-sm text-gray-600">Loading Avatar...</p>
          </div>
        </div>
      )}

      {persona && (
        <div className="absolute top-4 left-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
          {persona.displayName}
        </div>
      )}

      {isSpeaking && (
        <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm animate-pulse">
          Speaking
        </div>
      )}
    </div>
  );
};

export default Avatar3D;



