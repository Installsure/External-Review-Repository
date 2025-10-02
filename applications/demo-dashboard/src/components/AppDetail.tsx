import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  ExternalLink,
  Play,
  Code,
  CheckCircle,
  Clock,
  AlertCircle,
  Monitor,
  Smartphone,
  Globe,
  Star,
  Download,
  Shield,
} from 'lucide-react';
import { getAppById } from '../data/apps';

const AppDetail: React.FC = () => {
  const { appId } = useParams<{ appId: string }>();
  const [activeTab, setActiveTab] = useState<'overview' | 'features' | 'tech' | 'demo'>('overview');

  const app = getAppById(appId || '');

  if (!app) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">App not found</h1>
          <p className="text-gray-600 mb-4">The application you're looking for doesn't exist.</p>
          <Link to="/" className="text-blue-600 hover:text-blue-800">
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'development-ready':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'production-ready':
        return <Shield className="w-5 h-5 text-blue-500" />;
      case 'in-development':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'development-ready':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'production-ready':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'in-development':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getFeatureStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'in-progress':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'planned':
        return <AlertCircle className="w-4 h-4 text-gray-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getFeatureStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'planned':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link to="/" className="text-gray-500 hover:text-gray-700">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div className="flex items-center space-x-3">
                <div
                  className={`w-10 h-10 ${app.color ? `bg-${app.color}-500` : 'bg-blue-500'} rounded-lg flex items-center justify-center text-white font-bold text-lg`}
                >
                  {app.icon || app.name.charAt(0)}
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-gray-900">{app.name}</h1>
                  <p className="text-sm text-gray-600">{app.category}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div
                className={`px-3 py-1 rounded-full border ${getStatusColor(app.status)} flex items-center space-x-2`}
              >
                {getStatusIcon(app.status)}
                <span className="text-sm font-medium capitalize">
                  {app.status.replace('-', ' ')}
                </span>
              </div>
              <button
                onClick={() => window.open(app.demoUrl || '#', '_blank')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <Play className="w-4 h-4" />
                <span>Live Demo</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview', icon: Monitor },
              { id: 'features', label: 'Features', icon: Star },
              { id: 'tech', label: 'Tech Stack', icon: Code },
              { id: 'demo', label: 'Demo', icon: Play },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Hero Section */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">{app.name}</h2>
                  <p className="text-lg text-gray-700 mb-6">{app.longDescription || app.description}</p>

                  <div className="flex flex-wrap gap-3 mb-6">
                    {app.features.slice(0, 4).map((feature, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-700"
                      >
                        {typeof feature === 'string' ? feature : `${feature.icon || ''} ${feature.name || feature}`}
                      </span>
                    ))}
                  </div>

                  <div className="flex space-x-4">
                    <button
                      onClick={() => window.open(app.demoUrl || '#', '_blank')}
                      className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                    >
                      <Play className="w-5 h-5" />
                      <span>Launch Demo</span>
                    </button>
                    <button
                      onClick={() => window.open(app.githubUrl || '#', '_blank')}
                      className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2"
                    >
                      <ExternalLink className="w-5 h-5" />
                      <span>View Source</span>
                    </button>
                  </div>
                </div>

                <div className="space-y-6">
                  {/* Key Metrics */}
                  {app.keyMetrics && app.keyMetrics.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Metrics</h3>
                      <div className="grid grid-cols-1 gap-4">
                        {app.keyMetrics.map((metric, index) => (
                          <div key={index} className="bg-gray-50 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium text-gray-600">
                                {metric.label}
                              </span>
                              <span className="text-2xl font-bold text-gray-900">{metric.value}</span>
                            </div>
                            <p className="text-sm text-gray-500">{metric.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Platform Support */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Platform Support</h3>
                    <div className="flex space-x-4">
                      <div className="flex items-center space-x-2 text-gray-600">
                        <Monitor className="w-5 h-5" />
                        <span className="text-sm">Web</span>
                      </div>
                      <div className="flex items-center space-x-2 text-gray-600">
                        <Smartphone className="w-5 h-5" />
                        <span className="text-sm">Mobile</span>
                      </div>
                      <div className="flex items-center space-x-2 text-gray-600">
                        <Globe className="w-5 h-5" />
                        <span className="text-sm">PWA</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'features' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Features & Capabilities</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {app.features.map((feature, index) => {
                  const featureName: string = typeof feature === 'string' ? feature : feature.name;
                  const featureDesc = typeof feature === 'string' ? `${feature} capability` : feature.description || '';
                  const featureStatus = typeof feature === 'string' ? 'ready' : feature.status || 'ready';
                  return (
                    <div
                      key={index}
                      className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start space-x-4">
                        <div className="text-2xl">✓</div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">{featureName}</h3>
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getFeatureStatusColor(featureStatus)}`}
                            >
                              {getFeatureStatusIcon(featureStatus)}
                              <span className="ml-1 capitalize">
                                {featureStatus.replace('-', ' ')}
                              </span>
                            </span>
                          </div>
                          <p className="text-gray-600">{featureDesc}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'tech' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Technology Stack</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {app.techStack.map((tech, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 rounded-lg p-4 flex items-center space-x-3"
                  >
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Code className="w-4 h-4 text-blue-600" />
                    </div>
                    <span className="font-medium text-gray-900">{tech}</span>
                  </div>
                ))}
              </div>

              <div className="mt-8 p-6 bg-blue-50 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-900 mb-3">
                  Architecture Highlights
                </h3>
                <ul className="space-y-2 text-blue-800">
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4" />
                    <span>Modern React 18 with TypeScript</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4" />
                    <span>Tailwind CSS for styling</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4" />
                    <span>TanStack Query for state management</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4" />
                    <span>Neon Database integration</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4" />
                    <span>Vite for fast development</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'demo' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Interactive Demo</h2>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Demo Environment</h3>
                  <p className="text-gray-600 mb-6">
                    Experience {app.name} with our interactive demo. All features are available for
                    testing with sample data to demonstrate the platform's capabilities.
                  </p>

                  <div className="space-y-4">
                    <button
                      onClick={() => window.open(app.demoUrl || '#', '_blank')}
                      className="w-full px-6 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                    >
                      <Play className="w-5 h-5" />
                      <span>Launch Full Demo</span>
                    </button>

                    <div className="grid grid-cols-2 gap-4">
                      <button className="px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2">
                        <Smartphone className="w-4 h-4" />
                        <span>Mobile View</span>
                      </button>
                      <button className="px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2">
                        <Download className="w-4 h-4" />
                        <span>Download</span>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-100 rounded-lg p-6 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gray-300 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <Monitor className="w-8 h-8 text-gray-500" />
                    </div>
                    <p className="text-gray-500">Demo Preview</p>
                    <p className="text-sm text-gray-400">Interactive demo will load here</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 p-6 bg-green-50 rounded-lg">
                <h3 className="text-lg font-semibold text-green-900 mb-3">Demo Features</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {app.features
                    .filter((f) => typeof f !== 'string' && f.status === 'completed')
                    .slice(0, 4)
                    .map((feature, index) => (
                      <div key={index} className="flex items-center space-x-2 text-green-800">
                        <CheckCircle className="w-4 h-4" />
                        <span>{typeof feature === 'string' ? feature : feature.name}</span>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AppDetail;
