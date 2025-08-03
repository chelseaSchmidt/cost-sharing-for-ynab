import Popup from './Popup';

interface Props {
  setIsConfirmationVisible: (isVisible: boolean) => void;
}

const Confirmation = ({ setIsConfirmationVisible }: Props) => (
  <Popup
    message="Transaction created"
    onClose={() => setIsConfirmationVisible(false)}
    containerStyle={{ backgroundColor: '#252525' }}
    closeButtonStyle={{ color: '#252525' }}
  />
);

export default Confirmation;
