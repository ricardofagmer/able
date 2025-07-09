'use client';

import Header from './components/layout/Header';
import { Users, Shield, List } from 'lucide-react';
import { Button } from './components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card';

export default function Search() {

    const menuItems = [
        {
            title: 'Users',
            description: 'Manage user accounts and profiles',
            icon: Users,
            href: '/users',
            color: 'bg-blue-500'
        },
        {
            title: 'Permissions',
            description: 'Configure user roles and permissions',
            icon: Shield,
            href: '/permissions',
            color: 'bg-green-500'
        },

        {
            title: 'View Endpoints',
            description: 'View and manage registered endpoints',
            icon: List,
            href: '/endpoints/list',
            color: 'bg-orange-500'
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50 overflow-x-hidden">
            <Header resource={undefined} />

            <main className="flex flex-col items-center justify-center px-4 py-16 mt-20">
                <div className="max-w-4xl w-full">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-bold text-gray-900 mb-4">Admin Dashboard</h1>
                        <p className="text-lg text-gray-600">Manage your application settings and configurations</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {menuItems.map((item) => {
                            const IconComponent = item.icon;
                            return (
                                <Card key={item.title} className="hover:shadow-lg transition-shadow cursor-pointer group">
                                    <CardHeader className="text-center">
                                        <div className={`w-16 h-16 ${item.color} rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                                            <IconComponent className="w-8 h-8 text-white" />
                                        </div>
                                        <CardTitle className="text-xl font-semibold">{item.title}</CardTitle>
                                        <CardDescription className="text-gray-600">
                                            {item.description}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="text-center">
                                        <Button 
                                            variant="outline" 
                                            className="w-full group-hover:bg-gray-50"
                                            onClick={() => window.location.href = item.href}
                                        >
                                            Access {item.title}
                                        </Button>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                </div>
            </main>
        </div>
    );
}
