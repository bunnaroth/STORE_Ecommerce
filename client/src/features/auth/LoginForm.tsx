import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';
import { authApi } from '../../api/authApi.js';
import { Button } from '../../components/common/Button.js';
import { Input } from '../../components/common/Input.js';

export const LoginForm: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = (location.state as { from?: string } | null)?.from ?? '/';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError('Please populate both email and password input blocks.');
      return;
    }

    try {
      setIsSubmitting(true);
      
      const result = await authApi.login({ email, password });
      
      login(result);
      
      navigate(redirectTo, { replace: true });
    } catch (err: any) {
      setError(err.message || 'Authentication failed: Incorrect email or password.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl border border-gray-100">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Welcome Back</h2>
      </div>

      {error && (
        <div className="mb-4 rounded-xl bg-red-50 p-4 border border-red-100 text-sm font-medium text-red-600 animate-pulse">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          label="Email Address"
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
          disabled={isSubmitting}
        />

        <Input
          label="Password"
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
          disabled={isSubmitting}
        />

        <Button
          type="submit"
          variant="primary"
          className="w-full py-3 text-base font-semibold tracking-wide shadow-md transition-all duration-200 active:scale-95"
          isLoading={isSubmitting}
        >
          Sign In
        </Button>
      </form>

      <div className="mt-6 text-center text-sm text-gray-500">
        Don't have an account yet?{' '}
        <Link to="/register" state={location.state} className="font-semibold text-indigo-600 hover:text-indigo-500 transition-colors">
          Create account
        </Link>
      </div>
    </div>
  );
};
