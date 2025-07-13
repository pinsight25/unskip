
import React, { useEffect, useState } from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/lib/supabase';

interface MakeModelSelectorProps {
  make: string;
  model: string;
  onMakeChange: (value: string) => void;
  onModelChange: (value: string) => void;
}

const STATIC_MAKES = [
  { id: 1, name: 'Tata' },
  { id: 2, name: 'Maruti' },
  { id: 3, name: 'Hyundai' },
  { id: 4, name: 'Honda' },
  { id: 5, name: 'Toyota' }
];
const STATIC_MODELS: Record<string, { id: number; name: string }[]> = {
  'Tata': [ { id: 1, name: 'Nexon' }, { id: 2, name: 'Altroz' } ],
  'Maruti': [ { id: 3, name: 'Swift' }, { id: 4, name: 'Baleno' } ],
  'Hyundai': [ { id: 5, name: 'i20' }, { id: 6, name: 'Creta' } ],
  'Honda': [ { id: 7, name: 'City' }, { id: 8, name: 'Amaze' } ],
  'Toyota': [ { id: 9, name: 'Innova' }, { id: 10, name: 'Fortuner' } ]
};

const MAKE_CACHE_KEY = 'car_makes_cache_v1';
const MODEL_CACHE_PREFIX = 'car_models_cache_v1_';

function sleep(ms: number) { return new Promise(res => setTimeout(res, ms)); }

async function fetchWithRetry(fn: () => Promise<any>, retries = 3, delay = 500) {
  let lastErr;
  for (let i = 0; i < retries; i++) {
    try { return await fn(); } catch (err) { lastErr = err; await sleep(delay); }
  }
  throw lastErr;
}

const MakeModelSelector = ({ make, model, onMakeChange, onModelChange }: MakeModelSelectorProps) => {
  const [makes, setMakes] = useState<any[]>([]);
  const [models, setModels] = useState<any[]>([]);
  const [makesLoading, setMakesLoading] = useState(true);
  const [modelsLoading, setModelsLoading] = useState(false);
  const [makesError, setMakesError] = useState<string | null>(null);
  const [modelsError, setModelsError] = useState<string | null>(null);

  // Load makes on mount
  useEffect(() => {
    const loadMakes = async () => {
      setMakesLoading(true);
      setMakesError(null);
      // Try cache first
      const cached = localStorage.getItem(MAKE_CACHE_KEY);
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          setMakes(parsed);
          setMakesLoading(false);
        } catch {}
      }
      // Try Supabase with retry
      try {
        const { data, error } = await fetchWithRetry(() =>
          (async () => await supabase.from('car_makes').select('*').order('name'))(), 3, 500
        );
        if (error) throw error;
        if (data && data.length > 0) {
          setMakes(data);
          localStorage.setItem(MAKE_CACHE_KEY, JSON.stringify(data));
        } else {
          throw new Error('No makes found');
        }
        setMakesError(null);
      } catch (err) {
        // Fallback to cache if available
        const cached = localStorage.getItem(MAKE_CACHE_KEY);
        if (cached) {
          try {
            const parsed = JSON.parse(cached);
            setMakes(parsed);
            setMakesError('Loaded from cache due to network error.');
          } catch {}
        } else {
          setMakes(STATIC_MAKES);
          setMakesError('Loaded fallback makes due to network error.');
        }
      }
      setMakesLoading(false);
    };
    loadMakes();
  }, []);

  // Load models when make changes OR on mount if make exists
  useEffect(() => {
    if (make) {
      setModelsLoading(true);
      setModelsError(null);
      // Try cache first
      const cacheKey = MODEL_CACHE_PREFIX + make;
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          setModels(parsed);
          setModelsLoading(false);
        } catch {}
      }
      const loadModels = async () => {
        try {
          const { data: makeData } = await fetchWithRetry(() =>
            (async () => await supabase.from('car_makes').select('id').eq('name', make).single())(), 3, 500
          );
          if (makeData) {
            const { data: modelsData, error: modelsError } = await fetchWithRetry(() =>
              (async () => await supabase.from('car_models').select('*').eq('make_id', makeData.id).order('name'))(), 3, 500
            );
            if (modelsError) throw modelsError;
            if (modelsData && modelsData.length > 0) {
              setModels(modelsData);
              localStorage.setItem(cacheKey, JSON.stringify(modelsData));
              setModelsError(null);
            } else {
              throw new Error('No models found');
            }
          } else {
            throw new Error('Make not found');
          }
        } catch (err) {
          // Fallback to cache if available
          const cached = localStorage.getItem(cacheKey);
          if (cached) {
            try {
              const parsed = JSON.parse(cached);
              setModels(parsed);
              setModelsError('Loaded from cache due to network error.');
            } catch {}
          } else if (STATIC_MODELS[make]) {
            setModels(STATIC_MODELS[make]);
            setModelsError('Loaded fallback models due to network error.');
          } else {
            setModels([]);
            setModelsError('No models found for this make.');
          }
        }
        setModelsLoading(false);
      };
      loadModels();
    } else {
      setModels([]);
    }
  }, [make]);

  const handleMakeChange = (value: string) => {
    onMakeChange(value);
    // Clear model when make changes
    onModelChange('');
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <Label htmlFor="make">Make *</Label>
        <Select value={make} onValueChange={handleMakeChange} disabled={makesLoading}>
          <SelectTrigger>
            <SelectValue placeholder={makesLoading ? "Loading makes..." : makesError ? makesError : "Select Make"} />
          </SelectTrigger>
          <SelectContent 
            position="popper"
            side="bottom"
            align="start"
            sideOffset={4}
            className="max-h-[300px] overflow-y-auto z-50"
            onPointerDownOutside={(e) => e.preventDefault()}
          >
            {makes.map((makeOption) => (
              <SelectItem key={makeOption.id} value={makeOption.name}>
                {makeOption.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {makesError && <div className="text-xs text-red-500 mt-1">{makesError}</div>}
      </div>

      <div>
        <Label htmlFor="model">Model *</Label>
        <Select value={model} onValueChange={onModelChange} disabled={!make || modelsLoading}>
          <SelectTrigger>
            <SelectValue placeholder={
              !make ? "Select Make first" : 
              modelsLoading ? "Loading models..." : 
              modelsError ? modelsError : "Select Model"
            } />
          </SelectTrigger>
          <SelectContent 
            position="popper"
            side="bottom"
            align="start"
            sideOffset={4}
            className="max-h-[300px] overflow-y-auto z-50"
            onPointerDownOutside={(e) => e.preventDefault()}
          >
            {models.map((modelOption) => (
              <SelectItem key={modelOption.id} value={modelOption.name}>
                {modelOption.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {modelsError && <div className="text-xs text-red-500 mt-1">{modelsError}</div>}
      </div>
    </div>
  );
};

export default MakeModelSelector;
