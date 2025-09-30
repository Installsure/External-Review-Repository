import React, { useState, useEffect } from 'react';
import {
  Shield,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Eye,
  User,
  Calendar,
  DollarSign,
  Tag,
  FileText,
} from 'lucide-react';

export default function ModerationPage() {
  const [user, setUser] = useState(null);
  const [contents, setContents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [processingId, setProcessingId] = useState(null);

  useEffect(() => {
    fetchUserData();
    fetchContentForReview();
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
      if (!['moderator', 'safety_officer', 'admin'].includes(data.user.role)) {
        window.location.href = '/';
        return;
      }

      setUser(data.user);
    } catch (error) {
      console.error('Error fetching user:', error);
      window.location.href = '/auth/login';
    }
  };

  const fetchContentForReview = async () => {
    try {
      const token = localStorage.getItem('ff4u_token');
      const response = await fetch('/api/moderation/queue', {
        headers: { 'x-ff4u-token': token },
      });

      if (response.ok) {
        const data = await response.json();
        setContents(data.contents || []);
      }
    } catch (error) {
      console.error('Error fetching content for review:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApproval = async (contentId, approvalType, approved) => {
    setError('');
    setProcessingId(contentId);

    try {
      const token = localStorage.getItem('ff4u_token');
      const response = await fetch(`/api/moderation/${contentId}/approve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-ff4u-token': token,
        },
        body: JSON.stringify({
          approval_type: approvalType,
          approved,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to process approval');
      }

      // Refresh the content list
      await fetchContentForReview();
    } catch (error) {
      console.error('Approval error:', error);
      setError('Failed to process approval. Please try again.');
    } finally {
      setProcessingId(null);
    }
  };

  const getStatusBadge = (content) => {
    const { safety_approved, moderator_approved } = content.consent || {};

    if (safety_approved && moderator_approved) {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <CheckCircle className="w-3 h-3 mr-1" />
          Fully Approved
        </span>
      );
    } else if (safety_approved) {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
          <Shield className="w-3 h-3 mr-1" />
          Safety Approved
        </span>
      );
    } else if (moderator_approved) {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          <Eye className="w-3 h-3 mr-1" />
          Mod Approved
        </span>
      );
    }

    return (
      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
        <Clock className="w-3 h-3 mr-1" />
        Pending Review
      </span>
    );
  };

  const canApprove = (approvalType) => {
    if (user?.role === 'admin') return true;
    if (approvalType === 'safety' && user?.role === 'safety_officer') return true;
    if (approvalType === 'moderation' && user?.role === 'moderator') return true;
    return false;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FBFBFB] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto"></div>
          <p className="font-inter text-sm text-[#4D4D4D] mt-4">Loading moderation queue...</p>
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
            Demo Moderation Dashboard • Content review workflow placeholder
          </span>
        </div>
      </div>

      {/* Header */}
      <header className="w-full bg-white border-b border-[#E8E8E8]">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <div className="font-playfair font-bold text-2xl text-black mr-8">FF4U</div>
            <nav className="flex space-x-6">
              {user?.role === 'moderator' && (
                <a href="/moderation" className="font-inter text-sm text-black font-medium">
                  Moderation
                </a>
              )}
              {(user?.role === 'safety_officer' || user?.role === 'admin') && (
                <a
                  href="/safety"
                  className="font-inter text-sm text-[#4D4D4D] hover:text-black transition-colors"
                >
                  Safety
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
            Content Moderation
          </h1>
          <p className="font-inter text-lg text-[#4D4D4D] mb-6">
            Review and approve content submissions to ensure safety and compliance.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg border border-[#E8E8E8] p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="font-inter text-sm text-[#4D4D4D]">Pending Review</span>
                <Clock className="w-5 h-5 text-yellow-600" />
              </div>
              <div className="font-inter text-2xl font-bold text-black">{contents.length}</div>
            </div>

            <div className="bg-white rounded-lg border border-[#E8E8E8] p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="font-inter text-sm text-[#4D4D4D]">Safety Approved</span>
                <Shield className="w-5 h-5 text-green-600" />
              </div>
              <div className="font-inter text-2xl font-bold text-black">
                {contents.filter((c) => c.consent?.safety_approved).length}
              </div>
            </div>

            <div className="bg-white rounded-lg border border-[#E8E8E8] p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="font-inter text-sm text-[#4D4D4D]">Mod Approved</span>
                <Eye className="w-5 h-5 text-blue-600" />
              </div>
              <div className="font-inter text-2xl font-bold text-black">
                {contents.filter((c) => c.consent?.moderator_approved).length}
              </div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-sm flex items-center">
            <AlertTriangle className="w-4 h-4 text-red-600 mr-2" />
            <span className="font-inter text-sm text-red-800">{error}</span>
          </div>
        )}

        {/* Content Review Queue */}
        <div className="bg-white rounded-lg border border-[#E8E8E8] p-6">
          <h2 className="font-playfair font-medium text-2xl text-black mb-6">Review Queue</h2>

          {contents.length === 0 ? (
            <div className="text-center py-12">
              <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <h3 className="font-inter font-medium text-lg text-black mb-2">All caught up!</h3>
              <p className="font-inter text-sm text-[#4D4D4D]">
                No content currently waiting for review.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {contents.map((content) => (
                <div key={content.id} className="border border-[#E8E8E8] rounded-lg p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <h3 className="font-inter font-medium text-lg text-black mr-3">
                          {content.title}
                        </h3>
                        {getStatusBadge(content)}
                      </div>
                      <p className="font-inter text-sm text-[#4D4D4D] mb-3">
                        {content.description}
                      </p>

                      {/* Content Metadata */}
                      <div className="flex flex-wrap items-center text-xs text-[#4D4D4D] gap-4 mb-4">
                        <div className="flex items-center">
                          <User className="w-3 h-3 mr-1" />
                          {content.performer_email}
                        </div>
                        <div className="flex items-center">
                          <Calendar className="w-3 h-3 mr-1" />
                          Submitted: {new Date(content.created_at).toLocaleDateString()}
                        </div>
                        <div className="flex items-center">
                          <DollarSign className="w-3 h-3 mr-1" />$
                          {(content.price_cents / 100).toFixed(2)}
                        </div>
                        {content.tags && content.tags.length > 0 && (
                          <div className="flex items-center">
                            <Tag className="w-3 h-3 mr-1" />
                            {content.tags.join(', ')}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Review Actions */}
                  <div className="border-t border-[#E8E8E8] pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Safety Review */}
                      <div className="p-4 bg-red-50 border border-red-200 rounded-sm">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center">
                            <Shield className="w-4 h-4 text-red-600 mr-2" />
                            <span className="font-inter font-medium text-sm text-red-800">
                              Safety Review
                            </span>
                          </div>
                          {content.consent?.safety_approved ? (
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          ) : (
                            <Clock className="w-4 h-4 text-yellow-600" />
                          )}
                        </div>

                        {!content.consent?.safety_approved && canApprove('safety') && (
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleApproval(content.id, 'safety', true)}
                              disabled={processingId === content.id}
                              className="bg-green-600 text-white font-inter text-xs px-3 py-1 rounded-sm hover:bg-green-700 disabled:opacity-50 transition-colors"
                            >
                              Approve Safety
                            </button>
                            <button
                              onClick={() => handleApproval(content.id, 'safety', false)}
                              disabled={processingId === content.id}
                              className="bg-red-600 text-white font-inter text-xs px-3 py-1 rounded-sm hover:bg-red-700 disabled:opacity-50 transition-colors"
                            >
                              Reject
                            </button>
                          </div>
                        )}

                        {content.consent?.safety_approved && (
                          <span className="font-inter text-xs text-green-700">
                            Safety approved ✓
                          </span>
                        )}

                        {!canApprove('safety') && !content.consent?.safety_approved && (
                          <span className="font-inter text-xs text-red-700">
                            Requires safety officer approval
                          </span>
                        )}
                      </div>

                      {/* Moderation Review */}
                      <div className="p-4 bg-blue-50 border border-blue-200 rounded-sm">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center">
                            <Eye className="w-4 h-4 text-blue-600 mr-2" />
                            <span className="font-inter font-medium text-sm text-blue-800">
                              Moderation Review
                            </span>
                          </div>
                          {content.consent?.moderator_approved ? (
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          ) : (
                            <Clock className="w-4 h-4 text-yellow-600" />
                          )}
                        </div>

                        {!content.consent?.moderator_approved && canApprove('moderation') && (
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleApproval(content.id, 'moderation', true)}
                              disabled={processingId === content.id}
                              className="bg-green-600 text-white font-inter text-xs px-3 py-1 rounded-sm hover:bg-green-700 disabled:opacity-50 transition-colors"
                            >
                              Approve Content
                            </button>
                            <button
                              onClick={() => handleApproval(content.id, 'moderation', false)}
                              disabled={processingId === content.id}
                              className="bg-red-600 text-white font-inter text-xs px-3 py-1 rounded-sm hover:bg-red-700 disabled:opacity-50 transition-colors"
                            >
                              Reject
                            </button>
                          </div>
                        )}

                        {content.consent?.moderator_approved && (
                          <span className="font-inter text-xs text-green-700">
                            Moderation approved ✓
                          </span>
                        )}

                        {!canApprove('moderation') && !content.consent?.moderator_approved && (
                          <span className="font-inter text-xs text-blue-700">
                            Requires moderator approval
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Fully Approved Status */}
                    {content.consent?.safety_approved && content.consent?.moderator_approved && (
                      <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-sm flex items-center">
                        <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                        <span className="font-inter text-sm text-green-800">
                          Content fully approved and ready for publication
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
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
