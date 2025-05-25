# KaTuripu

![image](https://github.com/user-attachments/assets/adde95f9-3c07-4536-92d7-bfc42e7a1e95)

## Overview

KaTuripu is an educational platform that uses knowledge graphs to guide students through their learning journey. The platform is primarily built to help Moroccan students as they prepare for university admissions tests and entrance exams. Our mission is to provide a structured, interactive approach to exam preparation that helps students master subjects efficiently.

## Features

- **Interactive Roadmaps**: Follow personalized learning paths specifically designed for different entrance exams and institutions.
- **Practice Problems**: Access hundreds of practice problems with detailed solutions to strengthen understanding and test knowledge.
- **Progress Tracking**: Keep track of your learning journey with visual progress indicators and milestone celebrations.
- **Multi-language Support**: Platform available in English, French, and Arabic.
- **Multi-format Learning**: Learn through various formats including text explanations, video content, and interactive exercises.
- **Achievement System**: Stay motivated with achievement badges and clearly defined learning goals.
- **Responsive Design**: Fully responsive interface that works seamlessly on desktop, tablet, and mobile devices.

## Technologies

### Frontend
- **Next.js 15**: React framework with server-side rendering and routing
- **TypeScript**: Static typing for better development experience and code quality
- **Tailwind CSS**: Utility-first CSS framework for rapid UI development
- **XY Flow**: Used for building interactive roadmap canvases
- **React Query**: Data fetching and state management
- **next-intl**: Internationalization support
- **Framer Motion**: Animations and transitions
- **MathJax**: Mathematical notation rendering

### Backend
- **Next.js API Routes**: Serverless functions for backend operations
- **Prisma**: Type-safe ORM for database access
- **PostgreSQL**: Relational database for data storage
- **Clerk**: Authentication and user management
- **Docker**: Containerization for development and deployment

## Getting Started 

### Prerequisites
- Node.js (v20+)
- Docker and Docker Compose
- PostgreSQL (or use the provided Docker setup)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/katuripu.git
   cd katuripu
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the database:
   ```bash
   docker start katuripu_db || docker-compose -f docker/docker-compose.yml up -d
   ```

4. Set up environment variables:
   Create a `.env` file with the following variables:
   ```
   DATABASE_URL="postgresql://admin:admin@localhost:5433/katuripu_db"
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   CLERK_SECRET_KEY=your_clerk_secret_key
   ```

5. Run database migrations and seed the database:
   ```bash
   npx prisma migrate dev
   npm run seed
   ```

6. Start the development server:
   ```bash
   npm run dev
   ```

7. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Contributing 👥

We welcome contributions to KaTuripu! Please feel free to submit issues, feature requests, or pull requests.

## License 📄

This project is licensed under the MIT License - see the LICENSE file for details.

## Team 👋

KaTuripu is developed by a team of passionate students and graduates dedicated to improving educational outcomes for Moroccan students.

## Contact 📧

For questions or feedback, please reach out through ab.aitelmouden@gmail.com or open an issue on GitHub.
