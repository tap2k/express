# Plan: Add Map Overlays to Express

## Context
The admin app supports image overlays on maps — users can upload images and position them over geographic bounds using draggable corner markers. The express app renders maps but has zero overlay support. Strapi already populates `channel.overlays` in `getChannel()`, so the data is available — we just need the frontend components.

## Scope
Full editing: upload, drag-to-reposition (4 corner markers), coordinate editing, and delete. Read-only display for unauthenticated users.

## New Files (7)

### Hooks (3) — direct copies from admin
These are simple axios wrappers, copy as-is from admin:
- **`hooks/uploadoverlay.js`** — POST to `/api/uploadOverlay` with FormData + channelID + jwt
  - Source: `admin/hooks/uploadoverlay.js`
- **`hooks/updateoverlay.js`** — POST to `/api/updateOverlay` with overlayID + corner coords + jwt
  - Source: `admin/hooks/updateoverlay.js`
- **`hooks/deleteoverlay.js`** — POST to `/api/deleteOverlay` with overlayID + jwt
  - Source: `admin/hooks/deleteoverlay.js`

### Components (4) — adapted from admin

- **`components/overlayuploader.js`** — Modal body with ImageAdder for uploading overlay images. Calls `uploadOverlay` hook then refreshes page.
  - Source: `admin/components/overlayuploader.js`
  - Copy as-is (uses ImageAdder + useFileUpload)

- **`components/imageadder.js`** — Drag-and-drop file picker used by OverlayUploader.
  - Source: `admin/components/imageadder.js`
  - Copy as-is

- **`components/editableoverlay.js`** — Renders ImageOverlay + 4 draggable corner OverlayMarkers + coordinate editor modal. Auto-saves bounds on drag via `updateOverlay` hook.
  - Source: `admin/components/editableoverlay.js`
  - Copy as-is

- **`components/overlayeditor.js`** — Form with TL/BR coordinate inputs + delete button. Shown in modal from EditableOverlay on double-click.
  - Source: `admin/components/overlayeditor.js`
  - Copy as-is

### Static asset (1)
- **`public/circle.png`** — Small circle icon used for draggable corner markers
  - Copy from `admin/public/circle.png`

## Modified Files (1)

### `components/mapper.js`

Current state: Renders MapContainer with TileLayer, MarkerClusterGroup (content markers), tour nav buttons, ZoomControl, reset button, tileset selector, and legend. No overlay support.

Changes:
1. **Add imports:** `ImageOverlay` from react-leaflet, `EditableOverlay`, `OverlayUploader`, `getMediaURL`, `Modal`/`ModalHeader`/`ModalBody` from reactstrap
2. **Add state:** `mapBounds`, `overlayModal` + `toggleOverlay`
3. **Set mapBounds** in the existing `useEffect` that runs after `mapRef` is set (line 37-39, alongside `resetMap()`)
4. **Add overlay upload button** near the existing tileset selector (top-right, only when `jwt`)
5. **Add overlay upload modal** (same pattern as admin — Modal with OverlayUploader inside)
6. **Render overlays** inside MapContainer, after MarkerClusterGroup, before tour buttons:
   - When `jwt`: render `EditableOverlay` (draggable corners + edit modal on double-click)
   - Otherwise: render plain `ImageOverlay` (read-only)
   - Bounds from `overlay.tl_lat/tl_long` + `br_lat/br_long`, fallback to `mapBounds.pad(-0.1)` for newly uploaded overlays without coordinates

### Overlay rendering code (from admin mapper.js lines 431-442):
```jsx
{
  channel.overlays && channel.overlays.map((overlay) => {
    if (!mapBounds) return;
    let overlayBounds = mapBounds.pad(-0.1);
    if (overlay.tl_lat)
      overlayBounds = new L.LatLngBounds(
        [overlay.tl_lat, overlay.tl_long],
        [overlay.br_lat, overlay.br_long]
      );
    return jwt ?
      <EditableOverlay key={overlay.id} overlayID={overlay.id}
        url={getMediaURL() + overlay.image.url}
        bounds={overlayBounds} zIndex={100} jwt={jwt} />
      : <ImageOverlay key={overlay.id}
        url={getMediaURL() + overlay.image.url}
        bounds={overlayBounds} zIndex={100} />
  })
}
```

## No changes needed
- **Strapi backend** — overlay CRUD endpoints already exist (`/api/uploadOverlay`, `/api/updateOverlay`, `/api/deleteOverlay`, `/api/getOverlays`)
- **`pages/map.js`** — already passes `channel` (with overlays populated) and `jwt` to Mapper
- **No new dependencies** — all packages already in express (`react-leaflet`, `reactstrap`, `react-use-file-upload`, `react-confirm-alert`)

## How it works (user flow)

### Adding an overlay
1. User opens map in edit mode (`?edit=true`)
2. Clicks "add overlay" button (top-right of map)
3. Modal opens with ImageAdder — drag/drop or select an image file
4. On upload, `uploadOverlay` hook POSTs to Strapi, page refreshes
5. New overlay appears on map at default bounds (padded map bounds)

### Editing an overlay
- **Drag corners:** 4 small circle markers at each corner — drag any to resize/reposition. Auto-saves to Strapi on each dragend.
- **Type coordinates:** Double-click the overlay image to open OverlayEditor modal with TL (lat/lng) and BR (lat/lng) number inputs. Changes apply immediately.

### Deleting an overlay
1. Double-click overlay to open editor modal
2. Click "delete" button
3. Confirmation dialog appears
4. On confirm, `deleteOverlay` hook POSTs to Strapi, page refreshes

### Read-only viewing
- Without `jwt`, overlays render as plain `ImageOverlay` — no corner markers, no editing, no upload button

## Verification
1. Open map page with `?edit=true` → verify "add overlay" button appears (top-right)
2. Click "add overlay" → upload an image → overlay appears on map at default bounds
3. Drag corner markers → overlay resizes/repositions in real-time
4. Double-click overlay → coordinate editor opens, can type exact coords
5. Delete overlay from editor → confirmation dialog, overlay removed
6. Open map without edit mode → overlays display read-only (no markers, no editing)
7. Verify existing map features (markers, tileset picker, tour, legend) still work
