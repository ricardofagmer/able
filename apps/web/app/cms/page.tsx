'use client';

import { Settings } from 'lucide-react';
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import Header from "@/components/layout/Header";

export default function CMS() {
    return (
        <ProtectedRoute requiredRoute="/cms">
            <Header resource={undefined} />
            <div className="min-h-screen bg-gradient-to-br from-purple-50 to-violet-100 p-8 mt-16">

                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-purple-600 rounded-full mb-6">
                            <Settings className="w-10 h-10 text-white" />
                        </div>
                        <h1 className="text-4xl font-bold text-gray-900 mb-4">Welcome to CMS</h1>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Manage content, settings and administer your system efficiently.
                        </p>
                    </div>

                    <div className="bg-white rounded-lg shadow-lg p-8">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-6">CMS Features</h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div className="flex items-center space-x-3">
                                    <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                                    <span className="text-gray-700">Content management</span>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                                    <span className="text-gray-700">Page editor</span>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                                    <span className="text-gray-700">User control</span>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="flex items-center space-x-3">
                                    <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                                    <span className="text-gray-700">System settings</span>
                                </div>
                                <div className="flex items-center space-x-3">F
                                    <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                                    <span className="text-gray-700">Backup and restore</span>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                                    <span className="text-gray-700">Audit logs</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}
