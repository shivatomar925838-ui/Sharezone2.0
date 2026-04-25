import { useState, useEffect, useCallback, createContext, useContext } from 'react';
import { Volume2, VolumeX, Mic } from 'lucide-react';

// ===== Voice Context =====
const VoiceContext = createContext(null);

export function useVoice() {
  const context = useContext(VoiceContext);
  if (!context) {
    return { speak: () => {}, voiceEnabled: false };
  }
  return context;
}

export function VoiceProvider({ children }) {
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [lastMessage, setLastMessage] = useState('');

  const speak = useCallback((text) => {
    if (!voiceEnabled) return;
    if (!window.speechSynthesis) return;

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.05;
    utterance.volume = 0.9;

    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(v =>
      v.name.includes('Google') && v.lang.startsWith('en')
    ) || voices.find(v =>
      v.lang.startsWith('en') && v.name.includes('Female')
    ) || voices.find(v =>
      v.lang.startsWith('en')
    );

    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setLastMessage(text);
    window.speechSynthesis.speak(utterance);
  }, [voiceEnabled]);

  const toggleVoice = useCallback(() => {
    setVoiceEnabled(prev => {
      const newVal = !prev;
      if (newVal) {
        setTimeout(() => {
          if (window.speechSynthesis) {
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance('Voice assistant activated. I will keep you updated on your food donations.');
            utterance.rate = 1.0;
            utterance.pitch = 1.05;
            const voices = window.speechSynthesis.getVoices();
            const preferredVoice = voices.find(v =>
              v.name.includes('Google') && v.lang.startsWith('en')
            ) || voices.find(v => v.lang.startsWith('en'));
            if (preferredVoice) utterance.voice = preferredVoice;
            utterance.onstart = () => setIsSpeaking(true);
            utterance.onend = () => setIsSpeaking(false);
            window.speechSynthesis.speak(utterance);
          }
        }, 100);
      } else {
        window.speechSynthesis?.cancel();
        setIsSpeaking(false);
      }
      return newVal;
    });
  }, []);

  useEffect(() => {
    if (window.speechSynthesis) {
      window.speechSynthesis.getVoices();
      window.speechSynthesis.onvoiceschanged = () => {
        window.speechSynthesis.getVoices();
      };
    }
  }, []);

  return (
    <VoiceContext.Provider value={{ speak, voiceEnabled, isSpeaking, toggleVoice, lastMessage }}>
      {children}
    </VoiceContext.Provider>
  );
}

// ===== Floating Voice Toggle Button =====
export default function VoiceAssistantButton() {
  const { voiceEnabled, isSpeaking, toggleVoice, lastMessage } = useVoice();
  const [showTooltip, setShowTooltip] = useState(false);
  const [showBubble, setShowBubble] = useState(false);

  useEffect(() => {
    if (lastMessage && voiceEnabled) {
      setShowBubble(true);
      const timer = setTimeout(() => setShowBubble(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [lastMessage, voiceEnabled]);

  return (
    <div style={{
      position: 'fixed',
      bottom: '24px',
      left: '24px',
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      gap: '8px',
    }}>
      {/* Speech Bubble */}
      {showBubble && lastMessage && (
        <div style={{
          background: 'rgba(20, 20, 22, 0.95)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(224, 124, 79, 0.3)',
          borderRadius: '16px',
          borderBottomLeftRadius: '4px',
          padding: '12px 16px',
          maxWidth: '280px',
          color: '#e8e8ea',
          fontSize: '13px',
          lineHeight: '1.5',
          boxShadow: '0 8px 32px rgba(0,0,0,0.4), 0 0 20px rgba(224, 124, 79, 0.1)',
          animation: 'voiceBubbleIn 0.3s ease-out',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
            <Mic size={10} style={{ color: '#22c55e' }} />
            <span style={{ fontSize: '10px', color: '#22c55e', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Voice Assistant
            </span>
          </div>
          {lastMessage}
        </div>
      )}

      {/* Toggle Button */}
      <button
        onClick={toggleVoice}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        style={{
          width: '52px',
          height: '52px',
          borderRadius: '50%',
          border: voiceEnabled
            ? '2px solid rgba(224, 124, 79, 0.5)'
            : '2px solid rgba(100, 116, 139, 0.3)',
          background: voiceEnabled
            ? 'linear-gradient(135deg, rgba(224, 124, 79, 0.2), rgba(201, 96, 58, 0.3))'
            : 'rgba(28, 28, 31, 0.9)',
          backdropFilter: 'blur(12px)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: voiceEnabled ? '#22c55e' : '#6b6b70',
          transition: 'all 0.3s ease',
          boxShadow: voiceEnabled
            ? '0 0 20px rgba(224, 124, 79, 0.3), 0 4px 16px rgba(0,0,0,0.3)'
            : '0 4px 16px rgba(0,0,0,0.3)',
          animation: isSpeaking ? 'voicePulse 1.5s ease-in-out infinite' : 'none',
          position: 'relative',
        }}
        title={voiceEnabled ? 'Disable Voice Assistant' : 'Enable Voice Assistant'}
      >
        {voiceEnabled ? <Volume2 size={22} /> : <VolumeX size={22} />}

        {isSpeaking && (
          <div style={{
            position: 'absolute',
            inset: '-4px',
            borderRadius: '50%',
            border: '2px solid rgba(224, 124, 79, 0.4)',
            animation: 'voiceRing 1.5s ease-out infinite',
          }} />
        )}
      </button>

      {/* Tooltip */}
      {showTooltip && (
        <div style={{
          position: 'absolute',
          left: '62px',
          bottom: '12px',
          background: 'rgba(20, 20, 22, 0.95)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '8px',
          padding: '6px 12px',
          whiteSpace: 'nowrap',
          color: '#e8e8ea',
          fontSize: '12px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
        }}>
          {voiceEnabled ? '🔊 Voice ON (click to disable)' : '🔇 Voice OFF (click to enable)'}
        </div>
      )}
    </div>
  );
}
