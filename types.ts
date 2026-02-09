
export enum Emotion {
  Neutral = 'محايد',
  Enthusiastic = 'حماسي',
  Calm = 'هادئ',
  Formal = 'رسمي',
  Friendly = 'ودود',
  Sad = 'حزين',
  Confident = 'واثق'
}

export enum ContentStyle {
  Custom = 'مخصص',
  Advertising = 'إعلاني',
  Educational = 'تعليمي',
  Documentary = 'وثائقي',
  Podcast = 'بودكاست',
  News = 'أخبار',
  SocialMedia = 'سوشيال ميديا'
}

export interface Voice {
  id: string;
  name: string;
  gender: 'male' | 'female';
  description: string;
  previewText: string;
  geminiVoiceName: string;
  tags: string[];
}

export interface VoiceSettings {
  emotion: Emotion;
  emotionLevel: number;
  pitch: number;
  speed: number;
  intensity: number;
}

export interface Project {
  id: string;
  title: string;
  text: string;
  voiceId: string;
  settings: VoiceSettings;
  createdAt: number;
  audioUrl?: string;
}
