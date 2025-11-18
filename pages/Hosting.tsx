
import React, { useState, useEffect } from 'react';
import Footer from '../components/Footer';

type ModalData = { title: string; services: string[] };

const MODAL_CONTENT: Record<string, ModalData> = {
  'modal-cn-10gb': { title: 'Dịch vụ chăm sóc (Cá Nhân 10GB)', services: ['Hỗ trợ đăng tối đa 15 bài', 'Cập nhật thông tin công ty', 'Thiết kế 2 hình ảnh chuyên nghiệp', 'Cài đặt chat online', 'Cài đặt công cụ SEO', 'Viết 1 bài chuẩn SEO/tháng'] },
  'modal-cn-20gb': { title: 'Dịch vụ chăm sóc (Cá Nhân 20GB)', services: ['Hỗ trợ đăng tối đa 20 bài', 'Thiết kế 3 hình ảnh', 'Viết 3 bài SEO/tháng', 'Kiểm tra SEO On-Page', 'Hỗ trợ Google Business & Fanpage'] },
  'modal-dn-50gb': { title: 'Dịch vụ chăm sóc (Doanh Nghiệp 50GB)', services: ['Hỗ trợ đăng tối đa 30 bài', 'Thiết kế 5 hình ảnh', 'Viết 5 bài SEO/tháng', 'Viết 2 bài Fanpage/tháng', 'Hỗ trợ đăng ký DMCA'] },
};

const HostingTable: React.FC<{ plans: any[], onShowModal: (id: string) => void }> = ({ plans, onShowModal }) => (
    <div className="overflow-x-auto">
        <table className="w-full border-collapse">
            <thead>
                <tr>{plans.map((p, i) => <th key={i} className={`p-3 text-white font-bold bg-blue-500`}>{p.storage}<br/><small>Dung lượng</small></th>)}</tr>
            </thead>
            <tbody>
                <tr className="bg-gray-50">{plans.map((p, i) => <td key={i} className="p-3 border text-center">{p.bandwidth}<br/>&#8644; Băng thông</td>)}</tr>
                <tr>{plans.map((p, i) => <td key={i} className="p-3 border text-center">{p.mysql}<br/>&#128179; Mysql</td>)}</tr>
                <tr className="bg-gray-50">{plans.map((p, i) => <td key={i} className="p-3 border text-center"><span className="price-year font-bold text-red-600">{p.priceYear}</span><br/><button onClick={() => onShowModal(p.modalId)} className="mt-2 bg-indigo-600 text-white text-xs px-3 py-1 rounded hover:bg-indigo-700">Xem dịch vụ</button></td>)}</tr>
            </tbody>
        </table>
    </div>
);

const MindMapNode: React.FC<{ title: string; children?: React.ReactNode; isRoot?: boolean; isMain?: boolean; isNote?: boolean }> = ({ title, children, isRoot, isMain, isNote }) => {
    const [isOpen, setIsOpen] = useState(true);
    const hasChildren = React.Children.count(children) > 0;
    
    let nodeClass = 'mind-map-node bg-gray-100 border border-gray-300';
    if(isRoot) nodeClass = 'mind-map-node root-node bg-red-100 border-red-300 text-red-800 font-bold';
    if(isMain) nodeClass = 'mind-map-node main-branch bg-blue-100 border-blue-300 text-blue-800 font-bold';
    if(isNote) nodeClass = 'mind-map-node note bg-green-100 border-green-300 text-green-800';

    return (
        <div className="mind-map-branch">
            <div className={`mind-map-node-container ${!hasChildren ? 'is-leaf' : ''} ${!isOpen ? 'is-collapsed' : ''}`}>
                <span onClick={() => setIsOpen(!isOpen)} className={`toggle ${!hasChildren ? 'is-leaf' : ''} ${!isOpen ? 'is-collapsed' : ''}`}>{hasChildren ? (isOpen ? '-' : '+') : ''}</span>
                <span className={nodeClass}>{title}</span>
            </div>
            {hasChildren && <div className={`mind-map-level level-3 ${!isOpen ? 'collapsed' : ''}`}>{children}</div>}
        </div>
    );
};

const Hosting: React.FC = () => {
    const [activeTab, setActiveTab] = useState('personal');
    const [isOverview, setIsOverview] = useState(false);
    const [modalData, setModalData] = useState<ModalData | null>(null);

    const personalPlans = [{ storage: '10GB', bandwidth: 'KGH', mysql: 10, priceYear: '7.200.000 VND/Năm', modalId: 'modal-cn-10gb' }, { storage: '20GB', bandwidth: 'KGH', mysql: 20, priceYear: '12.000.000 VND/Năm', modalId: 'modal-cn-20gb' }];
    const businessPlans = [{ storage: '50GB', bandwidth: 'KGH', mysql: 50, priceYear: '24.000.000 VND/Năm', modalId: 'modal-dn-50gb' }];
    
    return (
        <>
            <div className="p-4 md:p-8">
                {!isOverview ? (
                    <div>
                        <h1 className="text-3xl font-bold text-center text-gray-800">BẢNG GIÁ HOSTING</h1>
                        <p className="text-center text-gray-600 mb-8">Phí dịch vụ duy trì hàng năm (Đã bao gồm VAT)</p>
                        <div className="text-center mb-8"><button onClick={() => setIsOverview(true)} className="bg-orange-500 text-white font-bold py-2 px-6 rounded-lg hover:bg-orange-600">Tổng Quan Dịch Vụ</button></div>
                        <div className="flex justify-center space-x-2 mb-4">
                            <button onClick={() => setActiveTab('personal')} className={`py-2 px-4 rounded ${activeTab === 'personal' ? 'bg-indigo-600 text-white' : 'bg-gray-200'}`}>Cá Nhân</button>
                            <button onClick={() => setActiveTab('business')} className={`py-2 px-4 rounded ${activeTab === 'business' ? 'bg-indigo-600 text-white' : 'bg-gray-200'}`}>Doanh Nghiệp</button>
                        </div>
                        <div className="bg-white p-4 rounded-lg shadow-lg">
                            {activeTab === 'personal' && <HostingTable plans={personalPlans} onShowModal={(id) => setModalData(MODAL_CONTENT[id])} />}
                            {activeTab === 'business' && <HostingTable plans={businessPlans} onShowModal={(id) => setModalData(MODAL_CONTENT[id])} />}
                        </div>
                    </div>
                ) : (
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <button onClick={() => setIsOverview(false)} className="mb-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">&#8592; Quay Về Bảng Giá</button>
                        <h2 className="text-2xl font-bold mb-6">Tổng Quan Dịch Vụ Chăm Sóc Website</h2>
                        <div className="mind-map">
                           <div className="mind-map-root"><div className="mind-map-node-container is-leaf"><span className="mind-map-node root-node">Dịch Vụ Chăm Sóc Website</span></div></div>
                           <div className="mind-map-level level-2">
                                <MindMapNode title="Quản Lý Nội Dung" isMain>
                                    <MindMapNode title="Đăng Tải Sản Phẩm/Bài Viết"><MindMapNode title="Số lượng tùy gói (15 - 50)" isNote/></MindMapNode>
                                    <MindMapNode title="Cập Nhật Thông Tin Công Ty"/>
                                </MindMapNode>
                                <MindMapNode title="Tối Ưu Hóa (SEO)" isMain>
                                     <MindMapNode title="Triển Khai SEO Cơ Bản"><MindMapNode title="Tạo file robots.txt, sitemap.xml" isNote/></MindMapNode>
                                </MindMapNode>
                           </div>
                        </div>
                    </div>
                )}
            </div>
            {modalData && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center" onClick={() => setModalData(null)}>
                    <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md m-4" onClick={e => e.stopPropagation()}>
                        <h3 className="text-xl font-bold mb-4">{modalData.title}</h3>
                        <ul className="list-disc list-inside space-y-2">
                            {modalData.services.map((s, i) => <li key={i}>{s}</li>)}
                        </ul>
                        <button onClick={() => setModalData(null)} className="mt-6 w-full bg-red-500 text-white py-2 rounded hover:bg-red-600">Đóng</button>
                    </div>
                </div>
            )}
            <Footer />
        </>
    );
};

export default Hosting;
