import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { UserPlus, Eye, EyeOff, ArrowRight, Utensils, Building2, Bike, Check, Sparkles, Shield, ShieldCheck, FileText, Phone, MapPin, AlertTriangle, CheckCircle, Clock, BadgeCheck } from 'lucide-react';
import Logo3D from '../components/Logo3D';

const roles = [
  { id: 'donor', label: 'Donor', emoji: '🎁', desc: 'I want to donate food, clothes, ration & more', icon: Utensils, color: 'primary' },
  { id: 'ngo', label: 'NGO / Organization', emoji: '🏢', desc: 'I receive & distribute donations', icon: Building2, color: 'amber' },
  { id: 'volunteer', label: 'Volunteer', emoji: '🚴', desc: 'I deliver donations to those in need', icon: Bike, color: 'sky' },
  { id: 'influencer', label: 'Influencer', emoji: '🌟', desc: 'I want to collaborate with NGOs & amplify impact', icon: Sparkles, color: 'purple' },
];

// ===== VERIFICATION HELPERS =====
function validateDarpanId(id) {
  // Darpan IDs are like: DL/2017/0123456
  return /^[A-Z]{2}\/\d{4}\/\d{5,9}$/.test(id.trim());
}

function validateRegistrationNo(no) {
  // NGO registration number like: S/12345/2020 or 12345
  return no.trim().length >= 4;
}

function validatePhone(phone) {
  // Indian mobile number
  return /^[6-9]\d{9}$/.test(phone.replace(/\s|-/g, ''));
}

function validateAadhaar(num) {
  // 12-digit Aadhaar
  return /^\d{12}$/.test(num.replace(/\s|-/g, ''));
}

function validatePAN(pan) {
  // PAN format: ABCDE1234F
  return /^[A-Z]{5}\d{4}[A-Z]$/.test(pan.trim().toUpperCase());
}

function maskAadhaar(num) {
  const clean = num.replace(/\s|-/g, '');
  if (clean.length < 8) return clean;
  return 'XXXX-XXXX-' + clean.slice(-4);
}

function maskPAN(pan) {
  if (pan.length < 6) return pan;
  return pan.slice(0, 2) + '****' + pan.slice(-2);
}

export default function Signup() {
  const [step, setStep] = useState(1); // 1 = role, 2 = details, 3 = verification
  const [selectedRole, setSelectedRole] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Verification fields — NGO
  const [darpanId, setDarpanId] = useState('');
  const [registrationNo, setRegistrationNo] = useState('');
  const [foundingYear, setFoundingYear] = useState('');
  const [ngoAddress, setNgoAddress] = useState('');
  const [ngoWebsite, setNgoWebsite] = useState('');
  const [ngoDocument, setNgoDocument] = useState(null);

  // Verification fields — Donor
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpTimer, setOtpTimer] = useState(0);
  const [idType, setIdType] = useState('aadhaar'); // aadhaar or pan
  const [idNumber, setIdNumber] = useState('');
  const [idVerified, setIdVerified] = useState(false);
  const [donorAddress, setDonorAddress] = useState('');

  // Verification running status
  const [verifying, setVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState(null); // 'verified' | 'pending' | 'failed'

  const { signup } = useAuth();
  const navigate = useNavigate();

  // OTP timer countdown
  useEffect(() => {
    if (otpTimer > 0) {
      const t = setTimeout(() => setOtpTimer(otpTimer - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [otpTimer]);

  const needsVerification = selectedRole === 'ngo' || selectedRole === 'donor';
  const totalSteps = needsVerification ? 3 : 2;

  const handleSendOtp = () => {
    if (!validatePhone(phone)) return;
    setOtpSent(true);
    setOtpTimer(30);
    setOtpVerified(false);
  };

  const handleVerifyOtp = () => {
    // Simulate OTP verification — accept any 6-digit OTP
    if (otp.length === 6) {
      setOtpVerified(true);
    }
  };

  const handleVerifyId = () => {
    const clean = idNumber.replace(/\s|-/g, '');
    if (idType === 'aadhaar' && validateAadhaar(clean)) {
      setIdVerified(true);
    } else if (idType === 'pan' && validatePAN(clean)) {
      setIdVerified(true);
    }
  };

  const runVerification = () => {
    setVerifying(true);
    setVerificationResult(null);

    // Simulate a multi-step verification process
    setTimeout(() => {
      if (selectedRole === 'ngo') {
        const darpanValid = validateDarpanId(darpanId);
        const regValid = validateRegistrationNo(registrationNo);
        if (darpanValid && regValid) {
          setVerificationResult('verified');
        } else if (regValid || darpanId.length > 3) {
          setVerificationResult('pending');
        } else {
          setVerificationResult('failed');
        }
      } else {
        // Donor
        if (otpVerified && idVerified) {
          setVerificationResult('verified');
        } else if (otpVerified || idVerified) {
          setVerificationResult('pending');
        } else {
          setVerificationResult('failed');
        }
      }
      setVerifying(false);
    }, 2500);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const actualRole = selectedRole === 'influencer' ? 'donor' : selectedRole;

    const verificationData = {};
    if (selectedRole === 'ngo') {
      verificationData.darpanId = darpanId;
      verificationData.registrationNo = registrationNo;
      verificationData.foundingYear = foundingYear;
      verificationData.ngoAddress = ngoAddress;
      verificationData.website = ngoWebsite;
      verificationData.verificationStatus = verificationResult || 'unverified';
    } else if (selectedRole === 'donor') {
      verificationData.phone = phone;
      verificationData.phoneVerified = otpVerified;
      verificationData.idType = idType;
      verificationData.idVerified = idVerified;
      verificationData.address = donorAddress;
      verificationData.verificationStatus = verificationResult || 'unverified';
    }

    const result = await signup(name, email, password, actualRole, verificationData);
    setLoading(false);
    
    if (result.success) {
      if (selectedRole === 'influencer') {
        navigate('/influencer');
      } else {
        navigate(`/dashboard/${result.user.role}`);
      }
    } else {
      setError(result.error || 'Failed to sign up');
    }
  };

  const canProceedToVerification = name && email && password.length >= 6;

  const getVerificationCompleteness = () => {
    if (selectedRole === 'ngo') {
      let score = 0;
      if (darpanId) score += 30;
      if (validateDarpanId(darpanId)) score += 10;
      if (registrationNo) score += 20;
      if (foundingYear) score += 10;
      if (ngoAddress) score += 15;
      if (ngoDocument) score += 15;
      return Math.min(score, 100);
    } else {
      let score = 0;
      if (phone) score += 15;
      if (otpVerified) score += 30;
      if (idNumber) score += 15;
      if (idVerified) score += 30;
      if (donorAddress) score += 10;
      return Math.min(score, 100);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-900 bg-mesh px-4 pt-16 pb-8">
      <div className="absolute top-20 right-20 w-72 h-72 bg-primary-500/8 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-20 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl" />

      <div className="w-full max-w-md relative z-10 animate-scale-in">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <Logo3D size={40} />
            <span className="font-display font-bold text-2xl text-white">
              Serve<span className="text-primary-400">Zone</span>
            </span>
          </Link>
          <h1 className="font-display text-2xl font-bold text-white mb-2">Join ServeZone</h1>
          <p className="text-sm text-slate-500">
            {step === 1 ? 'Choose your role to get started' : step === 2 ? 'Create your account' : '🛡️ Verify your identity'}
          </p>
        </div>

        {/* Progress */}
        <div className="flex items-center gap-2 mb-6">
          {[...Array(totalSteps)].map((_, i) => (
            <div key={i} className={`flex-1 h-1 rounded-full transition-colors duration-300 ${step >= i + 1 ? 'bg-primary-500' : 'bg-surface-700'}`} />
          ))}
        </div>

        {step === 1 ? (
          /* Step 1: Role Selection */
          <div className="glass-card p-6 sm:p-8">
            <h3 className="font-semibold text-white mb-4">I am a...</h3>
            <div className="space-y-3">
              {roles.map((role) => (
                <button
                  key={role.id}
                  onClick={() => setSelectedRole(role.id)}
                  className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all ${
                    selectedRole === role.id
                      ? 'bg-primary-500/10 border-primary-500/40 shadow-lg shadow-primary-500/10'
                      : 'bg-surface-900/50 border-white/5 hover:border-white/15 hover:bg-surface-800/50'
                  }`}
                >
                  <span className="text-3xl">{role.emoji}</span>
                  <div className="text-left flex-1">
                    <p className="font-medium text-white text-sm">{role.label}</p>
                    <p className="text-xs text-slate-500">{role.desc}</p>
                  </div>
                  {selectedRole === role.id && (
                    <div className="w-6 h-6 rounded-full bg-primary-500 flex items-center justify-center">
                      <Check size={14} className="text-white" />
                    </div>
                  )}
                </button>
              ))}
            </div>
            <button
              onClick={() => selectedRole && setStep(2)}
              disabled={!selectedRole}
              className="btn-primary w-full !py-3.5 mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue <ArrowRight size={18} />
            </button>
          </div>
        ) : step === 2 ? (
          /* Step 2: Account Details */
          <div className="glass-card p-6 sm:p-8 animate-slide-up">
            <div className="flex items-center gap-2 mb-6 px-3 py-2 rounded-lg bg-primary-500/10 border border-primary-500/20">
              <span className="text-lg">{roles.find(r => r.id === selectedRole)?.emoji}</span>
              <span className="text-sm text-primary-400 font-medium">{roles.find(r => r.id === selectedRole)?.label}</span>
              <button onClick={() => setStep(1)} className="ml-auto text-xs text-slate-500 hover:text-white transition-colors">Change</button>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={(e) => {
              e.preventDefault();
              if (needsVerification) {
                setStep(3);
              } else {
                handleSubmit(e);
              }
            }} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1.5">
                  {selectedRole === 'donor' ? 'Your Name / Business Name' : selectedRole === 'ngo' ? 'Organization Name' : selectedRole === 'influencer' ? 'Name / Brand' : 'Full Name'}
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input-field"
                  placeholder={
                    selectedRole === 'donor' ? 'Sharma Kitchen'
                    : selectedRole === 'ngo' ? 'Feeding India Foundation'
                    : selectedRole === 'influencer' ? 'Your Name / Brand'
                    : 'Rahul Verma'
                  }
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1.5">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field"
                  placeholder="your@email.com"
                  required
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
                    placeholder="Min 6 characters"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {/* Password strength */}
                {password && (
                  <div className="flex gap-1 mt-2">
                    <div className={`h-1 flex-1 rounded-full ${password.length >= 2 ? 'bg-rose-500' : 'bg-surface-700'}`} />
                    <div className={`h-1 flex-1 rounded-full ${password.length >= 4 ? 'bg-amber-500' : 'bg-surface-700'}`} />
                    <div className={`h-1 flex-1 rounded-full ${password.length >= 6 ? 'bg-primary-500' : 'bg-surface-700'}`} />
                    <div className={`h-1 flex-1 rounded-full ${password.length >= 8 ? 'bg-primary-400' : 'bg-surface-700'}`} />
                  </div>
                )}
              </div>
              <button
                type="submit"
                disabled={loading || !canProceedToVerification}
                className="btn-primary w-full !py-3.5 mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : needsVerification ? (
                  <>
                    <Shield size={18} /> Continue to Verification <ArrowRight size={16} />
                  </>
                ) : (
                  <>
                    <UserPlus size={18} /> {selectedRole === 'influencer' ? 'Create Account & Continue' : 'Create Account'}
                  </>
                )}
              </button>
            </form>
          </div>
        ) : (
          /* Step 3: Verification */
          <div className="glass-card p-6 sm:p-8 animate-slide-up">
            {/* Verification Header */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/20 flex items-center justify-center">
                <Shield size={20} className="text-amber-400" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-white text-sm">Identity Verification</h3>
                <p className="text-[11px] text-slate-500">
                  {selectedRole === 'ngo' ? 'Verify your NGO is genuine & registered' : 'Verify your identity to build trust'}
                </p>
              </div>
              <button onClick={() => setStep(2)} className="text-xs text-slate-500 hover:text-white transition-colors">← Back</button>
            </div>

            {/* Trust Score Bar */}
            <div className="mb-6 p-3 rounded-xl bg-surface-900/60 border border-white/5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] text-slate-500 font-medium">Trust Score</span>
                <span className={`text-xs font-bold ${getVerificationCompleteness() >= 70 ? 'text-emerald-400' : getVerificationCompleteness() >= 40 ? 'text-amber-400' : 'text-slate-500'}`}>
                  {getVerificationCompleteness()}%
                </span>
              </div>
              <div className="h-1.5 rounded-full bg-surface-700 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${getVerificationCompleteness()}%`,
                    background: getVerificationCompleteness() >= 70
                      ? 'linear-gradient(90deg, #10b981, #34d399)'
                      : getVerificationCompleteness() >= 40
                      ? 'linear-gradient(90deg, #f59e0b, #fbbf24)'
                      : 'linear-gradient(90deg, #64748b, #94a3b8)',
                  }}
                />
              </div>
              <p className="text-[10px] text-slate-600 mt-1.5">
                {getVerificationCompleteness() >= 70 ? '✅ High trust — Verified account' :
                 getVerificationCompleteness() >= 40 ? '⚠️ Partial — Complete all fields for full trust' :
                 '🔒 Add your details to get verified'}
              </p>
            </div>

            {/* ===== NGO VERIFICATION ===== */}
            {selectedRole === 'ngo' && (
              <div className="space-y-4">
                {/* Darpan ID */}
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1.5 flex items-center gap-1.5">
                    <FileText size={13} /> NGO Darpan ID *
                  </label>
                  <input
                    type="text"
                    value={darpanId}
                    onChange={(e) => { setDarpanId(e.target.value.toUpperCase()); setVerificationResult(null); }}
                    className="input-field"
                    placeholder="e.g., DL/2017/0123456"
                  />
                  {darpanId && (
                    <p className={`text-[10px] mt-1 flex items-center gap-1 ${validateDarpanId(darpanId) ? 'text-emerald-400' : 'text-amber-400'}`}>
                      {validateDarpanId(darpanId) ? <><CheckCircle size={10} /> Valid Darpan ID format</> : <><AlertTriangle size={10} /> Format: XX/YYYY/NNNNNNN</>}
                    </p>
                  )}
                </div>

                {/* Registration Number */}
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1.5 flex items-center gap-1.5">
                    <FileText size={13} /> Registration Number *
                  </label>
                  <input
                    type="text"
                    value={registrationNo}
                    onChange={(e) => { setRegistrationNo(e.target.value); setVerificationResult(null); }}
                    className="input-field"
                    placeholder="e.g., S/12345/2020"
                  />
                </div>

                {/* Founding Year + Website */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1.5">Founding Year</label>
                    <select
                      value={foundingYear}
                      onChange={(e) => setFoundingYear(e.target.value)}
                      className="input-field"
                    >
                      <option value="">Select</option>
                      {Array.from({ length: 50 }, (_, i) => 2026 - i).map(y => (
                        <option key={y} value={y}>{y}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1.5">Website</label>
                    <input
                      type="url"
                      value={ngoWebsite}
                      onChange={(e) => setNgoWebsite(e.target.value)}
                      className="input-field"
                      placeholder="https://..."
                    />
                  </div>
                </div>

                {/* Address */}
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1.5 flex items-center gap-1.5">
                    <MapPin size={13} /> Registered Address *
                  </label>
                  <textarea
                    value={ngoAddress}
                    onChange={(e) => setNgoAddress(e.target.value)}
                    className="input-field resize-none h-16"
                    placeholder="Full registered address of the organization"
                  />
                </div>

                {/* Document Upload */}
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1.5 flex items-center gap-1.5">
                    <FileText size={13} /> Upload Registration Certificate
                  </label>
                  <div
                    className={`border-2 border-dashed rounded-xl p-4 text-center transition-colors cursor-pointer ${
                      ngoDocument ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-white/10 hover:border-primary-500/30'
                    }`}
                    onClick={() => {
                      // Simulate file selection
                      setNgoDocument({ name: 'registration_certificate.pdf', size: '2.1 MB' });
                    }}
                  >
                    {ngoDocument ? (
                      <div className="flex items-center justify-center gap-2">
                        <CheckCircle size={16} className="text-emerald-400" />
                        <span className="text-xs text-emerald-400 font-medium">{ngoDocument.name}</span>
                        <span className="text-[10px] text-slate-500">({ngoDocument.size})</span>
                      </div>
                    ) : (
                      <>
                        <FileText size={24} className="text-slate-600 mx-auto mb-1" />
                        <p className="text-xs text-slate-500">Click to upload PDF/Image</p>
                        <p className="text-[10px] text-slate-600">12A, 80G, Registration Certificate</p>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* ===== DONOR VERIFICATION ===== */}
            {selectedRole === 'donor' && (
              <div className="space-y-4">
                {/* Phone Verification */}
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1.5 flex items-center gap-1.5">
                    <Phone size={13} /> Mobile Number *
                  </label>
                  <div className="flex gap-2">
                    <div className="flex items-center gap-1 px-3 py-2.5 rounded-xl bg-surface-900/60 border border-white/5 text-sm text-slate-500">
                      🇮🇳 +91
                    </div>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => { setPhone(e.target.value); setOtpSent(false); setOtpVerified(false); setVerificationResult(null); }}
                      className="input-field flex-1"
                      placeholder="9876543210"
                      maxLength={10}
                      disabled={otpVerified}
                    />
                    {!otpVerified && (
                      <button
                        type="button"
                        onClick={handleSendOtp}
                        disabled={!validatePhone(phone) || otpTimer > 0}
                        className="px-4 py-2.5 rounded-xl text-xs font-semibold transition-all bg-primary-600 text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-primary-500 whitespace-nowrap"
                      >
                        {otpTimer > 0 ? `${otpTimer}s` : otpSent ? 'Resend' : 'Send OTP'}
                      </button>
                    )}
                  </div>
                  {otpVerified && (
                    <p className="text-[10px] mt-1 flex items-center gap-1 text-emerald-400">
                      <ShieldCheck size={10} /> Phone verified successfully
                    </p>
                  )}
                </div>

                {/* OTP Input */}
                {otpSent && !otpVerified && (
                  <div className="p-3 rounded-xl bg-primary-500/5 border border-primary-500/20 animate-slide-up">
                    <label className="block text-xs font-medium text-primary-400 mb-2">Enter 6-digit OTP sent to +91 {phone}</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                        className="input-field flex-1 text-center tracking-[0.5em] font-mono font-bold"
                        placeholder="● ● ● ● ● ●"
                        maxLength={6}
                      />
                      <button
                        type="button"
                        onClick={handleVerifyOtp}
                        disabled={otp.length !== 6}
                        className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-emerald-600 text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-emerald-500 transition-all"
                      >
                        Verify
                      </button>
                    </div>
                    <p className="text-[10px] text-slate-600 mt-1.5">💡 For demo, enter any 6 digits</p>
                  </div>
                )}

                {/* Aadhaar / PAN Verification */}
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1.5 flex items-center gap-1.5">
                    <Shield size={13} /> Identity Proof *
                  </label>
                  <div className="flex gap-2 mb-2">
                    <button
                      type="button"
                      onClick={() => { setIdType('aadhaar'); setIdNumber(''); setIdVerified(false); setVerificationResult(null); }}
                      className={`flex-1 py-2.5 rounded-xl text-xs font-medium flex items-center justify-center gap-1.5 transition-all border ${
                        idType === 'aadhaar' ? 'bg-primary-500/15 border-primary-500/30 text-primary-400' : 'bg-surface-900/50 border-white/5 text-slate-500'
                      }`}
                    >
                      🆔 Aadhaar Card
                    </button>
                    <button
                      type="button"
                      onClick={() => { setIdType('pan'); setIdNumber(''); setIdVerified(false); setVerificationResult(null); }}
                      className={`flex-1 py-2.5 rounded-xl text-xs font-medium flex items-center justify-center gap-1.5 transition-all border ${
                        idType === 'pan' ? 'bg-primary-500/15 border-primary-500/30 text-primary-400' : 'bg-surface-900/50 border-white/5 text-slate-500'
                      }`}
                    >
                      📄 PAN Card
                    </button>
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={idNumber}
                      onChange={(e) => { setIdNumber(e.target.value); setIdVerified(false); setVerificationResult(null); }}
                      className="input-field flex-1"
                      placeholder={idType === 'aadhaar' ? '1234 5678 9012' : 'ABCDE1234F'}
                      maxLength={idType === 'aadhaar' ? 14 : 10}
                      disabled={idVerified}
                    />
                    {!idVerified ? (
                      <button
                        type="button"
                        onClick={handleVerifyId}
                        disabled={idType === 'aadhaar' ? !validateAadhaar(idNumber) : !validatePAN(idNumber)}
                        className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-primary-600 text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-primary-500 transition-all"
                      >
                        Verify
                      </button>
                    ) : (
                      <div className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-emerald-500/15 border border-emerald-500/20 text-emerald-400 flex items-center gap-1">
                        <ShieldCheck size={12} /> Valid
                      </div>
                    )}
                  </div>
                  {idVerified && (
                    <p className="text-[10px] mt-1 flex items-center gap-1 text-emerald-400">
                      <CheckCircle size={10} /> {idType === 'aadhaar' ? 'Aadhaar' : 'PAN'} verified: {idType === 'aadhaar' ? maskAadhaar(idNumber) : maskPAN(idNumber)}
                    </p>
                  )}
                </div>

                {/* Address */}
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1.5 flex items-center gap-1.5">
                    <MapPin size={13} /> Address
                  </label>
                  <input
                    type="text"
                    value={donorAddress}
                    onChange={(e) => setDonorAddress(e.target.value)}
                    className="input-field"
                    placeholder="Your city / locality"
                  />
                </div>
              </div>
            )}

            {/* Verify Button */}
            {!verificationResult && (
              <button
                type="button"
                onClick={runVerification}
                disabled={verifying || getVerificationCompleteness() < 30}
                className="w-full !py-3.5 mt-6 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-white transition-all bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 shadow-lg shadow-amber-500/20 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {verifying ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Verifying...
                  </>
                ) : (
                  <>
                    <Shield size={18} /> Run Verification Check
                  </>
                )}
              </button>
            )}

            {/* Verification Result */}
            {verificationResult && (
              <div className={`mt-6 p-4 rounded-xl border animate-scale-in ${
                verificationResult === 'verified'
                  ? 'bg-emerald-500/10 border-emerald-500/30'
                  : verificationResult === 'pending'
                  ? 'bg-amber-500/10 border-amber-500/30'
                  : 'bg-rose-500/10 border-rose-500/30'
              }`}>
                <div className="flex items-center gap-3 mb-2">
                  {verificationResult === 'verified' ? (
                    <ShieldCheck size={24} className="text-emerald-400" />
                  ) : verificationResult === 'pending' ? (
                    <Clock size={24} className="text-amber-400" />
                  ) : (
                    <AlertTriangle size={24} className="text-rose-400" />
                  )}
                  <div>
                    <p className={`font-semibold text-sm ${
                      verificationResult === 'verified' ? 'text-emerald-400' :
                      verificationResult === 'pending' ? 'text-amber-400' : 'text-rose-400'
                    }`}>
                      {verificationResult === 'verified' ? '✅ Verified — Genuine Account' :
                       verificationResult === 'pending' ? '⏳ Pending Review' :
                       '❌ Verification Failed'}
                    </p>
                    <p className="text-[10px] text-slate-500">
                      {verificationResult === 'verified'
                        ? `${selectedRole === 'ngo' ? 'NGO' : 'Donor'} identity confirmed. You'll get a verified badge ✓`
                        : verificationResult === 'pending'
                        ? 'Some details need manual review. You can still proceed (24-48h review).'
                        : 'Details could not be verified. Please check and re-enter.'}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Create Account (after verification attempt) */}
            {error && (
              <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm animate-scale-in">
                {error}
              </div>
            )}
            {verificationResult && verificationResult !== 'failed' && (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="btn-primary w-full !py-3.5 mt-4"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <BadgeCheck size={18} />
                    Create {verificationResult === 'verified' ? 'Verified' : ''} Account
                  </>
                )}
              </button>
            )}

            {/* Skip for now */}
            {!verificationResult && !verifying && (
              <button
                type="button"
                onClick={() => {
                  setVerificationResult(null);
                  handleSubmit({ preventDefault: () => {} });
                }}
                className="w-full mt-3 py-2 text-xs text-slate-600 hover:text-slate-400 transition-colors text-center"
              >
                Skip verification for now →
              </button>
            )}
          </div>
        )}

        {/* Login link */}
        <p className="text-center text-sm text-slate-500 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-primary-400 hover:text-primary-300 font-medium">
            Sign in <ArrowRight size={12} className="inline" />
          </Link>
        </p>
      </div>
    </div>
  );
}
