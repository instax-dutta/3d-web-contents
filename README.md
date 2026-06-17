# three-react-ui

> Drop-in React components for Three.js 3D web experiences — copy-paste templates with zero package maintenance debt.

[![React Version](https://img.shields.io/badge/react-18%2B-blue?style=flat-square)](https://react.dev)
[![Three.js Version](https://img.shields.io/badge/three.js-0.128.0-black?style=flat-square)](https://threejs.org)
[![License](https://img.shields.io/badge/license-MIT-green?style=flat-square)](#-license)

---

## 🚀 One-Liner Installation

Skip dependency installation bottlenecks. Fetch components directly into your local workspace on demand:

```bash
# Run interactive CLI picker
curl -fsSL https://raw.githubusercontent.com/instax-dutta/3d-web-contents/main/install.sh | bash
```

Or target a specific component immediately:

```bash
# Fetch CSS3DCard directly
curl -fsSL https://raw.githubusercontent.com/instax-dutta/3d-web-contents/main/install.sh | bash -s CSS3DCard
```

> [!TIP]
> **AI Copilot Integration:** Upon download completion, the script outputs a tailored prompt block. Copy and paste it directly into **Cursor**, **Claude Code**, or any AI agent to drop the component into your UI layout instantly.

---

## 🛠 Zero-Dependency Philosophy (Risk Reversal)

Traditional npm package libraries create dependency locks, security vulnerabilities, and build-tool collisions. `three-react-ui` reverses this risk:

1. **You Own the Code:** The installer drops raw, unminified source code directly into your component directory.
2. **Zero Maintenance Debt:** No package updates to track. If you want to change a behavior, edit the file directly.
3. **Optimized and Lean:** Copy only what you use, keeping your production bundle clean and tree-shakeable.

---

## 📦 Curated 3D Component Library

### 1. CSS3DCard
A 3D product card that explodes into 5 floating layers on hover with spring-like physics and click Y-axis rotation.

```jsx
import CSS3DCard from './components/CSS3DCard'

export default function App() {
  return (
    <CSS3DCard
      title="NEXUS DRIVE"
      description="Accelerated neural computation cores equipped with liquid state quantum-dot memory."
      badge="QUANTUM"
      accentColor="#00ffff"
    />
  )
}
```

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `title` | `string` | *Required* | Bold title printed on the text layer |
| `description` | `string` | *Required* | Description paragraph printed on the text layer |
| `badge` | `string` | *Required* | Accent tag printed inside the neon badge pill |
| `accentColor` | `string` | `"#00ffff"` | Hex color string driving card outlines and glow borders |

---

### 2. GeometryRepel
Twelve auto-rotating 3D shapes (Icosahedrons, Toruses, Octahedrons) that disperse dynamically in world space as the mouse cursor approaches, smoothly drifting back to their home positions when the cursor leaves.

```jsx
import GeometryRepel from './components/GeometryRepel'

export default function App() {
  return (
    <GeometryRepel
      count={12}
      repelRadius={150}
    />
  )
}
```

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `count` | `number` | `12` | Total number of floating meshes to render and animate |
| `repelRadius` | `number` | `150` | Maximum radius (world units) for shape-to-mouse repel reaction |

---

### 3. LightingReflection
A metallic sphere sitting over a real-time projected ground-plane mirror reflection (via WebGLRenderTarget) featuring PointLight mouse tracking and fake additive bloom halos.

```jsx
import LightingReflection from './components/LightingReflection'

export default function App() {
  return (
    <LightingReflection
      lightColor="#00ffff"
      metalness={1.0}
      roughness={0.1}
    />
  )
}
```

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `lightColor` | `string` | `"#00ffff"` | Hex color string for PointLight and fake bloom halo emissions |
| `metalness` | `number` | `1.0` | Material metalness scale of the central sphere mesh `[0.0 - 1.0]` |
| `roughness` | `number` | `0.1` | Surface roughness of the central sphere mesh `[0.0 - 1.0]` |

---

### 4. BarChart3D
An interactive 3D extruded bar chart container with responsive mouse hover tilt logic, built entirely using pure CSS transforms and staggered height-growth keyframes.

```jsx
import BarChart3D from './components/BarChart3D'

const chartData = [
  { label: 'JAN', value: 140, color: '#00ffff' },
  { label: 'FEB', value: 190, color: '#ff00ff' }
]

export default function App() {
  return <BarChart3D data={chartData} />
}
```

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `data` | `Array` | *Required* | Array of bar shapes: `{ label: string, value: number, color: string }` |

---

### 5. TunnelScroll
Scroll-driven camera flight through neon wireframe torus rings with motion trail fades, mapped to a 500vh scroll container.

```jsx
import React, { useRef } from 'react'
import TunnelScroll from './components/TunnelScroll'

export default function App() {
  const containerRef = useRef(null)
  
  return (
    <div ref={containerRef} style={{ height: '100vh', overflowY: 'auto' }}>
      <TunnelScroll
        ringCount={40}
        colorA="#00ffff"
        colorB="#ff00ff"
        trailOpacity={0.15}
        scrollContainer={containerRef}
      />
    </div>
  )
}
```

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `ringCount` | `number` | `40` | Total number of torus rings along the tunnel path |
| `colorA` | `string` | `"#00ffff"` | Hex starting color for ring gradients |
| `colorB` | `string` | `"#ff00ff"` | Hex ending color for ring gradients |
| `trailOpacity` | `number` | `0.15` | Alpha overlay transparency for rendering motion trail |
| `scrollContainer` | `RefObject` | `null` | Scrollable parent element ref (defaults to window) |

---

## ⚓ useThreeScene Hook

The `useThreeScene` hook isolates standard WebGL initialization, ResizeObserver bindings, IntersectionObserver viewport checks, and automatic asset disposal.

```javascript
import { useThreeScene } from './hooks/useThreeScene'

useThreeScene({ canvasRef, setup, animate, deps })
```

### Parameters
* **`canvasRef`**: `RefObject<HTMLCanvasElement>` - Reference to the target `<canvas>` element.
* **`setup(scene, camera, renderer)`**: `Function` - Mount callback. Returns an object `{ geometries[], materials[], textures[], targets[] }` for automatic unmount disposal.
* **`animate(scene, camera, renderer, { time, delta })`**: `Function` - Called on every requestAnimationFrame loop when the canvas container is in view.
* **`deps`**: `Array` - Re-trigger dependency array for hook effect updates.

---

## 💻 Local Showcase Demo

To run the interactive showcase layout locally:

```bash
# 1. Clone repository
git clone https://github.com/instax-dutta/3d-web-contents.git
cd 3d-web-contents

# 2. Install dependencies
npm install

# 3. Launch Vite Dev Server
npm run dev
```

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
