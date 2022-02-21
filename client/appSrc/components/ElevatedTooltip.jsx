/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

const ElevatedTooltip = ({
  parent,
  children,
  containerStyle = {},
}) => (
  ReactDOM.createPortal(
    <div style={containerStyle}>{children}</div>,
    parent || document.body,
  )
);

ElevatedTooltip.propTypes = {
  parent: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.instanceOf(Element),
  ]),
  children: PropTypes.node,
  containerProps: PropTypes.object,
};

export default ElevatedTooltip;
