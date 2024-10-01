import "./style.css";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

interface Page {
  dark?: boolean;
  x: number;
  y: number;
  z: number;
  rotation?: { x: number; y: number; z: number };
  scale?: { x: number; y: number; z: number };
}

// TODO: ask for a mesh or for a model
interface Config {
  fixedZ?: number;
  pages: Page[];
}

const degToRad = (deg: number): number => {
  return (deg * 3.14) / 180;
};

const percentageToRotation = (rotation: {
  x: number;
  y: number;
  z: number;
}) => {
  return {
    x: degToRad(rotation.x),
    y: degToRad(rotation.y),
    z: degToRad(rotation.z),
  };
};

const percentageToScale = (scale: { x: number; y: number; z: number }) => {
  return {
    x: scale.x,
    y: scale.y,
    z: scale.z,
  };
};

// Function to create page indicators
const createThreesnap = (config: Config): void => {
  const container = document.querySelector<HTMLDivElement>(
    ".threesnap .page-container"
  );
  const pages = document.querySelectorAll<HTMLDivElement>(".threesnap .page");
  const indicatorField = document.getElementById(
    "threesnap-indicator-field"
  ) as HTMLDivElement;

  if (!container || !indicatorField) {
    console.error("Required elements are not found in the DOM.");
    return;
  }

  let currentPageIndex = 0;
  const fieldHeight = pages.length * 20; // 20px for each page
  indicatorField.style.height = `${fieldHeight}px`;

  indicatorField.innerHTML = "";

  pages.forEach((_, index) => {
    const indicator = document.createElement("div");
    indicator.classList.add("indicator");
    if (index === currentPageIndex) {
      indicator.classList.add("active");
    }
    indicatorField.appendChild(indicator);
  });

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  const renderer = new THREE.WebGLRenderer({ alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.getElementById("three-container")?.appendChild(renderer.domElement);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight.position.set(10, 10, 10); // Position the light
  scene.add(directionalLight);

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // Soft white light
  scene.add(ambientLight);

  const loader = new GLTFLoader();
  let model: THREE.Object3D;

  // Load the GLB model
  loader.load(
    "./apollo_11_command_module_exterior.glb", // replace with the actual path to your .glb file
    function (gltf) {
      model = gltf.scene;
      const {
        x: scaleX,
        y: scaleY,
        z: scaleZ,
      }: {
        x: number;
        y: number;
        z: number;
      } = config.pages[0].scale ?? { x: 1, y: 1, z: 1 };
      model.scale.set(scaleX, scaleY, scaleZ);

      const {
        x: posX,
        y: posY,
        z: posZ,
      }: {
        x: number;
        y: number;
        z: number;
      } = config.pages[0].scale ?? { x: 0, y: 0, z: 0 };
      model.position.set(posX, posY, posZ);

      scene.add(model);
    },
    undefined,
    function (error) {
      console.error("An error happened while loading the model:", error);
    }
  );

  scene.background = null;

  camera.position.z = config.fixedZ ?? 5;

  const percentagePositions = config.pages;
  const scaleFactor = { x: 0.01, y: 0.01, z: 4 };

  const percentageToPosition = (percentage: {
    x: number;
    y: number;
    z: number;
  }) => {
    return {
      x: (percentage.x / 100) * window.innerWidth * scaleFactor.x,
      y: (percentage.y / 100) * window.innerHeight * scaleFactor.y,
      z: (percentage.z / 100) * scaleFactor.z,
    };
  };

  const animate = (): void => {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
  };

  animate();

  container.addEventListener("scroll", () => {
    const viewportHeight = window.innerHeight;
    const scrollPosition = container.scrollTop;
    const viewportCenter = scrollPosition + viewportHeight / 2;

    const fractionalPageIndex = scrollPosition / viewportHeight;

    const floorPageIndex = Math.floor(fractionalPageIndex);
    const ceilPageIndex = Math.ceil(fractionalPageIndex);

    const startIndex = Math.max(0, Math.min(floorPageIndex, pages.length - 1));
    const endIndex = Math.max(0, Math.min(ceilPageIndex, pages.length - 1));

    const startPos = percentageToPosition(percentagePositions[startIndex]);
    const endPos = percentageToPosition(percentagePositions[endIndex]);

    const startRotation = percentageToRotation(
      percentagePositions[startIndex].rotation || { x: 0, y: 0, z: 0 }
    );
    const endRotation = percentageToRotation(
      percentagePositions[endIndex].rotation || { x: 0, y: 0, z: 0 }
    );

    const scrollFraction = fractionalPageIndex - startIndex;

    model.rotation.x = THREE.MathUtils.lerp(
      startRotation.x,
      endRotation.x,
      scrollFraction
    );
    model.rotation.y = THREE.MathUtils.lerp(
      startRotation.y,
      endRotation.y,
      scrollFraction
    );
    model.rotation.z = THREE.MathUtils.lerp(
      startRotation.z,
      endRotation.z,
      scrollFraction
    );

    // Update scale
    const startScale = percentageToScale(
      percentagePositions[startIndex].scale || { x: 1, y: 1, z: 1 }
    );
    const endScale = percentageToScale(
      percentagePositions[endIndex].scale || { x: 1, y: 1, z: 1 }
    );

    model.scale.x = THREE.MathUtils.lerp(
      startScale.x,
      endScale.x,
      scrollFraction
    );
    model.scale.y = THREE.MathUtils.lerp(
      startScale.y,
      endScale.y,
      scrollFraction
    );
    model.scale.z = THREE.MathUtils.lerp(
      startScale.z,
      endScale.z,
      scrollFraction
    );

    if (model) {
      model.position.x = THREE.MathUtils.lerp(
        startPos.x,
        endPos.x,
        scrollFraction
      );
      model.position.y = THREE.MathUtils.lerp(
        startPos.y,
        endPos.y,
        scrollFraction
      );
      model.position.z = THREE.MathUtils.lerp(
        startPos.z,
        endPos.z,
        scrollFraction
      );
    }

    let closestPageIndex = currentPageIndex;
    let minDistance = Infinity;

    pages.forEach((page, index) => {
      const pageTop = page.offsetTop;
      const pageBottom = pageTop + page.offsetHeight;
      const pageCenter = (pageTop + pageBottom) / 2;

      const distanceToViewportCenter = Math.abs(pageCenter - viewportCenter);
      if (distanceToViewportCenter < minDistance) {
        closestPageIndex = index;
        minDistance = distanceToViewportCenter;
      }
    });

    if (closestPageIndex !== currentPageIndex) {
      updateIndicators(closestPageIndex);
      currentPageIndex = closestPageIndex;
    }
  });

  function updateIndicators(index: number): void {
    const indicators =
      indicatorField.querySelectorAll<HTMLDivElement>(".indicator");
    indicators.forEach((indicator, i) => {
      if (i === index) {
        indicator.classList.add("active");
      } else {
        indicator.classList.remove("active");
      }
    });
  }

  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
};

export { createThreesnap };
