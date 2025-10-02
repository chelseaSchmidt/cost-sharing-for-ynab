import { PRIVACY_CONTAINER_ID } from '../../../shared/constants';
import Header from '../../../shared/Header';
import { APP_LINK } from '../constants';

interface Props {
  authLink: string;
}

export default function HomeHeader({ authLink }: Props) {
  return (
    <Header
      style={{ marginBottom: '15px' }}
      menuItems={[
        {
          text: 'Start',
          attributes: { href: authLink, target: '_blank', rel: 'noreferrer' },
          style: { fontWeight: 'bold' },
        },
        {
          text: 'Preview Without a YNAB Account',
          attributes: { href: APP_LINK, target: '_blank', rel: 'noreferrer' },
        },
        {
          text: 'Privacy Policy',
          onClick: scrollToPrivacy,
          attributes: { type: 'button', as: 'button' },
        },
        {
          text: 'Source Code & Bug Reporting',
          attributes: {
            href: 'https://github.com/chelseaSchmidt/cost-sharing-for-ynab',
            target: '_blank',
            rel: 'noreferrer',
          },
        },
      ]}
    />
  );
}

function scrollToPrivacy() {
  document.getElementById(PRIVACY_CONTAINER_ID)?.scrollIntoView(true);
}
