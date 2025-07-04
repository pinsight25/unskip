
import ResponsiveLayout from '@/components/layout/ResponsiveLayout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { User, Car, Heart, Settings, LogOut } from 'lucide-react';

const Profile = () => {
  return (
    <ResponsiveLayout>
      <div className="pt-16 md:pt-20">
        <div className="container mx-auto px-4 py-6">
          <div className="max-w-4xl mx-auto">
            {/* Profile Header */}
            <Card className="p-6 mb-6">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                <Avatar className="h-24 w-24">
                  <AvatarFallback className="text-2xl">JD</AvatarFallback>
                </Avatar>
                
                <div className="flex-1 text-center md:text-left">
                  <h1 className="text-2xl font-bold mb-2">John Doe</h1>
                  <p className="text-gray-600 mb-4">Member since March 2024</p>
                  <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                    <Button variant="outline" size="sm">
                      <Settings className="h-4 w-4 mr-2" />
                      Edit Profile
                    </Button>
                    <Button variant="outline" size="sm">
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </Button>
                  </div>
                </div>
              </div>
            </Card>

            {/* Profile Navigation - Mobile Tabs */}
            <div className="md:hidden mb-6">
              <div className="flex border-b">
                {['My Listings', 'My Offers', 'Saved Cars'].map((tab) => (
                  <button key={tab} className="flex-1 py-3 text-sm font-medium border-b-2 border-primary text-primary">
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {/* Desktop Sidebar */}
              <div className="hidden md:block">
                <Card className="p-4">
                  <nav className="space-y-2">
                    {[
                      { icon: Car, label: 'My Listings', count: 3 },
                      { icon: User, label: 'My Offers', count: 5 },
                      { icon: Heart, label: 'Saved Cars', count: 12 },
                      { icon: Settings, label: 'Settings' }
                    ].map((item) => (
                      <button key={item.label} className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 text-left">
                        <div className="flex items-center">
                          <item.icon className="h-5 w-5 mr-3 text-gray-600" />
                          <span>{item.label}</span>
                        </div>
                        {item.count && (
                          <span className="bg-primary text-white text-xs px-2 py-1 rounded-full">
                            {item.count}
                          </span>
                        )}
                      </button>
                    ))}
                  </nav>
                </Card>
              </div>

              {/* Main Content */}
              <div className="md:col-span-3">
                <Card className="p-6">
                  <h2 className="text-xl font-semibold mb-4">My Listings (3)</h2>
                  
                  <div className="space-y-4">
                    {[1, 2, 3].map((item) => (
                      <div key={item} className="border border-gray-200 rounded-lg p-4 flex flex-col md:flex-row gap-4">
                        <div className="w-full md:w-32 h-24 bg-gray-200 rounded-lg flex-shrink-0"></div>
                        <div className="flex-1">
                          <h3 className="font-semibold mb-1">2022 Maruti Swift VXI</h3>
                          <p className="text-primary font-bold mb-1">₹6,50,000</p>
                          <p className="text-gray-600 text-sm">Posted 2 days ago • 45 views</p>
                        </div>
                        <div className="flex flex-col gap-2">
                          <Button size="sm" variant="outline">Edit</Button>
                          <Button size="sm" variant="outline">Delete</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ResponsiveLayout>
  );
};

export default Profile;
