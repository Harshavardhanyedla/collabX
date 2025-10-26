project:
  name: "Student Corner"
  tagline: "For Students, From Students"
  description: >
    A modern, accessible, production-ready React website that showcases learning roadmaps,
    open-source student projects, and a vibrant community area. Built with TypeScript,
    Tailwind CSS, and modern web technologies.

features:
  core_functionality:
    - Learning Roadmaps: "Structured learning paths with milestones and resources"
    - Project Showcase: "Discover and contribute to student-built projects"
    - Community Hub: "Discussion forums and team-building tools"
    - Responsive Design: "Mobile-first approach with beautiful UI/UX"
    - Dark/Light Mode: "Theme switching with localStorage persistence"
  technical_features:
    - TypeScript: "Full type safety throughout the application"
    - React Router v6: "Modern client-side routing"
    - Tailwind CSS: "Utility-first styling with a custom design system"
    - Framer Motion: "Smooth animations and micro-interactions"
    - Accessibility: "WCAG AA compliant with semantic HTML"
    - Performance: "Optimized with lazy loading and code splitting"

tech_stack:
  frontend: "React 19 + TypeScript"
  styling: "Tailwind CSS 4.x"
  routing: "React Router v6"
  animations: "Framer Motion"
  icons: "Heroicons"
  build_tool: "Vite"
  testing: "Vitest + React Testing Library"
  linting: "ESLint + Prettier"
  git_hooks: "Husky + lint-staged"

project_structure:
  src:
    components:
      description: "Reusable UI components"
      files:
        - NavBar.tsx
        - Footer.tsx
        - RoadmapCard.tsx
        - ProjectCard.tsx
      tests: "tests"
    pages:
      description: "Route components"
      files:
        - Home.tsx
        - Roadmaps.tsx
        - Projects.tsx
        - Community.tsx
        - Contact.tsx
    context:
      files: ["ThemeContext.tsx"]
    hooks:
      files:
        - useLocalStorage.ts
        - useDebounce.ts
    utils:
      files: ["index.ts"]
    types:
      files: ["index.ts"]
    data:
      files:
        - roadmaps.json
        - projects.json
        - community.json
    assets:
      directories:
        - images/
        - icons/

pages:
  Home:
    features:
      - Hero section with animated elements
      - Feature highlights (4 main features)
      - Community statistics
      - Call-to-action sections
  Roadmaps:
    features:
      - Grid layout with roadmap cards
      - Advanced filtering (category, difficulty, tags)
      - Search functionality
      - Detailed roadmap modal with milestones
      - Resource links and estimated time
  Projects:
    features:
      - Project showcase with cards
      - Project submission form
      - Bookmarking functionality
      - GitHub integration
      - Contribution guidelines
  Community:
    features:
      - Discussion hub
      - Team builder tool
      - Category-based browsing
      - Community statistics
  Contact:
    features:
      - Accessible contact form
      - Form validation
      - Contact information
      - Success states

contributing:
  instructions:
    - Fork the repository
    - Create a feature branch: "git checkout -b feature/amazing-feature"
    - Commit your changes: "git commit -m 'Add amazing feature'"
    - Push to the branch: "git push origin feature/amazing-feature"
    - Open a Pull Request
  notes:
    - "Follow TypeScript best practices"
    - "Write tests for new components"
    - "Ensure accessibility"
    - "Follow the design system"

license:
  type: "All Rights Reserved"
  owner: "Harsha Vardhan"
  statement: >
    © 2025 Harsha Vardhan. All rights reserved.
    This software is the intellectual property of Harsha Vardhan.
    No part of this code may be copied, modified, distributed, or used
    without explicit written permission from the author.

support:
  email: "codeharshaa@gmail.com"
  github_issues: "https://github.com/harshavardhanyedla/collabX/issues"

