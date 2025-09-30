import React, { useState, useEffect } from 'react';
import {
  Upload,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  Shield,
  FileText,
  DollarSign,
  Tag,
  Save,
  Send,
} from 'lucide-react';

export default function PublishPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    tags: [],
    price_cents: 2999, // $29.99 default
    media_placeholder: '',
    consent_confirmed: false,
    legal_confirmed: false,
    safety_acknowledged: false,
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchUserData();
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
      setLoading(false);
    } catch (error) {
      console.error('Error fetching user:', error);
      window.location.href = '/auth/login';
    }
  };

  const handleTagInput = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const tag = e.target.value.trim();
      if (tag && !formData.tags.includes(tag)) {
        setFormData((prev) => ({
          ...prev,
          tags: [...prev.tags, tag],
        }));
        e.target.value = '';
      }
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleSaveDraft = async () => {
    setError('');
    setSubmitting(true);

    try {
      const token = localStorage.getItem('ff4u_token');
      const response = await fetch('/api/contents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-ff4u-token': token,
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          tags: formData.tags,
          price_cents: formData.price_cents,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save draft');
      }

      const data = await response.json();

      // Redirect to studio
      window.location.href = '/studio';
    } catch (error) {
      console.error('Save draft error:', error);
      setError('Failed to save draft. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmitForReview = async () => {
    setError('');

    if (!formData.consent_confirmed || !formData.legal_confirmed || !formData.safety_acknowledged) {
      setError('Please confirm all consent and safety requirements');
      return;
    }

    setSubmitting(true);

    try {
      const token = localStorage.getItem('ff4u_token');

      // First create the content
      const createResponse = await fetch('/api/contents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-ff4u-token': token,
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          tags: formData.tags,
          price_cents: formData.price_cents,
        }),
      });

      if (!createResponse.ok) {
        throw new Error('Failed to create content');
      }

      const contentData = await createResponse.json();

      // Then submit for review
      const submitResponse = await fetch(`/api/consents/${contentData.content.id}/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-ff4u-token': token,
        },
      });

      if (!submitResponse.ok) {
        throw new Error('Failed to submit for review');
      }

      // Redirect to studio with success message
      window.location.href = '/studio?submitted=true';
    } catch (error) {
      console.error('Submit for review error:', error);
      setError('Failed to submit for review. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FBFBFB] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto"></div>
          <p className="font-inter text-sm text-[#4D4D4D] mt-4">Loading publish wizard...</p>
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
            Demo Publishing Wizard • No real media uploads • Consent workflow placeholder
          </span>
        </div>
      </div>

      {/* Header */}
      <header className="w-full bg-white border-b border-[#E8E8E8]">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <div className="font-playfair font-bold text-2xl text-black mr-8">FF4U</div>
            <nav className="flex space-x-6">
              <a
                href="/studio"
                className="font-inter text-sm text-[#4D4D4D] hover:text-black transition-colors"
              >
                Studio
              </a>
              <a href="/publish" className="font-inter text-sm text-black font-medium">
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

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {[
              { num: 1, title: 'Content Details', icon: FileText },
              { num: 2, title: 'Media Upload', icon: Upload },
              { num: 3, title: 'Consent & Safety', icon: Shield },
            ].map((stepItem, index) => {
              const IconComponent = stepItem.icon;
              return (
                <div key={stepItem.num} className="flex items-center">
                  <div
                    className={`flex items-center justify-center w-10 h-10 rounded-full ${
                      step >= stepItem.num ? 'bg-black text-white' : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <div className="ml-3">
                    <div className="font-inter text-sm font-medium text-black">
                      Step {stepItem.num}
                    </div>
                    <div className="font-inter text-xs text-[#4D4D4D]">{stepItem.title}</div>
                  </div>
                  {index < 2 && <ArrowRight className="w-5 h-5 text-gray-400 mx-6" />}
                </div>
              );
            })}
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-lg border border-[#E8E8E8] p-8">
          {step === 1 && (
            <div>
              <h2 className="font-playfair font-medium text-2xl text-black mb-6">
                Content Details
              </h2>

              <div className="space-y-6">
                {/* Title */}
                <div>
                  <label className="block font-inter font-medium text-sm text-black mb-2">
                    Content Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        title: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-3 border border-[#DCDCDC] rounded-sm font-inter text-sm focus:outline-none focus:border-black transition-colors"
                    placeholder="Enter a compelling title for your content"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block font-inter font-medium text-sm text-black mb-2">
                    Description *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formData.description}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-3 border border-[#DCDCDC] rounded-sm font-inter text-sm focus:outline-none focus:border-black transition-colors resize-none"
                    placeholder="Describe your content in detail. Be clear about what viewers can expect."
                  />
                </div>

                {/* Tags */}
                <div>
                  <label className="block font-inter font-medium text-sm text-black mb-2">
                    Tags
                  </label>
                  <input
                    type="text"
                    onKeyDown={handleTagInput}
                    className="w-full px-4 py-3 border border-[#DCDCDC] rounded-sm font-inter text-sm focus:outline-none focus:border-black transition-colors"
                    placeholder="Type tags and press Enter or comma to add (e.g., fantasy, roleplay)"
                  />
                  {formData.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {formData.tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                        >
                          <Tag className="w-3 h-3 mr-1" />
                          {tag}
                          <button
                            onClick={() => removeTag(tag)}
                            className="ml-1 text-gray-500 hover:text-gray-700"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Price */}
                <div>
                  <label className="block font-inter font-medium text-sm text-black mb-2">
                    Price *
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-3 w-4 h-4 text-[#4D4D4D]" />
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      required
                      value={(formData.price_cents / 100).toFixed(2)}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          price_cents: Math.round(parseFloat(e.target.value) * 100),
                        }))
                      }
                      className="w-full pl-10 pr-4 py-3 border border-[#DCDCDC] rounded-sm font-inter text-sm focus:outline-none focus:border-black transition-colors"
                      placeholder="29.99"
                    />
                  </div>
                  <p className="font-inter text-xs text-[#4D4D4D] mt-1">
                    Set your content price. Platform takes 20% commission.
                  </p>
                </div>
              </div>

              <div className="flex justify-between mt-8">
                <a
                  href="/studio"
                  className="font-inter text-sm text-[#4D4D4D] hover:text-black transition-colors"
                >
                  ← Back to Studio
                </a>
                <button
                  onClick={() => setStep(2)}
                  disabled={!formData.title || !formData.description}
                  className="bg-black text-white font-inter font-semibold text-sm px-6 py-3 rounded-sm hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
                >
                  Continue
                  <ArrowRight className="w-4 h-4 ml-2" />
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 className="font-playfair font-medium text-2xl text-black mb-6">Media Upload</h2>

              {/* Media Upload Placeholder */}
              <div className="border-2 border-dashed border-[#DCDCDC] rounded-lg p-12 text-center">
                <Upload className="w-16 h-16 text-[#4D4D4D] mx-auto mb-4" />
                <h3 className="font-inter font-medium text-lg text-black mb-2">
                  Media Upload Coming Soon
                </h3>
                <p className="font-inter text-sm text-[#4D4D4D] mb-4">
                  In production, this would handle secure media uploads with content scanning.
                </p>
                <div className="bg-yellow-50 border border-yellow-200 rounded-sm p-4 text-left max-w-md mx-auto">
                  <div className="flex items-start">
                    <AlertTriangle className="w-5 h-5 text-yellow-600 mr-3 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-inter text-sm text-yellow-800">
                        <strong>Demo Note:</strong> This is a placeholder. Real implementation would
                        include:
                      </p>
                      <ul className="font-inter text-xs text-yellow-700 mt-2 space-y-1">
                        <li>• Secure file upload with virus scanning</li>
                        <li>• Content verification and thumbnails</li>
                        <li>• Automatic content tagging and metadata</li>
                        <li>• Format conversion and optimization</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Placeholder Input */}
                <div className="mt-6">
                  <input
                    type="text"
                    value={formData.media_placeholder}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        media_placeholder: e.target.value,
                      }))
                    }
                    className="max-w-md px-4 py-2 border border-[#DCDCDC] rounded-sm font-inter text-sm focus:outline-none focus:border-black transition-colors"
                    placeholder="Placeholder: Describe your media content"
                  />
                </div>
              </div>

              <div className="flex justify-between mt-8">
                <button
                  onClick={() => setStep(1)}
                  className="font-inter text-sm text-[#4D4D4D] hover:text-black transition-colors"
                >
                  ← Previous
                </button>
                <button
                  onClick={() => setStep(3)}
                  className="bg-black text-white font-inter font-semibold text-sm px-6 py-3 rounded-sm hover:bg-gray-800 transition-colors flex items-center"
                >
                  Continue
                  <ArrowRight className="w-4 h-4 ml-2" />
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h2 className="font-playfair font-medium text-2xl text-black mb-6">
                Consent & Safety Verification
              </h2>

              <div className="space-y-6">
                {/* Consent Confirmation */}
                <div className="p-4 bg-red-50 border border-red-200 rounded-sm">
                  <div className="flex items-start">
                    <Shield className="w-5 h-5 text-red-600 mr-3 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <label className="flex items-start cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.consent_confirmed}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              consent_confirmed: e.target.checked,
                            }))
                          }
                          className="mr-3 mt-1"
                          required
                        />
                        <span className="font-inter text-sm text-red-800">
                          <strong>Performer Consent:</strong> I confirm that I have given full,
                          informed, and enthusiastic consent to create and distribute this content.
                          I understand I can revoke this consent at any time.
                        </span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Legal Confirmation */}
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-sm">
                  <div className="flex items-start">
                    <FileText className="w-5 h-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <label className="flex items-start cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.legal_confirmed}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              legal_confirmed: e.target.checked,
                            }))
                          }
                          className="mr-3 mt-1"
                          required
                        />
                        <span className="font-inter text-sm text-blue-800">
                          <strong>Legal Compliance:</strong> I confirm that this content complies
                          with all applicable laws, that all participants are 18+, and that I have
                          proper documentation and releases for all content.
                        </span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Safety Acknowledgment */}
                <div className="p-4 bg-green-50 border border-green-200 rounded-sm">
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <label className="flex items-start cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.safety_acknowledged}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              safety_acknowledged: e.target.checked,
                            }))
                          }
                          className="mr-3 mt-1"
                          required
                        />
                        <span className="font-inter text-sm text-green-800">
                          <strong>Safety Protocols:</strong> I acknowledge that this content will go
                          through safety review by our moderation team and safety officers before
                          publication. I understand the review process may take 24-48 hours.
                        </span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Review Process Info */}
                <div className="p-4 bg-gray-50 border border-gray-200 rounded-sm">
                  <h3 className="font-inter font-medium text-sm text-black mb-2">
                    What happens next?
                  </h3>
                  <ol className="font-inter text-sm text-[#4D4D4D] space-y-1">
                    <li>1. Your content will be reviewed by our safety team</li>
                    <li>2. Our moderation team will verify compliance</li>
                    <li>3. Once both approvals are received, content moves to "Approved" status</li>
                    <li>4. You can then publish the content to make it live</li>
                  </ol>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-sm flex items-center">
                  <AlertTriangle className="w-4 h-4 text-red-600 mr-2" />
                  <span className="font-inter text-sm text-red-800">{error}</span>
                </div>
              )}

              <div className="flex justify-between mt-8">
                <button
                  onClick={() => setStep(2)}
                  className="font-inter text-sm text-[#4D4D4D] hover:text-black transition-colors"
                >
                  ← Previous
                </button>
                <div className="flex space-x-3">
                  <button
                    onClick={handleSaveDraft}
                    disabled={submitting || !formData.title || !formData.description}
                    className="border border-black text-black font-inter font-semibold text-sm px-6 py-3 rounded-sm hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {submitting ? 'Saving...' : 'Save as Draft'}
                  </button>
                  <button
                    onClick={handleSubmitForReview}
                    disabled={
                      submitting ||
                      !formData.consent_confirmed ||
                      !formData.legal_confirmed ||
                      !formData.safety_acknowledged
                    }
                    className="bg-black text-white font-inter font-semibold text-sm px-6 py-3 rounded-sm hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    {submitting ? 'Submitting...' : 'Submit for Review'}
                  </button>
                </div>
              </div>
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
