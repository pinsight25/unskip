
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Accessory } from '@/types/accessory';

interface RelatedAccessoriesProps {
  accessories: Accessory[];
  formatPrice: (priceMin: number, priceMax?: number | null) => string;
}

const RelatedAccessories = ({ accessories, formatPrice }: RelatedAccessoriesProps) => {
  if (accessories.length === 0) return null;

  return (
    <div>
      <h3 className="font-semibold text-xl mb-6">Similar Products</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {accessories.map((related) => (
          <Link key={related.id} to={`/accessories/${related.id}`}>
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-3">
                <img
                  src="https://via.placeholder.com/200x200?text=Accessory"
                  alt={related.name}
                  className="w-full aspect-square object-cover rounded-lg mb-2"
                />
                <h4 className="font-medium text-sm line-clamp-2 mb-1">
                  {related.name}
                </h4>
                <p className="text-primary font-semibold text-sm">
                  {formatPrice(related.price_min, related.price_max)}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default RelatedAccessories;
