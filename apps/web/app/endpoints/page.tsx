'use client';

import { useState } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { X, ChevronDown } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { endpointDataAccess, useResource } from '@able/data-access';

interface EndpointFormData {
  name: string;
  value: string;
}



export default function EndpointsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [formData, setFormData] = useState<EndpointFormData>({
    name: '',
    value: ''
  });
  const [, { create }] = useResource(endpointDataAccess);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPermissions, setShowPermissions] = useState(false);

  const handleInputChange = (field: keyof EndpointFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await create(formData);

      toast({
        title: "Sucesso",
        description: "Endpoint criado com sucesso!",
      });

      // Navigate back to the list page to refresh the endpoints
      router.push('/endpoints/list');
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao criar endpoint. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Modal-like container */}
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <h2 className="text-lg font-semibold text-gray-900">Dados do endpoint web</h2>
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
                  NOME *
                </Label>
                <Input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full"
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
                  onChange={(e) => handleInputChange('value', e.target.value)}
                  className="w-full"
                  required
                />
              </div>

              {/* Permissions Section */}
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => setShowPermissions(!showPermissions)}
                  className="flex items-center justify-between w-full text-left text-sm font-medium text-gray-700 hover:text-gray-900"
                >
                  <span>Permissões</span>
                  <ChevronDown className={`h-4 w-4 transition-transform ${showPermissions ? 'rotate-180' : ''}`} />
                </button>
                {showPermissions && (
                  <div className="mt-2 p-3 bg-gray-50 rounded border">
                    <p className="text-sm text-gray-600">
                      Configure as permissões necessárias para este endpoint.
                    </p>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  className="px-4 py-2"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting || !formData.name || !formData.value}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {isSubmitting ? 'Salvando...' : 'Salvar'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
