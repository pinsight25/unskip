
import ResponsiveLayout from '@/components/layout/ResponsiveLayout';
import Home from '@/pages/Home';

const Index = () => {
  return (
    <ResponsiveLayout>
      <div className="w-full">
        <Home />
      </div>
    </ResponsiveLayout>
  );
};

export default Index;
