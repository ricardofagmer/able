'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Search, Plus, Edit, Trash2, Users, Filter, X, UserPlus, Save } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { userDataAccess, permissionDataAccess, useResource } from "@able/data-access";
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';

interface User {
    id: number;
    name: string;
    email: string;
    isActive: boolean;
    createdAt: string;
    updatedAt?: string;
    permissions?: any[];
    permissionsCount?: number;
}

interface UserFormData {
    name: string;
    email: string;
    password: string;
    selectedPermissions: string[];
    isActive: boolean;
}

interface Permission {
    id: string;
    name: string;
    description: string;
}

export default function UsersListPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [users, setUsers] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [showFilters, setShowFilters] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [editForm, setEditForm] = useState({ name: '', email: '', isActive: false, selectedPermissions: [] as string[] });
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [createForm, setCreateForm] = useState<UserFormData>({
        name: '',
        email: '',
        password: '',
        selectedPermissions: [],
        isActive: true
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [permissionSearch, setPermissionSearch] = useState('');
    const [editPermissionSearch, setEditPermissionSearch] = useState('');

    const [, { fetchAll, update, remove, create }] = useResource(userDataAccess);
    const [availablePermissions, setAvailablePermissions] = useState<any[]>([]);

    const loadData = useCallback(async () => {
        try {
            setIsLoading(true);

            // Load available permissions
            const permissions = await permissionDataAccess.getAll();
            setAvailablePermissions(permissions || []);

            // Fetch permissions for each user
            const usersWithPermissions = await fetchAll();

            setUsers(usersWithPermissions);
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to load data",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    }, [fetchAll, toast]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const filteredUsers = users.filter(user =>
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleEdit = (user: User) => {
        setEditingUser(user);
        setEditForm({
            name: user.name,
            email: user.email,
            isActive: user.isActive,
            selectedPermissions: Array.isArray(user.permissions) ? user.permissions.map(p => p.id.toString()) : []
        });

        console.log(user)
    };

    const handleSaveEdit = async () => {
        if (!editingUser) return;

        try {
            // Update user with all data including permissions
            const updatedUser = await update(editingUser.id, {
                name: editForm.name,
                email: editForm.email,
                isActive: editForm.isActive,
                permissions: editForm.selectedPermissions.map(id => ({ id: Number(id) }))
            });

            // Fetch updated user with permissions to get the complete data
            const updatedUserWithPermissions = await userDataAccess.getById(editingUser.id);
            const updatedPermissions = updatedUserWithPermissions?.permissions || [];

            // Update user in state with new permissions
            setUsers(prev => prev.map(u =>
                u.id === editingUser.id ? {
                    ...(updatedUser as User),
                    permissions: updatedPermissions,
                    permissionsCount: Array.isArray(updatedPermissions) ? updatedPermissions.length : 0
                } : u
            ));

            toast({
                title: "Success",
                description: `User "${editForm.name}" updated successfully`,
            });

            setEditingUser(null);
            setEditForm({ name: '', email: '', isActive: false, selectedPermissions: [] });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to update user",
                variant: "destructive",
            });
        }
    };

    const handleCancelEdit = () => {
        setEditingUser(null);
        setEditForm({ name: '', email: '', isActive: false, selectedPermissions: [] });
        setEditPermissionSearch('');
    };

    const handleDelete = async (user: User) => {
        const confirmed = window.confirm(`Are you sure you want to delete the user "${user.name}"?`);
        if (!confirmed) return;

        try {
            await remove(user.id);
            setUsers(prev => prev.filter(u => u.id !== user.id));

            toast({
                title: "Success",
                description: `User "${user.name}" deleted successfully`,
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to delete user",
                variant: "destructive",
            });
        }
    };

    const handleToggleStatus = async (user: User) => {
        try {
            const updatedUser = await update(user.id, {
                ...user,
                isActive: !user.isActive
            });

            setUsers(prev => prev.map(u =>
                u.id === user.id ? updatedUser : u
            ));

            toast({
                title: "Success",
                description: `User ${updatedUser ? 'activated' : 'deactivated'} successfully`,
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to change user status",
                variant: "destructive",
            });
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const handleCreateInputChange = (field: keyof UserFormData, value: string | boolean | string[]) => {
        setCreateForm(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handlePermissionToggle = (permissionId: string) => {
        setCreateForm(prev => ({
            ...prev,
            selectedPermissions: prev.selectedPermissions.includes(permissionId)
                ? prev.selectedPermissions.filter(id => id !== permissionId)
                : [...prev.selectedPermissions, permissionId]
        }));
    };

    const handleEditPermissionToggle = (permissionId: string) => {
        setEditForm(prev => ({
            ...prev,
            selectedPermissions: prev.selectedPermissions.includes(permissionId)
                ? prev.selectedPermissions.filter(id => id !== permissionId)
                : [...prev.selectedPermissions, permissionId]
        }));
    };

    const filteredEditPermissions = availablePermissions.filter(permission =>
        permission.name.toLowerCase().includes(editPermissionSearch.toLowerCase()) ||
        permission.description.toLowerCase().includes(editPermissionSearch.toLowerCase())
    );

    const filteredPermissions = availablePermissions.filter(permission =>
        permission.name.toLowerCase().includes(permissionSearch.toLowerCase()) ||
        permission.description.toLowerCase().includes(permissionSearch.toLowerCase())
    );

    const handleCreateSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            // Create user with basic info
            const newUser = await create({
                name: createForm.name,
                email: createForm.email,
                password: createForm.password,
                isActive: createForm.isActive
            });

            // Assign selected permissions to the new user
            for (const permissionId of createForm.selectedPermissions) {
          await permissionDataAccess.assignPermissionToUser((newUser as { id: number }).id.toString(), Number(permissionId));
            }

            // Refresh the entire user list to show the new user
            await loadData();

            toast({
                title: "Success",
                description: "User created successfully!",
            });

            // Reset form and close modal
            setCreateForm({
                name: '',
                email: '',
                password: '',
                selectedPermissions: [],
                isActive: true
            });
            setShowCreateModal(false);
            setPermissionSearch('');
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to create user. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancelCreate = () => {
        setCreateForm({
            name: '',
            email: '',
            password: '',
            selectedPermissions: [],
            isActive: true
        });
        setShowCreateModal(false);
        setPermissionSearch('');
    };

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
                            <h1 className="text-3xl font-bold text-gray-900">Registered Users</h1>
                            <p className="text-gray-600 mt-1">Manage all application users</p>
                        </div>
                    </div>
                    <Button
                        onClick={() => setShowCreateModal(true)}
                        className="flex items-center gap-2"
                    >
                        <Plus className="h-4 w-4"/>
                        New User
                    </Button>
                </div>

                {/* Search and Filters */}
                <Card className="mb-6">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                            <div className="relative flex-1">
                                <Search
                                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                <Input
                                    placeholder="Search by name or email..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                            <Button
                                variant="outline"
                                onClick={() => setShowFilters(!showFilters)}
                                className="flex items-center gap-2"
                            >
                                <Filter className="h-4 w-4" />
                                Filters
                            </Button>
                        </div>

                        {showFilters && (
                            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                                <p className="text-sm text-gray-600">
                                    Additional filters will be implemented here (status, creation date, etc.)
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Users List */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Users className="h-5 w-5" />
                            Users ({filteredUsers.length})
                        </CardTitle>
                        <CardDescription>
                            {isLoading ? 'Loading users...' : `${filteredUsers.length} user(s) found`}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <div className="flex items-center justify-center py-8">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                            </div>
                        ) : filteredUsers.length === 0 ? (
                            <div className="text-center py-8">
                                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 mb-2">
                                    {searchTerm ? 'No users found' : 'No users registered'}
                                </h3>
                                <p className="text-gray-600 mb-4">
                                    {searchTerm
                                        ? 'Try adjusting your search terms'
                                        : 'Start by creating your first user'
                                    }
                                </p>
                                {!searchTerm && (
                                    <Button onClick={() => setShowCreateModal(true)}>
                                        <Plus className="h-4 w-4 mr-2"/>
                                        Create First User
                                    </Button>
                                )}
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {filteredUsers.map((user) => (
                                    <div
                                        key={user.id}
                                        className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                                    >
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="font-medium text-gray-900">{user.name}</h3>
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${user.isActive
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-gray-100 text-gray-800'
                                                    }`}>
                                                    {user.isActive ? 'Active' : 'Inactive'}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-4 text-sm text-gray-600">
                                                <code className="bg-gray-100 px-2 py-1 rounded text-xs">
                                                     {user.email}
                                                 </code>
                                                 <div className="flex items-center gap-2">
                                                     <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                         {user.permissionsCount || 0} permissions
                                                     </span>
                                                 </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">

                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleEdit(user)}
                                                className="h-8 w-8"
                                            >
                                                <Edit className="h-4 w-4" />
                                            </Button>

                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Statistics Card */}
                {!isLoading && users.length > 0 && (
                    <Card className="mt-6">
                        <CardHeader>
                            <CardTitle className="text-lg">Statistics</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div className="text-center p-4 bg-blue-50 rounded-lg">
                                    <div className="text-2xl font-bold text-blue-600">{users.length}</div>
                                    <div className="text-sm text-blue-800">Total Users</div>
                                </div>
                                <div className="text-center p-4 bg-green-50 rounded-lg">
                                    <div className="text-2xl font-bold text-green-600">
                                        {users.filter(u => u.isActive).length}
                                    </div>
                                    <div className="text-sm text-green-800">Active Users</div>
                                </div>
                                <div className="text-center p-4 bg-gray-50 rounded-lg">
                                    <div className="text-2xl font-bold text-gray-600">
                                        {users.filter(u => !u.isActive).length}
                                    </div>
                                    <div className="text-sm text-gray-800">Inactive Users</div>
                                </div>
                                <div className="text-center p-4 bg-purple-50 rounded-lg">
                                    <div className="text-2xl font-bold text-purple-600">
                                        {users.reduce((total, user) => total + (user.permissionsCount || 0), 0)}
                                    </div>
                                    <div className="text-sm text-purple-800">Total Permissions</div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Edit Modal */}
                {editingUser && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg p-6 w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-semibold text-gray-900">Edit User</h2>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={handleCancelEdit}
                                    className="h-8 w-8"
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <Label htmlFor="edit-name">Name</Label>
                                    <Input
                                        id="edit-name"
                                        value={editForm.name}
                                        onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                                        placeholder="User name"
                                        className="mt-1"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="edit-email">Email</Label>
                                    <Input
                                        id="edit-email"
                                        value={editForm.email}
                                        onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                                        placeholder="email@example.com"
                                        className="mt-1"
                                    />
                                </div>

                                {/* Permissions Section */}
                                <div className="space-y-2">
                                    <h3 className="text-sm font-medium text-gray-700">Permissions</h3>
                                    <div className="border rounded-lg p-4 space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <h4 className="text-sm font-medium text-gray-700 mb-2">Available</h4>
                                                <Input
                                                    type="text"
                                                    placeholder="Search permissions..."
                                                    value={editPermissionSearch}
                                                    onChange={(e) => setEditPermissionSearch(e.target.value)}
                                                    className="mb-2"
                                                />
                                                <div className="space-y-2 max-h-40 overflow-y-auto">
                                                    {filteredEditPermissions.map((permission) => (
                                                        <div key={permission.id} className="flex items-center space-x-2">
                                                            <Checkbox
                                                                id={`edit-permission-${permission.id}`}
                                                                checked={editForm.selectedPermissions.includes(permission.id.toString())}
                                                                onCheckedChange={() => handleEditPermissionToggle(permission.id.toString())}
                                                            />
                                                            <div className="flex-1 min-w-0">
                                                                <div className="text-sm font-medium text-gray-900 truncate">
                                                                    {permission.name}
                                                                </div>
                                                                <div className="text-xs text-gray-500 truncate">
                                                                    {permission.description}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            <div>
                                                <h4 className="text-sm font-medium text-gray-700 mb-2">Selected</h4>
                                                <div className="space-y-2 max-h-52 overflow-y-auto">
                                                    {editForm.selectedPermissions.map((permissionId) => {
                                                        const permission = availablePermissions.find(p => p.id.toString() === permissionId);
                                                        return permission ? (
                                                            <div key={permission.id} className="flex items-center space-x-2">
                                                                <Checkbox
                                                                    checked={true}
                                                                    onCheckedChange={() => handleEditPermissionToggle(permission.id.toString())}
                                                                />
                                                                <div className="flex-1 min-w-0">
                                                                    <div className="text-sm font-medium text-gray-900 truncate">
                                                                        {permission.name}
                                                                    </div>
                                                                    <div className="text-xs text-gray-500 truncate">
                                                                        {permission.description}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ) : null;
                                                    })}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-2">
                                    <Switch
                                        id="edit-active"
                                        checked={editForm.isActive}
                                        onCheckedChange={(checked) => setEditForm(prev => ({ ...prev, isActive: checked }))}
                                    />
                                    <Label htmlFor="edit-active">Active user</Label>
                                </div>
                            </div>

                            <div className="flex justify-end space-x-2 mt-6">
                                <Button
                                    variant="outline"
                                    onClick={handleCancelEdit}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={handleSaveEdit}
                                    disabled={!editForm.name.trim() || !editForm.email.trim()}
                                >
                                    Save
                                </Button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Create User Modal */}
                {showCreateModal && (
                     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg p-6 w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                                    <UserPlus className="h-5 w-5" />
                                    Create New User
                                </h2>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={handleCancelCreate}
                                    className="h-8 w-8"
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>

                            <form onSubmit={handleCreateSubmit} className="space-y-6">
                                {/* Name Field */}
                                <div className="space-y-2">
                                    <Label htmlFor="create-name">Full Name *</Label>
                                    <Input
                                        id="create-name"
                                        type="text"
                                        value={createForm.name}
                                        onChange={(e) => handleCreateInputChange('name', e.target.value)}
                                        placeholder="Enter full name"
                                        required
                                    />
                                </div>

                                {/* Email Field */}
                                <div className="space-y-2">
                                    <Label htmlFor="create-email">Email Address *</Label>
                                    <Input
                                        id="create-email"
                                        type="email"
                                        value={createForm.email}
                                        onChange={(e) => handleCreateInputChange('email', e.target.value)}
                                        placeholder="Enter email address"
                                        required
                                    />
                                </div>

                                {/* Password Field */}
                                <div className="space-y-2">
                                    <Label htmlFor="create-password">Password</Label>
                                    <Input
                                        id="create-password"
                                        type="password"
                                        value={createForm.password}
                                        onChange={(e) => handleCreateInputChange('password', e.target.value)}
                                        placeholder="Enter password (optional)"
                                    />
                                </div>

                                {/* Permissions Section */}
                                <div className="space-y-2">
                                    <h3 className="text-sm font-medium text-gray-700">Permissions</h3>
                                    <div className="border rounded-lg p-4 space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <h4 className="text-sm font-medium text-gray-700 mb-2">Available</h4>
                                                <Input
                                                    type="text"
                                                    placeholder="Search permissions..."
                                                    value={permissionSearch}
                                                    onChange={(e) => setPermissionSearch(e.target.value)}
                                                    className="mb-2"
                                                />
                                                <div className="space-y-2 max-h-40 overflow-y-auto">
                                                    {filteredPermissions.map((permission) => (
                                                        <div key={permission.id} className="flex items-center space-x-2">
                                                            <Checkbox
                                                                id={`permission-${permission.id}`}
                                                                checked={createForm.selectedPermissions.includes(permission.id)}
                                                                onCheckedChange={() => handlePermissionToggle(permission.id)}
                                                            />
                                                            <div className="flex-1 min-w-0">
                                                                <div className="text-sm font-medium text-gray-900 truncate">
                                                                    {permission.name}
                                                                </div>
                                                                <div className="text-xs text-gray-500 truncate">
                                                                    {permission.description}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            <div>
                                                <h4 className="text-sm font-medium text-gray-700 mb-2">Selected</h4>
                                                <div className="space-y-2 max-h-52 overflow-y-auto">
                                                    {createForm.selectedPermissions.map((permissionId) => {
                                                        const permission = availablePermissions.find(p => p.id === permissionId);
                                                        return permission ? (
                                                            <div key={permission.id} className="flex items-center space-x-2">
                                                                <Checkbox
                                                                    checked={true}
                                                                    onCheckedChange={() => handlePermissionToggle(permission.id)}
                                                                />
                                                                <div className="flex-1 min-w-0">
                                                                    <div className="text-sm font-medium text-gray-900 truncate">
                                                                        {permission.name}
                                                                    </div>
                                                                    <div className="text-xs text-gray-500 truncate">
                                                                        {permission.description}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ) : null;
                                                    })}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Active Status */}
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="create-isActive"
                                        checked={createForm.isActive}
                                        onCheckedChange={(checked) => handleCreateInputChange('isActive', checked as boolean)}
                                    />
                                    <Label htmlFor="create-isActive">Active User</Label>
                                </div>

                                {/* Submit Buttons */}
                                <div className="flex justify-end space-x-2 pt-4">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={handleCancelCreate}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={isSubmitting || !createForm.name.trim() || !createForm.email.trim()}
                                        className="flex items-center gap-2"
                                    >
                                        <Save className="h-4 w-4" />
                                        {isSubmitting ? 'Creating...' : 'Create User'}
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
