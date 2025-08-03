import { CSSProperties, ReactNode } from 'react';
import ReactDOM from 'react-dom';

interface Props {
  children: ReactNode;
  parent?: Element | DocumentFragment;
  containerStyle?: CSSProperties;
}

const ElevatedTooltip = ({ parent, children, containerStyle = {} }: Props) =>
  ReactDOM.createPortal(<div style={containerStyle}>{children}</div>, parent || document.body);

export default ElevatedTooltip;
