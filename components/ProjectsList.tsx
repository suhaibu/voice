
import React from 'react';
import { Project, Emotion } from '../types';
import { VOICES } from '../constants';
import { 
  PlusCircle, 
  Search, 
  Trash2, 
  ExternalLink, 
  Calendar, 
  Clock,
  Mic2
} from 'lucide-react';

interface ProjectsListProps {
  projects: Project[];
  onSelect: (p: Project) => void;
  onDelete: (id: string) => void;
}

export const ProjectsList: React.FC<ProjectsListProps> = ({ projects, onSelect, onDelete }) => {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">مشاريعي الصوتية</h1>
          <p className="text-gray-500">قم بإدارة وتحميل أعمالك السابقة بكل سهولة</p>
        </div>
        <button 
          // Fix: Replaced invalid use of 'any' as a value with Emotion.Neutral and ensured valid object structure
          onClick={() => onSelect({
            id: 'temp',
            title: 'مشروع جديد',
            text: '',
            voiceId: VOICES[0].id,
            settings: { emotion: Emotion.Neutral, emotionLevel: 50, pitch: 1, speed: 1, intensity: 50 },
            createdAt: Date.now()
          })}
          className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
        >
          <PlusCircle size={20} />
          <span>بدء مشروع جديد</span>
        </button>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        {projects.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-right">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 text-sm font-bold">
                  <th className="px-8 py-5">المشروع</th>
                  <th className="px-8 py-5">الصوت المستخدم</th>
                  <th className="px-8 py-5">تاريخ التوليد</th>
                  <th className="px-8 py-5">الحجم / الطول</th>
                  <th className="px-8 py-5">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {projects.map((p) => {
                  const voice = VOICES.find(v => v.id === p.voiceId);
                  const date = new Date(p.createdAt).toLocaleDateString('ar-EG');
                  return (
                    <tr key={p.id} className="group hover:bg-indigo-50/30 transition-colors">
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg group-hover:scale-110 transition-transform">
                            <Mic2 size={18} />
                          </div>
                          <div>
                            <p className="font-bold text-gray-900">{p.title || 'مشروع بدون عنوان'}</p>
                            <p className="text-xs text-gray-400 line-clamp-1">{p.text.substring(0, 50)}...</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{voice?.gender === 'male' ? '👨' : '👩'}</span>
                          <span className="font-medium text-gray-700">{voice?.name}</span>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-2 text-gray-500 text-sm">
                          <Calendar size={14} />
                          <span>{date}</span>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-2 text-gray-500 text-sm">
                          <Clock size={14} />
                          <span>{Math.ceil(p.text.length / 10)} ثانية تقريباً</span>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => onSelect(p)}
                            className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-white rounded-lg shadow-sm border border-transparent hover:border-indigo-100 transition-all"
                          >
                            <ExternalLink size={18} />
                          </button>
                          <button 
                            onClick={() => onDelete(p.id)}
                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-white rounded-lg shadow-sm border border-transparent hover:border-red-100 transition-all"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-20 text-center">
            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-white shadow-inner">
              <History size={40} className="text-gray-200" />
            </div>
            <h3 className="text-2xl font-extrabold text-gray-900 mb-2">لا توجد مشاريع حتى الآن</h3>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">ابدأ رحلتك الإبداعية الآن وقم بتحويل نصوصك إلى أعمال صوتية احترافية بجودة لا تضاهى.</p>
            <button 
              // Fix: Replaced empty object casted to any with a valid initial Project object
              onClick={() => onSelect({
                id: 'temp',
                title: 'مشروع جديد',
                text: '',
                voiceId: VOICES[0].id,
                settings: { emotion: Emotion.Neutral, emotionLevel: 50, pitch: 1, speed: 1, intensity: 50 },
                createdAt: Date.now()
              })}
              className="px-10 py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100"
            >
              ابدأ الآن مجاناً
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
