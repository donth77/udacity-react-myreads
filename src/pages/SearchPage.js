import "../App.css";
import { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { isArray, isEmpty } from "lodash";
import { search } from "../BooksAPI";
import Book from "../components/Book";
import { useDebounce } from "../utils/hooks";

const MAX_RESULTS = 100;

function SearchPage(props) {
  const { allBooks, handleUpdateShelf, openModal } = props;
  const navigate = useNavigate();
  const [searchResults, setSearchResults] = useState([]);

  const exitOnEsc = useCallback(
    (event) => {
      if (event.key === "Escape") {
        navigate("/");
      }
    },
    [navigate]
  );

  useEffect(() => {
    document.addEventListener("keydown", exitOnEsc, false);
    return () => {
      document.removeEventListener("keydown", exitOnEsc, false);
    };
  }, [exitOnEsc]);

  const debouncedSearch = useDebounce(
    async function (event) {
      const trimmedQuery = event.target.value.trim();
      if (trimmedQuery) {
        try {
          const books = await search(trimmedQuery, MAX_RESULTS);
          setSearchResults(books);
        } catch (err) {
          console.error(err);
        }
      } else {
        setSearchResults([]);
      }
    },
    200,
    []
  );

  function handleChange(event) {
    debouncedSearch(event);
  }

  return (
    <div className="search-books">
      <div className="search-books-bar">
        <Link to="/" className="close-search">
          Close
        </Link>
        <div className="search-books-input-wrapper">
          <input
            type="text"
            placeholder="Search by title, author, or ISBN"
            onChange={handleChange}
            autoFocus
          />
        </div>
      </div>
      <div className="search-books-results">
        <ol className="books-grid">
          {isArray(searchResults) && !isEmpty(searchResults)
            ? searchResults
                .filter((book) => book != null && book.id != null)
                .map((book) => (
                  <li key={book.id}>
                    <Book
                      bookData={book}
                      allBooks={allBooks}
                      handleUpdateShelf={handleUpdateShelf}
                      openModal={openModal}
                      canDrag={false}
                    />
                  </li>
                ))
            : null}
        </ol>
      </div>
    </div>
  );
}

export default SearchPage;
