# able Web Application

## Next.js Migration

This project has been migrated from a React application using React Router to Next.js with App Router.

## Getting Started

### Development

To run the development server:

```bash
pnpm nx serve web
```

Open [http://localhost:4200](http://localhost:4200) with your browser to see the result.

### Production Build

To create a production build:

```bash
pnpm nx build web
```

## Project Structure

- `app/` - Next.js App Router pages and layouts
- `src/` - Legacy React components and utilities (gradually being migrated)
- `public/` - Static assets

## Migration Notes

### Completed

- Set up Next.js configuration
- Created App Router structure
- Implemented basic page routing
- Added middleware for authentication

### In Progress

- Migrating components to use Next.js patterns
- Updating authentication flow
- Implementing API routes

### Future Work

- Move all components from `src/app` to `app/components`
- Implement server components where appropriate
- Optimize data fetching with Next.js patterns
- Implement image optimization with Next.js Image component
