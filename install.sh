#!/usr/bin/env bash

# REPO URL setup
REPO_RAW="https://raw.githubusercontent.com/instax-dutta/3d-web-contents/main"
COMPONENTS=("CSS3DCard" "GeometryRepel" "LightingReflection" "BarChart3D" "TunnelScroll")

# Function to check if item is in array
contains_element() {
  local e match="$1"
  shift
  for e; do [[ "$e" == "$match" ]] && return 0; done
  return 1
}

COMPONENT=""

# Check if component argument was passed
if [ -n "$1" ]; then
  if contains_element "$1" "${COMPONENTS[@]}"; then
    COMPONENT="$1"
  else
    echo "Error: Invalid component '$1'."
    echo "Available components: ${COMPONENTS[*]}"
    exit 1
  fi
else
  echo "============================================="
  echo "       three-react-ui Component Picker       "
  echo "============================================="
  echo "1) CSS3DCard"
  echo "2) GeometryRepel"
  echo "3) LightingReflection"
  echo "4) BarChart3D"
  echo "5) TunnelScroll"
  echo ""
  
  # Read choice from /dev/tty to support curl piping
  read -p "Select a component [1-5]: " CHOICE < /dev/tty
  
  case "$CHOICE" in
    1) COMPONENT="CSS3DCard" ;;
    2) COMPONENT="GeometryRepel" ;;
    3) COMPONENT="LightingReflection" ;;
    4) COMPONENT="BarChart3D" ;;
    5) COMPONENT="TunnelScroll" ;;
    *)
      echo "Error: Invalid choice."
      exit 1
      ;;
  esac
fi

# Ask for target directory
read -p "Where should we copy it? (default: src/components): " TARGET_DIR < /dev/tty
if [ -z "$TARGET_DIR" ]; then
  TARGET_DIR="src/components"
fi

echo "Downloading $COMPONENT to $TARGET_DIR/$COMPONENT..."

# Create target directories
mkdir -p "$TARGET_DIR/$COMPONENT"

# Download files
curl -fsSL "$REPO_RAW/src/components/$COMPONENT/$COMPONENT.jsx" -o "$TARGET_DIR/$COMPONENT/$COMPONENT.jsx"
if [ $? -ne 0 ]; then
  echo "Error: Failed to download $COMPONENT.jsx"
  exit 1
fi

curl -fsSL "$REPO_RAW/src/components/$COMPONENT/$COMPONENT.css" -o "$TARGET_DIR/$COMPONENT/$COMPONENT.css"
if [ $? -ne 0 ]; then
  echo "Error: Failed to download $COMPONENT.css"
  exit 1
fi

curl -fsSL "$REPO_RAW/src/components/$COMPONENT/index.js" -o "$TARGET_DIR/$COMPONENT/index.js"
if [ $? -ne 0 ]; then
  echo "Error: Failed to download index.js"
  exit 1
fi

# Download useThreeScene hook if it doesn't exist
HOOK_PATH="src/hooks/useThreeScene.js"
HOOK_STATUS=""
if [ ! -f "$HOOK_PATH" ]; then
  echo "Downloading useThreeScene hook to $HOOK_PATH..."
  mkdir -p "src/hooks"
  curl -fsSL "$REPO_RAW/src/hooks/useThreeScene.js" -o "$HOOK_PATH"
  if [ $? -ne 0 ]; then
    echo "Error: Failed to download useThreeScene.js"
    exit 1
  fi
  HOOK_STATUS="✓ Hook → src/hooks/useThreeScene.js"
else
  HOOK_STATUS="✓ Hook → src/hooks/useThreeScene.js (already exists, skipped)"
fi

echo ""
echo "============================================="
echo "✓ Component files → $TARGET_DIR/$COMPONENT"
echo "$HOOK_STATUS"
echo "============================================="
echo ""

# Get props details block based on component
PROPS_BLOCK=""
case "$COMPONENT" in
  "CSS3DCard")
    PROPS_BLOCK="CSS3DCard:
  title: string
  description: string
  badge: string
  accentColor: string (hex, default \"#00ffff\")"
    ;;
  "GeometryRepel")
    PROPS_BLOCK="GeometryRepel:
  count: number (default 12)
  repelRadius: number (default 150)"
    ;;
  "LightingReflection")
    PROPS_BLOCK="LightingReflection:
  lightColor: string (hex, default \"#00ffff\")
  metalness: number (default 1.0)
  roughness: number (default 0.1)"
    ;;
  "BarChart3D")
    PROPS_BLOCK="BarChart3D:
  data: Array<{ label: string, value: number, color: string }>"
    ;;
  "TunnelScroll")
    PROPS_BLOCK="TunnelScroll:
  ringCount: number (default 40)
  colorA: string (hex, default \"#00ffff\")
  colorB: string (hex, default \"#ff00ff\")
  trailOpacity: number (default 0.15)
  scrollContainer: RefObject<HTMLElement> (optional, defaults to window)"
    ;;
esac

# Print AI prompt block
echo "─────────────────────────────────────────"
echo "AI AGENT PROMPT — paste into Cursor / Claude Code / any agent:"
echo "─────────────────────────────────────────"
echo "I have added the $COMPONENT React component to $TARGET_DIR/$COMPONENT."
echo "It depends on useThreeScene hook at src/hooks/useThreeScene.js and"
echo "requires three@0.128.0 (run: npm install three@0.128.0 if not installed)."
echo ""
echo "Please import and add $COMPONENT to [DESCRIBE YOUR PAGE HERE] with"
echo "these props: [LIST YOUR DESIRED PROPS HERE]."
echo ""
echo "The component accepts these props:"
echo "$PROPS_BLOCK"
echo "─────────────────────────────────────────"
