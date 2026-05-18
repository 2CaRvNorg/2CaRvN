import { useState } from 'react';
import { motion } from 'motion/react';
import { GoogleLogin, CredentialResponse } from '@react-oauth/google';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import logo from '../../imports/2carvn.png';

import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export function Register() {
  const navigate = useNavigate();
  const { register, googleLogin } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [formError, setFormError] = useState('');

  const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
    console.log('[Google OAuth] Google signup success:', credentialResponse);

    const credential = credentialResponse.credential;
    console.log('[Google OAuth] Credential received:', credential ? 'present' : 'missing');

    if (!credential) {
      console.error('[Google OAuth] No credential in response');
      setFormError('Google sign-up failed. Please try again.');
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
        console.log('[Google OAuth] Signup successful, user:', result.user);
        const role = result.user.role;
        if (role === 'admin') navigate('/admin');
        else if (role === 'staff' || role === 'teacher') navigate('/teacher-dashboard');
        else if (role === 'follow_up') navigate('/admin');
        else if (role === 'premium') navigate('/premium-dashboard');
        else navigate('/student-dashboard');
      } else {
        console.error('[Google OAuth] No user in result, full result:', result);
        setFormError('Google signup failed - no user data');
      }
    } catch (err: any) {
      console.error('[Google OAuth] Error during signup:', err);
      console.error('[Google OAuth] Error response:', err.response?.data);
      setFormError(err.message || 'Google sign-up failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    console.error('[Google OAuth] Google signup failed at OAuth level');
    setFormError('Google sign-up failed. Please try again.');
  };

  const handleEmailRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({ name: '', email: '', password: '', confirmPassword: '' });
    setFormError('');

    let hasError = false;
    const newErrors = { name: '', email: '', password: '', confirmPassword: '' };

    if (!formData.name) {
      newErrors.name = 'Name is required';
      hasError = true;
    }
    if (!formData.email) {
      newErrors.email = 'Email is required';
      hasError = true;
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
      hasError = true;
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
      hasError = true;
    } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&_#\-])/.test(formData.password)) {
      newErrors.password = 'Must contain uppercase, lowercase, number & special char (@$!%*?&_#-)';
      hasError = true;
    }
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
      hasError = true;
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
      hasError = true;
    }

    if (hasError) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      await register({ name: formData.name, email: formData.email, password: formData.password });
      // Successfully registered. Navigate to login to sign in.
      navigate('/login');
    } catch (err: any) {
      setFormError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const updateField = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
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
          <h1 className="text-3xl mb-2 text-[#1a1a1a]">Create Account</h1>
          <p className="text-[#757575]">
            Start your learning journey today
          </p>
        </div>

        <div className="bg-white rounded-[24px] p-8 shadow-[0_8px_32px_rgba(0,0,0,0.08)] mb-6">
          {formError ? (
            <div className="mb-4 rounded-2xl border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-900">
              {formError}
            </div>
          ) : null}
          <form onSubmit={handleEmailRegister} className="space-y-4 mb-6">
            <Input
              label="Full Name"
              type="text"
              placeholder="Enter your name"
              value={formData.name}
              onChange={(e) => updateField('name', e.target.value)}
              error={errors.name}
              autoComplete="name"
            />

            <Input
              label="Email"
              type="email"
              placeholder="your@email.com"
              value={formData.email}
              onChange={(e) => updateField('email', e.target.value)}
              error={errors.email}
              autoComplete="email"
            />

            <Input
              label="Password"
              type="password"
              placeholder="Min 8 chars, A-Z, 0-9, @$!%*?&"
              value={formData.password}
              onChange={(e) => updateField('password', e.target.value)}
              error={errors.password}
              autoComplete="new-password"
            />

            <Input
              label="Confirm Password"
              type="password"
              placeholder="Re-enter your password"
              value={formData.confirmPassword}
              onChange={(e) => updateField('confirmPassword', e.target.value)}
              error={errors.confirmPassword}
              autoComplete="new-password"
            />

            <Button
              type="submit"
              size="lg"
              disabled={loading}
              className="w-full"
            >
              {loading ? 'Creating account...' : 'Create Account'}
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
          Already have an account?{' '}
          <button
            onClick={() => navigate('/login')}
            className="text-[#D4AF37] hover:underline"
          >
            Sign In
          </button>
        </p>

        <p className="text-center text-xs text-[#757575] mt-4">
          By signing up, you agree to our Terms & Privacy Policy
        </p>
      </motion.div>
    </div>
  );
}
