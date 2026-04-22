const express = require('express');
const router = express.Router();
const { getAllUsers, updateUserRole, deleteUser, getStats } = require('../controllers/adminController');
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');

// All admin routes require auth + admin role
router.use(authMiddleware, adminMiddleware);

// GET /api/admin/stats
router.get('/stats', getStats);

// GET /api/admin/users
router.get('/users', getAllUsers);

// PUT /api/admin/users/:id/role
router.put('/users/:id/role', updateUserRole);

// DELETE /api/admin/users/:id
router.delete('/users/:id', deleteUser);

module.exports = router;
