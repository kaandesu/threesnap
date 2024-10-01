import "./style.css";
import * as THREE from "three";

interface Page {
  dark?: boolean;
  x: number;
  y: number;
  z: number;
}

// TODO: ask for a mesh or for a model
interface Config {
  fixedZ?: number;
  pages: Page[];
}

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

  const geometry = new THREE.BoxGeometry();
  const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
  const cube = new THREE.Mesh(geometry, material);
  scene.add(cube);
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

    const scrollFraction = fractionalPageIndex - startIndex;

    cube.position.x = THREE.MathUtils.lerp(
      startPos.x,
      endPos.x,
      scrollFraction
    );
    cube.position.y = THREE.MathUtils.lerp(
      startPos.y,
      endPos.y,
      scrollFraction
    );
    cube.position.z = THREE.MathUtils.lerp(
      startPos.z,
      endPos.z,
      scrollFraction
    );

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
