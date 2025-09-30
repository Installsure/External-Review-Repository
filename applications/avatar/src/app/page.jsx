'use client';
import React, { useState, useEffect, useRef } from 'react';
import {
  Home,
  MessageSquare,
  User,
  Brain,
  History,
  HelpCircle,
  Settings,
  Send,
  AudioLines,
  Menu,
  X,
  Bot,
  Heart,
  HardHat,
} from 'lucide-react';

export default function HomePage() {
  const [message, setMessage] = useState('');
  const [activeNav, setActiveNav] = useState('Chat');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [personas, setPersonas] = useState([]);
  const [selectedPersona, setSelectedPersona] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [session, setSession] = useState(null);
  const messagesEndRef = useRef(null);

  const characterCount = message.length;
  const maxCharacters = 10000;

  const navItems = [
    { icon: Home, label: 'Dashboard', id: 'dashboard' },
    { icon: MessageSquare, label: 'Chat', id: 'chat' },
    { icon: User, label: 'Personas', id: 'personas' },
    { icon: Brain, label: 'Memory', id: 'memory' },
    { icon: History, label: 'Sessions', id: 'sessions' },
  ];

  // Load personas on mount
  useEffect(() => {
    fetchPersonas();
  }, []);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchPersonas = async () => {
    try {
      const response = await fetch('/api/personas');
      if (response.ok) {
        const data = await response.json();
        setPersonas(data);
        if (data.length > 0) {
          setSelectedPersona(data[0]);
        }
      }
    } catch (error) {
      console.error('Error fetching personas:', error);
    }
  };

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

  const sendMessage = async () => {
    if (!message.trim() || !selectedPersona) return;

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
        currentSession = await createSession(selectedPersona.id);
      }

      // Send to AI
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          persona_id: selectedPersona.id,
          session_id: currentSession?.session_id,
        }),
      });

      if (response.ok) {
        const data = await response.json();

        // Add AI response to chat
        const aiMessage = {
          id: Date.now() + 1,
          text: data.message,
          sender: 'ai',
          persona: selectedPersona,
          timestamp: new Date().toISOString(),
          visemes: data.visemes,
        };
        setMessages((prev) => [...prev, aiMessage]);

        // Log to memory
        if (currentSession) {
          await fetch('/api/memory/create', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              user_id: currentSession.user_id,
              persona_id: selectedPersona.id,
              summary: `User: ${userMessage} | AI: ${data.message}`,
            }),
          });
        }
      }
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = {
        id: Date.now() + 1,
        text: 'Sorry, I encountered an error. Please try again.',
        sender: 'ai',
        persona: selectedPersona,
        timestamp: new Date().toISOString(),
        isError: true,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const getPersonaIcon = (personaId) => {
    return personaId === 'dating-hero' ? Heart : HardHat;
  };

  const getPersonaColor = (personaId) => {
    return personaId === 'dating-hero'
      ? 'from-pink-500 to-rose-500'
      : 'from-orange-500 to-amber-500';
  };

  const renderChat = () => (
    <div className="flex flex-col h-full">
      {/* Chat Header */}
      <div className="border-b border-[#EDEDED] dark:border-[#333333] p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            {selectedPersona && (
              <>
                <div
                  className={`w-12 h-12 rounded-3xl bg-gradient-to-br ${getPersonaColor(selectedPersona.id)} flex items-center justify-center text-white mr-4`}
                >
                  {React.createElement(getPersonaIcon(selectedPersona.id), {
                    size: 24,
                  })}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#1E1E1E] dark:text-white">
                    {selectedPersona.displayName}
                  </h3>
                  <p className="text-sm text-[#70757F] dark:text-[#A8ADB4]">
                    {selectedPersona.domain.role}
                  </p>
                </div>
              </>
            )}
          </div>
          <button
            onClick={() => setActiveNav('personas')}
            className="px-4 py-2 bg-[#F5F5F5] dark:bg-[#262626] border border-[#DADADA] dark:border-[#404040] rounded-2xl hover:bg-[#F7F7F7] dark:hover:bg-[#333333] transition-colors text-sm font-medium text-[#414141] dark:text-[#D1D1D1]"
          >
            Switch Persona
          </button>
        </div>
      </div>

      {/* Messages */}
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
              Say hello to {selectedPersona?.displayName || 'your AI companion'}
            </p>
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
                    : 'bg-[#F5F5F5] dark:bg-[#262626] text-[#1E1E1E] dark:text-white'
                } rounded-3xl px-6 py-4`}
              >
                {msg.sender === 'ai' && msg.persona && (
                  <div className="flex items-center mb-2">
                    <div
                      className={`w-6 h-6 rounded-full bg-gradient-to-br ${getPersonaColor(msg.persona.id)} flex items-center justify-center text-white mr-2`}
                    >
                      {React.createElement(getPersonaIcon(msg.persona.id), {
                        size: 12,
                      })}
                    </div>
                    <span className="text-xs font-medium text-[#70757F] dark:text-[#A8ADB4]">
                      {msg.persona.displayName}
                    </span>
                  </div>
                )}
                <p className="text-sm leading-relaxed">{msg.text}</p>
                <div className="text-xs opacity-70 mt-2">
                  {new Date(msg.timestamp).toLocaleTimeString()}
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

      {/* Message Input */}
      <div className="border-t border-[#EDEDED] dark:border-[#333333] p-6">
        <div className="bg-white dark:bg-[#1E1E1E] border border-[#E2E2E2] dark:border-[#333333] rounded-3xl p-4">
          <div className="relative">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={`Message ${selectedPersona?.displayName || 'AI'}...`}
              className="w-full min-h-[60px] text-base resize-none border-none outline-none placeholder-[#B4B4B4] dark:placeholder-[#70757F] font-inter bg-transparent text-[#1E1E1E] dark:text-white"
              disabled={!selectedPersona}
            />
            <div className="text-xs text-[#70757F] dark:text-[#A8ADB4] text-right mb-3">
              {characterCount}/{maxCharacters}
            </div>
          </div>

          <div className="h-px bg-[#EDEDED] dark:bg-[#333333] mb-4"></div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button className="flex items-center space-x-2 text-[#414141] dark:text-[#D1D1D1] hover:bg-[#F7F7F7] dark:hover:bg-[#262626] px-3 py-2 rounded-2xl transition-colors">
                <AudioLines size={16} className="text-[#838794] dark:text-[#A8ADB4]" />
                <span className="text-sm hidden sm:inline">Voice</span>
              </button>
            </div>

            <button
              onClick={sendMessage}
              disabled={!message.trim() || !selectedPersona || isLoading}
              className="w-12 h-12 bg-gradient-to-r from-[#219079] to-[#9BC56E] dark:from-[#4DD0B1] dark:to-[#B5D16A] rounded-3xl flex items-center justify-center text-white shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPersonas = () => (
    <div className="p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-[#1E1E1E] dark:text-white mb-2">AI Personas</h2>
        <p className="text-[#70757F] dark:text-[#A8ADB4]">
          Choose your AI companion for different needs
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {personas.map((persona) => {
          const Icon = getPersonaIcon(persona.id);
          const isSelected = selectedPersona?.id === persona.id;

          return (
            <div
              key={persona.id}
              onClick={() => {
                setSelectedPersona(persona);
                setActiveNav('chat');
                setMessages([]);
                setSession(null);
              }}
              className={`bg-white dark:bg-[#1E1E1E] border rounded-3xl p-6 cursor-pointer transition-all duration-200 ${
                isSelected
                  ? 'border-[#219079] dark:border-[#4DD0B1] shadow-lg'
                  : 'border-[#F0F0F0] dark:border-[#333333] hover:border-[#D6D6D6] dark:hover:border-[#404040] hover:shadow-md'
              }`}
            >
              <div className="flex items-start space-x-4">
                <div
                  className={`w-12 h-12 rounded-3xl bg-gradient-to-br ${getPersonaColor(persona.id)} flex items-center justify-center flex-shrink-0`}
                >
                  <Icon size={24} className="text-white" />
                </div>

                <div className="flex-1">
                  <h3 className="text-lg font-bold text-[#1E1E1E] dark:text-white mb-1">
                    {persona.displayName}
                  </h3>
                  <p className="text-sm text-[#70757F] dark:text-[#A8ADB4] mb-3">
                    {persona.domain.role}
                  </p>

                  <div className="space-y-2">
                    <div className="flex items-center text-xs">
                      <span className="text-[#70757F] dark:text-[#A8ADB4] w-16">Style:</span>
                      <span className="text-[#1E1E1E] dark:text-white font-medium">
                        {persona.tone.style}
                      </span>
                    </div>
                    <div className="flex items-center text-xs">
                      <span className="text-[#70757F] dark:text-[#A8ADB4] w-16">Memory:</span>
                      <span className="text-[#1E1E1E] dark:text-white font-medium">
                        {persona.memoryPolicy.retainDays} days
                      </span>
                    </div>
                  </div>
                </div>

                {isSelected && (
                  <div className="w-6 h-6 rounded-full bg-[#219079] dark:bg-[#4DD0B1] flex items-center justify-center flex-shrink-0">
                    <div className="w-2 h-2 rounded-full bg-white"></div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderDashboard = () => (
    <div className="p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-[#1E1E1E] dark:text-white mb-2">Dashboard</h2>
        <p className="text-[#70757F] dark:text-[#A8ADB4]">Welcome to NexusAvatar AI</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-[#1E1E1E] border border-[#F0F0F0] dark:border-[#333333] rounded-3xl p-6">
          <div className="w-12 h-12 rounded-3xl bg-gradient-to-br from-[#219079] to-[#9BC56E] flex items-center justify-center mb-4">
            <MessageSquare size={24} className="text-white" />
          </div>
          <h3 className="text-lg font-bold text-[#1E1E1E] dark:text-white mb-2">Active Chats</h3>
          <p className="text-2xl font-bold text-[#1E1E1E] dark:text-white mb-1">
            {messages.length > 0 ? '1' : '0'}
          </p>
          <p className="text-sm text-[#70757F] dark:text-[#A8ADB4]">Ongoing conversations</p>
        </div>

        <div className="bg-white dark:bg-[#1E1E1E] border border-[#F0F0F0] dark:border-[#333333] rounded-3xl p-6">
          <div className="w-12 h-12 rounded-3xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center mb-4">
            <User size={24} className="text-white" />
          </div>
          <h3 className="text-lg font-bold text-[#1E1E1E] dark:text-white mb-2">Personas</h3>
          <p className="text-2xl font-bold text-[#1E1E1E] dark:text-white mb-1">
            {personas.length}
          </p>
          <p className="text-sm text-[#70757F] dark:text-[#A8ADB4]">Available AI personalities</p>
        </div>

        <div className="bg-white dark:bg-[#1E1E1E] border border-[#F0F0F0] dark:border-[#333333] rounded-3xl p-6">
          <div className="w-12 h-12 rounded-3xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center mb-4">
            <Brain size={24} className="text-white" />
          </div>
          <h3 className="text-lg font-bold text-[#1E1E1E] dark:text-white mb-2">Memories</h3>
          <p className="text-2xl font-bold text-[#1E1E1E] dark:text-white mb-1">
            {messages.filter((m) => m.sender === 'ai').length}
          </p>
          <p className="text-sm text-[#70757F] dark:text-[#A8ADB4]">Stored interactions</p>
        </div>
      </div>

      <div className="bg-white dark:bg-[#1E1E1E] border border-[#F0F0F0] dark:border-[#333333] rounded-3xl p-6">
        <h3 className="text-lg font-bold text-[#1E1E1E] dark:text-white mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            onClick={() => setActiveNav('chat')}
            className="flex items-center p-4 bg-gradient-to-r from-[#219079] to-[#9BC56E] dark:from-[#4DD0B1] dark:to-[#B5D16A] text-white rounded-2xl hover:shadow-md transition-all"
          >
            <MessageSquare size={20} className="mr-3" />
            Start New Chat
          </button>
          <button
            onClick={() => setActiveNav('personas')}
            className="flex items-center p-4 bg-[#F5F5F5] dark:bg-[#262626] text-[#1E1E1E] dark:text-white rounded-2xl hover:bg-[#F7F7F7] dark:hover:bg-[#333333] transition-all"
          >
            <User size={20} className="mr-3" />
            Browse Personas
          </button>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeNav) {
      case 'chat':
        return renderChat();
      case 'personas':
        return renderPersonas();
      case 'dashboard':
      default:
        return renderDashboard();
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#121212] font-inter">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-white dark:bg-[#121212] border-b border-[#EDEDED] dark:border-[#333333] z-50 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="mr-3 p-1 hover:bg-[#F7F7F7] dark:hover:bg-[#262626] rounded-2xl transition-colors"
            >
              <Menu size={24} className="text-[#1E1E1E] dark:text-white" />
            </button>
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-2xl bg-gradient-to-br from-[#219079] to-[#9BC56E] flex items-center justify-center mr-3">
                <Bot size={16} className="text-white" />
              </div>
              <span className="text-lg font-bold text-[#1E1E1E] dark:text-white">NexusAvatar</span>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 h-full bg-white dark:bg-[#121212] border-r border-[#EDEDED] dark:border-[#333333] transition-all duration-300 z-50 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 w-60`}
      >
        <div className="p-6 pt-8 h-full flex flex-col">
          {/* Mobile Close Button */}
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden absolute top-4 right-4 p-1 hover:bg-[#F7F7F7] dark:hover:bg-[#262626] rounded-2xl transition-colors"
          >
            <X size={20} className="text-[#70757F] dark:text-[#A8ADB4]" />
          </button>

          {/* Brand */}
          <div className="flex items-center mb-8">
            <div className="w-8 h-8 rounded-2xl bg-gradient-to-br from-[#219079] to-[#9BC56E] flex items-center justify-center mr-3">
              <Bot size={16} className="text-white" />
            </div>
            <div>
              <span className="text-lg font-bold text-[#1E1E1E] dark:text-white">NexusAvatar</span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="space-y-2 flex-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeNav === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveNav(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center px-4 py-3 rounded-2xl text-left transition-all ${
                    isActive
                      ? 'bg-[#F1F1F1] dark:bg-[#262626] text-[#1E1E1E] dark:text-white font-bold'
                      : 'text-[#70757F] dark:text-[#A8ADB4] hover:bg-[#F7F7F7] dark:hover:bg-[#1E1E1E]'
                  }`}
                >
                  <Icon
                    size={18}
                    className={`mr-3 ${isActive ? 'text-[#1E1E1E] dark:text-white' : 'text-[#A8ADB4] dark:text-[#70757F]'}`}
                  />
                  <span className="text-sm">{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Bottom section */}
          <div className="space-y-2 pt-6 border-t border-[#EDEDED] dark:border-[#333333]">
            <button className="w-full flex items-center px-4 py-3 text-[#70757F] dark:text-[#A8ADB4] hover:bg-[#F7F7F7] dark:hover:bg-[#1E1E1E] rounded-2xl transition-colors">
              <HelpCircle size={18} className="mr-3 text-[#A8ADB4] dark:text-[#70757F]" />
              <span className="text-sm">Help</span>
            </button>
            <button className="w-full flex items-center px-4 py-3 text-[#70757F] dark:text-[#A8ADB4] hover:bg-[#F7F7F7] dark:hover:bg-[#1E1E1E] rounded-2xl transition-colors">
              <Settings size={18} className="mr-3 text-[#A8ADB4] dark:text-[#70757F]" />
              <span className="text-sm">Settings</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:ml-60 pt-20 lg:pt-0 h-screen flex flex-col">
        <div className="flex-1 overflow-hidden">{renderContent()}</div>
      </div>
    </div>
  );
}
