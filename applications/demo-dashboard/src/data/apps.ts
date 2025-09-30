export interface App {
  id: string;
  name: string;
  description: string;
  category: string;
  status: 'ready' | 'building' | 'error';
  features: string[];
  techStack: string[];
  demoUrl: string;
  githubUrl: string;
  port: number;
}

export const apps: App[] = [
  {
    id: 'installsure',
    name: 'InstallSure',
    description: 'Construction project management with AutoCAD integration',
    category: 'Construction',
    status: 'ready',
    features: [
      'Project Management',
      'AutoCAD Integration',
      'File Management',
      'Real-time Collaboration',
      'Quantity Takeoff',
      '3D Model Viewing',
    ],
    techStack: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Autodesk Forge'],
    demoUrl: 'http://localhost:3000',
    githubUrl: '#',
    port: 3000,
  },
  {
    id: 'zerostack',
    name: 'ZeroStack',
    description: 'Infrastructure management platform',
    category: 'Infrastructure',
    status: 'ready',
    features: [
      'Infrastructure Overview',
      'Resource Management',
      'Monitoring Dashboard',
      'Cost Optimization',
    ],
    techStack: ['Next.js', 'React', 'TypeScript', 'PostgreSQL'],
    demoUrl: 'http://localhost:3004',
    githubUrl: '#',
    port: 3004,
  },
  {
    id: 'redeye',
    name: 'RedEye',
    description: 'Project tracking and management system',
    category: 'Project Management',
    status: 'ready',
    features: ['Project Tracking', 'Task Management', 'Team Collaboration', 'Progress Monitoring'],
    techStack: ['Next.js', 'React', 'TypeScript', 'PostgreSQL'],
    demoUrl: 'http://localhost:3003',
    githubUrl: '#',
    port: 3003,
  },
  {
    id: 'hello',
    name: 'Hello',
    description: 'Social networking and communication platform',
    category: 'Social',
    status: 'ready',
    features: ['User Profiles', 'Messaging', 'Social Features', 'Real-time Chat'],
    techStack: ['Next.js', 'React', 'TypeScript', 'PostgreSQL'],
    demoUrl: 'http://localhost:3005',
    githubUrl: '#',
    port: 3005,
  },
  {
    id: 'ff4u',
    name: 'FF4U',
    description: 'Fitness and wellness platform',
    category: 'Health & Fitness',
    status: 'ready',
    features: [
      'Workout Tracking',
      'Nutrition Planning',
      'Progress Monitoring',
      'Community Features',
    ],
    techStack: ['Next.js', 'React', 'TypeScript', 'PostgreSQL'],
    demoUrl: 'http://localhost:3002',
    githubUrl: '#',
    port: 3002,
  },
  {
    id: 'avatar',
    name: 'Avatar',
    description: 'AI-powered avatar platform for customer service',
    category: 'AI & Technology',
    status: 'ready',
    features: [
      'AI Avatars',
      'Voice Interaction',
      '3D Animation',
      'Emotion Recognition',
      'Multi-persona Support',
    ],
    techStack: ['Next.js', 'React', 'Three.js', 'OpenAI', 'WebGL'],
    demoUrl: 'http://localhost:3006',
    githubUrl: '#',
    port: 3006,
  },
];

// Helper function to get app by ID
export function getAppById(id: string): App | undefined {
  return apps.find((app) => app.id === id);
}

// Type for app demo data
export interface AppDemo {
  id: string;
  name: string;
  description: string;
  category: string;
  status: 'ready' | 'building' | 'error';
  features: string[];
  techStack: string[];
  demoUrl: string;
  githubUrl: string;
  port: number;
}
