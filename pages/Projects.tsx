
import React from 'react';
import { projectsData } from '../data/projectsData';
import { Project } from '../types';
import Footer from '../components/Footer';

const ProjectCard: React.FC<{ project: Project }> = ({ project }) => {
    return (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden transition duration-300 ease-in-out hover:shadow-xl group">
            <a href={project.link || '#'} className="block">
                <img
                    src={project.imageUrl || `https://picsum.photos/seed/${project.id}/600/400`}
                    alt={project.title}
                    className="w-full h-48 object-cover group-hover:opacity-80 transition duration-300"
                    loading="lazy"
                />
            </a>
            <div className="p-6">
                <span className="text-sm text-indigo-600 font-medium mb-1 block">{project.category}</span>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{project.title}</h3>
                <p className="text-base text-gray-600">{project.description}</p>
            </div>
        </div>
    );
};

const Projects: React.FC = () => {
    return (
        <>
            <main className="py-16 md:py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-bold text-gray-900">Dự Án Nổi Bật</h1>
                        <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">Khám phá các dự án website và ứng dụng đa dạng mà tôi đã thực hiện.</p>
                    </div>

                    {projectsData.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {projectsData.map(project => (
                                <ProjectCard key={project.id} project={project} />
                            ))}
                        </div>
                    ) : (
                         <div className="col-span-full text-center py-12">
                            <p className="text-gray-500">Chưa có dự án nào được thêm.</p>
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </>
    );
};

export default Projects;
