/* ==========================================================================
   PERFECT HOMES & DEVELOPERS - AI PROPERTY ASSISTANT (MATCHING SCREENSHOT)
   ========================================================================== */

import React, { useState, useEffect, useRef } from 'react';
import { useProperties } from '../context/PropertyContext';
import { COMPANY_CONTACT_INFO } from '../data/locationsData';
import {
  Bot,
  X,
  Send,
  RefreshCw,
  Maximize2,
  Minimize2,
  MapPin,
  CheckCircle2,
  Sparkles,
  PhoneCall
} from 'lucide-react';

const QUICK_PROMPTS = [
  '2BHK under 40 lakhs near Avadi',
  'Plots in Thiruninravur',
  'Villa in Veppampattu',
  'Best investment properties',
  'Properties with 90% bank loan'
];

export default function AIAssistant({ isOpen, onClose, onViewProperty, onFilterCatalog }) {
  const { properties } = useProperties();

  const [isMinimized, setIsMinimized] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 'msg_welcome',
      sender: 'bot',
      text: "Hi! I'm your Perfect Homes AI Assistant 🏠\nTell me what you are looking for?",
      suggestions: QUICK_PROMPTS,
      matchingProperties: [],
      timestamp: 'Just now'
    }
  ]);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen && !isMinimized && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen, isMinimized]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  if (!isOpen) return null;

  // NLP Query Processor
  const processUserQuery = (queryText) => {
    const text = queryText.toLowerCase();

    // Check if user is asking for contact / phone / office details
    if (text.includes('contact') || text.includes('phone') || text.includes('call') || text.includes('number') || text.includes('office') || text.includes('agent') || text.includes('speak')) {
      return {
        responseText: `You can reach our sales & consultation team directly:\n\n📞 Primary Contact: ${COMPANY_CONTACT_INFO.phoneDisplay}\n💬 WhatsApp: +${COMPANY_CONTACT_INFO.whatsappNumber}\n✉️ Email: ${COMPANY_CONTACT_INFO.email}\n📍 Main Office: ${COMPANY_CONTACT_INFO.officeAddress}\n\nWe are available 7 days a week from 9:00 AM to 8:00 PM for project consultations and free site visits!`,
        results: properties.slice(0, 2),
        isContact: true
      };
    }

    let matchedLocation = null;
    if (text.includes('avadi')) matchedLocation = 'Avadi';
    else if (text.includes('thiruninravur')) matchedLocation = 'Thiruninravur';
    else if (text.includes('veppampattu')) matchedLocation = 'Veppampattu';
    else if (text.includes('siruseri') || text.includes('omr')) matchedLocation = 'Siruseri / OMR';
    else if (text.includes('tiruvallur')) matchedLocation = 'Tiruvallur';
    else if (text.includes('redhills')) matchedLocation = 'Redhills';

    let matchedBhk = null;
    if (text.includes('2 bhk') || text.includes('2bhk')) matchedBhk = 2;
    else if (text.includes('3 bhk') || text.includes('3bhk')) matchedBhk = 3;

    let matchedCategory = null;
    if (text.includes('plot') || text.includes('land')) matchedCategory = 'Residential Plots';
    else if (text.includes('villa')) matchedCategory = 'Villas';
    else if (text.includes('house') || text.includes('independent')) matchedCategory = '2 BHK Homes';

    let maxPrice = Infinity;
    const lakhMatch = text.match(/(\d+)\s*(?:lakh|lakhs|l)/i);
    if (lakhMatch) {
      maxPrice = parseInt(lakhMatch[1], 10) * 100000;
    }

    let results = properties.filter((p) => {
      if (matchedLocation && p.location.toLowerCase() !== matchedLocation.toLowerCase()) return false;
      if (matchedBhk !== null && p.bhk !== matchedBhk && p.category !== 'Residential Plots') return false;
      if (matchedCategory && !p.category.toLowerCase().includes(matchedCategory.toLowerCase())) return false;
      if (p.price > maxPrice) return false;
      return true;
    });

    if (results.length === 0) {
      results = properties.slice(0, 3);
    }

    let responseText = '';
    if (results.length > 0) {
      responseText = `I found ${results.length} verified property option${results.length > 1 ? 's' : ''} with clear CMDA / DTCP approvals for you:`;
    } else {
      responseText = `Here are our most popular high-demand properties in Chennai West:`;
    }

    return { responseText, results };
  };

  const handleSendMessage = (textToSend = null) => {
    const query = (textToSend || inputMessage).trim();
    if (!query) return;

    const userMsg = {
      id: 'msg_' + Date.now(),
      sender: 'user',
      text: query,
      timestamp: 'Now'
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsThinking(true);

    setTimeout(() => {
      const { responseText, results } = processUserQuery(query);
      const botMsg = {
        id: 'msg_bot_' + Date.now(),
        sender: 'bot',
        text: responseText,
        matchingProperties: results,
        suggestions: ['Schedule a free site visit', 'Calculate EMI', 'View CMDA legal papers'],
        timestamp: 'Just now'
      };
      setMessages((prev) => [...prev, botMsg]);
      setIsThinking(false);
    }, 600);
  };

  const resetChat = () => {
    setMessages([
      {
        id: 'msg_welcome_' + Date.now(),
        sender: 'bot',
        text: "Hi! I'm your Perfect Homes AI Assistant 🏠\nTell me what you are looking for?",
        suggestions: QUICK_PROMPTS,
        matchingProperties: [],
        timestamp: 'Just now'
      }
    ]);
  };

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        width: isMinimized ? '320px' : '380px',
        maxWidth: 'calc(100vw - 32px)',
        height: isMinimized ? '56px' : '580px',
        maxHeight: 'calc(100vh - 90px)',
        backgroundColor: '#FFFFFF',
        borderRadius: 'var(--radius-xl)',
        boxShadow: '0 20px 60px rgba(6, 78, 73, 0.3)',
        border: '1.5px solid var(--border-color)',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        transition: 'height 0.25s ease'
      }}
    >
      {/* Header */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderBottom: '1px solid var(--border-color)',
          color: '#17313D',
          padding: '0.85rem 1.15rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: isMinimized ? 'pointer' : 'default'
        }}
        onClick={() => isMinimized && setIsMinimized(false)}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div
            style={{
              width: '34px',
              height: '34px',
              borderRadius: '50%',
              backgroundColor: 'var(--turquoise-light)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Bot size={19} color="#008F83" />
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '0.92rem', color: '#064E49' }}>
              AI Property Assistant
            </div>
            <div style={{ fontSize: '0.72rem', color: '#10B981', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10B981' }} />
              Online
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <button onClick={(e) => { e.stopPropagation(); resetChat(); }} style={{ color: '#687985', padding: '4px' }} title="Reset">
            <RefreshCw size={14} />
          </button>
          <button onClick={(e) => { e.stopPropagation(); setIsMinimized(!isMinimized); }} style={{ color: '#687985', padding: '4px' }} title={isMinimized ? 'Expand' : 'Minimize'}>
            {isMinimized ? <Maximize2 size={14} /> : <Minimize2 size={14} />}
          </button>
          <button onClick={(e) => { e.stopPropagation(); onClose(); }} style={{ color: '#687985', padding: '4px' }} title="Close">
            <X size={17} />
          </button>
        </div>
      </div>

      {/* Body Messages */}
      {!isMinimized && (
        <>
          <div
            style={{
              flex: 1,
              padding: '1.15rem',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.85rem',
              backgroundColor: '#F8FBFA'
            }}
          >
            {messages.map((msg) => (
              <div
                key={msg.id}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: msg.sender === 'user' ? 'flex-end' : 'flex-start'
                }}
              >
                {/* Bubble */}
                <div
                  style={{
                    maxWidth: '88%',
                    padding: '0.85rem 1rem',
                    borderRadius: '14px',
                    borderBottomRightRadius: msg.sender === 'user' ? '2px' : '14px',
                    borderBottomLeftRadius: msg.sender === 'bot' ? '2px' : '14px',
                    backgroundColor: msg.sender === 'user' ? '#008F83' : '#FFFFFF',
                    color: msg.sender === 'user' ? '#FFFFFF' : '#17313D',
                    boxShadow: '0 2px 8px rgba(6, 78, 73, 0.06)',
                    border: msg.sender === 'bot' ? '1px solid var(--border-color)' : 'none',
                    fontSize: '0.88rem',
                    lineHeight: 1.5,
                    whiteSpace: 'pre-line'
                  }}
                >
                  {msg.text}
                </div>

                {/* Suggestions List in Welcome Bubble (Matching Screenshot) */}
                {msg.id.startsWith('msg_welcome') && (
                  <div
                    style={{
                      width: '100%',
                      marginTop: '0.65rem',
                      padding: '0.75rem 0.9rem',
                      backgroundColor: '#FFFFFF',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-color)'
                    }}
                  >
                    <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#064E49', marginBottom: '0.45rem' }}>
                      You can ask like:
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                      {QUICK_PROMPTS.map((prompt, pIdx) => (
                        <button
                          key={pIdx}
                          onClick={() => handleSendMessage(prompt)}
                          style={{
                            textAlign: 'left',
                            fontSize: '0.78rem',
                            color: '#008F83',
                            fontWeight: 600,
                            padding: '3px 0',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          <span style={{ color: '#008F83' }}>•</span> {prompt}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Matching Property Recommendations */}
                {msg.matchingProperties && msg.matchingProperties.length > 0 && (
                  <div style={{ width: '100%', marginTop: '0.65rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {msg.matchingProperties.slice(0, 2).map((prop) => (
                      <div
                        key={prop.id}
                        style={{
                          backgroundColor: '#FFFFFF',
                          borderRadius: 'var(--radius-md)',
                          border: '1.5px solid var(--border-color)',
                          padding: '0.6rem',
                          display: 'flex',
                          gap: '0.75rem',
                          alignItems: 'center'
                        }}
                      >
                        <img
                          src={prop.images[0]}
                          alt={prop.title}
                          style={{ width: '56px', height: '56px', borderRadius: '6px', objectFit: 'cover' }}
                        />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#17313D', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {prop.title}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: '#687985' }}>{prop.location} • <strong style={{ color: '#008F83' }}>{prop.priceDisplay}</strong></div>
                        </div>
                        <button
                          onClick={() => {
                            onClose();
                            onViewProperty(prop);
                          }}
                          className="btn btn-primary btn-sm"
                          style={{ padding: '0.35rem 0.6rem', fontSize: '0.72rem' }}
                        >
                          View
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {isThinking && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#687985', fontSize: '0.82rem' }}>
                <Bot size={15} color="#008F83" />
                <span>Searching verified property database...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Footer Input */}
          <div
            style={{
              padding: '0.75rem 1rem',
              backgroundColor: '#FFFFFF',
              borderTop: '1px solid var(--border-color)',
              display: 'flex',
              gap: '0.5rem',
              alignItems: 'center'
            }}
          >
            <input
              ref={inputRef}
              type="text"
              placeholder="Type your message..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              style={{
                flex: 1,
                padding: '0.65rem 0.9rem',
                border: '1.5px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.88rem',
                outline: 'none'
              }}
            />
            <button
              onClick={() => handleSendMessage()}
              disabled={!inputMessage.trim()}
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                backgroundColor: '#008F83',
                color: '#FFFFFF',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: inputMessage.trim() ? 'pointer' : 'default',
                opacity: inputMessage.trim() ? 1 : 0.5
              }}
              aria-label="Send"
            >
              <Send size={16} />
            </button>
          </div>
        </>
      )}
    </div>
  );
}
