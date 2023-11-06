import React, { useState, useEffect } from "react";
import axios from "axios";
import "./BookForm.css";

const api = axios.create({
  baseURL: "http://localhost:3000",
});

function BookForm() {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [publicationDate, setPublicationDate] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const handleAddBook = async () => {
    try {
      const response = await api.post("/api/addBook", {
        title,
        author,
        publicationDate,
      });

      if (response.status === 201) {
        setSuccessMessage("Book created successfully");

        // Automatically hide the success message after 5 seconds
        setTimeout(() => {
          setSuccessMessage(null);
        }, 2000);
      } else {
        console.error(`${response.data.error}`);
        setErrorMessage(`${response.data.error}`);

        // Automatically hide the success message after 5 seconds
        setTimeout(() => {
          setErrorMessage(null);
        }, 2000);
      }
    } catch (error) {
      console.error("Error adding book:", error);
      // Automatically hide the success message after 5 seconds
    }
  };

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        if (title) {
          const response = await api.get(`/api/books/search?title=${title}`);

          if (response.status === 200) {
            setSearchResults(response.data);
          } else {
            console.error("Error searching for books:", response.data);
          }
        } else {
          setSearchResults([]);
        }
      } catch (error) {
        console.error("Error searching for books:", error);
      }
    };

    fetchBooks();
  }, [title]);

  return (
    <div className="book-form-container">
      <h2 className="mb-3">Add New Book</h2>

      {successMessage && (
        <div className="alert alert-success">{successMessage}</div>
      )}

      {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
      <form>
        <div className="form-group">
          <input
            type="text"
            className="form-control"
            id="title"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <ul className="list-group mb-3">
          {searchResults.map((book) => (
            <li key={book.id} className="list-group-item">
              {book.title} by {book.author}
            </li>
          ))}
        </ul>
        <div className="form-group">
          <input
            type="text"
            className="form-control"
            id="author"
            placeholder="Author"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            className="form-control"
            id="publicationDate"
            placeholder="Publication date"
            value={publicationDate}
            onChange={(e) => setPublicationDate(e.target.value)}
          />
        </div>
        <button
          type="button"
          className="btn btn-primary"
          onClick={handleAddBook}
        >
          Add Book
        </button>
      </form>
    </div>
  );
}

export default BookForm;
