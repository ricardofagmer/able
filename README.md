GitHub Repository: https://github.com/ricardofagmer/able


# This project is a simple sample of how to handle permission with users and endpoints;

- 1 docker-compose up -d 
- 2 pnpm install
- 3 pnpm run start:api
- 4 pnpm run start:web

# Deployed on AWS using nginx:
- http://34.205.142.53:4200

**In the webapp:**
- Register a new endpoint, _Note: The route needs to exist so if you want to test the permission, or you can create a new route/page, or you can work with the existent one_: `/dashboard, /report, /cms`
- Create a new Group of Permission and add the endpoint you want the user to access to;
- Create a new user and assign the group you created before;
- Login with the user you created before;
- You can test the permission with the menu in the navbar;


# Project Architecture Overview:

## Project Structure
It is a modern full-stack application built as a monorepo using Nx workspace for managing multiple applications and shared libraries. 
The project implements a monolithic architecture; however, it can be easily refactored/scalable to a microservices' architecture.

## Technology Stack
### Frontend
- Next.js 15 with React 19 for the web application
- TypeScript for type safety
- Tailwind CSS with Radix UI components for styling
- React Hook Form with Zod validation
- TanStack Query for state management
- Zustand for client-side state

### Backend
- NestJS framework
- TypeORM with a PostgreSQL database
- JWT authentication with refresh tokens
- Swagger for API documentation

### Next Steps
- Handle composite endpoints
- Handle micro-permissions (`read-only, write-only, read and write`)
- Enhancement of to how to show the options in the FE (**e.g., the user only is able to see the menu items which he has access to**) and checking the permissions methods.


## Choice
Due to the short time I had to complete the test (_and yes! I've used IA to help in the velocity of the development and code from some other projects I have worked with_), 
I decided to get this feature about permissions, and I also have to implement sort of that in the current project.
I know this is not the best solution since we can also deal with micro-permissions such as "read-only," "write-only," "read and write," and also use regex to handle complex endpoints. However,
for this since it's a test, I decided to use a simple solution.
