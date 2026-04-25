import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LogIn, Eye, EyeOff, ArrowRight, Zap } from 'lucide-react';
import Logo3D from '../components/Logo3D';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    
    const result = await login(email, password);
    setLoading(false);
    
    if (result.success) {
      navigate(`/dashboard/${result.user.role}`);
    } else {
      setError(result.error || 'Failed to login');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-900 bg-mesh px-4 pt-16">
      {/* Decorative orbs */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-primary-500/8 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-sky-500/5 rounded-full blur-3xl" />

      <div className="w-full max-w-md relative z-10 animate-scale-in">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <Logo3D size={40} />
            <span className="font-display font-bold text-2xl text-white">
              Serve<span className="text-primary-400">Zone</span>
            </span>
          </Link>
          <h1 className="font-display text-2xl font-bold text-white mb-2">Welcome Back</h1>
          <p className="text-sm text-slate-500">Sign in to continue saving food and feeding people</p>
        </div>

        {/* Login Form */}
        <div className="glass-card p-6 sm:p-8 mb-6">
          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
                placeholder="your@email.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field pr-10"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full !py-3.5 mt-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <LogIn size={18} /> Sign In
                </>
              )}
            </button>
          </form>
        </div>

        {/* Sign up link */}
        <p className="text-center text-sm text-slate-500 mt-6">
          Don't have an account?{' '}
          <Link to="/signup" className="text-primary-400 hover:text-primary-300 font-medium">
            Sign up free <ArrowRight size={12} className="inline" />
          </Link>
        </p>
      </div>
    </div>
  );
}


