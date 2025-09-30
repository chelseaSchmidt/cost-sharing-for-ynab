import { HTMLAttributes } from 'react';
import styled from 'styled-components';
import colors from '../../../../shared/colors';
import { FlexColumnAllCentered } from '../styledComponents';

const PADDING = '1px';
const BORDER_WIDTH = '1px';
const size = `calc(1em + ${PADDING} + ${BORDER_WIDTH})`;

const Container = styled(FlexColumnAllCentered)`
  box-sizing: border-box;
  position: relative;
  border-radius: 50%;
  margin: 0 5px;
  height: ${size};
  width: ${size};
  min-width: ${size};
  padding: ${PADDING};
  border: ${BORDER_WIDTH} solid ${colors.error};
  color: ${colors.error};
  font-weight: bold;

  &:hover {
    > * {
      visibility: visible;
    }
  }
`;

export default function WarningIcon({ children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <Container {...props}>!{children}</Container>;
}
