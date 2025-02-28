# Active Context: Express CMS

## Current Work Focus

The project is in its documentation and analysis phase. We have established the memory bank to document the Express CMS project, which is a sophisticated multimedia content management system built with NextJS, Reactstrap, and Strapi. The project is structured as two separate but related codebases:

1. **Frontend**: Located in the current directory (`/Users/parikh/dev/mvcweb/express`)
2. **Backend**: Located in the parent directory's strapi folder (`/Users/parikh/dev/mvcweb/strapi`)

This shared memory bank approach allows us to document all parts of the system in a unified way, providing a comprehensive understanding of the entire application.

### Key Areas of Focus

1. **Project Documentation**: Maintaining comprehensive documentation in the memory bank for both frontend and backend components.
2. **System Understanding**: Analyzing both codebases to understand implementation details and patterns.
3. **Feature Assessment**: Identifying implemented features and potential areas for enhancement across the entire system.
4. **Architecture Analysis**: Understanding the system's architecture and component relationships between frontend and backend.
5. **Integration Documentation**: Documenting how the NextJS frontend and Strapi backend integrate and communicate.

## Recent Changes

- Initialized the memory bank with core documentation files
- Created project brief outlining the main features and technical requirements
- Documented product context, system patterns, and technical context
- Refined system patterns documentation with detailed architecture diagrams
- Enhanced technical context with specific implementation details

## Current State

The project is a sophisticated NextJS application with a comprehensive set of components for handling different types of media and presenting them in various formats. The application implements a channel-based content organization system with flexible access patterns, robust authentication, and integration with external services. The backend is powered by Strapi, a headless CMS, with custom controllers and content types.

### Key Components Identified

#### Frontend Components
- **Media Components**: Specialized players and recorders for various media types
  - Audio players with visualization
  - Video players with timeline control
  - 360° content viewers (photospheres)
  - YouTube and external media integrations
  
- **Layout Components**: Different presentation formats for content
  - Interactive maps with marker clustering
  - Slideshows with playback controls
  - Tag-based content walls
  - Grid layouts for content browsing
  
- **User Interface Components**: 
  - Authentication components (login, registration)
  - Content management interfaces (editors, uploaders)
  - Tag management with drag-and-drop functionality
  - Timeline controls for media playback
  
- **Integration Components**:
  - AI service integrations (ChatGPT, DALL-E)
  - Email notification system
  - Video generation service

#### Backend Components
- **Strapi Content Types**:
  - Channel: Main container for content with hierarchical structure
  - Content: Individual media items with metadata and relationships
  - Tag: Content categorization system
  - Tileset: Map configuration settings
  - User: Authentication and permissions
  
- **Custom Controllers**:
  - Channel controller: Manages channel operations and permissions
  - Content controller: Handles content creation, updating, and filtering
  - Tag controller: Manages tag operations and relationships
  
- **Utility Functions**:
  - Private ID generation and validation
  - Permission checking with inheritance
  - Media file handling and size calculation
  - Geocoding and location extraction

### Key Functionality Identified

- **Content Organization**:
  - Channel-based content grouping with parent-child relationships
  - Tag-based content categorization (channel-specific)
  - Geolocation for map-based presentation (manual or EXIF extraction)
  - Sequencing for slideshow presentation with ordering system
  
- **Access Control**:
  - Three-tier access model (public, private link, authenticated)
  - XOR encryption for secure private links
  - JWT-based authentication with HTTP-only cookies
  - Google OAuth integration
  - Permission inheritance from parent channels
  
- **Media Management**:
  - Multi-format media upload with progress tracking
  - Specialized playback for different media types
  - Timeline-based media control with custom start/end points
  - 360° content support with various mapping types
  - External media integration (YouTube, Vimeo, Google Photos)
  
- **External Integrations**:
  - AI-powered content generation (ChatGPT, DALL-E)
  - Asynchronous video creation with email notifications
  - Email sharing of channel management links
  - Geocoding for location-based content

## Next Steps

1. **Component Deep Dives**: Examine additional key components to understand specific implementation details
2. **Data Model Visualization**: Create comprehensive diagrams of the data model and relationships
3. **User Flow Mapping**: Document complete user journeys through the application
4. **Performance Assessment**: Identify potential performance bottlenecks and optimization opportunities
5. **Security Review**: Evaluate the private ID mechanism and permission inheritance system
6. **Media Processing Analysis**: Investigate the video generation service integration

## Active Decisions and Considerations

- **Documentation Organization**: How to structure documentation for complex component relationships
- **Architecture Visualization**: How to effectively visualize the system architecture and data flows
- **Feature Mapping**: Creating a comprehensive map of features and their implementations
- **Integration Details**: Understanding the specifics of external service integrations
- **Access Pattern Implementation**: Analyzing the security implications of the private ID system
- **Permission Inheritance**: Documenting the hierarchical permission model
- **Media Processing Pipeline**: Understanding the complete flow from upload to presentation

## Open Questions

- **Strapi Extensions**: Are there any custom Strapi plugins or extensions in use?
- **Video Generation**: What are the specific capabilities and limitations of the video generation service?
- **Performance Optimization**: Are there specific performance bottlenecks with large media collections?
- **Deployment Strategy**: What is the current deployment architecture and process?
- **Content Limitations**: What are the size and format limitations for uploaded media?
- **Scaling Considerations**: How does the system handle channels with large amounts of content?
- **Backup Strategy**: How is content backed up and restored if needed?

## Key Insights

- The system implements a sophisticated three-tier access model using XOR encryption for private links
- Channels have hierarchical relationships with permission inheritance from parents
- Content is filtered based on access level (published-only for public, all for editors)
- Media files have extensive metadata extraction, including geolocation from EXIF data
- The system supports a wide range of media types with specialized handling for each
- Tag management includes drag-and-drop functionality for combining similar tags
- Channel size calculation includes recursive traversal of child channels

This active context will be updated as we progress with the project and gain more insights into the codebase and requirements.
