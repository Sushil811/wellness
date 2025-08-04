# 🌿 Wellness Tracker - Full Stack Application

A comprehensive wellness tracking application built with the MERN stack (MongoDB, Express.js, React.js, Node.js) that allows users to track their fitness activities, nutrition, sleep, and meditation sessions.

## 🚀 Features

### User Management
- User registration and authentication
- Profile management with fitness goals
- JWT-based authentication

### Wellness Tracking
- **Workout Tracking**: Log exercises, sets, reps, weights, and duration
- **Nutrition Tracking**: Record meals, food items, and nutritional information
- **Sleep Tracking**: Monitor sleep hours and quality
- **Meditation Tracking**: Log meditation sessions with type and mood
- **Activity History**: View and manage all wellness activities

### Dashboard & Analytics
- Overview of recent activities
- Quick action buttons for adding new activities
- Statistics and summaries
- Modern, responsive UI with Material-UI

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing

### Frontend
- **React.js** - Frontend framework
- **React Router** - Client-side routing
- **Material-UI** - UI component library
- **Axios** - HTTP client
- **Context API** - State management


4. **Set up environment variables**
   
   Create a `.env` file in the server directory:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/wellness-app
   JWT_SECRET=HJHRGH76KJHERJH7346736766767JUG34564998JHGHBHB
   NODE_ENV=development
   ```

5. **Start MongoDB**
   
   Make sure MongoDB is running on your system or update the MONGODB_URI in the .env file to point to your MongoDB instance.

### Running the Application

1. **Start the backend server**
   ```bash
   cd server
   npm run dev
   ```
   The server will start on http://localhost:5000

2. **Start the frontend application**
   ```bash
   cd client
   npm start
   ```
   The React app will start on http://localhost:3000

3. **Access the application**
   
   Open your browser and navigate to http://localhost:3000

## 📖 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user profile
- `PUT /api/auth/profile` - Update user profile

### Wellness Activities
- `GET /api/wellness` - Get all activities
- `POST /api/wellness` - Create new activity
- `GET /api/wellness/:id` - Get specific activity
- `PUT /api/wellness/:id` - Update activity
- `DELETE /api/wellness/:id` - Delete activity
- `GET /api/wellness/stats/summary` - Get statistics
- `GET /api/wellness/recent/activities` - Get recent activities

### Users
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get specific user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

## 🔧 Development

### Backend Development
```bash
cd server
npm run dev  # Start with nodemon for development
```

### Frontend Development
```bash
cd client
npm start    # Start React development server
```

### Database
The application uses MongoDB. Make sure MongoDB is running locally or update the connection string in the `.env` file.

## 🚀 Deployment

### Backend Deployment
1. Set up environment variables for production
2. Use a process manager like PM2
3. Deploy to platforms like Heroku, Railway, or DigitalOcean

### Frontend Deployment
1. Build the React app: `npm run build`
2. Deploy the build folder to platforms like Vercel, Netlify, or AWS S3

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- MongoDB for the database
- React community for the excellent documentation 
