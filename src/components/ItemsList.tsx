import React from "react";
import { useState, useEffect } from "react";
import Item from "./Item";
import AddItemPopup from "./AddItemPopup";
import Add from "@mui/icons-material/Add";

import { itemI } from "@/interfaces/todoI";

const ItemsList = () => {
  const [items, setItems] = useState<itemI[]>([]);
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [firstRender, setFirstRender] = useState<boolean>(true); // To prevent the first render of the site to overwrite the local storage with an empty array.
  const [sortOption, setSortOption] = useState<string>("date");

  useEffect(() => {
    let storedItems = localStorage.getItem("items");
    if (storedItems) {
      let itemsArray: itemI[] = JSON.parse(storedItems);
      setItems(itemsArray);
    }
  }, []);

  useEffect(() => {
    // If "firstRender" is true we wont change local storage...
    if (!firstRender) {
      let itemsArray = [...items];
      localStorage.setItem("items", JSON.stringify(itemsArray));
      return;
    }
    // ...and then we set "firstRender" to false so we after the initial render actually change the local storage.
    setFirstRender(false);
  }, [items, firstRender]);

  const togglePopup = () => {
    setShowPopup(!showPopup);
  };

  const addTodo = (newItem: itemI) => {
    newItem.date = new Date().toISOString();
    const newItems = [...items];
    newItems.push(newItem);
    setItems(sortingFunction(sortOption, newItems));
  };

  const switchDone = (index: number) => {
    let newItems = [...items];
    newItems[index].date = new Date().toISOString();
    newItems[index].done = !newItems[index].done;
    setItems(sortingFunction(sortOption, newItems));
  };

  const removeListItem = (index: number) => {
    let newItems = [...items];
    newItems.splice(index, 1);
    setItems(newItems);
  };

  const sortingFunction = (option: string, itemsArray: itemI[]) => {
    const sortedItems = [...itemsArray].sort((a, b) => {
      if (option === "date") {
        if (!a.date) return 1;
        if (!b.date) return -1;
        return b.date.localeCompare(a.date); // Change this line for descending order
      } else if (option === "alphabetical") {
        return a.text.localeCompare(b.text);
      }
      return 0;
    });
    return sortedItems;
  };

  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOption = event.target.value;
    setSortOption(selectedOption);

    setItems(sortingFunction(selectedOption, items));
  };

  return (
    <>
      {showPopup && <AddItemPopup onClose={togglePopup} addTodo={addTodo} />}
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
          {items.map((item, index) =>
            !item.done ? (
              <Item
                todo={item}
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
          {items.map((item, index) =>
            item.done ? (
              <Item
                todo={item}
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

export default ItemsList;
