'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Edit, Trash2, Search, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import {
  permissionDataAccess,
  PermissionDto,
  CreatePermissionDto,
  UpdatePermissionDto,
  useResource
} from '@able/data-access';
import { userDataAccess } from '@able/data-access';
import { endpointDataAccess } from '@able/data-access';

interface Permission {
  id: string;
  name: string;
  value?: string;
  deactivatedAt?: Date | null;
  selectedEndpoints?: string[];
  selectedUsers?: string[];
}

interface Endpoint {
  id: string;
  name: string;
  path: string;
}

interface User {
  id: string;
  name: string;
  email: string;
}

export default function PermissionsPage() {
  const router = useRouter();
  const { toast } = useToast();

  // State for permissions list
  const [permissions, setPermissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // State for create modal
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createForm, setCreateForm] = useState<CreatePermissionDto>({
    name: '',
    selectedEndpoints: [],
    selectedUsers: []
  });
  const [isCreating, setIsCreating] = useState(false);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingPermission, setEditingPermission] = useState<Permission | null>(null);
  const [editForm, setEditForm] = useState<UpdatePermissionDto>({
    id: 0,
    name: '',
    selectedEndpoints: [],
    selectedUsers: []
  });
  const [isEditing, setIsEditing] = useState(false);

  const [endpointSearch, setEndpointSearch] = useState('');
  const [userSearch, setUserSearch] = useState('');
  const [editEndpointSearch, setEditEndpointSearch] = useState('');
  const [editUserSearch, setEditUserSearch] = useState('');

  const [availableEndpoints, setAvailableEndpoints] = useState<Endpoint[]>([]);
  const [availableUsers, setAvailableUsers] = useState<User[]>([]);

  const [, { create, update, fetchAll, remove }] = useResource(permissionDataAccess);

  useEffect(() => {
    loadPermissions();
    loadEndpoints();
    loadUsers();
  }, []);

  const loadPermissions = async () => {
    try {
      setLoading(true);
      const data = await fetchAll();
      console.log(data)
      setPermissions(data);

    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load permissions',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const loadEndpoints = async () => {
    try {
      const data = await endpointDataAccess.getAll();
      setAvailableEndpoints(data.map(e => ({
        id: e.id?.toString() || '',
        name: e.name || '',
        path: e.path || ''
      })));
    } catch (error) {
      console.error('Failed to load endpoints:', error);
    }
  };

  const loadUsers = async () => {
    try {
      const data = await userDataAccess.getAll();
      setAvailableUsers(data.map(u => ({
        id: u.id?.toString() || '',
        name: u.name || '',
        email: u.email || ''
      })));
    } catch (error) {
      console.error('Failed to load users:', error);
    }
  };

  // Create modal handlers
  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!createForm.name.trim()) {
      toast({
        title: 'Error',
        description: 'Permission name is required',
        variant: 'destructive'
      });
      return;
    }

    try {
      setIsCreating(true);
      await create(createForm);
      toast({
        title: 'Success',
        description: 'Permission created successfully'
      });
      setIsCreateModalOpen(false);
      handleCancelCreate();
      loadPermissions();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create permission',
        variant: 'destructive'
      });
    } finally {
      setIsCreating(false);
    }
  };

  const handleCancelCreate = () => {
    setCreateForm({
      name: '',
      selectedEndpoints: [],
      selectedUsers: []
    });
    setEndpointSearch('');
    setUserSearch('');
  };

  // Edit modal handlers
  const handleEditClick = (permission: Permission) => {
    setEditingPermission(permission);
    setEditForm({
      id: parseInt(permission.id),
      name: permission.name,
      selectedEndpoints: permission.selectedEndpoints || [],
      selectedUsers: permission.selectedUsers || []
    });
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editForm.name?.trim()) {
      toast({
        title: 'Error',
        description: 'Permission name is required',
        variant: 'destructive'
      });
      return;
    }

    try {
      setIsEditing(true);
      await update(editForm.id, editForm);
      toast({
        title: 'Success',
        description: 'Permission updated successfully'
      });
      setIsEditModalOpen(false);
      handleCancelEdit();
      loadPermissions();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update permission',
        variant: 'destructive'
      });
    } finally {
      setIsEditing(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingPermission(null);
    setEditForm({
      id: 0,
      name: '',
      selectedEndpoints: [],
      selectedUsers: []
    });
    setEditEndpointSearch('');
    setEditUserSearch('');
  };

  // Delete handler
  const handleDeleteClick = async (permission: Permission) => {
    if (window.confirm(`Are you sure you want to delete the permission "${permission.name}"?`)) {
      try {
        await remove(parseInt(permission.id));
        toast({
          title: 'Success',
          description: 'Permission deleted successfully'
        });
        loadPermissions();
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to delete permission',
          variant: 'destructive'
        });
      }
    }
  };

  // Toggle handlers for create form
  const handleCreateEndpointToggle = (endpointId: string) => {
    const currentSelected = createForm.selectedEndpoints || [];
    const newSelected = currentSelected.includes(endpointId)
      ? currentSelected.filter(id => id !== endpointId)
      : [...currentSelected, endpointId];

    setCreateForm(prev => ({ ...prev, selectedEndpoints: newSelected }));
  };

  const handleCreateUserToggle = (userId: string) => {
    const currentSelected = createForm.selectedUsers || [];
    const newSelected = currentSelected.includes(userId)
      ? currentSelected.filter(id => id !== userId)
      : [...currentSelected, userId];

    setCreateForm(prev => ({ ...prev, selectedUsers: newSelected }));
  };

  // Toggle handlers for edit form
  const handleEditEndpointToggle = (endpointId: string) => {
    const currentSelected = editForm.selectedEndpoints || [];
    const newSelected = currentSelected.includes(endpointId)
      ? currentSelected.filter(id => id !== endpointId)
      : [...currentSelected, endpointId];

    setEditForm(prev => ({ ...prev, selectedEndpoints: newSelected }));
  };

  const handleEditUserToggle = (userId: string) => {
    const currentSelected = editForm.selectedUsers || [];
    const newSelected = currentSelected.includes(userId)
      ? currentSelected.filter(id => id !== userId)
      : [...currentSelected, userId];

    setEditForm(prev => ({ ...prev, selectedUsers: newSelected }));
  };

  // Filtered data for create modal
  const filteredEndpoints = availableEndpoints.filter(endpoint =>
    endpoint.name.toLowerCase().includes(endpointSearch.toLowerCase())
  );

  const filteredUsers = availableUsers.filter(user =>
    user.name.toLowerCase().includes(userSearch.toLowerCase()) ||
    user.email.toLowerCase().includes(userSearch.toLowerCase())
  );

  // Filtered data for edit modal
  const filteredEditEndpoints = availableEndpoints.filter(endpoint =>
    endpoint.name.toLowerCase().includes(editEndpointSearch.toLowerCase())
  );

  const filteredEditUsers = availableUsers.filter(user =>
    user.name.toLowerCase().includes(editUserSearch.toLowerCase()) ||
    user.email.toLowerCase().includes(editUserSearch.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">Loading permissions...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.back()}
              className="mr-4"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Permissions Management</h1>
              <p className="text-gray-600 mt-1">Manage application permissions and access control</p>
            </div>
          </div>
          <Button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Create Permission
          </Button>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200">

          {/* Permissions Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Endpoints
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Users
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {permissions.map((permission) => (
                  <tr key={permission.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {permission.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {permission.selectedEndpoints?.length || 0} endpoints
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {permission.selectedUsers?.length || 0} users
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditClick(permission)}
                          className="flex items-center gap-1"
                        >
                          <Edit className="h-3 w-3" />
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteClick(permission)}
                          className="flex items-center gap-1 text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-3 w-3" />
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {permissions.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No permissions found. Create your first permission to get started.
              </div>
            )}
          </div>
        </div>

        {/* Create Modal */}
        {isCreateModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-6 border-b">
                <h2 className="text-xl font-semibold text-gray-900">Create New Permission</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setIsCreateModalOpen(false);
                    handleCancelCreate();
                  }}
                  className="h-6 w-6 p-0"
                >
                  ×
                </Button>
              </div>

              <form onSubmit={handleCreateSubmit} className="p-6 space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="create-name" className="text-sm font-medium text-gray-700">
                    Permission Name *
                  </Label>
                  <Input
                    id="create-name"
                    type="text"
                    value={createForm.name}
                    onChange={(e) => setCreateForm(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter permission name"
                    required
                    className="w-full"
                  />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  {/* Endpoints Section */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900">Endpoints</h3>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        type="text"
                        placeholder="Search endpoints..."
                        value={endpointSearch}
                        onChange={(e) => setEndpointSearch(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <div className="border rounded-lg p-4 max-h-64 overflow-y-auto">
                      <div className="space-y-2">
                        {filteredEndpoints.map((endpoint) => (
                          <div key={endpoint.id} className="flex items-center space-x-2">
                            <Checkbox
                              id={`create-endpoint-${endpoint.id}`}
                              checked={createForm.selectedEndpoints?.includes(endpoint.id) || false}
                              onCheckedChange={() => handleCreateEndpointToggle(endpoint.id)}
                            />
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-medium text-gray-900 truncate">
                                {endpoint.name}
                              </div>
                              <div className="text-xs text-gray-500 truncate">
                                {endpoint.path}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Users Section */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900">Users</h3>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        type="text"
                        placeholder="Search users..."
                        value={userSearch}
                        onChange={(e) => setUserSearch(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <div className="border rounded-lg p-4 max-h-64 overflow-y-auto">
                      <div className="space-y-2">
                        {filteredUsers.map((user) => (
                          <div key={user.id} className="flex items-center space-x-2">
                            <Checkbox
                              id={`create-user-${user.id}`}
                              checked={createForm.selectedUsers?.includes(user.id) || false}
                              onCheckedChange={() => handleCreateUserToggle(user.id)}
                            />
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-medium text-gray-900 truncate">
                                {user.name}
                              </div>
                              <div className="text-xs text-gray-500 truncate">
                                {user.email}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsCreateModalOpen(false);
                      handleCancelCreate();
                    }}
                    disabled={isCreating}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isCreating || !createForm.name}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {isCreating ? 'Creating...' : 'Create Permission'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Edit Modal */}
        {isEditModalOpen && editingPermission && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-6 border-b">
                <h2 className="text-xl font-semibold text-gray-900">Edit Permission</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setIsEditModalOpen(false);
                    handleCancelEdit();
                  }}
                  className="h-6 w-6 p-0"
                >
                  ×
                </Button>
              </div>

              <form onSubmit={handleEditSubmit} className="p-6 space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="edit-name" className="text-sm font-medium text-gray-700">
                    Permission Name *
                  </Label>
                  <Input
                    id="edit-name"
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter permission name"
                    required
                    className="w-full"
                  />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  {/* Endpoints Section */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900">Endpoints</h3>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        type="text"
                        placeholder="Search endpoints..."
                        value={editEndpointSearch}
                        onChange={(e) => setEditEndpointSearch(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <div className="border rounded-lg p-4 max-h-64 overflow-y-auto">
                      <div className="space-y-2">
                        {filteredEditEndpoints.map((endpoint) => (
                          <div key={endpoint.id} className="flex items-center space-x-2">
                            <Checkbox
                              id={`edit-endpoint-${endpoint.id}`}
                              checked={editForm.selectedEndpoints?.includes(endpoint.id) || false}
                              onCheckedChange={() => handleEditEndpointToggle(endpoint.id)}
                            />
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-medium text-gray-900 truncate">
                                {endpoint.name}
                              </div>
                              <div className="text-xs text-gray-500 truncate">
                                {endpoint.path}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Users Section */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900">Users</h3>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        type="text"
                        placeholder="Search users..."
                        value={editUserSearch}
                        onChange={(e) => setEditUserSearch(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <div className="border rounded-lg p-4 max-h-64 overflow-y-auto">
                      <div className="space-y-2">
                        {filteredEditUsers.map((user) => (
                          <div key={user.id} className="flex items-center space-x-2">
                            <Checkbox
                              id={`edit-user-${user.id}`}
                              checked={editForm.selectedUsers?.includes(user.id) || false}
                              onCheckedChange={() => handleEditUserToggle(user.id)}
                            />
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-medium text-gray-900 truncate">
                                {user.name}
                              </div>
                              <div className="text-xs text-gray-500 truncate">
                                {user.email}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsEditModalOpen(false);
                      handleCancelEdit();
                    }}
                    disabled={isEditing}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isEditing || !editForm.name}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {isEditing ? 'Updating...' : 'Update Permission'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
