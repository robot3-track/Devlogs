'use client';

import React, { useState, useEffect } from 'react';
import {
  FileText,
  Code2,
  Copy,
  Check,
  RotateCcw,
  Plus,
  Trash2,
  ExternalLink,
  Github,
  Globe,
  Info,
  Terminal
} from 'lucide-react';

interface ProjectData {
  title: string;
  tagline: string;
  problem: string;
  learnings: string[];
  challenges: string;
  techStack: string[];
  demoUrl: string;
  githubUrl: string;
  installCommand: string;
  authorName: string;
}

const STORAGE_KEY = 'devlogs_hackathon_project_data';

const DEFAULT_STATE: ProjectData = {
  title: '',
  tagline: '',
  problem: '',
  learnings: [''],
  challenges: '',
  techStack: [],
  demoUrl: '',
  githubUrl: '',
  installCommand: 'npm install && npm run dev',
  authorName: ''
};

const SAMPLE_DATA: ProjectData = {
  title: 'FocusPals',
  tagline: 'A lightweight virtual study room with shared focus timers for student study groups',
  problem: 'During remote hackathons and exam weeks, students struggle with accountability and focus fatigue when working alone in isolation.',
  learnings: [
    'Configured WebSockets for real-time room and timer syncing across browsers',
    'Designed an accessible keyboard-first timer interface with Tailwind CSS',
    'Structured state management so timer ticks do not trigger expensive layout re-renders'
  ],
  challenges: 'Synchronizing timer state across fluctuating internet connections. We resolved this by using server-authoritative timestamps instead of client interval counters.',
  techStack: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Node.js', 'WebSockets'],
  demoUrl: 'https://focuspals.vercel.app',
  githubUrl: 'https://github.com/student-dev/focuspals',
  installCommand: 'npm install && npm run dev',
  authorName: 'Hackathon Project Team'
};

const SUGGESTED_TECH = [
  'React',
  'Next.js',
  'TypeScript',
  'JavaScript',
  'Tailwind CSS',
  'HTML/CSS',
  'Node.js',
  'Python',
  'FastAPI',
  'PostgreSQL',
  'SQLite',
  'MongoDB',
  'Firebase',
  'Supabase'
];

const emptySubscribe = () => () => {};

export default function DevLogsApp() {
  // Sync client check
  React.useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  const [formData, setFormData] = useState<ProjectData>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          return {
            ...DEFAULT_STATE,
            ...parsed,
            learnings: Array.isArray(parsed.learnings) && parsed.learnings.length > 0 ? parsed.learnings : ['']
          };
        }
      } catch {
        // Fallback
      }
    }
    return DEFAULT_STATE;
  });

  const [activeTab, setActiveTab] = useState<'readme' | 'devpost'>('readme');
  const [previewMode, setPreviewMode] = useState<'rendered' | 'raw'>('rendered');
  const [copied, setCopied] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [customTech, setCustomTech] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
      } catch {
        // Fallback
      }
    }
  }, [formData]);

  const updateField = (field: keyof ProjectData, value: string | string[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleUpdateLearning = (index: number, text: string) => {
    const updated = [...formData.learnings];
    updated[index] = text;
    updateField('learnings', updated);
  };

  const handleAddLearningRow = () => {
    updateField('learnings', [...formData.learnings, '']);
  };

  const handleRemoveLearning = (index: number) => {
    const updated = formData.learnings.filter((_, i) => i !== index);
    updateField('learnings', updated.length > 0 ? updated : ['']);
  };

  const handleAddTechTag = (tag: string) => {
    const trimmed = tag.trim();
    if (trimmed && !formData.techStack.includes(trimmed)) {
      updateField('techStack', [...formData.techStack, trimmed]);
    }
    setCustomTech('');
  };

  const handleRemoveTechTag = (tagToRemove: string) => {
    updateField('techStack', formData.techStack.filter((t) => t !== tagToRemove));
  };

  const handleLoadSample = () => {
    setFormData(SAMPLE_DATA);
    setCustomTech('');
  };

  const handleReset = () => {
    setFormData(DEFAULT_STATE);
    setCustomTech('');
    setShowResetConfirm(false);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
  };

  const generateReadmeMarkdown = () => {
    const projectTitle = formData.title.trim() || 'Project Name';
    const tagline = formData.tagline.trim() || 'A short description of what this project does.';
    const validLearnings = formData.learnings.filter((l) => l.trim().length > 0);

    let md = `# ${projectTitle}\n\n`;
    md += `> ${tagline}\n\n`;

    if (formData.demoUrl || formData.githubUrl) {
      md += `### 🔗 Links\n`;
      if (formData.demoUrl) md += `- [🚀 Live Demo](${formData.demoUrl})\n`;
      if (formData.githubUrl) md += `- [💻 Source Code](${formData.githubUrl})\n`;
      md += `\n`;
    }

    if (formData.problem.trim()) {
      md += `## 📌 Overview & Problem Statement\n\n`;
      md += `${formData.problem.trim()}\n\n`;
    }

    if (formData.techStack.length > 0) {
      md += `## 🛠️ Built With\n\n`;
      formData.techStack.forEach((tech) => {
        md += `- **${tech}**\n`;
      });
      md += `\n`;
    }

    if (validLearnings.length > 0) {
      md += `## 💡 Key Learnings\n\n`;
      validLearnings.forEach((item) => {
        md += `- ${item}\n`;
      });
      md += `\n`;
    }

    if (formData.challenges.trim()) {
      md += `## 🧗 Challenges & Solutions\n\n`;
      md += `${formData.challenges.trim()}\n\n`;
    }

    md += `## 🚀 Getting Started\n\n`;
    md += `### 1. Clone the repository\n\`\`\`bash\ngit clone ${formData.githubUrl || 'https://github.com/your-username/your-project.git'}\ncd ${projectTitle.toLowerCase().replace(/[^a-z0-9]/g, '-') || 'project-name'}\n\`\`\`\n\n`;
    md += `### 2. Install & Run\n\`\`\`bash\n${formData.installCommand || 'npm install && npm run dev'}\n\`\`\`\n\n`;

    if (formData.authorName.trim()) {
      md += `## 👥 Author / Team\n\n`;
      md += `Created by **${formData.authorName.trim()}**.\n`;
    } else {
      md += `## 👥 Team\n\n`;
      md += `Built for the Hackathon.\n`;
    }

    return md;
  };

  const generateDevpostText = () => {
    const projectTitle = formData.title.trim() || 'Project Name';
    const validLearnings = formData.learnings.filter((l) => l.trim().length > 0);

    let text = `### Inspiration\n`;
    text += formData.problem.trim() 
      ? `${formData.problem.trim()}\n\n`
      : `We were inspired to build ${projectTitle} to help solve real student developer challenges.\n\n`;

    text += `### What it does\n`;
    text += formData.tagline.trim() 
      ? `${formData.tagline.trim()}\n\n`
      : `${projectTitle} provides an intuitive and accessible experience for users.\n\n`;

    text += `### How we built it\n`;
    if (formData.techStack.length > 0) {
      text += `We built this project using:\n`;
      text += formData.techStack.map((tech) => `- ${tech}`).join('\n');
      text += `\n\n`;
    } else {
      text += `Built with modern web tools and clean design practices.\n\n`;
    }

    text += `### Challenges we ran into\n`;
    text += formData.challenges.trim() 
      ? `${formData.challenges.trim()}\n\n`
      : `Managing scope and delivering a polished interface before the hackathon submission deadline.\n\n`;

    text += `### Accomplishments that we're proud of\n`;
    text += `Shipping a complete working application and collaborating effectively as a team.\n\n`;

    text += `### What we learned\n`;
    if (validLearnings.length > 0) {
      text += validLearnings.map((item) => `- ${item}`).join('\n');
      text += `\n\n`;
    } else {
      text += `- Improved problem-solving skills under time constraints\n`;
      text += `- Best practices for clean documentation and git workflows\n\n`;
    }

    text += `### What's next for ${projectTitle}\n\n`;
    text += `Gathering feedback from users, polishing the user interface, and adding new requested features.\n\n`;

    if (formData.techStack.length > 0) {
      text += `### Built With\n${formData.techStack.join(', ')}\n\n`;
    }

    if (formData.demoUrl || formData.githubUrl) {
      text += `### Try it out\n`;
      if (formData.demoUrl) text += `• Live Demo: ${formData.demoUrl}\n`;
      if (formData.githubUrl) text += `• GitHub: ${formData.githubUrl}\n`;
    }

    return text;
  };

  const currentContent = activeTab === 'readme' ? generateReadmeMarkdown() : generateDevpostText();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(currentContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textArea = document.createElement('textarea');
      textArea.value = currentContent;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const stepsCompleted = [
    Boolean(formData.title.trim()),
    Boolean(formData.tagline.trim()),
    Boolean(formData.problem.trim()),
    Boolean(formData.techStack.length > 0),
    Boolean(formData.learnings.some((l) => l.trim().length > 0)),
    Boolean(formData.challenges.trim()),
    Boolean(formData.githubUrl.trim() || formData.demoUrl.trim())
  ].filter(Boolean).length;

  const totalSteps = 7;
  const progressPercent = Math.round((stepsCompleted / totalSteps) * 100);

  return (
    <div id="devlogs-root" className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Clean Top Navigation Bar */}
      <header id="main-header" className="sticky top-0 z-30 bg-white border-b border-slate-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-slate-900 flex items-center justify-center text-white font-bold text-base shadow-xs">
              DL
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900 tracking-tight">DevLogs</h1>
              <p className="text-xs text-slate-500 hidden sm:block">
                Project journaling & documentation builder for student developers
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2">
            <button
              id="btn-load-sample"
              type="button"
              onClick={handleLoadSample}
              className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-md transition-colors"
            >
              Load Example
            </button>

            {showResetConfirm ? (
              <div className="flex items-center gap-1.5 bg-slate-100 border border-slate-300 rounded-md p-1">
                <span className="text-xs text-slate-700 px-1.5">Clear all?</span>
                <button
                  id="btn-confirm-reset"
                  type="button"
                  onClick={handleReset}
                  className="px-2 py-0.5 text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white rounded transition-colors"
                >
                  Yes, Clear
                </button>
                <button
                  id="btn-cancel-reset"
                  type="button"
                  onClick={() => setShowResetConfirm(false)}
                  className="px-2 py-0.5 text-xs font-medium text-slate-700 hover:bg-slate-200 rounded transition-colors"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                id="btn-trigger-reset"
                type="button"
                onClick={() => setShowResetConfirm(true)}
                className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 rounded-md transition-colors"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main id="main-content" className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col gap-6">
        
        {/* Beginner Helper Banner */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
          <div className="flex items-start gap-3">
            <div className="h-8 w-8 rounded-full bg-slate-100 border border-slate-300 flex items-center justify-center text-slate-700 shrink-0 mt-0.5">
              <Info className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-slate-900">How to use DevLogs</h2>
              <p className="text-xs text-slate-600 mt-0.5">
                Fill in your project details on the left. The formatted preview updates live on the right. When ready, click &ldquo;Copy Markdown&rdquo; to paste directly into GitHub or Devpost!
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:items-end gap-1.5 shrink-0">
            <div className="flex items-center gap-2 text-xs font-medium text-slate-700">
              <span>Progress:</span>
              <span className="font-bold text-slate-900">{stepsCompleted} of {totalSteps} sections completed</span>
            </div>
            <div className="w-full sm:w-40 h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
              <div
                className="h-full bg-slate-800 transition-all duration-300 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Two-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          
          {/* Left Column: Form Fields */}
          <div id="form-column" className="lg:col-span-6 flex flex-col gap-5">
            
            {/* Step 1: Project Basics */}
            <section className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-xs flex flex-col gap-4">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <div className="h-6 w-6 rounded-md bg-slate-900 text-white flex items-center justify-center text-xs font-bold">1</div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Project Basics</h3>
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="input-title" className="text-xs font-semibold text-slate-800">
                  Project Title <span className="text-rose-600">*</span>
                </label>
                <p className="text-[11px] text-slate-500">Give your hackathon project a clear, descriptive name.</p>
                <input
                  id="input-title"
                  type="text"
                  value={formData.title}
                  onChange={(e) => updateField('title', e.target.value)}
                  placeholder="e.g. FocusPals, StudyBuddy, EcoTracker"
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400 transition-all"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="input-tagline" className="text-xs font-semibold text-slate-800">
                  Short Tagline
                </label>
                <p className="text-[11px] text-slate-500">A one-sentence summary of what your project does.</p>
                <input
                  id="input-tagline"
                  type="text"
                  value={formData.tagline}
                  onChange={(e) => updateField('tagline', e.target.value)}
                  placeholder="e.g. A shared virtual study room with synchronised focus timers"
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400 transition-all"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="input-problem" className="text-xs font-semibold text-slate-800">
                  Problem Solved & Motivation
                </label>
                <p className="text-[11px] text-slate-500">Who is this for, and what challenge did you set out to solve?</p>
                <textarea
                  id="input-problem"
                  rows={3}
                  value={formData.problem}
                  onChange={(e) => updateField('problem', e.target.value)}
                  placeholder="e.g. During remote hackathons and finals weeks, students often struggle to stay accountable and avoid burnout..."
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400 transition-all resize-y"
                />
              </div>
            </section>

            {/* Step 2: Technologies */}
            <section className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-xs flex flex-col gap-4">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <div className="h-6 w-6 rounded-md bg-slate-900 text-white flex items-center justify-center text-xs font-bold">2</div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Technologies Used</h3>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-slate-800">
                  Click to select technologies, or enter your own:
                </label>

                {/* Suggested Chips */}
                <div className="flex flex-wrap gap-1.5">
                  {SUGGESTED_TECH.map((tech) => {
                    const isSelected = formData.techStack.includes(tech);
                    return (
                      <button
                        key={tech}
                        type="button"
                        onClick={() => (isSelected ? handleRemoveTechTag(tech) : handleAddTechTag(tech))}
                        className={`text-xs px-2.5 py-1 rounded-md font-medium border transition-colors ${
                          isSelected
                            ? 'bg-slate-900 border-slate-900 text-white'
                            : 'bg-slate-50 border-slate-300 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        {isSelected ? `✓ ${tech}` : `+ ${tech}`}
                      </button>
                    );
                  })}
                </div>

                {/* Custom Tech Field */}
                <div className="flex gap-2 mt-1">
                  <input
                    id="input-custom-tech"
                    type="text"
                    value={customTech}
                    onChange={(e) => setCustomTech(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddTechTag(customTech);
                      }
                    }}
                    placeholder="Add custom library or tool (e.g. OpenCV, D3.js)..."
                    className="flex-1 px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400"
                  />
                  <button
                    id="btn-add-custom-tech"
                    type="button"
                    onClick={() => handleAddTechTag(customTech)}
                    className="px-3.5 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-medium transition-colors flex items-center gap-1"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Add</span>
                  </button>
                </div>

                {/* Selected Technologies List */}
                {formData.techStack.length > 0 && (
                  <div className="mt-2 p-2.5 bg-slate-50 border border-slate-200 rounded-lg flex flex-wrap gap-1.5">
                    <span className="text-[11px] text-slate-500 self-center mr-1">Selected:</span>
                    {formData.techStack.map((tech) => (
                      <span
                        key={tech}
                        className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-white border border-slate-300 text-slate-800 rounded text-xs font-medium shadow-2xs"
                      >
                        {tech}
                        <button
                          type="button"
                          onClick={() => handleRemoveTechTag(tech)}
                          className="text-slate-400 hover:text-slate-800 font-bold ml-0.5"
                          title={`Remove ${tech}`}
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </section>

            {/* Step 3: Learnings & Challenges */}
            <section className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-xs flex flex-col gap-4">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <div className="h-6 w-6 rounded-md bg-slate-900 text-white flex items-center justify-center text-xs font-bold">3</div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Learnings & Challenges</h3>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-slate-800">
                  What I Learned (Bullet Points)
                </label>
                <p className="text-[11px] text-slate-500">List skills, tools, or concepts you explored during this project.</p>

                <div className="flex flex-col gap-2">
                  {formData.learnings.map((learning, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-400 w-4 text-center">{idx + 1}.</span>
                      <input
                        type="text"
                        value={learning}
                        onChange={(e) => handleUpdateLearning(idx, e.target.value)}
                        placeholder={`Learning point #${idx + 1}...`}
                        className="flex-1 px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400"
                      />
                      {formData.learnings.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveLearning(idx)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors"
                          title="Remove item"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  ))}

                  <button
                    id="btn-add-learning"
                    type="button"
                    onClick={handleAddLearningRow}
                    className="self-start text-xs font-semibold text-slate-700 hover:text-slate-900 flex items-center gap-1.5 py-1 px-2.5 rounded-md hover:bg-slate-100 border border-dashed border-slate-300 transition-colors"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Add another learning point</span>
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-1.5 mt-2">
                <label htmlFor="input-challenges" className="text-xs font-semibold text-slate-800">
                  Technical Challenges & Solutions
                </label>
                <p className="text-[11px] text-slate-500">Describe a bug, roadblock, or architectural challenge you overcame.</p>
                <textarea
                  id="input-challenges"
                  rows={3}
                  value={formData.challenges}
                  onChange={(e) => updateField('challenges', e.target.value)}
                  placeholder="e.g. We encountered CORS errors when connecting the frontend to our API, and resolved it by configuring proper origin headers..."
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400 transition-all resize-y"
                />
              </div>
            </section>

            {/* Step 4: Links & Setup */}
            <section className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-xs flex flex-col gap-4">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <div className="h-6 w-6 rounded-md bg-slate-900 text-white flex items-center justify-center text-xs font-bold">4</div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Links & Setup Command</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="input-github" className="text-xs font-semibold text-slate-800 flex items-center gap-1">
                    <Github className="h-3.5 w-3.5 text-slate-600" />
                    <span>GitHub Repository</span>
                  </label>
                  <input
                    id="input-github"
                    type="url"
                    value={formData.githubUrl}
                    onChange={(e) => updateField('githubUrl', e.target.value)}
                    placeholder="https://github.com/username/repo"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="input-demo" className="text-xs font-semibold text-slate-800 flex items-center gap-1">
                    <Globe className="h-3.5 w-3.5 text-slate-600" />
                    <span>Live Demo Link</span>
                  </label>
                  <input
                    id="input-demo"
                    type="url"
                    value={formData.demoUrl}
                    onChange={(e) => updateField('demoUrl', e.target.value)}
                    placeholder="https://myproject.vercel.app"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="input-install" className="text-xs font-semibold text-slate-800">
                    Run / Install Command
                  </label>
                  <input
                    id="input-install"
                    type="text"
                    value={formData.installCommand}
                    onChange={(e) => updateField('installCommand', e.target.value)}
                    placeholder="npm install && npm run dev"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-mono text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="input-author" className="text-xs font-semibold text-slate-800">
                    Author / Team Name
                  </label>
                  <input
                    id="input-author"
                    type="text"
                    value={formData.authorName}
                    onChange={(e) => updateField('authorName', e.target.value)}
                    placeholder="e.g. Alex & Jordan"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400"
                  />
                </div>
              </div>
            </section>

          </div>

          {/* Right Column: Real-time Output & Export */}
          <div id="preview-column" className="lg:col-span-6 sticky top-20 flex flex-col gap-4">
            
            <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden flex flex-col">
              
              {/* Tab Selector & Controls */}
              <div className="p-3 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
                
                {/* Destination Tabs */}
                <div className="flex items-center bg-slate-200/80 p-1 rounded-lg">
                  <button
                    id="tab-readme"
                    type="button"
                    onClick={() => setActiveTab('readme')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                      activeTab === 'readme'
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <FileText className="h-3.5 w-3.5" />
                    <span>GitHub README</span>
                  </button>

                  <button
                    id="tab-devpost"
                    type="button"
                    onClick={() => setActiveTab('devpost')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                      activeTab === 'devpost'
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Code2 className="h-3.5 w-3.5" />
                    <span>Devpost Story</span>
                  </button>
                </div>

                {/* View Mode & Copy Button */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center bg-slate-200/80 p-0.5 rounded-lg">
                    <button
                      id="btn-rendered-view"
                      type="button"
                      onClick={() => setPreviewMode('rendered')}
                      className={`px-2.5 py-1 rounded text-xs font-medium transition-all ${
                        previewMode === 'rendered' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                      }`}
                    >
                      Preview
                    </button>
                    <button
                      id="btn-raw-view"
                      type="button"
                      onClick={() => setPreviewMode('raw')}
                      className={`px-2.5 py-1 rounded text-xs font-medium transition-all ${
                        previewMode === 'raw' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                      }`}
                    >
                      Raw
                    </button>
                  </div>

                  <button
                    id="btn-copy-code"
                    type="button"
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white rounded-lg transition-all shadow-xs active:scale-95"
                  >
                    {copied ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-emerald-400" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" />
                        <span>{activeTab === 'readme' ? 'Copy Markdown' : 'Copy Text'}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Preview Display */}
              <div className="p-5 sm:p-6 max-h-[70vh] overflow-y-auto bg-white">
                {previewMode === 'raw' ? (
                  <pre className="p-4 bg-slate-900 text-slate-100 rounded-lg text-xs font-mono whitespace-pre-wrap leading-relaxed overflow-x-auto selection:bg-slate-700">
                    {currentContent}
                  </pre>
                ) : activeTab === 'readme' ? (
                  /* Formatted README */
                  <div className="space-y-6 text-slate-800">
                    <div className="border-b border-slate-200 pb-4">
                      <h2 className="text-2xl font-bold text-slate-950 tracking-tight">
                        {formData.title.trim() || 'Your Project Name'}
                      </h2>
                      <p className="text-sm text-slate-600 italic mt-1">
                        {formData.tagline.trim() || 'A short description of what this project accomplishes.'}
                      </p>

                      {(formData.demoUrl || formData.githubUrl) && (
                        <div className="flex flex-wrap gap-2 mt-3">
                          {formData.demoUrl && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-100 border border-slate-300 text-xs font-medium text-slate-800">
                              <Globe className="h-3 w-3" />
                              <span>Live Demo</span>
                            </span>
                          )}
                          {formData.githubUrl && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-100 border border-slate-300 text-xs font-medium text-slate-800">
                              <Github className="h-3 w-3" />
                              <span>Source Code</span>
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    <div>
                      <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide border-b border-slate-100 pb-1 mb-2">
                        Overview & Problem Statement
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-700 whitespace-pre-line leading-relaxed">
                        {formData.problem.trim() || 'Describe the motivation and problem your app solves.'}
                      </p>
                    </div>

                    <div>
                      <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide border-b border-slate-100 pb-1 mb-2">
                        Built With
                      </h3>
                      {formData.techStack.length > 0 ? (
                        <div className="flex flex-wrap gap-1.5">
                          {formData.techStack.map((tech) => (
                            <span key={tech} className="px-2 py-0.5 bg-slate-100 border border-slate-200 rounded text-xs font-mono font-medium text-slate-800">
                              {tech}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-slate-400 italic">Select technologies in step 2 to display them here.</p>
                      )}
                    </div>

                    <div>
                      <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide border-b border-slate-100 pb-1 mb-2">
                        Key Learnings
                      </h3>
                      <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm text-slate-700">
                        {formData.learnings.filter((l) => l.trim().length > 0).length > 0 ? (
                          formData.learnings
                            .filter((l) => l.trim().length > 0)
                            .map((l, i) => <li key={i}>{l}</li>)
                        ) : (
                          <li className="text-slate-400 italic">Add learning points in step 3.</li>
                        )}
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide border-b border-slate-100 pb-1 mb-2">
                        Challenges & Solutions
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-700 whitespace-pre-line leading-relaxed">
                        {formData.challenges.trim() || 'Describe hurdles and solutions.'}
                      </p>
                    </div>

                    <div>
                      <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide border-b border-slate-100 pb-1 mb-2">
                        Getting Started
                      </h3>
                      <div className="bg-slate-900 text-slate-100 p-3 rounded-lg font-mono text-xs space-y-1">
                        <p className="text-slate-400"># 1. Clone repository</p>
                        <p>git clone {formData.githubUrl || 'https://github.com/username/project.git'}</p>
                        <p className="text-slate-400 mt-2"># 2. Install & run</p>
                        <p>{formData.installCommand || 'npm install && npm run dev'}</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Formatted Devpost Story */
                  <div className="space-y-5 text-slate-800">
                    <div className="border-b border-slate-200 pb-3">
                      <span className="text-xs font-bold text-slate-500 uppercase">Devpost Project Story</span>
                      <h2 className="text-xl font-bold text-slate-900 mt-0.5">{formData.title || 'Project Name'}</h2>
                    </div>

                    <div>
                      <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide mb-1">Inspiration</h4>
                      <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs leading-relaxed text-slate-700">
                        {formData.problem.trim() || 'Why you built this project and what problem inspired you.'}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide mb-1">What it does</h4>
                      <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs leading-relaxed text-slate-700">
                        {formData.tagline.trim() || 'Summary of what your application does.'}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide mb-1">How we built it</h4>
                      <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs leading-relaxed text-slate-700">
                        {formData.techStack.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {formData.techStack.map((tech) => (
                              <span key={tech} className="px-2 py-0.5 bg-white border border-slate-300 rounded text-[11px] font-medium text-slate-800">
                                {tech}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-slate-400 italic">Select your tech stack in step 2.</span>
                        )}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide mb-1">Challenges we ran into</h4>
                      <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs leading-relaxed text-slate-700">
                        {formData.challenges.trim() || 'Describe hurdles and debugging solutions during the hackathon.'}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide mb-1">What we learned</h4>
                      <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs leading-relaxed text-slate-700">
                        <ul className="list-disc pl-4 space-y-1">
                          {formData.learnings.filter((l) => l.trim().length > 0).length > 0 ? (
                            formData.learnings.filter((l) => l.trim().length > 0).map((l, i) => <li key={i}>{l}</li>)
                          ) : (
                            <li className="text-slate-400 italic">Add learning points in step 3.</li>
                          )}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Status Bar */}
              <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
                <span>{activeTab === 'readme' ? 'Formatted for GitHub README.md' : 'Formatted for Devpost story fields'}</span>
                <span>{currentContent.length} characters</span>
              </div>

            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
