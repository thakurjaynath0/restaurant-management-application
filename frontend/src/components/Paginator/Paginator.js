import { Pagination } from '@mui/material';
import React from 'react';

import './Paginator.css'

const Paginator = ({ totalPage, page, handlePageChange, limit, handleLimitChange ,...others}) => {
    return (
            <div className="pagination-wrapper">
                <Pagination 
                    className="pagination" 
                    size="large" 
                    count={totalPage} 
                    page={page} 
                    onChange={handlePageChange}
                    shape="rounded"
                    color="primary"
                    variant="outlined"
                    {...others}
                />
            </div>
    )
}

export default Paginator