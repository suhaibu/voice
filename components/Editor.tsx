
import React, { useState, useRef } from 'react';
import { 
  Play, 
  Download, 
  RotateCcw, 
  Save, 
  Music, 
  Volume2, 
  Settings2,
  Sparkles,
  Loader2,
  Trash2,
  Check
} from 'lucide-react';
import { Project, ContentStyle, Emotion, VoiceSettings } from '../types';
import { VOICES, STYLE_PRESETS } from '../constants';
import { generateSpeech } from '../services/geminiService';
import { createWavBlob } from '../services/audioUtils';

interface EditorProps {
  project: Project;
  onProjectChange: (p: Project) => void;
  onSave: (p: Project) => void;
  onApplyStyle: (s: ContentStyle) => void;
}

export const Editor: React.FC<EditorProps> = ({ project, onProjectChange, onSave, onApplyStyle }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audioBuffer, setAudioBuffer] = useState<AudioBuffer | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const wordCount = project.text.trim() === '' ? 0 : project.text.trim().split(/\s+/).length;
  const currentVoice = VOICES.find(v => v.id === project.voiceId) || VOICES[0];

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onProjectChange({ ...project, text: e.target.value });
  };

  const handleSettingChange = (key: keyof VoiceSettings, value: any) => {
    onProjectChange({
      ...project,
      settings: { ...project.settings, [key]: value }
    });
  };

  const handleGenerate = async () => {
    if (!project.text.trim()) return;
    setIsGenerating(true);
    setAudioUrl(null);
    setAudioBuffer(null);

    try {
      const buffer = await generateSpeech(
        project.text,
        currentVoice.geminiVoiceName,
        project.settings
      );
      
      const blob = createWavBlob(buffer);
      const url = URL.createObjectURL(blob);
      
      setAudioBuffer(buffer);
      setAudioUrl(url);
    } catch (err) {
      alert("حدث خطأ أثناء توليد الصوت. يرجى التحقق من مفتاح API والمحاولة مرة أخرى.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = (format: 'wav') => {
    if (!audioUrl) return;
    const a = document.createElement('a');
    a.href = audioUrl;
    a.download = `${project.title || 'صوتك'}.${format}`;
    a.click();
  };

  const styles: ContentStyle[] = [
    ContentStyle.Advertising,
    ContentStyle.Educational,
    ContentStyle.Documentary,
    ContentStyle.Podcast,
    ContentStyle.News,
    ContentStyle.SocialMedia
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full">
      {/* Left Column: Editor & Styles */}
      <div className="lg:col-span-8 flex flex-col gap-6">
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <input 
            type="text" 
            value={project.title}
            onChange={(e) => onProjectChange({ ...project, title: e.target.value })}
            className="text-2xl font-bold bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-indigo-200 rounded-lg px-2 text-gray-800 w-1/2"
            placeholder="عنوان المشروع..."
          />
          <div className="flex gap-2">
            <button 
              onClick={() => onSave(project)}
              className="flex items-center gap-2 px-4 py-2 text-indigo-600 font-medium hover:bg-indigo-50 rounded-xl transition-colors border border-indigo-100"
            >
              <Save size={18} />
              <span className="hidden sm:inline">حفظ</span>
            </button>
            <button 
              onClick={() => onProjectChange({ ...project, text: '' })}
              className="p-2 text-gray-400 hover:text-red-500 rounded-xl hover:bg-red-50 transition-colors"
            >
              <Trash2 size={20} />
            </button>
          </div>
        </div>

        {/* Style Selector */}
        <div className="bg-white p-2 rounded-2xl shadow-sm border border-gray-100 overflow-x-auto">
          <div className="flex items-center gap-2 p-1 min-w-max">
            <div className="flex items-center gap-2 px-3 py-2 text-indigo-600 border-l border-gray-100 ml-2">
              <Sparkles size={18} />
              <span className="text-sm font-bold">الأنماط:</span>
            </div>
            {styles.map((style) => (
              <button
                key={style}
                onClick={() => onApplyStyle(style)}
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all border border-transparent hover:border-indigo-100 whitespace-nowrap"
              >
                {style}
              </button>
            ))}
          </div>
        </div>

        {/* Text Area */}
        <div className="flex-1 relative bg-white rounded-3xl shadow-sm border border-gray-100 flex flex-col overflow-hidden">
          <textarea
            className="flex-1 w-full p-8 text-lg leading-relaxed text-gray-700 resize-none focus:outline-none placeholder:text-gray-300 placeholder:italic"
            placeholder="اكتب أو الصق النص هنا ليبدأ السحر..."
            dir="rtl"
            value={project.text}
            onChange={handleTextChange}
          />
          
          <div className="p-4 bg-gray-50 border-t flex items-center justify-between text-sm text-gray-500 font-medium">
            <div className="flex gap-4">
              <span>{wordCount} كلمة</span>
              <span>{project.text.length} حرف</span>
            </div>
            <div className="text-indigo-600">
              دعم كامل للتشكيل والأرقام العربية
            </div>
          </div>
        </div>

        {/* Controls Bar */}
        <div className="bg-white p-6 rounded-3xl shadow-lg shadow-indigo-50 border border-indigo-50 flex flex-col md:flex-row items-center gap-6">
          <div className="flex-1 w-full">
            {audioUrl ? (
              <div className="flex items-center gap-4 animate-in fade-in slide-in-from-bottom-2">
                <audio ref={audioRef} src={audioUrl} controls className="flex-1 h-10 custom-audio" />
                <button 
                  onClick={() => handleDownload('wav')}
                  className="flex items-center gap-2 px-6 py-3 bg-emerald-500 text-white rounded-2xl font-bold hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-100"
                >
                  <Download size={20} />
                  <span>تحميل</span>
                </button>
              </div>
            ) : (
              <div className="text-gray-400 text-center md:text-right font-medium">
                {isGenerating ? 'جاري تحويل النص إلى نغمات ساحرة...' : 'اضغط على زر التوليد لسماع النتيجة'}
              </div>
            )}
          </div>
          
          <button 
            onClick={handleGenerate}
            disabled={isGenerating || !project.text.trim()}
            className={`
              w-full md:w-auto flex items-center justify-center gap-3 px-10 py-4 bg-indigo-600 text-white rounded-2xl font-bold text-lg
              hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed
            `}
          >
            {isGenerating ? (
              <Loader2 className="animate-spin" size={24} />
            ) : (
              <Play fill="currentColor" size={24} />
            )}
            <span>توليد الصوت</span>
          </button>
        </div>
      </div>

      {/* Right Column: Settings & Voice Selection */}
      <div className="lg:col-span-4 flex flex-col gap-6">
        {/* Voice Selection Panel */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-lg flex items-center gap-2">
              <Volume2 className="text-indigo-600" size={22} />
              اختيار الصوت
            </h3>
            <span className="text-xs bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full font-bold">عربي</span>
          </div>

          <div className="space-y-3">
            {VOICES.map((voice) => (
              <button
                key={voice.id}
                onClick={() => onProjectChange({ ...project, voiceId: voice.id })}
                className={`
                  w-full flex items-center gap-4 p-4 rounded-2xl transition-all border
                  ${project.voiceId === voice.id 
                    ? 'bg-indigo-50 border-indigo-200 shadow-sm' 
                    : 'border-gray-50 hover:bg-gray-50 hover:border-gray-200'}
                `}
              >
                <div className={`
                  w-12 h-12 rounded-xl flex items-center justify-center text-xl shadow-sm
                  ${voice.gender === 'male' ? 'bg-blue-100 text-blue-600' : 'bg-pink-100 text-pink-600'}
                `}>
                  {voice.gender === 'male' ? '👨' : '👩'}
                </div>
                <div className="flex-1 text-right">
                  <div className="flex items-center justify-between">
                    <p className="font-bold text-gray-900">{voice.name}</p>
                    {project.voiceId === voice.id && <Check size={16} className="text-indigo-600" />}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{voice.description}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Emotion & Tone Panel */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-6">
            <Settings2 className="text-indigo-600" size={22} />
            <h3 className="font-bold text-lg">التحكم في المشاعر والنبرة</h3>
          </div>

          <div className="space-y-8">
            {/* Emotion Selector */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-4">المشاعر (نبرة الصوت)</label>
              <div className="grid grid-cols-2 gap-2">
                {Object.values(Emotion).map((emo) => (
                  <button
                    key={emo}
                    onClick={() => handleSettingChange('emotion', emo)}
                    className={`
                      px-3 py-2 text-sm rounded-xl font-medium transition-all border
                      ${project.settings.emotion === emo 
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-100' 
                        : 'bg-white text-gray-600 border-gray-100 hover:border-indigo-200'}
                    `}
                  >
                    {emo}
                  </button>
                ))}
              </div>
            </div>

            {/* Slider Controls */}
            {[
              { label: 'مستوى المشاعر', key: 'emotionLevel', icon: Sparkles, min: 0, max: 100, step: 1 },
              { label: 'سرعة الإلقاء', key: 'speed', icon: Play, min: 0.5, max: 2, step: 0.05 },
              { label: 'نبرة الصوت (Pitch)', key: 'pitch', icon: Music, min: 0.5, max: 1.5, step: 0.1 },
              { label: 'قوة التعبير', key: 'intensity', icon: Volume2, min: 0, max: 100, step: 1 },
            ].map((control) => (
              <div key={control.key}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2 text-sm font-bold text-gray-700">
                    <control.icon size={16} className="text-indigo-400" />
                    <span>{control.label}</span>
                  </div>
                  <span className="text-xs font-bold bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                    {control.key === 'speed' || control.key === 'pitch' ? `x${project.settings[control.key as keyof VoiceSettings]}` : `${project.settings[control.key as keyof VoiceSettings]}%`}
                  </span>
                </div>
                <input
                  type="range"
                  min={control.min}
                  max={control.max}
                  step={control.step}
                  value={project.settings[control.key as keyof VoiceSettings] as number}
                  onChange={(e) => handleSettingChange(control.key as keyof VoiceSettings, parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
              </div>
            ))}
          </div>

          <button 
            onClick={() => handleSettingChange('emotionLevel', 50)}
            className="w-full mt-8 flex items-center justify-center gap-2 py-3 text-sm font-medium text-gray-400 hover:text-indigo-600 transition-colors"
          >
            <RotateCcw size={14} />
            <span>إعادة ضبط الإعدادات</span>
          </button>
        </div>
      </div>
    </div>
  );
};
