import express from 'express';
import bcrypt from 'bcryptjs';
import mysql from 'mysql2/promise';
import cors from 'cors';

const app = express();
//Configure CORS
const corsOptions = {
    origin: '*', // Allow all origins
};

// Use CORS with the specified options
app.use(cors(corsOptions));

// Parse URL-encoded data
app.use(express.urlencoded({ extended: true })); // Enables parsing of URL-encoded data

// Parse JSON data
app.use(express.json());

// Database connection
const dbConfig = {
    host: '181.215.246.169',
    user: 'root',
    password: 'root',  // replace with your actual password
    database: 'CCSD',
    port: 3306
};

// Initialize database connection
let db;
(async () => {
    db = await mysql.createConnection(dbConfig);
})();

// Swagger setup
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'User Registration API',
            version: '1.0.0',
            description: 'API to register new users',
        },
        servers: [{
            url: 'http://localhost:3002',
        }]
    },
    apis: ['./server.js']
};

app.post('/register', async (req, res) => {
  const { username, password, email } = req.body;

  if (!username || !password || !email) {
      return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
      const hashedPassword = await bcrypt.hash(password, 10);
      await db.query('CALL registerUser(?, ?, ?)', [username, hashedPassword, email]);

      res.status(200).json({ message: 'User successfully registered' });
  } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
          return res.status(400).json({ message: 'Email already exists.' });
      }
      return res.status(500).json({ message: 'Error registering user', error: error.message });
  }
});

// Start server
app.listen(3002, '0.0.0.0', () => {
    console.log('Server is running on port 3002');
});

export default app;