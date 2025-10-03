import React, { useState, useEffect } from 'react';
import { FileText, Loader2, Tag } from 'lucide-react';
import PdfCanvas from '../components/PdfCanvas';

interface Document {
  id: number;
  project_id: string;
  doc_type: string;
  title: string;
  standard: string;
  category: string;
  status: string;
  path: string;
  payload: string;
  created_at: string;
}

export default function DocsPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        // This would be replaced with actual API call
        // For now, we'll just set empty array
        setDocuments([]);
        setLoading(false);
      } catch (err: any) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchDocuments();
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
        <h1 className="text-2xl font-bold text-gray-900">Project Documents</h1>
        <p className="mt-1 text-sm text-gray-600">Manage RFIs, submittals, change orders, and more</p>
      </div>

      {documents.length === 0 ? (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-8 text-center">
          <FileText className="h-12 w-12 text-blue-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Documents Yet</h3>
          <p className="text-sm text-gray-600 mb-4">
            Upload documents using the sample library ingestion feature.
          </p>
          <p className="text-xs text-gray-500">
            Run: <code className="bg-white px-2 py-1 rounded">POST /api/library/ingest</code>
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {documents.map((doc) => {
            let tags: string[] = [];
            try {
              const payload = JSON.parse(doc.payload);
              tags = payload.tags || [];
            } catch (e) {
              // ignore
            }

            return (
              <div key={doc.id} className="bg-white border rounded-lg p-4 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <FileText className="h-5 w-5 text-gray-400" />
                      <h3 className="font-medium text-gray-900">{doc.title}</h3>
                      <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded">
                        {doc.doc_type}
                      </span>
                      <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded">
                        {doc.status}
                      </span>
                    </div>
                    <div className="mt-1 flex items-center space-x-4 text-sm text-gray-600">
                      <span>Category: {doc.category}</span>
                      <span>Standard: {doc.standard}</span>
                    </div>
                    {tags.length > 0 && (
                      <div className="mt-2 flex items-center space-x-2">
                        <Tag className="h-4 w-4 text-gray-400" />
                        <div className="flex flex-wrap gap-1">
                          {tags.map((tag, idx) => (
                            <span
                              key={idx}
                              className="text-xs px-2 py-0.5 bg-gray-100 text-gray-700 rounded"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => setSelectedDoc(selectedDoc?.id === doc.id ? null : doc)}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    {selectedDoc?.id === doc.id ? 'Hide' : 'Preview'}
                  </button>
                </div>
                {selectedDoc?.id === doc.id && /\.pdf$/i.test(doc.path || '') && (
                  <div className="mt-4 border-t pt-4">
                    <PdfCanvas src={doc.path} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
