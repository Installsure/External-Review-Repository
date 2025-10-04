import React, { useState, useRef } from 'react';
import { Building2, Send, CheckCircle, AlertCircle, FileText, Users } from 'lucide-react';

export default function DemoPanel() {
  const [projectName, setProjectName] = useState('');
  const [rfiType, setRfiType] = useState('design-clarification');
  const [log, setLog] = useState<string[]>([]);
  const [message, setMessage] = useState('');
  const [isActive, setIsActive] = useState(false);

  const handleStartDemo = () => {
    setIsActive(true);
    setLog((prev) => [
      `✅ Demo session started for project: ${projectName || 'Sample Project'}`,
      ...prev,
    ]);
  };

  const handleSendMessage = () => {
    if (!message.trim()) return;

    // Add user message to log
    setLog((prev) => [`📤 You: ${message}`, ...prev]);

    // Simulate AI response based on RFI type
    setTimeout(() => {
      let response = '';
      switch (rfiType) {
        case 'design-clarification':
          response = '🏗️ AI: I can help clarify the design requirements. Please provide the specific section or drawing number you need clarification on.';
          break;
        case 'material-specification':
          response = '📋 AI: For material specifications, I recommend reviewing the latest industry standards. What material are you inquiring about?';
          break;
        case 'schedule-update':
          response = '📅 AI: I\'ll help update the project schedule. Which phase or milestone needs adjustment?';
          break;
        case 'safety-concern':
          response = '⚠️ AI: Safety is our top priority. Please provide details about the concern so we can address it immediately.';
          break;
        default:
          response = '💬 AI: I\'m here to assist with your construction project needs. How can I help?';
      }
      setLog((prev) => [response, ...prev]);
    }, 1000);

    setMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-lg shadow-lg mb-6">
        <div className="flex items-center space-x-3">
          <Building2 className="w-8 h-8" />
          <div>
            <h1 className="text-3xl font-bold">InstallSure Demo Panel</h1>
            <p className="text-blue-100 mt-1">Construction Management & RFI Assistant</p>
          </div>
        </div>
      </div>

      {/* Configuration Panel */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Demo Configuration</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Project Name
            </label>
            <input
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="Enter project name (e.g., Downtown Tower Construction)"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              RFI Type
            </label>
            <select
              value={rfiType}
              onChange={(e) => setRfiType(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            >
              <option value="design-clarification">🏗️ Design Clarification</option>
              <option value="material-specification">📋 Material Specification</option>
              <option value="schedule-update">📅 Schedule Update</option>
              <option value="safety-concern">⚠️ Safety Concern</option>
              <option value="general-inquiry">💬 General Inquiry</option>
            </select>
          </div>

          <button
            onClick={handleStartDemo}
            className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors ${
              isActive
                ? 'bg-green-500 text-white hover:bg-green-600'
                : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}
          >
            {isActive ? (
              <span className="flex items-center justify-center">
                <CheckCircle className="w-5 h-5 mr-2" />
                Demo Session Active
              </span>
            ) : (
              <span className="flex items-center justify-center">
                <Building2 className="w-5 h-5 mr-2" />
                Start Demo Session
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Chat Interface */}
      {isActive && (
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">RFI Assistant Chat</h2>
          
          <div className="flex space-x-3 mb-4">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message or RFI question..."
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              onClick={handleSendMessage}
              disabled={!message.trim()}
              className={`px-6 py-3 rounded-lg font-semibold flex items-center ${
                message.trim()
                  ? 'bg-blue-500 text-white hover:bg-blue-600'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              <Send className="w-5 h-5" />
            </button>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start space-x-2 text-sm text-blue-800">
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <p>
                This is a demo interface showcasing InstallSure's AI-powered RFI management system.
                In production, this would connect to real project data and AutoCAD integrations.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Activity Log */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Activity Log</h2>
        
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {log.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <FileText className="w-12 h-12 mx-auto mb-3 text-gray-400" />
              <p className="text-sm">No activity yet. Start a demo session to begin.</p>
            </div>
          ) : (
            log.map((entry, i) => (
              <div
                key={i}
                className={`p-3 rounded-lg border ${
                  entry.includes('You:')
                    ? 'bg-blue-50 border-blue-200'
                    : entry.includes('AI:')
                    ? 'bg-green-50 border-green-200'
                    : 'bg-gray-50 border-gray-200'
                }`}
              >
                <p className="text-sm text-gray-800">{entry}</p>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Demo Features Section */}
      <div className="mt-6 bg-white rounded-lg shadow-md border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Demo Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start space-x-3">
            <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
            <div>
              <h3 className="font-medium text-gray-900">AutoCAD Integration</h3>
              <p className="text-sm text-gray-600">Upload and view construction drawings</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
            <div>
              <h3 className="font-medium text-gray-900">RFI Management</h3>
              <p className="text-sm text-gray-600">Track and manage project requests</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
            <div>
              <h3 className="font-medium text-gray-900">Real-time Collaboration</h3>
              <p className="text-sm text-gray-600">Team communication and updates</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
            <div>
              <h3 className="font-medium text-gray-900">Project Analytics</h3>
              <p className="text-sm text-gray-600">Insights and reporting tools</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
