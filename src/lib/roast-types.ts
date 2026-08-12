export type RoastMode = 'roast' | 'professional' | 'jobmatch';
export type Language = 'tr' | 'en';

export interface RoastResult {
  title: string;
  score: number;
  emoji: string;
  summary: string;
  burns: string[];
  feedback: string[];
  suggestions: string[];
}

export interface RoastResponse {
  id: string;
  slug: string;
  isPublic: boolean;
  nickname: string | null;
  createdAt: string;
  result: RoastResult;
  remaining: number;
}

export interface GalleryItem {
  id: string;
  slug: string;
  nickname: string | null;
  mode: RoastMode;
  score: number;
  language: Language;
  title: string;
  emoji: string;
  summary: string;
  createdAt: string;
}

export const MODE_META: Record<
  RoastMode,
  { label: { en: string; tr: string }; emoji: string; tagline: { en: string; tr: string } }
> = {
  roast: {
    label: { en: 'Brutal Roast', tr: 'Acımasız Roast' },
    emoji: '🔥',
    tagline: {
      en: 'No mercy, pure comedy. Best for laughs.',
      tr: 'Acımasız, saf komedi. Kahkaha için ideal.',
    },
  },
  professional: {
    label: { en: 'Pro Feedback', tr: 'Profesyonel' },
    emoji: '💼',
    tagline: {
      en: 'Senior recruiter feedback, FAANG style.',
      tr: 'Kıdemli işe alım uzmanı geri bildirimi.',
    },
  },
  jobmatch: {
    label: { en: 'Job Match', tr: 'İş Eşleşmesi' },
    emoji: '🎯',
    tagline: {
      en: 'How well do you fit a specific role?',
      tr: 'Belirli bir role ne kadar uyuyorsun?',
    },
  },
};

export const UI_TEXT = {
  en: {
    navBrand: 'RoastMy.cv',
    navGallery: 'Gallery',
    navPricing: 'Pricing',
    navGithub: 'Star on GitHub',
    heroBadge: 'AI-powered resume roast',
    heroTitle1: 'Get your resume',
    heroTitle2: 'roasted by AI',
    heroSubtitle:
      'Paste your resume. Pick your mode. Get brutally honest feedback in 10 seconds. Free, anonymous, shareable.',
    heroCta: 'Roast me now',
    heroSecondary: 'See gallery',
    inputTitle: 'Drop your resume',
    inputSubtitle: 'Paste your resume text below. No signup needed.',
    placeholder:
      "Paste your full resume here...\n\nJohn Doe\nSenior Software Engineer\n\nExperience:\n- Built X using Y\n- Led team of N\n...",
    modeLabel: 'Choose your fate',
    targetJobLabel: 'Target job title',
    targetJobPlaceholder: 'e.g. Senior Frontend Engineer at Stripe',
    makePublicLabel: 'Make my roast public (anonymous nickname)',
    submitBtn: '🔥 Roast me',
    submitBtnLoading: 'Roasting...',
    resultTitle: 'Your roast is ready',
    shareBtn: 'Share on X',
    copyBtn: 'Copy link',
    newRoastBtn: 'Roast another',
    scoreLabel: 'Score',
    burnsLabel: '🔥 The Burns',
    feedbackLabel: '💼 Real Feedback',
    suggestionsLabel: '🎯 Fix It Like This',
    summaryLabel: 'Summary',
    galleryTitle: 'Recent public roasts',
    galleryEmpty: 'No public roasts yet. Be the first!',
    pricingTitle: 'Pricing',
    freeTier: 'Free',
    freePrice: '$0',
    freeFeatures: ['3 roasts per day', 'All 3 modes', 'Public gallery', 'Shareable links'],
    proTier: 'Pro',
    proPrice: '$5',
    proPeriod: '/month',
    proFeatures: [
      'Unlimited roasts',
      'PDF resume upload',
      'LinkedIn URL import',
      'Cover letter generator',
      'No watermarks',
      'Priority AI model',
    ],
    proCta: 'Upgrade to Pro',
    comingSoon: 'Coming soon',
    remaining: 'roasts left today',
    rateLimited: "You've hit the daily limit. Come back tomorrow!",
    footerMadeBy: 'Built with 🔥 by humans + AI',
    errorGeneric: 'Something went wrong. Try again.',
  },
  tr: {
    navBrand: 'RoastMy.cv',
    navGallery: 'Galeri',
    navPricing: 'Fiyatlar',
    navGithub: "GitHub'da yıldızla",
    heroBadge: 'AI destekli özgeçmiş roast\'i',
    heroTitle1: 'Özgeçmişini',
    heroTitle2: 'AI\'ye roast ettir',
    heroSubtitle:
      'Özgeçmişini yapıştır. Modunu seç. 10 saniyede acımasızca dürüst geri bildirim al. Ücretsiz, anonim, paylaşılabilir.',
    heroCta: 'Beni roastle',
    heroSecondary: 'Galeriyi gör',
    inputTitle: 'Özgeçmişini bırak',
    inputSubtitle: 'Özgeçmiş metnini aşağıya yapıştır. Kayıt gerekmez.',
    placeholder:
      "Özgeçmişini buraya yapıştır...\n\nAhmet Yılmaz\nKıdemli Yazılım Mühendisi\n\nDeneyim:\n- X'i Y kullanarak geliştirdim\n- N kişilik ekibe liderlik ettim\n...",
    modeLabel: 'Kaderini seç',
    targetJobLabel: 'Hedef iş unvanı',
    targetJobPlaceholder: 'örn. Stripe\'ta Kıdemli Frontend Mühendisi',
    makePublicLabel: 'Roast\'imi herkese açık yap (anonim takma ad)',
    submitBtn: '🔥 Beni roastle',
    submitBtnLoading: 'Roastlanıyor...',
    resultTitle: 'Roast\'in hazır',
    shareBtn: "X'te paylaş",
    copyBtn: 'Linki kopyala',
    newRoastBtn: 'Başka roastle',
    scoreLabel: 'Puan',
    burnsLabel: '🔥 Yakmalar',
    feedbackLabel: '💼 Gerçek Geri Bildirim',
    suggestionsLabel: '🎯 Böyle Düzelt',
    summaryLabel: 'Özet',
    galleryTitle: 'Son herkese açık roast\'ler',
    galleryEmpty: 'Henüz herkese açık roast yok. İlk olan sen ol!',
    pricingTitle: 'Fiyatlar',
    freeTier: 'Ücretsiz',
    freePrice: '₺0',
    freeFeatures: ['Günde 3 roast', 'Tüm 3 mod', 'Herkese açık galeri', 'Paylaşılabilir linkler'],
    proTier: 'Pro',
    proPrice: '₺150',
    proPeriod: '/ay',
    proFeatures: [
      'Sınırsız roast',
      'PDF özgeçmiş yükleme',
      'LinkedIn URL içe aktarma',
      'Cover letter üreteci',
      'Filigran yok',
      'Öncelikli AI modeli',
    ],
    proCta: "Pro'ya geç",
    comingSoon: 'Yakında',
    remaining: 'bugün kaldı',
    rateLimited: 'Günlük limitine ulaştın. Yarın gel!',
    footerMadeBy: '🔥 ile insanlar + AI tarafından yapıldı',
    errorGeneric: 'Bir şeyler ters gitti. Tekrar dene.',
  },
};
