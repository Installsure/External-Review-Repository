import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../lib/api';

export default function Viewer() {
  const { urn } = useParams<{ urn: string }>();
  const [manifest, setManifest] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [useFallback, setUseFallback] = useState(false);

  useEffect(() => {
    if (urn) {
      loadManifest(urn);
    } else {
      // No URN provided, use fallback
      setUseFallback(true);
      setLoading(false);
    }
  }, [urn]);

  const loadManifest = async (urn: string) => {
    try {
      const data = await api.getManifest(urn);
      setManifest(data);
    } catch (err: any) {
      setError(err.message);
      // On error, fall back to demo plan
      setUseFallback(true);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Render fallback demo plan if no URN or error
  if (useFallback) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Blueprint Viewer</h1>
          {error && (
            <div className="mt-2 bg-yellow-50 border border-yellow-200 rounded-md p-3">
              <p className="text-sm text-yellow-800">
                <strong>Note:</strong> {error}. Showing demo blueprint instead.
              </p>
            </div>
          )}
          {!urn && (
            <p className="mt-1 text-sm text-gray-600">Showing sample floor plan</p>
          )}
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Sample Plan A</h3>
          <div className="border rounded-lg overflow-hidden bg-gray-50">
            <img
              src="/demo-assets/plan1.svg"
              alt="Sample Floor Plan"
              className="w-full h-auto"
              style={{ maxHeight: '800px', objectFit: 'contain' }}
            />
          </div>
          <p className="mt-4 text-sm text-gray-500 text-center">
            Demo blueprint: Downtown Office Complex - Sheet A-101
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">3D Model Viewer</h1>
        <p className="mt-1 text-sm text-gray-600">URN: {urn}</p>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Model Status</h3>

        {manifest ? (
          <div className="space-y-4">
            <div className="border rounded-lg p-4">
              <h4 className="font-medium text-gray-900">Manifest Data</h4>
              <pre className="mt-2 text-sm text-gray-600 bg-gray-50 p-3 rounded overflow-auto">
                {JSON.stringify(manifest, null, 2)}
              </pre>
            </div>

            <div className="text-center">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-8">
                <svg
                  className="mx-auto h-12 w-12 text-blue-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">3D Viewer Placeholder</h3>
                <p className="mt-1 text-sm text-gray-500">
                  The actual Forge Viewer would be integrated here
                </p>
                <div className="mt-4">
                  <button
                    onClick={() =>
                      window.open(`https://viewer.autodesk.com/viewer?urn=${urn}`, '_blank')
                    }
                    className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
                  >
                    Open in Forge Viewer
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center text-gray-500">
            <p>No manifest data available</p>
          </div>
        )}
      </div>
    </div>
  );
}
