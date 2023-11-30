import { useAppState } from 'src/controllers/state/use-app-state';

interface SolanaAproximatedPriceProps {
  price: number;
}

const SolanaAproximatedPrice: React.FC<SolanaAproximatedPriceProps> = ({ price }) => {
  const { currencySliceGetCurrencyString } = useAppState();

  return <span className="text-skin-muted"> (~{currencySliceGetCurrencyString(price)} at current price.) </span>;
};

export default SolanaAproximatedPrice;
