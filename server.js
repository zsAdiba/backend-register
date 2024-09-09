const express = require('express');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// Initialize app and middleware
const app = express();
app.use(express.json());

// Swagger setup
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Registration API',
      version: '1.0.0',
      description: 'API for user registration',
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
 *               - firstname
 *               - lastname
 *               - username
 *               - employeecode
 *               - password
 *             properties:
 *               firstname:
 *                 type: string
 *               lastname:
 *                 type: string
 *               username:
 *                 type: string
 *               employeecode:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User successfully registered
 */
app.post('/register', async (req, res) => {
  const { firstname, lastname, username, employeecode, password } = req.body;
  const createdDate = new Date().toISOString();
  const modifiedDate = createdDate;

  // Encrypt password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create new user object
  const newUser = {
    firstname,
    lastname,
    username,
    employeecode,
    password: hashedPassword,
    createdDate,
    modifiedDate,
  };

  // Read the existing user data from userdata.json
  let userData = [];
  if (fs.existsSync('userdata.json')) {
    const data = fs.readFileSync('userdata.json');
    userData = JSON.parse(data);
  }

  // Add new user to the list
  userData.push(newUser);

  // Write updated data back to userdata.json
  fs.writeFileSync('userdata.json', JSON.stringify(userData, null, 2));

  res.status(200).json({ message: 'User successfully registered', newUser });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
