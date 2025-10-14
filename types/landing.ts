export type HeroIllustration = {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  caption?: string;
};

export type HeroContent = {
  heading: string;
  subheading: string;
  badge: string;
  mathSnippet?: string | null;
  illustration?: HeroIllustration;
};

export type TLDRItem = {
  label: string;
  description: string;
};

export type TLDRContent = {
  title: string;
  items: TLDRItem[];
};

export type IntentCluster = {
  id: string;
  title: string;
  body: string;
};

export type ServiceItem = {
  id: string;
  name: string;
  copy: string;
};

export type ServicesContent = {
  title: string;
  description: string;
  items: ServiceItem[];
};

export type HowItWorksStep = {
  id: string;
  title: string;
  description: string;
};

export type MiniPlanItem = {
  label: string;
  detail: string;
  badgeVariant: string;
};

export type HowItWorksContent = {
  title: string;
  steps: HowItWorksStep[];
  miniPlan: MiniPlanItem[];
};

export type ResultsPlaceholder = {
  type: string;
  label: string;
};

export type ResultsContent = {
  title: string;
  description: string;
  placeholders: ResultsPlaceholder[];
};

export type AboutContent = {
  title: string;
  body: string;
};

export type PricingPlan = {
  id: string;
  name: string;
  price: string;
  unit: string;
  features: string[];
  cta: string;
  badge?: string;
};

export type PricingNote = {
  vat: string;
  customPlan: {
    label: string;
    href: string;
  };
};

export type PricingContent = {
  title: string;
  note: PricingNote;
  plans: PricingPlan[];
};

export type FAQItem = {
  id: string;
  question: string;
  answer: string;
};

export type FAQContent = {
  title: string;
  items: FAQItem[];
};

export type HowToStep = {
  name: string;
  description: string;
  duration: string;
  materials: string[];
  notes: string[];
};

export type HowToContent = {
  title: string;
  intro: string;
  steps: HowToStep[];
  disclaimer: string;
};

export type ComparisonColumn = {
  key: string;
  label: string;
};

export type ComparisonRow = {
  metric: string;
  values: Record<string, string>;
};

export type ComparisonContent = {
  title: string;
  description: string;
  columns: ComparisonColumn[];
  rows: ComparisonRow[];
  footnote: string;
};

export type GlossaryEntry = {
  term: string;
  definition: string;
  relatedLinks?: string[];
};

export type GlossaryContent = {
  title: string;
  entries: GlossaryEntry[];
};
export type ContactDetail = {
  label: string;
  value: string;
  href: string;
};

export type ImpressumEntry = {
  label: string;
  value: string;
  href?: string;
  type?: "email" | "tel" | "url";
};

export type ImpressumContent = {
  title: string;
  description: string;
  entries: ImpressumEntry[];
  notes?: string[];
};


export type ContactFormFieldId = "name" | "email" | "phone" | "level" | "message";

export type ContactFormField = {
  id: ContactFormFieldId;
  label: string;
  placeholder: string;
  type: "text" | "email" | "tel" | "textarea";
  required: boolean;
};

export type ContactFormValidationMessages = {
  nameRequired: string;
  nameTooLong: string;
  emailInvalid: string;
  phoneInvalid: string;
  levelRequired: string;
  levelTooLong: string;
  messageRequired: string;
  messageTooLong: string;
};

export type ContactFormContent = {
  title: string;
  fields: ContactFormField[];
  privacyNote: string;
  submitLabel: string;
  success: string;
  error: string;
  validation: ContactFormValidationMessages;
};

export type ContactContent = {
  title: string;
  description: string;
  details: ContactDetail[];
  form: ContactFormContent;
  responseTime: string;
  officeHours: string;
};

export type OutboundLink = {
  name: string;
  url: string;
  description: string;
  category: string;
};

export type LandingContent = {
  hero: HeroContent;
  tldr: TLDRContent;
  intentClusters: IntentCluster[];
  sections: {
    services: ServicesContent;
    howItWorks: HowItWorksContent;
    results: ResultsContent;
    about: AboutContent;
    pricing: PricingContent;
    faq: FAQContent;
    howTo: HowToContent;
    comparison: ComparisonContent;
    glossary: GlossaryContent;
  };
  contact: ContactContent;
  impressum: ImpressumContent;
  outboundLinks: OutboundLink[];
};