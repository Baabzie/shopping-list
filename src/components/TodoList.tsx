import React from "react";
import { useState, useEffect } from "react";
import TodoItem from "./TodoItem";
import AddTodoPopup from "./AddTodoPopup";
import Add from "@mui/icons-material/Add";

import { todoI } from "@/interfaces/todoI";

const TodoList = () => {
  const [todos, setTodos] = useState<todoI[]>([]);
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [firstRender, setFirstRender] = useState<boolean>(true); // To prevent the first render of the site to overwrite the local storage with an empty array.
  const [sortOption, setSortOption] = useState<string>("date");

  useEffect(() => {
    let storedTodos = localStorage.getItem("todos");
    if (storedTodos) {
      let todosArray: todoI[] = JSON.parse(storedTodos);
      setTodos(todosArray);
    }
  }, []);

  useEffect(() => {
    // If "firstRender" is true we wont change local storage...
    if (!firstRender) {
      let todosArray = [...todos];
      localStorage.setItem("todos", JSON.stringify(todosArray));
      return;
    }
    // ...and then we set "firstRender" to false so we after the initial render actually change the local storage.
    setFirstRender(false);
  }, [todos, firstRender]);

  const togglePopup = () => {
    setShowPopup(!showPopup);
  };

  const addTodo = (newTodo: todoI) => {
    newTodo.date = new Date().toISOString();
    const newTodos = [...todos];
    newTodos.push(newTodo);
    setTodos(sortingFunction(sortOption, newTodos));
  };

  const switchDone = (index: number) => {
    let newTodos = [...todos];
    newTodos[index].date = new Date().toISOString();
    newTodos[index].done = !newTodos[index].done;
    setTodos(sortingFunction(sortOption, newTodos));
  };

  const removeListItem = (index: number) => {
    let newTodos = [...todos];
    newTodos.splice(index, 1);
    setTodos(newTodos);
  };

  const sortingFunction = (option: string, todosArray: todoI[]) => {
    const sortedTodos = [...todosArray].sort((a, b) => {
      if (option === "date") {
        if (!a.date) return 1;
        if (!b.date) return -1;
        return b.date.localeCompare(a.date); // Change this line for descending order
      } else if (option === "alphabetical") {
        return a.text.localeCompare(b.text);
      }
      return 0;
    });
    return sortedTodos;
  };

  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOption = event.target.value;
    setSortOption(selectedOption);

    setTodos(sortingFunction(selectedOption, todos));
  };

  return (
    <>
      {showPopup && <AddTodoPopup onClose={togglePopup} addTodo={addTodo} />}
      <div className="lists-container">
        <div className="list-header-container">
          <h2>Todos:</h2>
          <select
            className="sorting-select"
            value={sortOption}
            onChange={handleSortChange}
          >
            <option value="date">Last changed</option>
            <option value="alphabetical">Alphabetical</option>
          </select>
          <button className="add-new-btn" onClick={togglePopup}>
            <Add className="icon" />
          </button>
        </div>
        <ul className="todo-list">
          {todos.map((todo, index) =>
            !todo.done ? (
              <TodoItem
                todo={todo}
                key={index}
                index={index}
                switchDone={switchDone}
                removeListItem={removeListItem}
              />
            ) : null
          )}
        </ul>
        <div className="list-header-container">
          <h2>Completed:</h2>
        </div>
        <ul className="done-list">
          {todos.map((todo, index) =>
            todo.done ? (
              <TodoItem
                todo={todo}
                key={index}
                index={index}
                switchDone={switchDone}
                removeListItem={removeListItem}
              />
            ) : null
          )}
        </ul>
      </div>
    </>
  );
};

export default TodoList;
