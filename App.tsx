
import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { Editor } from './components/Editor';
import { ProjectsList } from './components/ProjectsList';
import { Pricing } from './components/Pricing';
import { VoiceLibrary } from './components/VoiceLibrary';
import { Project, ContentStyle, Emotion, VoiceSettings } from './types';
import { STYLE_PRESETS, VOICES } from './constants';

type Page = 'editor' | 'projects' | 'pricing' | 'voices';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('editor');
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentProject, setCurrentProject] = useState<Project>({
    id: 'temp',
    title: 'مشروع جديد',
    text: '',
    voiceId: VOICES[0].id,
    settings: {
      emotion: Emotion.Neutral,
      emotionLevel: 50,
      pitch: 1.0,
      speed: 1.0,
      intensity: 50
    },
    createdAt: Date.now()
  });

  // Load projects from local storage
  useEffect(() => {
    const saved = localStorage.getItem('sawtak_projects');
    if (saved) {
      setProjects(JSON.parse(saved));
    }
  }, []);

  const saveProject = (project: Project) => {
    const newProjects = projects.find(p => p.id === project.id)
      ? projects.map(p => p.id === project.id ? project : p)
      : [...projects, { ...project, id: Math.random().toString(36).substr(2, 9) }];
    
    setProjects(newProjects);
    localStorage.setItem('sawtak_projects', JSON.stringify(newProjects));
  };

  const handleStyleChange = (style: ContentStyle) => {
    const preset = STYLE_PRESETS[style];
    setCurrentProject(prev => ({
      ...prev,
      voiceId: preset.voiceId || prev.voiceId,
      settings: {
        ...prev.settings,
        emotion: preset.emotion || prev.settings.emotion,
        emotionLevel: preset.emotionLevel || prev.settings.emotionLevel,
        speed: preset.speed || prev.settings.speed,
        intensity: preset.intensity || prev.settings.intensity,
      }
    }));
  };

  return (
    <Layout 
      currentPage={currentPage} 
      onNavigate={setCurrentPage}
      userName="خالد عبدالله"
    >
      {currentPage === 'editor' && (
        <Editor 
          project={currentProject} 
          onProjectChange={setCurrentProject}
          onSave={saveProject}
          onApplyStyle={handleStyleChange}
        />
      )}
      {currentPage === 'projects' && (
        <ProjectsList 
          projects={projects} 
          onSelect={(p) => {
            setCurrentProject(p);
            setCurrentPage('editor');
          }}
          onDelete={(id) => {
            const updated = projects.filter(p => p.id !== id);
            setProjects(updated);
            localStorage.setItem('sawtak_projects', JSON.stringify(updated));
          }}
        />
      )}
      {currentPage === 'voices' && (
        <VoiceLibrary 
          selectedVoiceId={currentProject.voiceId}
          onSelect={(voiceId) => {
            setCurrentProject(prev => ({ ...prev, voiceId }));
            setCurrentPage('editor');
          }}
        />
      )}
      {currentPage === 'pricing' && <Pricing />}
    </Layout>
  );
}
