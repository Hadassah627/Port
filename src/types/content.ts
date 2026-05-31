export type FirestoreDateLike =
  | string
  | number
  | Date
  | { seconds: number; nanoseconds: number };

export type SocialLink = {
  label: string;
  url: string;
};

export type Profile = {
  name: string;
  designation: string;
  department?: string;
  institution?: string;
  biography: string;
  photoUrl: string;
  email: string;
  phone: string;
  office: string;
  mapUrl: string;
  socialLinks: SocialLink[];
  researchInterests: string[];
  keywords: string[];
  education: EducationItem[];
  experience: ExperienceItem[];
};

export type ResearchItem = {
  title: string;
  slug: string;
  category: string;
  description: string;
  objectives: string;
  methodology: string;
  results: string;
  status: 'Draft' | 'Active' | 'Completed';
  imageUrls: string[];
  fileUrls: string[];
  featured?: boolean;
};

export type PublicationItem = {
  title: string;
  slug: string;
  authors: string;
  venue: string;
  year: number;
  type: 'Journal' | 'Conference' | 'Book Chapter' | 'Workshop' | 'Patent';
  doi: string;
  pdfUrl: string;
  abstract: string;
  keywords: string[];
  citation: string;
  bibtex: string;
  featured?: boolean;
};

export type TeachingItem = {
  courseName: string;
  courseCode: string;
  semester: string;
  year: number;
  description: string;
  credits?: string;
  level?: string;
};

export type GalleryItem = {
  title: string;
  category: string;
  imageUrl: string;
  description: string;
  year: number;
  featured?: boolean;
};

export type AchievementItem = {
  title: string;
  value: string;
  description: string;
  icon?: string;
};

export type EducationItem = {
  degree: string;
  university: string;
  year: string;
  description: string;
};

export type ExperienceItem = {
  position: string;
  organization: string;
  years: string;
  description: string;
};

export type MessageItem = {
  name: string;
  email: string;
  subject: string;
  message: string;
  read?: boolean;
};

export type Settings = {
  siteTitle: string;
  seoTitle: string;
  seoDescription: string;
  ogImageUrl: string;
  contactEmail: string;
  contactPhone: string;
  socialLinks: SocialLink[];
};

export type UserRole = 'admin' | 'editor' | 'viewer';

export type UserProfile = {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  photoUrl?: string;
};

export type CollectionFieldType =
  | 'text'
  | 'textarea'
  | 'number'
  | 'url'
  | 'email'
  | 'select'
  | 'image'
  | 'file'
  | 'tags'
  | 'toggle';

export type CollectionField = {
  name: string;
  label: string;
  type: CollectionFieldType;
  placeholder?: string;
  helperText?: string;
  required?: boolean;
  options?: Array<{ label: string; value: string }>;
  multiple?: boolean;
  accept?: string;
};

export type CollectionConfig<T> = {
  id: string;
  title: string;
  description: string;
  collectionPath: string;
  sortBy?: keyof T & string;
  sortDirection?: 'asc' | 'desc';
  fields: CollectionField[];
  defaults: Partial<T>;
  searchableFields: Array<keyof T & string>;
  preview: (item: T) => string;
  badge?: (item: T) => string;
};

export type AdminSectionId =
  | 'dashboard'
  | 'profile'
  | 'research'
  | 'publications'
  | 'teaching'
  | 'gallery'
  | 'achievements'
  | 'messages'
  | 'settings';