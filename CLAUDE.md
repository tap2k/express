# Express CMS

Multimedia content sharing platform using Maps, Slideshows, and Grids. Built with Next.js 13 (Pages Router) + Reactstrap frontend, backed by a Strapi headless CMS.

## Architecture

```
Frontend (this repo)          Backend (../strapi)
├── components/  (58 React)   ├── src/api/channel/
├── hooks/       (32 custom)  ├── src/api/content/
├── pages/       (routes)     ├── src/api/tag/
├── pages/api/   (8 endpoints)└── config/functions.js
├── public/      (static)
├── styles/      (CSS)
└── data/        (credentials)
```

**Data flow:** UI Components → Custom Hooks → Next.js API Routes → Strapi API → Database/File Storage

### Sibling Client: Admin (`../admin`)

An older separate Next.js 13 app sharing the same Strapi backend and nearly identical tech stack. Features may exist in one but not the other. Only refer to this codebase if asked.

## Tech Stack

- **Framework:** Next.js 13.5.5 (Pages Router, SSR via `getServerSideProps`)
- **UI:** Reactstrap (Bootstrap), styled-components, react-icons
- **Maps:** Leaflet + react-leaflet + react-leaflet-cluster
- **Media:** Video.js, Photo Sphere Viewer (360), react-player (YouTube/Vimeo), RecordRTC
- **Drag & Drop:** react-dnd (HTML5 + touch backends)
- **HTTP:** axios
- **Auth:** JWT in HTTP-only cookies (nookies), Google OAuth
- **AI:** OpenAI (ChatGPT + DALL-E)
- **Email:** nodemailer
- **Images:** sharp, next/image (domains: DigitalOcean, Backblaze, Supabase)

## Key Concepts

### Three-Tier Access Model
1. **Public** (`uniqueID`): View-only, published content only
2. **Private Link** (`privateID`): Full management access via XOR-encrypted channel ID
3. **Authenticated** (JWT): Role-based permissions (owner/editor) with recursive parent inheritance

### Content Model
- **Channels** ("reels"): Hierarchical containers with parent-child relationships
- **Content**: Media items with metadata, geolocation, tags, ordering, publication status
- **Tags**: Channel-specific, support drag-and-drop combining/purging
- **Tilesets**: Custom map tile configurations

### Media Types
- Images (JPEG, PNG, GIF, WebP) with EXIF geolocation extraction
- Video (MP4, WebM) with custom timeline start/end
- Audio (MP3, WAV) with visualization
- 360 content (equirectangular images/video)
- External: YouTube, Vimeo, Google Photos, Dropbox

## Conventions

### File Naming
- All files use **camelCase**: `audioPlayer.js`, `getChannel.js`, `addChannel.js`
- Media players: `[type]player.js` (e.g., `audioplayer.js`, `videoplayer.js`)
- Media recorders: `[type]recorder.js`
- Variants: `[type]player[variant].js` (e.g., `videoplayer360.js`, `videoplayerjs.js`)

### Code Patterns
- **Functional components** with hooks, no class components
- **Props destructuring** in function parameters
- **React.memo** for performance-critical components
- **Dynamic imports** (`next/dynamic`) for heavy components (media players, maps)
- **Async/await** for all async operations
- **Inline styles** for component-specific styling; CSS files for shared styles
- **Conditional rendering** via ternary operators and `&&`

### Hook Patterns
- API hooks accept a **single object parameter** for flexibility
- Use **axios** for HTTP requests
- Error handling through the `setError` hook
- Return response data or null on error
- URL/media helpers: `getBaseURL()`, `getMediaURL()`, `getTagURL()`

### State Management
- `useState`, `useEffect`, `useRef` for local state
- URL query parameters for cross-page state
- No global state library; state is lifted through props and custom hooks

## Pages

| Page | Purpose |
|------|---------|
| `index.js` | Dashboard: user's channels + public channels |
| `map.js` | Interactive map with marker clustering |
| `reel.js` | Slideshow presentation with playback controls |
| `tagger.js` | Tag-based content organization |
| `editor.js` | Channel/content editing |
| `upload.js` | Content submission with upload progress |
| `board.js` | Board management view |
| `login.js` / `register.js` | Authentication |

## API Routes (`/pages/api/`)

| Route | Purpose |
|-------|---------|
| `login.js` | JWT authentication |
| `register.js` | User registration |
| `logout.js` | Session termination |
| `addchannel.js` | Channel creation |
| `chatgpt.js` | ChatGPT text generation |
| `dalle.js` | DALL-E image generation |
| `makevideo.js` | Async video generation request |
| `sendemail.js` | Email notifications |

## Development

```bash
npm run dev     # Start dev server (port 3000)
npm run build   # Production build
npm run start   # Production server
npm run lint    # ESLint
```

Requires a running Strapi instance (configured via `NEXT_PUBLIC_STRAPI_HOST` in `.env`).

### Key Environment Variables
- `NEXT_PUBLIC_STRAPI_HOST` - Strapi backend URL
- `NEXT_PUBLIC_BASE_URL` - Frontend URL
- `NEXT_PUBLIC_CLOUD_STORAGE` - When set (truthy), media URLs are served directly from cloud storage (DigitalOcean Spaces, Backblaze B2, Supabase) instead of proxied through Strapi. Leave unset for local dev. See `hooks/getmediaurl.js`.
- `NEXT_PUBLIC_AI_ENABLED` - Toggle AI features (ChatGPT + DALL-E)
- `VIDEO_SERVER_URL` - Video generation service (`~/dev/mahabot/mahabot`)
- `OPENAI_API_KEY` - OpenAI API key
- `PRIVATE_SEED` - Secret for XOR channel ID encryption (must match Strapi backend)

## Important Notes

- **No test suite** exists yet; testing is manual
- **`reactStrictMode: false`** in next.config.js (intentional)
- Image domains are whitelisted in `next.config.js` for `next/image`
- `@/*` path alias configured in `jsconfig.json`
- Video generation is async: request is acknowledged immediately, result is emailed
- Permission checks are recursive up the channel hierarchy (can be expensive for deep nesting)

## TODO

- **Loading/error states**: Replace `alert()` and `console.error` with proper UI feedback (toast notifications, button spinners, error banners) for client-side mutations (save, delete, upload, reorder)
- **Slideshow transitions**: Add configurable transition effects (fade, slide, zoom) to the reel — currently slides change instantly via `pure-react-carousel`
- **Caption/text styling**: Add font choice, caption text color picker, and per-slide font size control. Banner title color is hardcoded to `#0a4f6a` in `components/banner.js`
- **Content paging**: Paginate content loading in editor/board/map for channels with many items — currently all content loads at once via `getServerSideProps`
- **Multi-select delete**: Add checkbox selection and bulk delete for content items on editor/board views
- **Mute control**: Add a mute/unmute button for audio and video playback across reel, map, and editor views
- **Clone channel**: Allow users to duplicate an existing channel (structure + settings, optionally content) as a starting point
- **Keyboard shortcuts**: Add keyboard navigation to reel (arrow keys for prev/next, space for play/pause) and map
- **Analytics/view tracking**: Add view counts for reels, per-slide view stats, map marker click counts
- **Dark mode**: All views use light backgrounds; only the reel has a dark (black) background
