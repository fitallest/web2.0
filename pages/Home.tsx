
import React, { useState, useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { FolderKanban, DollarSign, Send, LayoutTemplate, Code2, Smartphone, Sparkles, Lightbulb, FileText, User, Phone, Server, Globe, ArrowRight } from 'lucide-react';
import { projectsData } from '../data/projectsData';
import { generateSloganAndDescription } from '../services/geminiService';
import Footer from '../components/Footer';

// --- Carousel Component ---
const ProjectsCarousel: React.FC = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const timeoutRef = useRef<number | null>(null);
    const isMobile = window.innerWidth <= 768;
    const itemsPerSlide = isMobile ? 1 : 3;
    const totalSlides = Math.ceil(projectsData.length / itemsPerSlide);

    const resetTimeout = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
    };

    useEffect(() => {
        resetTimeout();
        timeoutRef.current = window.setTimeout(
            () =>
                setCurrentIndex((prevIndex) =>
                    prevIndex === totalSlides - 1 ? 0 : prevIndex + 1
                ),
            4000
        );

        return () => {
            resetTimeout();
        };
    }, [currentIndex, totalSlides]);

    const visibleProjects = projectsData.slice(
        currentIndex * itemsPerSlide,
        (currentIndex + 1) * itemsPerSlide
    );

    const goToSlide = (slideIndex: number) => {
        setCurrentIndex(slideIndex);
    };

    return (
        <section id="projects" className="bg-white py-16 md:py-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-gray-900">Dự án đã thực hiện</h2>
                    <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">Một số dự án tiêu biểu tôi đã tham gia và hoàn thành.</p>
                </div>

                <div className="mt-12 relative overflow-hidden">
                    <div
                        className="whitespace-nowrap transition-transform duration-500 ease-in-out"
                        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                    >
                        {Array.from({ length: totalSlides }).map((_, slideIndex) => (
                            <div key={slideIndex} className="inline-block w-full">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-2">
                                    {projectsData.slice(slideIndex * itemsPerSlide, (slideIndex + 1) * itemsPerSlide).map(project => (
                                        <div key={project.id} className="project-card group rounded-lg shadow-lg overflow-hidden h-full">
                                            <a href={project.link || '#'} className="block">
                                                <img src={project.imageUrl || 'https://picsum.photos/600/400'}
                                                    alt={project.title}
                                                    className="w-full h-48 object-cover group-hover:opacity-80 transition duration-300"
                                                    loading="lazy" />
                                            </a>
                                            <div className="p-6">
                                                <span className="text-sm text-indigo-600 font-medium">{project.category}</span>
                                                <h3 className="mt-1 text-xl font-bold text-gray-900">{project.title}</h3>
                                                <p className="mt-2 text-base text-gray-600 line-clamp-3">{project.description}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                        {Array.from({ length: totalSlides }).map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => goToSlide(idx)}
                                className={`h-2 w-2 rounded-full transition-colors duration-300 ${currentIndex === idx ? 'bg-indigo-600 w-4' : 'bg-gray-300 hover:bg-gray-400'}`}
                            ></button>
                        ))}
                    </div>
                </div>
                 <div className="mt-12 text-center">
					<NavLink to="/projects" className="inline-flex items-center px-6 py-3 border border-indigo-600 text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50 transition duration-150">
						<ArrowRight className="mr-2 -ml-1 h-5 w-5" />
						Xem thêm dự án
					</NavLink>
				</div>
            </div>
        </section>
    );
};


// --- AI Generator Component ---
const AIGenerator: React.FC = () => {
    const [brandName, setBrandName] = useState('');
    const [industry, setIndustry] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<{ slogans: string[]; seoDescription: string } | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = async () => {
        if (!brandName || !industry) {
            setError('Vui lòng nhập đầy đủ Tên thương hiệu và Lĩnh vực!');
            return;
        }

        setIsLoading(true);
        setResult(null);
        setError(null);

        try {
            const aiResult = await generateSloganAndDescription(brandName, industry);
            setResult(aiResult);
        } catch (err: any) {
            setError(err.message || 'Có lỗi xảy ra khi tạo nội dung.');
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <section id="ai-generator" className="py-16 bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900 relative overflow-hidden">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-10">
                    <span className="inline-block py-1 px-3 rounded-full bg-indigo-500/30 text-indigo-200 text-sm font-semibold mb-4 border border-indigo-400/30">
                        ✨ Được hỗ trợ bởi Gemini AI
                    </span>
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Trợ Lý Sáng Tạo Nội Dung AI</h2>
                    <p className="text-indigo-200 text-lg max-w-2xl mx-auto">
                        Bí ý tưởng cho website? Hãy để AI gợi ý <span className="text-white font-bold">Slogan độc đáo</span> và <span className="text-white font-bold">Mô tả chuẩn SEO!</span>
                    </p>
                </div>
                <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 md:p-8 shadow-2xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <input type="text" value={brandName} onChange={e => setBrandName(e.target.value)} placeholder="Ví dụ: Cà phê Mây Lang Thang" className="w-full px-4 py-3 bg-white/5 border border-indigo-300/30 rounded-lg text-white placeholder-indigo-300/50 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition" />
                        <input type="text" value={industry} onChange={e => setIndustry(e.target.value)} placeholder="Ví dụ: Quán cà phê acoustic" className="w-full px-4 py-3 bg-white/5 border border-indigo-300/30 rounded-lg text-white placeholder-indigo-300/50 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition" />
                    </div>
                    <div className="text-center">
                        <button onClick={handleGenerate} disabled={isLoading} className="group relative inline-flex items-center justify-center px-8 py-3 text-base font-bold text-white transition-all duration-200 bg-indigo-600 rounded-full hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed">
                            <Sparkles className="w-5 h-5 mr-2" />
                            {isLoading ? 'Đang tạo...' : 'Tạo Nội Dung Ngay'}
                        </button>
                    </div>
                    {isLoading && (
                        <div className="mt-8 text-center py-6">
                            <div className="flex flex-col items-center justify-center space-y-4">
                                <div className="ai-dots space-x-2"><div></div><div></div><div></div></div>
                                <p className="text-indigo-200 font-semibold text-lg">Gemini đang suy nghĩ...</p>
                                <p className="text-indigo-300 text-sm italic">Việc này có thể mất vài giây.</p>
                            </div>
                        </div>
                    )}
                    {error && <p className="text-red-400 text-center mt-4">{error}</p>}
                    {result && (
                         <div className="mt-8 pt-8 border-t border-white/10">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-black/20 rounded-xl p-5 border border-white/10">
                                    <h3 className="text-lg font-semibold text-white mb-3 flex items-center"><Lightbulb className="w-5 h-5 mr-2 text-yellow-400" /> Gợi ý Slogan</h3>
                                    <ul className="space-y-3 text-indigo-100">{result.slogans.map((s, i) => <li key={i} className="flex items-start"><span className="mr-2 text-yellow-400">★</span> {s}</li>)}</ul>
                                </div>
                                <div className="bg-black/20 rounded-xl p-5 border border-white/10">
                                    <h3 className="text-lg font-semibold text-white mb-3 flex items-center"><FileText className="w-5 h-5 mr-2 text-green-400" /> Mô tả Website (SEO)</h3>
                                    <p className="text-indigo-100 text-sm leading-relaxed italic">{result.seoDescription}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

// --- Main Home Component ---
const Home: React.FC = () => {

    const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const form = event.currentTarget;
        const data = new FormData(form);
        const successMessage = document.getElementById('success-message');

        try {
            const response = await fetch(form.action, {
                method: 'POST',
                body: data,
                headers: {
                    'Accept': 'application/json'
                }
            });
            if (response.ok) {
                if(successMessage) successMessage.classList.add('show');
                setTimeout(() => { if(successMessage) successMessage.classList.remove('show'); }, 3000);
                form.reset();
            } else {
                alert('Có lỗi xảy ra khi gửi form.');
            }
        } catch (error) {
            alert('Có lỗi mạng, vui lòng thử lại.');
        }
    };


    return (
        <div>
            {/* Hero Section */}
            <section id="hero" className="relative h-[calc(100vh-4rem)] w-full overflow-hidden">
                <video
                    className="absolute top-1/2 left-1/2 min-w-full min-h-full w-auto h-auto object-cover transform -translate-x-1/2 -translate-y-1/2 z-0"
                    src="https://videos.pexels.com/video-files/7578543/7578543-hd_1920_1080_30fps.mp4" 
                    autoPlay loop muted playsInline>
                </video>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/40 z-10"></div>
                <div className="relative z-20 flex flex-col justify-center items-center h-full text-center max-w-4xl mx-auto px-4">
                    <span className="font-medium text-indigo-300">Thiết kế Web & Ứng dụng</span>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mt-2 drop-shadow-lg">
                        Website chuyên nghiệp, <span className="text-indigo-400">tinh tế</span>
                    </h1>
                    <p className="mt-4 text-lg text-gray-200 drop-shadow-md">Thiết kế thanh lịch, sang trọng - Nâng tầm thương hiệu của bạn.</p>
                    <div className="mt-8 flex flex-wrap justify-center gap-4">
                        <NavLink to="/projects" className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700">
                            <FolderKanban className="mr-2 -ml-1 h-5 w-5" />
                            Xem dự án
                        </NavLink>
                        <NavLink to="/bao-gia" className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-gray-900 bg-white hover:bg-gray-50">
                            <DollarSign className="mr-2 -ml-1 h-5 w-5" />
                            Xem báo giá
                        </NavLink>
                    </div>
                </div>
            </section>
            
            {/* About Section */}
            <section id="about" className="bg-gray-100 py-16 md:py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    <div className="flex-shrink-0 flex justify-center">
                        <img className="h-64 w-64 rounded-full shadow-xl object-cover" src="https://picsum.photos/seed/avatar/256" alt="Ảnh Fi.tallest" />
                    </div>
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900">Giới thiệu về Fi.tallest</h2>
                        <p className="mt-4 text-lg text-gray-600">Xin chào! Tôi là một nhà thiết kế web và ứng dụng đam mê sáng tạo. Với nhiều năm kinh nghiệm, tôi chuyên biến những ý tưởng phức tạp thành các giao diện (UI/UX) đẹp mắt, trực quan và dễ sử dụng.</p>
                        <p className="mt-3 text-lg text-gray-600">Mục tiêu của tôi là tạo ra những sản phẩm không chỉ có tính thẩm mỹ cao mà còn mang lại hiệu quả kinh doanh rõ rệt cho khách hàng.</p>
                        <div className="mt-6">
                            <NavLink to="/#contact" className="inline-flex items-center px-5 py-2 border border-indigo-600 text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50">
                                <Send className="mr-2 -ml-1 h-5 w-5" />
                                Liên hệ
                            </NavLink>
                        </div>
                    </div>
                </div>
            </section>

             {/* Services Section */}
            <section id="services" className="bg-gray-50 py-16 md:py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h2 className="text-3xl font-bold text-gray-900">Dịch vụ của tôi</h2>
                        <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">Cung cấp các giải pháp toàn diện từ thiết kế đến phát triển sản phẩm.</p>
                    </div>
                    <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="bg-white p-6 rounded-lg shadow-lg">
                            <LayoutTemplate className="h-10 w-10 text-indigo-600" />
                            <h3 className="mt-4 text-xl font-bold text-gray-900">Thiết kế Website (UI/UX)</h3>
                            <p className="mt-2 text-base text-gray-600">Thiết kế giao diện độc quyền, tập trung vào trải nghiệm người dùng mượt mà và thân thiện trên mọi thiết bị.</p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-lg">
                            <Code2 className="h-10 w-10 text-indigo-600" />
                            <h3 className="mt-4 text-xl font-bold text-gray-900">Phát triển Website</h3>
                            <p className="mt-2 text-base text-gray-600">Xây dựng website hoàn chỉnh dựa trên các công nghệ hiện đại, đảm bảo tốc độ và bảo mật.</p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-lg">
                            <Smartphone className="h-10 w-10 text-indigo-600" />
                            <h3 className="mt-4 text-xl font-bold text-gray-900">Thiết kế Ứng dụng (App)</h3>
                            <p className="mt-2 text-base text-gray-600">Thiết kế giao diện cho ứng dụng di động (iOS & Android), tối ưu hóa từng thao tác để giữ chân người dùng.</p>
                        </div>
                    </div>
                </div>
            </section>

            <AIGenerator />
            
            <ProjectsCarousel />
            
             {/* Registration Section */}
            <section id="register" className="py-20 relative overflow-hidden animate-gradient-bg">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="bg-white/95 p-8 md:p-12 rounded-2xl shadow-2xl">
                        <header className="text-center mb-12">
                            <h2 className="text-4xl font-extrabold text-gray-900 mb-3 tracking-tight">Hiện Thực Hóa Ý Tưởng</h2>
                            <p className="text-lg text-gray-600 max-w-xl mx-auto font-light">
                                Đội ngũ Fi.tallest sẵn sàng lắng nghe và cùng bạn xây dựng giải pháp công nghệ đột phá.
                            </p>
                        </header>
                        <form onSubmit={handleFormSubmit} action="https://formspree.io/f/xldojlkn" method="POST" className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="relative"><input type="text" name="Họ tên" placeholder="Nguyễn Văn A" className="custom-input w-full p-3 pl-10 border border-gray-300 rounded-lg" /><User className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" /></div>
                                <div className="relative"><input type="tel" name="Số điện thoại" required placeholder="0909 xxx xxx" className="custom-input w-full p-3 pl-10 border border-gray-300 rounded-lg" /><Phone className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" /></div>
                            </div>
                            <textarea name="Nội dung thêm" rows={4} className="w-full p-3 border border-gray-300 rounded-lg" placeholder="Mô tả dự án hoặc yêu cầu..."></textarea>
                            <div className="text-center pt-4">
                                <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 inline-flex items-center justify-center px-12 py-4 border border-transparent text-lg font-bold rounded-full text-white w-full sm:w-auto shadow-lg">
                                    <Send className="w-5 h-5 mr-2" />
                                    Gửi Yêu Cầu Tư Vấn
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default Home;
