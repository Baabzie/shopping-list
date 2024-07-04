import { itemI } from "@/interfaces/todoI";
import Check from "@mui/icons-material/Check";
import Close from "@mui/icons-material/Close";
import Restore from "@mui/icons-material/Restore";

type ItemProps = {
  todo: itemI;
  index: number;
  switchDone: (index: number) => void;
  removeListItem: (index: number) => void;
};

const Item: React.FC<ItemProps> = ({
  todo,
  index,
  switchDone,
  removeListItem,
}) => {
  return (
    <li className="list-item">
      <div className="btn-div">
        {!todo.done ? (
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
      <p>{todo.text}</p>
    </li>
  );
};

export default Item;
