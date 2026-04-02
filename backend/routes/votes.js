const express = require('express');
const router  = express.Router();
const { vote } = require('../controllers/voteController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, vote);

module.exports = router;    