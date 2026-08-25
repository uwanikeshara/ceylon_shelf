# CeylonShelf | National Digital Library Hub

A full-stack, real-time Digital Library & Knowledge Hub designed for public and academic library networks in Sri Lanka (Colombo, Kandy, Galle, Peradeniya, and Jaffna branches). Built using React (TypeScript), Node.js (Express), MongoDB, and WebSockets (Socket.IO).

## Core Capabilities

- **Reader & Member Directory**: Register members, track contact details, and manage membership status across branches.
- **Book Catalog Management**: Comprehensive catalog with stock tracking, genre categorization, and instant search.
- **Circulation & Book Loans**: Issue 14-day book loans, track active loans, process returns, and update inventory in real-time.
- **Overdue Notice & Fine Calculation**: Monitor late returns, calculate LKR fines (Rs. 50/day), and dispatch automated email reminders.
- **Real-Time Synchronization**: WebSockets (Socket.IO) instantly update active browser clients on loan status changes and catalog updates.
- **Authentication & Security**: Role-based access control (Admin / Member) using JWT access and refresh tokens with HTTP-only cookies.

## System Architecture

- **FrontEnd**: React 19, TypeScript, Vite, TailwindCSS (v4), React Hot Toast, React Icons.
- **BackEnd**: Node.js, Express 5, TypeScript, Socket.IO, Nodemailer, Bcrypt, Mongoose.
- **Database**: MongoDB (Local or MongoMemoryServer fallback for development).
- **Containerization**: Docker & Docker Compose setup for multi-service deployment.

## Getting Started

### Local Setup

1. **BackEnd**:
   ```sh
   cd BackEnd
   npm install
   npm run dev
   ```

2. **FrontEnd**:
   ```sh
   cd FrontEnd
   npm install
   npm run dev
   ```

### Running Tests

```sh
cd BackEnd
npm test
```

### Docker Container Deployment

```sh
docker-compose up --build
```
