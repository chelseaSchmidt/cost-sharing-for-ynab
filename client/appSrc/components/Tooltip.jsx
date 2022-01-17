/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

const Tooltip = ({
  parent,
  children,
  containerProps = {},
}) => {
  return parent
    ? ReactDOM.createPortal(
      <div {...containerProps}>{children}</div>,
      parent,
    )
    : null;
};

Tooltip.propTypes = {
  parent: PropTypes.node,
  children: PropTypes.node,
  containerProps: PropTypes.object,
};

export default Tooltip;
