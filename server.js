import express from 'express';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import mysql from 'mysql2/promise';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import cors from 'cors';

const app = express();
app.use(cors());
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

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

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
 *       500:
 *         description: Server error
 */
app.post('/register', async (req, res) => {
  const { username, password, email } = req.body;

  if (!username || !password || !email) {
      return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
      const hashedPassword = await bcrypt.hash(password, 10);
    //   const userId = uuidv4();

      // Connect to MySQL and execute stored procedure
    //   const connection = await mysql.createConnection(dbConfig);
    //   await connection.query('CALL registerUser(?, ?, ?)', 
      await db.query('CALL registerUser(?, ?, ?)', 
        [username, hashedPassword, email]);

      res.status(200).json({ message: 'User successfully registered' });
    //   connection.end();
  } catch (error) {
      //console.error(error); // Log the error for debugging
      if (error.code === 'ER_DUP_ENTRY') {
          return res.status(400).json({ message: 'Email already exists.' });
      }
      return res.status(500).json({ message: 'Error registering user', error: error.message });
  }
});

// Start server
// const PORT = process.env.PORT || 3002;
// app.listen(PORT, () => {
//     console.log(`Server running on port ${PORT}`);
// });
app.listen(3002, '0.0.0.0', () => {
    console.log('Server is running on port 3002');
});

export default app;