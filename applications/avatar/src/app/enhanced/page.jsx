'use client';
import React, { useState, useEffect } from 'react';
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
  Shield,
  ShoppingBag,
  Stethoscope,
  Sparkles,
  Zap,
  Eye,
  Volume2,
} from 'lucide-react';
import EnhancedChat from '../../components/EnhancedChat';

export default function EnhancedPage() {
  const [activeNav, setActiveNav] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [personas, setPersonas] = useState([]);
  const [selectedPersona, setSelectedPersona] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const navItems = [
    { icon: Home, label: 'Dashboard', id: 'dashboard' },
    { icon: MessageSquare, label: 'Enhanced Chat', id: 'chat' },
    { icon: User, label: 'Personas', id: 'personas' },
    { icon: Brain, label: 'Memory', id: 'memory' },
    { icon: History, label: 'Sessions', id: 'sessions' },
  ];

  // Load enhanced personas on mount
  useEffect(() => {
    fetchEnhancedPersonas();
  }, []);

  const fetchEnhancedPersonas = async () => {
    try {
      const response = await fetch('/api/personas/enhanced');
      if (response.ok) {
        const data = await response.json();
        setPersonas(data);
        if (data.length > 0) {
          setSelectedPersona(data[0]);
        }
      }
    } catch (error) {
      console.error('Error fetching enhanced personas:', error);
      // Fallback to basic personas
      try {
        const response = await fetch('/api/personas');
        if (response.ok) {
          const data = await response.json();
          setPersonas(data);
          if (data.length > 0) {
            setSelectedPersona(data[0]);
          }
        }
      } catch (fallbackError) {
        console.error('Error fetching fallback personas:', fallbackError);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const getPersonaIcon = (personaId) => {
    const iconMap = {
      'dating-hero': Heart,
      'construction-smart-alec': HardHat,
      'customer-service': Shield,
      counselor: Brain,
      'retail-sales': ShoppingBag,
      'healthcare-assistant': Stethoscope,
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

  const renderEnhancedPersonas = () => (
    <div className="p-6">
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <Sparkles className="w-6 h-6 text-purple-500 mr-2" />
          <h2 className="text-2xl font-bold text-[#1E1E1E] dark:text-white">
            Enhanced AI Personas
          </h2>
        </div>
        <p className="text-[#70757F] dark:text-[#A8ADB4]">
          Advanced AI companions with emotion recognition, 3D avatars, and specialized expertise
        </p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="bg-white dark:bg-[#1E1E1E] border border-[#F0F0F0] dark:border-[#333333] rounded-3xl p-6 animate-pulse"
            >
              <div className="w-12 h-12 bg-gray-300 dark:bg-gray-600 rounded-3xl mb-4"></div>
              <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded mb-2"></div>
              <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded mb-4"></div>
              <div className="space-y-2">
                <div className="h-2 bg-gray-300 dark:bg-gray-600 rounded"></div>
                <div className="h-2 bg-gray-300 dark:bg-gray-600 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {personas.map((persona) => {
            const Icon = getPersonaIcon(persona.id);
            const isSelected = selectedPersona?.id === persona.id;

            return (
              <div
                key={persona.id}
                onClick={() => {
                  setSelectedPersona(persona);
                  setActiveNav('chat');
                }}
                className={`bg-white dark:bg-[#1E1E1E] border rounded-3xl p-6 cursor-pointer transition-all duration-200 hover:shadow-lg ${
                  isSelected
                    ? 'border-[#219079] dark:border-[#4DD0B1] shadow-lg ring-2 ring-[#219079] ring-opacity-20'
                    : 'border-[#F0F0F0] dark:border-[#333333] hover:border-[#D6D6D6] dark:hover:border-[#404040]'
                }`}
              >
                <div className="flex items-start space-x-4">
                  <div
                    className={`w-12 h-12 rounded-3xl bg-gradient-to-br ${getPersonaColor(persona.id)} flex items-center justify-center flex-shrink-0`}
                  >
                    <Icon size={24} className="text-white" />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-bold text-[#1E1E1E] dark:text-white">
                        {persona.displayName}
                      </h3>
                      {isSelected && (
                        <div className="w-6 h-6 rounded-full bg-[#219079] dark:bg-[#4DD0B1] flex items-center justify-center flex-shrink-0">
                          <div className="w-2 h-2 rounded-full bg-white"></div>
                        </div>
                      )}
                    </div>

                    <p className="text-sm text-[#70757F] dark:text-[#A8ADB4] mb-3">
                      {persona.description || persona.domain?.role}
                    </p>

                    {/* Capabilities */}
                    {persona.capabilities && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {persona.capabilities.emotion_recognition && (
                          <span className="text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 px-2 py-1 rounded-full">
                            <Eye size={10} className="inline mr-1" />
                            Emotion AI
                          </span>
                        )}
                        {persona.capabilities.real_time_animation && (
                          <span className="text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 px-2 py-1 rounded-full">
                            <Zap size={10} className="inline mr-1" />
                            3D Avatar
                          </span>
                        )}
                        {persona.capabilities.voice_synthesis && (
                          <span className="text-xs bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 px-2 py-1 rounded-full">
                            <Volume2 size={10} className="inline mr-1" />
                            Voice AI
                          </span>
                        )}
                      </div>
                    )}

                    {/* Persona Details */}
                    <div className="space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-[#70757F] dark:text-[#A8ADB4]">Style:</span>
                        <span className="text-[#1E1E1E] dark:text-white font-medium">
                          {persona.tone?.style || 'Professional'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[#70757F] dark:text-[#A8ADB4]">Memory:</span>
                        <span className="text-[#1E1E1E] dark:text-white font-medium">
                          {persona.memoryPolicy?.retainDays || 30} days
                        </span>
                      </div>
                      {persona.domain?.expertise && (
                        <div className="flex items-center justify-between">
                          <span className="text-[#70757F] dark:text-[#A8ADB4]">Expertise:</span>
                          <span className="text-[#1E1E1E] dark:text-white font-medium">
                            {persona.domain.expertise.length} areas
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );

  const renderEnhancedDashboard = () => (
    <div className="p-6">
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <Sparkles className="w-6 h-6 text-purple-500 mr-2" />
          <h2 className="text-2xl font-bold text-[#1E1E1E] dark:text-white">
            Enhanced Avatar Dashboard
          </h2>
        </div>
        <p className="text-[#70757F] dark:text-[#A8ADB4]">
          Next-generation AI avatars with emotion recognition, 3D rendering, and advanced
          capabilities
        </p>
      </div>

      {/* Enhanced Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-[#1E1E1E] border border-[#F0F0F0] dark:border-[#333333] rounded-3xl p-6">
          <div className="w-12 h-12 rounded-3xl bg-gradient-to-br from-[#219079] to-[#9BC56E] flex items-center justify-center mb-4">
            <MessageSquare size={24} className="text-white" />
          </div>
          <h3 className="text-lg font-bold text-[#1E1E1E] dark:text-white mb-2">Enhanced Chats</h3>
          <p className="text-2xl font-bold text-[#1E1E1E] dark:text-white mb-1">
            {personas.length > 0 ? 'Active' : '0'}
          </p>
          <p className="text-sm text-[#70757F] dark:text-[#A8ADB4]">Emotion-aware conversations</p>
        </div>

        <div className="bg-white dark:bg-[#1E1E1E] border border-[#F0F0F0] dark:border-[#333333] rounded-3xl p-6">
          <div className="w-12 h-12 rounded-3xl bg-gradient-to-br from-purple-500 to-violet-500 flex items-center justify-center mb-4">
            <Sparkles size={24} className="text-white" />
          </div>
          <h3 className="text-lg font-bold text-[#1E1E1E] dark:text-white mb-2">AI Personas</h3>
          <p className="text-2xl font-bold text-[#1E1E1E] dark:text-white mb-1">
            {personas.length}
          </p>
          <p className="text-sm text-[#70757F] dark:text-[#A8ADB4]">Advanced AI personalities</p>
        </div>

        <div className="bg-white dark:bg-[#1E1E1E] border border-[#F0F0F0] dark:border-[#333333] rounded-3xl p-6">
          <div className="w-12 h-12 rounded-3xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mb-4">
            <Eye size={24} className="text-white" />
          </div>
          <h3 className="text-lg font-bold text-[#1E1E1E] dark:text-white mb-2">Emotion AI</h3>
          <p className="text-2xl font-bold text-[#1E1E1E] dark:text-white mb-1">
            {personas.filter((p) => p.capabilities?.emotion_recognition).length}
          </p>
          <p className="text-sm text-[#70757F] dark:text-[#A8ADB4]">Emotion-aware avatars</p>
        </div>

        <div className="bg-white dark:bg-[#1E1E1E] border border-[#F0F0F0] dark:border-[#333333] rounded-3xl p-6">
          <div className="w-12 h-12 rounded-3xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center mb-4">
            <Zap size={24} className="text-white" />
          </div>
          <h3 className="text-lg font-bold text-[#1E1E1E] dark:text-white mb-2">3D Avatars</h3>
          <p className="text-2xl font-bold text-[#1E1E1E] dark:text-white mb-1">
            {personas.filter((p) => p.capabilities?.real_time_animation).length}
          </p>
          <p className="text-sm text-[#70757F] dark:text-[#A8ADB4]">Real-time animated avatars</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-[#1E1E1E] border border-[#F0F0F0] dark:border-[#333333] rounded-3xl p-6">
        <h3 className="text-lg font-bold text-[#1E1E1E] dark:text-white mb-4">Enhanced Features</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            onClick={() => setActiveNav('chat')}
            className="flex items-center p-4 bg-gradient-to-r from-[#219079] to-[#9BC56E] dark:from-[#4DD0B1] dark:to-[#B5D16A] text-white rounded-2xl hover:shadow-md transition-all"
          >
            <MessageSquare size={20} className="mr-3" />
            Start Enhanced Chat
          </button>
          <button
            onClick={() => setActiveNav('personas')}
            className="flex items-center p-4 bg-gradient-to-r from-purple-500 to-violet-500 text-white rounded-2xl hover:shadow-md transition-all"
          >
            <Sparkles size={20} className="mr-3" />
            Browse Personas
          </button>
          <button className="flex items-center p-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-2xl hover:shadow-md transition-all">
            <Eye size={20} className="mr-3" />
            Emotion Analysis
          </button>
          <button className="flex items-center p-4 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-2xl hover:shadow-md transition-all">
            <Zap size={20} className="mr-3" />
            3D Avatar Studio
          </button>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeNav) {
      case 'chat':
        return (
          <EnhancedChat
            persona={selectedPersona}
            onPersonaChange={() => setActiveNav('personas')}
          />
        );
      case 'personas':
        return renderEnhancedPersonas();
      case 'dashboard':
      default:
        return renderEnhancedDashboard();
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
              <div className="w-8 h-8 rounded-2xl bg-gradient-to-br from-purple-500 to-violet-500 flex items-center justify-center mr-3">
                <Sparkles size={16} className="text-white" />
              </div>
              <span className="text-lg font-bold text-[#1E1E1E] dark:text-white">
                Avatar Enhanced
              </span>
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
            <div className="w-8 h-8 rounded-2xl bg-gradient-to-br from-purple-500 to-violet-500 flex items-center justify-center mr-3">
              <Sparkles size={16} className="text-white" />
            </div>
            <div>
              <span className="text-lg font-bold text-[#1E1E1E] dark:text-white">
                Avatar Enhanced
              </span>
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



