'use client';

import Header from '../components/layout/Header';
import { BarChart3 } from 'lucide-react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

export default function Dashboard() {
    return (
        <ProtectedRoute requiredRoute="/dashboard">
            <div className="min-h-screen bg-gray-50">
                <Header resource={undefined} />
                
                <main className="flex flex-col items-center justify-center px-4 py-16 mt-20">
                    <div className="max-w-2xl w-full text-center">
                        <div className="w-24 h-24 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-8">
                            <BarChart3 className="w-12 h-12 text-white" />
                        </div>
                        
                        <h1 className="text-4xl font-bold text-gray-900 mb-4">
                            Welcome to Dashboard
                        </h1>
                        
                        <p className="text-lg text-gray-600 mb-8">
                            View system overview and analytics. Monitor your application's performance, 
                            track key metrics, and gain insights into your data.
                        </p>
                        
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">
                                Dashboard Features
                            </h2>
                            <ul className="text-left text-gray-600 space-y-2">
                                <li>• Real-time analytics and metrics</li>
                                <li>• Performance monitoring</li>
                                <li>• Data visualization charts</li>
                                <li>• System health indicators</li>
                                <li>• Custom dashboard widgets</li>
                            </ul>
                        </div>
                    </div>
                </main>
            </div>
        </ProtectedRoute>
    );
}