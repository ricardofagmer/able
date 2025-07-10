"use client";

import { ChevronDown, LogOut, BarChart3, FileText, Settings, Home } from "lucide-react";
import { Button } from "../ui/button";
import { JSX, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/store/userStore";
import { useAuthModal } from "@/context/AuthModalContext";

const Header = ({ resource }: { resource: string }): JSX.Element => {
    const { openModal } = useAuthModal();

    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const router = useRouter();
    const { account, logout } = useUserStore();
    const [user, setUser] = useState(null);


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
                                    Permissions
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
                                <a href="/dashboard" className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 transition-colors">
                                    <BarChart3 className="w-4 h-4" />
                                    <span className="text-sm font-medium">Dashboard</span>
                                </a>
                                <a href="/report" className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 transition-colors">
                                    <FileText className="w-4 h-4" />
                                    <span className="text-sm font-medium">Reports</span>
                                </a>
                                <a href="/cms" className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 transition-colors">
                                    <Settings className="w-4 h-4" />
                                    <span className="text-sm font-medium">CMS</span>
                                </a>
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
        </>
    );
};

export default Header;
