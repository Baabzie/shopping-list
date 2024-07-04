import React from "react";
import { useState, useEffect, useRef } from "react";
import Add from "@mui/icons-material/Add";
import Close from "@mui/icons-material/Close";

type AddStorePopupProps = {
  onClose: () => void;
  addStore: (store: string) => void;
  stores: string[];
};

const AddStorePopup: React.FC<AddStorePopupProps> = ({
  onClose,
  addStore,
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
      onClose();
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleAddBtn();
    }
  };

  return (
    <div className="popup-container">
      <div className="popup" ref={popupRef}>
        <h3>Add Store</h3>
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyPress}
          ref={inputRef}
        />
        <div className="btn-div">
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

export default AddStorePopup;
