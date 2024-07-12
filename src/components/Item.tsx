import { itemI } from "@/interfaces/todoI";
import Check from "@mui/icons-material/Check";
import Close from "@mui/icons-material/Close";
import Restore from "@mui/icons-material/Restore";
import styles from "./Item.module.scss";
import { useState, useEffect } from "react";

type ItemProps = {
  item: itemI;
  index: number;
  itemBought: (index: number, price: number) => void;
  switchDone: (index: number) => void;
  removeListItem: (index: number) => void;
};

const Item: React.FC<ItemProps> = ({
  item,
  index,
  itemBought,
  switchDone,
  removeListItem,
}) => {
  const [price, setPrice] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(1);
  const [pricePerUnit, setPricePerUnit] = useState<number>(0);

  useEffect(() => {
    const newPrice = price / quantity;
    setPricePerUnit(newPrice);
  }, [price, quantity]);

  const handlePriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let value = parseFloat(event.target.value);
    setPrice(value);
  };

  const handleQuantityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(event.target.value);
    setQuantity(value);
  };

  return (
    <li className={styles["list-item"]}>
      <div className={styles["information-div"]}>
        <p>{item.text}</p>
        {!item.done && (
          <div className={styles["price-div"]}>
            <input
              onChange={handlePriceChange}
              className={styles["price-input"]}
              type="number"
              value={price}
            />
            <p>/</p>
            <input
              onChange={handleQuantityChange}
              className={styles["quantity-input"]}
              type="number"
              value={quantity}
            />
            <p>=</p>
            <p>{pricePerUnit}</p>
            <p>SEK</p>
          </div>
        )}
      </div>
      <div className={styles["btn-div"]}>
        {!item.done && (
          <button
            className="done-btn"
            onClick={() => itemBought(index, pricePerUnit)}
          >
            <Check className="icon" />
          </button>
        )}
        <button className="not-done-btn" onClick={() => switchDone(index)}>
          <Restore className="icon" />
        </button>
        <button className="remove-btn" onClick={() => removeListItem(index)}>
          <Close className="icon" />
        </button>
      </div>
    </li>
  );
};

export default Item;
