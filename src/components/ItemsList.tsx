import React from "react";
import { useState, useEffect } from "react";
import Item from "./Item";
import AddItemPopup from "./AddItemPopup";
import EditStoresPopup from "./EditStoresPopup";
import Add from "@mui/icons-material/Add";
import Settings from "@mui/icons-material/Settings";
import styles from "./ItemsList.module.scss";

import { itemI } from "@/interfaces/todoI";

const ItemsList = () => {
  const [items, setItems] = useState<itemI[]>([]);
  const [stores, setStores] = useState<string[]>([]);
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [showStorePopup, setShowStorePopup] = useState<boolean>(false);
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

  const toggleStorePopup = () => {
    setShowStorePopup(!showStorePopup);
  };

  const addItem = (newItem: itemI) => {
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

  const addStore = (store: string) => {
    // newItem.date = new Date().toISOString();
    const newStores = [...stores];
    newStores.push(store);
    setStores(newStores);
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
      {showPopup && <AddItemPopup onClose={togglePopup} addItem={addItem} />}
      {showStorePopup && (
        <EditStoresPopup
          onClose={toggleStorePopup}
          addStore={addStore}
          stores={stores}
        />
      )}
      <div className={styles["list-container"]}>
        <div className={styles["select-container"]}>
          <div>
            <select
              className={styles["sorting-select"]}
              value={sortOption}
              onChange={handleSortChange}
            >
              <option value="date">Last changed</option>
              <option value="alphabetical">Alphabetical</option>
            </select>
          </div>
          <div>
            <select
              className={styles["store-select"]}
              // value={sortOption}
              // onChange={handleSortChange}
            >
              <option value="">Select store</option>
              {stores.map((store) => {
                return <option>{store}</option>;
              })}
            </select>
            <button
              className={styles["add-store-btn"]}
              onClick={toggleStorePopup}
            >
              <Settings className="icon" />
            </button>
          </div>
        </div>
        <div className={styles["list-header-container"]}>
          <h2>To shop:</h2>
          <button className={styles["add-new-btn"]} onClick={togglePopup}>
            <Add className="icon" />
          </button>
        </div>
        <ul>
          {items.map((item, index) =>
            !item.done ? (
              <Item
                item={item}
                key={index}
                index={index}
                switchDone={switchDone}
                removeListItem={removeListItem}
              />
            ) : null
          )}
        </ul>
        <div className={styles["list-header-container"]}>
          <h2>Completed:</h2>
        </div>
        <ul>
          {items.map((item, index) =>
            item.done ? (
              <Item
                item={item}
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
