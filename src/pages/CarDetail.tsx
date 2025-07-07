
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { mockCars } from '@/data/mockData';
import { Car } from '@/types/car';
import ResponsiveLayout from '@/components/layout/ResponsiveLayout';
import CarDetailContainer from '@/components/car/CarDetailContainer';

const CarDetail = () => {
  const { id } = useParams<{ id: string }>();
  const car: Car | undefined = mockCars.find((car) => car.id === id);

  if (!car) {
    return (
      <ResponsiveLayout>
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Car Not Found</h2>
            <p className="text-gray-600">Sorry, the car you are looking for could not be found.</p>
            <Link to="/" className="text-blue-500">Go back to homepage</Link>
          </div>
        </div>
      </ResponsiveLayout>
    );
  }

  return (
    <ResponsiveLayout>
      <CarDetailContainer car={car} />
    </ResponsiveLayout>
  );
};

export default CarDetail;
