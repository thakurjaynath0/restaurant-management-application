import React from 'react'
import MenuSkeleton from '../MenuItem/MenuItemSkeleton'

import "./CategorySkeleton.css"

const CategorySkeleton = () => {
  return (
    <div className="category-skeleton">
        <div className="title"></div>
        <div className="items">
          <MenuSkeleton />
          <MenuSkeleton />
          <MenuSkeleton />
          <MenuSkeleton />
          <MenuSkeleton />
        </div>
    </div>
  )
}

export default CategorySkeleton