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

  const handleAddBtn = (item: itemI) => {
    addItem(item);
  };

  return (
    <div className={styles["search-bar-container"]}>
      <label htmlFor="search-input">Search:</label>
      <input
        id="search-input"
        type="text"
        ref={inputRef}
        onChange={handleSearchInput}
      />
      <ul className={styles["filtered-list"]}>
        {filteredItems.map((item) => {
          return (
            <li>
              <p>{item.text}</p>
              {!item.done ? (
                <p>Already in cart</p>
              ) : (
                <button className="add-btn" onClick={() => handleAddBtn(item)}>
                  <Add className="icon" />
                </button>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default SearchBar;
