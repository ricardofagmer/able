"use client";

import { ArrowLeft, ChevronDown, LogOut, Headset, BarChart3, FileText, Settings, Home } from "lucide-react";
import { Button } from "../ui/button";
import { JSX, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/store/userStore";
import { useAuthModal } from "@/context/AuthModalContext";
import { useHashParams } from "@/hooks/useHashParams";
import { useClientOnly } from '@/hooks/useClientOnly';
import { usePermissions } from '@/hooks/usePermissions';

const Header = ({ resource }: { resource: string }): JSX.Element => {
    const { modalType, openModal, closeModal } = useAuthModal();

    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const router = useRouter();
    const { account, logout } = useUserStore();
    const [user, setUser] = useState(null);
    const { hasPermission, hasRouteAccess, isAuthenticated } = usePermissions();


    useEffect(() => {
        if (account) {
            try {
                setUser(JSON.parse(account));
            } catch (e) {
                console.error("Failed to parse account:", e);
                setUser(null);
            }
        } else {
            setUser(null);
        }
    }, [account]);


    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);


    const handleLogout = () => {
        logout();
        setIsOpen(false);
        setUser(null);
        router.push('/');
    };

    return (
        <>
            <header className="bg-white border-b border-gray-200 px-6 py-4 fixed top-0 w-full z-10">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                            <>

                                <span className="text-xl font-semibold text-gray-900">
                                    Test: Permissions
                                </span>
                            </>

                    </div>

                    {/* Navigation Menu */}
                    {!resource && (
                        <nav className="flex items-center space-x-6">
                            <a href="/" className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 transition-colors">
                                <Home className="w-4 h-4" />
                                <span className="text-sm font-medium">Home</span>
                            </a>
                            {(hasRouteAccess('/dashboard') || !isAuthenticated) && (
                                <a href="/dashboard" className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 transition-colors">
                                    <BarChart3 className="w-4 h-4" />
                                    <span className="text-sm font-medium">Dashboard</span>
                                </a>
                            )}
                            {(hasRouteAccess('/reports') || !isAuthenticated) && (
                                <a href="/reports" className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 transition-colors">
                                    <FileText className="w-4 h-4" />
                                    <span className="text-sm font-medium">Reports</span>
                                </a>
                            )}
                            {(hasRouteAccess('/cms') || !isAuthenticated) && (
                                <a href="/cms" className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 transition-colors">
                                    <Settings className="w-4 h-4" />
                                    <span className="text-sm font-medium">CMS</span>
                                </a>
                            )}
                        </nav>
                    )}

                    {user ? (
                        <div className="relative" ref={dropdownRef}>
                            <div className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 rounded-lg transition-colors">
                                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                                    <span className="text-sm font-medium text-gray-700">
                                        {user?.email?.charAt(0)?.toUpperCase() || ""}
                                    </span>
                                </div>
                                <span className="text-sm font-medium text-gray-700" onClick={() => setIsOpen(!isOpen)}>
                                    {user?.email}
                                </span>
                                <ChevronDown onClick={() => setIsOpen(!isOpen)}
                                    className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? "rotate-180" : ""}`}
                                />
                            </div>

                            {/* Dropdown Menu */}
                            {isOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-10">
                                    <div className="py-1">
                                        <button
                                            onClick={handleLogout}
                                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                                        >
                                            <LogOut className="w-4 h-4 mr-2" />
                                            Logout
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="flex items-center space-x-4">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => openModal("login")}
                                className="bg-gray-900 rounded-full text-white text-sm font-normal hover:bg-[#97dffc]"
                            >
                                Login
                            </Button>
                        </div>
                    )}
                </div>


            </header>

            {/* Patient Information Bar */}
            {resource && (
                <div className="bg-white border-b border-gray-200 px-6 py-4 fixed top-[73px] w-full">
                    <div className="flex items-center space-x-4">
                        {/* Patient Avatar */}
                        <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-lg font-semibold">S</span>
                        </div>

                        {/* Patient Info */}
                        <div className="flex-1">
                            <div className="flex items-center space-x-4">
                                <div>
                                    <h2 className="text-lg font-semibold text-gray-900">ALICE MARIA AQUINO BEZERRA</h2>
                                    <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                                        <span>61 anos</span>
                                        <span>#124672</span>
                                        <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium">Metastático</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Medical Information Grid */}
                        <div className="grid grid-cols-5 gap-8 text-sm">
                            <div>
                                <div className="text-gray-500 text-xs uppercase tracking-wide">Diagnóstico Inicial</div>
                                <div className="text-gray-900 font-medium">14/06/2020</div>
                            </div>
                            <div>
                                <div className="text-gray-500 text-xs uppercase tracking-wide">Tipo de câncer / Local</div>
                                <div className="text-gray-900 font-medium">Câncer de Mama / Mama esquerda</div>
                            </div>
                            <div>
                                <div className="text-gray-500 text-xs uppercase tracking-wide">Tipo de Tumor</div>
                                <div className="text-gray-900 font-medium">Carcinoma Ductal Invasivo</div>
                            </div>
                            <div>
                                <div className="text-gray-500 text-xs uppercase tracking-wide">Estágio</div>
                                <div className="text-gray-900 font-medium">IV</div>
                            </div>
                            <div>
                                <div className="text-gray-500 text-xs uppercase tracking-wide">Status Menopausal</div>
                                <div className="text-gray-900 font-medium">Pós-menopausa</div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Header;
