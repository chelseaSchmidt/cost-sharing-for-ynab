import styled from 'styled-components';

const Container = styled.div<{ $size: number }>`
  box-sizing: border-box;
  position: relative;
  display: flex;

  ${({ $size }) => `
    width: ${$size}px;
    height: ${$size}px;
    min-width: ${$size}px;
    min-height: ${$size}px;
  `}
`;

const Diagonal = styled.div<{ $length: number; $color: string }>`
  box-sizing: border-box;
  position: absolute;
  top: 0;
  height: 1px;
  border-radius: 1px;
  background: ${({ $color }) => $color};
  width: ${({ $length }) => $length}px;
`;

const LeftToRightDiagonal = styled(Diagonal)`
  left: 0;
  transform: rotate(45deg);
  transform-origin: top left;
`;

const RightToLeftDiagonal = styled(Diagonal)`
  right: 0;
  transform: rotate(-45deg);
  transform-origin: top right;
`;

interface Props {
  size?: number;
  color?: string;
}

export default function DeleteIcon({ size = 12, color = 'black' }: Props) {
  const hypotenuse = Math.sqrt(size ** 2 + size ** 2);

  return (
    <Container $size={size}>
      <LeftToRightDiagonal $length={hypotenuse} $color={color} />
      <RightToLeftDiagonal $length={hypotenuse} $color={color} />
    </Container>
  );
}
