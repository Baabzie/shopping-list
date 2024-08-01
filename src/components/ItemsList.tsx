import React from "react";
import { useState, useEffect } from "react";
import Item from "./Item";
import AddItemPopup from "./AddItemPopup";
import EditStoresPopup from "./EditStoresPopup";
import SearchBar from "./SearchBar";
import Add from "@mui/icons-material/Add";
import Settings from "@mui/icons-material/Settings";
import styles from "./ItemsList.module.scss";

import { itemI } from "@/interfaces/todoI";

const ItemsList = () => {
  const [items, setItems] = useState<itemI[]>([]);
  const [filterString, setFilterString] = useState<string>("");
  const [filteredItems, setFilteredItems] = useState<itemI[]>([]);
  const [stores, setStores] = useState<string[]>([]);
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [showStorePopup, setShowStorePopup] = useState<boolean>(false);
  const [firstRender, setFirstRender] = useState<boolean>(true); // To prevent the first render of the site to overwrite the local storage with an empty array.
  const [sortOption, setSortOption] = useState<string>("date");
  const [activeStore, setActiveStore] = useState<string>("");
  const [activePassiveItemsAccordion, setActivePassiveItemsAccordion] =
    useState<boolean>(false);

  useEffect(() => {
    let storedItems = localStorage.getItem("items");
    if (storedItems) {
      let itemsArray: itemI[] = JSON.parse(storedItems);
      setItems(itemsArray);
    }
  }, []);

  useEffect(() => {
    let storedStores = localStorage.getItem("stores");
    if (storedStores) {
      let storesArray: string[] = JSON.parse(storedStores);
      setStores(storesArray);
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

  useEffect(() => {
    if (!firstRender) {
      let storesArray = [...stores];
      localStorage.setItem("stores", JSON.stringify(storesArray));
      return;
    }
    setFirstRender(false);
  }, [stores, firstRender]);

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

  const openAccordion = () => {
    setActivePassiveItemsAccordion((prevState) => !prevState);
  };

  const itemBought = (
    index: number,
    price: number,
    quantity: number,
    quantityPrice: number
  ) => {
    let newItems = [...items];
    newItems[index] = {
      ...newItems[index],
      date: new Date().toISOString(),
      done: true,
    };

    if (activeStore !== "") {
      if (
        price !== 0 &&
        quantity !== 0 &&
        !isNaN(quantityPrice) &&
        !isNaN(quantity)
      ) {
        const newHistory = {
          store: activeStore,
          data: {
            price: price,
            latestQuantity: quantity,
            latestQuantityPrice: quantityPrice,
            date: new Date().toISOString(),
          },
        };

        if (!newItems[index].history) {
          newItems[index].history = [];
        }

        newItems[index].history = newItems[index].history.filter(
          (history) => history.store !== activeStore
        );

        newItems[index].history.push(newHistory);
        newItems[index].history.sort(
          (a, b) =>
            new Date(b.data.date).getTime() - new Date(a.data.date).getTime()
        );
      } else {
        alert("Price and quantity cannot be zero.");
        return; // Stop execution
      }
    }

    setItems(sortingFunction(sortOption, newItems));
  };

  const removeListItem = (index: number) => {
    let newItems = [...items];
    newItems.splice(index, 1);
    setItems(newItems);
  };

  const addStore = (store: string) => {
    const newStores = [...stores];
    newStores.push(store);
    setStores(newStores);
  };

  const removeStore = (i: number) => {
    const storeToRemove = stores[i];
    const newStores = [...stores];
    newStores.splice(i, 1);

    // Remove the store from the stores array
    setStores(newStores);

    // Remove the store from the history of each item in the items array
    const newItems = items.map((item) => {
      if (item.history) {
        const updatedHistory = item.history.filter(
          (history) => history.store !== storeToRemove
        );
        return { ...item, history: updatedHistory };
      }
      return item;
    });

    // Update the items state with the newItems array
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

  const handleStoreChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOption = event.target.value;
    setActiveStore(selectedOption);
  };

  useEffect(() => {
    if (filterString !== "") {
      const lowerCaseFilter = filterString.toLowerCase();
      const filteredArray = items.filter((item) =>
        item.text.toLowerCase().includes(lowerCaseFilter)
      );
      setFilteredItems(filteredArray);
    } else {
      setFilteredItems(items);
    }
  }, [filterString, items]);

  return (
    <>
      {showPopup && <AddItemPopup onClose={togglePopup} addItem={addItem} />}
      {showStorePopup && (
        <EditStoresPopup
          onClose={toggleStorePopup}
          addStore={addStore}
          removeStore={removeStore}
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
              onChange={handleStoreChange}
              // value={sortOption}
              // onChange={handleSortChange}
            >
              <option value="">Select store</option>
              {stores.map((store, i) => {
                return (
                  <option key={i + store} value={store}>
                    {store}
                  </option>
                );
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
        <SearchBar setFilterString={setFilterString} />
        <div className={styles["list-header-container"]}>
          <h2>To shop:</h2>
          <button className={styles["add-new-btn"]} onClick={togglePopup}>
            <Add className="icon" />
          </button>
        </div>
        <ul>
          {filteredItems.map((item, index) =>
            !item.done ? (
              <Item
                item={item}
                key={index + item.text}
                index={index}
                itemBought={itemBought}
                switchDone={switchDone}
                removeListItem={removeListItem}
                stores={stores}
                activeStore={activeStore}
              />
            ) : null
          )}
        </ul>
        {filteredItems.some((item) => item.done) && (
          <div className={styles["accordion-div"]}>
            <div className={styles["list-header-container"]}>
              <button
                className={styles["accordion-btn"]}
                onClick={() => openAccordion()}
              >
                <h2>Saved items:</h2>
                {activePassiveItemsAccordion ? (
                  <p>Click to hide list</p>
                ) : (
                  <p>Click to see list</p>
                )}
              </button>
            </div>
            {activePassiveItemsAccordion && (
              <ul>
                {filteredItems.map((item, index) =>
                  item.done ? (
                    <Item
                      item={item}
                      key={index + item.text}
                      index={index}
                      itemBought={itemBought}
                      switchDone={switchDone}
                      removeListItem={removeListItem}
                      stores={stores}
                      activeStore={activeStore}
                    />
                  ) : null
                )}
              </ul>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default ItemsList;
