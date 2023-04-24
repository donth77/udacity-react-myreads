import "../App.css";
import { useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { SHELF_STATUS } from "../utils/enums";
import Bookshelf from "../components/Bookshelf";

function MainPage(props) {
  const { allBooks, handleUpdateShelf, openModal } = props;
  const navigate = useNavigate();

  const openSearch = useCallback(
    (event) => {
      if (event.key === "Enter") {
        navigate("/search");
      }
    },
    [navigate]
  );

  useEffect(() => {
    document.addEventListener("keydown", openSearch, false);
    return () => {
      document.removeEventListener("keydown", openSearch, false);
    };
  }, [openSearch]);

  return (
    <div className="app">
      <div className="list-books">
        <div className="list-books-title">
          <h1>MyReads</h1>
        </div>
        <div className="list-books-content">
          <div>
            <Bookshelf
              shelfType={SHELF_STATUS.CURRENTLY_READING}
              books={allBooks.filter(
                (book) => book.shelf === SHELF_STATUS.CURRENTLY_READING
              )}
              handleUpdateShelf={handleUpdateShelf}
              openModal={openModal}
            />
            <Bookshelf
              shelfType={SHELF_STATUS.WANT_TO_READ}
              books={allBooks.filter(
                (book) => book.shelf === SHELF_STATUS.WANT_TO_READ
              )}
              handleUpdateShelf={handleUpdateShelf}
              openModal={openModal}
            />
            <Bookshelf
              shelfType={SHELF_STATUS.READ}
              books={allBooks.filter(
                (book) => book.shelf === SHELF_STATUS.READ
              )}
              handleUpdateShelf={handleUpdateShelf}
              openModal={openModal}
            />
          </div>
        </div>
        <div className="open-search">
          <Link to="/search">Add a book</Link>
        </div>
      </div>
    </div>
  );
}

export default MainPage;
