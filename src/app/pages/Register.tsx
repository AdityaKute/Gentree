import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { TreePine, Check, X } from 'lucide-react';
import { useAuth } from '../store/useAuthStore';

const API_BASE = import.meta.env.VITE_API_BASE_URL as string;

export function Register() {
  const navigate = useNavigate();
  const auth = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
  });
  const [errors, setErrors] = useState<{
    email?: string;
    username?: string;
    password?: string;
  }>({});
  const [serverError, setServerError] = useState('');

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateUsername = (username: string) => {
    const usernameRegex = /^[a-zA-Z0-9]{5,15}$/;
    return usernameRegex.test(username);
  };

  const validatePassword = (password: string) => {
    const passwordRegex = /^[a-zA-Z0-9]{6,}$/;
    return passwordRegex.test(password);
  };

  useEffect(() => {
    if (auth.isAuthenticated) {
      navigate('/');
    }
  }, [auth.isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: typeof errors = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!formData.username) {
      newErrors.username = 'Username is required';
    } else if (!validateUsername(formData.username)) {
      newErrors.username = 'Username must be 5-15 alphanumeric characters';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (!validatePassword(formData.password)) {
      newErrors.password = 'Password must be at least 6 alphanumeric characters';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setServerError('');
    try {
      const response = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          username: formData.username,
          password: formData.password,
        }),
      });

      if (!response.ok) {
        const message = await response.text();
        setServerError(message || 'Registration failed.');
        return;
      }

      navigate('/login');
    } catch (error) {
      setServerError('Unable to connect to the server.');
    }
  };

  const getInputState = (field: keyof typeof formData) => {
    const value = formData[field];
    if (!value) return 'default';
    
    let isValid = false;
    if (field === 'email') isValid = validateEmail(value);
    if (field === 'username') isValid = validateUsername(value);
    if (field === 'password') isValid = validatePassword(value);
    
    return isValid ? 'success' : 'error';
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8" style={{ backgroundColor: '#FDF5E6' }}>
      <Card className="w-full max-w-md border-[#2D5A27]/20 shadow-lg">
        <CardHeader className="text-center space-y-2">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#2D5A27] to-[#4A7C59] flex items-center justify-center">
              <TreePine className="w-8 h-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-[#2D5A27]">Create Account</CardTitle>
          <CardDescription>Join GenTree to start building your family tree</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {serverError && (
              <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                {serverError}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={(e) => {
                    setFormData({ ...formData, email: e.target.value });
                    setErrors((prev) => ({ ...prev, email: undefined }));
                  }}
                  className={
                    getInputState('email') === 'error'
                      ? 'border-destructive pr-10'
                      : getInputState('email') === 'success'
                      ? 'border-[#6BA368] pr-10'
                      : 'pr-10'
                  }
                />
                {formData.email && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    {getInputState('email') === 'success' ? (
                      <Check className="w-4 h-4 text-[#6BA368]" />
                    ) : getInputState('email') === 'error' ? (
                      <X className="w-4 h-4 text-destructive" />
                    ) : null}
                  </div>
                )}
              </div>
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <div className="relative">
                <Input
                  id="username"
                  type="text"
                  placeholder="username123"
                  value={formData.username}
                  onChange={(e) => {
                    setFormData({ ...formData, username: e.target.value });
                    setErrors((prev) => ({ ...prev, username: undefined }));
                  }}
                  className={
                    getInputState('username') === 'error'
                      ? 'border-destructive pr-10'
                      : getInputState('username') === 'success'
                      ? 'border-[#6BA368] pr-10'
                      : 'pr-10'
                  }
                />
                {formData.username && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    {getInputState('username') === 'success' ? (
                      <Check className="w-4 h-4 text-[#6BA368]" />
                    ) : getInputState('username') === 'error' ? (
                      <X className="w-4 h-4 text-destructive" />
                    ) : null}
                  </div>
                )}
              </div>
              {errors.username && (
                <p className="text-sm text-destructive">{errors.username}</p>
              )}
              <p className="text-xs text-muted-foreground">
                5-15 alphanumeric characters
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => {
                    setFormData({ ...formData, password: e.target.value });
                    setErrors((prev) => ({ ...prev, password: undefined }));
                  }}
                  className={
                    getInputState('password') === 'error'
                      ? 'border-destructive pr-10'
                      : getInputState('password') === 'success'
                      ? 'border-[#6BA368] pr-10'
                      : 'pr-10'
                  }
                />
                {formData.password && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    {getInputState('password') === 'success' ? (
                      <Check className="w-4 h-4 text-[#6BA368]" />
                    ) : getInputState('password') === 'error' ? (
                      <X className="w-4 h-4 text-destructive" />
                    ) : null}
                  </div>
                )}
              </div>
              {errors.password && (
                <p className="text-sm text-destructive">{errors.password}</p>
              )}
              <p className="text-xs text-muted-foreground">
                Minimum 6 alphanumeric characters
              </p>
            </div>

            <Button type="submit" className="w-full bg-[#2D5A27] hover:bg-[#4A7C59]">
              Register
            </Button>

            <div className="text-center text-sm">
              <span className="text-muted-foreground">Already have an account? </span>
              <Link to="/login" className="text-[#2D5A27] hover:underline font-medium">
                Login here
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
