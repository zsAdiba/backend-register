# backend-register
Repository for server side module register of Root X CCSD Final Project

registration-api/
│
├── node_modules/         # Automatically created after npm install
│
├── userdata.json         # This file will be created when a user registers (empty initially)
│
├── server.js             # Main server file containing API logic
│
├── package.json          # Project metadata and dependencies
│
├── package-lock.json     # Automatically created to lock dependency versions
│
└── README.md             # Optional, project documentation (if needed)

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