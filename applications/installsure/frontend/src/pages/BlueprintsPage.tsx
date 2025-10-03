import React, { useState, useEffect } from 'react';
import { FileText, Loader2 } from 'lucide-react';
import PdfCanvas from '../components/PdfCanvas';

interface Blueprint {
  id: number;
  project_id: string;
  name: string;
  sheet: string;
  file_path: string;
  width: number;
  height: number;
  created_at: string;
}

export default function BlueprintsPage() {
  const [blueprints, setBlueprints] = useState<Blueprint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeBlueprint, setActiveBlueprint] = useState<Blueprint | null>(null);

  useEffect(() => {
    const fetchBlueprints = async () => {
      try {
        // This would be replaced with actual API call
        // For now, we'll just set empty array
        setBlueprints([]);
        setLoading(false);
      } catch (err: any) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchBlueprints();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Blueprints & Plans</h1>
        <p className="mt-1 text-sm text-gray-600">View and manage project blueprints</p>
      </div>

      {blueprints.length === 0 ? (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-8 text-center">
          <FileText className="h-12 w-12 text-blue-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Blueprints Yet</h3>
          <p className="text-sm text-gray-600 mb-4">
            Upload blueprints using the sample library ingestion feature.
          </p>
          <p className="text-xs text-gray-500">
            Run: <code className="bg-white px-2 py-1 rounded">POST /api/library/ingest</code>
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar with blueprint list */}
          <div className="lg:col-span-1 space-y-2">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Available Plans</h3>
            {blueprints.map((bp) => (
              <button
                key={bp.id}
                onClick={() => setActiveBlueprint(bp)}
                className={`w-full text-left p-3 rounded-lg border transition-colors ${
                  activeBlueprint?.id === bp.id
                    ? 'bg-blue-50 border-blue-300'
                    : 'bg-white border-gray-200 hover:bg-gray-50'
                }`}
              >
                <div className="font-medium text-sm">{bp.name}</div>
                <div className="text-xs text-gray-500">{bp.sheet}</div>
              </button>
            ))}
          </div>

          {/* Main viewer area */}
          <div className="lg:col-span-3">
            {activeBlueprint ? (
              <div className="bg-white border rounded-lg p-4">
                <div className="mb-4">
                  <h2 className="text-lg font-bold text-gray-900">{activeBlueprint.name}</h2>
                  <p className="text-sm text-gray-600">Sheet: {activeBlueprint.sheet}</p>
                </div>
                <div className="border rounded-lg overflow-auto bg-gray-50 p-4">
                  {/\.pdf$/i.test(activeBlueprint.file_path) ? (
                    <PdfCanvas src={activeBlueprint.file_path} />
                  ) : (
                    <img
                      src={activeBlueprint.file_path}
                      alt={activeBlueprint.name}
                      className="object-contain w-full h-full"
                    />
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
                <p className="text-gray-600">Select a blueprint to view</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
