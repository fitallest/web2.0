
import React, { useState, useEffect } from 'react';
import Footer from '../components/Footer';

const BaoGia: React.FC = () => {
    // State management
    const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
    const [selectedIndustry, setSelectedIndustry] = useState('yte');
    const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
    const [selectedHosting, setSelectedHosting] = useState<string | null>(null);
    const [selectedDomain, setSelectedDomain] = useState<string | null>(null);
    const [discountCode, setDiscountCode] = useState('');
    const [discountInfo, setDiscountInfo] = useState<{ type: 'none' | 'percent' | 'fixed'; amount: number; message: string }>({ type: 'none', amount: 0, message: '' });
    const [costs, setCosts] = useState({
        packageCost: 0,
        addonCost: 0,
        hostingCost: 0,
        domainCost: 0,
        discountAmount: 0,
        vatAmount: 0,
        totalCost: 0,
    });
    const [isExtraHostingVisible, setIsExtraHostingVisible] = useState(false);
    const [isQuotePanelOpen, setIsQuotePanelOpen] = useState(false);
    const [modal, setModal] = useState<{ show: boolean; title: string; content: React.ReactNode; type: 'success' | 'error' }>({ show: false, title: '', content: null, type: 'error' });
    
    // Pricing Data (Base prices, without VAT)
    const PRICES_BASE = {
        package_basic: 7500000, package_multiple_interface: 10500000, package_full: 13500000,
        addon_doctor_lookup: 2000000, addon_rating_system: 3500000, addon_bmi_calculator: 2500000, addon_advanced_api: 5000000,
        addon_project_portfolio: 4000000, addon_estimation_tool: 6000000, addon_booking_spa: 4500000, addon_gallery_before_after: 3000000,
        addon_ecommerce: 8000000, addon_inventory_management: 5000000,
        hosting_5gb: 4872000, hosting_7gb: 6000000, hosting_10gb: 7200000, hosting_20gb_ca_nhan: 12000000, hosting_16gb: 10560000,
        hosting_25gb: 14400000, hosting_30gb: 16080000, hosting_40gb_dn: 20080000, hosting_50gb_dn: 24000000, hosting_70gb_dn: 32040000,
        hosting_100gb_sieu_dn: 43200000, hosting_200gb_sieu_dn: 72000000,
        domain_com: 339000, domain_vn: 759259, domain_com_vn: 639815
    };

    const VAT_RATE = 0.08;
    const formatCurrency = (amount: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', minimumFractionDigits: 0 }).format(Math.round(amount));

    useEffect(() => {
        const packageBase = selectedPackage ? PRICES_BASE[selectedPackage as keyof typeof PRICES_BASE] || 0 : 0;
        const addonsBase = selectedAddons.reduce((acc, addon) => acc + (PRICES_BASE[addon as keyof typeof PRICES_BASE] || 0), 0);
        const hostingBase = selectedHosting ? PRICES_BASE[selectedHosting as keyof typeof PRICES_BASE] || 0 : 0;
        const domainBase = selectedDomain ? PRICES_BASE[selectedDomain as keyof typeof PRICES_BASE] || 0 : 0;

        const totalDesignBase = packageBase + addonsBase;
        let finalDiscountAmount = 0;
        if (discountInfo.type === 'percent') {
            finalDiscountAmount = totalDesignBase * (discountInfo.amount / 100);
        } else if (discountInfo.type === 'fixed') {
            finalDiscountAmount = discountInfo.amount;
        }
        finalDiscountAmount = Math.min(finalDiscountAmount, totalDesignBase);

        const totalDesignAfterDiscountBase = totalDesignBase - finalDiscountAmount;

        const hostingWithVAT = hostingBase * (1 + VAT_RATE);
        const domainWithVAT = domainBase * (1 + VAT_RATE);
        const vatAmount = (hostingBase + domainBase) * VAT_RATE;
        
        setCosts({
            packageCost: packageBase,
            addonCost: addonsBase,
            hostingCost: hostingWithVAT,
            domainCost: domainWithVAT,
            discountAmount: finalDiscountAmount,
            vatAmount: vatAmount,
            totalCost: totalDesignAfterDiscountBase + hostingWithVAT + domainWithVAT,
        });

    }, [selectedPackage, selectedAddons, selectedHosting, selectedDomain, discountInfo]);

    const handleIndustryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedIndustry(e.target.value);
        setSelectedAddons([]); // Reset addons on industry change
    };

    const handleAddonToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, checked } = e.target;
        setSelectedAddons(prev => checked ? [...prev, id] : prev.filter(a => a !== id));
    };

    const applyDiscount = () => {
      // Logic from original JS to parse discount codes
      const code = discountCode.trim().toUpperCase();
      if (!code) {
        setDiscountInfo({ type: 'none', amount: 0, message: 'Vui lòng nhập mã.' });
        return;
      }
      if (code.startsWith('FI') && code.endsWith('PT')) {
        const percent = parseFloat(code.substring(2, code.length - 2));
        if (!isNaN(percent) && percent > 0) {
            setDiscountInfo({ type: 'percent', amount: percent, message: `Áp dụng giảm ${percent}%.` });
        } else { setDiscountInfo({ type: 'none', amount: 0, message: 'Mã % không hợp lệ.' }); }
      } else if (code.startsWith('FI') && code.endsWith('TR')) {
        let amountString = code.substring(2, code.length - 2);
        let amount = parseFloat(amountString.replace('TR', '.')) * 1000000;
        if (!isNaN(amount) && amount > 0) {
            setDiscountInfo({ type: 'fixed', amount: amount, message: `Áp dụng giảm ${formatCurrency(amount)}.` });
        } else { setDiscountInfo({ type: 'none', amount: 0, message: 'Mã tiền mặt không hợp lệ.' }); }
      } else {
        setDiscountInfo({ type: 'none', amount: 0, message: 'Mã không hợp lệ.' });
      }
    };
    
    const finalizeQuote = () => {
        if (!selectedPackage) {
            setModal({ show: true, title: 'Vui lòng hoàn tất', content: <p>Bạn cần chọn một <b>Gói Thiết kế</b> để tiếp tục.</p>, type: 'error' });
            return;
        }
        const designCostHalf = (costs.packageCost + costs.addonCost - costs.discountAmount) / 2;
        const totalInfra = costs.hostingCost + costs.domainCost;

        setModal({
            show: true,
            title: 'Yêu cầu báo giá thành công!',
            type: 'success',
            content: (
                 <div className="w-full text-left space-y-4">
                    <div>
                        <p className="text-sm text-gray-400 uppercase tracking-wide">TỔNG CHI PHÍ DỰ KIẾN (ĐÃ VAT):</p>
                        <p className="text-2xl sm:text-3xl font-bold text-white">{formatCurrency(costs.totalCost)}</p>
                    </div>
                     {costs.discountAmount > 0 && <div><p className="text-sm text-gray-400 uppercase tracking-wide">ĐÃ GIẢM:</p><p className="text-lg sm:text-xl font-bold text-green-500">-{formatCurrency(costs.discountAmount)}</p></div>}
                     <hr className="my-4 border-gray-600" />
                     <p className="text-base font-semibold text-gray-200 mb-3">PHƯƠNG THỨC THANH TOÁN (3 ĐỢT):</p>
                     <div className="space-y-3">
                         <div><p className="font-semibold text-indigo-400">ĐỢT 1 (Ký Hợp đồng):</p><p className="text-sm text-gray-300"><b>Chi phí:</b> {formatCurrency(designCostHalf)}</p></div>
                         <div><p className="font-semibold text-cyan-400">ĐỢT 2 (Triển khai Hạ tầng):</p><p className="text-sm text-gray-300"><b>Chi phí:</b> {formatCurrency(totalInfra)}</p></div>
                         <div><p className="font-semibold text-indigo-400">ĐỢT 3 (Bàn giao):</p><p className="text-sm text-gray-300"><b>Chi phí:</b> {formatCurrency(designCostHalf)}</p></div>
                     </div>
                 </div>
            )
        });
    };

    return (
        <>
        <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
            {/* Header */}
            <header className="text-center mb-12 bg-white p-6 sm:p-10 rounded-xl shadow-lg">
                <h1 className="text-3xl sm:text-4xl font-extrabold text-indigo-600 mb-2"> BÁO GIÁ DỊCH VỤ THIẾT KẾ WEBSITE</h1>
                <p className="text-lg sm:text-xl text-gray-700">Giải pháp chuyên nghiệp cho <span className="font-semibold text-cyan-600">Mọi Ngành Nghề</span></p>
            </header>

            {/* Sections */}
            <section id="package-section" className="mb-12">
                 <h2 className="text-2xl font-bold text-gray-800 border-b-2 border-indigo-600 pb-2 mb-8">II. Chọn Gói Thiết Kế</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Package Cards */}
                    {[{id: 'package_basic', name: 'Gói Cơ Bản', price: '7.500.000', popular: false}, {id: 'package_multiple_interface', name: 'Đa Giao Diện', price: '10.500.000', popular: true}, {id: 'package_full', name: 'Gói Đầy Đủ', price: '13.500.000', popular: false, recommended: true}].map(pkg => (
                         <label key={pkg.id} htmlFor={pkg.id} className={`cursor-pointer bg-white p-6 rounded-xl shadow-lg border-4 ${selectedPackage === pkg.id ? (pkg.popular ? 'border-indigo-600 ring-4 ring-indigo-300' : pkg.recommended ? 'border-cyan-600 ring-4 ring-cyan-300' : 'border-gray-700 ring-4 ring-gray-300') : 'border-gray-400'} transition duration-300 hover:shadow-xl`}>
                            <input type="radio" id={pkg.id} name="package-option" value={pkg.id} checked={selectedPackage === pkg.id} onChange={(e) => setSelectedPackage(e.target.value)} className="hidden"/>
                            <h3 className={`text-2xl font-extrabold mb-2 ${selectedPackage === pkg.id && pkg.popular ? 'text-indigo-600' : selectedPackage === pkg.id && pkg.recommended ? 'text-cyan-600' : 'text-gray-700'}`}>{pkg.name}</h3>
                             <div className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">{pkg.price} <span className="text-lg font-normal">VNĐ</span></div>
                         </label>
                    ))}
                </div>
            </section>
            
            {/* Other sections and footer */}
             <div id="quote-summary-footer" className={`fixed bottom-0 left-0 right-0 z-50 bg-white border-t-4 border-indigo-600 shadow-[0_-8px_20px_rgba(0,0,0,0.1)] transition-all duration-500 ease-in-out ${isQuotePanelOpen ? 'panel-open' : ''}`}>
                <div onClick={() => setIsQuotePanelOpen(!isQuotePanelOpen)} className="max-w-7xl mx-auto pt-3 pb-4 px-4 cursor-pointer group transition-colors hover:bg-gray-50">
                    <div className="flex justify-between items-center">
                        <p className="text-base sm:text-lg font-bold text-gray-800">TỔNG CỘNG (đã bao gồm VAT):</p>
                        <div className="flex items-center">
                            <p className="text-xl sm:text-2xl font-extrabold text-red-700 mr-4">{formatCurrency(costs.totalCost)}</p>
                        </div>
                    </div>
                </div>
                 <div id="quote-details-panel" className={isQuotePanelOpen ? 'expanded' : ''}>
                    <div className="px-4 pb-4">
                        {/* Summary Details */}
                         <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
                            <div className="w-full lg:w-3/5">
                                 <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-x-3 gap-y-2 w-full text-center sm:text-left">
                                     <div className="border-b lg:border-b-0 lg:border-r pb-1 lg:pb-0 lg:pr-2"><p className="text-xs text-gray-600">Gói TK:</p><p className="font-bold text-indigo-600">{formatCurrency(costs.packageCost)}</p></div>
                                     <div className="border-b lg:border-b-0 lg:border-r pb-1 lg:pb-0 lg:pr-2"><p className="text-xs text-gray-600">Add-on:</p><p className="font-bold text-red-600">{formatCurrency(costs.addonCost)}</p></div>
                                     <div className="border-b lg:border-b-0 lg:border-r pb-1 lg:pb-0 lg:pr-2"><p className="text-xs text-gray-600">Ưu đãi:</p><p className="font-bold text-green-600">-{formatCurrency(costs.discountAmount)}</p></div>
                                     <div className="border-b lg:border-b-0 lg:border-r pb-1 lg:pb-0 lg:pr-2"><p className="text-xs text-gray-600">Hosting:</p><p className="font-bold text-cyan-600">{formatCurrency(costs.hostingCost)}</p></div>
                                     <div><p className="text-xs text-gray-600">Tên miền:</p><p className="font-bold text-cyan-600">{formatCurrency(costs.domainCost)}</p></div>
                                 </div>
                            </div>
                             <div className="flex flex-col gap-3 w-full lg:w-2/5 mt-4 lg:mt-0 lg:pl-6">
                                <div className="flex gap-2">
                                     <input type="text" value={discountCode} onChange={e => setDiscountCode(e.target.value)} placeholder="Nhập mã giảm giá..." className="flex-grow p-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"/>
                                     <button onClick={applyDiscount} className="py-2 px-4 bg-gray-600 text-white font-bold rounded-lg shadow-md hover:bg-gray-700 transition duration-300 text-sm">Áp dụng</button>
                                </div>
                                 <p className="text-xs font-semibold h-4 -mt-2 mb-1 text-green-600">{discountInfo.message}</p>
                                 <button onClick={finalizeQuote} className="w-full py-2 sm:py-3 px-4 bg-indigo-600 text-white font-bold rounded-full text-sm sm:text-base shadow-xl hover:bg-indigo-700 transition duration-300">YÊU CẦU BÁO GIÁ</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            {modal.show && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setModal({ ...modal, show: false })}>
                    <div className="bg-gray-800 p-6 rounded-xl shadow-2xl max-w-lg w-full border border-gray-700" onClick={e => e.stopPropagation()}>
                        <h2 className={`text-xl sm:text-2xl font-bold mb-4 ${modal.type === 'success' ? 'text-emerald-400' : 'text-orange-400'}`}>{modal.title}</h2>
                        <div className="text-sm text-gray-300 bg-gray-900/50 border border-gray-700 p-4 rounded-lg max-h-96 overflow-y-auto mb-6">{modal.content}</div>
                        <button onClick={() => setModal({ ...modal, show: false })} className={`w-full text-white font-bold py-3 px-4 rounded-full transition duration-300 ${modal.type === 'success' ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-orange-500 hover:bg-orange-600'}`}>Đã hiểu</button>
                    </div>
                </div>
            )}
        </div>
        <Footer />
        </>
    );
};

export default BaoGia;
