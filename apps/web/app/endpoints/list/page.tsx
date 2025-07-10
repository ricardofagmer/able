'use client';

import {useState, useEffect} from 'react';
import {Button} from '../../components/ui/button';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '../../components/ui/card';
import {Input} from '../../components/ui/input';
import {ArrowLeft, Search, Plus, Edit, Trash2, Globe, Filter, X} from 'lucide-react';
import {useRouter} from 'next/navigation';
import {useToast} from '@/hooks/use-toast';
import {endpointDataAccess, useResource} from "@able/data-access";
import {Label} from '../../components/ui/label';

interface Endpoint {
    id: number;
    name: string;
    value: string;
    deactivatedAt: string;
}


export default function EndpointsListPage() {
    const router = useRouter();
    const {toast} = useToast();
    const [endpoints, setEndpoints] = useState<any>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [showFilters, setShowFilters] = useState(false);
    const [editingEndpoint, setEditingEndpoint] = useState<Endpoint | null>(null);
    const [editForm, setEditForm] = useState({ name: '', value: '', deactivatedAt: '' });

    const [, {fetchAll, update, remove}] = useResource(endpointDataAccess);


    useEffect(() => {
        const loadEndpoints = async () => {
            try {
                setIsLoading(true);
                const resp = await fetchAll();

                setEndpoints(resp);
            } catch (err) {
                toast({
                    title: "Error",
                    description: `Error fetching endpoints: ${err}`,
                    variant: "destructive",
                });
            } finally {
                setIsLoading(false);
            }
        };

        loadEndpoints();
    }, [fetchAll]);

    const filteredEndpoints = endpoints.filter((endpoint: Endpoint) => {
        if (!searchTerm) return true;
        return endpoint.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
               endpoint.value.toLowerCase().includes(searchTerm.toLowerCase());
    });
    const handleEdit = (endpoint: Endpoint) => {
        setEditingEndpoint(endpoint);
        setEditForm({
            name: endpoint.name,
            value: endpoint.value,
            deactivatedAt: endpoint.deactivatedAt,
        });
    };

    const handleSaveEdit = async () => {
        if (!editingEndpoint) return;

        try {
            const updatedEndpoint = await update(editingEndpoint.id, editForm);
            setEndpoints(prev => prev.map(e =>
                e.id === editingEndpoint.id ? updatedEndpoint : e
            ));

            toast({
                title: "Success",
                description: `Endpoint "${editForm.name}" updated successfully`,
            });

            setEditingEndpoint(null);
            setEditForm({ name: '', value: '', deactivatedAt: '' });;
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to update endpoint",
                variant: "destructive",
            });
        }
    };

    const handleCancelEdit = () => {
        setEditingEndpoint(null);
        setEditForm({ name: '', value: '', deactivatedAt: '' });;
    };

    const handleDelete = async (endpoint: Endpoint) => {
        if (!confirm(`Are you sure you want to delete the endpoint "${endpoint.name}"?`)) {
            return;
        }

        try {
            await remove(endpoint.id);
            setEndpoints(prev => prev.filter(e => e.id !== endpoint.id));
            toast({
                title: "Success",
                description: `Endpoint "${endpoint.name}" deleted successfully`,
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to delete endpoint",
                variant: "destructive",
            });
        }
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
                            onClick={() => router.push('/')}
                            className="mr-4"
                        >
                            <ArrowLeft className="h-5 w-5"/>
                        </Button>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Registered Endpoints</h1>
                            <p className="text-gray-600 mt-1">Manage all application endpoints</p>
                        </div>
                    </div>
                    <Button
                        onClick={() => router.push('/endpoints')}
                        className="flex items-center gap-2"
                    >
                        <Plus className="h-4 w-4"/>
                        New Endpoint
                    </Button>
                </div>

                {/* Search and Filters */}
                <Card className="mb-6">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                            <div className="relative flex-1">
                                <Search
                                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4"/>
                                <Input
                                    placeholder="Search by name or URL..."
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
                                <Filter className="h-4 w-4"/>
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

                {/* Endpoints List */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Globe className="h-5 w-5"/>
                            Endpoints ({filteredEndpoints.length})
                        </CardTitle>
                        <CardDescription>
                            {isLoading ? 'Loading endpoints...' : `${filteredEndpoints.length} endpoint(s) found`}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <div className="flex items-center justify-center py-8">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                            </div>
                        ) : filteredEndpoints.length === 0 ? (
                            <div className="text-center py-8">
                                <Globe className="h-12 w-12 text-gray-400 mx-auto mb-4"/>
                                <h3 className="text-lg font-medium text-gray-900 mb-2">
                                    {searchTerm ? 'No endpoints found' : 'No endpoints registered'}
                                </h3>
                                <p className="text-gray-600 mb-4">
                                    {searchTerm
                                        ? 'Try adjusting your search terms'
                                        : 'Start by creating your first endpoint'
                                    }
                                </p>
                                {!searchTerm && (
                                    <Button onClick={() => router.push('/endpoints')}>
                                        <Plus className="h-4 w-4 mr-2"/>
                                        Create First Endpoint
                                    </Button>
                                )}
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {filteredEndpoints.map((endpoint) => (
                                    <div
                                        key={endpoint.id}
                                        className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                                    >
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="font-medium text-gray-900">{endpoint.name}</h3>
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                    endpoint.isActive
                                                        ? 'bg-gray-100 text-gray-800'
                                                        : 'bg-green-100 text-green-800'
                                                }`}>
                                                    {endpoint.deactivatedAt ? 'Disabled' : 'Enabled'}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-3 mb-2">
                                                Route: <strong className="font-medium text-gray-900">{endpoint.value}</strong>

                                            </div>

                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleEdit(endpoint)}
                                                className="h-8 w-8"
                                            >
                                                <Edit className="h-4 w-4"/>
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleDelete(endpoint)}
                                                className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                                            >
                                                <Trash2 className="h-4 w-4"/>
                                            </Button>
                                        </div>
                                    </div>
                                ))}
            </div>
        )}
    </CardContent>
</Card>

                {/* Statistics Card */}
                {!isLoading && endpoints.length > 0 && (
                    <Card className="mt-6">
                        <CardHeader>
                            <CardTitle className="text-lg">Statistics</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="text-center p-4 bg-blue-50 rounded-lg">
                                    <div className="text-2xl font-bold text-blue-600">{endpoints.length}</div>
                                    <div className="text-sm text-blue-800">Total Endpoints</div>
                                </div>
                                <div className="text-center p-4 bg-green-50 rounded-lg">
                                    <div className="text-2xl font-bold text-green-600">
                                        {endpoints.filter(e => e.isActive).length}
                                    </div>
                                    <div className="text-sm text-green-800">Active Endpoints</div>
                                </div>
                                <div className="text-center p-4 bg-gray-50 rounded-lg">
                                    <div className="text-2xl font-bold text-gray-600">
                                        {endpoints.filter(e => !e.isActive).length}
                                    </div>
                                    <div className="text-sm text-gray-800">Inactive Endpoints</div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>

            {/* Edit Modal */}
            {editingEndpoint && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-semibold text-gray-900">Edit Endpoint</h2>
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
                                    placeholder="Endpoint name"
                                    className="mt-1"
                                />
                            </div>

                            <div>
                                <Label htmlFor="edit-url">Route</Label>
                                <Input
                                    id="edit-url"
                                    value={editForm.value}
                                    onChange={(e) => setEditForm(prev => ({ ...prev, value: e.target.value }))}
                                    placeholder="/endpoint"
                                    className="mt-1"
                                />
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
                                disabled={!editForm.name || !editForm.value}
                            >
                                Save
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
