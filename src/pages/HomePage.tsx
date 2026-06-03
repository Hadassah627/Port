import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { Hero } from '../components/home/Hero';
import { StatCard } from '../components/home/StatCard';
import { 
  FiArrowRight, 
  FiExternalLink, 
  FiMail, 
  FiMapPin, 
  FiPhone, 
  FiSend, 
  FiX, 
  FiChevronLeft, 
  FiChevronRight, 
  FiCopy, 
  FiCheck, 
  FiInfo, 
  FiAward,
  FiBookOpen,
  FiGlobe,
  FiLayers,
  FiCpu,
  FiCamera
} from 'react-icons/fi';
import { FaGraduationCap, FaProjectDiagram, FaUsers } from 'react-icons/fa';
import { useDocumentQuery } from '../hooks/useDocumentQuery';
import { useCollectionQuery } from '../hooks/useCollectionQuery';
import { submitMessage } from '../services/firestore';
import type { AchievementItem, GalleryItem, PublicationItem, Profile, ResearchItem, Settings, TeachingItem } from '../types/content';
import { Seo } from '../components/Seo';
import { PageShell } from '../components/common/PageShell';
import { SectionHeading } from '../components/common/SectionHeading';
import { LoadingState } from '../components/common/LoadingState';

const COUNTER_DURATION = 1500; // ms

// Animated counter hook for numbers
function useCountTo(target: number, start = 0) {
  const [value, setValue] = useState(start);
  useEffect(() => {
    let raf: number | null = null;
    const startTime = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - startTime) / COUNTER_DURATION);
      const easeOutQuad = t * (2 - t);
      setValue(Math.floor(start + (target - start) * easeOutQuad));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => { if (raf) cancelAnimationFrame(raf); };
  }, [target, start]);
  return value;
}

// Counter display component that parses numbers like "45+" or "1,200+"
export const AnimatedCounter: React.FC<{ value: string }> = ({ value }) => {
  const numericStr = value.replace(/[^0-9]/g, '');
  const numericVal = parseInt(numericStr, 10) || 0;
  const count = useCountTo(numericVal);
  const nonNumeric = value.replace(/[0-9]/g, '');
  return (
    <span>
      {count.toLocaleString()}
      {nonNumeric}
    </span>
  );
};

type ContactForm = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

export const HomePage: React.FC = () => {
  const NAME = 'Dr. Abduru Sankara Rao, Ph.D.';
  const DESIGNATION = 'Professor — Department of Computer Science and Engineering';
  const INSTITUTION = 'RGUKT';
  const BIO = "Dr. Abduru Sankara Rao is an interdisciplinary researcher working at the intersection of Artificial Intelligence, Remote Sensing, and Hyperspectral Imaging. He develops robust machine learning models for real-world environmental sensing, mentors graduate students, and collaborates on international research projects. His work focuses on scalable algorithms, data-driven imaging pipelines, and explainable AI for geospatial applications.";

  // Fetch from DB
  const { data: profile, isLoading: profileLoading } = useDocumentQuery<Profile>(['profile', 'main'], 'profile', 'main');
  const { data: settings } = useDocumentQuery<Settings>(['settings', 'main'], 'settings', 'main');
  const { data: achievements } = useCollectionQuery<(AchievementItem & { id: string })>(['achievements'], 'achievements');
  const { data: research } = useCollectionQuery<(ResearchItem & { id: string })>(['research'], 'research');
  const { data: publications } = useCollectionQuery<(PublicationItem & { id: string })>(['publications'], 'publications');
  const { data: teaching } = useCollectionQuery<(TeachingItem & { id: string })>(['teaching'], 'teaching');
  const { data: gallery } = useCollectionQuery<(GalleryItem & { id: string })>(['gallery'], 'gallery');

  // Contact form state
  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm<ContactForm>();

  // Interactive UI states
  const [activeBioTab, setActiveBioTab] = useState<'education' | 'experience'>('education');
  const [copiedPubId, setCopiedPubId] = useState<string | null>(null);
  const [activeBibtexId, setActiveBibtexId] = useState<string | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState<number | null>(null);

  // Themed unsplash image array
  const getProjectImage = (title: string, index: number) => {
    const images = [
      'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80', // Earth / Satellite space
      'https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&w=600&q=80', // Spectral laser analysis
      'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=600&q=80', // AI Robotics 
      'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=600&q=80', // Tech matrix code
    ];
    return images[index % images.length];
  };

  // Curated fallback values for development/Firestore timeout cases
  const sampleProfile: Profile = {
    id: 'main',
    name: NAME,
    photoUrl: '/sir.png',
    email: 'abduru@rgukt.edu.in',
    phone: '+91-98765-43210',
    biography: BIO,
    researchInterests: ['Artificial Intelligence', 'Remote Sensing', 'Hyperspectral Imaging', 'Machine Learning', 'Computer Vision'],
    education: [
      { degree: 'Ph.D. in Computer Science', university: 'Indian Institute of Technology (IIT)', year: '2015', description: 'Focus on advanced hyperspectral image processing and machine learning pipelines.' },
      { degree: 'M.Tech. in Computer Science', university: 'National Institute of Technology (NIT)', year: '2010', description: 'Thesis detailing satellite remote sensing classification architectures.' },
      { degree: 'B.Tech. in Computer Science', university: 'JNTU', year: '2007', description: 'Graduated with Distinction, developing database indexing algorithms.' },
    ],
    experience: [
      { position: 'Professor & Head of CSE', organization: 'RGUKT', years: '2021 – Present', description: 'Supervising lab research groups, guiding doctoral students, and overseeing computer engineering curriculum.' },
      { position: 'Associate Professor', organization: 'RGUKT', years: '2016 – 2021', description: 'Delivered coursework in deep learning and image processing. Developed geospatial frameworks.' },
      { position: 'Assistant Professor', organization: 'RGUKT', years: '2015 – 2016', description: 'Formed hyperspectral analysis lab. Published research papers in IEEE journals.' }
    ],
    socialLinks: [
      { label: 'LinkedIn', url: 'https://www.linkedin.com/' },
      { label: 'GitHub', url: 'https://github.com/' },
      { label: 'Google Scholar', url: 'https://scholar.google.com/' }
    ]
  } as unknown as Profile;

  const sampleResearch = [
    {
      id: 'r1',
      title: 'Scalable Hyperspectral Imaging Pipelines',
      slug: 'hyperspectral-imaging',
      category: 'Remote Sensing',
      description: 'Developing high-throughput scalable algorithms for dimensionality reduction and hyperspectral image classification in Earth observation.',
      objectives: 'Build scalable ML pipelines handling terabytes of spectral data',
      methodology: 'Deep learning autoencoders combined with parallel GPU clusters',
      results: 'Improved classification accuracy on NASA AVIRIS datasets by 14%',
      status: 'Active',
      imageUrls: [],
      fileUrls: [],
      featured: true,
    },
    {
      id: 'r2',
      title: 'Explainable AI for Geospatial Data Analysis',
      slug: 'explainable-ai-geospatial',
      category: 'AI / Deep Learning',
      description: 'Interpretable neural networks for crop classification and forest canopy change detection using attention mechanisms and shapley values.',
      objectives: 'Establish clear interpretability matrices for environmental stakeholders',
      methodology: 'Model distillation coupled with localized attention weight mapping',
      results: 'Introduced novel spatial-spectral feature heatmaps for climate monitors',
      status: 'Completed',
      imageUrls: [],
      fileUrls: [],
      featured: false,
    },
  ];

  const samplePubs = [
    {
      id: 'p1',
      title: 'Robust Hyperspectral Classification via Spatial-Spectral Attention Networks',
      slug: 'robust-hyperspectral-classification',
      authors: 'Dr. A. S. Rao, Dr. J. Smith, Prof. R. Patel',
      venue: 'IEEE Transactions on Geoscience and Remote Sensing',
      year: 2024,
      type: 'Journal',
      doi: '10.1109/TGRS.2024.1234567',
      pdfUrl: '',
      abstract: 'A study on robust classification methods for hyperspectral imagery under spatial distortions.',
      keywords: ['hyperspectral', 'classification'],
      citation: 'Rao et al., IEEE TGRS, 2024',
      bibtex: `@article{Rao2024Hyperspectral,\n  author={Rao, A. S. and Smith, J. and Patel, R.},\n  journal={IEEE Transactions on Geoscience and Remote Sensing},\n  title={Robust Hyperspectral Classification via Spatial-Spectral Attention Networks},\n  year={2024},\n  volume={62},\n  pages={1-14},\n  doi={10.1109/TGRS.2024.1234567}\n}`
    },
    {
      id: 'p2',
      title: 'Explainable Neural Classifiers for Satellite Crop Monitoring',
      slug: 'explainable-neural-classifiers',
      authors: 'Dr. A. S. Rao, M. Sharma',
      venue: 'International Conference on Machine Learning (ICML)',
      year: 2023,
      type: 'Conference',
      doi: '10.1234/icml.2023.889',
      pdfUrl: '',
      abstract: 'Introducing attention-based interpretability layers for remote sensing agriculture modeling.',
      keywords: ['explainable-ai', 'crop-monitoring'],
      citation: 'Rao & Sharma, ICML, 2023',
      bibtex: `@inproceedings{Rao23Crop,\n  author={Rao, A. S. and Sharma, M.},\n  booktitle={International Conference on Machine Learning (ICML)},\n  title={Explainable Neural Classifiers for Satellite Crop Monitoring},\n  year={2023},\n  pages={3120-3134}\n}`
    }
  ];

  const sampleSettings: Settings = {
    siteTitle: 'Faculty Portfolio',
    seoTitle: 'Dr. Abduru Sankara Rao',
    seoDescription: 'Faculty portfolio for Dr. Abduru Sankara Rao',
    ogImageUrl: '/sir.png',
    contactEmail: 'abduru@rgukt.edu.in',
    contactPhone: '+91-98765-43210',
    socialLinks: [],
    news: [
      { date: 'June 2026', title: 'Principal Investigator of DST Geospatial Project', description: 'Awarded research grant for deep learning in hyperspectral imaging.' },
      { date: 'March 2026', title: 'Keynote Speaker at ICASSP 2026 Workshop', description: 'Delivering keynote on explainable model layers for environmental sensing.' },
      { date: 'Dec 2025', title: 'Paper Accepted in IEEE TGRS Journal', description: 'Co-authored paper on spatial-spectral attention networks has been officially published.' }
    ],
  };

  const sampleTeaching = [
    { courseName: 'Advanced Machine Learning', courseCode: 'CS4102', semester: 'Fall', year: 2025, description: 'Graduate level class covering deep neural architectures, graph networks, and transformers.', credits: '4 Credits', level: 'Postgraduate' },
    { courseName: 'Digital Image Processing', courseCode: 'CS3201', semester: 'Spring', year: 2025, description: 'Undergraduate core course covering filtering, Fourier transforms, and restoration pipelines.', credits: '3 Credits', level: 'Undergraduate' },
    { courseName: 'Introduction to Artificial Intelligence', courseCode: 'CS2101', semester: 'Fall', year: 2024, description: 'Foundational course introducing search trees, logical reasoning, and classical ML.', credits: '3 Credits', level: 'Undergraduate' }
  ];

  const sampleAchievements = [
    { title: 'Best Research Paper Award', value: 'IEEE TGRS 2025', description: 'Awarded for outstanding contributions to spatial-spectral imaging pipelines.' },
    { title: 'Pedagogical Excellence Award', value: 'RGUKT 2024', description: 'Honored for student mentorship programs and digital lab syllabus design.' },
    { title: 'National Geospatial Grant PI', value: 'DST-SERB India', description: 'Acquired research grant funding for agricultural remote sensing.' }
  ];

  const sampleGallery = [
    { title: 'Keynote Address at Geoscience Summit', category: 'Conference', imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80', description: 'Presenting research developments on Earth spectral classification models.', year: 2025 },
    { title: 'Deep Learning Laboratory Workspace', category: 'Research Lab', imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80', description: 'Guiding PhD and research scholars in the geospatial lab.', year: 2025 },
    { title: 'Group Mentoring Seminar', category: 'Mentorship', imageUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80', description: 'Bi-weekly thesis review and paper draft editing session.', year: 2024 }
  ];

  // Effective state bindings
  const effectiveProfile = profile ?? (import.meta.env.DEV ? sampleProfile : null);
  const effectiveResearch = research ?? (import.meta.env.DEV ? sampleResearch : []);
  const displayResearch = React.useMemo(() => {
    const featured = effectiveResearch.filter((r) => r.featured === true);
    return featured.length > 0 ? featured : effectiveResearch;
  }, [effectiveResearch]);
  const effectivePublications = publications ?? (import.meta.env.DEV ? samplePubs : []);
  const effectiveSettings = settings ?? (import.meta.env.DEV ? sampleSettings : null);
  const effectiveEducation = effectiveProfile?.education?.length ? effectiveProfile.education : (import.meta.env.DEV ? sampleProfile.education : []);
  const effectiveExperience = effectiveProfile?.experience?.length ? effectiveProfile.experience : (import.meta.env.DEV ? sampleProfile.experience : []);
  const effectiveTeaching = teaching?.length ? teaching : (import.meta.env.DEV ? sampleTeaching : []);
  const effectiveAchievements = achievements?.length ? achievements : (import.meta.env.DEV ? sampleAchievements : []);
  const effectiveGallery = gallery?.length ? gallery : (import.meta.env.DEV ? sampleGallery : []);

  if (!import.meta.env.DEV && profileLoading) {
    return (
      <PageShell>
        <LoadingState message="Connecting to Firestore portfolio data..." />
      </PageShell>
    );
  }

  // Combined statistics values
  const stats = effectiveAchievements.length ? effectiveAchievements.slice(0, 6).map((a: any) => ({
    id: a.id || a.title,
    title: a.title,
    value: a.value || 'N/A',
    description: a.description
  })) : [
    { id: 'p1', title: 'Publications', value: '45+', description: 'Peer-reviewed papers' },
    { id: 'p2', title: 'Citations', value: '1200+', description: 'Google Scholar index' },
    { id: 'p3', title: 'Projects', value: '20+', description: 'Research grants' },
    { id: 'p4', title: 'PhD Students', value: '12+', description: 'Scholars supervised' },
    { id: 'p5', title: 'Grants', value: '5+', description: 'Primary Investigator' },
    { id: 'p6', title: 'Collaborations', value: '15+', description: 'International partners' }
  ];

  const effectiveResearchInterests = effectiveProfile?.researchInterests && effectiveProfile.researchInterests.length > 0
    ? effectiveProfile.researchInterests
    : ['Artificial Intelligence', 'Remote Sensing', 'Hyperspectral Imaging', 'Machine Learning', 'Computer Vision', 'Deep Learning'];

  // Research interest detailed descriptors
  const getInterestDetails = (name: string) => {
    const details: Record<string, { desc: string; icon: React.ReactNode }> = {
      'artificial intelligence': { desc: 'Advanced neural network models, representation architectures, and explainable AI.', icon: <FiCpu className="text-xl" /> },
      'remote sensing': { desc: 'Satellite multi-sensor processing, spectral alignment, and Earth observation analytics.', icon: <FiGlobe className="text-xl" /> },
      'hyperspectral imaging': { desc: 'Fine spectral band analysis, sub-pixel classification, and dimensionality reduction.', icon: <FiLayers className="text-xl" /> },
      'machine learning': { desc: 'Transfer learning algorithms, scalable classifiers, and predictive neural layouts.', icon: <FaProjectDiagram className="text-lg" /> },
      'computer vision': { desc: 'Multimodal visual representations, image segmentation, and convolutional neural grids.', icon: <FiCamera className="text-xl" /> }
    };
    return details[name.toLowerCase()] || { desc: 'Exploring algorithmic boundaries, mathematical optimization, and dataset extraction.', icon: <FaGraduationCap className="text-lg" /> };
  };

  const handleCopyBibtex = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedPubId(id);
    toast.success('BibTeX citation copied to clipboard!');
    setTimeout(() => setCopiedPubId(null), 3000);
  };

  const onSubmit = async (values: ContactForm) => {
    try {
      await submitMessage({ ...values, read: false });
      reset();
      toast.success('Thank you, your message has been sent to Dr. Rao.');
    } catch (error) {
      console.error(error);
      toast.error('Unable to submit message. Please try again.');
    }
  };

  // Lightbox handlers
  const handlePrevImage = () => {
    if (activeImageIndex === null) return;
    setActiveImageIndex((activeImageIndex - 1 + effectiveGallery.length) % effectiveGallery.length);
  };

  const handleNextImage = () => {
    if (activeImageIndex === null) return;
    setActiveImageIndex((activeImageIndex + 1) % effectiveGallery.length);
  };

  return (
    <>
      <Seo
        title={effectiveSettings?.seoTitle || effectiveProfile?.name || NAME}
        description={effectiveSettings?.seoDescription || effectiveProfile?.biography || BIO}
        image={effectiveSettings?.ogImageUrl || effectiveProfile?.photoUrl}
      />

      {/* SECTION 1: HERO SECTION */}
      <Hero
        name={effectiveProfile?.name || NAME}
        designation={effectiveProfile?.designation || DESIGNATION}
        institution={effectiveProfile?.institution || INSTITUTION}
        bio={effectiveProfile?.biography || BIO}
        photoUrl={effectiveProfile?.photoUrl}
        email={effectiveProfile?.email}
        phone={effectiveProfile?.phone}
        socialLinks={effectiveProfile?.socialLinks}
      />

      {/* SECTION 2: ACADEMIC HIGHLIGHTS */}
      {/* SECTION 2: ACADEMIC HIGHLIGHTS */}
      <section className="relative z-20 mt-8 pb-12">
        <PageShell>
          <div className={`grid gap-6 ${
            stats.length === 3 
              ? 'sm:grid-cols-3' 
              : stats.length === 4 
              ? 'sm:grid-cols-2 lg:grid-cols-4' 
              : 'sm:grid-cols-2 lg:grid-cols-6'
          }`}>
            {stats.map((s) => (
              <StatCard 
                key={s.id} 
                id={s.id} 
                title={s.title} 
                value={s.value} 
                description={s.description} 
              />
            ))}
          </div>
        </PageShell>
      </section>

      {/* PUBLIC HOME MAIN COLUMN */}
      <div className="space-y-24 py-16 overflow-hidden">
        
        {/* SECTION 3: ABOUT PROFESSOR */}
        <section id="about" className="scroll-mt-24">
          <PageShell>
            <SectionHeading eyebrow="Faculty Biography" title="About the Professor" description="Academic background, degrees, and research philosophy." />
            
            <div className="mt-12 grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
              {/* Left Column: Affiliations & Philosophy */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="space-y-6"
              >
                <div className="rounded-3xl border border-black/5 bg-ink-50/50 p-6 dark:border-white/5 dark:bg-white/5">
                  <h4 className="font-heading text-lg font-bold text-ink-900 dark:text-white flex items-center gap-2">
                    <FiInfo className="text-gold-500" />
                    <span>Key Affiliations</span>
                  </h4>
                  <div className="mt-4 space-y-3 text-sm text-ink-600 dark:text-white/75">
                    <p><strong>Department:</strong> Computer Science and Engineering</p>
                    <p><strong>University:</strong> Rajiv Gandhi University of Knowledge Technologies (RGUKT)</p>
                    <p><strong>Faculty Office:</strong> CSE Block, Room 204</p>
                  </div>
                </div>

                <div className="rounded-3xl border border-gold-400/20 bg-gradient-to-br from-gold-400/5 to-transparent p-6 shadow-glow">
                  <h4 className="font-heading text-lg font-bold text-gold-600 dark:text-gold-300 flex items-center gap-2">
                    <FiAward />
                    <span>Research Philosophy</span>
                  </h4>
                  <p className="mt-4 text-sm leading-relaxed text-ink-700 dark:text-white/70 italic">
                    "Inspiring the next generation of computer scientists by connecting computational models to critical environmental monitoring tasks, achieving explainable, transparent, and deployable outcomes."
                  </p>
                </div>
              </motion.div>

              {/* Right Column: Bio & Interactive Timelines */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="space-y-8"
              >
                <p className="text-base leading-relaxed text-ink-700 dark:text-white/80">
                  {effectiveProfile?.biography || BIO}
                </p>

                {/* Switcher Tab Indicators */}
                <div className="space-y-6">
                  <div className="flex border-b border-black/5 dark:border-white/10 gap-8">
                    <button
                      onClick={() => setActiveBioTab('education')}
                      className={`pb-3 text-sm font-semibold uppercase tracking-wider transition-colors relative ${
                        activeBioTab === 'education' ? 'text-gold-500 dark:text-gold-300 animate-pulse' : 'text-ink-500 dark:text-white/60'
                      }`}
                    >
                      <span>Academic Degrees</span>
                      {activeBioTab === 'education' && (
                        <motion.div layoutId="timelineActiveLine" className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold-400" />
                      )}
                    </button>
                    <button
                      onClick={() => setActiveBioTab('experience')}
                      className={`pb-3 text-sm font-semibold uppercase tracking-wider transition-colors relative ${
                        activeBioTab === 'experience' ? 'text-gold-500 dark:text-gold-300 animate-pulse' : 'text-ink-500 dark:text-white/60'
                      }`}
                    >
                      <span>Professional Career</span>
                      {activeBioTab === 'experience' && (
                        <motion.div layoutId="timelineActiveLine" className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold-400" />
                      )}
                    </button>
                  </div>

                  {/* Vertical Timeline Tracker */}
                  <div className="relative border-l border-gold-400/20 pl-6 space-y-8 py-2">
                    <AnimatePresence mode="wait">
                      {activeBioTab === 'education' ? (
                        <motion.div
                          key="edu"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.3 }}
                          className="space-y-8"
                        >
                          {effectiveEducation.map((edu, idx) => (
                            <div key={idx} className="relative">
                              <span className="absolute -left-[31px] top-1.5 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-ink-950 border-2 border-gold-400 dark:bg-white" />
                              <div className="text-xs font-bold text-gold-500 dark:text-gold-300 uppercase tracking-widest">{edu.year}</div>
                              <h5 className="mt-1 font-heading text-base font-bold text-ink-900 dark:text-white">{edu.degree}</h5>
                              <div className="text-xs font-semibold text-ink-600 dark:text-white/60 mt-0.5">{edu.university}</div>
                              {edu.description && (
                                <p className="mt-2 text-xs leading-relaxed text-ink-500 dark:text-white/40">{edu.description}</p>
                              )}
                            </div>
                          ))}
                        </motion.div>
                      ) : (
                        <motion.div
                          key="exp"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.3 }}
                          className="space-y-8"
                        >
                          {effectiveExperience.map((exp, idx) => (
                            <div key={idx} className="relative">
                              <span className="absolute -left-[31px] top-1.5 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-ink-950 border-2 border-gold-400 dark:bg-white" />
                              <div className="text-xs font-bold text-gold-500 dark:text-gold-300 uppercase tracking-widest">{exp.years}</div>
                              <h5 className="mt-1 font-heading text-base font-bold text-ink-900 dark:text-white">{exp.position}</h5>
                              <div className="text-xs font-semibold text-ink-600 dark:text-white/60 mt-0.5">{exp.organization}</div>
                              {exp.description && (
                                <p className="mt-2 text-xs leading-relaxed text-ink-500 dark:text-white/40">{exp.description}</p>
                              )}
                            </div>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

              </motion.div>
            </div>
          </PageShell>
        </section>

        {/* SECTION 4: RESEARCH INTERESTS */}
        <section id="research-interests" className="scroll-mt-24">
          <PageShell>
            <SectionHeading eyebrow="Academic focus" title="Research Areas & Interests" description="Key domains of investigation, modeling, and deep network deployment." />
            
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {effectiveResearchInterests.map((interest, i) => {
                const data = getInterestDetails(interest);
                return (
                  <motion.div
                    key={interest}
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.06 }}
                    className="group rounded-3xl border border-black/5 bg-white p-6 shadow-soft hover:shadow-glow transition-all dark:border-white/5 dark:bg-ink-900/60"
                  >
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gold-400/10 text-xl text-gold-600 dark:text-gold-300 group-hover:scale-105 transition-transform duration-350">
                      {data.icon}
                    </div>
                    <h3 className="mt-5 font-heading text-lg font-bold text-ink-900 dark:text-white group-hover:text-gold-500 dark:group-hover:text-gold-300 transition-colors">
                      {interest}
                    </h3>
                    <p className="mt-3 text-xs leading-relaxed text-ink-600 dark:text-white/70">
                      {data.desc}
                    </p>
                    <div className="mt-5 flex items-center gap-1 text-xs font-bold text-blue-500 dark:text-blue-400 group-hover:underline">
                      <Link to="/research">Explore Projects</Link>
                      <FiArrowRight />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </PageShell>
        </section>

        {/* SECTION 5: FEATURED RESEARCH (PROJECTS) */}
        <section id="featured-projects" className="scroll-mt-24">
          <PageShell>
            <SectionHeading eyebrow="Ongoing Studies" title="Featured Projects" description="Major active and completed research projects and industrial grants." />

            <div className="mt-10 grid gap-8 md:grid-cols-2">
              {displayResearch.slice(0, 4).map((project, idx) => (
                <motion.article
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className="overflow-hidden rounded-3xl border border-black/5 bg-white shadow-soft dark:border-white/5 dark:bg-ink-900/60 group"
                >
                  {/* Project image with overlays */}
                  <div className="relative h-48 overflow-hidden bg-ink-950">
                    <img 
                      src={project.imageUrls?.[0] || getProjectImage(project.title, idx)} 
                      alt={project.title} 
                      className="h-full w-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700" 
                    />
                    <div className="absolute left-4 top-4">
                      <span className={`rounded-xl px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-white shadow-md ${
                        project.status === 'Active' ? 'bg-emerald-600' : project.status === 'Completed' ? 'bg-blue-600' : 'bg-amber-600'
                      }`}>
                        {project.status}
                      </span>
                    </div>
                    {project.category && (
                      <div className="absolute right-4 top-4">
                        <span className="rounded-xl bg-ink-950/80 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-gold-300 backdrop-blur-sm">
                          {project.category}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="p-6 space-y-4">
                    <h3 className="font-heading text-lg font-bold text-ink-900 dark:text-white leading-snug group-hover:text-gold-500 dark:group-hover:text-gold-300 transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-xs leading-relaxed text-ink-600 dark:text-white/70">
                      {project.description}
                    </p>

                    {/* Objectives and methodology details */}
                    <div className="border-t border-black/5 pt-4 dark:border-white/5 space-y-2 text-[11px] text-ink-500 dark:text-white/40">
                      <div><strong>Objectives:</strong> {project.objectives}</div>
                      <div><strong>Methodology:</strong> {project.methodology}</div>
                      {project.results && <div><strong>Latest Results:</strong> {project.results}</div>}
                    </div>

                    <div className="pt-2 flex justify-end">
                      <Link to="/research" className="inline-flex items-center gap-1 text-xs font-bold text-blue-500 dark:text-blue-400 hover:underline">
                        <span>Read details</span>
                        <FiArrowRight />
                      </Link>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          </PageShell>
        </section>

        {/* SECTION 6: SELECTED PUBLICATIONS */}
        <section id="selected-publications" className="scroll-mt-24">
          <PageShell>
            <SectionHeading eyebrow="Scientific Contributions" title="Selected Publications" description="Peer-reviewed papers and conference articles shaping the future of geospatial imaging." />

            <div className="mt-10 space-y-6">
              {effectivePublications.slice(0, 4).map((pub) => {
                const isBibtexOpen = activeBibtexId === pub.id;
                const fallbackBibtex = `@article{Rao_${pub.slug || 'pub'}${pub.year || '2025'},\n  title={${pub.title}},\n  author={${pub.authors}},\n  journal={${pub.venue || 'Faculty Publications'}},\n  year={${pub.year || '2025'}},\n  doi={${pub.doi || ''}}\n}`;
                const bibtexContent = pub.bibtex || fallbackBibtex;

                return (
                  <motion.article
                    key={pub.id}
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="rounded-3xl border border-black/5 bg-white p-6 shadow-soft dark:border-white/5 dark:bg-ink-900/60"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      {/* Left: Metadata & Title */}
                      <div className="space-y-2 max-w-3xl">
                        <div className="flex items-center gap-2">
                          <span className="rounded-full bg-blue-50 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:bg-white/5 dark:text-blue-400">
                            {pub.type || 'Journal'}
                          </span>
                          <span className="text-xs text-ink-500 dark:text-white/40">
                            {pub.venue} · <strong>{pub.year}</strong>
                          </span>
                        </div>
                        <h3 className="font-heading text-lg font-bold text-ink-900 dark:text-white leading-snug">
                          {pub.title}
                        </h3>
                        <p className="text-xs font-medium text-ink-600 dark:text-white/60">
                          {pub.authors}
                        </p>
                      </div>

                      {/* Right: Actions */}
                      <div className="flex flex-wrap items-center gap-2.5 sm:mt-1">
                        <button
                          onClick={() => setActiveBibtexId(isBibtexOpen ? null : pub.id)}
                          className="inline-flex items-center gap-1.5 rounded-full border border-black/5 bg-ink-50 px-4 py-2 text-xs font-bold text-ink-700 hover:bg-ink-100 transition-colors dark:border-white/5 dark:bg-white/5 dark:text-white/80 dark:hover:bg-white/10"
                        >
                          <FiCopy />
                          <span>{isBibtexOpen ? 'Hide Cite' : 'Cite (BibTeX)'}</span>
                        </button>
                        
                        {pub.doi && (
                          <a
                            href={`https://doi.org/${pub.doi}`}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 rounded-full border border-black/5 bg-white px-4 py-2 text-xs font-bold text-ink-700 hover:bg-ink-50 transition-colors dark:border-white/5 dark:bg-ink-950 dark:text-white"
                          >
                            <span>DOI</span>
                            <FiExternalLink />
                          </a>
                        )}

                        {pub.pdfUrl && (
                          <a
                            href={pub.pdfUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 rounded-full bg-ink-900 px-4 py-2 text-xs font-bold text-white hover:bg-ink-800 transition-all dark:bg-white dark:text-ink-950 dark:hover:bg-white/90"
                          >
                            <span>PDF</span>
                          </a>
                        )}
                      </div>
                    </div>

                    {/* BibTeX Panel */}
                    <AnimatePresence>
                      {isBibtexOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="mt-5 border-t border-black/5 pt-5 dark:border-white/5">
                            <div className="relative">
                              <pre className="overflow-x-auto rounded-2xl bg-ink-950 p-4 font-mono text-xs text-white/80 leading-relaxed scrollbar-none dark:bg-black/60">
                                {bibtexContent}
                              </pre>
                              <button
                                onClick={() => handleCopyBibtex(bibtexContent, pub.id)}
                                className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-xl bg-white/10 text-white hover:bg-white/20 transition-colors"
                                title="Copy citation"
                              >
                                {copiedPubId === pub.id ? <FiCheck className="text-emerald-400" /> : <FiCopy />}
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.article>
                );
              })}
            </div>

            <div className="mt-8 flex justify-center">
              <Link to="/publications" className="inline-flex items-center gap-2 rounded-full border border-gold-400/30 px-6 py-3 text-sm font-semibold text-gold-500 hover:bg-gold-400/5 transition-all dark:text-gold-300">
                <span>View Full Publications List</span>
                <FiArrowRight />
              </Link>
            </div>
          </PageShell>
        </section>

        {/* SECTION 7: TEACHING & MENTORING */}
        <section id="teaching" className="scroll-mt-24">
          <PageShell>
            <SectionHeading eyebrow="Academic Courses" title="Teaching & Mentoring" description="University course lectures, lab sessions, and doctoral scholars mentoring." />

            <div className="mt-10 grid gap-8 lg:grid-cols-[1.3fr_0.7fr]">
              {/* Left: Courses list */}
              <div className="space-y-6">
                <h4 className="font-heading text-lg font-bold text-ink-950 dark:text-white flex items-center gap-2">
                  <FiBookOpen className="text-blue-500" />
                  <span>Syllabus Highlights</span>
                </h4>
                <div className="grid gap-6 sm:grid-cols-2">
                  {effectiveTeaching.map((t, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 15 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      className="rounded-3xl border border-black/5 bg-white p-5 shadow-soft dark:border-white/5 dark:bg-ink-900/60"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-extrabold uppercase tracking-widest text-gold-500 dark:text-gold-300">
                          {t.courseCode}
                        </span>
                        <span className="rounded-full bg-ink-50 px-2.5 py-1 text-[10px] font-bold text-ink-600 dark:bg-white/5 dark:text-white/50">
                          {t.level || 'Graduate'}
                        </span>
                      </div>
                      <h4 className="mt-3 font-heading text-base font-bold text-ink-900 dark:text-white">
                        {t.courseName}
                      </h4>
                      <p className="mt-2 text-xs leading-relaxed text-ink-500 dark:text-white/50">
                        {t.description}
                      </p>
                      <div className="mt-4 border-t border-black/5 pt-3 dark:border-white/5 flex items-center justify-between text-[11px] text-ink-600 dark:text-white/40">
                        <span>{t.semester} {t.year}</span>
                        {t.credits && <span><strong>Credits:</strong> {t.credits}</span>}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Right: Mentoring side details */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="rounded-3xl border border-black/5 bg-gradient-to-tr from-ink-900 to-ink-950 p-6 text-white dark:border-white/5 shadow-glow"
              >
                <h4 className="font-heading text-lg font-bold text-gold-300 flex items-center gap-2">
                  <FaUsers />
                  <span>Research Mentorship</span>
                </h4>
                <p className="mt-4 text-xs leading-relaxed text-white/70">
                  Dr. Rao actively supervises graduate researchers, capstone project teams, and PhD candidates inside the Earth sensing computer systems lab.
                </p>

                <div className="mt-8 space-y-6">
                  {[
                    { label: 'Active PhD Candidates', count: '5', desc: 'Direct thesis guidance' },
                    { label: 'Graduated PhD Scholars', count: '7', desc: 'Working in global labs & academia' },
                    { label: 'Undergraduate Projects', count: '24+', desc: 'Research capstone guidelines' },
                  ].map((stat, idx) => (
                    <div key={idx} className="flex items-center gap-4 border-b border-white/5 pb-4 last:border-b-0 last:pb-0">
                      <div className="text-3xl font-extrabold text-gold-400">
                        {stat.count}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white">{stat.label}</div>
                        <div className="text-[10px] text-white/50 mt-0.5">{stat.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </PageShell>
        </section>

        {/* SECTION 8: ACHIEVEMENTS & AWARDS */}
        <section id="achievements" className="scroll-mt-24">
          <PageShell>
            <SectionHeading eyebrow="Honors & Credentials" title="Awards & Recognitions" description="Milestones and professional awards acquired throughout a stellar academic career." />

            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {effectiveAchievements.map((award, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="rounded-3xl border border-black/5 bg-white p-6 shadow-soft hover:shadow-glow transition-all dark:border-white/5 dark:bg-ink-900/60"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gold-400/10 text-lg text-gold-500">
                    <FiAward />
                  </div>
                  <h4 className="mt-4 font-heading text-lg font-bold text-ink-900 dark:text-white">
                    {award.title}
                  </h4>
                  <div className="text-xs font-bold text-gold-500 dark:text-gold-300 mt-1">
                    {award.value}
                  </div>
                  <p className="mt-3 text-xs leading-relaxed text-ink-500 dark:text-white/50">
                    {award.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </PageShell>
        </section>

        {/* SECTION 9: GALLERY PREVIEW */}
        <section id="gallery" className="scroll-mt-24">
          <PageShell>
            <SectionHeading eyebrow="Campus Life" title="Geospatial Media Gallery" description="Images from presentations, research lab desks, and academic group panels." />

            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {effectiveGallery.map((img, idx) => (
                <motion.div
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  initial={{ opacity: 0, scale: 0.98 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -4 }}
                  className="overflow-hidden rounded-3xl border border-black/5 bg-white shadow-soft dark:border-white/5 dark:bg-ink-900/60 group cursor-pointer animate-fade-in"
                >
                  <div className="relative h-56 overflow-hidden bg-ink-950">
                    <img 
                      src={img.imageUrl} 
                      alt={img.title} 
                      className="h-full w-full object-cover opacity-80 group-hover:scale-105 group-hover:opacity-100 transition-all duration-500" 
                    />
                    <div className="absolute bottom-4 left-4 right-4 z-10 translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                      <span className="rounded-lg bg-ink-950/80 px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-gold-300 backdrop-blur-sm">
                        {img.category}
                      </span>
                      <h4 className="font-heading text-sm font-bold text-white mt-2 leading-tight drop-shadow-md">
                        {img.title}
                      </h4>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                </motion.div>
              ))}
            </div>
          </PageShell>
        </section>

        {/* SECTION 10: CONTACT & OFFICE */}
        <section id="contact" className="scroll-mt-24">
          <PageShell>
            <SectionHeading eyebrow="Communications" title="Office Location & Contact" description="Send a message directly. Responses will be displayed in the dashboard panel." />

            <div className="mt-10 grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
              {/* Office Details Cards */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="rounded-3xl border border-black/5 bg-gradient-to-b from-ink-900 to-ink-950 p-6 text-white shadow-glow dark:border-white/5 space-y-8"
              >
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-gold-400">
                    Office Hours
                  </span>
                  <h4 className="font-heading text-xl font-bold text-white mt-1">Visiting Hours</h4>
                  <p className="mt-3 text-xs leading-relaxed text-white/70">
                    Office visits and project inquiries are welcome: <br />
                    <strong>Mon – Fri: 10:00 AM – 4:00 PM</strong>
                  </p>
                </div>

                <div className="space-y-4 border-t border-white/10 pt-6 text-xs text-white/70">
                  <div className="flex items-center gap-3">
                    <FiMail className="text-gold-300" />
                    <span>{effectiveProfile?.email || 'abduru@rgukt.edu.in'}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <FiPhone className="text-gold-300" />
                    <span>{effectiveProfile?.phone || '+91-98765-43210'}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <FiMapPin className="text-gold-300" />
                    <span>{effectiveProfile?.office || 'CSE Wing Room 204, RGUKT'}</span>
                  </div>
                </div>

                {effectiveProfile?.mapUrl ? (
                  <iframe 
                    title="Faculty Office Map" 
                    src={effectiveProfile.mapUrl} 
                    className="h-60 w-full rounded-2xl border-0 bg-ink-950/40" 
                    loading="lazy" 
                  />
                ) : (
                  <div className="h-60 w-full rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-xs text-white/40 italic">
                    Office map location preview configured in admin panel.
                  </div>
                )}
              </motion.div>

              {/* Functional Message Form */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="rounded-3xl border border-black/5 bg-white p-6 shadow-soft dark:border-white/5 dark:bg-ink-900/60"
              >
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-ink-700 dark:text-white/80">
                        Your Name
                      </label>
                      <input 
                        type="text" 
                        {...register('name', { required: true })} 
                        placeholder="John Doe"
                        className="w-full rounded-2xl border border-black/10 bg-transparent px-4.5 py-3.5 text-xs text-ink-950 focus:border-gold-400 focus:outline-none dark:border-white/10 dark:text-white" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-ink-700 dark:text-white/80">
                        Email Address
                      </label>
                      <input 
                        type="email" 
                        {...register('email', { required: true })} 
                        placeholder="john@example.com"
                        className="w-full rounded-2xl border border-black/10 bg-transparent px-4.5 py-3.5 text-xs text-ink-950 focus:border-gold-400 focus:outline-none dark:border-white/10 dark:text-white" 
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-ink-700 dark:text-white/80">
                      Subject
                    </label>
                    <input 
                      type="text" 
                      {...register('subject', { required: true })} 
                      placeholder="PhD Supervision / Project Query"
                      className="w-full rounded-2xl border border-black/10 bg-transparent px-4.5 py-3.5 text-xs text-ink-950 focus:border-gold-400 focus:outline-none dark:border-white/10 dark:text-white" 
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-ink-700 dark:text-white/80">
                      Message Content
                    </label>
                    <textarea 
                      rows={6} 
                      {...register('message', { required: true })} 
                      placeholder="Write your email details here..."
                      className="w-full rounded-2xl border border-black/10 bg-transparent px-4.5 py-3.5 text-xs text-ink-950 focus:border-gold-400 focus:outline-none dark:border-white/10 dark:text-white" 
                    />
                  </div>

                  <button 
                    type="submit" 
                    disabled={isSubmitting} 
                    className="inline-flex items-center gap-2 rounded-full bg-ink-950 px-6.5 py-3.5 text-xs font-bold text-white hover:bg-ink-800 disabled:opacity-50 transition-all dark:bg-white dark:text-ink-950 dark:hover:bg-white/95 shadow-soft"
                  >
                    {isSubmitting ? (
                      <span>Submitting...</span>
                    ) : (
                      <>
                        <FiSend />
                        <span>Send message</span>
                      </>
                    )}
                  </button>
                </form>
              </motion.div>
            </div>
          </PageShell>
        </section>

      </div>

      {/* LIGHTBOX SLIDER MODAL */}
      <AnimatePresence>
        {activeImageIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-md"
          >
            <div className="absolute inset-0" onClick={() => setActiveImageIndex(null)} />

            <div className="relative z-10 max-w-4xl w-full flex flex-col items-center">
              
              <button
                onClick={() => setActiveImageIndex(null)}
                className="absolute right-0 top-[-45px] flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
              >
                <FiX size={20} />
              </button>

              <div className="relative flex items-center w-full justify-center">
                <button
                  onClick={handlePrevImage}
                  className="absolute left-[-20px] md:left-[-60px] flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors z-20"
                >
                  <FiChevronLeft size={24} />
                </button>

                <motion.div
                  key={activeImageIndex}
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden rounded-3xl bg-ink-950 border border-white/10 shadow-2xl"
                >
                  <img
                    src={effectiveGallery[activeImageIndex].imageUrl}
                    alt={effectiveGallery[activeImageIndex].title}
                    className="max-h-[60vh] md:max-h-[70vh] w-full object-contain"
                  />
                  <div className="bg-ink-900 p-6 text-white">
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-gold-400">
                      {effectiveGallery[activeImageIndex].category} · {effectiveGallery[activeImageIndex].year}
                    </span>
                    <h3 className="font-heading text-lg font-bold text-white mt-1">
                      {effectiveGallery[activeImageIndex].title}
                    </h3>
                    <p className="text-xs text-white/60 mt-2 leading-relaxed">
                      {effectiveGallery[activeImageIndex].description}
                    </p>
                  </div>
                </motion.div>

                <button
                  onClick={handleNextImage}
                  className="absolute right-[-20px] md:right-[-60px] flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors z-20"
                >
                  <FiChevronRight size={24} />
                </button>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
