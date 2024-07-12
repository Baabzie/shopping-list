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
  stores: string[];
  activeStore: string;
};

const Item: React.FC<ItemProps> = ({
  item,
  index,
  itemBought,
  switchDone,
  removeListItem,
  stores,
  activeStore,
}) => {
  const [price, setPrice] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(1);
  const [pricePerUnit, setPricePerUnit] = useState<number>(0);
  const [storePrice, setStorePrice] = useState<number>(0);
  const [cheapestPrice, setCheapestPrice] = useState<number>(0);
  const [cheapestStore, setCheapestStore] = useState<string>("");

  useEffect(() => {
    const newPrice = price / quantity;
    setPricePerUnit(newPrice);
  }, [price, quantity]);

  useEffect(() => {
    item.history?.sort(
      (a, b) =>
        new Date(b.data.date).getTime() - new Date(a.data.date).getTime()
    );
    if (item.history) {
      item.history.some((dataPoint) => {
        if (dataPoint.store === activeStore) {
          setStorePrice(dataPoint.data.price);
          return true; // Exit the loop early
        }
        setStorePrice(0);
        return false;
      });
    }
  }, [activeStore]);

  useEffect(() => {
    if (item.history && item.history.length > 0) {
      const sortedHistory = [...item.history].sort(
        (a, b) => a.data.price - b.data.price
      );
      setCheapestPrice(sortedHistory[0].data.price);
      setCheapestStore(sortedHistory[0].store);
    } else {
      setCheapestPrice(0);
      setCheapestStore("");
    }
  }, [activeStore, item.history]); // Ensure item.history is included as a dependency

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
        {activeStore !== "" &&
          (storePrice > 0 ? (
            <p>
              Latest known price at {activeStore}: {storePrice} SEK
            </p>
          ) : (
            <p>No known price at {activeStore}</p>
          ))}
        {cheapestStore !== "" && cheapestPrice !== 0 ? (
          <p>
            Cheapest at {cheapestStore} at {cheapestPrice} SEK
          </p>
        ) : (
          <p>Dont know where is cheap</p>
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
