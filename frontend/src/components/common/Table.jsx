/**
 * Table Component
 * 
 * Reusable table component for displaying tabular data.
 */

import React from 'react';
import { Table as AntTable } from 'antd';

const Table = ({ columns, dataSource, loading, ...props }) => {
  return (
    <AntTable
      columns={columns}
      dataSource={dataSource}
      loading={loading}
      {...props}
    />
  );
};

export default Table;
