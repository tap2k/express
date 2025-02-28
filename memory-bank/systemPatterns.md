# System Patterns: Express CMS

## Project Structure

Express CMS is organized as two separate but related codebases:

```mermaid
flowchart TD
    Root["/Users/parikh/dev/mvcweb/"] --> Express["/express (Frontend)"]
    Root --> Strapi["/strapi (Backend)"]
    Express --> Components["components/"]
    Express --> Hooks["hooks/"]
    Express --> Pages["pages/"]
    Express --> Public["public/"]
    Express --> Styles["styles/"]
    Strapi --> StrapiAPI["src/api/"]
    Strapi --> StrapiConfig["config/"]
    StrapiAPI --> ChannelAPI["channel/"]
    StrapiAPI --> ContentAPI["content/"]
    StrapiAPI --> TagAPI["tag/"]
```

This separation allows for independent development and deployment of the frontend and backend components while maintaining a clear integration between them.

## Architecture Overview

Express CMS follows a modern web application architecture with clear separation of concerns and a multi-layered approach:

```mermaid
flowchart TD
    Client[Client Browser] <--> NextJS[NextJS Frontend]
    NextJS <--> API[API Routes]
    API <--> Strapi[Strapi Backend]
    API <--> VideoService[Video Generation Service]
    Strapi <--> DB[(Database)]
    Strapi <--> FileStorage[(File Storage)]
    NextJS <--> Components[React Components]
    NextJS <--> Hooks[Custom Hooks]
```

## Data Model

The system is built around these core entities:

```mermaid
erDiagram
    Channel ||--o{ Channel : "parent-child"
    Channel ||--o{ Content : contains
    Channel ||--o{ Tag : has
    Channel ||--o{ Overlay : has
    Channel ||--o{ Asset : has
    Channel }o--|| User : owned-by
    Channel }o--o{ User : edited-by
    Content }o--o{ Tag : tagged-with
    Content }o--|| User : contributed-by
    Content ||--o| Media : "media file"
    Content ||--o| Media : "audio file"
    Channel ||--o| Media : "picture"
    Channel ||--o| Media : "audio file"
    Channel ||--o| Tileset : uses
```

### Channel Entity
- **Core Properties**: uniqueID, name, description, public/private status
- **Location**: lat, long, zoom level
- **Media**: picture, audiofile
- **Presentation**: interval, showtitle, background/foreground colors
- **Relationships**: parent/children, owner, editors, contents, tags, overlays, assets

## Key Design Patterns

### Component-Based Architecture
The system is built using React's component-based architecture, with reusable UI components that encapsulate specific functionality:

- **Media Components**: Components for displaying and interacting with different media types (audio, video, images, YouTube, 360° content)
  - Examples: `AudioPlayer`, `VideoPlayer`, `FullImage`, `Photosphere`, `Youtube`
- **Layout Components**: Components for different presentation formats (maps, grids, slideshows)
  - Examples: `Mapper`, `Slideshow`, `TagWall`, `ImageGrid`
- **Control Components**: UI elements for user interaction and control
  - Examples: `Timeline`, `ChannelControls`, `ItemControls`, `PlayIcon`
- **Form Components**: Components for data input and content creation
  - Examples: `ChannelEditor`, `ContentEditor`, `Uploader`


### Custom Hooks Pattern
Custom React hooks encapsulate and reuse stateful logic across components:

- **API Interaction Hooks**: For data fetching and submission
  - Examples: `getChannel`, `updateSubmission`, `addChannel`, `getMyChannels`
- **Media Handling Hooks**: For processing and managing media
  - Examples: `getMediaURL`, `useMediaControl`, `uploadSubmission`
- **State Management Hooks**: For managing application state
  - Examples: `useContainerSize`, `useInactive`
- **Utility Hooks**: For common functionality like URL generation
  - Examples: `getBaseURL`, `getTagURL`, `setError`

### Page-Based Routing
NextJS page-based routing structure organizes the application into distinct functional areas:

- **/pages**: Main application pages
  - `index.js`: Dashboard showing user's channels or public channels
  - `map.js`: Map-based visualization of channel content
  - `reel.js`: Slideshow presentation of channel content
  - `tagger.js`: Interface for tagging and organizing content
  - `probe.js`: Channel creation and management
  - `upload.js`: Content upload interface
- **/pages/api**: API endpoints for server-side functionality
  - Authentication endpoints
  - Content management endpoints
  - Media processing endpoints
- **/pages/auth**: Authentication-related pages
  - OAuth callback handlers

### API Routes Pattern
Server-side functionality is implemented through NextJS API routes that act as middleware between the frontend and Strapi backend:

- **Authentication**: User registration, login, and session management
  - JWT-based authentication with HTTP-only cookies
  - Google OAuth integration
- **Content Management**: Creating, updating, and deleting content
  - Channel creation and management
  - Content submission and updating
  - Tag management
- **Media Processing**: Handling media uploads and transformations
  - File uploads to Strapi
  - Video generation through external service
- **External Services**: Integration with third-party services
  - ChatGPT for content generation
  - DALL-E for image generation
  - External video processing service

## Data Flow Patterns

```mermaid
flowchart LR
    User[User] --> Components[UI Components]
    Components --> Hooks[Custom Hooks]
    Hooks --> APIRoutes[API Routes]
    APIRoutes --> Strapi[Strapi Backend]
    APIRoutes --> ExternalServices[External Services]
    Strapi --> DB[(Database)]
    Strapi --> FileStorage[(File Storage)]
    DB --> Strapi
    FileStorage --> Strapi
    Strapi --> APIRoutes
    ExternalServices --> APIRoutes
    APIRoutes --> Hooks
    Hooks --> Components
    Components --> User
```

### Access Patterns

The system implements three distinct access patterns for content:

```mermaid
flowchart TD
    Request[Content Request] --> AccessCheck{Access Type?}
    AccessCheck -->|Public| PublicAccess[Public Channel API]
    AccessCheck -->|Private Link| PrivateAccess[Private ID API]
    AccessCheck -->|Authenticated| AuthAccess[JWT Auth API]
    PublicAccess --> ContentFilter[Filter Public Content]
    PrivateAccess --> OwnerCheck[Verify Owner]
    AuthAccess --> PermissionCheck[Check Permissions]
    ContentFilter --> Response[Return Content]
    OwnerCheck --> Response
    PermissionCheck --> Response
```

### Private ID Mechanism

The system uses a secure XOR encryption to create private access links:

```mermaid
flowchart LR
    ChannelID[Channel uniqueID] --> XOR[XOR with Secret Seed]
    XOR --> PrivateID[Private ID]
    PrivateID --> XOR2[XOR with Secret Seed]
    XOR2 --> OriginalID[Original Channel ID]
```

This allows for secure sharing of edit access without requiring user accounts.

## Component Communication

- **Props**: For parent-to-child component communication
  - Component configuration and data passing
  - Event handlers and callbacks
- **Custom Hooks**: For sharing state and logic between components
  - Data fetching and submission
  - Media control state
  - UI state management
- **URL Parameters**: For page-to-page communication
  - Channel IDs and private IDs
  - Current slide or view state
  - Edit mode flags
- **Refs**: For direct DOM manipulation and component interaction
  - Media element references
  - Timeline control

## Authentication Flow

```mermaid
sequenceDiagram
    User->>+Frontend: Login Request
    Frontend->>+API: Authentication Request
    API->>+Strapi: Validate Credentials
    Strapi-->>-API: Authentication Response
    API-->>-Frontend: Set JWT Cookie
    Frontend-->>-User: Login Success/Failure
```

## Channel Access Flow

```mermaid
sequenceDiagram
    participant User
    participant System
    participant Email
    
    User->>System: Create Channel
    System->>System: Generate uniqueID & privateID
    System->>User: Display Management Links
    User->>System: Request Email Links
    System->>Email: Send Management Links
    Email->>User: Receive Links
    
    Note over User,System: Later Access
    
    User->>System: Access via uniqueID (Public)
    System->>User: View-only Access
    
    User->>System: Access via privateID (Private)
    System->>User: Full Management Access
    
    User->>System: Access via JWT (Authenticated)
    System->>User: Access Based on Permissions
```

## Permission Inheritance

```mermaid
flowchart TD
    Request[Edit Request] --> CheckPrivateID{Has privateID?}
    CheckPrivateID -->|Yes| GrantAccess[Grant Access]
    CheckPrivateID -->|No| CheckOwner{Is Owner?}
    CheckOwner -->|Yes| GrantAccess
    CheckOwner -->|No| CheckEditor{Is Editor?}
    CheckEditor -->|Yes| GrantAccess
    CheckEditor -->|No| CheckParent{Has Parent?}
    CheckParent -->|Yes| RecursiveCheck[Check Parent Permissions]
    CheckParent -->|No| DenyAccess[Deny Access]
    RecursiveCheck --> CheckOwner
```

This hierarchical permission model allows for flexible content management.

## Content Filtering

```mermaid
flowchart TD
    GetChannel[Get Channel] --> CheckAccess{Access Level?}
    CheckAccess -->|Public| FilterPublished[Show Only Published]
    CheckAccess -->|Private/Auth| CheckPermission{Has Edit Permission?}
    CheckPermission -->|Yes| ShowAll[Show All Content]
    CheckPermission -->|No| FilterPublished
```

## Video Generation Flow

```mermaid
sequenceDiagram
    participant User
    participant NextJS
    participant VideoService
    participant Email
    
    User->>NextJS: Request Video Generation
    NextJS->>User: Acknowledge Request (202)
    NextJS->>VideoService: Process Video Request
    VideoService->>VideoService: Generate Video
    VideoService->>Email: Send Completion Email
    Email->>User: Video Link
```

This architecture promotes maintainability, reusability, and separation of concerns throughout the application while providing flexible access patterns and integration with external services.
