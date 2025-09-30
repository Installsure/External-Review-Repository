import React, { useState, useEffect } from 'react';
import {
  Shield,
  AlertTriangle,
  Camera,
  StopCircle,
  FileText,
  Clock,
  CheckCircle,
  Eye,
  Activity,
  Users,
  Bell,
} from 'lucide-react';

export default function SafetyPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [redeyeActive, setRedeyeActive] = useState(false);
  const [emergencyMode, setEmergencyMode] = useState(false);
  const [error, setError] = useState('');
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchUserData();
    // In a real app, we'd fetch safety status from the API
    loadSafetyStatus();
  }, []);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('ff4u_token');
      const response = await fetch('/api/me', {
        headers: { 'x-ff4u-token': token },
      });

      if (!response.ok) {
        window.location.href = '/auth/login';
        return;
      }

      const data = await response.json();
      if (!['safety_officer', 'admin', 'performer'].includes(data.user.role)) {
        window.location.href = '/';
        return;
      }

      setUser(data.user);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching user:', error);
      window.location.href = '/auth/login';
    }
  };

  const loadSafetyStatus = () => {
    // In production, load actual status from API
    setRedeyeActive(false);
    setEmergencyMode(false);
  };

  const handleRedeyeToggle = async () => {
    setError('');
    setProcessing(true);

    try {
      // In production, this would call the actual RedEye API
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call

      setRedeyeActive(!redeyeActive);

      // Log the action
      const token = localStorage.getItem('ff4u_token');
      await fetch('/api/audit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-ff4u-token': token,
        },
        body: JSON.stringify({
          action: 'redeye_toggled',
          meta: { active: !redeyeActive },
        }),
      });
    } catch (error) {
      console.error('RedEye toggle error:', error);
      setError('Failed to toggle RedEye monitoring');
    } finally {
      setProcessing(false);
    }
  };

  const handleCreateSnapshot = async () => {
    setError('');
    setProcessing(true);

    try {
      const token = localStorage.getItem('ff4u_token');
      const response = await fetch('/api/safety/snapshot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-ff4u-token': token,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to create snapshot');
      }

      alert('Evidence snapshot created successfully');
    } catch (error) {
      console.error('Snapshot error:', error);
      setError('Failed to create evidence snapshot');
    } finally {
      setProcessing(false);
    }
  };

  const handleEmergencyStop = async () => {
    if (
      !confirm(
        'Are you sure you want to activate Emergency Stop? This will halt all in-progress content and bookings.',
      )
    ) {
      return;
    }

    setError('');
    setProcessing(true);

    try {
      const token = localStorage.getItem('ff4u_token');
      const response = await fetch('/api/safety/emergency-stop', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-ff4u-token': token,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to activate emergency stop');
      }

      setEmergencyMode(true);
      alert('Emergency Stop activated. All in-progress activities have been halted.');
    } catch (error) {
      console.error('Emergency stop error:', error);
      setError('Failed to activate emergency stop');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FBFBFB] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto"></div>
          <p className="font-inter text-sm text-[#4D4D4D] mt-4">Loading safety center...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FBFBFB] font-inter">
      {/* Google Fonts */}
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:wght@400;500;600;700&display=swap"
        rel="stylesheet"
      />

      {/* Emergency Mode Banner */}
      {emergencyMode && (
        <div className="w-full bg-red-600 text-white px-4 py-3">
          <div className="max-w-6xl mx-auto flex items-center justify-center">
            <StopCircle className="w-5 h-5 mr-2" />
            <span className="font-inter font-medium text-sm">
              EMERGENCY MODE ACTIVE - All activities have been halted
            </span>
          </div>
        </div>
      )}

      {/* Compliance Banner */}
      <div className="w-full bg-amber-50 border-b border-amber-200 px-4 py-2">
        <div className="max-w-6xl mx-auto text-center">
          <span className="font-inter text-sm text-amber-800">
            Demo Safety Center • RedEye™ monitoring placeholder • Emergency protocols simulation
          </span>
        </div>
      </div>

      {/* Header */}
      <header className="w-full bg-white border-b border-[#E8E8E8]">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <div className="font-playfair font-bold text-2xl text-black mr-8">FF4U</div>
            <nav className="flex space-x-6">
              {user?.role === 'performer' && (
                <>
                  <a
                    href="/studio"
                    className="font-inter text-sm text-[#4D4D4D] hover:text-black transition-colors"
                  >
                    Studio
                  </a>
                  <a
                    href="/publish"
                    className="font-inter text-sm text-[#4D4D4D] hover:text-black transition-colors"
                  >
                    Publish
                  </a>
                </>
              )}
              <a href="/safety" className="font-inter text-sm text-black font-medium">
                Safety
              </a>
              {(user?.role === 'safety_officer' || user?.role === 'admin') && (
                <a
                  href="/moderation"
                  className="font-inter text-sm text-[#4D4D4D] hover:text-black transition-colors"
                >
                  Moderation
                </a>
              )}
              {user?.role === 'admin' && (
                <a
                  href="/admin"
                  className="font-inter text-sm text-[#4D4D4D] hover:text-black transition-colors"
                >
                  Admin
                </a>
              )}
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            <span className="font-inter text-sm text-[#4D4D4D] capitalize">
              {user?.role?.replace('_', ' ')} • {user?.email}
            </span>
            <a
              href="/"
              className="font-inter text-sm text-black hover:text-gray-600 transition-colors"
            >
              Logout
            </a>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="font-playfair font-medium text-3xl md:text-4xl text-black mb-4">
            Safety Center
          </h1>
          <p className="font-inter text-lg text-[#4D4D4D] mb-6">
            Monitor platform safety, manage emergency protocols, and maintain evidence logging.
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-sm flex items-center">
            <AlertTriangle className="w-4 h-4 text-red-600 mr-2" />
            <span className="font-inter text-sm text-red-800">{error}</span>
          </div>
        )}

        {/* Safety Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg border border-[#E8E8E8] p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <Shield
                  className={`w-5 h-5 mr-2 ${redeyeActive ? 'text-green-600' : 'text-gray-400'}`}
                />
                <span className="font-inter text-sm text-black">RedEye™ Monitoring</span>
              </div>
              <span
                className={`text-xs px-2 py-1 rounded-full ${
                  redeyeActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}
              >
                {redeyeActive ? 'Active' : 'Inactive'}
              </span>
            </div>
            <p className="font-inter text-xs text-[#4D4D4D] mb-4">
              AI-powered content monitoring and threat detection
            </p>
            <button
              onClick={handleRedeyeToggle}
              disabled={processing}
              className={`w-full font-inter text-sm px-4 py-2 rounded-sm transition-colors ${
                redeyeActive
                  ? 'bg-red-600 text-white hover:bg-red-700'
                  : 'bg-green-600 text-white hover:bg-green-700'
              } disabled:opacity-50`}
            >
              {processing ? 'Processing...' : redeyeActive ? 'Deactivate' : 'Activate'}
            </button>
          </div>

          <div className="bg-white rounded-lg border border-[#E8E8E8] p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <Activity className="w-5 h-5 mr-2 text-blue-600" />
                <span className="font-inter text-sm text-black">System Status</span>
              </div>
              <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-800">
                Operational
              </span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-[#4D4D4D]">Content Pipeline</span>
                <span className="text-green-600">✓ Normal</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-[#4D4D4D]">User Safety</span>
                <span className="text-green-600">✓ Normal</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-[#4D4D4D]">Platform Security</span>
                <span className="text-green-600">✓ Normal</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-[#E8E8E8] p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <Users className="w-5 h-5 mr-2 text-purple-600" />
                <span className="font-inter text-sm text-black">Active Sessions</span>
              </div>
              <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800">Live</span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-[#4D4D4D]">Performers Online</span>
                <span className="text-black">3</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-[#4D4D4D]">Active Bookings</span>
                <span className="text-black">0</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-[#4D4D4D]">Content Streams</span>
                <span className="text-black">0</span>
              </div>
            </div>
          </div>
        </div>

        {/* Safety Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Evidence Management */}
          <div className="bg-white rounded-lg border border-[#E8E8E8] p-6">
            <div className="flex items-center mb-4">
              <Camera className="w-5 h-5 text-blue-600 mr-2" />
              <h2 className="font-playfair font-medium text-xl text-black">Evidence Management</h2>
            </div>
            <p className="font-inter text-sm text-[#4D4D4D] mb-6">
              Create timestamped snapshots of system state for legal compliance and incident
              investigation.
            </p>
            <button
              onClick={handleCreateSnapshot}
              disabled={processing}
              className="bg-blue-600 text-white font-inter font-semibold text-sm px-6 py-3 rounded-sm hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center"
            >
              <FileText className="w-4 h-4 mr-2" />
              {processing ? 'Creating...' : 'Create Evidence Snapshot'}
            </button>
            <p className="font-inter text-xs text-[#4D4D4D] mt-3">
              Last snapshot: Never • Total snapshots: 0
            </p>
          </div>

          {/* Emergency Controls */}
          <div className="bg-white rounded-lg border border-red-200 p-6">
            <div className="flex items-center mb-4">
              <StopCircle className="w-5 h-5 text-red-600 mr-2" />
              <h2 className="font-playfair font-medium text-xl text-black">Emergency Protocols</h2>
            </div>
            <p className="font-inter text-sm text-[#4D4D4D] mb-6">
              Immediately halt all platform activities in case of safety concerns or legal
              requirements.
            </p>
            <button
              onClick={handleEmergencyStop}
              disabled={processing || emergencyMode}
              className="bg-red-600 text-white font-inter font-semibold text-sm px-6 py-3 rounded-sm hover:bg-red-700 disabled:opacity-50 transition-colors flex items-center"
            >
              <AlertTriangle className="w-4 h-4 mr-2" />
              {processing ? 'Activating...' : emergencyMode ? 'Emergency Active' : 'Emergency Stop'}
            </button>
            <p className="font-inter text-xs text-red-700 mt-3">
              ⚠️ This will immediately stop all content and bookings
            </p>
          </div>
        </div>

        {/* Safety Guidelines */}
        <div className="bg-white rounded-lg border border-[#E8E8E8] p-6">
          <h2 className="font-playfair font-medium text-2xl text-black mb-6">
            Safety Guidelines & Protocols
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-inter font-medium text-lg text-black mb-3">
                Content Review Standards
              </h3>
              <ul className="font-inter text-sm text-[#4D4D4D] space-y-2">
                <li>• All participants must be 18+ with valid ID verification</li>
                <li>• Clear, enthusiastic consent required from all parties</li>
                <li>• No content depicting non-consensual activities</li>
                <li>• Compliance with local and federal regulations</li>
                <li>• Regular safety check-ins during live sessions</li>
              </ul>
            </div>

            <div>
              <h3 className="font-inter font-medium text-lg text-black mb-3">Emergency Response</h3>
              <ul className="font-inter text-sm text-[#4D4D4D] space-y-2">
                <li>• Immediate platform shutdown capabilities</li>
                <li>• 24/7 safety officer availability</li>
                <li>• Direct law enforcement cooperation protocols</li>
                <li>• Automated threat detection and response</li>
                <li>• Comprehensive evidence preservation systems</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-sm">
            <div className="flex items-start">
              <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-inter text-sm text-green-800">
                  <strong>Safety First:</strong> FF4U prioritizes the safety and wellbeing of all
                  platform members above all else. If you ever feel unsafe or witness concerning
                  behavior, use the emergency controls above or contact support immediately.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .font-inter {
          font-family:
            'Inter',
            -apple-system,
            BlinkMacSystemFont,
            'Segoe UI',
            'Roboto',
            sans-serif;
        }
        .font-playfair {
          font-family: 'Playfair Display', Georgia, serif;
        }
      `}</style>
    </div>
  );
}
