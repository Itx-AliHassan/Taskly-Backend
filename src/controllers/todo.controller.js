const Todo = require('../models/Todo');

// @desc    Get all todos for the logged-in user
// @route   GET /api/todos
// @access  Private
const getTodos = async (req, res) => {
  try {
    // Only fetch todos that belong to the authenticated user
    const todos = await Todo.find({ userId: req.user._id }).sort({ createdAt: -1 });
    return res.json(todos);
  } catch (error) {
    console.error('Get todos error:', error);
    return res.status(500).json({ message: 'Server error fetching todos' });
  }
};

// @desc    Create a new todo for the logged-in user
// @route   POST /api/todos
// @access  Private
const createTodo = async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ message: 'Todo title is required' });
    }

    // Never trust userId from body; always use verified req.user._id
    const todo = await Todo.create({
      title: title.trim(),
      description: description ? description.trim() : '',
      completed: false,
      userId: req.user._id,
    });

    return res.status(201).json(todo);
  } catch (error) {
    console.error('Create todo error:', error);
    return res.status(500).json({ message: 'Server error creating todo' });
  }
};

// @desc    Update a todo (title and description)
// @route   PUT /api/todos/:id
// @access  Private
const updateTodo = async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ message: 'Todo title cannot be empty' });
    }

    // Ensure todo exists and belongs to the authenticated user
    const todo = await Todo.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!todo) {
      return res.status(404).json({ message: 'Todo not found or unauthorized' });
    }

    todo.title = title.trim();
    if (description !== undefined) {
      todo.description = description.trim();
    }

    const updatedTodo = await todo.save();
    return res.json(updatedTodo);
  } catch (error) {
    console.error('Update todo error:', error);
    return res.status(500).json({ message: 'Server error updating todo' });
  }
};

// @desc    Toggle todo completion status
// @route   PATCH /api/todos/:id/toggle
// @access  Private
const toggleTodo = async (req, res) => {
  try {
    // Ensure todo exists and belongs to the authenticated user
    const todo = await Todo.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!todo) {
      return res.status(404).json({ message: 'Todo not found or unauthorized' });
    }

    todo.completed = !todo.completed;
    const updatedTodo = await todo.save();

    return res.json(updatedTodo);
  } catch (error) {
    console.error('Toggle todo error:', error);
    return res.status(500).json({ message: 'Server error toggling todo' });
  }
};

// @desc    Delete a todo
// @route   DELETE /api/todos/:id
// @access  Private
const deleteTodo = async (req, res) => {
  try {
    // Ensure todo exists and belongs to the authenticated user before deletion
    const todo = await Todo.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!todo) {
      return res.status(404).json({ message: 'Todo not found or unauthorized' });
    }

    return res.json({ message: 'Todo deleted successfully', id: req.params.id });
  } catch (error) {
    console.error('Delete todo error:', error);
    return res.status(500).json({ message: 'Server error deleting todo' });
  }
};

module.exports = {
  getTodos,
  createTodo,
  updateTodo,
  toggleTodo,
  deleteTodo,
};
