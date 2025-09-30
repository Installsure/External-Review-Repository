import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  LayoutDashboard,
  FolderOpen,
  CheckSquare,
  Users,
  Activity,
  Plus,
  TrendingUp,
  Clock,
  AlertCircle,
} from 'lucide-react';

export default function Dashboard({ user, currentOrg, onSelectOrg }) {
  const [statsData, setStatsData] = useState({
    projects: { total: 0, active: 0 },
    tasks: { total: 0, todo: 0, doing: 0, review: 0, done: 0 },
    activity: [],
  });

  // Fetch projects for current org
  const { data: projects = [], isLoading: projectsLoading } = useQuery({
    queryKey: ['projects', currentOrg?.id],
    queryFn: async () => {
      if (!currentOrg) return [];
      const token = localStorage.getItem('access_token');
      const response = await fetch(`/api/projects?org=${currentOrg.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Failed to fetch projects');
      const data = await response.json();
      return data.projects || [];
    },
    enabled: !!currentOrg,
  });

  // Fetch tasks for dashboard overview
  const { data: allTasks = [], isLoading: tasksLoading } = useQuery({
    queryKey: ['tasks-overview', currentOrg?.id],
    queryFn: async () => {
      if (!currentOrg || !projects.length) return [];
      const token = localStorage.getItem('access_token');

      // Fetch tasks for all projects
      const taskPromises = projects.map((project) =>
        fetch(`/api/tasks?project_id=${project.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
          .then((res) => res.json())
          .then((data) => data.tasks || []),
      );

      const taskArrays = await Promise.all(taskPromises);
      return taskArrays.flat();
    },
    enabled: !!currentOrg && projects.length > 0,
  });

  // Calculate stats
  useEffect(() => {
    const activeProjects = projects.filter((p) => p.status === 'ACTIVE').length;
    const tasksByStatus = allTasks.reduce((acc, task) => {
      acc[task.status.toLowerCase()] = (acc[task.status.toLowerCase()] || 0) + 1;
      return acc;
    }, {});

    setStatsData({
      projects: {
        total: projects.length,
        active: activeProjects,
      },
      tasks: {
        total: allTasks.length,
        todo: tasksByStatus.todo || 0,
        doing: tasksByStatus.doing || 0,
        review: tasksByStatus.review || 0,
        done: tasksByStatus.done || 0,
      },
      activity: [], // TODO: Fetch activity data
    });
  }, [projects, allTasks]);

  const isLoading = projectsLoading || tasksLoading;

  return (
    <div className="p-4 md:p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-black dark:text-white tracking-tight font-sora">
            Dashboard
          </h1>
          <p className="text-[#6B7280] dark:text-[#9CA3AF] font-inter">
            {currentOrg ? `Welcome to ${currentOrg.name}` : 'Select an organization to get started'}
          </p>
        </div>

        {currentOrg && (
          <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-b from-[#252525] to-[#0F0F0F] dark:from-[#FFFFFF] dark:to-[#E0E0E0] text-white dark:text-black font-semibold rounded-lg transition-all duration-150 hover:from-[#2d2d2d] hover:to-[#171717] dark:hover:from-[#F0F0F0] dark:hover:to-[#D0D0D0] active:scale-95 font-inter">
            <Plus size={16} />
            New Project
          </button>
        )}
      </div>

      {!currentOrg && (
        <div className="bg-white dark:bg-[#1E1E1E] border border-[#E4E4E7] dark:border-[#333333] rounded-xl p-8 text-center">
          <LayoutDashboard size={48} className="text-[#6B7280] dark:text-[#9CA3AF] mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-[#111827] dark:text-white mb-2 font-bricolage">
            Select an Organization
          </h3>
          <p className="text-[#6B7280] dark:text-[#9CA3AF] mb-6 font-inter">
            Choose an organization from your list to view your dashboard and manage projects.
          </p>
        </div>
      )}

      {currentOrg && (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
            {/* Projects Card */}
            <div className="bg-white dark:bg-[#1E1E1E] border border-[#E4E4E7] dark:border-[#333333] rounded-xl p-6 hover:bg-[#F8F8F8] dark:hover:bg-[#262626] transition-colors">
              <div className="flex items-center gap-3 mb-4">
                <FolderOpen size={20} className="text-blue-600 dark:text-blue-400" />
                <span className="font-semibold text-[#4D4D4D] dark:text-[#B0B0B0] font-inter">
                  Projects
                </span>
              </div>
              <div className="flex items-end gap-4">
                <span className="font-bold text-3xl text-black dark:text-white font-sora">
                  {isLoading ? '...' : statsData.projects.active}
                </span>
                <div className="flex items-center gap-1 text-sm text-green-600 dark:text-green-400 font-inter">
                  <TrendingUp size={14} />
                  Active
                </div>
              </div>
              <p className="text-sm text-[#8A8A8A] dark:text-[#888888] mt-2 font-inter">
                {isLoading ? '...' : `${statsData.projects.total} total`}
              </p>
            </div>

            {/* Tasks Card */}
            <div className="bg-white dark:bg-[#1E1E1E] border border-[#E4E4E7] dark:border-[#333333] rounded-xl p-6 hover:bg-[#F8F8F8] dark:hover:bg-[#262626] transition-colors">
              <div className="flex items-center gap-3 mb-4">
                <CheckSquare size={20} className="text-green-600 dark:text-green-400" />
                <span className="font-semibold text-[#4D4D4D] dark:text-[#B0B0B0] font-inter">
                  Tasks
                </span>
              </div>
              <div className="flex items-end gap-4">
                <span className="font-bold text-3xl text-black dark:text-white font-sora">
                  {isLoading ? '...' : statsData.tasks.total}
                </span>
                <div className="flex items-center gap-1 text-sm text-blue-600 dark:text-blue-400 font-inter">
                  <Clock size={14} />
                  Total
                </div>
              </div>
              <p className="text-sm text-[#8A8A8A] dark:text-[#888888] mt-2 font-inter">
                {isLoading ? '...' : `${statsData.tasks.done} completed`}
              </p>
            </div>

            {/* In Progress Card */}
            <div className="bg-white dark:bg-[#1E1E1E] border border-[#E4E4E7] dark:border-[#333333] rounded-xl p-6 hover:bg-[#F8F8F8] dark:hover:bg-[#262626] transition-colors">
              <div className="flex items-center gap-3 mb-4">
                <Activity size={20} className="text-yellow-600 dark:text-yellow-400" />
                <span className="font-semibold text-[#4D4D4D] dark:text-[#B0B0B0] font-inter">
                  In Progress
                </span>
              </div>
              <div className="flex items-end gap-4">
                <span className="font-bold text-3xl text-black dark:text-white font-sora">
                  {isLoading ? '...' : statsData.tasks.doing + statsData.tasks.review}
                </span>
                <div className="flex items-center gap-1 text-sm text-yellow-600 dark:text-yellow-400 font-inter">
                  <AlertCircle size={14} />
                  Active
                </div>
              </div>
              <p className="text-sm text-[#8A8A8A] dark:text-[#888888] mt-2 font-inter">
                {isLoading ? '...' : `${statsData.tasks.todo} pending`}
              </p>
            </div>

            {/* Team Card */}
            <div className="bg-white dark:bg-[#1E1E1E] border border-[#E4E4E7] dark:border-[#333333] rounded-xl p-6 hover:bg-[#F8F8F8] dark:hover:bg-[#262626] transition-colors">
              <div className="flex items-center gap-3 mb-4">
                <Users size={20} className="text-purple-600 dark:text-purple-400" />
                <span className="font-semibold text-[#4D4D4D] dark:text-[#B0B0B0] font-inter">
                  Team
                </span>
              </div>
              <div className="flex items-end gap-4">
                <span className="font-bold text-3xl text-black dark:text-white font-sora">
                  {user?.orgs?.length || 1}
                </span>
                <div className="flex items-center gap-1 text-sm text-purple-600 dark:text-purple-400 font-inter">
                  <Users size={14} />
                  Members
                </div>
              </div>
              <p className="text-sm text-[#8A8A8A] dark:text-[#888888] mt-2 font-inter">
                {currentOrg?.role || 'MEMBER'} role
              </p>
            </div>
          </div>

          {/* Recent Projects & Activity */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            {/* Recent Projects */}
            <div className="bg-white dark:bg-[#1E1E1E] border border-[#E4E4E7] dark:border-[#333333] rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-[#111827] dark:text-white font-bricolage">
                  Recent Projects
                </h3>
                <button className="text-black dark:text-white hover:underline text-sm font-medium font-inter">
                  View all
                </button>
              </div>

              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                    </div>
                  ))}
                </div>
              ) : projects.length > 0 ? (
                <div className="space-y-4">
                  {projects.slice(0, 5).map((project) => (
                    <div
                      key={project.id}
                      className="flex items-center justify-between p-3 hover:bg-[#F8F8F8] dark:hover:bg-[#262626] rounded-lg transition-colors cursor-pointer"
                    >
                      <div>
                        <h4 className="font-medium text-[#111827] dark:text-white font-bricolage">
                          {project.name}
                        </h4>
                        <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF] font-inter">
                          {project.task_count} tasks • {project.completed_tasks} completed
                        </p>
                      </div>
                      <div
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          project.status === 'ACTIVE'
                            ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400'
                            : 'bg-gray-100 dark:bg-gray-900/20 text-gray-800 dark:text-gray-400'
                        } font-inter`}
                      >
                        {project.status}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FolderOpen
                    size={48}
                    className="text-[#6B7280] dark:text-[#9CA3AF] mx-auto mb-4"
                  />
                  <p className="text-[#6B7280] dark:text-[#9CA3AF] font-inter">No projects yet</p>
                  <button className="mt-4 text-black dark:text-white font-medium hover:underline font-inter">
                    Create your first project
                  </button>
                </div>
              )}
            </div>

            {/* Activity Feed */}
            <div className="bg-white dark:bg-[#1E1E1E] border border-[#E4E4E7] dark:border-[#333333] rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-[#111827] dark:text-white font-bricolage">
                  Recent Activity
                </h3>
                <button className="text-black dark:text-white hover:underline text-sm font-medium font-inter">
                  View all
                </button>
              </div>

              <div className="text-center py-8">
                <Activity size={48} className="text-[#6B7280] dark:text-[#9CA3AF] mx-auto mb-4" />
                <p className="text-[#6B7280] dark:text-[#9CA3AF] font-inter">No recent activity</p>
                <p className="text-sm text-[#8A8A8A] dark:text-[#888888] mt-2 font-inter">
                  Activity will appear here as you work on projects
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
