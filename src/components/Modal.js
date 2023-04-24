import "./Modal.css";
import { useRef } from "react";
import { isArray, isEmpty } from "lodash";
import { SHELF_STATUS, SHELF_STR } from "../utils/enums";
export default function Modal(props) {
  const { onClose, show, bookData } = props;
  const ref = useRef();

  function handleClose() {
    onClose?.();
  }

  if (!show || !bookData) {
    return null;
  }
  const {
    title,
    authors,
    description,
    shelf,
    publisher,
    publishedDate,
    pageCount,
  } = bookData;
  const image = bookData?.imageLinks?.thumbnail;
  const hasAuthors = isArray(authors) && !isEmpty(authors);
  const inShelf = shelf && shelf !== SHELF_STATUS.NONE;
  const previewLink = bookData?.previewLink;

  return (
    <div
      className="overlay"
      onClick={(e) => {
        // close if click outside modal
        if (ref.current && !ref.current.contains(e.target)) {
          handleClose();
        }
      }}
    >
      <div className="modal" ref={ref}>
        <div className="title">
          {title}
          {inShelf && (
            <div className="inShelfText">{`${SHELF_STR[shelf]}`}</div>
          )}
          {hasAuthors && <div className="authors">{authors.join(", ")}</div>}
        </div>

        <div className="content">
          <div className="column">
            {image && (
              <div
                className="thumbnail"
                style={{
                  backgroundImage: `url("${image}")`,
                }}
              />
            )}
            {publisher && <div className="info">{publisher}</div>}
            {publishedDate && (
              <div className="info">
                {new Date(publishedDate).getFullYear()}
              </div>
            )}
            {pageCount && <div className="info">{`${pageCount} pages`}</div>}
          </div>
          <p className="description">{description}</p>
        </div>
        <div className="actions">
          {previewLink && (
            <a href={previewLink} target="_blank" rel="noreferrer">
              <button className="toggle-button">Preview</button>
            </a>
          )}
          <button className="toggle-button" onClick={handleClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
