
import ResponsiveLayout from '@/components/layout/ResponsiveLayout';
import Home from '@/pages/Home';

const Index = () => {
  return (
    <ResponsiveLayout showFooter={true}>
      <Home />
    </ResponsiveLayout>
  );
};

export default Index;
