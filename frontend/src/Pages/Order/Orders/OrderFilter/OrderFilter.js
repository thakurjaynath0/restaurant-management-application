import React, { useEffect, useState } from "react";
import { FaSlidersH } from "react-icons/fa";
import { AiOutlineClose } from "react-icons/ai";

import "./orderfilter.css";

const OrderFilter = ({ setQueryString }) => {
  const [filterActive, setFilterActive] = useState(false);
  const [filter, setFilter] = useState({
    settled: "",
    number: ["", ""],
    people: ["", ""],
    createdAt: ["", ""],
    updatedAt: ["", ""],
  });

  const generateQueryString = (filter) => {
    let otherFilter = "";
    let numericFilter = "";
    let dateFilter = "";
    filter?.status && (otherFilter += `status=${filter?.status}&`);

    filter?.number[0] && (numericFilter += `number>=${filter?.number[0]},`);
    filter?.number[1] && (numericFilter += `number<=${filter?.number[1]},`);

    filter?.people[0] && (numericFilter += `people>=${filter?.people[0]},`);
    filter?.people[1] && (numericFilter += `people<=${filter?.people[1]},`);

    filter?.createdAt[0] &&
      (dateFilter += `createdAt>=${filter?.createdAt[0]},`);
    filter?.createdAt[1] &&
      (dateFilter += `createdAt<=${filter?.createdAt[1]},`);

    filter?.updatedAt[0] &&
      (dateFilter += `updatedAt>=${filter?.updatedAt[0]},`);
    filter?.updatedAt[1] &&
      (dateFilter += `updatedAt<=${filter?.updatedAt[1]},`);

    return `${otherFilter}numericFilters=${numericFilter}&dateFilters=${dateFilter}`;
  };

  const handleSave = () => {
    setQueryString(generateQueryString(filter));
    setFilterActive(false);
  };

  const handleClear = () => {
    const emptyFilter = {
      status: "",
      number: ["", ""],
      people: ["", ""],
      createdAt: ["", ""],
      updatedAt: ["", ""],
    };
    setFilter(emptyFilter);
    setQueryString(generateQueryString(emptyFilter));
    setFilterActive(false);
  };

  // useEffect(()=> {
  //     setQueryString(generateQueryString(filter))
  // }, [filter, setQueryString])

  return (
    <div className="order-filter">
      <div className="order-filter-origin">
        <div
          className="order-filter-origin-content"
          onClick={() => setFilterActive(true)}
        >
          <span>Filter</span>
          <FaSlidersH />
        </div>
      </div>
      {filterActive && (
        <>
          {/* <div className="order-filter-pseudo-wrapper"></div> */}
          <div className="order-filter-wrapper">
            <div className="order-filter-filter">
              <div
                className="order-filter-close"
                onClick={() => setFilterActive(false)}
              >
                <AiOutlineClose />
              </div>
              <div className="filters order-filter-status">
                <label>
                  Status
                  <select
                    value={filter?.status ? filter.status : ""}
                    onChange={(e) =>
                      setFilter((filter) => ({
                        ...filter,
                        status: e.target.value,
                      }))
                    }
                  >
                    <option value="">------</option>
                    <option value="pending">pending</option>
                    <option value="cooking">Cooking</option>
                    <option value="completed">Completed</option>
                    <option value="canceled">Canceled</option>
                  </select>
                  {/* <input type="checkbox" value={filter?.settled === true} onChange={(e) => setFilter({...filter, settled:e.target.value})}/> */}
                </label>
              </div>
              {/* <div className="filters order-filter-payment">
                        <label>
                            Payment
                            <select value={filter?.payment ? filter.payment : ""} onChange={(e) => setFilter(filter => ({...filter, payment: e.target.value }) )}>
                                <option value="">---------</option>
                                <option value="cash">Cash</option>
                                <option value="card">Card</option>
                                <option value="online">Online</option>
                            </select>
                        </label>
                    </div> */}
              <div className="filters order-filter-order">
                <label>
                  Order Number
                  <div className="inputs">
                    <label>
                      {" "}
                      From:{" "}
                      <input
                        type="number"
                        value={filter?.number[0]}
                        onChange={(e) =>
                          setFilter((filter) => ({
                            ...filter,
                            number: [e.target.value, filter?.number[1]],
                          }))
                        }
                      />{" "}
                    </label>
                    <label>
                      {" "}
                      To:{" "}
                      <input
                        type="number"
                        value={filter?.number[1]}
                        onChange={(e) =>
                          setFilter((filter) => ({
                            ...filter,
                            number: [filter?.number[0], e.target.value],
                          }))
                        }
                      />{" "}
                    </label>
                  </div>
                </label>
              </div>
              <div className="filters order-filter-people">
                <label>
                  Number of people
                  <div className="inputs">
                    <label>
                      {" "}
                      From:{" "}
                      <input
                        type="number"
                        value={filter?.people[0]}
                        onChange={(e) =>
                          setFilter((filter) => ({
                            ...filter,
                            people: [e.target.value, filter?.people[1]],
                          }))
                        }
                      />{" "}
                    </label>
                    <label>
                      {" "}
                      To:{" "}
                      <input
                        type="number"
                        value={filter?.people[1]}
                        onChange={(e) =>
                          setFilter((filter) => ({
                            ...filter,
                            people: [filter?.people[0], e.target.value],
                          }))
                        }
                      />{" "}
                    </label>
                  </div>
                </label>
              </div>

              <div className="filters order-filter-createdAt">
                <label>
                  createdAt
                  <div className="inputs">
                    <label>
                      {" "}
                      From:{" "}
                      <input
                        type="date"
                        value={filter?.createdAt[0]}
                        onChange={(e) =>
                          setFilter((filter) => ({
                            ...filter,
                            createdAt: [e.target.value, filter?.createdAt[1]],
                          }))
                        }
                      />{" "}
                    </label>
                    <label>
                      {" "}
                      To:{" "}
                      <input
                        type="date"
                        value={filter?.createdAt[1]}
                        onChange={(e) =>
                          setFilter((filter) => ({
                            ...filter,
                            createdAt: [filter?.createdAt[0], e.target.value],
                          }))
                        }
                      />{" "}
                    </label>
                  </div>
                </label>
              </div>
              <div className="filters order-filter-updatedAt">
                <label>
                  updatedAt
                  <div className="inputs">
                    <label>
                      {" "}
                      From:{" "}
                      <input
                        type="date"
                        value={filter?.updatedAt[0]}
                        onChange={(e) =>
                          setFilter((filter) => ({
                            ...filter,
                            updatedAt: [e.target.value, filter?.updatedAt[1]],
                          }))
                        }
                      />{" "}
                    </label>
                    <label>
                      {" "}
                      To:{" "}
                      <input
                        type="date"
                        value={filter?.updatedAt[1]}
                        onChange={(e) =>
                          setFilter((filter) => ({
                            ...filter,
                            updatedAt: [filter?.updatedAt[0], e.target.value],
                          }))
                        }
                      />{" "}
                    </label>
                  </div>
                </label>
              </div>
              <div className="order-filter-actions">
                <button
                  className="order-filter-actions-clear"
                  onClick={handleClear}
                >
                  Clear
                </button>
                <button
                  className="order-filter-actions-save"
                  onClick={handleSave}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default OrderFilter;
