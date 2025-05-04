
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';

const Register: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [description, setDescription] = useState('');
  const [role, setRole] = useState<'user' | 'vendor'>('user');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const userData = role === 'user' 
        ? { name, email, password } 
        : { name, email, password, description };
      
      await register(userData, role);
      
      // Redirect based on role
      navigate(role === 'user' ? '/' : '/vendor/dashboard');
    } catch (error) {
      console.error('Registration error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto py-12 px-4">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold text-center">Create an account</CardTitle>
              <CardDescription className="text-center">
                Enter your information to create your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="user" className="mb-6" onValueChange={(value) => setRole(value as 'user' | 'vendor')}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="user">Customer</TabsTrigger>
                  <TabsTrigger value="vendor">Vendor</TabsTrigger>
                </TabsList>
                <TabsContent value="user">
                  <p className="text-sm text-muted-foreground mt-2">
                    Register as a customer to shop products from various vendors.
                  </p>
                </TabsContent>
                <TabsContent value="vendor">
                  <p className="text-sm text-muted-foreground mt-2">
                    Register as a vendor to sell your products on SellEra.
                  </p>
                </TabsContent>
              </Tabs>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium">
                    {role === 'user' ? 'Full Name' : 'Business Name'}
                  </label>
                  <Input
                    id="name"
                    placeholder={role === 'user' ? 'John Doe' : 'Your Business Name'}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">
                    Email
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-medium">
                    Password
                  </label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                
                {role === 'vendor' && (
                  <div className="space-y-2">
                    <label htmlFor="description" className="text-sm font-medium">
                      Business Description
                    </label>
                    <Textarea
                      id="description"
                      placeholder="Tell us about your business"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={4}
                      required
                    />
                  </div>
                )}
                
                <Button 
                  type="submit" 
                  className="w-full bg-sellera-purple hover:bg-sellera-purple-dark" 
                  disabled={loading}
                >
                  {loading ? 'Creating account...' : 'Create account'}
                </Button>
              </form>
            </CardContent>
            <CardFooter className="flex flex-col space-y-2">
              <div className="text-center text-sm">
                Already have an account?{' '}
                <Link to="/login" className="text-sellera-purple hover:underline">
                  Sign in
                </Link>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Register;
