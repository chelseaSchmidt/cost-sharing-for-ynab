import { PRIVACY_CONTAINER_ID } from '../../../shared/constants';
import Header, { HeaderProps } from '../../../shared/Header';
import { APP_LINK } from '../constants';

type Props = { authLink: string } & Omit<HeaderProps, 'menuItems'>;

export default function HomeHeader({ authLink, ...props }: Props) {
  return (
    <Header
      {...props}
      menuItems={[
        {
          type: 'link',
          key: 'start',
          props: { children: 'Start', href: authLink, style: { fontWeight: 'bold' } },
        },
        {
          type: 'link',
          key: 'preview',
          props: { children: 'Preview Without a YNAB Account', href: APP_LINK },
        },
        {
          type: 'button',
          key: 'privacy',
          props: { children: 'Privacy Policy', onClick: scrollToPrivacy },
        },
        {
          type: 'link',
          key: 'github',
          props: {
            children: 'Source Code & Bug Reporting',
            href: 'https://github.com/chelseaSchmidt/cost-sharing-for-ynab',
          },
        },
      ]}
    />
  );
}

function scrollToPrivacy() {
  document.getElementById(PRIVACY_CONTAINER_ID)?.scrollIntoView(true);
}
