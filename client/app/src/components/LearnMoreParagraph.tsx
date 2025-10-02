import Link from '../../../shared/Link';
import { Paragraph } from '../../../shared/styledComponents';

interface Props {
  prefix?: string;
  suffix?: string;
  handleInfoClick: () => void;
}

export default function LearnMoreParagraph({ prefix, suffix, handleInfoClick }: Props) {
  return (
    <Paragraph>
      {prefix ? `${prefix} ` : ''}
      <Link asButton onClick={handleInfoClick} style={{ color: 'white', margin: 0 }}>
        Learn more
      </Link>
      {suffix ? ` ${suffix}` : ''}
    </Paragraph>
  );
}
