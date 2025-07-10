'use client';

import Header from '../components/layout/Header';
import { FileText } from 'lucide-react';

export default function Reports() {
    return (
        <div className="min-h-screen bg-gray-50">
            <Header resource={undefined} />
            
            <main className="flex flex-col items-center justify-center px-4 py-16 mt-20">
                <div className="max-w-2xl w-full text-center">
                    <div className="w-24 h-24 bg-indigo-500 rounded-full flex items-center justify-center mx-auto mb-8">
                        <FileText className="w-12 h-12 text-white" />
                    </div>
                    
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        Welcome to Reports
                    </h1>
                    
                    <p className="text-lg text-gray-600 mb-8">
                        Generate and view system reports. Create comprehensive reports, 
                        export data, and analyze trends across your application.
                    </p>
                    
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">
                            Report Features
                        </h2>
                        <ul className="text-left text-gray-600 space-y-2">
                            <li>• Custom report generation</li>
                            <li>• Data export in multiple formats</li>
                            <li>• Scheduled report delivery</li>
                            <li>• Interactive data filtering</li>
                            <li>• Historical trend analysis</li>
                        </ul>
                    </div>
                </div>
            </main>
        </div>
    );
}