'use client';

import { Settings } from 'lucide-react';
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

export default function CMS() {
    return (
        <ProtectedRoute requiredRoute="/cms">
            <div className="min-h-screen bg-gradient-to-br from-purple-50 to-violet-100 p-8">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-purple-600 rounded-full mb-6">
                            <Settings className="w-10 h-10 text-white" />
                        </div>
                        <h1 className="text-4xl font-bold text-gray-900 mb-4">Bem-vindo ao CMS</h1>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Gerencie conteúdo, configurações e administre seu sistema de forma eficiente.
                        </p>
                    </div>

                    <div className="bg-white rounded-lg shadow-lg p-8">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Recursos do CMS</h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div className="flex items-center space-x-3">
                                    <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                                    <span className="text-gray-700">Gerenciamento de conteúdo</span>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                                    <span className="text-gray-700">Editor de páginas</span>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                                    <span className="text-gray-700">Controle de usuários</span>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="flex items-center space-x-3">
                                    <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                                    <span className="text-gray-700">Configurações do sistema</span>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                                    <span className="text-gray-700">Backup e restauração</span>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                                    <span className="text-gray-700">Logs de auditoria</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}
