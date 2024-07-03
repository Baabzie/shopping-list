import { todoI } from "@/interfaces/todoI";
import Check from "@mui/icons-material/Check";
import Close from "@mui/icons-material/Close";
import Restore from "@mui/icons-material/Restore";

type TodoItemProps = {
  todo: todoI;
  index: number;
  switchDone: (index: number) => void;
  removeListItem: (index: number) => void;
};

const TodoItem: React.FC<TodoItemProps> = ({
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

export default TodoItem;
