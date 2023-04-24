import "./App.css";
import { useState, useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Modal from "./components/Modal";
import { getAll } from "./BooksAPI";
import SearchPage from "./pages/SearchPage";
import MainPage from "./pages/MainPage";

function App() {
  const [allBooks, setAllBooks] = useState([]);
  const [triggerFetch, setTrigger] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [modalBook, setModalBook] = useState(null);

  useEffect(() => {
    const fetchAllBooks = async () => {
      const data = await getAll();
      return data;
    };

    fetchAllBooks()
      .then((respBooks) => {
        setAllBooks(respBooks);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [triggerFetch]);

  function handleUpdateShelf(bookData, newShelf) {
    setAllBooks([
      ...allBooks.filter((book) => book.id !== bookData.id),
      {
        ...bookData,
        shelf: newShelf,
      },
    ]);

    setTimeout(() => {
      // UI was optimistically updated
      // Retrigger the fetch to reflect the true state of data in the backend
      setTrigger(!triggerFetch);
    }, 150);
  }

  function openModal(bookData) {
    setModalBook(bookData);
    setShowModal(true);
  }

  function closeModal() {
    setShowModal(false);
  }

  return (
    <>
      <Routes>
        <Route
          exact
          path="/"
          element={
            <MainPage
              allBooks={allBooks}
              handleUpdateShelf={handleUpdateShelf}
              openModal={openModal}
            />
          }
        />
        <Route
          path="/search"
          element={
            <SearchPage
              allBooks={allBooks}
              handleUpdateShelf={handleUpdateShelf}
              openModal={openModal}
            />
          }
        />
      </Routes>
      {/** Toasts */}
      <Toaster />
      {/** Modal */}
      <Modal onClose={closeModal} show={showModal} bookData={modalBook} />
    </>
  );
}

export default App;
