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
                title: 'Error',
                description: 'Please enter a valid email.',
                variant: 'destructive',
            });
            return;
        }

        setLoading(true);

        try {
            const userExistsResponse = await userDataAccess.checkUserExists(email);

            if (!userExistsResponse) {
                toast({
                    title: 'Error',
                    description: 'Email not found in the system.',
                    variant: 'destructive',
                });
                return;
            }

            const response = {
                accessToken: 'demo-token-' + Date.now(),
                refreshToken: 'demo-refresh-' + Date.now(),
                userId: userExistsResponse.id,
                userEmail: email,
                userName: userExistsResponse.userName,
            };

            if (response.accessToken) {

                setTokens(response.accessToken, response.refreshToken, {
                    id: userExistsResponse.id,
                    email: userExistsResponse.email
                }, userExistsResponse.permissions);

                toast({
                    title: 'Success',
                    description: 'Login successful!',
                });

                closeModal();
                setEmail('');
            }
        } catch (error: any) {
            toast({
                title: 'Login error',
                description: error.message || 'Invalid credentials. Please try again.',
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
                    <DialogTitle>Login</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="Enter your email"
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
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={loading}
                            className="flex-1"
                        >
                            {loading ? 'Verifying...' : 'Sign In'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
