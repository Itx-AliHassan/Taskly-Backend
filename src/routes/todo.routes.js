const express = require('express');
const router = express.Router();
const {
  getTodos,
  createTodo,
  updateTodo,
  toggleTodo,
  deleteTodo,
} = require('../controllers/todo.controller');
const { protect } = require('../middleware/auth.middleware');

// Protect all todo routes with JWT authentication middleware
router.use(protect);

router.get('/', getTodos);
router.post('/', createTodo);
router.put('/:id', updateTodo);
router.patch('/:id/toggle', toggleTodo);
router.delete('/:id', deleteTodo);

module.exports = router;
