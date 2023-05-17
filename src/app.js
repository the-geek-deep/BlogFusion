const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = 3000;

// Connect to MongoDB
mongoose.connect('mongodb://localhost/blog-website', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Error connecting to MongoDB:', err));

// Configure Express to parse JSON data
app.use(express.json());

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Routes
const authRoutes = require('./routes/auth');
const blogRoutes = require('./routes/blog');

app.use('/auth', authRoutes);
app.use('/blog', blogRoutes);

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
