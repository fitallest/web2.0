
import React from 'react';
import { Mail, Phone, Facebook, Linkedin, Github, MessageCircle } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const Footer: React.FC = () => {
    return (
      <>
        <section id="contact" className="bg-gray-800 py-10 md:py-24">
			<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
				<h2 className="text-3xl font-bold text-white">Bạn có dự án? Hãy liên hệ!</h2>
				<p className="mt-4 text-lg text-gray-300">Tôi luôn sẵn sàng lắng nghe ý tưởng của bạn và biến nó thành hiện thực. Đừng ngần ngại gửi email hoặc liên hệ qua các kênh dưới đây.</p>
				<div className="mt-8 space-y-4 sm:space-y-0 sm:flex sm:justify-center sm:gap-4">
					<a href="mailto:caophi.nasani@gmail.com" className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700">
						<Mail className="mr-2 -ml-1 h-5 w-5" />
						Gửi Email (caophi.nasani@gmail.com)
					</a>
					 <a href="tel:0909876817" className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-gray-900 bg-white hover:bg-gray-50">
						<Phone className="mr-2 -ml-1 h-5 w-5" />
						Gọi Ngay (0909876817)
					</a>
				</div>
				<div className="mt-10 flex justify-center space-x-6">
					<a href="#" className="text-gray-400 hover:text-white">
						<span className="sr-only">Facebook</span>
						<Facebook className="h-6 w-6" />
					</a>
					<a href="#" className="text-gray-400 hover:text-white">
						<span className="sr-only">LinkedIn</span>
						<Linkedin className="h-6 w-6" />
					</a>
					<a href="#" className="text-gray-400 hover:text-white">
						<span className="sr-only">Github</span>
						<Github className="h-6 w-6" />
					</a>
				</div>
			</div>
		</section>

        <footer className="bg-gray-900">
            <div className="max-w-7xl mx-auto py-3 px-4 sm:px-6 lg:px-8">
                <p className="text-center text-base text-gray-400">&copy; 2025 Fi.tallest. Mọi quyền được bảo lưu.</p>
            </div>
        </footer>

        <div className="fixed right-4 top-1/2 -translate-y-1/2 z-[1000] flex flex-col gap-3">
            <a href="tel:0909876817"
            className="bg-indigo-600 text-white p-3 rounded-full shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition duration-300 ease-in-out transform hover:scale-110"
            aria-label="Gọi ngay"
            title="Gọi ngay (0909876817)">	
                <Phone className="w-6 h-6" />
            </a>
            <a href="https://zalo.me/0909876817"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-blue-500 text-white p-3 rounded-full shadow-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-300 ease-in-out transform hover:scale-110"
            aria-label="Nhắn Zalo"
            title="Nhắn Zalo (0909876817)">
                <MessageCircle className="w-6 h-6" />
            </a>
        </div>

        <div id="success-message">
            Đăng ký thành công! Cảm ơn bạn.
        </div>
      </>
    );
};

export default Footer;
