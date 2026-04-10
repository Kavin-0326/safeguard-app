import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { ShieldAlert, Lock } from 'lucide-react';
import { motion } from 'motion/react';

interface LoginProps {
  onLogin: (user: string) => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple mock login
    if (email && password) {
      onLogin(email.split('@')[0]);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#E4E3E0] p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="w-full max-w-md border-2 border-[#141414] shadow-[8px_8px_0px_0px_rgba(20,20,20,1)]">
          <CardHeader className="space-y-1 text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-[#141414] rounded-full">
                <ShieldAlert className="w-8 h-8 text-[#E4E3E0]" />
              </div>
            </div>
            <CardTitle className="text-3xl font-bold tracking-tighter">SafeGuard AI</CardTitle>
            <CardDescription className="text-[#141414]/60 font-medium italic">
              Industrial Safety Risk Assessment Portal
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-xs uppercase tracking-widest font-bold">Work Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border-2 border-[#141414] focus-visible:ring-0 focus-visible:ring-offset-0 rounded-none"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-xs uppercase tracking-widest font-bold">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="border-2 border-[#141414] focus-visible:ring-0 focus-visible:ring-offset-0 rounded-none pl-10"
                    required
                  />
                  <Lock className="absolute left-3 top-2.5 h-5 w-5 text-[#141414]/40" />
                </div>
              </div>
              <Button type="submit" className="w-full bg-[#141414] text-[#E4E3E0] hover:bg-[#141414]/90 rounded-none h-12 font-bold uppercase tracking-widest">
                Access Dashboard
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2 text-center text-xs text-[#141414]/60">
            <p>Authorized Personnel Only</p>
            <p>© 2026 SafeGuard Industrial Systems</p>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}
