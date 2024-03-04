import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three-orbit-controls";

const Globe = () => {
  const containerRef = useRef(null);
  const canvas3DRef = useRef(null);
  const canvas2DRef = useRef(null);
  const popupRef = useRef(null);

  const [renderer, setRenderer] = useState(null);
  const [scene, setScene] = useState(null);
  const [camera, setCamera] = useState(null);
  const [rayCaster, setRayCaster] = useState(null);
  const [controls, setControls] = useState(null);
  const [group] = useState(new THREE.Group());
  const [overlayCtx, setOverlayCtx] = useState(null);
  const [coordinates2D, setCoordinates2D] = useState([0, 0]);
  const [pointerPos, setPointerPos] = useState(null);
  const [clock] = useState(new THREE.Clock());
  const [mouse, setMouse] = useState(new THREE.Vector2(-1, -1));
  const [pointer] = useState(new THREE.Mesh());
  const [globe, setGlobe] = useState(null);
  const [globeMesh, setGlobeMesh] = useState(null);
  const [popupVisible, setPopupVisible] = useState(false);
  const [earthTexture, setEarthTexture] = useState(null);
  const [mapMaterial, setMapMaterial] = useState(null);
  const [popupOpen, setPopupOpen] = useState(false);
  const [popupClose, setPopupClose] = useState(false);
  const [dragged, setDragged] = useState(false);

  useEffect(() => {
    initScene();
    window.addEventListener("resize", updateSize);

    return () => {
      window.removeEventListener("resize", updateSize);
    };
  }, []);

  const initScene = () => {
    setRenderer(new THREE.WebGLRenderer({ canvas: canvas3DRef.current, alpha: true }));
    

    setScene(new THREE.Scene());
    setCamera(new THREE.OrthographicCamera(-1.1, 1.1, 1.1, -1.1, 0, 3));
    camera.position.z = 1.1;

    setRayCaster(new THREE.Raycaster());
    rayCaster.far = 1.15;
    setOverlayCtx(canvas2DRef.current.getContext("2d"));
    setControls(createOrbitControls());
    setPopupVisible(false);

    new THREE.TextureLoader().load(
      "https://ksenia-k.com/img/earth-map-colored.png",
      (mapTex) => {
        setEarthTexture(mapTex);
        earthTexture.repeat.set(1, 1);
        createGlobe();
        createPointer();
        createPopupTimelines();
        addCanvasEvents();
        updateSize();
        render();
      }
    );
  };

  const createOrbitControls = () => {
    const newControls = new OrbitControls(camera, canvas3DRef.current);
    newControls.enablePan = false;
    newControls.enableZoom = false;
    newControls.enableDamping = true;
    newControls.minPolarAngle = 0.4 * Math.PI;
    newControls.maxPolarAngle = 0.4 * Math.PI;
    newControls.autoRotate = true;

    let timestamp;
    newControls.addEventListener("start", () => {
      timestamp = Date.now();
    });
    newControls.addEventListener("end", () => {
      setDragged((Date.now() - timestamp) > 600);
    });

    setControls(newControls);
  };

  const createGlobe = () => {
    const globeGeometry = new THREE.IcosahedronGeometry(1, 22);
    setMapMaterial(new THREE.ShaderMaterial({
      vertexShader: document.getElementById("vertex-shader-map").textContent,
      fragmentShader: document.getElementById("fragment-shader-map").textContent,
      uniforms: {
        u_map_tex: { type: "t", value: earthTexture },
        u_dot_size: { type: "f", value: 0 },
        u_pointer: { type: "v3", value: new THREE.Vector3(0, 0, 1) },
        u_time_since_click: { value: 0 },
      },
      alphaTest: false,
      transparent: true
    }));

    setGlobe(new THREE.Points(globeGeometry, mapMaterial));
    scene.add(globe);

    const newGlobeMesh = new THREE.Mesh(globeGeometry, new THREE.MeshBasicMaterial({
      color: 0x222222,
      transparent: true,
      opacity: 0.05
    }));
    scene.add(newGlobeMesh);
    setGlobeMesh(newGlobeMesh);
  };

  const createPointer = () => {
    const geometry = new THREE.SphereGeometry(0.04, 16, 16);
    const material = new THREE.MeshBasicMaterial({
      color: 0x00000,
      transparent: true,
      opacity: 0
    });
    pointer.geometry.dispose();
    pointer.geometry = geometry;
    pointer.material.dispose();
    pointer.material = material;
    scene.add(pointer);
  };

  const updateOverlayGraphic = () => {
    let activePointPosition = pointer.position.clone();
    activePointPosition.applyMatrix4(globe.matrixWorld);
    const activePointPositionProjected = activePointPosition.clone();
    activePointPositionProjected.project(camera);
    const newCoordinates2D = [
      (activePointPositionProjected.x + 1) * containerRef.current.offsetWidth * 0.5,
      (1 - activePointPositionProjected.y) * containerRef.current.offsetHeight * 0.5,
    ];
    setCoordinates2D(newCoordinates2D);

    const matrixWorldInverse = controls.object.matrixWorldInverse;
    activePointPosition.applyMatrix4(matrixWorldInverse);

    if (activePointPosition.z > -1) {
      if (!popupVisible) {
        setPopupVisible(true);
        showPopupAnimation(false);
      }

      let popupX = newCoordinates2D[0];
      popupX -= (activePointPositionProjected.x * containerRef.current.offsetWidth * 0.3);

      let popupY = newCoordinates2D[1];
      const upDown = (activePointPositionProjected.y > 0.6);
      popupY += (upDown ? 20 : -20);

      popupRef.current.style.transform = `translate(${popupX}px, ${popupY}px) translate(-35%, ${upDown ? "0%" : "-100%"})`;

      popupY += (upDown ? -5 : 5);
      const curveMidX = popupX + activePointPositionProjected.x * 100;
      const curveMidY = popupY + (upDown ? -0.5 : 0.1) * newCoordinates2D[1];

      drawPopupConnector(newCoordinates2D[0], newCoordinates2D[1], curveMidX, curveMidY, popupX, popupY);
    } else {
      if (popupVisible) {
        setPopupOpen(false);
        setPopupClose(true);
      }
      setPopupVisible(false);
    }
  };

  const addCanvasEvents = () => {
    containerRef.current.addEventListener("mousemove", (e) => {
      updateMousePosition(e.clientX, e.clientY);
    });

    containerRef.current.addEventListener("click", (e) => {
      if (!dragged) {
        updateMousePosition(
          e.targetTouches ? e.targetTouches[0].pageX : e.clientX,
          e.targetTouches ? e.targetTouches[0].pageY : e.clientY
        );

        const res = checkIntersects();
        if (res.length) {
          setPointerPos(res[0].face.normal.clone());
          pointer.position.set(res[0].face.normal.x, res[0].face.normal.y, res[0].face.normal.z);
          mapMaterial.uniforms.u_pointer.value = res[0].face.normal;
          popupRef.current.innerHTML = cartesianToLatLong();
          showPopupAnimation(true);
          clock.start();
        }
      }
    });

    function updateMousePosition(eX, eY) {
      setMouse({
        x: (eX - containerRef.current.offsetLeft) / containerRef.current.offsetWidth * 2 - 1,
        y: -((eY - containerRef.current.offsetTop) / containerRef.current.offsetHeight) * 2 + 1,
      });
    }
  };

  const checkIntersects = () => {
    rayCaster.setFromCamera(mouse, camera);
    const intersects = rayCaster.intersectObject(globeMesh);
    if (intersects.length) {
      document.body.style.cursor = "pointer";
    } else {
      document.body.style.cursor = "auto";
    }
    return intersects;
  };

  const render = () => {
    mapMaterial.uniforms.u_time_since_click.value = clock.getElapsedTime();
    checkIntersects();
    if (pointer) {
      updateOverlayGraphic();
    }
    controls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(render);
  };

  const updateSize = () => {
    const minSide = 0.65 * Math.min(window.innerWidth, window.innerHeight);
    containerRef.current.style.width = minSide + "px";
    containerRef.current.style.height = minSide + "px";
    renderer.setSize(minSide, minSide);
    canvas2DRef.current.width = canvas2DRef.current.height = minSide;
    mapMaterial.uniforms.u_dot_size.value = 0.04 * minSide;
  };

  const createPopupTimelines = () => {
    setPopupOpen(true);
    setPopupClose(false);
  };

  const showPopupAnimation = (lifted) => {
    if (lifted) {
      let positionLifted = pointer.position.clone();
      positionLifted.multiplyScalar(1.3);
      gsap.from(pointer.position, {
        duration: 0.25,
        x: positionLifted.x,
        y: positionLifted.y,
        z: positionLifted.z,
        ease: "power3.out",
      });
    }
    setPopupClose(true);
    setPopupOpen(false);
  };

  // Popup content
  const cartesianToLatLong = () => {
    const pos = pointer.position;
    const lat = 90 - Math.acos(pos.y) * 180 / Math.PI;
    const lng = (270 + Math.atan2(pos.x, pos.z) * 180 / Math.PI) % 360 - 180;
    return formatCoordinate(lat, 'N', 'S') + ",&nbsp;" + formatCoordinate(lng, 'E', 'W');
  };

  const formatCoordinate = (coordinate, positiveDirection, negativeDirection) => {
    const direction = coordinate >= 0 ? positiveDirection : negativeDirection;
    return `${Math.abs(coordinate).toFixed(4)}°&nbsp${direction}`;
  };

  // Overlay (line between pointer and popup)
  const drawPopupConnector = (startX, startY, midX, midY, endX, endY) => {
    overlayCtx.strokeStyle = "#000000";
    overlayCtx.lineWidth = 3;
    overlayCtx.lineCap = "round";
    overlayCtx.clearRect(0, 0, containerRef.current.offsetWidth, containerRef.current.offsetHeight);
    overlayCtx.beginPath();
    overlayCtx.moveTo(startX, startY);
    overlayCtx.quadraticCurveTo(midX, midY, endX, endY);
    overlayCtx.stroke();
  };

  return (
    <div className="page">
      <div className="title">click to add a pointer</div>
      <div className="globe-wrapper" ref={containerRef}>
        <canvas id="globe-3d" ref={canvas3DRef}></canvas>
        <canvas id="globe-2d-overlay" ref={canvas2DRef}></canvas>
        <div id="globe-popup-overlay">
          <div className="globe-popup" ref={popupRef}></div>
        </div>
      </div>
    </div>
  );
};

export default Globe;
