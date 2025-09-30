import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  Star,
  Shield,
  User,
  DollarSign,
  Search,
  Filter,
  MapPin,
  CheckCircle,
  Heart,
} from 'lucide-react';

export default function BookPage() {
  const [user, setUser] = useState(null);
  const [performers, setPerformers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPerformer, setSelectedPerformer] = useState(null);
  const [bookingStep, setBookingStep] = useState(1);
  const [bookingData, setBookingData] = useState({
    performer_id: null,
    date: '',
    time: '',
    duration: 60,
    special_requests: '',
  });
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUserData();
    fetchPerformers();
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
      if (data.user.role !== 'client') {
        window.location.href = '/';
        return;
      }

      setUser(data.user);
    } catch (error) {
      console.error('Error fetching user:', error);
      window.location.href = '/auth/login';
    }
  };

  const fetchPerformers = async () => {
    try {
      const token = localStorage.getItem('ff4u_token');
      const response = await fetch('/api/performers', {
        headers: { 'x-ff4u-token': token },
      });

      if (response.ok) {
        const data = await response.json();
        setPerformers(data.performers || []);
      }
    } catch (error) {
      console.error('Error fetching performers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBookingSubmit = async () => {
    setError('');

    try {
      const token = localStorage.getItem('ff4u_token');
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-ff4u-token': token,
        },
        body: JSON.stringify({
          performer_id: selectedPerformer.user_id,
          slot_start: new Date(`${bookingData.date}T${bookingData.time}`).toISOString(),
          slot_end:
            new Date(`${bookingData.date}T${bookingData.time}`).getTime() +
            bookingData.duration * 60000,
          special_requests: bookingData.special_requests,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create booking');
      }

      alert('Booking request submitted successfully! The performer will be notified.');
      setSelectedPerformer(null);
      setBookingStep(1);
    } catch (error) {
      console.error('Booking error:', error);
      setError('Failed to submit booking request. Please try again.');
    }
  };

  const filteredPerformers = performers.filter(
    (performer) =>
      performer.display_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (performer.bio && performer.bio.toLowerCase().includes(searchTerm.toLowerCase())),
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FBFBFB] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto"></div>
          <p className="font-inter text-sm text-[#4D4D4D] mt-4">Loading performers...</p>
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
            Demo Booking Platform • No real sessions • Fantasy booking simulation only
          </span>
        </div>
      </div>

      {/* Header */}
      <header className="w-full bg-white border-b border-[#E8E8E8]">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <div className="font-playfair font-bold text-2xl text-black mr-8">FF4U</div>
            <nav className="flex space-x-6">
              <a href="/book" className="font-inter text-sm text-black font-medium">
                Book
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
        {!selectedPerformer ? (
          <>
            {/* Header Section */}
            <div className="mb-8">
              <h1 className="font-playfair font-medium text-3xl md:text-4xl text-black mb-4">
                Book a Session
              </h1>
              <p className="font-inter text-lg text-[#4D4D4D] mb-6">
                Browse verified creators and book personalized fantasy filming sessions.
              </p>

              {/* Search */}
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-3 w-4 h-4 text-[#4D4D4D]" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-[#DCDCDC] rounded-sm font-inter text-sm focus:outline-none focus:border-black transition-colors"
                  placeholder="Search performers..."
                />
              </div>
            </div>

            {/* Performers Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPerformers.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <User className="w-12 h-12 text-[#4D4D4D] mx-auto mb-4" />
                  <h3 className="font-inter font-medium text-lg text-black mb-2">
                    No verified performers available
                  </h3>
                  <p className="font-inter text-sm text-[#4D4D4D]">
                    Check back later for available creators.
                  </p>
                </div>
              ) : (
                filteredPerformers.map((performer) => (
                  <div
                    key={performer.id}
                    className="bg-white rounded-lg border border-[#E8E8E8] overflow-hidden hover:border-black transition-colors"
                  >
                    {/* Profile Image Placeholder */}
                    <div className="h-48 bg-gray-200 flex items-center justify-center">
                      <User className="w-16 h-16 text-gray-400" />
                    </div>

                    <div className="p-6">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-playfair font-medium text-xl text-black">
                          {performer.display_name}
                        </h3>
                        {performer.kyc_status === 'verified' && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Verified
                          </span>
                        )}
                      </div>

                      <p className="font-inter text-sm text-[#4D4D4D] mb-4 line-clamp-3">
                        {performer.bio || 'Professional performer focused on safety and consent.'}
                      </p>

                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                          <Star className="w-4 h-4 text-yellow-500 mr-1" />
                          <span className="font-inter text-sm text-black">4.9</span>
                          <span className="font-inter text-sm text-[#4D4D4D] ml-1">(23)</span>
                        </div>
                        <div className="flex items-center">
                          <Shield className="w-4 h-4 text-green-600 mr-1" />
                          <span className="font-inter text-xs text-green-600">Safety First</span>
                        </div>
                      </div>

                      <button
                        onClick={() => setSelectedPerformer(performer)}
                        disabled={performer.kyc_status !== 'verified'}
                        className="w-full bg-black text-white font-inter font-semibold text-sm py-3 rounded-sm hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                      >
                        {performer.kyc_status === 'verified'
                          ? 'Book Session'
                          : 'Verification Pending'}
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Safety Notice */}
            <div className="mt-12 p-6 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start">
                <Shield className="w-6 h-6 text-blue-600 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-inter font-medium text-lg text-blue-900 mb-2">
                    Safety & Consent First
                  </h3>
                  <p className="font-inter text-sm text-blue-800 leading-6">
                    All performers on FF4U are verified adults who have given full consent to their
                    participation. Every session is conducted under strict safety protocols with
                    emergency support available 24/7. We prioritize the wellbeing and safety of all
                    platform members above everything else.
                  </p>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="max-w-2xl mx-auto">
            {/* Booking Wizard */}
            <div className="bg-white rounded-lg border border-[#E8E8E8] p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-playfair font-medium text-2xl text-black">
                  Book with {selectedPerformer.display_name}
                </h2>
                <button
                  onClick={() => setSelectedPerformer(null)}
                  className="font-inter text-sm text-[#4D4D4D] hover:text-black transition-colors"
                >
                  ← Back to Browse
                </button>
              </div>

              {bookingStep === 1 && (
                <>
                  <h3 className="font-inter font-medium text-lg text-black mb-4">
                    Select Date & Time
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <label className="block font-inter font-medium text-sm text-black mb-2">
                        Preferred Date
                      </label>
                      <input
                        type="date"
                        value={bookingData.date}
                        onChange={(e) =>
                          setBookingData((prev) => ({
                            ...prev,
                            date: e.target.value,
                          }))
                        }
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full px-4 py-3 border border-[#DCDCDC] rounded-sm font-inter text-sm focus:outline-none focus:border-black transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block font-inter font-medium text-sm text-black mb-2">
                        Preferred Time
                      </label>
                      <input
                        type="time"
                        value={bookingData.time}
                        onChange={(e) =>
                          setBookingData((prev) => ({
                            ...prev,
                            time: e.target.value,
                          }))
                        }
                        className="w-full px-4 py-3 border border-[#DCDCDC] rounded-sm font-inter text-sm focus:outline-none focus:border-black transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block font-inter font-medium text-sm text-black mb-2">
                        Session Duration
                      </label>
                      <select
                        value={bookingData.duration}
                        onChange={(e) =>
                          setBookingData((prev) => ({
                            ...prev,
                            duration: parseInt(e.target.value),
                          }))
                        }
                        className="w-full px-4 py-3 border border-[#DCDCDC] rounded-sm font-inter text-sm focus:outline-none focus:border-black transition-colors"
                      >
                        <option value={30}>30 minutes - $150</option>
                        <option value={60}>60 minutes - $250</option>
                        <option value={90}>90 minutes - $350</option>
                        <option value={120}>2 hours - $450</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex justify-between mt-8">
                    <div></div>
                    <button
                      onClick={() => setBookingStep(2)}
                      disabled={!bookingData.date || !bookingData.time}
                      className="bg-black text-white font-inter font-semibold text-sm px-6 py-3 rounded-sm hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Continue
                    </button>
                  </div>
                </>
              )}

              {bookingStep === 2 && (
                <>
                  <h3 className="font-inter font-medium text-lg text-black mb-4">
                    Special Requests & Consent
                  </h3>

                  <div className="space-y-6">
                    <div>
                      <label className="block font-inter font-medium text-sm text-black mb-2">
                        Special Requests (Optional)
                      </label>
                      <textarea
                        rows={4}
                        value={bookingData.special_requests}
                        onChange={(e) =>
                          setBookingData((prev) => ({
                            ...prev,
                            special_requests: e.target.value,
                          }))
                        }
                        className="w-full px-4 py-3 border border-[#DCDCDC] rounded-sm font-inter text-sm focus:outline-none focus:border-black transition-colors resize-none"
                        placeholder="Describe any specific requests or preferences for your session..."
                      />
                    </div>

                    {/* Consent Confirmation */}
                    <div className="p-4 bg-red-50 border border-red-200 rounded-sm">
                      <div className="flex items-start">
                        <Shield className="w-5 h-5 text-red-600 mr-3 mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="font-inter font-medium text-sm text-red-800 mb-2">
                            Consent & Safety Acknowledgment
                          </h4>
                          <p className="font-inter text-sm text-red-800">
                            By submitting this booking request, you acknowledge that:
                          </p>
                          <ul className="font-inter text-sm text-red-800 mt-2 space-y-1 list-disc list-inside">
                            <li>All activities must be consensual and within legal boundaries</li>
                            <li>The performer has the right to refuse or modify any requests</li>
                            <li>Safety protocols will be followed at all times</li>
                            <li>Emergency support is available 24/7</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    {/* Booking Summary */}
                    <div className="p-4 bg-gray-50 border border-gray-200 rounded-sm">
                      <h4 className="font-inter font-medium text-sm text-black mb-3">
                        Booking Summary
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-[#4D4D4D]">Performer:</span>
                          <span className="text-black">{selectedPerformer.display_name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[#4D4D4D]">Date:</span>
                          <span className="text-black">{bookingData.date}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[#4D4D4D]">Time:</span>
                          <span className="text-black">{bookingData.time}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[#4D4D4D]">Duration:</span>
                          <span className="text-black">{bookingData.duration} minutes</span>
                        </div>
                        <div className="flex justify-between border-t border-gray-300 pt-2 mt-2">
                          <span className="text-black font-medium">Estimated Cost:</span>
                          <span className="text-black font-medium">
                            $
                            {bookingData.duration === 30
                              ? '150'
                              : bookingData.duration === 60
                                ? '250'
                                : bookingData.duration === 90
                                  ? '350'
                                  : '450'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {error && (
                    <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-sm flex items-center">
                      <Calendar className="w-4 h-4 text-red-600 mr-2" />
                      <span className="font-inter text-sm text-red-800">{error}</span>
                    </div>
                  )}

                  <div className="flex justify-between mt-8">
                    <button
                      onClick={() => setBookingStep(1)}
                      className="font-inter text-sm text-[#4D4D4D] hover:text-black transition-colors"
                    >
                      ← Previous
                    </button>
                    <button
                      onClick={handleBookingSubmit}
                      className="bg-black text-white font-inter font-semibold text-sm px-6 py-3 rounded-sm hover:bg-gray-800 transition-colors flex items-center"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Submit Booking Request
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
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
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}
