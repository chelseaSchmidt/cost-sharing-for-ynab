import Header, { HeaderProps } from '../../../shared/Header';
import { ModalName } from '../types';

type Props = {
  handleInfoClick: () => void;
  setActiveModal: (modalName: ModalName) => void;
} & Omit<HeaderProps, 'menuItems'>;

export default function AppHeader({ handleInfoClick, setActiveModal, ...props }: Props) {
  return (
    <Header
      {...props}
      menuItems={[
        { type: 'link', key: 'home', props: { children: 'Home', href: '/' } },
        {
          type: 'button',
          key: 'guide',
          props: { children: 'Guide', onClick: handleInfoClick },
        },
        {
          type: 'button',
          key: 'privacy',
          props: {
            children: 'Privacy Policy',
            onClick: () => setActiveModal(ModalName.PRIVACY_POLICY),
          },
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
