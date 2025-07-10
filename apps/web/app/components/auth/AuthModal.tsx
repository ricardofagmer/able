'use client';

import {useState} from 'react';
import {Dialog, DialogContent, DialogHeader, DialogTitle} from '../ui/dialog';
import {Button} from '../ui/button';
import {Input} from '../ui/input';
import {Label} from '../ui/label';
import {useAuthModal} from '@/context/AuthModalContext';
import {useUserStore} from '@/store/userStore';
import {userDataAccess} from '@able/data-access';
import {useToast} from '@/hooks/use-toast';

export default function AuthModal() {
    const {modalType, closeModal} = useAuthModal();
    const {setTokens} = useUserStore();
    const {toast} = useToast();
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email.trim()) {
            toast({
                title: 'Erro',
                description: 'Por favor, insira um email válido.',
                variant: 'destructive',
            });
            return;
        }

        setLoading(true);

        try {
            // Check if user exists in database first
            const userExistsResponse = await userDataAccess.checkUserExists(email);

            if (!userExistsResponse) {
                toast({
                    title: 'Erro',
                    description: 'Email não encontrado no sistema.',
                    variant: 'destructive',
                });
                return;
            }

            // If user exists, proceed with login
            const response = {
                accessToken: 'demo-token-' + Date.now(),
                refreshToken: 'demo-refresh-' + Date.now(),
                userId: userExistsResponse.id,
                userEmail: email,
                userName: userExistsResponse.userName,
            };

            if (response.accessToken) {
                // Fetch user permissions


                // Set tokens with permissions to store in localStorage
                setTokens(response.accessToken, response.refreshToken, {
                    id: userExistsResponse.id,
                    email: userExistsResponse.email
                }, userExistsResponse.permissions);

                toast({
                    title: 'Sucesso',
                    description: 'Login realizado com sucesso!',
                });

                closeModal();
                setEmail('');
            }
        } catch (error: any) {
            toast({
                title: 'Erro no login',
                description: error.message || 'Credenciais inválidas. Tente novamente.',
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        closeModal();
        setEmail('');
    };

    return (
        <Dialog open={modalType === 'login'} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Fazer Login</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="Digite seu email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>


                    <div className="flex gap-2 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleClose}
                            className="flex-1"
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            disabled={loading}
                            className="flex-1"
                        >
                            {loading ? 'Verificando...' : 'Entrar'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
