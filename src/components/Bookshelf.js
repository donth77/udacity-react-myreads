import "../App.css";
import { useDrop } from "react-dnd";
import Book from "./Book";
import { SHELF_STR } from "../utils/enums";

function Bookshelf(props) {
  const { shelfType, books, handleUpdateShelf, openModal } = props;
  const title = SHELF_STR[shelfType];

  const [{ canDrop, isOver }, drop] = useDrop(() => ({
    accept: Object.keys(SHELF_STR).filter((key) => key !== shelfType),
    drop: () => ({ shelf: shelfType }),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  }));
  const isActive = canDrop && isOver;
  let backgroundColor = "";
  if (isActive) {
    backgroundColor = "#c4d9f7";
  } else if (canDrop) {
    backgroundColor = "#ddd";
  }

  return (
    <div
      className="bookshelf"
      ref={drop}
      style={{ backgroundColor }}
      data-testid={`bookshelf-${title}`}
    >
      <h2 className="bookshelf-title">{title}</h2>
      <div className="bookshelf-books">
        <ol className="books-grid">
          {books.map((book) => (
            <li key={book.id}>
              <Book
                bookData={book}
                handleUpdateShelf={handleUpdateShelf}
                openModal={openModal}
              />
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

export default Bookshelf;
