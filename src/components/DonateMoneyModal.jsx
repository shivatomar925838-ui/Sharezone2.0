import { useState, useCallback, useEffect } from 'react';
import { X, IndianRupee, QrCode, Copy, CheckCircle, Heart, Sparkles, Shield, ExternalLink } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import CertificateGenerator from './CertificateGenerator';

// UPI Config — Change these to real values for production
const UPI_CONFIG = {
  id: 'servezone@upi',
  name: 'ServeZone Foundation',
  merchantCode: 'SERVEZONE',
};

// Generate UPI payment URL
function getUpiUrl(amount, note = 'Donation to ServeZone') {
  const params = new URLSearchParams({
    pa: UPI_CONFIG.id,
    pn: UPI_CONFIG.name,
    tn: note,
    cu: 'INR',
  });
  if (amount) params.set('am', amount);
  return `upi://pay?${params.toString()}`;
}

// Generate QR code image URL using a free API
function getQrImageUrl(data, size = 250) {
  return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(data)}&bgcolor=0d0d0f&color=ffffff&margin=8`;
}

const PRESET_AMOUNTS = [
  { value: 51, label: '₹51', tag: '🍱 1 Meal' },
  { value: 101, label: '₹101', tag: '🍱 2 Meals' },
  { value: 251, label: '₹251', tag: '👕 Clothes Kit' },
  { value: 501, label: '₹501', tag: '📚 School Kit' },
  { value: 1001, label: '₹1,001', tag: '🛒 Ration Kit' },
  { value: 2501, label: '₹2,501', tag: '🎁 Full Support' },
];

const CAUSES = [
  { id: 'general', label: '🌍 General Fund', desc: 'Support all causes' },
  { id: 'food', label: '🍱 Feed the Hungry', desc: 'Provide meals to those in need' },
  { id: 'education', label: '📚 Education', desc: 'Books & supplies for children' },
  { id: 'clothing', label: '👕 Clothing Drive', desc: 'Winter clothes & essentials' },
  { id: 'medical', label: '🏥 Medical Aid', desc: 'Healthcare for underprivileged' },
];

export default function DonateMoneyModal({ isOpen, onClose }) {
  const { user } = useAuth();
  const [amount, setAmount] = useState('');
  const [customAmount, setCustomAmount] = useState('');
  const [cause, setCause] = useState('general');
  const [donorName, setDonorName] = useState('');
  const [step, setStep] = useState(1); // 1 = amount, 2 = payment
  const [copied, setCopied] = useState(false);
  const [paymentDone, setPaymentDone] = useState(false);

  useEffect(() => {
    if (user?.name && !donorName) {
      setDonorName(user.name);
    }
  }, [user]);

  const finalAmount = customAmount || amount;
  const upiUrl = getUpiUrl(finalAmount, `Donation: ${CAUSES.find(c => c.id === cause)?.label || 'General'}`);
  const qrUrl = getQrImageUrl(upiUrl);

  const handleCopyUpi = useCallback(() => {
    navigator.clipboard.writeText(UPI_CONFIG.id).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, []);

  const handlePayNow = useCallback(() => {
    // Open UPI app deeplink
    window.open(upiUrl, '_blank');
  }, [upiUrl]);

  const handleDone = () => {
    setPaymentDone(true);
    // Removed auto-close so user has time to download the certificate
  };

  const handleClose = () => {
    setPaymentDone(false);
    setStep(1);
    setAmount('');
    setCustomAmount('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={onClose}>
      <div
        className="w-full max-w-md max-h-[92vh] overflow-y-auto rounded-2xl animate-scale-in"
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'linear-gradient(180deg, #1a1a1d 0%, #141416 100%)',
          border: '1px solid rgba(255,255,255,0.06)',
          boxShadow: '0 25px 80px rgba(0,0,0,0.6), 0 0 60px rgba(250,204,21,0.08)',
        }}
      >
        {/* Header */}
        <div className="relative p-5 pb-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl" style={{ background: 'linear-gradient(90deg, #f59e0b, #ef4444, #8b5cf6)' }} />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, rgba(250,204,21,0.2), rgba(245,158,11,0.2))', border: '1px solid rgba(250,204,21,0.3)' }}>
                <Heart size={20} className="text-amber-400" />
              </div>
              <div>
                <h2 className="font-display font-bold text-white text-base">Donate Money</h2>
                <p className="text-[10px] text-slate-500">100% goes to verified NGOs</p>
              </div>
            </div>
            <button onClick={handleClose} className="p-2 rounded-lg hover:bg-white/5 transition-colors text-slate-500 hover:text-white">
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Success Screen */}
        {paymentDone ? (
          <div className="p-8 text-center animate-scale-in flex flex-col items-center">
            <div className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ background: 'rgba(16,185,129,0.15)', border: '2px solid rgba(16,185,129,0.4)' }}>
              <CheckCircle size={40} className="text-emerald-400" />
            </div>
            <h3 className="font-display text-xl font-bold text-white mb-2">Thank You! 🙏</h3>
            <p className="text-sm text-slate-400 mb-6">Your donation of <span className="text-amber-400 font-bold">₹{finalAmount}</span> is greatly appreciated.</p>
            
            <div className="w-full bg-surface-900/50 p-4 rounded-xl border border-white/5 mb-6">
              <CertificateGenerator 
                donorName={donorName}
                cause={CAUSES.find(c => c.id === cause)?.label || 'General Cause'}
                amount={finalAmount}
                isFood={false}
                date={new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
              />
            </div>

            <button onClick={handleClose} className="text-sm text-slate-500 hover:text-white transition-colors">
              Close Window
            </button>
          </div>
        ) : step === 1 ? (
          /* Step 1: Amount & Cause Selection */
          <div className="p-5 space-y-5">
            {/* Cause Selection */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Choose a Cause</label>
              <div className="grid grid-cols-2 gap-2">
                {CAUSES.map(c => (
                  <button
                    key={c.id}
                    onClick={() => setCause(c.id)}
                    className={`p-3 rounded-xl text-left transition-all border ${
                      cause === c.id
                        ? 'border-amber-500/40 bg-amber-500/10 shadow-lg shadow-amber-500/10'
                        : 'border-white/5 bg-white/[0.02] hover:border-white/15'
                    }`}
                  >
                    <p className="text-xs font-medium text-white">{c.label}</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">{c.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Preset Amounts */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Select Amount</label>
              <div className="grid grid-cols-3 gap-2">
                {PRESET_AMOUNTS.map(preset => (
                  <button
                    key={preset.value}
                    onClick={() => { setAmount(String(preset.value)); setCustomAmount(''); }}
                    className={`p-3 rounded-xl text-center transition-all border group ${
                      amount === String(preset.value) && !customAmount
                        ? 'border-amber-500/40 bg-amber-500/10'
                        : 'border-white/5 bg-white/[0.02] hover:border-amber-500/20'
                    }`}
                  >
                    <p className={`text-base font-bold ${amount === String(preset.value) && !customAmount ? 'text-amber-400' : 'text-white'}`}>
                      {preset.label}
                    </p>
                    <p className="text-[9px] text-slate-500 mt-0.5">{preset.tag}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Amount */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Or Enter Custom Amount</label>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 px-3 py-3 rounded-xl text-lg font-bold text-amber-400" style={{ background: '#1c1c1f', border: '1px solid rgba(255,255,255,0.06)' }}>
                  ₹
                </div>
                <input
                  type="number"
                  value={customAmount}
                  onChange={(e) => { setCustomAmount(e.target.value); setAmount(''); }}
                  className="flex-1 px-4 py-3 rounded-xl text-lg font-bold text-white placeholder-slate-600 focus:outline-none transition-colors"
                  style={{ background: '#1c1c1f', border: '1px solid rgba(255,255,255,0.06)' }}
                  placeholder="Enter amount"
                  min="1"
                />
              </div>
            </div>

            {/* Donor Name (optional) */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Your Name <span className="text-slate-600">(optional)</span></label>
              <input
                type="text"
                value={donorName}
                onChange={(e) => setDonorName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none transition-colors"
                style={{ background: '#1c1c1f', border: '1px solid rgba(255,255,255,0.06)' }}
                placeholder="Anonymous"
              />
            </div>

            {/* Proceed Button */}
            <button
              onClick={() => setStep(2)}
              disabled={!finalAmount || Number(finalAmount) < 1}
              className="w-full py-3.5 rounded-xl font-semibold text-white flex items-center justify-center gap-2 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              style={{
                background: 'linear-gradient(135deg, #f59e0b, #ef4444)',
                boxShadow: finalAmount ? '0 8px 25px rgba(245,158,11,0.3)' : 'none',
              }}
            >
              <IndianRupee size={18} />
              {finalAmount ? `Donate ₹${Number(finalAmount).toLocaleString()}` : 'Select an Amount'}
            </button>

            {/* Security */}
            <div className="flex items-center justify-center gap-2 text-[10px] text-slate-600">
              <Shield size={10} /> Secured • 100% to NGOs • Tax benefits under 80G
            </div>
          </div>
        ) : (
          /* Step 2: Payment via QR / UPI */
          <div className="p-5 space-y-5">
            {/* Amount Summary */}
            <div className="p-4 rounded-xl text-center" style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)' }}>
              <p className="text-xs text-slate-500 mb-1">You're donating</p>
              <p className="text-3xl font-bold text-amber-400 flex items-center justify-center gap-1">
                <IndianRupee size={24} />{Number(finalAmount).toLocaleString()}
              </p>
              <p className="text-[10px] text-slate-500 mt-1">
                to {CAUSES.find(c => c.id === cause)?.label} {donorName ? `• by ${donorName}` : '• Anonymous'}
              </p>
            </div>

            {/* QR Code */}
            <div className="text-center">
              <div className="inline-block p-4 rounded-2xl" style={{ background: '#fff' }}>
                <img
                  src={qrUrl}
                  alt="UPI QR Code"
                  className="w-48 h-48 mx-auto"
                  style={{ imageRendering: 'pixelated' }}
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
                <div className="w-48 h-48 items-center justify-center hidden" style={{ background: '#f3f4f6', borderRadius: '8px' }}>
                  <div className="text-center">
                    <QrCode size={48} className="text-gray-400 mx-auto mb-2" />
                    <p className="text-xs text-gray-500">Scan with any UPI app</p>
                  </div>
                </div>
              </div>
              <p className="text-[10px] text-slate-500 mt-2">Scan with any UPI app (GPay, PhonePe, Paytm)</p>
            </div>

            {/* UPI ID */}
            <div className="p-3 rounded-xl flex items-center gap-3" style={{ background: '#1c1c1f', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="flex-1">
                <p className="text-[10px] text-slate-500 mb-0.5">UPI ID</p>
                <p className="text-sm font-mono font-bold text-white">{UPI_CONFIG.id}</p>
              </div>
              <button
                onClick={handleCopyUpi}
                className="px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all"
                style={{
                  background: copied ? 'rgba(16,185,129,0.15)' : 'rgba(245,158,11,0.1)',
                  border: copied ? '1px solid rgba(16,185,129,0.3)' : '1px solid rgba(245,158,11,0.2)',
                  color: copied ? '#34d399' : '#fbbf24',
                }}
              >
                {copied ? <><CheckCircle size={12} /> Copied!</> : <><Copy size={12} /> Copy</>}
              </button>
            </div>

            {/* Pay via UPI App button */}
            <button
              onClick={handlePayNow}
              className="w-full py-3.5 rounded-xl font-semibold text-white flex items-center justify-center gap-2 transition-all"
              style={{
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                boxShadow: '0 8px 25px rgba(99,102,241,0.3)',
              }}
            >
              <ExternalLink size={16} /> Pay ₹{Number(finalAmount).toLocaleString()} via UPI App
            </button>

            {/* Supported Apps */}
            <div className="flex items-center justify-center gap-4 py-2">
              {['GPay', 'PhonePe', 'Paytm', 'BHIM'].map(app => (
                <span key={app} className="text-[10px] text-slate-500 px-2 py-1 rounded-lg" style={{ background: '#1c1c1f', border: '1px solid rgba(255,255,255,0.04)' }}>
                  {app}
                </span>
              ))}
            </div>

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.06)' }} />
              <span className="text-[10px] text-slate-600">after payment</span>
              <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.06)' }} />
            </div>

            {/* Done buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => setStep(1)}
                className="flex-1 py-3 rounded-xl text-sm font-medium text-slate-400 transition-all hover:text-white"
                style={{ background: '#1c1c1f', border: '1px solid rgba(255,255,255,0.06)' }}
              >
                ← Back
              </button>
              <button
                onClick={handleDone}
                className="flex-1 py-3 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2 transition-all"
                style={{
                  background: 'linear-gradient(135deg, #10b981, #059669)',
                  boxShadow: '0 8px 25px rgba(16,185,129,0.2)',
                }}
              >
                <CheckCircle size={16} /> I've Paid
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
