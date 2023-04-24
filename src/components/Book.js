import "../App.css";
import { isArray, isEmpty } from "lodash";
import toast from "react-hot-toast";
import { useDrag, DragPreviewImage } from "react-dnd";
import { SHELF_STATUS, SHELF_STR } from "../utils/enums";
import { update } from "../BooksAPI";

const BOOK_WIDTH = 128;
const BOOK_HEIGHT = 170;

function Book(props) {
  const { bookData, allBooks, handleUpdateShelf, openModal, canDrag } = props;
  const { id, title, authors, shelf } = bookData;
  const image = bookData?.imageLinks?.thumbnail;

  if (allBooks) {
    const thisBook = allBooks.find((book) => book.id === id);
    if (thisBook?.shelf && !bookData.shelf) {
      bookData.shelf = thisBook.shelf; // fix shelf missing in search results
    }
  }

  async function updateShelf(newShelf) {
    handleUpdateShelf?.(bookData, newShelf); // optimistically update the UI before running API query
    try {
      await update(bookData, newShelf);
      toast.success(
        newShelf === SHELF_STATUS.NONE
          ? `Removed "${bookData.title}"`
          : `"${bookData.title}" in ${SHELF_STR[newShelf]}`
      );
    } catch (err) {
      toast.error(`Failed to update`);
      console.error(err);
    }
  }

  const [{ isDragging }, drag, dragPreview] = useDrag(
    () => ({
      type: bookData.shelf || "",
      item: { name: title, book: bookData },
      canDrag: canDrag ?? true,
      end: (item, monitor) => {
        const dropResult = monitor.getDropResult();
        if (item && dropResult) {
          updateShelf(dropResult.shelf);
        }
      },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
        handlerId: monitor.getHandlerId(),
      }),
    }),
    [bookData]
  );

  return (
    <>
      <DragPreviewImage connect={dragPreview} src={image} />
      <div className={"book"} ref={drag}>
        <div className="book-top">
          <div
            className="book-cover"
            data-testid={`book-${bookData.shelf}`}
            style={{
              width: BOOK_WIDTH,
              height: BOOK_HEIGHT,
              backgroundImage: image ? `url("${image}")` : "", // check if thumbnail missing,
              opacity: isDragging ? 0.4 : 1,
            }}
          ></div>
          <div className="book-shelf-changer">
            <select
              defaultValue={shelf}
              onChange={(e) => updateShelf(e.target.value)}
            >
              <option value="none" disabled>
                Move to…
              </option>
              <option value="currentlyReading">Currently Reading</option>
              <option value="wantToRead">Want to Read</option>
              <option value="read">Read</option>
              <option value="none">None</option>
            </select>
          </div>
          <div
            className="book-info-button"
            onClick={() => openModal(bookData)}
          />
        </div>
        <div className="book-title">{title}</div>
        <div className="book-authors">
          {
            // check if author missing
            isArray(authors) && !isEmpty(authors) ? authors.join(", ") : ""
          }
        </div>
      </div>
    </>
  );
}

export default Book;
