import "./style.css";
import * as THREE from "three";

// Function to create page indicators
const createPageIndicators = (): void => {
  const container = document.querySelector<HTMLDivElement>(
    ".threesnap-page-container"
  );
  const pages = document.querySelectorAll<HTMLDivElement>(".threesnap-page");
  const indicatorField = document.getElementById(
    "indicator-field"
  ) as HTMLDivElement;

  if (!container || !indicatorField) {
    console.error("Required elements are not found in the DOM.");
    return;
  }

  let currentPageIndex = 0;
  const fieldHeight = pages.length * 20; // 20px for each page
  indicatorField.style.height = `${fieldHeight}px`;

  // Clear any existing indicators
  indicatorField.innerHTML = "";

  // Create indicators
  pages.forEach((_, index) => {
    const indicator = document.createElement("div");
    indicator.classList.add("indicator");
    if (index === currentPageIndex) {
      indicator.classList.add("active");
    }
    indicatorField.appendChild(indicator);
  });

  // Three.js setup
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

  camera.position.z = 5;

  // Page-specific positions for the cube in percentages
  const percentagePositions = [
    { x: 0, y: 0, z: 0 }, // 50% for page 1
    { x: 30, y: 25, z: -120 }, // 60% for page 2
    { x: 0, y: 0, z: 20 }, // 40% for page 3
    { x: -25, y: -35, z: 40 }, // 80% for page 4
  ];

  // Scaling factors for converting percentages to actual positions
  const scaleFactor = { x: 0.01, y: 0.01, z: 4 }; // Adjust this to control the movement range

  // Helper function to convert percentage to actual coordinates
  const percentageToPosition = (percentage: {
    x: number;
    y: number;
    z: number;
  }) => {
    return {
      x: (percentage.x / 100) * window.innerWidth * scaleFactor.x,
      y: (percentage.y / 100) * window.innerHeight * scaleFactor.y,
      z: (percentage.z / 100) * scaleFactor.z, // Adjust 50 to control the range of z
    };
  };

  const animate = (): void => {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
  };

  animate();

  // Update indicators and cube position on scroll

  container.addEventListener("scroll", () => {
    const viewportHeight = window.innerHeight;
    const scrollPosition = container.scrollTop;
    const viewportCenter = scrollPosition + viewportHeight / 2;

    // Calculate the fractional page index
    const fractionalPageIndex = scrollPosition / viewportHeight;

    // Determine the floor and ceiling page indices for interpolation
    const floorPageIndex = Math.floor(fractionalPageIndex);
    const ceilPageIndex = Math.ceil(fractionalPageIndex);

    // Ensure indices are within bounds
    const startIndex = Math.max(0, Math.min(floorPageIndex, pages.length - 1));
    const endIndex = Math.max(0, Math.min(ceilPageIndex, pages.length - 1));

    // Get the start and end positions based on indices
    // Convert percentage positions to actual positions
    const startPos = percentageToPosition(percentagePositions[startIndex]);
    const endPos = percentageToPosition(percentagePositions[endIndex]);

    // Calculate the scroll fraction between the start and end pages
    const scrollFraction = fractionalPageIndex - startIndex;

    // Interpolate the cube's position
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

    // Find the page whose center is closest to the viewport center
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
  // Function to update indicators
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

document.addEventListener("DOMContentLoaded", createPageIndicators);

export { createPageIndicators };
