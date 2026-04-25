import React, { useRef } from 'react';
import { toPng } from 'html-to-image';
import download from 'downloadjs';
import { Download } from 'lucide-react';

export default function CertificateGenerator({ donorName, cause, amount, isFood, date }) {
  const certificateRef = useRef(null);

  const handleDownload = async () => {
    if (!certificateRef.current) return;
    try {
      const dataUrl = await toPng(certificateRef.current, { 
        quality: 1.0, 
        pixelRatio: 3, // High resolution for printing
        backgroundColor: '#ffffff'
      });
      download(dataUrl, `ServeZone-Certificate-${donorName || 'Donor'}.png`);
    } catch (err) {
      console.error('Failed to generate certificate', err);
    }
  };

  return (
    <div className="flex flex-col items-center w-full">
      {/* Hidden Certificate Canvas */}
      <div className="overflow-hidden h-0 w-0 absolute opacity-0 pointer-events-none">
        <div 
          ref={certificateRef}
          className="w-[1000px] h-[750px] bg-white relative overflow-hidden"
          style={{ fontFamily: '"Times New Roman", Times, serif' }}
        >
          {/* Top Left Gold Wave Pattern (SVG approximation) */}
          <svg className="absolute top-0 left-0 w-64 h-64 opacity-50" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0,0 L0,150 Q50,100 100,150 T200,50 L200,0 Z" stroke="#D4AF37" strokeWidth="0.5" fill="transparent" />
            <path d="M0,0 L0,130 Q40,90 90,140 T190,40 L190,0 Z" stroke="#D4AF37" strokeWidth="0.5" fill="transparent" />
            <path d="M0,0 L0,110 Q30,80 80,130 T180,30 L180,0 Z" stroke="#D4AF37" strokeWidth="0.5" fill="transparent" />
            <path d="M0,0 L0,90 Q20,70 70,120 T170,20 L170,0 Z" stroke="#D4AF37" strokeWidth="0.5" fill="transparent" />
            <path d="M0,0 L0,70 Q10,60 60,110 T160,10 L160,0 Z" stroke="#D4AF37" strokeWidth="0.5" fill="transparent" />
          </svg>

          {/* Bottom Right Gold Wave Pattern (SVG approximation) */}
          <svg className="absolute bottom-0 right-0 w-80 h-80 opacity-50 transform rotate-180" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0,0 L0,150 Q50,100 100,150 T200,50 L200,0 Z" stroke="#D4AF37" strokeWidth="0.5" fill="transparent" />
            <path d="M0,0 L0,130 Q40,90 90,140 T190,40 L190,0 Z" stroke="#D4AF37" strokeWidth="0.5" fill="transparent" />
            <path d="M0,0 L0,110 Q30,80 80,130 T180,30 L180,0 Z" stroke="#D4AF37" strokeWidth="0.5" fill="transparent" />
            <path d="M0,0 L0,90 Q20,70 70,120 T170,20 L170,0 Z" stroke="#D4AF37" strokeWidth="0.5" fill="transparent" />
            <path d="M0,0 L0,70 Q10,60 60,110 T160,10 L160,0 Z" stroke="#D4AF37" strokeWidth="0.5" fill="transparent" />
          </svg>

          {/* Main Content Container */}
          <div className="absolute inset-0 flex flex-col items-center justify-center p-16 z-10">
            
            {/* Header */}
            <div className="text-center mb-10">
              <h1 className="text-6xl font-bold text-gray-800 tracking-widest mb-2" style={{ letterSpacing: '0.15em' }}>
                CERTIFICATE
              </h1>
              <h2 className="text-2xl font-medium tracking-widest uppercase" style={{ color: '#D4AF37', letterSpacing: '0.2em' }}>
                OF APPRECIATION
              </h2>
            </div>

            {/* Sub-header */}
            <p className="text-sm text-gray-600 tracking-widest uppercase mb-12">
              THE FOLLOWING AWARD IS GIVEN TO
            </p>

            {/* Name Section */}
            <div className="w-full max-w-2xl text-center mb-8">
              <h2 className="text-5xl font-medium text-gray-800 mb-2" style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}>
                {donorName || 'Generous Hero'}
              </h2>
              <div className="w-full h-px mx-auto flex items-center justify-center">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#D4AF37' }}></div>
                <div className="h-px w-full" style={{ backgroundColor: '#D4AF37' }}></div>
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#D4AF37' }}></div>
              </div>
            </div>

            {/* Description */}
            <p className="text-lg text-gray-700 text-center max-w-3xl mb-8">
              This certificate is presented in recognition and appreciation of your contribution to
            </p>

            {/* Cause / Amount */}
            <div className="w-full max-w-xl text-center mb-20">
              <p className="text-2xl font-medium text-gray-800 mb-2">
                {isFood ? <span style={{ color: '#D4AF37' }}>{amount}</span> : <span style={{ color: '#D4AF37' }}>₹{amount}</span>} for {cause}
              </p>
              <div className="w-full h-px mx-auto" style={{ backgroundColor: '#D4AF37' }}></div>
            </div>

            {/* Footer Signatures */}
            <div className="w-full max-w-4xl flex justify-between items-end px-10 absolute bottom-16">
              {/* Date */}
              <div className="text-center w-48">
                <div className="w-full h-px mb-2" style={{ backgroundColor: '#D4AF37' }}></div>
                <div className="text-xl text-gray-800 mb-1">{date}</div>
                <p className="text-sm text-gray-500" style={{ color: '#D4AF37' }}>Date</p>
              </div>

              {/* Gold Seal */}
              <div className="relative flex flex-col items-center translate-y-6">
                <div className="w-28 h-28 rounded-full shadow-lg flex items-center justify-center relative z-10" 
                     style={{ 
                       background: 'radial-gradient(ellipse farthest-corner at right bottom, #FEDB37 0%, #FDB931 8%, #9f7928 30%, #8A6E2F 40%, transparent 80%), radial-gradient(ellipse farthest-corner at left top, #FFFFFF 0%, #FFFFAC 8%, #D1B464 25%, #5d4a1f 62.5%, #5d4a1f 100%)',
                       border: '4px solid #FDB931'
                     }}>
                  <div className="w-20 h-20 rounded-full border-2 border-yellow-700/30 flex items-center justify-center">
                    <div className="text-center">
                      <span className="block text-yellow-900 font-bold text-xs" style={{ letterSpacing: '2px' }}>SERVE</span>
                      <span className="block text-yellow-900 font-bold text-xs" style={{ letterSpacing: '2px' }}>ZONE</span>
                    </div>
                  </div>
                </div>
                {/* Ribbons */}
                <div className="absolute top-20 flex gap-1 z-0">
                  <div className="w-8 h-16 bg-yellow-600 transform rotate-[15deg] origin-top translate-x-3 clip-ribbon" 
                       style={{ background: 'linear-gradient(to bottom, #D1B464, #9f7928)' }}></div>
                  <div className="w-8 h-16 bg-yellow-600 transform -rotate-[15deg] origin-top -translate-x-3 clip-ribbon"
                       style={{ background: 'linear-gradient(to bottom, #D1B464, #9f7928)' }}></div>
                </div>
              </div>

              {/* Signature */}
              <div className="text-center w-48">
                <div className="w-full h-px mb-2" style={{ backgroundColor: '#D4AF37' }}></div>
                <div className="text-2xl text-gray-800 mb-1" style={{ fontFamily: 'cursive' }}>ServeZone</div>
                <p className="text-sm text-gray-500" style={{ color: '#D4AF37' }}>Signature</p>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Visible Button */}
      <button 
        onClick={handleDownload}
        className="w-full py-3.5 rounded-xl font-bold text-emerald-950 flex items-center justify-center gap-2 transition-all mt-4 shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 hover:-translate-y-0.5"
        style={{
          background: 'linear-gradient(135deg, #34d399, #10b981)',
        }}
      >
        <Download size={18} /> Download Official Certificate
      </button>

      {/* Tailwind arbitrary utilities for the ribbon */}
      <style dangerouslySetInnerHTML={{__html: `
        .clip-ribbon {
          clip-path: polygon(0 0, 100% 0, 100% 100%, 50% 80%, 0 100%);
        }
      `}} />
    </div>
  );
}
