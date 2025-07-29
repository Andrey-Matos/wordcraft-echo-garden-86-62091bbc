
import React, { useState } from 'react';
import { BookOpenIcon, UserIcon, LogOutIcon } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

export const Header = () => {
  const { isAuthenticated, user, login, register, logout, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Auth submit:', { isLogin, email, isAuthenticated });
    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await register(email, password);
      }
      setIsOpen(false);
      setEmail('');
      setPassword('');
    } catch (error) {
      console.error('Auth error:', error);
    }
  };

  return (
    <header className="bg-neologism-primary text-white py-4 px-6 md:px-8">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <BookOpenIcon className="h-6 w-6 text-neologism-accent" />
          <h1 className="text-xl md:text-2xl font-display font-bold">Neologisms</h1>
        </div>
        
        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-neologism-accent">Welcome, {user?.email}</span>
              <Button
                onClick={logout}
                variant="ghost"
                size="sm"
                className="text-white hover:text-neologism-accent"
              >
                <LogOutIcon className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="sm" className="text-white hover:text-neologism-accent">
                  <UserIcon className="h-4 w-4 mr-2" />
                  Sign In
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{isLogin ? 'Sign In' : 'Sign Up'}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <Input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <Input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? 'Loading...' : (isLogin ? 'Sign In' : 'Sign Up')}
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setIsLogin(!isLogin)}
                    className="w-full"
                  >
                    {isLogin ? 'Need an account? Sign up' : 'Have an account? Sign in'}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>
    </header>
  );
};
