'use client';

import { useState } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { endpointDataAccess, useResource } from '@able/data-access';

interface EndpointFormData {
  name: string;
  value: string;
}
const ROUTE_PATTERN = /^\/([a-z0-9]+|:[a-zA-Z_][a-zA-Z0-9_]*)(\/([a-z0-9]+|:[a-zA-Z_][a-zA-Z0-9_]*)?)*\/?$/;

export default function EndpointsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [error, setError] = useState('');

    const [formData, setFormData] = useState<EndpointFormData>({
    name: '',
    value: ''
  });
  const [, { create }] = useResource(endpointDataAccess as any);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: keyof EndpointFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

    const handleError = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));

        if (!ROUTE_PATTERN.test(value)) {
            setError('It must be like "/dashboard"');
        } else {
            setError('');
        }
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await create(formData);

      toast({
        title: "Success",
        description: "Endpoint created successfully!",
      });

      router.push('/endpoints/list');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create endpoint. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
          <div className="flex items-center justify-between p-6 border-b">
            <h2 className="text-lg font-semibold text-gray-900">Web endpoint data</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.back()}
              className="h-6 w-6 text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          {/* Form Content */}
          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name Field */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                  NAME *
                </Label>
                <Input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full"
                  placeholder="My Endpoint"
                  required
                />
              </div>

              {/* URL Field */}
              <div className="space-y-2">
                <Label htmlFor="url" className="text-sm font-medium text-gray-700">
                  URL *
                </Label>
                <Input
                  id="url"
                  type="text"
                  value={formData.value}
                  onChange={(e) => handleError('value', e.target.value)}
                  className="w-full"
                  placeholder="/dashboard"
                  pattern={ROUTE_PATTERN.source}
                  required
                />
                  {error && <p className="text-red-600 text-sm mt-1">{error}</p>}

              </div>



              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  className="px-4 py-2"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting || !formData.name || !formData.value}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {isSubmitting ? 'Saving...' : 'Save'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
