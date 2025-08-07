import styled from 'styled-components';
import { DELETE_ICON_LINE_CLASS } from './styledComponents';

const Container = styled.div<{ $size: number }>`
  position: relative;
  display: flex;

  ${({ $size }) => `
    width: ${$size}px;
    height: ${$size}px;
    min-width: ${$size}px;
    min-height: ${$size}px;
  `}
`;

const LeftToRightDiagonal = styled.div<{ $length: number }>`
  position: absolute;
  top: 0;
  left: 0;
  transform: rotate(45deg);
  transform-origin: top left;
  height: 1px;
  width: ${({ $length }) => $length}px;
  background: black;
  border-radius: 1px;
`;

const RightToLeftDiagonal = styled.div<{ $length: number }>`
  position: absolute;
  top: 0;
  right: 0;
  transform: rotate(-45deg);
  transform-origin: top right;
  height: 1px;
  width: ${({ $length }) => $length}px;
  background: black;
  border-radius: 1px;
`;

interface Props {
  size?: number;
}

export default function DeleteIcon({ size = 12 }: Props) {
  const hypotenuse = Math.sqrt(size ** 2 + size ** 2);

  return (
    <Container $size={size}>
      <LeftToRightDiagonal $length={hypotenuse} className={DELETE_ICON_LINE_CLASS} />
      <RightToLeftDiagonal $length={hypotenuse} className={DELETE_ICON_LINE_CLASS} />
    </Container>
  );
}
