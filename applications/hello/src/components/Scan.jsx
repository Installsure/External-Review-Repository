import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Search, Camera, ArrowLeft } from 'lucide-react';

export default function Scan({ onCardFound }) {
  const [scanMode, setScanMode] = useState('manual'); // 'manual' or 'camera'
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm();

  const onSubmitHandle = async (data) => {
    const handle = data.handle.replace('@', ''); // Remove @ if user typed it

    try {
      // Check if the handle exists
      const response = await fetch(`/api/card/${handle}`);

      if (!response.ok) {
        if (response.status === 404) {
          setError('handle', { message: 'Handle not found' });
        } else {
          setError('handle', { message: 'Failed to find profile' });
        }
        return;
      }

      // Handle found, notify parent
      onCardFound(handle);
    } catch (error) {
      console.error('Search failed:', error);
      setError('handle', { message: 'Search failed. Please try again.' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F5F4F0] to-[#ECEAE7] dark:from-[#1A1A1A] dark:to-[#0F0F0F]">
      {/* Header */}
      <div className="pt-16 pb-8 text-center">
        <h1 className="text-2xl font-semibold text-[#0D0D0D] dark:text-white mb-4">
          Scan to Connect
        </h1>
        <p className="text-[#666666] dark:text-[#B0B0B0] px-6">
          Scan a QR code or search for someone's handle
        </p>
      </div>

      <div className="px-6">
        <div className="max-w-sm mx-auto">
          {/* Mode Toggle */}
          <div className="flex bg-[#E5E7EB] dark:bg-[#333] rounded-2xl p-1 mb-8">
            <button
              onClick={() => setScanMode('manual')}
              className={`flex-1 py-2 px-4 rounded-xl font-medium transition-colors ${
                scanMode === 'manual'
                  ? 'bg-white dark:bg-[#1E1E1E] text-[#0D0D0D] dark:text-white shadow-sm'
                  : 'text-[#666] dark:text-[#B0B0B0]'
              }`}
            >
              Search Handle
            </button>
            <button
              onClick={() => setScanMode('camera')}
              className={`flex-1 py-2 px-4 rounded-xl font-medium transition-colors ${
                scanMode === 'camera'
                  ? 'bg-white dark:bg-[#1E1E1E] text-[#0D0D0D] dark:text-white shadow-sm'
                  : 'text-[#666] dark:text-[#B0B0B0]'
              }`}
            >
              QR Camera
            </button>
          </div>

          {scanMode === 'manual' ? (
            /* Manual Handle Search */
            <div className="space-y-6">
              <form onSubmit={handleSubmit(onSubmitHandle)} className="space-y-6">
                <div>
                  <label
                    htmlFor="handle"
                    className="block text-sm font-medium text-[#333] dark:text-[#E0E0E0] mb-2"
                  >
                    Enter Handle
                  </label>
                  <div className="relative">
                    <Search
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-[#666] dark:text-[#B0B0B0]"
                      size={20}
                    />
                    <input
                      {...register('handle', {
                        required: 'Handle is required',
                        pattern: {
                          value: /^@?[a-zA-Z0-9_-]{3,20}$/,
                          message: 'Enter a valid handle (3-20 characters)',
                        },
                      })}
                      type="text"
                      id="handle"
                      placeholder="@username or username"
                      className="w-full pl-12 pr-4 py-4 rounded-2xl border border-[#E0E0E0] dark:border-[#404040] bg-white dark:bg-[#262626] text-[#0D0D0D] dark:text-white placeholder-[#999] focus:outline-none focus:ring-2 focus:ring-[#8B70F6] focus:border-transparent text-lg"
                    />
                  </div>
                  {errors.handle && (
                    <p className="text-red-500 text-sm mt-1">{errors.handle.message}</p>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full py-4 px-6 rounded-2xl bg-[#8B70F6] dark:bg-[#9D7DFF] text-white font-semibold hover:bg-[#7E64F2] dark:hover:bg-[#8B70F6] transition-colors text-lg"
                >
                  Find Profile
                </button>
              </form>
            </div>
          ) : (
            /* Camera QR Scanner */
            <div className="space-y-6">
              <div className="bg-white dark:bg-[#1E1E1E] rounded-3xl p-8 shadow-lg border border-[#E5E7EB] dark:border-[#404040] text-center">
                <div className="aspect-square bg-[#F5F5F5] dark:bg-[#2A2A2A] rounded-2xl flex items-center justify-center mb-6">
                  <div className="text-center">
                    <Camera size={48} className="text-[#666] dark:text-[#B0B0B0] mx-auto mb-4" />
                    <p className="text-[#666] dark:text-[#B0B0B0] text-sm">
                      QR code camera scanner would appear here
                    </p>
                    <p className="text-xs text-[#999] dark:text-[#666] mt-2">
                      (Camera integration not implemented in demo)
                    </p>
                  </div>
                </div>

                <p className="text-sm text-[#666666] dark:text-[#B0B0B0]">
                  Point your camera at a Hello QR code to connect instantly
                </p>
              </div>

              <div className="text-center">
                <p className="text-sm text-[#666666] dark:text-[#B0B0B0] mb-4">
                  Or use manual search instead
                </p>
                <button
                  onClick={() => setScanMode('manual')}
                  className="inline-flex items-center gap-2 text-[#8B70F6] dark:text-[#9D7DFF] font-medium hover:underline"
                >
                  <Search size={16} />
                  Search by Handle
                </button>
              </div>
            </div>
          )}

          {/* Example handles for demo */}
          <div className="mt-12 p-6 bg-[#F9F9F9] dark:bg-[#1E1E1E] rounded-2xl border border-[#E5E7EB] dark:border-[#404040]">
            <h3 className="font-medium text-[#333] dark:text-[#E0E0E0] mb-3">Demo Tip:</h3>
            <p className="text-sm text-[#666] dark:text-[#B0B0B0]">
              Try creating another profile in an incognito window and search for that handle here to
              test the connection flow.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
