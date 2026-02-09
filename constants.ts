
import { Voice, Emotion, ContentStyle, VoiceSettings } from './types';

export const VOICES: Voice[] = [
  {
    id: 'v1',
    name: 'كريم',
    gender: 'male',
    description: 'حيوي، ودود، وشبابي',
    previewText: 'مرحباً بكم في منصة صوتك، حيث نحول كلماتكم إلى واقع مسموع.',
    geminiVoiceName: 'Puck', // تم التعديل: Puck هو صوت ذكوري
    tags: ['شبابي', 'حيوي']
  },
  {
    id: 'v2',
    name: 'ليلى',
    gender: 'female',
    description: 'هادئة، رصينة، وواضحة',
    previewText: 'أهلاً بك، أنا ليلى، سأكون سعيدة بمساعدتك في تسجيل محتواك القادم.',
    geminiVoiceName: 'Kore', // تم التعديل: Kore هو صوت أنثوي
    tags: ['هادئ', 'رسمي']
  },
  {
    id: 'v3',
    name: 'سامي',
    gender: 'male',
    description: 'واثق، إخباري، وقوي',
    previewText: 'إليكم آخر الأخبار والتطورات العالمية في موجزنا اليومي.',
    geminiVoiceName: 'Charon',
    tags: ['إخباري', 'واثق']
  },
  {
    id: 'v4',
    name: 'نور',
    gender: 'female',
    description: 'شبابية، مشرقة، وناعمة',
    previewText: 'يلا نبدأ مشروعنا الجديد اليوم بأفضل جودة صوت ممكنة!',
    geminiVoiceName: 'Zephyr',
    tags: ['شبابي', 'حماسي']
  },
  {
    id: 'v5',
    name: 'فارس',
    gender: 'male',
    description: 'قوي، حماسي، ومؤثر',
    previewText: 'لا تتنازل عن حلمك، النجاح يبدأ بخطوة واحدة واثقة.',
    geminiVoiceName: 'Fenrir',
    tags: ['حماسي', 'إعلاني']
  }
];

export const STYLE_PRESETS: Record<ContentStyle, Partial<VoiceSettings> & { voiceId?: string }> = {
  [ContentStyle.Custom]: {},
  [ContentStyle.Advertising]: {
    emotion: Emotion.Enthusiastic,
    emotionLevel: 90,
    speed: 1.1,
    intensity: 85,
    voiceId: 'v5'
  },
  [ContentStyle.Educational]: {
    emotion: Emotion.Calm,
    emotionLevel: 50,
    speed: 0.95,
    intensity: 40,
    voiceId: 'v2'
  },
  [ContentStyle.Documentary]: {
    emotion: Emotion.Formal,
    emotionLevel: 70,
    speed: 0.85,
    intensity: 60,
    voiceId: 'v3'
  },
  [ContentStyle.Podcast]: {
    emotion: Emotion.Friendly,
    emotionLevel: 60,
    speed: 1.0,
    intensity: 50,
    voiceId: 'v4'
  },
  [ContentStyle.News]: {
    emotion: Emotion.Formal,
    emotionLevel: 80,
    speed: 1.0,
    intensity: 70,
    voiceId: 'v3'
  },
  [ContentStyle.SocialMedia]: {
    emotion: Emotion.Enthusiastic,
    emotionLevel: 75,
    speed: 1.05,
    intensity: 80,
    voiceId: 'v1'
  }
};
