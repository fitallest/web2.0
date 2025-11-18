
import React, { useState, useEffect } from 'react';
import { projectsData as initialProjects } from '../data/projectsData';
import { Project } from '../types';

const Admin: React.FC = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [projects, setProjects] = useState<Project[]>([]);
    const [newProject, setNewProject] = useState({ title: '', category: '', description: '', imageUrl: '', link: '' });
    const [generatedCode, setGeneratedCode] = useState('');

    useEffect(() => {
        if (!isAuthenticated) {
            const password = prompt("Nhập mật khẩu quản trị:");
            if (password === 'admin') { // Simple password, not secure
                setIsAuthenticated(true);
                setProjects(JSON.parse(JSON.stringify(initialProjects))); // Deep copy
            } else {
                alert('Sai mật khẩu!');
            }
        }
    }, [isAuthenticated]);

    const handleAddProject = (e: React.FormEvent) => {
        e.preventDefault();
        const projectToAdd: Project = {
            id: Date.now(),
            ...newProject,
            link: newProject.link || '#'
        };
        setProjects([...projects, projectToAdd]);
        setNewProject({ title: '', category: '', description: '', imageUrl: '', link: '' });
    };

    const handleDeleteProject = (id: number) => {
        if (window.confirm('Bạn có chắc muốn xóa dự án này?')) {
            setProjects(projects.filter(p => p.id !== id));
        }
    };
    
    const handleGenerateCode = () => {
        let outputString = `import { Project } from '../types';\n\nexport const projectsData: Project[] = [\n`;
        outputString += projects.map(p => `  ${JSON.stringify(p, null, 2)}`).join(',\n');
        outputString += `\n];`;
        setGeneratedCode(outputString);
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(generatedCode).then(() => {
            alert('Đã copy vào clipboard!');
        }, () => {
            alert('Lỗi khi copy!');
        });
    };

    if (!isAuthenticated) {
        return <div className="text-center p-8 text-red-500">Truy cập bị từ chối.</div>;
    }

    return (
        <div className="max-w-4xl mx-auto p-8 bg-white my-8 rounded-lg shadow-lg">
            <h1 className="text-3xl font-bold mb-6 text-center">Quản lý Dự án</h1>
            
            {/* Add Project Form */}
            <div className="mb-8 p-4 border rounded-lg bg-gray-50">
                <h2 className="text-xl font-semibold mb-3">Thêm Dự án Mới</h2>
                <form onSubmit={handleAddProject} className="space-y-4">
                    <input type="text" placeholder="Tiêu đề" value={newProject.title} onChange={e => setNewProject({...newProject, title: e.target.value})} className="w-full p-2 border rounded" required />
                    <input type="text" placeholder="Thể loại" value={newProject.category} onChange={e => setNewProject({...newProject, category: e.target.value})} className="w-full p-2 border rounded" required />
                    <textarea placeholder="Mô tả" value={newProject.description} onChange={e => setNewProject({...newProject, description: e.target.value})} className="w-full p-2 border rounded" required />
                    <input type="text" placeholder="URL Hình ảnh" value={newProject.imageUrl} onChange={e => setNewProject({...newProject, imageUrl: e.target.value})} className="w-full p-2 border rounded" required />
                    <input type="text" placeholder="Link dự án" value={newProject.link} onChange={e => setNewProject({...newProject, link: e.target.value})} className="w-full p-2 border rounded" />
                    <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Thêm Dự án</button>
                </form>
            </div>
            
            {/* Project List */}
            <div>
                <h2 className="text-xl font-semibold mb-3">Danh sách Dự án Hiện Tại</h2>
                <div className="space-y-2">
                    {projects.map(p => (
                        <div key={p.id} className="flex justify-between items-center p-3 border-b">
                            <span><strong>{p.title}</strong> ({p.category})</span>
                            <button onClick={() => handleDeleteProject(p.id)} className="bg-red-500 text-white text-xs px-3 py-1 rounded">Xóa</button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Generate Code */}
            <div className="mt-8">
                 <button onClick={handleGenerateCode} className="w-full bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-700">Tạo Mã Dữ liệu Mới</button>
                 {generatedCode && (
                     <div className="mt-4">
                        <div className="flex justify-between items-center mb-2">
                             <label className="font-medium">Mã cho file <code>data/projectsData.ts</code></label>
                             <button onClick={copyToClipboard} className="bg-indigo-500 text-white text-sm px-3 py-1 rounded">Copy</button>
                        </div>
                        <textarea value={generatedCode} readOnly className="w-full h-64 p-2 font-mono text-sm bg-gray-800 text-white rounded border border-gray-600"></textarea>
                     </div>
                 )}
            </div>
        </div>
    );
};

export default Admin;
