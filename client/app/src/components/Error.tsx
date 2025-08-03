import Popup from './Popup';

const DEFAULT_MESSAGE =
  'An error occurred. Please start a new session and try again. If that does not resolve the issue, please send an email with the details to cost.sharing.for.ynab@gmail.com. Thank you for your patience!';

const ERROR_MESSAGES: Record<number, string> = {
  401: "Warning: Unable to authenticate. This is normal if you're previewing the app without a YNAB account. Otherwise, your session may have expired.",
};

interface Props {
  errorData: { status: number; message: string };
  setErrorData: (data: Props['errorData'] | null) => void;
}

const Error = ({ errorData, setErrorData }: Props) => {
  return (
    <Popup
      onClose={() => setErrorData(null)}
      message={ERROR_MESSAGES[errorData.status] || DEFAULT_MESSAGE}
      containerStyle={{ backgroundColor: '#2a558a' }}
      closeButtonStyle={{ color: '#2a558a' }}
    />
  );
};

export default Error;
