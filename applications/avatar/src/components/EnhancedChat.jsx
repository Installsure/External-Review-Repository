'use client';
import React, { useState, useEffect, useRef } from 'react';
import { Send, Volume2, VolumeX, Settings, Bot, Heart, HardHat } from 'lucide-react';
import Avatar3D from './Avatar3D';

export default function EnhancedChat({ persona, onPersonaChange }) {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [session, setSession] = useState(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentEmotions, setCurrentEmotions] = useState({});
  const [currentVisemes, setCurrentVisemes] = useState([]);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [showAvatar, setShowAvatar] = useState(true);
  const messagesEndRef = useRef(null);
  const audioRef = useRef(null);

  const characterCount = message.length;
  const maxCharacters = 10000;

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Create session
  const createSession = async (personaId) => {
    try {
      const response = await fetch('/api/session/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ persona_id: personaId }),
      });

      if (response.ok) {
        const data = await response.json();
        setSession(data.session);
        return data.session;
      }
    } catch (error) {
      console.error('Error creating session:', error);
    }
    return null;
  };

  // Send message with enhanced AI
  const sendMessage = async () => {
    if (!message.trim() || !persona) return;

    const userMessage = message.trim();
    setMessage('');
    setIsLoading(true);

    // Add user message to chat
    const newUserMessage = {
      id: Date.now(),
      text: userMessage,
      sender: 'user',
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, newUserMessage]);

    try {
      // Create session if needed
      let currentSession = session;
      if (!currentSession) {
        currentSession = await createSession(persona.id);
      }

      // Send to enhanced AI
      const response = await fetch('/api/ai/enhanced-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          persona_id: persona.id,
          session_id: currentSession?.session_id,
          emotion_analysis: true,
        }),
      });

      if (response.ok) {
        const data = await response.json();

        // Update emotions and visemes for avatar
        setCurrentEmotions(data.emotions || {});
        setCurrentVisemes(data.visemes || []);

        // Add AI response to chat
        const aiMessage = {
          id: Date.now() + 1,
          text: data.message,
          sender: 'ai',
          persona: persona,
          timestamp: new Date().toISOString(),
          emotions: data.emotions,
          visemes: data.visemes,
          responseQuality: data.context?.response_quality || 'stub',
        };
        setMessages((prev) => [...prev, aiMessage]);

        // Trigger speaking animation
        if (data.visemes && data.visemes.length > 0) {
          setIsSpeaking(true);
          setTimeout(() => setIsSpeaking(false), data.visemes[data.visemes.length - 1].at + 500);
        }

        // Voice synthesis if enabled
        if (voiceEnabled && data.message) {
          synthesizeSpeech(data.message, persona.avatar?.voice || 'default');
        }
      }
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = {
        id: Date.now() + 1,
        text: 'Sorry, I encountered an error. Please try again.',
        sender: 'ai',
        persona: persona,
        timestamp: new Date().toISOString(),
        isError: true,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Text-to-speech synthesis
  const synthesizeSpeech = (text, voice = 'default') => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);

      // Voice selection based on persona
      const voices = speechSynthesis.getVoices();
      const personaVoice = voices.find(
        (v) =>
          (voice === 'warm_feminine' && v.name.includes('Female')) ||
          (voice === 'confident_masculine' && v.name.includes('Male')) ||
          (voice === 'gentle_soothing' && v.name.includes('Female')),
      );

      if (personaVoice) {
        utterance.voice = personaVoice;
      }

      utterance.rate = 0.9;
      utterance.pitch = 1.0;
      utterance.volume = 0.8;

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);

      speechSynthesis.speak(utterance);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const getPersonaIcon = (personaId) => {
    const iconMap = {
      'dating-hero': Heart,
      'construction-smart-alec': HardHat,
      'customer-service': Bot,
      counselor: Bot,
      'retail-sales': Bot,
      'healthcare-assistant': Bot,
    };
    return iconMap[personaId] || Bot;
  };

  const getPersonaColor = (personaId) => {
    const colorMap = {
      'dating-hero': 'from-pink-500 to-rose-500',
      'construction-smart-alec': 'from-orange-500 to-amber-500',
      'customer-service': 'from-blue-500 to-cyan-500',
      counselor: 'from-green-500 to-emerald-500',
      'retail-sales': 'from-purple-500 to-violet-500',
      'healthcare-assistant': 'from-teal-500 to-cyan-500',
    };
    return colorMap[personaId] || 'from-blue-500 to-cyan-500';
  };

  const getEmotionColor = (emotions) => {
    if (!emotions || Object.keys(emotions).length === 0) return 'bg-gray-100';

    const dominantEmotion = Object.keys(emotions).reduce((a, b) =>
      emotions[a] > emotions[b] ? a : b,
    );

    const emotionColors = {
      joy: 'bg-yellow-100 border-yellow-300',
      trust: 'bg-blue-100 border-blue-300',
      fear: 'bg-red-100 border-red-300',
      surprise: 'bg-purple-100 border-purple-300',
      sadness: 'bg-gray-100 border-gray-300',
      anger: 'bg-red-100 border-red-300',
      anticipation: 'bg-orange-100 border-orange-300',
    };

    return emotionColors[dominantEmotion] || 'bg-gray-100 border-gray-300';
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-[#121212]">
      {/* Enhanced Chat Header */}
      <div className="border-b border-[#EDEDED] dark:border-[#333333] p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            {persona && (
              <>
                <div
                  className={`w-12 h-12 rounded-3xl bg-gradient-to-br ${getPersonaColor(persona.id)} flex items-center justify-center text-white mr-4`}
                >
                  {React.createElement(getPersonaIcon(persona.id), { size: 24 })}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#1E1E1E] dark:text-white">
                    {persona.displayName}
                  </h3>
                  <p className="text-sm text-[#70757F] dark:text-[#A8ADB4]">
                    {persona.domain?.role || 'AI Assistant'}
                  </p>
                  {persona.capabilities && (
                    <div className="flex space-x-2 mt-1">
                      {persona.capabilities.emotion_recognition && (
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                          Emotion AI
                        </span>
                      )}
                      {persona.capabilities.real_time_animation && (
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                          3D Avatar
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setVoiceEnabled(!voiceEnabled)}
              className={`p-2 rounded-2xl transition-colors ${
                voiceEnabled
                  ? 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400'
                  : 'bg-[#F5F5F5] dark:bg-[#262626] text-[#70757F] dark:text-[#A8ADB4]'
              }`}
            >
              {voiceEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
            </button>

            <button
              onClick={() => setShowAvatar(!showAvatar)}
              className="p-2 bg-[#F5F5F5] dark:bg-[#262626] text-[#70757F] dark:text-[#A8ADB4] rounded-2xl hover:bg-[#F7F7F7] dark:hover:bg-[#333333] transition-colors"
            >
              <Settings size={16} />
            </button>

            <button
              onClick={() => onPersonaChange && onPersonaChange()}
              className="px-4 py-2 bg-[#F5F5F5] dark:bg-[#262626] border border-[#DADADA] dark:border-[#404040] rounded-2xl hover:bg-[#F7F7F7] dark:hover:bg-[#333333] transition-colors text-sm font-medium text-[#414141] dark:text-[#D1D1D1]"
            >
              Switch Persona
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* 3D Avatar Section */}
        {showAvatar && persona && (
          <div className="w-1/3 border-r border-[#EDEDED] dark:border-[#333333] p-4">
            <Avatar3D
              persona={persona}
              emotions={currentEmotions}
              visemes={currentVisemes}
              isSpeaking={isSpeaking}
              className="h-full"
            />

            {/* Emotion Display */}
            {Object.keys(currentEmotions).length > 0 && (
              <div className="mt-4 p-3 rounded-lg border">
                <h4 className="text-sm font-medium text-[#1E1E1E] dark:text-white mb-2">
                  Current Emotions
                </h4>
                <div className="space-y-1">
                  {Object.entries(currentEmotions).map(([emotion, value]) => (
                    <div key={emotion} className="flex items-center justify-between">
                      <span className="text-xs text-[#70757F] dark:text-[#A8ADB4] capitalize">
                        {emotion}
                      </span>
                      <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${value * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Chat Messages */}
        <div className={`${showAvatar ? 'w-2/3' : 'w-full'} flex flex-col`}>
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 rounded-3xl bg-gradient-to-br from-[#219079] to-[#9BC56E] dark:from-[#4DD0B1] dark:to-[#B5D16A] flex items-center justify-center">
                  <Bot size={32} className="text-white" />
                </div>
                <h3 className="text-xl font-bold text-[#1E1E1E] dark:text-white mb-2">
                  Start a conversation
                </h3>
                <p className="text-[#70757F] dark:text-[#A8ADB4]">
                  Say hello to {persona?.displayName || 'your AI companion'}
                </p>
                {persona?.description && (
                  <p className="text-sm text-[#70757F] dark:text-[#A8ADB4] mt-2 max-w-md mx-auto">
                    {persona.description}
                  </p>
                )}
              </div>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[70%] ${
                      msg.sender === 'user'
                        ? 'bg-gradient-to-r from-[#219079] to-[#9BC56E] dark:from-[#4DD0B1] dark:to-[#B5D16A] text-white'
                        : `bg-[#F5F5F5] dark:bg-[#262626] text-[#1E1E1E] dark:text-white ${getEmotionColor(msg.emotions)}`
                    } rounded-3xl px-6 py-4 border`}
                  >
                    {msg.sender === 'ai' && msg.persona && (
                      <div className="flex items-center mb-2">
                        <div
                          className={`w-6 h-6 rounded-full bg-gradient-to-br ${getPersonaColor(msg.persona.id)} flex items-center justify-center text-white mr-2`}
                        >
                          {React.createElement(getPersonaIcon(msg.persona.id), { size: 12 })}
                        </div>
                        <span className="text-xs font-medium text-[#70757F] dark:text-[#A8ADB4]">
                          {msg.persona.displayName}
                        </span>
                        {msg.responseQuality === 'enhanced' && (
                          <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                            Enhanced AI
                          </span>
                        )}
                      </div>
                    )}
                    <p className="text-sm leading-relaxed">{msg.text}</p>
                    <div className="flex items-center justify-between mt-2">
                      <div className="text-xs opacity-70">
                        {new Date(msg.timestamp).toLocaleTimeString()}
                      </div>
                      {msg.sender === 'ai' && msg.emotions && (
                        <div className="text-xs opacity-70">
                          {Object.keys(msg.emotions).length > 0 && 'Emotion-aware'}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-[#F5F5F5] dark:bg-[#262626] rounded-3xl px-6 py-4">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-[#70757F] dark:bg-[#A8ADB4] rounded-full animate-pulse"></div>
                    <div
                      className="w-2 h-2 bg-[#70757F] dark:bg-[#A8ADB4] rounded-full animate-pulse"
                      style={{ animationDelay: '0.2s' }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-[#70757F] dark:bg-[#A8ADB4] rounded-full animate-pulse"
                      style={{ animationDelay: '0.4s' }}
                    ></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Enhanced Message Input */}
          <div className="border-t border-[#EDEDED] dark:border-[#333333] p-6">
            <div className="bg-white dark:bg-[#1E1E1E] border border-[#E2E2E2] dark:border-[#333333] rounded-3xl p-4">
              <div className="relative">
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={`Message ${persona?.displayName || 'AI'}...`}
                  className="w-full min-h-[60px] text-base resize-none border-none outline-none placeholder-[#B4B4B4] dark:placeholder-[#70757F] font-inter bg-transparent text-[#1E1E1E] dark:text-white"
                  disabled={!persona}
                />
                <div className="text-xs text-[#70757F] dark:text-[#A8ADB4] text-right mb-3">
                  {characterCount}/{maxCharacters}
                </div>
              </div>

              <div className="h-px bg-[#EDEDED] dark:bg-[#333333] mb-4"></div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setVoiceEnabled(!voiceEnabled)}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-2xl transition-colors ${
                      voiceEnabled
                        ? 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400'
                        : 'text-[#414141] dark:text-[#D1D1D1] hover:bg-[#F7F7F7] dark:hover:bg-[#262626]'
                    }`}
                  >
                    {voiceEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
                    <span className="text-sm hidden sm:inline">Voice</span>
                  </button>
                </div>

                <button
                  onClick={sendMessage}
                  disabled={!message.trim() || !persona || isLoading}
                  className="w-12 h-12 bg-gradient-to-r from-[#219079] to-[#9BC56E] dark:from-[#4DD0B1] dark:to-[#B5D16A] rounded-3xl flex items-center justify-center text-white shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}



