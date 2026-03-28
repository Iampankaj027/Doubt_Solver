const express = require('express');
const router  = express.Router();
const {
  getAnswers,
  createAnswer,
  acceptAnswer,
  deleteAnswer
} = require('../controllers/answerController');
const { protect } = require('../middleware/authMiddleware');

router.get('/:questionId',         getAnswers);
router.post('/:questionId',        protect, createAnswer);
router.patch('/:id/accept',        protect, acceptAnswer);
router.delete('/:id',              protect, deleteAnswer);

module.exports = router;