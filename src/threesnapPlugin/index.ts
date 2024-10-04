import "./style.css";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

interface ModelConfig {
  modelPath: string;
  pageConfigs: {
    position: { x: number; y: number; z: number };
    rotation?: { x: number; y: number; z: number };
    scale?: { x: number; y: number; z: number };
  }[];
}

interface Config {
  fixedZ?: number;
  particlesEnabled?: boolean;
  models: ModelConfig[];
}

const degToRad = (deg: number): number => (deg * 3.14) / 180;

const percentageToRotation = (rotation: {
  x: number;
  y: number;
  z: number;
}) => ({
  x: degToRad(rotation.x),
  y: degToRad(rotation.y),
  z: degToRad(rotation.z),
});

const percentageToScale = (scale: { x: number; y: number; z: number }) => ({
  x: scale.x,
  y: scale.y,
  z: scale.z,
});

// Function to create page indicators
const createThreesnap = (config: Config): void => {
  const container = document.querySelector<HTMLDivElement>(
    ".threesnap .page-container"
  );
  if (!container) {
    console.error("Required elements are not found in the DOM.");
    return;
  }

  const totalPages = config.models[0].pageConfigs.length;

  let currentPageIndex = 0;
  const fieldHeight = totalPages * 20; // 20px for each page
  const indicatorField = document.getElementById(
    "threesnap-indicator-field"
  ) as HTMLDivElement;

  if (!container || !indicatorField) {
    console.error("Required elements are not found in the DOM.");
    return;
  }
  indicatorField.style.height = `${fieldHeight}px`;

  indicatorField.innerHTML = "";

  Array.from({ length: totalPages }).forEach((_, index) => {
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
  directionalLight.position.set(10, 10, 10);
  scene.add(directionalLight);

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);

  const loader = new GLTFLoader();
  const models: THREE.Object3D[] = [];

  config.models.forEach((modelConfig) => {
    loader.load(
      modelConfig.modelPath,
      (gltf) => {
        const model = gltf.scene;
        scene.add(model);
        models.push(model);

        // Set the initial position, rotation, and scale for each model based on the first page config
        const initialConfig = modelConfig.pageConfigs[0]; // First page config

        const initialPosition = percentageToPosition(initialConfig.position);
        model.position.set(
          initialPosition.x,
          initialPosition.y,
          initialPosition.z
        );

        const initialRotation = percentageToRotation(
          initialConfig.rotation || { x: 0, y: 0, z: 0 }
        );
        model.rotation.set(
          initialRotation.x,
          initialRotation.y,
          initialRotation.z
        );

        const initialScale = percentageToScale(
          initialConfig.scale || { x: 1, y: 1, z: 1 }
        );
        model.scale.set(initialScale.x, initialScale.y, initialScale.z);
      },
      undefined,
      (error) => {
        console.error("An error happened while loading the model:", error);
      }
    );
  });

  scene.background = null;
  camera.position.z = config.fixedZ ?? 5;

  const scaleFactor = { x: 0.01, y: 0.01, z: 4 };
  const percentageToPosition = (percentage: {
    x: number;
    y: number;
    z: number;
  }) => ({
    x: (percentage.x / 100) * window.innerWidth * scaleFactor.x,
    y: (percentage.y / 100) * window.innerHeight * scaleFactor.y,
    z: (percentage.z / 100) * scaleFactor.z,
  });

  const animate = (): void => {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
  };

  animate();

  function addStar() {
    const geometry = new THREE.SphereGeometry(0.2, 24, 24);
    const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
    const star = new THREE.Mesh(geometry, material);

    // Generate random positions for x, y, and z within a spread of 100 units
    const [x, y, z] = Array.from({ length: 3 }, () =>
      THREE.MathUtils.randFloatSpread(100)
    );

    star.position.set(x, y, z);
    scene.add(star);
  }

  if (config.particlesEnabled) Array.from({ length: 200 }).forEach(addStar);

  container.addEventListener("scroll", () => {
    const viewportHeight = window.innerHeight;
    const scrollPosition = container.scrollTop;

    // Determine the fractional page index
    const fractionalPageIndex = scrollPosition / viewportHeight;
    const currentPage = Math.floor(fractionalPageIndex); // Get the current page index
    const nextPageThreshold = currentPage + 0.5; // Set the halfway threshold

    // Update the indicator when halfway to the next page
    if (fractionalPageIndex >= nextPageThreshold) {
      updateIndicators(currentPage + 1); // Activate the next indicator
    } else {
      updateIndicators(currentPage); // Keep the current indicator active
    }

    const floorPageIndex = Math.floor(fractionalPageIndex);
    const ceilPageIndex = Math.ceil(fractionalPageIndex);

    const startIndex = Math.max(0, Math.min(floorPageIndex, totalPages - 1));
    const endIndex = Math.max(0, Math.min(ceilPageIndex, totalPages - 1));

    const scrollFraction = fractionalPageIndex - startIndex;

    // const magicConstant = 5; // Adjust this constant for desired camera downward movement
    // const baseY = 5; // Base Y position for the camera
    // const rotationRadius = 10;
    // Calculate the camera's angle and new position
    // const angle = fractionalPageIndex * (Math.PI / totalPages); // Rotate based on total pages
    // const cameraX = rotationRadius * Math.cos(angle);
    // const cameraZ = rotationRadius * Math.sin(angle);

    // Update camera position
    // camera.position.set(
    //   cameraX,
    //   baseY - (scrollPosition / viewportHeight) * magicConstant,
    //   cameraZ
    // );
    // camera.lookAt(0, 0, 0); // Make the camera look at the center

    models.forEach((model, modelIndex) => {
      const modelConfig = config.models[modelIndex];
      const startConfig =
        modelConfig.pageConfigs[startIndex] || modelConfig.pageConfigs[0];
      const endConfig = modelConfig.pageConfigs[endIndex] || startConfig;

      const startPos = percentageToPosition(startConfig.position);
      const endPos = percentageToPosition(endConfig.position);

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

      const startRotation = percentageToRotation(
        startConfig.rotation || { x: 0, y: 0, z: 0 }
      );
      const endRotation = percentageToRotation(
        endConfig.rotation || { x: 0, y: 0, z: 0 }
      );

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

      const startScale = percentageToScale(
        startConfig.scale || { x: 1, y: 1, z: 1 }
      );
      const endScale = percentageToScale(
        endConfig.scale || { x: 1, y: 1, z: 1 }
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
    });

    let minDistance = Infinity;

    const totalModels = config.models.length; // Assuming you have this in your config
    const viewportCenter = scrollPosition + viewportHeight / 2;

    let closestModelIndex = -1;

    // Iterate over the models' configurations
    Array.from({ length: totalModels }).forEach((_, index) => {
      // Assuming each model has a position in the configuration
      const modelConfig = config.models[index].pageConfigs; // Get the model's configurations
      const modelCenterY = modelConfig[0].position.y; // Change this according to your needs

      // Calculate the distance to the viewport center
      const distanceToViewportCenter = Math.abs(modelCenterY - viewportCenter);
      if (distanceToViewportCenter < minDistance) {
        closestModelIndex = index;
        minDistance = distanceToViewportCenter;
      }
    });
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
