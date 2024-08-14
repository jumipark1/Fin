import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../App.css';

const AddBook = () => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [description, setDescription] = useState('');
  const [imageFile, setImageFile] = useState(null);  // This will hold the File object
  const [imagePreview, setImagePreview] = useState(null);  // This is for previewing the image

  const location = useLocation();
  const navigate = useNavigate();
  const bookIndex = location.state?.index;

  useEffect(() => {
    if (location.state?.book) {
      const { book } = location.state;
      setTitle(book.title);
      setAuthor(book.author);
      setDescription(book.description);
      setImagePreview(book.imageFile);  // This is the data URL from the local storage
    }
  }, [location]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setImageFile(file);  // Store the actual File object for later use
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const storedBooks = JSON.parse(localStorage.getItem('books')) || [];
    const newBook = { title, author, description, imageFile: imagePreview };

    if (bookIndex !== undefined) {
      storedBooks[bookIndex] = newBook; // Update existing book
    } else {
      storedBooks.push(newBook); // Add new book
    }

    localStorage.setItem('books', JSON.stringify(storedBooks));
    navigate('/');
  };

  return (
    <div className="form-container">
      <h1 className="centered">{bookIndex !== undefined ? 'Edit Book' : 'Add Book'}</h1>
      <h2 className="centered">Create new Book</h2>
      <form onSubmit={handleSubmit} className="centered">
        <label>
          <strong>Title of the Book:</strong>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="input-field"
          />
        </label>
        <br />
        <label>
          <strong>Author:</strong>
          <input
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            required
            className="input-field"
          />
        </label>
        <br />
        <label>
          <strong>Describe this book:</strong>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="input-field"
          ></textarea>
        </label>
        <br />
        <label>
          <strong>Upload Image:</strong>
          <input
            type="file"
            onChange={handleImageUpload}
            className="input-field"
          />
        </label>
        <br />
        {imagePreview && (
          <div>
            <img src={imagePreview} alt="Preview" style={{ width: '100px', height: '100px' }} />
          </div>
        )}
        <br />
        <div className="button-group">
          <button type="submit" className="centered-button">{bookIndex !== undefined ? 'Update' : 'Submit'}</button>
          <button type="button" className="centered-button" onClick={() => navigate('/')}>Show Book List</button>
        </div>
      </form>
    </div>
  );
};

export default AddBook;


