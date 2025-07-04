
interface MobileCarPriceProps {
  price: number;
  rentalRate?: number;
}

const MobileCarPrice = ({ price, rentalRate }: MobileCarPriceProps) => {
  const formatPrice = (price: number) => {
    return `₹${price.toLocaleString()}`;
  };

  const formatRental = (rate: number) => {
    return `₹${rate.toLocaleString()}/day`;
  };

  return (
    <div className="flex items-center gap-2 mt-1">
      <span className="text-2xl font-bold text-primary">
        {formatPrice(price)}
      </span>
      {rentalRate && (
        <span className="text-sm text-gray-500 ml-2">
          or {formatRental(rentalRate)}
        </span>
      )}
    </div>
  );
};

export default MobileCarPrice;
