
import React from 'react';
import { HashRouter, Routes, Route, Outlet } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import Projects from './pages/Projects';
import Hosting from './pages/Hosting';
import Domain from './pages/Domain';
import BaoGia from './pages/BaoGia';
import Admin from './pages/Admin';

const Layout: React.FC = () => {
    return (
        <>
            <Header />
            <main>
                <Outlet />
            </main>
        </>
    );
};

const App: React.FC = () => {
    return (
        <HashRouter>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<Home />} />
                    <Route path="projects" element={<Projects />} />
                    <Route path="hosting" element={<Hosting />} />
                    <Route path="domain" element={<Domain />} />
                    <Route path="bao-gia" element={<BaoGia />} />
                    <Route path="admin" element={<Admin />} />
                </Route>
            </Routes>
        </HashRouter>
    );
};

export default App;
