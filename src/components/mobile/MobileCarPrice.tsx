
interface MobileCarPriceProps {
  price: number;
  rentalRate?: number;
  isRentAvailable?: boolean;
}

const MobileCarPrice = ({ price, rentalRate, isRentAvailable }: MobileCarPriceProps) => {
  const formatPrice = (price: number) => {
    return `₹${price.toLocaleString('en-IN')}`;
  };

  const formatRental = (rate: number) => {
    return `₹${rate.toLocaleString('en-IN')}/day`;
  };

  return (
    <div>
      <span className="text-2xl font-bold text-primary">
        {formatPrice(price)}
      </span>
      {isRentAvailable && rentalRate && (
        <div className="mt-1">
          <span className="text-sm font-semibold text-teal-600">
            {formatRental(rentalRate)}
          </span>
        </div>
      )}
    </div>
  );
};

export default MobileCarPrice;
