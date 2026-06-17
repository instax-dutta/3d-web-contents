# three-react-ui

> Drop-in React components for Three.js 3D web experiences.

[![React Version](https://img.shields.io/badge/react-18%2B-blue)](https://react.dev)
[![Three.js Version](https://img.shields.io/badge/three.js-0.128.0-black)](https://threejs.org)
[![License](https://img.shields.io/badge/license-MIT-green)](#license)

---

## 🚀 One-Liner Installation

Fetch components directly into your codebase on demand. Run the picker script:

```bash
# Run interactive picker
curl -fsSL https://raw.githubusercontent.com/saiduttaabhishekdash/three-react-ui/main/install.sh | bash
```

Or target a specific component directly:

```bash
# Fetch CSS3DCard immediately
curl -fsSL https://raw.githubusercontent.com/saiduttaabhishekdash/three-react-ui/main/install.sh | bash -s CSS3DCard
```

> [!TIP]
> **AI Copilot Ready:** After downloading, the script prints a tailored prompt block. Paste it directly into **Cursor**, **Claude Code**, or any AI agent to automatically integrate the component into your page layouts!

---

## 🛠 Manual Usage

If you prefer to copy components manually:

1. **Download:** Clone this repository or download the ZIP file.
2. **Copy:** Transfer the directories from `src/components/` and `src/hooks/useThreeScene.js` into your project directory (e.g. into your `components/` and `hooks/` folders).
3. **Install Peer Dependency:** Add Three.js to your project:
   ```bash
   npm install three@0.128.0
   ```

---

## 📦 Components

### 1. CSS3DCard
A 3D product card that explodes into 5 floating layers on hover with spring-like physics.

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
| `title` | `string` | *Required* | Title text displayed on the card |
| `description` | `string` | *Required* | Description paragraph printed on the card |
| `badge` | `string` | *Required* | Text tag printed inside the neon badge overlay |
| `accentColor` | `string` | `"#00ffff"` | Hex color string driving card outline/glow borders |

---

### 2. GeometryRepel
Twelve auto-rotating 3D shapes that disperse dynamically as the mouse cursor approaches.

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
| `count` | `number` | `12` | Number of floating meshes to scatter and animate |
| `repelRadius` | `number` | `150` | Maximum distance (world units) for shape-to-mouse repel reaction |

---

### 3. LightingReflection
A metallic sphere sitting over a real-time projected ground-plane mirror reflection with fake bloom halos.

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
| `lightColor` | `string` | `"#00ffff"` | Hex color string for PointLight and halo emission |
| `metalness` | `number` | `1.0` | Material metalness of the central sphere mesh |
| `roughness` | `number` | `0.1` | Material surface roughness of the central sphere mesh |

---

### 4. BarChart3D
An interactive 3D extruded bar chart container with responsive mouse hover tilt logic.

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
| `data` | `Array` | *Required* | Array of bar shapes `{ label: string, value: number, color: string }` |

---

### 5. TunnelScroll
Scroll-driven camera flight through 40 neon wireframe torus rings with motion trail fades.

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
| `ringCount` | `number` | `40` | Total number of torus rings in the tunnel |
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
git clone https://github.com/saiduttaabhishekdash/three-react-ui.git
cd three-react-ui

# 2. Install dependencies
npm install

# 3. Launch Vite Dev Server
npm run dev
```

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
