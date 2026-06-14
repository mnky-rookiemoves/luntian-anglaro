# 🎮 LUNTIAN ANGLARO — 3D Model Assets

## How to Add a New .glb Model

1. **Create/download** a .glb model file
2. **Drop it** in the correct folder:
   - Guardians → `guardians/` (e.g., `guardians/luntian.glb`)
   - Generals → `generals/` (e.g., `generals/usok.glb`)
3. **Update the registry** in `src/components/battle3d/GLBModelLoader.tsx`:
   - Find the model entry in `MODEL_REGISTRY`
   - Set `available: true`
   - Adjust `scale` and `yOffset` as needed
4. **Refresh** the app — the .glb model automatically replaces the procedural one!

## Model Specs

| Property | Recommended |
|----------|-------------|
| Format | .glb (binary glTF) |
| Polycount | Under 10,000 faces |
| Texture size | 512x512 or 1024x1024 |
| Orientation | Facing +Z (forward) |
| Origin | Center bottom |
| Scale | ~1 unit tall |

## Optional Animations

If your .glb includes animations, name them:
- `idle` — default looping animation
- `attack` — plays when attacking
- `hit` — plays when taking damage
- `death` — plays on defeat

## Current Status

| Model | .glb Available | Procedural Fallback |
|-------|---------------|-------------------|
| Luntian | ⬜ | ✅ Leaf fairy |
| Alon | ⬜ | ✅ Water spirit |
| Bulkan | ⬜ | ✅ Rock golem |
| Haribon | ⬜ | ✅ Eagle |
| Pawikan | ⬜ | ✅ Sea turtle |
| Usok | ⬜ | ✅ Smoke humanoid |
| Mantsa | ⬜ | ✅ Toxic sludge |
| Hukay | ⬜ | ✅ Mining golem |
| Putol | ⬜ | ✅ Chainsaw treant |
| Lason | ⬜ | ✅ Trash kraken |
| Ang Dumi | ⬜ | ✅ Final boss amalgamation |