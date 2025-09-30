import { Project } from '../types/projects.js';
export declare class ProjectsRepository {
    private store;
    private idCounter;
    findAll(requestId?: string): Promise<Project[]>;
    findById(id: number, requestId?: string): Promise<Project | null>;
    create(data: {
        name: string;
        description?: string;
    }, requestId?: string): Promise<Project>;
    update(id: number, data: {
        name?: string;
        description?: string;
    }, requestId?: string): Promise<Project | null>;
    delete(id: number, requestId?: string): Promise<boolean>;
    exists(id: number, requestId?: string): Promise<boolean>;
}
export declare const projectsRepo: ProjectsRepository;
//# sourceMappingURL=projectsRepo.d.ts.map