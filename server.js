const express = require('express');
const mongoose = require('mongoose');
const app = express();

app.use(express.json());

// MongoDB Connection
const uri = 'mongodb://127.0.0.1:27017/BookList';
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected...'))
  .catch(err => console.log(err));

// Book Schema and Model
const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  description: { type: String }
});

const Book = mongoose.model('Book', bookSchema);

// CRUD Operations
// Get all books
app.get('/api/books', async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// Get single book by id
app.get('/api/books/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ msg: 'Book not found' });
    res.json(book);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// Add a new book
app.post('/api/books', async (req, res) => {
  try {
    const newBook = new Book(req.body);
    const book = await newBook.save();
    res.json(book);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// Update book by id
app.put('/api/books/:id', async (req, res) => {
  try {
    const book = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!book) return res.status(404).json({ msg: 'Book not found' });
    res.json(book);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// Delete book by id
app.delete('/api/books/:id', async (req, res) => {
  try {
    const book = await Book.findByIdAndRemove(req.params.id);
    if (!book) return res.status(404).json({ msg: 'Book not found' });
    res.json({ msg: 'Book removed' });
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// Server listening on port 5000
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
