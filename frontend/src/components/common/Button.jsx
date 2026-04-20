/**
 * Button Component
 * 
 * Reusable button component with customizable styles and actions.
 */

import React from 'react';
import { Button as AntButton } from 'antd';

const Button = ({ children, type = 'default', onClick, ...props }) => {
  return (
    <AntButton type={type} onClick={onClick} {...props}>
      {children}
    </AntButton>
  );
};

export default Button;
