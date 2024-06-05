import React, { useEffect, useState } from 'react'
import { AiOutlineClose } from 'react-icons/ai'

import './Filter.css'

const Filter = ({ filter, setFilter, categories, setShowFilter }) => {
    const [currentFilter, setCurrentFilter] = useState({
        category:filter?.category,
        price:filter?.price
    })

    const handleSubmit = (e) => {
        e.preventDefault();
        setFilter(currentFilter)
        setShowFilter(false)
    }

    const handleClear = (e) => {
        e.preventDefault();
        const emptyFilter = {
            category:'',
            price:{
                high:'',
                low:'',
            }
        }
        setCurrentFilter(emptyFilter)
        setFilter(emptyFilter)
    }

  return (
    <div className="filter-container">
        <div className="filter-wrapper">
            <div className="filter-close" onClick={() => setShowFilter(false)}><AiOutlineClose/></div>
                <form className="filter-form" onSubmit={handleSubmit}>
                    <label className="filter-form-category">
                        Category
                        <select value={currentFilter?.category} onChange={(e) => setCurrentFilter(currentFilter => ({...currentFilter, category: e.target.value}))}>
                            <option value=''>-------------------</option>
                            {categories?.map(category => <option key={category._id} value={category._id}>{category?.name}</option>)}
                        </select>
                    </label>

                    <label className="filter-form-price-low">
                        Price From : 
                        <input value={currentFilter?.price?.low} id="filter-form-price" type="number" placeholder="Price From"
                            onChange={e => setCurrentFilter(currentFilter => ({...currentFilter, price:{...currentFilter?.price, low:e.target.value}}) )}
                        />
                    </label>
                    <label className="filter-form-price-high">
                        Price To : 
                        <input value={currentFilter?.price?.high} id="filter-form-price" type="number" placeholder="Price To"
                            onChange={e => setCurrentFilter(currentFilter => ({...currentFilter, price:{...currentFilter?.price, high:e.target.value}}) )}
                        />
                    </label>

                    <input type="submit" className="filter-form-submit" value="Save"/>
                    <input type="reset" className="filter-form-reset"  value="Clear" onClick={handleClear}/>
                </form>
        </div>
    </div>
  )
}

export default Filter