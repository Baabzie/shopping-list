import styles from "./SearchBar.module.scss";
import { useRef } from "react";

type SearchProps = {
  setFilterString: (filter: string) => void;
};

const SearchBar: React.FC<SearchProps> = ({ setFilterString }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSearchInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilterString(event.target.value);
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
    </div>
  );
};

export default SearchBar;
