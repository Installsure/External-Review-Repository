import React, { useState, useEffect } from 'react';
import {
  Upload,
  Edit3,
  Eye,
  DollarSign,
  Shield,
  Clock,
  Plus,
  CheckCircle,
  XCircle,
  AlertTriangle,
} from 'lucide-react';

export default function StudioPage() {
  const [user, setUser] = useState(null);
  const [contents, setContents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUserData();
    fetchContents();
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
      if (data.user.role !== 'performer') {
        window.location.href = '/';
        return;
      }

      setUser(data.user);
    } catch (error) {
      console.error('Error fetching user:', error);
      window.location.href = '/auth/login';
    }
  };

  const fetchContents = async () => {
    try {
      const token = localStorage.getItem('ff4u_token');
      const response = await fetch('/api/contents', {
        headers: { 'x-ff4u-token': token },
      });

      if (response.ok) {
        const data = await response.json();
        setContents(data.contents || []);
      }
    } catch (error) {
      console.error('Error fetching contents:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      DRAFT: { color: 'bg-gray-100 text-gray-800', icon: Edit3, text: 'Draft' },
      REVIEW: {
        color: 'bg-yellow-100 text-yellow-800',
        icon: Clock,
        text: 'Under Review',
      },
      APPROVED: {
        color: 'bg-green-100 text-green-800',
        icon: CheckCircle,
        text: 'Approved',
      },
      PUBLISHED: {
        color: 'bg-blue-100 text-blue-800',
        icon: Eye,
        text: 'Published',
      },
      REJECTED: {
        color: 'bg-red-100 text-red-800',
        icon: XCircle,
        text: 'Rejected',
      },
    };

    const badge = badges[status];
    const IconComponent = badge.icon;

    return (
      <span
        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${badge.color}`}
      >
        <IconComponent className="w-3 h-3 mr-1" />
        {badge.text}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FBFBFB] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto"></div>
          <p className="font-inter text-sm text-[#4D4D4D] mt-4">Loading studio...</p>
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

      {/* Compliance Banner */}
      <div className="w-full bg-amber-50 border-b border-amber-200 px-4 py-2">
        <div className="max-w-6xl mx-auto text-center">
          <span className="font-inter text-sm text-amber-800">
            Demo Platform • Non-explicit content only • Integrate real media uploads in production
          </span>
        </div>
      </div>

      {/* Header */}
      <header className="w-full bg-white border-b border-[#E8E8E8]">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <div className="font-playfair font-bold text-2xl text-black mr-8">FF4U</div>
            <nav className="flex space-x-6">
              <a href="/studio" className="font-inter text-sm text-black font-medium">
                Studio
              </a>
              <a
                href="/publish"
                className="font-inter text-sm text-[#4D4D4D] hover:text-black transition-colors"
              >
                Publish
              </a>
              <a
                href="/safety"
                className="font-inter text-sm text-[#4D4D4D] hover:text-black transition-colors"
              >
                Safety
              </a>
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            <span className="font-inter text-sm text-[#4D4D4D]">{user?.email}</span>
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
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="font-playfair font-medium text-3xl md:text-4xl text-black mb-4">
            Creator Studio
          </h1>
          <p className="font-inter text-lg text-[#4D4D4D] mb-6">
            Manage your content, track earnings, and maintain safety compliance.
          </p>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg border border-[#E8E8E8] p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="font-inter text-sm text-[#4D4D4D]">Total Content</span>
                <Upload className="w-5 h-5 text-black" />
              </div>
              <div className="font-inter text-2xl font-bold text-black">{contents.length}</div>
            </div>

            <div className="bg-white rounded-lg border border-[#E8E8E8] p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="font-inter text-sm text-[#4D4D4D]">Published</span>
                <Eye className="w-5 h-5 text-green-600" />
              </div>
              <div className="font-inter text-2xl font-bold text-black">
                {contents.filter((c) => c.status === 'PUBLISHED').length}
              </div>
            </div>

            <div className="bg-white rounded-lg border border-[#E8E8E8] p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="font-inter text-sm text-[#4D4D4D]">Under Review</span>
                <Clock className="w-5 h-5 text-yellow-600" />
              </div>
              <div className="font-inter text-2xl font-bold text-black">
                {contents.filter((c) => c.status === 'REVIEW').length}
              </div>
            </div>

            <div className="bg-white rounded-lg border border-[#E8E8E8] p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="font-inter text-sm text-[#4D4D4D]">Earnings</span>
                <DollarSign className="w-5 h-5 text-green-600" />
              </div>
              <div className="font-inter text-2xl font-bold text-black">$0.00</div>
              <div className="font-inter text-xs text-[#4D4D4D] mt-1">Connect payments in prod</div>
            </div>
          </div>
        </div>

        {/* Content Management */}
        <div className="bg-white rounded-lg border border-[#E8E8E8] p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-playfair font-medium text-2xl text-black">Your Content</h2>
            <a
              href="/publish"
              className="bg-black text-white font-inter font-semibold text-sm px-4 py-2 rounded-sm hover:bg-gray-800 transition-colors inline-flex items-center"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create New
            </a>
          </div>

          {contents.length === 0 ? (
            <div className="text-center py-12">
              <Upload className="w-12 h-12 text-[#4D4D4D] mx-auto mb-4" />
              <h3 className="font-inter font-medium text-lg text-black mb-2">No content yet</h3>
              <p className="font-inter text-sm text-[#4D4D4D] mb-6">
                Create your first piece of content to get started.
              </p>
              <a
                href="/publish"
                className="bg-black text-white font-inter font-semibold text-sm px-6 py-3 rounded-sm hover:bg-gray-800 transition-colors inline-flex items-center"
              >
                <Plus className="w-4 h-4 mr-2" />
                Start Creating
              </a>
            </div>
          ) : (
            <div className="space-y-4">
              {contents.map((content) => (
                <div key={content.id} className="border border-[#E8E8E8] rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-inter font-medium text-lg text-black mb-1">
                        {content.title}
                      </h3>
                      <p className="font-inter text-sm text-[#4D4D4D] line-clamp-2">
                        {content.description}
                      </p>
                    </div>
                    <div className="ml-4 flex items-center space-x-3">
                      {getStatusBadge(content.status)}
                      <span className="font-inter text-sm text-[#4D4D4D]">
                        ${(content.price_cents / 100).toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-[#4D4D4D]">
                    <div className="flex items-center space-x-4">
                      <span>Created: {new Date(content.created_at).toLocaleDateString()}</span>
                      {content.tags && content.tags.length > 0 && (
                        <span>Tags: {content.tags.join(', ')}</span>
                      )}
                    </div>

                    <div className="flex items-center space-x-2">
                      {content.status === 'DRAFT' && (
                        <button className="text-black hover:text-gray-600 transition-colors">
                          <Edit3 className="w-4 h-4" />
                        </button>
                      )}
                      {(content.status === 'PUBLISHED' || content.status === 'APPROVED') && (
                        <button className="text-black hover:text-gray-600 transition-colors">
                          <Eye className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Safety Compliance */}
        <div className="mt-8 bg-white rounded-lg border border-[#E8E8E8] p-6">
          <div className="flex items-center mb-4">
            <Shield className="w-5 h-5 text-green-600 mr-2" />
            <h2 className="font-playfair font-medium text-xl text-black">Safety Compliance</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-inter font-medium text-sm text-black mb-2">Profile Status</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-inter text-sm text-[#4D4D4D]">KYC Verification</span>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      user?.profile?.kyc_status === 'verified'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {user?.profile?.kyc_status || 'Pending'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-inter text-sm text-[#4D4D4D]">Terms Accepted</span>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      user?.profile?.consent_tos
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {user?.profile?.consent_tos ? 'Yes' : 'No'}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-inter font-medium text-sm text-black mb-2">Quick Actions</h3>
              <div className="space-y-2">
                <a
                  href="/safety"
                  className="block font-inter text-sm text-black hover:text-gray-600 transition-colors"
                >
                  → Safety Center
                </a>
                <a
                  href="/legal"
                  className="block font-inter text-sm text-black hover:text-gray-600 transition-colors"
                >
                  → Legal Documentation
                </a>
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
