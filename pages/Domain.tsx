
import React, { useState } from 'react';
import Footer from '../components/Footer';
import { Send } from 'lucide-react';

const Domain: React.FC = () => {
    const [domainInput, setDomainInput] = useState('');
    const [industryInput, setIndustryInput] = useState('');
    const [results, setResults] = useState<{ direct: string[], suggestions: Record<string, string[]> }>({ direct: [], suggestions: {} });
    const [activeTab, setActiveTab] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalDomain, setModalDomain] = useState('');
    const [resultsVisible, setResultsVisible] = useState(false);
    
    // --- Domain Generation Logic ---
    const removeAccents = (str: string) => str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d").replace(/Đ/g, "D");
    const processKeyword = (input: string) => removeAccents(input.trim().toLowerCase()).replace(/[^a-z0-9\-]+/g, '-').replace(/-+/g, '-').replace(/^-+|-+$/g, '');
    const processKeywordForCombine = (input: string) => removeAccents(input.trim().toLowerCase()).replace(/[^a-z0-9]+/g, '');
    
    const TLDs = ['.com', '.vn', '.net', '.com.vn', '.org', '.shop', '.store'];
    
    const generateSuggestions = (keyword: string, industry: string) => {
        const direct: string[] = TLDs.map(tld => `${keyword}${tld}`);
        
        let suggestions: Record<string, string[]> = {};
        const combinedKeyword = processKeywordForCombine(keyword);
        const combinedIndustry = processKeywordForCombine(industry);
        
        if (combinedIndustry) {
            suggestions['Ngành nghề'] = TLDs.map(tld => `${combinedKeyword}${combinedIndustry}${tld}`);
        }
        
        const suffixes = ['group', 'global', 'tech', 'solution', 'pro'];
        suggestions['Hậu tố'] = suffixes.flatMap(suf => TLDs.slice(0, 3).map(tld => `${keyword}-${suf}${tld}`));
        
        return { direct, suggestions };
    };
    
    const handleSearch = () => {
        const processed = processKeyword(domainInput);
        if (!processed) return;
        
        setIsLoading(true);
        setResultsVisible(false); // Reset visibility for new search
        
        setTimeout(() => {
            const res = generateSuggestions(processed, industryInput);
            setResults(res);
            setActiveTab(Object.keys(res.suggestions)[0] || null);
            setIsLoading(false);
            // Allow DOM to update before triggering animation
            setTimeout(() => setResultsVisible(true), 50);
        }, 500);
    };
    
    const openModal = (domain: string) => {
        setModalDomain(domain);
        setIsModalOpen(true);
    };

    const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        // Handle form submission logic, e.g., using fetch to Formspree
        const form = event.currentTarget;
        const data = new FormData(form);
        const successMessage = document.getElementById('success-message');
        try {
            const response = await fetch(form.action, { method: 'POST', body: data, headers: { 'Accept': 'application/json' } });
            if (response.ok) {
                if(successMessage) successMessage.classList.add('show');
                setTimeout(() => { if(successMessage) successMessage.classList.remove('show') }, 3000);
                form.reset();
                setIsModalOpen(false);
            } else { alert('Gửi thất bại.'); }
        } catch (error) { alert('Lỗi mạng.'); }
    };
    
    return (
        <>
            <main>
                <section className="hero-section">
                    <div className="max-w-7xl mx-auto relative z-10 px-4">
                        <h1>Đăng Ký & Gợi Ý Tên Miền</h1>
                        <p className="text-lg">Tìm kiếm tên miền hoàn hảo cho doanh nghiệp hoặc dự án cá nhân của bạn.</p>
                    </div>
                </section>
                <section className="domain-search-container -mt-20 max-w-4xl mx-auto bg-white p-6 rounded-xl shadow-lg relative z-20">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <input type="text" value={domainInput} onChange={e => setDomainInput(e.target.value)} className="w-full p-3 border-2 border-gray-200 rounded-lg" placeholder="Nhập tên miền hoặc từ khóa..."/>
                        <input type="text" value={industryInput} onChange={e => setIndustryInput(e.target.value)} className="w-full p-3 border-2 border-gray-200 rounded-lg" placeholder="Ngành nghề (Tùy chọn)"/>
                    </div>
                    <button onClick={handleSearch} disabled={isLoading} className="w-full md:w-auto bg-indigo-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-indigo-700 transition disabled:bg-indigo-400">
                        {isLoading ? 'Đang tìm...' : 'Tìm kiếm & Gợi ý'}
                    </button>
                </section>
                
                 <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <h3 className="text-xl font-bold mb-4">Kết quả trực tiếp</h3>
                            <div className={`bg-white p-4 rounded-lg shadow space-y-2 max-h-96 overflow-y-auto ${resultsVisible ? 'results-visible' : ''}`}>
                                {isLoading ? <p>Đang tải...</p> : results.direct.length === 0 ? <p>Nhập từ khóa để xem kết quả.</p> :
                                    results.direct.map((d, index) => (
                                        <div key={d} className="result-item flex justify-between items-center p-2 border-b" style={{ transitionDelay: `${index * 50}ms` }}>
                                            <span>{d}</span>
                                            <button onClick={() => openModal(d)} className="text-indigo-600 font-semibold">Đăng ký</button>
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                        <div>
                            <h3 className="text-xl font-bold mb-4">Gợi ý khác</h3>
                            <div className="bg-white p-4 rounded-lg shadow">
                                <div className="flex space-x-2 border-b mb-2">
                                    {Object.keys(results.suggestions).map(tab => (
                                        <button key={tab} onClick={() => setActiveTab(tab)} className={`py-2 px-4 ${activeTab === tab ? 'border-b-2 border-indigo-600 font-semibold' : 'text-gray-500'}`}>{tab}</button>
                                    ))}
                                </div>
                                <div className={`space-y-2 max-h-80 overflow-y-auto ${resultsVisible ? 'results-visible' : ''}`}>
                                    {isLoading ? <p>Đang tải...</p> :
                                        activeTab && results.suggestions[activeTab]?.map((d, index) => (
                                            <div key={d} className="result-item flex justify-between items-center p-2 border-b" style={{ transitionDelay: `${index * 50}ms` }}>
                                                <span>{d}</span>
                                                <button onClick={() => openModal(d)} className="text-indigo-600 font-semibold">Đăng ký</button>
                                            </div>
                                        ))
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

             {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md m-4">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-bold">Đăng ký tư vấn</h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-gray-800">&times;</button>
                        </div>
                        <form onSubmit={handleFormSubmit} action="https://formspree.io/f/xldojlkn" method="POST" className="space-y-4">
                            <input type="text" name="Họ tên" placeholder="Họ và tên" className="w-full p-3 border rounded" required />
                            <input type="tel" name="Số điện thoại" placeholder="Số điện thoại" className="w-full p-3 border rounded" required />
                            <textarea name="Nội dung thêm" rows={4} defaultValue={`Tôi muốn đăng ký tên miền: ${modalDomain}`} className="w-full p-3 border rounded"></textarea>
                            <button type="submit" className="w-full bg-indigo-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-indigo-700 transition flex items-center justify-center">
                                <Send className="w-5 h-5 mr-2"/>
                                Gửi yêu cầu
                            </button>
                        </form>
                    </div>
                </div>
            )}
            <Footer/>
        </>
    );
};

export default Domain;