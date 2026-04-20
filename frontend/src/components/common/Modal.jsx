/**
 * Modal Component
 * 
 * Reusable modal dialog component.
 */

import React from 'react';
import { Modal as AntModal } from 'antd';

const Modal = ({ title, visible, onOk, onCancel, children, ...props }) => {
  return (
    <AntModal
      title={title}
      open={visible}
      onOk={onOk}
      onCancel={onCancel}
      {...props}
    >
      {children}
    </AntModal>
  );
};

export default Modal;
