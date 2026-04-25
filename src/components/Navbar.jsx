import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useApp } from '../contexts/AppContext';
import { useTheme } from '../contexts/ThemeContext';
import { Menu, X, Bell, LogOut, LayoutDashboard, BarChart3, Sun, Moon, Sparkles, Heart } from 'lucide-react';
import NotificationPanel from './NotificationPanel';
import DonateMoneyModal from './DonateMoneyModal';
import Logo3D from './Logo3D';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const { unreadCount } = useApp();
  const { theme, isDark, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [donateOpen, setDonateOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
    setProfileOpen(false);
  };

  const dashboardPath = user ? `/dashboard/${user.role}` : '/login';

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 nav-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group">
              <Logo3D size={36} />
              <span className="font-display font-bold text-xl text-white">
                Serve<span className="text-primary-400">Zone</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-1">
              <NavLink to="/" active={location.pathname === '/'}>Home</NavLink>
              <NavLink to="/impact" active={location.pathname === '/impact'}>Impact</NavLink>
              <NavLink to="/influencer" active={location.pathname === '/influencer'}>
                <Sparkles size={14} className="inline mr-1" />Influencers
              </NavLink>
              {isAuthenticated && (
                <NavLink to={dashboardPath} active={location.pathname.startsWith('/dashboard')}>
                  Dashboard
                </NavLink>
              )}
              <button
                onClick={() => setDonateOpen(true)}
                className="px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-1.5 transition-all"
                style={{ background: 'linear-gradient(135deg, #f59e0b, #ef4444)', color: '#fff', boxShadow: '0 4px 15px rgba(245,158,11,0.25)' }}
              >
                <Heart size={14} /> Donate ₹
              </button>
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-2">
              {/* Theme Toggle */}
              <button onClick={toggleTheme} className="theme-toggle" title={`Switch to ${isDark ? 'light' : 'dark'} mode`}>
                <div className="theme-toggle-knob">
                  {isDark ? '🌙' : '☀️'}
                </div>
              </button>

              {isAuthenticated ? (
                <>
                  {/* Notifications */}
                  <div className="relative">
                    <button
                      onClick={() => { setNotifOpen(!notifOpen); setProfileOpen(false); }}
                      className="relative p-2 rounded-xl bg-surface-800/50 hover:bg-surface-700 border border-white/5 transition-all"
                    >
                      <Bell size={18} className="text-slate-400" />
                      {unreadCount > 0 && (
                        <span className="notification-dot">{unreadCount}</span>
                      )}
                    </button>
                    {notifOpen && (
                      <div className="absolute right-0 top-12 z-50">
                        <NotificationPanel onClose={() => setNotifOpen(false)} />
                      </div>
                    )}
                  </div>

                  {/* Profile */}
                  <div className="relative">
                    <button
                      onClick={() => { setProfileOpen(!profileOpen); setNotifOpen(false); }}
                      className="flex items-center gap-2 p-1.5 pr-3 rounded-xl bg-surface-800/50 hover:bg-surface-700 border border-white/5 transition-all"
                    >
                      <span className="w-7 h-7 rounded-lg bg-primary-500/20 flex items-center justify-center text-sm">
                        {user?.avatar}
                      </span>
                      <span className="hidden sm:block text-sm text-slate-300 max-w-[120px] truncate">{user?.name}</span>
                    </button>
                    {profileOpen && (
                      <div className="absolute right-0 top-12 w-56 glass-card p-2 animate-slide-down">
                        <div className="px-3 py-2 border-b border-white/5 mb-1">
                          <p className="text-sm font-medium text-white truncate">{user?.name}</p>
                          <p className="text-xs text-slate-500 capitalize">{user?.role}</p>
                        </div>
                        <button
                          onClick={() => { navigate(dashboardPath); setProfileOpen(false); }}
                          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-slate-400 hover:bg-surface-700 hover:text-white transition-colors"
                        >
                          <LayoutDashboard size={14} /> Dashboard
                        </button>
                        <button
                          onClick={() => { navigate('/impact'); setProfileOpen(false); }}
                          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-slate-400 hover:bg-surface-700 hover:text-white transition-colors"
                        >
                          <BarChart3 size={14} /> Impact
                        </button>
                        <button
                          onClick={() => { navigate('/influencer'); setProfileOpen(false); }}
                          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-slate-400 hover:bg-surface-700 hover:text-white transition-colors"
                        >
                          <Sparkles size={14} /> Influencer Collab
                        </button>
                        <hr className="border-white/5 my-1" />
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-rose-400 hover:bg-rose-500/10 transition-colors"
                        >
                          <LogOut size={14} /> Logout
                        </button>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="hidden md:flex items-center gap-2">
                  <Link to="/login" className="btn-secondary text-sm !py-2 !px-4">Login</Link>
                  <Link to="/signup" className="btn-primary text-sm !py-2 !px-4">Get Started</Link>
                </div>
              )}

              {/* Mobile menu */}
              <button
                className="md:hidden p-2 rounded-xl bg-surface-800/50 hover:bg-surface-700 border border-white/5 transition-all"
                onClick={() => setMenuOpen(!menuOpen)}
              >
                {menuOpen ? <X size={18} /> : <Menu size={18} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden bg-surface-900 border-t border-white/5 animate-slide-down">
            <div className="px-4 py-4 space-y-1">
              <MobileLink to="/" onClick={() => setMenuOpen(false)}>Home</MobileLink>
              <MobileLink to="/impact" onClick={() => setMenuOpen(false)}>Impact</MobileLink>
              <MobileLink to="/influencer" onClick={() => setMenuOpen(false)}>🌟 Influencer Collab</MobileLink>
              {isAuthenticated ? (
                <>
                  <MobileLink to={dashboardPath} onClick={() => setMenuOpen(false)}>Dashboard</MobileLink>
                  <button onClick={handleLogout} className="w-full text-left px-4 py-2.5 rounded-xl text-rose-400 hover:bg-rose-500/10 transition-colors">
                    Logout
                  </button>
                </>
              ) : (
                <div className="flex gap-2 pt-2">
                  <Link to="/login" onClick={() => setMenuOpen(false)} className="btn-secondary text-sm flex-1 !py-2">Login</Link>
                  <Link to="/signup" onClick={() => setMenuOpen(false)} className="btn-primary text-sm flex-1 !py-2">Get Started</Link>
                </div>
              )}
              <button
                onClick={() => { setDonateOpen(true); setMenuOpen(false); }}
                className="w-full text-left px-4 py-2.5 rounded-xl font-semibold flex items-center gap-2 transition-colors text-amber-400 hover:bg-amber-500/10"
              >
                ❤️ Donate Money
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Click outside to close dropdowns */}
      {(notifOpen || profileOpen) && (
        <div className="fixed inset-0 z-40" onClick={() => { setNotifOpen(false); setProfileOpen(false); }} />
      )}

      {/* Donate Money Modal */}
      <DonateMoneyModal isOpen={donateOpen} onClose={() => setDonateOpen(false)} />
    </>
  );
}

function NavLink({ to, active, children }) {
  return (
    <Link
      to={to}
      className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
        active
          ? 'bg-primary-500/15 text-primary-400'
          : 'text-slate-400 hover:text-white hover:bg-surface-800'
      }`}
    >
      {children}
    </Link>
  );
}

function MobileLink({ to, onClick, children }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="block px-4 py-2.5 rounded-xl text-slate-300 hover:bg-surface-800 hover:text-white transition-colors"
    >
      {children}
    </Link>
  );
}
