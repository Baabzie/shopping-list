import { itemI } from "@/interfaces/todoI";
import Check from "@mui/icons-material/Check";
import Close from "@mui/icons-material/Close";
import Restore from "@mui/icons-material/Restore";
import styles from "./Item.module.scss";

type ItemProps = {
  item: itemI;
  index: number;
  switchDone: (index: number) => void;
  removeListItem: (index: number) => void;
};

const Item: React.FC<ItemProps> = ({
  item,
  index,
  switchDone,
  removeListItem,
}) => {
  return (
    <li className={styles["list-item"]}>
      <div className={styles["information-div"]}>
        <p>{item.text}</p>
        <div className={styles["price-div"]}>
          <input type="number" />
          <p>SEK</p>
        </div>
      </div>
      <div className={styles["btn-div"]}>
        {!item.done ? (
          <button className="done-btn" onClick={() => switchDone(index)}>
            <Check className="icon" />
          </button>
        ) : (
          <button className="not-done-btn" onClick={() => switchDone(index)}>
            <Restore className="icon" />
          </button>
        )}
        <button className="remove-btn" onClick={() => removeListItem(index)}>
          <Close className="icon" />
        </button>
      </div>
    </li>
  );
};

export default Item;