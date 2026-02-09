
import React, { useState, useRef } from 'react';
import { Play, User, Star, Search, Filter, Headphones, Loader2, Volume2 } from 'lucide-react';
import { VOICES } from '../constants';
import { generateSpeech } from '../services/geminiService';
import { Emotion } from '../types';

interface VoiceLibraryProps {
  selectedVoiceId: string;
  onSelect: (id: string) => void;
}

export const VoiceLibrary: React.FC<VoiceLibraryProps> = ({ selectedVoiceId, onSelect }) => {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'male' | 'female'>('all');
  const [loadingVoiceId, setLoadingVoiceId] = useState<string | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const currentSourceRef = useRef<AudioBufferSourceNode | null>(null);

  const filteredVoices = VOICES.filter(v => {
    const matchesSearch = v.name.includes(search) || v.description.includes(search);
    const matchesFilter = filter === 'all' || v.gender === filter;
    return matchesSearch && matchesFilter;
  });

  const handlePreview = async (voice: typeof VOICES[0]) => {
    if (loadingVoiceId) return;

    if (currentSourceRef.current) {
      currentSourceRef.current.stop();
      currentSourceRef.current = null;
    }

    setLoadingVoiceId(voice.id);

    try {
      const buffer = await generateSpeech(
        voice.previewText,
        voice.geminiVoiceName,
        {
          emotion: Emotion.Neutral,
          emotionLevel: 50,
          pitch: 1.0,
          speed: 1.0,
          intensity: 50
        }
      );

      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }

      const source = audioContextRef.current.createBufferSource();
      source.buffer = buffer;
      source.connect(audioContextRef.current.destination);
      source.onended = () => {
        setLoadingVoiceId(null);
      };
      
      currentSourceRef.current = source;
      source.start(0);
      setLoadingVoiceId(voice.id + '_playing');
      
      setTimeout(() => {
        if (loadingVoiceId === voice.id + '_playing') setLoadingVoiceId(null);
      }, (buffer.duration * 1000) + 100);

    } catch (err) {
      console.error("Preview failed:", err);
      alert("عذراً، فشل تشغيل المعاينة. يرجى المحاولة مرة أخرى.");
      setLoadingVoiceId(null);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">مكتبة الأصوات</h1>
          <p className="text-gray-500 text-lg">اختر الصوت المثالي الذي يعبر عن علامتك التجارية</p>
        </div>
        
        <div className="flex flex-wrap gap-4">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text"
              placeholder="ابحث عن اسم الصوت..."
              className="pr-10 pl-4 py-3 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-indigo-200 outline-none w-full md:w-64 text-right"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex bg-white p-1 rounded-2xl border border-gray-200">
            {[
              { id: 'all', label: 'الكل' },
              { id: 'male', label: 'رجالي' },
              { id: 'female', label: 'نسائي' }
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id as any)}
                className={`
                  px-6 py-2 rounded-xl text-sm font-bold transition-all
                  ${filter === f.id ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-500 hover:text-gray-700'}
                `}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVoices.map((voice) => (
          <div 
            key={voice.id}
            className={`
              bg-white rounded-3xl p-6 border-2 transition-all group relative overflow-hidden
              ${selectedVoiceId === voice.id ? 'border-indigo-600 shadow-xl shadow-indigo-50' : 'border-transparent hover:border-indigo-100 shadow-sm'}
            `}
          >
            <div className="flex items-start justify-between mb-6">
              <div className={`
                w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-inner
                ${voice.gender === 'male' ? 'bg-blue-50 text-blue-600' : 'bg-pink-50 text-pink-600'}
              `}>
                {voice.gender === 'male' ? '👨' : '👩'}
              </div>
              <div className="flex flex-col items-end">
                <div className="flex gap-1 mb-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} size={14} className="fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${voice.gender === 'male' ? 'bg-blue-100 text-blue-700' : 'bg-pink-100 text-pink-700'}`}>
                  {voice.gender === 'male' ? 'صوت رجالي' : 'صوت نسائي'}
                </span>
              </div>
            </div>

            <div className="mb-6 text-right">
              <h3 className="text-xl font-extrabold text-gray-900 mb-2">{voice.name}</h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-4 h-10 line-clamp-2">{voice.description}</p>
              <div className="flex flex-wrap gap-2 justify-start flex-row-reverse">
                {voice.tags.map(tag => (
                  <span key={tag} className="text-xs font-bold px-3 py-1 bg-gray-100 text-gray-600 rounded-full">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-gray-50 rounded-2xl p-4 mb-6 relative overflow-hidden group/preview border border-gray-100">
              <div className="flex justify-between items-center mb-2">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePreview(voice);
                  }}
                  disabled={loadingVoiceId === voice.id}
                  className="p-2 bg-white rounded-full shadow-md text-indigo-600 hover:bg-indigo-50 transition-all active:scale-95 disabled:opacity-50 z-10"
                  title="تشغيل عينة"
                >
                  {loadingVoiceId === voice.id ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : loadingVoiceId === voice.id + '_playing' ? (
                    <Volume2 size={18} className="animate-pulse" />
                  ) : (
                    <Play fill="currentColor" size={18} />
                  )}
                </button>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">نص التجربة</p>
              </div>
              <p className="text-sm text-gray-600 line-clamp-2 italic text-right leading-relaxed">"{voice.previewText}"</p>
            </div>

            <button
              onClick={() => onSelect(voice.id)}
              className={`
                w-full py-4 rounded-2xl font-bold transition-all flex items-center justify-center gap-2
                ${selectedVoiceId === voice.id 
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' 
                  : 'bg-white text-indigo-600 border border-indigo-100 hover:bg-indigo-50'}
              `}
            >
              {selectedVoiceId === voice.id ? (
                <>
                  <Headphones size={20} />
                  <span>الصوت المختار</span>
                </>
              ) : (
                <span>اختيار هذا الصوت</span>
              )}
            </button>
          </div>
        ))}
      </div>
      
      {filteredVoices.length === 0 && (
        <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-100">
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <User size={40} className="text-gray-300" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">لم نجد أصواتاً مطابقة لبحثك</h3>
          <p className="text-gray-500">حاول تغيير معايير البحث أو الفلترة</p>
        </div>
      )}
    </div>
  );
};
