import { Link } from 'react-router-dom';
import { Heart, Github, Twitter, Linkedin, Mail, Sparkles } from 'lucide-react';
import Logo3D from './Logo3D';

export default function Footer() {
  return (
    <footer className="footer-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <Logo3D size={36} />
              <span className="font-display font-bold text-xl text-white">
                Serve<span className="text-primary-400">Zone</span>
              </span>
            </div>
            <p className="text-sm text-slate-500 leading-relaxed">
              Donate anything — food, clothes, ration & more. Connecting surplus with those who need it most.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-white text-sm mb-4">Platform</h4>
            <ul className="space-y-2">
              <FooterLink to="/">Home</FooterLink>
              <FooterLink to="/impact">Impact Dashboard</FooterLink>
              <FooterLink to="/signup">Become a Donor</FooterLink>
              <FooterLink to="/signup">Join as NGO</FooterLink>
              <FooterLink to="/signup">Volunteer</FooterLink>
              <FooterLink to="/influencer">Influencer Collab</FooterLink>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold text-white text-sm mb-4">Donate</h4>
            <ul className="space-y-2">
              <FooterLink to="/signup">🍱 Donate Food</FooterLink>
              <FooterLink to="/signup">👕 Donate Clothes</FooterLink>
              <FooterLink to="/signup">🛒 Donate Ration</FooterLink>
              <FooterLink to="/signup">📚 Donate Books</FooterLink>
              <FooterLink to="/influencer">🌟 Partner as Influencer</FooterLink>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-white text-sm mb-4">Get In Touch</h4>
            <p className="text-sm text-slate-500 mb-3">support@sharethali.app</p>
            <p className="text-sm text-slate-500 mb-4">New Delhi, India</p>
            <div className="flex gap-3">
              <SocialIcon icon={<Twitter size={14} />} />
              <SocialIcon icon={<Github size={14} />} />
              <SocialIcon icon={<Linkedin size={14} />} />
              <SocialIcon icon={<Mail size={14} />} />
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-600">
            © 2026 ServeZone. Built with <Heart size={10} className="inline text-rose-500" /> for a better world.
          </p>
          <p className="text-xs text-slate-600">
            Hackathon Project — Multi-Category Donation Platform
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({ to, children }) {
  return (
    <li>
      <Link to={to} className="text-sm text-slate-500 hover:text-primary-400 transition-colors">
        {children}
      </Link>
    </li>
  );
}

function SocialIcon({ icon }) {
  return (
    <a href="#" className="w-8 h-8 rounded-lg bg-surface-800 border border-white/5 flex items-center justify-center text-slate-500 hover:text-primary-400 hover:border-primary-500/30 transition-all">
      {icon}
    </a>
  );
}
