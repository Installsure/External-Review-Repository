import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  Filter,
  Grid,
  List,
  ExternalLink,
  Play,
  Code,
  Database,
  Shield,
  Users,
  TrendingUp,
  CheckCircle,
  Clock,
  AlertCircle,
} from 'lucide-react';
import { apps, AppDemo } from '../data/apps';

const Dashboard: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const categories = ['all', ...Array.from(new Set(apps.map((app) => app.category)))];
  const statuses = ['all', 'development-ready', 'production-ready', 'in-development'];

  const filteredApps = apps.filter((app) => {
    const matchesSearch =
      app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || app.category === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || app.status === selectedStatus;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'development-ready':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'production-ready':
        return <Shield className="w-4 h-4 text-blue-500" />;
      case 'in-development':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'development-ready':
        return 'bg-green-100 text-green-800';
      case 'production-ready':
        return 'bg-blue-100 text-blue-800';
      case 'in-development':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const AppCard: React.FC<{ app: AppDemo }> = ({ app }) => (
    <div className="app-card group">
      <div className="app-card-header">
        <div className={`app-icon bg-${app.color}-500`}>{app.icon}</div>
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-gray-900">{app.name}</h3>
          <p className="text-sm text-gray-600">{app.category}</p>
        </div>
        <div className={`status-badge ${getStatusColor(app.status)}`}>
          {getStatusIcon(app.status)}
          <span className="ml-1 capitalize">{app.status.replace('-', ' ')}</span>
        </div>
      </div>

      <p className="text-gray-700 mb-4 line-clamp-2">{app.description}</p>

      <div className="flex flex-wrap gap-2 mb-4">
        {app.features.slice(0, 3).map((feature, index) => (
          <span key={index} className="feature-badge bg-gray-100 text-gray-700">
            {feature.icon} {feature.name}
          </span>
        ))}
        {app.features.length > 3 && (
          <span className="feature-badge bg-gray-100 text-gray-700">
            +{app.features.length - 3} more
          </span>
        )}
      </div>

      <div className="flex items-center justify-between">
        <div className="flex space-x-2">
          <Link to={`/app/${app.id}`} className="demo-button-primary flex items-center space-x-2">
            <Play className="w-4 h-4" />
            <span>Demo</span>
          </Link>
          <button
            onClick={() => window.open(`/app/${app.id}`, '_blank')}
            className="demo-button-secondary flex items-center space-x-2"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Details</span>
          </button>
        </div>
        <div className="text-sm text-gray-500">{app.techStack.length} technologies</div>
      </div>
    </div>
  );

  const AppListItem: React.FC<{ app: AppDemo }> = ({ app }) => (
    <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center space-x-6">
        <div className={`app-icon bg-${app.color}-500 w-16 h-16 text-xl`}>{app.icon}</div>

        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <h3 className="text-xl font-semibold text-gray-900">{app.name}</h3>
            <div className={`status-badge ${getStatusColor(app.status)}`}>
              {getStatusIcon(app.status)}
              <span className="ml-1 capitalize">{app.status.replace('-', ' ')}</span>
            </div>
          </div>

          <p className="text-gray-700 mb-3">{app.description}</p>

          <div className="flex items-center space-x-6 text-sm text-gray-500">
            <span className="flex items-center space-x-1">
              <Code className="w-4 h-4" />
              <span>{app.techStack.length} technologies</span>
            </span>
            <span className="flex items-center space-x-1">
              <CheckCircle className="w-4 h-4" />
              <span>{app.features.filter((f) => f.status === 'completed').length} features</span>
            </span>
            <span className="flex items-center space-x-1">
              <Database className="w-4 h-4" />
              <span>{app.category}</span>
            </span>
          </div>
        </div>

        <div className="flex space-x-2">
          <Link to={`/app/${app.id}`} className="demo-button-primary flex items-center space-x-2">
            <Play className="w-4 h-4" />
            <span>Demo</span>
          </Link>
          <button
            onClick={() => window.open(`/app/${app.id}`, '_blank')}
            className="demo-button-secondary"
          >
            Details
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">A</span>
                </div>
                <h1 className="text-2xl font-bold text-gray-900">App Demo Dashboard</h1>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-2 text-sm text-gray-500">
                <Users className="w-4 h-4" />
                <span>6 Applications</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <TrendingUp className="w-4 h-4" />
                <span>All Development Ready</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Filters */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search applications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Filters */}
            <div className="flex items-center space-x-4">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category}
                  </option>
                ))}
              </select>

              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {status === 'all' ? 'All Status' : status.replace('-', ' ')}
                  </option>
                ))}
              </select>

              {/* View Mode */}
              <div className="flex border border-gray-300 rounded-lg">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-500'}`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-500'}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Code className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Apps</p>
                <p className="text-2xl font-semibold text-gray-900">6</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Ready</p>
                <p className="text-2xl font-semibold text-gray-900">6</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Database className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Categories</p>
                <p className="text-2xl font-semibold text-gray-900">6</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Shield className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Features</p>
                <p className="text-2xl font-semibold text-gray-900">20+</p>
              </div>
            </div>
          </div>
        </div>

        {/* Apps Grid/List */}
        {filteredApps.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No applications found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria</p>
          </div>
        ) : (
          <div
            className={
              viewMode === 'grid'
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                : 'space-y-4'
            }
          >
            {filteredApps.map((app) =>
              viewMode === 'grid' ? (
                <AppCard key={app.id} app={app} />
              ) : (
                <AppListItem key={app.id} app={app} />
              ),
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
