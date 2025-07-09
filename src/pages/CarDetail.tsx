
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { mockCars } from '@/data/mockData';
import { Car } from '@/types/car';
import CarDetailContainer from '@/components/car/CarDetailContainer';

const CarDetail = () => {
  const { id } = useParams<{ id: string }>();
  const car: Car | undefined = mockCars.find((car) => car.id === id);

  if (!car) {
    return (
      <div className="min-h-screen bg-gray-50 responsive-header-spacing">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Car Not Found</h2>
            <p className="text-gray-600 mb-4">Sorry, the car you are looking for could not be found.</p>
            <Link 
              to="/" 
              className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors"
            >
              Go back to homepage
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 responsive-header-spacing">
      <div className="w-full">
        <CarDetailContainer car={car} />
      </div>
    </div>
  );
};

export default CarDetail;
