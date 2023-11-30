import { useAppState } from 'src/controllers/state/use-app-state';
import { E2EID } from 'src/controllers/utils/e2e-ids';
import Button from './Button';

const LoginLogoutButton = () => {
  const { publicKey, disconnectWallet, openConnectionPopup } = useAppState();

  const onClick = () => {
    if (publicKey) {
      disconnectWallet();
    } else {
      openConnectionPopup();
    }
  };

  const label = publicKey ? 'Disconnect Wallet' : 'Connect Wallet';

  return (
    <Button
      buttonType="default"
      text={label}
      id={E2EID.loginLogoutButton}
      className="mx-auto w-full"
      onClick={onClick}
    />
  );
};

export default LoginLogoutButton;
