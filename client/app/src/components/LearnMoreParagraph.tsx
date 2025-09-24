import styled from 'styled-components';
import { Hyperlink } from '../../../shared/styledComponents';
import { Paragraph } from './styledComponents';

const StyledLink = styled(Hyperlink)`
  color: white;
  margin: 0;
`;

interface Props {
  prefix?: string;
  suffix?: string;
  handleInfoClick: () => void;
}

export default function LearnMoreParagraph({ prefix, suffix, handleInfoClick }: Props) {
  return (
    <Paragraph>
      {prefix ? `${prefix} ` : ''}
      <StyledLink as="button" type="button" onClick={handleInfoClick}>
        Learn more
      </StyledLink>
      {suffix ? ` ${suffix}` : ''}
    </Paragraph>
  );
}
