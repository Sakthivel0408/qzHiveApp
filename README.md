# QzHiveApp

QzHiveApp is an interactive online quiz platform that enables users to participate in quizzes, track scores, and compete on leaderboards, while administrators can create and manage quizzes with a secure, role-based system. Built with Angular, Node.js, and MongoDB, QzHiveApp features a modern, transparent glass-effect UI for an engaging user experience.

## Table of Contents
- Project Overview
- Features
- Architecture
- Database Schema
- Components
- Screenshots
- Installation
- Development Server
- Code Scaffolding
- Building
- Running Tests
- License

## Project Overview
QzHiveApp addresses the challenge of creating an engaging, user-friendly quiz platform that promotes knowledge retention and friendly competition. Existing platforms often lack intuitive interfaces, real-time performance tracking, or robust admin tools. Our solution provides:
- A scalable, interactive platform for users to join quizzes across various topics.
- Real-time leaderboards to foster competition.
- Secure role-based access for users and admins.
- Admin tools for seamless quiz creation and management.

**Objective**:
- Develop an online quiz platform for users to participate, track scores, and compete.
- Design a role-based system with secure authentication and admin functionalities.

**Outcome**:
- Delivers an engaging quiz experience with high user satisfaction.
- Enables admins to efficiently manage quizzes, ensuring system reliability.

## Features
- **User Features**:
  - Register and log in with secure authentication (JWT-based).
  - Browse and join quizzes by code.
  - Answer questions and submit scores.
  - View real-time leaderboards, filterable by quiz.
  - Manage profile details and reset passwords.
- **Admin Features**:
  - Create quizzes with customizable title, category, difficulty, tags, and questions.
  - Manage (edit/delete) existing quizzes with a modern glass-effect UI.
  - Role-based dashboard for quiz management.
- **UI/UX**:
  - Transparent glass-effect design with a clean, intuitive interface.
  - Responsive layout for seamless use on desktop and mobile.
- **Security**:
  - Role-based access (User/Admin) with JWT authentication.
  - Input validation for quiz creation and user registration.

## Architecture
The platform follows a client-server architecture with role-based access control. The flow is as follows:
1. **User Registration/Login**: Users register or log in, receiving a JWT token stored in `localStorage`.
2. **Role Check**: The system checks if the user is an Admin or User.
3. **User Flow**: Users can view quizzes, join by code, take quizzes, and check leaderboards.
4. **Admin Flow**: Admins can create, edit, or delete quizzes via dedicated dashboards.
5. **Backend**: Node.js with Express handles API requests, storing data in MongoDB.

## Database Schema
The platform uses MongoDB with two main collections:

### User Collection
Stores user credentials, profile details, and quiz scores.

| Field | Data Type | Description | Constraints |
| --- | --- | --- | --- |
| `_id` | ObjectId | Unique user ID | Auto-generated |
| `name` | String | Full name | Required |
| `gender` | String | Gender | Required |
| `email` | String | Email address | Required, Unique |
| `country_code` | String | Phone country code (e.g., +91) | Required |
| `phone` | String | Phone number | Required |
| `username` | String | Unique login name | Required, Unique |
| `password` | String | Password (to be hashed) | Required |
| `role` | String | Role (User/Admin) | Required, Enum |
| `quiz_attended_and_score` | Array | List of quizzes and scores | Default: [] |

### Quiz Collection
Stores quiz metadata and questions.

| Field | Data Type | Description | Constraints |
| --- | --- | --- | --- |
| `_id` | ObjectId | Unique quiz ID | Auto-generated |
| `title` | String | Quiz title | Required |
| `description` | String | Quiz description | Optional |
| `category` | String | Quiz category (e.g., Programming) | Required |
| `difficulty` | String | Difficulty (Easy/Medium/Hard) | Required |
| `createdAt` | Date | Creation timestamp | Default: Current |
| `questions` | Array | List of questions and options | Required |
| `tags` | Array | Quiz tags (e.g., ["python"]) | Default: [] |
| `code` | String | Unique quiz code | Required, Unique |

## Components
The platform is built with Angular and includes the following components:

| Component | Description | Files Used |
| --- | --- | --- |
| **Login** | Allows users to log in with username and password. | `login.component.ts/html/css` |
| **Register** | Enables new user registration. | `register.component.ts/html/css` |
| **User-Home** | User dashboard with quiz and profile navigation. | `user-home.component.ts/html/css` |
| **Leaderboard** | Displays top 10 users’ scores, filterable by quiz code. | `leaderboard.component.ts/html/css` |
| **View-Quizzes & Join** | Lists quizzes and allows joining by code. | `quizzes.component.ts/html/css`, `join.component.ts/html/css` |
| **Quiz-Page** | Displays quiz questions and processes submissions. | `quiz-page.component.ts/html/css` |
| **Profile** | Allows users to view/edit profile and reset passwords. | `profile.component.ts/html/css`, `reset-password.component.ts/html/css` |
| **Admin-Home** | Admin dashboard for quiz management. | `admin-home.component.ts/html/css` |
| **Create-Quiz** | Form for admins to create quizzes with a glass-effect UI. | `create-quiz.component.ts/html/css` |
| **Manage-Quiz** | Allows admins to view, edit, or delete quizzes with a glass-effect UI. | `manage-quiz.component.ts/html/css` |

## Screenshots
Below are screenshots showcasing the platform’s intuitive UI:

### Login Page
- Fields for username and password with a clean, glass-effect design.
![Login Page](images/Pasted%20image%2020250520190949.png)

### Register Page
- Form for new user registration, including name, email, and phone.
![Register Page](images/Pasted%20image%2020250520191027.png)

### User-Home Page
- User dashboard with links to join quizzes and view leaderboards.
![User-Home Page](images/Pasted%20image%2020250520191105.png)

### View-Quizzes Page
- Lists available quizzes with category and difficulty details.
![View-Quizzes Page](images/Pasted%20image%2020250520191128.png)

### Leaderboard Page
- Displays top users’ scores, encouraging competition.
![Leaderboard Page](images/Pasted%20image%2020250520191138.png)

### Profile Page
- Shows user details with options to edit.
![Profile Page](images/Pasted%20image%2020250520191148.png)

### Reset-Password Page
- Form to securely update user passwords.
![Reset-Password Page](images/Pasted%20image%2020250520191217.png)

### Join Page
- Allows users to enter a quiz code to participate.
![Join Page](images/Pasted%20image%2020250520191225.png)

### Quiz Page
- Displays questions with options for user responses.
![Quiz Page](images/Pasted%20image%2020250520191235.png)

### Admin-Home Page
- Admin dashboard for managing quizzes.
![Admin-Home Page](images/Pasted%20image%2020250520191243.png)

### Create-Quiz Page
- Form for admins to create quizzes with a transparent glass-effect UI.
![Create-Quiz Page](images/Pasted%20image%2020250520191253.png)

### Manage-Quiz Page
- Lists quizzes with options to edit or delete, styled with a glass effect.
![Manage-Quiz Page](images/Pasted%20image%2020250520191303.png)

## Installation
### Prerequisites
- Node.js (v16 or higher)
- Angular CLI (v19.2.5)
- MongoDB (running locally or via a cloud service)
- Git

### Client Setup (Angular)
1. Clone the repository:
   ```bash
   git clone https://github.com/<your-username>/QzHiveApp.git
   cd QzHiveApp
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   ng serve
   ```
4. Open `http://localhost:4200` in your browser.

### Server Setup (Node.js)
1. Navigate to the server directory:
   ```bash
   cd server
   ```
2. Install server dependencies:
   ```bash
   npm install express cors mongodb jsonwebtoken
   ```
3. Ensure MongoDB is running:
   ```bash
   mongod
   ```
4. Start the server:
   ```bash
   node server.js
   ```
5. The server runs on `http://localhost:5000`.

### Database
- MongoDB database: `qzhive`
- Collections: `users`, `quizzes`
- Ensure MongoDB is accessible at `mongodb://localhost:27017`.

## Development Server
Run the following to start a local development server:
```bash
ng serve
```
Navigate to `http://localhost:4200/`. The app will automatically reload if you change any source files.

## Code Scaffolding
Generate a new component with:
```bash
ng generate component component-name
```
For other schematics (e.g., directives, pipes), run:
```bash
ng generate --help
```

## Building
To build the project for production:
```bash
ng build
```
Build artifacts are stored in the `dist/` directory, optimized for performance.

## Running Tests
### Unit Tests
Execute unit tests with Karma:
```bash
ng test
```

## License
This project is licensed under the MIT License. See the LICENSE file for details.

---
QzHiveApp - Built for learning, competition, and engagement. Happy quizzing!
