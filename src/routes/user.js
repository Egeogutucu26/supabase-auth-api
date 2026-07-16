const express = require('express');
const router = express.Router();
const { getMe, updateMe } = require('../controllers/userController');
const { requireAuth } = require('../middleware/auth');

router.get('/me', requireAuth, getMe);
router.put('/me', requireAuth, updateMe);

module.exports = router;
