import { useState } from 'react';
import { supabase } from '@/lib/supabase';

interface ProfileFormProps {
  userId: string;
  phone: string;
  onComplete: () => void;
}

export function ProfileForm({ userId, phone, onComplete }: ProfileFormProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase
        .from('users')
        .update({
          name,
          email,
          city,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);
      if (error) throw error;
      onComplete();
    } catch (error) {
      // console.error('[ProfileForm] Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        placeholder="Your Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        className="w-full p-3 border rounded-lg"
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="w-full p-3 border rounded-lg"
      />
      <input
        type="text"
        placeholder="City"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        required
        className="w-full p-3 border rounded-lg"
      />
      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 bg-orange-500 text-white rounded-lg"
      >
        {loading ? 'Saving...' : 'Complete Profile'}
      </button>
    </form>
  );
} 