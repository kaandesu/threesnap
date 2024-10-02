<!-- PROJECT LOGO -->

<div align="center">
  <a href="https://github.com/kaandesu/threesnap">
    <img src="public/logo.webp" alt="Logo" width="110">
  </a>

<br>
<!-- add tech stack badges below -->

![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white) ![Threejs](https://img.shields.io/badge/threejs-black?style=for-the-badge&logo=three.js&logoColor=white) ![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white) ![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white) <!-- Title -->

  <h2 align="center">Threesnap</h2>
   <!-- DESCRIPTION -->
  <p align="center">
    Full screen, snap scroll library with ready-to-use three.js configurations.
    <br><small>
     [Beta version not ready for production, use it with you own risk.]
    </small>
    <br />
    <br />
    <!-- CHANGER IT WITH YOUR GITHUB PAGES LINK -->
    <a href="https://kaandesu.github.io/threesnap/#/">Live Demo</a>
    ·<!-- CHANGER IT WITH YOUR GITHUB ISSUES LINK -->
    <a href="https://github.com/kaandesu/threesnap/issues">Report Bug</a>
    ·<!-- CHANGER IT WITH YOUR GITHUB ISSUES LINK -->
    <a href="https://github.com/kaandesu/threesnap/issues">Request Feature</a>
  </p>
</div>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#features">Features</a></li>
    <li><a href="#installation">Installation</a></li>
    <li><a href="#example">Example</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
  </ol>
</details>

<!-- USAGE EXAMPLES -->

## Usage

To create smooth transitions between different 3D model configurations (position, rotation, and scale) based on page scroll events, you can use the `createThreesnap` function. Models and their transformations (such as position, rotation, and scale) will be adjusted as the user scrolls through different sections of the webpage.

## Features

- **Three.js Integration**: Render and manipulate 3D models using Three.js.
- **Smooth Scroll Transitions**: Change models' positions, rotations, and scales as users scroll between sections.
- **Multi-Model Support**: Each page can have multiple 3D models with unique configurations.
- **Customizable**: Easily customize the camera position, model scale, and page-specific transformations.

## Installation

First, install the required dependencies:

```bash
npm install threesnap
```

### Example

Here's how you can use the library to configure a 3D model across different pages:

```ts
createThreesnap({
  fixedZ: 5,
  pages: [
    {
      models: [
        {
          modelPath: "./path/to/model1.glb",
          position: { x: 0, y: 0, z: 0 },
          rotation: { x: 0, y: 0, z: 0 },
          scale: { x: 0.5, y: 0.5, z: 0.5 },
        },
      ],
    },
    {
      models: [
        {
          modelPath: "./path/to/model2.glb",
          position: { x: 30, y: 25, z: -120 },
          rotation: { x: 45, y: 30, z: 0 },
          scale: { x: 0.7, y: 0.7, z: 0.7 },
        },
      ],
    },
    {
      models: [
        {
          modelPath: "./path/to/model3.glb",
          position: { x: 0, y: 0, z: 20 },
          rotation: { x: 0, y: 90, z: 45 },
          scale: { x: 0.6, y: 0.6, z: 0.6 },
        },
      ],
    },
    {
      models: [
        {
          modelPath: "./path/to/model4.glb",
          position: { x: -25, y: -35, z: -30 },
          rotation: { x: -45, y: 60, z: 30 },
          scale: { x: 0.8, y: 0.8, z: 0.8 },
        },
      ],
    },
  ],
});
```

<!-- CONTRIBUTING -->

## Contributing

Contributions to the project is highly appreciated. If you have any suggestions/questions/requests please consider [opening an issue](https://github.com/kaandesu/threesnap/issues/new). If you want to contribute to the project, fixing an open issue is greatly recommended and appreciated. To see the all contribution rules please check the [contribution rules](CONTRIBUTING.md).

<!-- LICENSE -->

## License

Distributed under the MIT License. See [LICENSE](LICENSE.md) for more information.

<!-- CONTACT -->

## Contact

| Maintainer                              | E-Mail                 |
| --------------------------------------- | ---------------------- |
| [kaandesu](https://github.com/kaandesu) | <kaandesu00@gmail.com> |
