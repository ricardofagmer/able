'use client';

import Header from '../components/layout/Header';
import { Settings } from 'lucide-react';

export default function CMS() {
    return (
        <div className="min-h-screen bg-gray-50">
            <Header resource={undefined} />
            
            <main className="flex flex-col items-center justify-center px-4 py-16 mt-20">
                <div className="max-w-2xl w-full text-center">
                    <div className="w-24 h-24 bg-teal-500 rounded-full flex items-center justify-center mx-auto mb-8">
                        <Settings className="w-12 h-12 text-white" />
                    </div>
                    
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        Welcome to CMS
                    </h1>
                    
                    <p className="text-lg text-gray-600 mb-8">
                        Content Management System. Manage your website content, 
                        create and edit pages, and organize your digital assets.
                    </p>
                    
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">
                            CMS Features
                        </h2>
                        <ul className="text-left text-gray-600 space-y-2">
                            <li>• Content creation and editing</li>
                            <li>• Media library management</li>
                            <li>• Page template system</li>
                            <li>• SEO optimization tools</li>
                            <li>• Content workflow management</li>
                        </ul>
                    </div>
                </div>
            </main>
        </div>
    );
}