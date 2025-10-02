import Header from '../../../shared/Header';
import { ModalName } from '../types';

interface Props {
  handleInfoClick: () => void;
  setActiveModal: (modalName: ModalName) => void;
}

export default function AppHeader({ handleInfoClick, setActiveModal }: Props) {
  return (
    <Header
      menuItems={[
        { text: 'Home', attributes: { href: '/' } },
        {
          text: 'Guide',
          onClick: handleInfoClick,
          attributes: { type: 'button', as: 'button' },
        },
        {
          text: 'Privacy Policy',
          onClick: () => setActiveModal(ModalName.PRIVACY_POLICY),
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
