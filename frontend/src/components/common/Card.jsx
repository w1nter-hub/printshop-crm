/**
 * Card Component
 * 
 * Reusable card component for displaying content in a container.
 */

import React from 'react';
import { Card as AntCard } from 'antd';

const Card = ({ title, children, extra, ...props }) => {
  return (
    <AntCard title={title} extra={extra} {...props}>
      {children}
    </AntCard>
  );
};

export default Card;
