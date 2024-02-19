require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const subjectRoutes = require('./routes/SubjectRoutes');
const topicRouters = require('./routes/TopicRouters');
const contentRouters = require('./routes/ContentRouters');

const app = express();
const port = process.env.PORT;


// Connect to MongoDB
const uri = process.env.MONGODB_URI;
connectDB(uri);

// Middleware
app.use(cors({ origin: process.env.FRONTEND_URL }));
app.use(express.json());

// Routes
app.use('/subjects', subjectRoutes);
app.use('/topics', topicRouters);
app.use('/content', contentRouters);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

/*
app.get('/topics/:categoryid', db.getTopicsForCateg)
app.get('/categories', db.getCategories)
app.get('/content/:topic_id', db.getContentWithTopicId)
*/
