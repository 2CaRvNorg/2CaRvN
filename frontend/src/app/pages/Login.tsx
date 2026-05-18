import { useState } from 'react';
import { motion } from 'motion/react';
import { GoogleLogin, CredentialResponse } from '@react-oauth/google';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import logo from '../../imports/2carvn.png';

import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export function Login() {
  const navigate = useNavigate();
  const { login, googleLogin } = useAuth();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState('');
  const [errors, setErrors] = useState({ email: '', password: '' });

  const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
    console.log('[Google OAuth] Google login success:', credentialResponse);

    const credential = credentialResponse.credential;
    console.log('[Google OAuth] Credential received:', credential ? 'present' : 'missing');

    if (!credential) {
      console.error('[Google OAuth] No credential in response');
      setFormError('Google sign-in failed. Please try again.');
      return;
    }

    setLoading(true);
    setFormError('');

    try {
      console.log('[Google OAuth] Calling googleLogin API...');
      const result = await googleLogin(credential);
      console.log('[Google OAuth] API response received:', result);
      console.log('[Google OAuth] Result success:', result.success);
      console.log('[Google OAuth] Result message:', result.message);
      console.log('[Google OAuth] Result user:', result.user);

      if (result.user) {
        console.log('[Google OAuth] Login successful, user:', result.user);
        const role = result.user.role;
        if (role === 'admin') navigate('/admin');
        else if (role === 'staff' || role === 'teacher') navigate('/teacher-dashboard');
        else if (role === 'follow_up') navigate('/admin');
        else if (role === 'premium') navigate('/premium-dashboard');
        else navigate('/student-dashboard');
      } else {
        console.error('[Google OAuth] No user in result, full result:', result);
        setFormError('Google login failed - no user data');
      }
    } catch (err: any) {
      console.error('[Google OAuth] Error during login:', err);
      console.error('[Google OAuth] Error response:', err.response?.data);
      setFormError(err.message || 'Google login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    console.error('[Google OAuth] Google login failed at OAuth level');
    setFormError('Google sign-in failed. Please try again.');
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({ email: '', password: '' });

    if (!email) {
      setErrors(prev => ({ ...prev, email: 'Email is required' }));
      return;
    }
    if (!password) {
      setErrors(prev => ({ ...prev, password: 'Password is required' }));
      return;
    }

    setLoading(true);
    setFormError('');

    try {
      const response = await login({ email, password });
      if (response.user) {
        const role = response.user.role;
        if (role === 'admin') navigate('/admin');
        else if (role === 'staff' || role === 'teacher') navigate('/teacher-dashboard');
        else if (role === 'follow_up') navigate('/admin');
        else if (role === 'premium') navigate('/premium-dashboard');
        else navigate('/student-dashboard');
      }
    } catch (err: any) {
      const message = err.message || 'Login failed';
      const attempts = typeof err.attemptsRemaining === 'number' ? err.attemptsRemaining : null;
      const lockErrorCode = err.error?.code;
      const retryAfter = err.error?.retryAfter;

      if (lockErrorCode === 'ACCOUNT_LOCKED' && retryAfter) {
        setFormError(`Account locked. Try again in ${Math.ceil(retryAfter / 60)} minutes.`);
      } else if (attempts !== null) {
        setFormError(`Invalid password. ${attempts} attempt${attempts === 1 ? '' : 's'} remaining.`);
      } else {
        setFormError(message);
      }

      setErrors(prev => ({ ...prev, password: message }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FBF9F4] to-[#f5f1e8] flex items-center justify-center px-6 py-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <img src={logo} alt="2CaRvN" className="w-48 mx-auto mb-6" />
          <h1 className="text-3xl mb-2 text-[#1a1a1a]">Welcome Back</h1>
          <p className="text-[#757575]">
            Sign in to continue your learning journey
          </p>
        </div>

        <div className="bg-white rounded-[24px] p-8 shadow-[0_8px_32px_rgba(0,0,0,0.08)] mb-6">
          {formError ? (
            <div className="mb-4 rounded-2xl border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-900">
              {formError}
            </div>
          ) : null}
          <form onSubmit={handleEmailLogin} className="space-y-4 mb-6">
            <Input
              label="Email"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
              autoComplete="email"
            />

            <Input
              label="Password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={errors.password}
              autoComplete="current-password"
            />

            <div className="flex justify-end">
              <button
                type="button"
                className="text-sm text-[#D4AF37] hover:underline"
              >
                Forgot password?
              </button>
            </div>

            <Button
              type="submit"
              size="lg"
              disabled={loading}
              className="w-full"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#e8e4dc]"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-[#757575]">Or continue with</span>
            </div>
          </div>

          <div className="w-full">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              theme="outline"
              size="large"
              text="continue_with"
              shape="rectangular"
              width="100%"
              locale="en"
            />
          </div>
        </div>

        <p className="text-center text-sm text-[#757575]">
          Don't have an account?{' '}
          <button
            onClick={() => navigate('/register')}
            className="text-[#D4AF37] hover:underline"
          >
            Sign Up
          </button>
        </p>
      </motion.div>
    </div>
  );
}
