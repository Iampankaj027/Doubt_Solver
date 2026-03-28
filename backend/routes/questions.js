const express = require('express');
const router  = express.Router();
const {
  getQuestions,
  getQuestion,
  createQuestion,
  deleteQuestion,
  getTags
} = require('../controllers/questionController');
const { protect } = require('../middleware/authMiddleware');

router.get('/tags',   getTags);
router.get('/',       getQuestions);
router.get('/:id',    getQuestion);
router.post('/',      protect, createQuestion);
router.delete('/:id', protect, deleteQuestion);

module.exports = router;