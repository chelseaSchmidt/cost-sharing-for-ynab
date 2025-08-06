import styled from 'styled-components';
import colors from '../colors';

const Container = styled.div`
  position: relative;
  display: flex;
  width: 18px;
  height: 18px;
  min-width: 18px;
  min-height: 18px;
  margin: 5px;
`;

const HorizontalLine = styled.div`
  position: absolute;
  top: calc(50% - 2px);
  height: 4px;
  width: 100%;
  background: ${colors.primary};
  border-radius: 3px;
`;

const VerticalLine = styled.div`
  position: absolute;
  left: calc(50% - 2px);
  width: 4px;
  height: 100%;
  background: ${colors.primary};
  border-radius: 3px;
`;

interface Props {
  expanded: boolean;
}

export default function ExpandIcon({ expanded }: Props) {
  return (
    <Container>
      {expanded ? (
        <HorizontalLine />
      ) : (
        <>
          <HorizontalLine />
          <VerticalLine />
        </>
      )}
    </Container>
  );
}
