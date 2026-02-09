
import React from 'react';
import { Check, Zap, Crown, Rocket } from 'lucide-react';

export const Pricing: React.FC = () => {
  const plans = [
    {
      name: 'الأساسية',
      price: 'مجاناً',
      icon: Zap,
      features: ['5,000 حرف شهرياً', 'أصوات أساسية', 'تنزيل بصيغة MP3', 'دعم عبر المجتمع'],
      color: 'gray',
      buttonText: 'ابدأ مجاناً'
    },
    {
      name: 'المحترفين',
      price: '$29',
      period: '/شهرياً',
      icon: Rocket,
      features: ['100,000 حرف شهرياً', 'جميع الأصوات الاحترافية', 'جودة صوت فائقة', 'دعم الأولوية', 'تنزيل بجميع الصيغ'],
      color: 'indigo',
      popular: true,
      buttonText: 'اشترك الآن'
    },
    {
      name: 'المؤسسات',
      price: 'مخصص',
      icon: Crown,
      features: ['حروف غير محدودة', 'دعم API مخصص', 'مدير حساب خاص', 'حقوق تجارية كاملة', 'تدريب الفريق'],
      color: 'emerald',
      buttonText: 'تواصل معنا'
    }
  ];

  return (
    <div className="py-8 animate-in zoom-in-95 duration-500">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4">اختر الخطة التي تناسب احتياجاتك</h1>
        <p className="text-xl text-gray-500">حلول مرنة لصناع المحتوى والشركات بمختلف أحجامها</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan) => (
          <div 
            key={plan.name}
            className={`
              relative bg-white rounded-3xl p-8 border-2 flex flex-col transition-all duration-300
              ${plan.popular ? 'border-indigo-600 scale-105 shadow-2xl shadow-indigo-100 z-10' : 'border-gray-100 hover:border-gray-200 shadow-sm'}
            `}
          >
            {plan.popular && (
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-indigo-600 text-white text-xs font-bold px-4 py-1 rounded-full uppercase tracking-widest shadow-lg">
                الأكثر اختياراً
              </div>
            )}

            <div className="mb-8">
              <div className={`
                w-14 h-14 rounded-2xl flex items-center justify-center mb-6
                ${plan.color === 'indigo' ? 'bg-indigo-50 text-indigo-600' : plan.color === 'emerald' ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-50 text-gray-600'}
              `}>
                <plan.icon size={28} />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h2>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-gray-900">{plan.price}</span>
                {plan.period && <span className="text-gray-500 font-medium">{plan.period}</span>}
              </div>
            </div>

            <div className="flex-1 space-y-4 mb-10">
              {plan.features.map((feature) => (
                <div key={feature} className="flex items-center gap-3 text-gray-600 font-medium">
                  <div className="w-5 h-5 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <Check size={12} strokeWidth={3} />
                  </div>
                  <span>{feature}</span>
                </div>
              ))}
            </div>

            <button className={`
              w-full py-4 rounded-2xl font-bold transition-all
              ${plan.color === 'indigo' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 hover:bg-indigo-700' : 'bg-white text-gray-900 border-2 border-gray-100 hover:border-gray-300 hover:bg-gray-50'}
            `}>
              {plan.buttonText}
            </button>
          </div>
        ))}
      </div>

      <div className="mt-20 p-10 bg-indigo-900 rounded-[3rem] text-center text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-64 h-64 bg-indigo-800 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl opacity-50"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-indigo-500 rounded-full translate-x-1/2 translate-y-1/2 blur-3xl opacity-20"></div>
        
        <h2 className="text-3xl font-bold mb-4 relative z-10">هل لديك احتياجات خاصة؟</h2>
        <p className="text-indigo-200 mb-8 max-w-2xl mx-auto relative z-10">نحن هنا لمساعدتك في تخصيص حل صوتي يناسب مؤسستك تماماً. تواصل مع فريق المبيعات لدينا للحصول على عرض سعر مخصص.</p>
        <button className="px-10 py-4 bg-white text-indigo-900 rounded-2xl font-bold hover:bg-indigo-50 transition-all relative z-10 shadow-xl">
          تحدث معنا الآن
        </button>
      </div>
    </div>
  );
};
