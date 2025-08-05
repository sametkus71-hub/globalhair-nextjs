# GlobalHair - Premium Haartransplantatie & V6 Hairboost

Een moderne webapplicatie voor GlobalHair, gespecialiseerd in geavanceerde haartransplantatie technieken en V6 Hairboost behandelingen.

## Features

- Interactieve haartransplantatie informatie
- V6 Hairboost behandeling details
- Responsief design voor alle apparaten
- Multi-taal ondersteuning (Nederlands/Engels)
- Gebruikersprofiel personalisatie
- Video content bibliotheek

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Build Tool**: Vite
- **Routing**: React Router
- **State Management**: React Hooks + Session Storage

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <your-repo-url>

# Navigate to project directory
cd globalhair

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:8080`

### Build for Production

```bash
# Create production build
npm run build

# Preview production build locally
npm run preview
```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── homepage/       # Homepage specific components
│   └── ui/            # shadcn/ui components
├── hooks/             # Custom React hooks
├── lib/               # Utility functions and translations
├── pages/             # Page components
└── assets/            # Static assets (images, etc.)
```

## Development

### Code Style

- ESLint configuration for code quality
- TypeScript for type safety
- Tailwind CSS for styling
- Component-based architecture

### Key Components

- **HomePage**: Main landing page with interactive elements
- **VideoGrid**: Dynamic video content display
- **ColorSelector**: Hair color selection interface
- **GenderToggle**: User gender selection
- **HairTypeSelector**: Hair type customization

## Deployment

The application can be deployed to any static hosting service like Vercel, Netlify, or traditional web servers.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

© 2024 GlobalHair. All rights reserved.