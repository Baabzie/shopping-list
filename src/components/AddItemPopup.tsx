import React from "react";
import { useState, useEffect, useRef } from "react";
import Add from "@mui/icons-material/Add";
import Close from "@mui/icons-material/Close";
import styles from "./AddItemPopup.module.scss";

import { itemI } from "@/interfaces/todoI";

type AddItemPopupProps = {
  onClose: () => void;
  addItem: (todo: itemI) => void;
};

const AddItemPopup: React.FC<AddItemPopupProps> = ({ onClose, addItem }) => {
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
      addItem({ text: inputValue, done: false });
      onClose();
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleAddBtn();
    }
  };

  return (
    <div className={styles["popup-container"]}>
      <div className={styles["popup"]} ref={popupRef}>
        <h3>Add New Item</h3>
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyPress}
          ref={inputRef}
        />
        <div className={styles["btn-div"]}>
          <button className="add-btn" onClick={handleAddBtn}>
            <Add className="icon" />
          </button>
          <button className="close-btn" onClick={onClose}>
            <Close className="icon" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddItemPopup;
