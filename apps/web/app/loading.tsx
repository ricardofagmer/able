'use client'

import React, { useState, useEffect } from 'react';

const AnimatedLogo = () => {
    return (
        <div className="relative w-16 h-16">
            <svg
                viewBox="0 0 100 100"
                className="w-full h-full animate-pulse"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    d="M25 20 Q15 35 20 50 Q25 65 35 75 Q45 85 55 80"
                    stroke="#7DD3FC"
                    strokeWidth="8"
                    fill="none"
                    strokeLinecap="round"
                    className="animate-[draw_2s_ease-in-out_infinite_alternate]"
                    style={{
                        strokeDasharray: '100',
                        strokeDashoffset: '0',
                        animation: 'draw 2s ease-in-out infinite alternate'
                    }}
                />

                <path
                    d="M45 20 Q55 35 50 50 Q45 65 35 75 Q25 85 15 80"
                    stroke="#1E40AF"
                    strokeWidth="8"
                    fill="none"
                    strokeLinecap="round"
                    className="animate-[draw_2s_ease-in-out_infinite_alternate_0.5s]"
                    style={{
                        strokeDasharray: '100',
                        strokeDashoffset: '0',
                        animation: 'draw 2s ease-in-out infinite alternate 0.5s'
                    }}
                />
            </svg>

            <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-blue-400 animate-spin"></div>
        </div>
    );
};

const LoadingComponent = () => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    return 100;
                }
                return prev + Math.random() * 15;
            });
        }, 200);

        return () => clearInterval(interval);
    }, []);


    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            <div className="text-center">
                <div className="mb-8 flex justify-center">
                    <div className="relative">
                        <AnimatedLogo />
                        <div className="absolute inset-0 bg-blue-400 rounded-full opacity-20 animate-ping"></div>
                    </div>
                </div>

                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Loading...</h2>
                    <p className="text-gray-600">Please wait while we prepare your content</p>
                </div>

                <div className="w-64 bg-gray-200 rounded-full h-2 mb-4">
                    <div
                        className="bg-gradient-to-r from-blue-400 to-blue-600 h-2 rounded-full transition-all duration-300 ease-out"
                        style={{ width: `${Math.min(progress, 100)}%` }}
                    ></div>
                </div>

                <div className="text-sm text-gray-500 font-medium">
                    {Math.round(Math.min(progress, 100))}% Complete
                </div>

                <div className="flex justify-center mt-6 space-x-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
            </div>

            <style jsx>{`
        @keyframes draw {
          0% {
            stroke-dasharray: 0 100;
          }
          100% {
            stroke-dasharray: 100 0;
          }
        }
      `}</style>
        </div>
    );
};

export default LoadingComponent;
