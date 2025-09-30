import { Project, CreateProjectData, UpdateProjectData } from '../types/projects.js';
export declare class ProjectsService {
    getAllProjects(requestId?: string): Promise<Project[]>;
    getProjectById(id: number, requestId?: string): Promise<Project>;
    createProject(data: CreateProjectData, requestId?: string): Promise<Project>;
    updateProject(id: number, data: UpdateProjectData, requestId?: string): Promise<Project>;
    deleteProject(id: number, requestId?: string): Promise<void>;
}
export declare const projectsService: ProjectsService;
//# sourceMappingURL=projectsService.d.ts.map