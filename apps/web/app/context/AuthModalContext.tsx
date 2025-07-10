'use client';

import { createContext, useContext, useState } from 'react';

type ModalType = 'login' | 'signup' | 'forgot' | 'reset' | 'confirm' | null;

type AuthModalContextType = {
    modalType: ModalType;
    openModal: (type: ModalType) => void;
    closeModal: () => void;
};

const AuthModalContext = createContext<AuthModalContextType | undefined>(undefined);

export const AuthModalProvider = ({ children }: { children: React.ReactNode }) => {
    const [modalType, setModalType] = useState<ModalType>(null);

    const openModal = (type: ModalType) => setModalType(type);
    const closeModal = () => setModalType(null);

    return (
        <AuthModalContext.Provider value={{ modalType, openModal, closeModal }}>
            {children}
        </AuthModalContext.Provider>
    );
};

export const useAuthModal = () => {
    const context = useContext(AuthModalContext);
   if (!context) {
    throw new Error('useAuthModal must be used within AuthModalProvider');
  }return context;
};