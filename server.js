const express = require('express');
const bcrypt = require('bcryptjs');
const mysql = require('mysql2/promise');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// Initialize app and middleware
const app = express();
app.use(express.json());

// MySQL Connection
const dbConfig = {
  host: '181.215.246.169',
  user: 'root', // Change to your MySQL username
  password: 'root', // Change to your MySQL password
  database: 'CCSD',
  port: 3306,
};

// Swagger setup
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Registration API',
      version: '1.0.0',
      description: 'API for user registration using MySQL',
    },
  },
  apis: ['./server.js'],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// POST API for registration
/**
 * @swagger
 * /register:
 *   post:
 *     summary: Register a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *               - email
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: User successfully registered
 */
app.post('/register', async (req, res) => {
  const { username, password, email } = req.body;

  // Encrypt password
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    // Connect to MySQL database
    const connection = await mysql.createConnection(dbConfig);

    // Call stored procedure to register user
    const [rows] = await connection.execute(
      'CALL registerUser(?, ?, ?)', 
      [username, hashedPassword, email]  // Parameters for userName, userPWD, userEmail
    );

    await connection.end();

    res.status(200).json({ message: 'User successfully registered', username });
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ message: 'An error occurred during registration', error });
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
