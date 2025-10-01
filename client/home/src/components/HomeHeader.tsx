import Header from '../../../shared/Header';

interface Props {
  authLink: string;
  appLink: string;
}

export default function HomeHeader({ authLink, appLink }: Props) {
  return (
    <Header
      navMenuItems={[
        { text: 'Start', attributes: { href: authLink }, style: { fontWeight: 'bold' } },
        { text: 'Preview Without a YNAB Account', attributes: { href: appLink } },
        {
          text: 'Privacy Policy',
          onClick: () => {
            document.getElementById('privacy-policy-container')?.scrollIntoView(true);
          },
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
      style={{ marginBottom: '15px' }}
    />
  );
}
