import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';
import { authApi } from '../../api/authApi.js';
import { Button } from '../../components/common/Button.js';
import { Input } from '../../components/common/Input.js';

export const RegisterForm: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = (location.state as { from?: string } | null)?.from ?? '/';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password || !firstName || !lastName) {
      setError('Please populate all required information input fields.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Dispatch new registration details natively to the backend
      const result = await authApi.register({
        email,
        password,
        firstName,
        lastName,
      });
      
      // Commit session keys globally to log the user in immediately
      login(result);
      
      // Redirect user to the main shopping dashboard
      navigate(redirectTo, { replace: true });
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please check your data parameters.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl border border-gray-100">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-extrabold pb-4 text-gray-900 tracking-tight">Create Account</h2>
      </div>

      {error && (
        <div className="mb-4 rounded-xl text-center p-4 border border-red-100 text-sm font-medium text-red-600">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="First Name"
            type="text"
            id="firstName"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="First Name"
            required
            disabled={isSubmitting}
          />
          <Input
            label="Last Name"
            type="text"
            id="lastName"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Last Name"
            required
            disabled={isSubmitting}
          />
        </div>

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
          Sign Up
        </Button>
      </form>

      <div className="mt-6 text-center text-sm text-gray-500">
        Already have an account?{' '}
        <Link to="/login" state={location.state} className="font-semibold text-indigo-600 hover:text-indigo-500 transition-colors">
          Sign In
        </Link>
      </div>
    </div>
  );
};
