import styles from "./SearchBar.module.scss";
import { useState, useEffect, useRef } from "react";
import { itemI } from "@/interfaces/todoI";
import Add from "@mui/icons-material/Add";

type SearchProps = {
  items: itemI[];
  addItem: (item: itemI) => void;
};

const SearchBar: React.FC<SearchProps> = ({ items, addItem }) => {
  const [filterString, setFilterString] = useState<string>("");
  const [filteredItems, setFilteredItems] = useState<itemI[]>([]);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (filterString === "") {
      setFilteredItems([]);
    } else {
      const lowerCaseFilter = filterString.toLowerCase();
      const filteredArray = items.filter((item) =>
        item.text.toLowerCase().includes(lowerCaseFilter)
      );
      setFilteredItems(filteredArray);
    }
  }, [filterString, items]);

  const handleSearchInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilterString(event.target.value);
  };

  const handleAddBtn = (text: string) => {
    addItem({ text: text, done: false });
    setFilterString(""); // Reset filter string
    if (inputRef.current) {
      inputRef.current.value = ""; // Clear the input field
    }
  };

  const isFilterStringInItems = filteredItems.some(
    (item) => item.text.toLowerCase() === filterString.toLowerCase()
  );

  return (
    <div className={styles["search-bar-container"]}>
      <label htmlFor="search-input">Add Item:</label>
      <input
        id="search-input"
        type="text"
        ref={inputRef}
        onChange={handleSearchInput}
      />
      <ul className={styles["filtered-list"]}>
        {filteredItems.map((item) => (
          <li key={item.text}>
            <p>{item.text}</p>
            {!item.done ? (
              <div className={styles["information-div"]}>
                <p>Already in cart</p>
              </div>
            ) : (
              <>
                <div className={styles["information-div"]}>
                  <p>Add from saved items</p>
                  <button
                    className="add-btn"
                    onClick={() => handleAddBtn(item.text)}
                  >
                    <Add className="icon" />
                  </button>
                </div>
              </>
            )}
          </li>
        ))}
        {filterString !== "" && !isFilterStringInItems && (
          <li>
            <p>{filterString}</p>
            <div className={styles["information-div"]}>
              <p>Add new item</p>
              <button
                className="add-btn"
                onClick={() => handleAddBtn(filterString)}
              >
                <Add className="icon" />
              </button>
            </div>
          </li>
        )}
      </ul>
    </div>
  );
};

export default SearchBar;
