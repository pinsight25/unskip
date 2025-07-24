
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import { supabase } from '@/lib/supabase';

const DealerHeader = () => {
  const { user, refreshUser } = useUser();
  const navigate = useNavigate();

  const handleBecomeDealer = async () => {
    console.log('[BecomeDealer] Button clicked');
    console.log('[BecomeDealer] User:', user);
    if (!user) {
      console.log('[BecomeDealer] No user, navigating to /signin');
      navigate('/signin');
      return;
    }
    const { error } = await supabase.from('users').update({ user_type: 'dealer' }).eq('id', user.id);
    if (error) {
      console.error('[BecomeDealer] Supabase update error:', error);
    } else {
      console.log('[BecomeDealer] Updated user_type to dealer');
    }
    await refreshUser();
    console.log('[BecomeDealer] Refreshed user context');
    navigate('/dealer/register');
    console.log('[BecomeDealer] Navigated to /dealer/register');
  };

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
      <div className="max-width-container-wide py-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold mb-1">Authorized Dealers</h2>
            <p className="text-gray-600">Browse all car dealers</p>
          </div>
          {user?.userType === 'regular' && (
            <Button onClick={handleBecomeDealer} className="mt-3 md:mt-0 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold px-4 py-2 shadow-md">
              <Plus className="h-4 w-4 mr-2" />
              Become a Dealer
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DealerHeader;
