import React from "react";
import { useState, useEffect, useRef } from "react";
import Add from "@mui/icons-material/Add";
import Close from "@mui/icons-material/Close";
import styles from "./EditStoresPopup.module.scss";

type EditStoresPopupProps = {
  onClose: () => void;
  addStore: (store: string) => void;
  removeStore: (i: number) => void;
  stores: string[];
};

const EditStoresPopup: React.FC<EditStoresPopupProps> = ({
  onClose,
  addStore,
  removeStore,
  stores,
}) => {
  const [inputValue, setInputValue] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleAddBtn = () => {
    if (inputValue.length > 0) {
      addStore(inputValue);
      setInputValue("");
    }
  };

  const handleRemoveBtn = (i: number) => {
    removeStore(i);
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleAddBtn();
    }
  };

  return (
    <div className={styles["popup-container"]}>
      {/* <div className={styles["close-btn-div"]}>
        <button className="close-btn" onClick={onClose}>
          <Close className="icon" />
        </button>
      </div> */}
      <div className={styles["popup"]} ref={popupRef}>
        <h3>Stores:</h3>
        <ul className={styles["store-list"]}>
          {stores.map((store, i) => {
            return (
              <li>
                <p>{store}</p>
                <button
                  className="remove-btn"
                  onClick={() => handleRemoveBtn(i)}
                >
                  <Close className="icon" />
                </button>
              </li>
            );
          })}
        </ul>
        {/* <h3>Add Store</h3> */}
        <label>
          Add new store:
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyPress}
            ref={inputRef}
          />
        </label>
        <div className={styles["btn-div"]}>
          <button className="add-btn" onClick={handleAddBtn}>
            <Add className="icon" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditStoresPopup;
