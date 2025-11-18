
import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const navLinks = [
    { name: 'Giới thiệu', to: '/#about' },
    { name: 'Dịch vụ', to: '/#services' },
    { name: 'Dự án', to: '/projects' },
    { name: 'Hosting', to: '/hosting' },
    { name: 'Tên miền', to: '/domain' },
    { name: 'Báo Giá', to: '/bao-gia' },
];

const Header: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();

    useEffect(() => {
        setIsOpen(false);
    }, [location]);

    const getLinkClass = (path: string, hash?: string) => {
        const isActive = hash
            ? location.pathname === '/' && location.hash === hash
            : location.pathname === path;
        return isActive
            ? 'text-indigo-600 font-semibold'
            : 'text-gray-500 font-medium hover:text-indigo-600 transition duration-150';
    };
    
    const getMobileLinkClass = (path: string, hash?: string) => {
        const isActive = hash
            ? location.pathname === '/' && location.hash === hash
            : location.pathname === path;
        return isActive
            ? 'text-indigo-700 bg-indigo-50 block px-3 py-2 rounded-md text-base font-medium'
            : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900 block px-3 py-2 rounded-md text-base font-medium';
    };

    return (
        <header className="bg-white/90 sticky top-0 z-50 backdrop-blur-md border-b border-gray-200">
            <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex-shrink-0 flex items-center">
                        <NavLink to="/" className="text-2xl font-bold text-indigo-600">
                            Fi.tallest
                        </NavLink>
                    </div>

                    <div className="hidden md:flex md:items-center md:space-x-8">
                        {navLinks.map(link => {
                           const [path, hash] = link.to.split('#');
                           return (
                               <NavLink 
                                 key={link.name} 
                                 to={link.to} 
                                 className={getLinkClass(path || '/', hash ? `#${hash}`: undefined)}
                                >
                                   {link.name}
                                </NavLink>
                            );
                        })}
                        <NavLink to="/#register" className="ml-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                            Liên hệ ngay
                        </NavLink>
                    </div>

                    <div className="-mr-2 flex items-center md:hidden">
                        <button
                            type="button"
                            onClick={() => setIsOpen(!isOpen)}
                            className="bg-white rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                            aria-expanded={isOpen}
                        >
                            <span className="sr-only">Mở menu</span>
                            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </nav>

            <div className={`${isOpen ? 'block' : 'hidden'} md:hidden`} id="mobile-menu">
                <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                     {navLinks.map(link => {
                           const [path, hash] = link.to.split('#');
                           return (
                               <NavLink 
                                 key={link.name} 
                                 to={link.to} 
                                 className={getMobileLinkClass(path || '/', hash ? `#${hash}` : undefined)}
                                >
                                   {link.name}
                                </NavLink>
                            );
                        })}
                    <NavLink to="/#register" className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700">
                        Liên hệ ngay
                    </NavLink>
                </div>
            </div>
        </header>
    );
};

export default Header;
