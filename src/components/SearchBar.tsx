import styles from "./SearchBar.module.scss";

const SearchBar: React.FC = () => {
  return (
    <div className={styles["search-bar-container"]}>
      <label htmlFor={"search-input"}>Search:</label>
      <input id={"search-input"} type="text" />
    </div>
  );
};

export default SearchBar;
