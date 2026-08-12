// ============ TYPES ============
export type RoastMode = 'roast' | 'professional' | 'jobmatch';

export type Language =
  | 'en'
  | 'tr'
  | 'de'
  | 'es'
  | 'fr'
  | 'it'
  | 'pt'
  | 'ru'
  | 'nl'
  | 'zh';

export interface LanguageMeta {
  code: Language;
  name: string; // English name
  nativeName: string;
  flag: string;
}

export const LANGUAGES: LanguageMeta[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧' },
  { code: 'tr', name: 'Turkish', nativeName: 'Türkçe', flag: '🇹🇷' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇵🇹' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', flag: '🇷🇺' },
  { code: 'nl', name: 'Dutch', nativeName: 'Nederlands', flag: '🇳🇱' },
  { code: 'zh', name: 'Chinese', nativeName: '中文', flag: '🇨🇳' },
];

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

// ============ MODE METADATA ============
type LocalizedText = Record<Language, string>;

export const MODE_META: Record<
  RoastMode,
  { label: LocalizedText; emoji: string; tagline: LocalizedText }
> = {
  roast: {
    emoji: '🔥',
    label: {
      en: 'Brutal Roast',
      tr: 'Acımasız Roast',
      de: 'Brutales Roast',
      es: 'Roast Brutal',
      fr: 'Roast Brutal',
      it: 'Roast Brutale',
      pt: 'Roast Brutal',
      ru: 'Жесткий Роаст',
      nl: 'Brutale Roast',
      zh: '无情吐槽',
    },
    tagline: {
      en: 'No mercy, pure comedy. Best for laughs.',
      tr: 'Acımasız, saf komedi. Kahkaha için ideal.',
      de: 'Keine Gnade, reine Komödie. Ideal für Lacher.',
      es: 'Sin piedad, comedia pura. Ideal para reír.',
      fr: 'Sans pitié, pure comédie. Idéal pour rire.',
      it: 'Nessuna pietà, commedia pura. Ideale per ridere.',
      pt: 'Sem pena, comédia pura. Ideal para rir.',
      ru: 'Без пощады, чистая комедия. Для смеха.',
      nl: 'Genadeloos, pure komedie. Ideaal voor lachen.',
      zh: '毫不留情，纯喜剧。最适合开怀大笑。',
    },
  },
  professional: {
    emoji: '💼',
    label: {
      en: 'Pro Feedback',
      tr: 'Profesyonel',
      de: 'Pro Feedback',
      es: 'Feedback Pro',
      fr: 'Feedback Pro',
      it: 'Feedback Pro',
      pt: 'Feedback Pro',
      ru: 'Про Отзыв',
      nl: 'Pro Feedback',
      zh: '专业反馈',
    },
    tagline: {
      en: 'Senior recruiter feedback, FAANG style.',
      tr: 'Kıdemli işe alım uzmanı geri bildirimi.',
      de: 'Feedback eines Senior Recruiters, FAANG-Stil.',
      es: 'Feedback de reclutador senior, estilo FAANG.',
      fr: "Retour d'un recruteur senior, style FAANG.",
      it: 'Feedback di un recruiter senior, stile FAANG.',
      pt: 'Feedback de recrutador sênior, estilo FAANG.',
      ru: 'Отзыв старшего рекрутера, стиль FAANG.',
      nl: 'Feedback van een senior recruiter, FAANG-stijl.',
      zh: '资深招聘官反馈，FAANG风格。',
    },
  },
  jobmatch: {
    emoji: '🎯',
    label: {
      en: 'Job Match',
      tr: 'İş Eşleşmesi',
      de: 'Job-Match',
      es: 'Match de Trabajo',
      fr: 'Match Emploi',
      it: 'Match Lavoro',
      pt: 'Match de Vaga',
      ru: 'Совпадение Работы',
      nl: 'Job Match',
      zh: '职位匹配',
    },
    tagline: {
      en: 'How well do you fit a specific role?',
      tr: 'Belirli bir role ne kadar uyuyorsun?',
      de: 'Wie gut passt du zu einer bestimmten Rolle?',
      es: '¿Qué tan bien encajas en un rol específico?',
      fr: 'À quel point corres-tu à un poste spécifique ?',
      it: 'Quanto ti adatti a un ruolo specifico?',
      pt: 'Quão bem você se encaixa em uma vaga específica?',
      ru: 'Насколько хорошо вы подходите на конкретную роль?',
      nl: 'Hoe goed pas je bij een specifieke rol?',
      zh: '你有多适合某个特定职位？',
    },
  },
};

// ============ UI TEXT ============
export interface UIText {
  navBrand: string;
  navGallery: string;
  navPricing: string;
  navGithub: string;
  heroBadge: string;
  heroTitle1: string;
  heroTitle2: string;
  heroSubtitle: string;
  heroCta: string;
  heroSecondary: string;
  inputTitle: string;
  inputSubtitle: string;
  placeholder: string;
  modeLabel: string;
  targetJobLabel: string;
  targetJobPlaceholder: string;
  makePublicLabel: string;
  submitBtn: string;
  submitBtnLoading: string;
  resultTitle: string;
  shareBtn: string;
  shareTweetText: string; // tweet text, {title} placeholder
  copyBtn: string;
  copiedBtn: string;
  newRoastBtn: string;
  scoreLabel: string;
  burnsLabel: string;
  feedbackLabel: string;
  suggestionsLabel: string;
  summaryLabel: string;
  galleryTitle: string;
  galleryEmpty: string;
  pricingTitle: string;
  freeTier: string;
  freePrice: string;
  freeFeatures: string[];
  proTier: string;
  proPrice: string;
  proPeriod: string;
  proFeatures: string[];
  proCta: string;
  comingSoon: string;
  remaining: string;
  rateLimited: string;
  footerMadeBy: string;
  footerNoStore: string;
  errorGeneric: string;
  errorTooShort: string;
  errorTooLong: string;
  closeBtn: string;
  langMenuLabel: string;
  // Stripe / Auth UI
  signInBtn: string;
  proActiveLabel: string;
  manageSubscriptionBtn: string;
  upgradingBtn: string;
  upgradeSuccessTitle: string;
  upgradeSuccessMsg: string;
  proUnlimited: string;
}

export const UI_TEXT: Record<Language, UIText> = {
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
    shareTweetText: 'AI roasted my resume: "{title}" 🔥\n\nTry yours:',
    copyBtn: 'Copy link',
    copiedBtn: 'Copied!',
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
    footerNoStore: 'No resumes are stored beyond the roast result.',
    errorGeneric: 'Something went wrong. Try again.',
    errorTooShort: 'Resume text too short. Paste at least 50 characters.',
    errorTooLong: 'Resume too long. Keep it under 12000 characters.',
    closeBtn: 'Close',
    langMenuLabel: 'Language',
    signInBtn: 'Sign in',
    proActiveLabel: 'Your Pro is active',
    manageSubscriptionBtn: 'Manage subscription',
    upgradingBtn: 'Redirecting...',
    upgradeSuccessTitle: '🔥 Welcome to Pro!',
    upgradeSuccessMsg: 'You now have unlimited roasts. Roast away!',
    proUnlimited: 'Unlimited',
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
    shareTweetText: 'AI özgeçmişimi roastledi: "{title}" 🔥\n\nSen de dene:',
    copyBtn: 'Linki kopyala',
    copiedBtn: 'Kopyalandı!',
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
    footerNoStore: 'Roast sonucu dışında özgeçmiş depolanmaz.',
    errorGeneric: 'Bir şeyler ters gitti. Tekrar dene.',
    errorTooShort: 'Özgeçmiş çok kısa. En az 50 karakter yapıştır.',
    errorTooLong: 'Özgeçmiş çok uzun. 12000 karakterin altında tut.',
    closeBtn: 'Kapat',
    langMenuLabel: 'Dil',
    signInBtn: 'Giriş yap',
    proActiveLabel: 'Pro aktif',
    manageSubscriptionBtn: 'Aboneliği yönet',
    upgradingBtn: 'Yönlendiriliyor...',
    upgradeSuccessTitle: '🔥 Pro\'ya hoş geldin!',
    upgradeSuccessMsg: 'Artık sınırsız roast hakkın var. Roastlamaya başla!',
    proUnlimited: 'Sınırsız',
  },
  de: {
    navBrand: 'RoastMy.cv',
    navGallery: 'Galerie',
    navPricing: 'Preise',
    navGithub: 'Auf GitHub sternen',
    heroBadge: 'KI-gestütztes Lebenslauf-Roast',
    heroTitle1: 'Lass deinen Lebenslauf',
    heroTitle2: 'von der KI roasten',
    heroSubtitle:
      'Lebenslauf einfügen. Modus wählen. In 10 Sekunden brutal ehrliches Feedback bekommen. Kostenlos, anonym, teilbar.',
    heroCta: 'Jetzt roosten',
    heroSecondary: 'Galerie ansehen',
    inputTitle: 'Lebenslauf einfügen',
    inputSubtitle: 'Füge deinen Lebenslauftext unten ein. Keine Anmeldung nötig.',
    placeholder:
      'Füge hier deinen Lebenslauf ein...\n\nMax Mustermann\nSenior Software Engineer\n\nErfahrung:\n- X mit Y gebaut\n- Team von N geleitet\n...',
    modeLabel: 'Wähl dein Schicksal',
    targetJobLabel: 'Zieljobtitel',
    targetJobPlaceholder: 'z.B. Senior Frontend Engineer bei Stripe',
    makePublicLabel: 'Mein Roast öffentlich machen (anonymer Spitzname)',
    submitBtn: '🔥 Mich roosten',
    submitBtnLoading: 'Wird gerostet...',
    resultTitle: 'Dein Roast ist fertig',
    shareBtn: 'Auf X teilen',
    shareTweetText: 'KI hat meinen Lebenslauf geroastet: „{title}" 🔥\n\nProbier auch:',
    copyBtn: 'Link kopieren',
    copiedBtn: 'Kopiert!',
    newRoastBtn: 'Neues Roast',
    scoreLabel: 'Score',
    burnsLabel: '🔥 Die Burns',
    feedbackLabel: '💼 Echtes Feedback',
    suggestionsLabel: '🎯 So reparierst du es',
    summaryLabel: 'Zusammenfassung',
    galleryTitle: 'Aktuelle öffentliche Roasts',
    galleryEmpty: 'Noch keine öffentlichen Roasts. Sei der Erste!',
    pricingTitle: 'Preise',
    freeTier: 'Kostenlos',
    freePrice: '0€',
    freeFeatures: ['3 Roasts pro Tag', 'Alle 3 Modi', 'Öffentliche Galerie', 'Teilbare Links'],
    proTier: 'Pro',
    proPrice: '5€',
    proPeriod: '/Monat',
    proFeatures: [
      'Unbegrenzte Roasts',
      'PDF-Lebenslauf-Upload',
      'LinkedIn-URL-Import',
      'Anschreiben-Generator',
      'Keine Wasserzeichen',
      'Prioritäts-KI-Modell',
    ],
    proCta: 'Auf Pro upgraden',
    comingSoon: 'Bald verfügbar',
    remaining: 'Roasts heute übrig',
    rateLimited: 'Tageslimit erreicht. Komm morgen wieder!',
    footerMadeBy: 'Gebaut mit 🔥 von Menschen + KI',
    footerNoStore: 'Keine Lebensläufe werden über das Roast-Ergebnis hinaus gespeichert.',
    errorGeneric: 'Etwas ist schiefgelaufen. Versuch es nochmal.',
    errorTooShort: 'Lebenslauf zu kurz. Mindestens 50 Zeichen einfügen.',
    errorTooLong: 'Lebenslauf zu lang. Unter 12000 Zeichen halten.',
    closeBtn: 'Schließen',
    langMenuLabel: 'Sprache',
    signInBtn: 'Anmelden',
    proActiveLabel: 'Pro ist aktiv',
    manageSubscriptionBtn: 'Abo verwalten',
    upgradingBtn: 'Weiterleitung...',
    upgradeSuccessTitle: '🔥 Willkommen bei Pro!',
    upgradeSuccessMsg: 'Du hast jetzt unbegrenzte Roasts. Los geht\'s!',
    proUnlimited: 'Unbegrenzt',
  },
  es: {
    navBrand: 'RoastMy.cv',
    navGallery: 'Galería',
    navPricing: 'Precios',
    navGithub: 'Estrella en GitHub',
    heroBadge: 'Roast de CV con IA',
    heroTitle1: 'Haz que tu CV sea',
    heroTitle2: 'roasteado por IA',
    heroSubtitle:
      'Pega tu CV. Elige tu modo. Obtén feedback brutalmente honesto en 10 segundos. Gratis, anónimo, compartible.',
    heroCta: 'Rostéame ahora',
    heroSecondary: 'Ver galería',
    inputTitle: 'Deja tu CV',
    inputSubtitle: 'Pega el texto de tu CV abajo. Sin registro.',
    placeholder:
      'Pega tu CV aquí...\n\nJuan Pérez\nSenior Software Engineer\n\nExperiencia:\n- Construí X usando Y\n- Lideré equipo de N\n...',
    modeLabel: 'Elige tu destino',
    targetJobLabel: 'Título del puesto objetivo',
    targetJobPlaceholder: 'ej. Senior Frontend Engineer en Stripe',
    makePublicLabel: 'Hacer mi roast público (alias anónimo)',
    submitBtn: '🔥 Rostéame',
    submitBtnLoading: 'Rosteando...',
    resultTitle: 'Tu roast está listo',
    shareBtn: 'Compartir en X',
    shareTweetText: 'La IA roasteó mi CV: "{title}" 🔥\n\nPrueba el tuyo:',
    copyBtn: 'Copiar enlace',
    copiedBtn: '¡Copiado!',
    newRoastBtn: 'Otro roast',
    scoreLabel: 'Puntaje',
    burnsLabel: '🔥 Los Burns',
    feedbackLabel: '💼 Feedback Real',
    suggestionsLabel: '🎯 Arréglalo así',
    summaryLabel: 'Resumen',
    galleryTitle: 'Roasts públicos recientes',
    galleryEmpty: 'Aún no hay roasts públicos. ¡Sé el primero!',
    pricingTitle: 'Precios',
    freeTier: 'Gratis',
    freePrice: '$0',
    freeFeatures: ['3 roasts por día', 'Los 3 modos', 'Galería pública', 'Enlaces compartibles'],
    proTier: 'Pro',
    proPrice: '$5',
    proPeriod: '/mes',
    proFeatures: [
      'Roasts ilimitados',
      'Subir CV en PDF',
      'Importar URL de LinkedIn',
      'Generador de carta de presentación',
      'Sin marcas de agua',
      'Modelo de IA prioritario',
    ],
    proCta: 'Mejorar a Pro',
    comingSoon: 'Próximamente',
    remaining: 'roasts hoy quedan',
    rateLimited: 'Alcanzaste el límite diario. ¡Vuelve mañana!',
    footerMadeBy: 'Hecho con 🔥 por humanos + IA',
    footerNoStore: 'No se almacenan CVs más allá del resultado del roast.',
    errorGeneric: 'Algo salió mal. Inténtalo de nuevo.',
    errorTooShort: 'CV demasiado corto. Pega al menos 50 caracteres.',
    errorTooLong: 'CV demasiado largo. Mantén bajo 12000 caracteres.',
    closeBtn: 'Cerrar',
    langMenuLabel: 'Idioma',
    signInBtn: 'Iniciar sesión',
    proActiveLabel: 'Pro activo',
    manageSubscriptionBtn: 'Gestionar suscripción',
    upgradingBtn: 'Redirigiendo...',
    upgradeSuccessTitle: '🔥 ¡Bienvenido a Pro!',
    upgradeSuccessMsg: 'Ahora tienes roasts ilimitados. ¡A roostear!',
    proUnlimited: 'Ilimitado',
  },
  fr: {
    navBrand: 'RoastMy.cv',
    navGallery: 'Galerie',
    navPricing: 'Tarifs',
    navGithub: 'Étoile sur GitHub',
    heroBadge: 'Roast de CV par IA',
    heroTitle1: 'Fais roaster ton CV',
    heroTitle2: 'par une IA',
    heroSubtitle:
      'Colle ton CV. Choisis ton mode. Reçois un retour brutalement honnête en 10 secondes. Gratuit, anonyme, partageable.',
    heroCta: 'Roast-moi maintenant',
    heroSecondary: 'Voir la galerie',
    inputTitle: 'Dépose ton CV',
    inputSubtitle: 'Colle le texte de ton CV ci-dessous. Sans inscription.',
    placeholder:
      'Colle ton CV ici...\n\nJean Dupont\nSenior Software Engineer\n\nExpérience :\n- Construit X avec Y\n- Dirigé une équipe de N\n...',
    modeLabel: 'Choisis ton destin',
    targetJobLabel: 'Titre du poste visé',
    targetJobPlaceholder: 'ex. Senior Frontend Engineer chez Stripe',
    makePublicLabel: 'Rendre mon roast public (pseudo anonyme)',
    submitBtn: '🔥 Roast-moi',
    submitBtnLoading: 'Roast en cours...',
    resultTitle: 'Ton roast est prêt',
    shareBtn: 'Partager sur X',
    shareTweetText: 'L\'IA a roasté mon CV : « {title} » 🔥\n\nEssaie le tien :',
    copyBtn: 'Copier le lien',
    copiedBtn: 'Copié !',
    newRoastBtn: 'Un autre roast',
    scoreLabel: 'Score',
    burnsLabel: '🔥 Les Burns',
    feedbackLabel: '💼 Vrai Feedback',
    suggestionsLabel: '🎯 Corrige comme ça',
    summaryLabel: 'Résumé',
    galleryTitle: 'Roasts publics récents',
    galleryEmpty: 'Pas encore de roast public. Sois le premier !',
    pricingTitle: 'Tarifs',
    freeTier: 'Gratuit',
    freePrice: '0€',
    freeFeatures: ['3 roasts par jour', 'Les 3 modes', 'Galerie publique', 'Liens partageables'],
    proTier: 'Pro',
    proPrice: '5€',
    proPeriod: '/mois',
    proFeatures: [
      'Roasts illimités',
      'Upload CV en PDF',
      'Import URL LinkedIn',
      'Générateur de lettre de motivation',
      'Sans filigrane',
      'Modèle IA prioritaire',
    ],
    proCta: 'Passer à Pro',
    comingSoon: 'Bientôt disponible',
    remaining: 'roasts restants aujourd\'hui',
    rateLimited: 'Limite quotidienne atteinte. Reviens demain !',
    footerMadeBy: 'Construit avec 🔥 par des humains + IA',
    footerNoStore: 'Aucun CV stocké au-delà du résultat du roast.',
    errorGeneric: 'Quelque chose s\'est mal passé. Réessaie.',
    errorTooShort: 'CV trop court. Colle au moins 50 caractères.',
    errorTooLong: 'CV trop long. Reste sous 12000 caractères.',
    closeBtn: 'Fermer',
    langMenuLabel: 'Langue',
    signInBtn: 'Connexion',
    proActiveLabel: 'Pro actif',
    manageSubscriptionBtn: 'Gérer l\'abonnement',
    upgradingBtn: 'Redirection...',
    upgradeSuccessTitle: '🔥 Bienvenue sur Pro !',
    upgradeSuccessMsg: 'Tu as maintenant des roasts illimités. Lance-toi !',
    proUnlimited: 'Illimité',
  },
  it: {
    navBrand: 'RoastMy.cv',
    navGallery: 'Galleria',
    navPricing: 'Prezzi',
    navGithub: 'Stella su GitHub',
    heroBadge: 'Roast del CV con IA',
    heroTitle1: 'Fai roastare il tuo CV',
    heroTitle2: 'dall\'IA',
    heroSubtitle:
      'Incolla il tuo CV. Scegli la modalità. Ricevi feedback brutalmente onesti in 10 secondi. Gratis, anonimo, condivisibile.',
    heroCta: 'Roastami ora',
    heroSecondary: 'Vedi galleria',
    inputTitle: 'Incolla il tuo CV',
    inputSubtitle: 'Incolla il testo del CV qui sotto. Nessuna registrazione.',
    placeholder:
      'Incolla qui il tuo CV...\n\nMario Rossi\nSenior Software Engineer\n\nEsperienza:\n- Costruito X usando Y\n- Guidato team di N\n...',
    modeLabel: 'Scegli il tuo destino',
    targetJobLabel: 'Titolo della posizione target',
    targetJobPlaceholder: 'es. Senior Frontend Engineer in Stripe',
    makePublicLabel: 'Rendi pubblico il mio roast (nickname anonimo)',
    submitBtn: '🔥 Roastami',
    submitBtnLoading: 'Roast in corso...',
    resultTitle: 'Il tuo roast è pronto',
    shareBtn: 'Condividi su X',
    shareTweetText: 'L\'IA ha roastato il mio CV: "{title}" 🔥\n\nProva il tuo:',
    copyBtn: 'Copia link',
    copiedBtn: 'Copiato!',
    newRoastBtn: 'Un altro roast',
    scoreLabel: 'Punteggio',
    burnsLabel: '🔥 I Burns',
    feedbackLabel: '💼 Feedback Reale',
    suggestionsLabel: '🎯 Correggi così',
    summaryLabel: 'Riassunto',
    galleryTitle: 'Roast pubblici recenti',
    galleryEmpty: 'Nessun roast pubblico ancora. Sii il primo!',
    pricingTitle: 'Prezzi',
    freeTier: 'Gratis',
    freePrice: '0€',
    freeFeatures: ['3 roast al giorno', 'Tutte e 3 le modalità', 'Galleria pubblica', 'Link condivisibili'],
    proTier: 'Pro',
    proPrice: '5€',
    proPeriod: '/mese',
    proFeatures: [
      'Roast illimitati',
      'Upload CV in PDF',
      'Import URL LinkedIn',
      'Generatore di lettera di presentazione',
      'Nessun watermark',
      'Modello IA prioritario',
    ],
    proCta: 'Passa a Pro',
    comingSoon: 'Prossimamente',
    remaining: 'roast rimasti oggi',
    rateLimited: 'Limite giornaliero raggiunto. Torna domani!',
    footerMadeBy: 'Costruito con 🔥 da umani + IA',
    footerNoStore: 'Nessun CV conservato oltre il risultato del roast.',
    errorGeneric: 'Qualcosa è andato storto. Riprova.',
    errorTooShort: 'CV troppo corto. Incolla almeno 50 caratteri.',
    errorTooLong: 'CV troppo lungo. Mantieni sotto 12000 caratteri.',
    closeBtn: 'Chiudi',
    langMenuLabel: 'Lingua',
    signInBtn: 'Accedi',
    proActiveLabel: 'Pro attivo',
    manageSubscriptionBtn: 'Gestisci abbonamento',
    upgradingBtn: 'Reindirizzamento...',
    upgradeSuccessTitle: '🔥 Benvenuto in Pro!',
    upgradeSuccessMsg: 'Ora hai roast illimitati. Inizia!',
    proUnlimited: 'Illimitato',
  },
  pt: {
    navBrand: 'RoastMy.cv',
    navGallery: 'Galeria',
    navPricing: 'Preços',
    navGithub: 'Estrela no GitHub',
    heroBadge: 'Roast de CV com IA',
    heroTitle1: 'Faça o roast do seu CV',
    heroTitle2: 'com IA',
    heroSubtitle:
      'Cole seu CV. Escolha o modo. Receba feedback brutalmente honesto em 10 segundos. Grátis, anônimo, compartilhável.',
    heroCta: 'Rosteie-me agora',
    heroSecondary: 'Ver galeria',
    inputTitle: 'Cole seu CV',
    inputSubtitle: 'Cole o texto do seu CV abaixo. Sem cadastro.',
    placeholder:
      'Cole seu CV aqui...\n\nJoão Silva\nSenior Software Engineer\n\nExperiência:\n- Construí X usando Y\n- Liderei equipe de N\n...',
    modeLabel: 'Escolha seu destino',
    targetJobLabel: 'Título da vaga alvo',
    targetJobPlaceholder: 'ex. Senior Frontend Engineer na Stripe',
    makePublicLabel: 'Tornar meu roast público (apelido anônimo)',
    submitBtn: '🔥 Rosteie-me',
    submitBtnLoading: 'Rosteando...',
    resultTitle: 'Seu roast está pronto',
    shareBtn: 'Compartilhar no X',
    shareTweetText: 'A IA rosteou meu CV: "{title}" 🔥\n\nExperimente o seu:',
    copyBtn: 'Copiar link',
    copiedBtn: 'Copiado!',
    newRoastBtn: 'Outro roast',
    scoreLabel: 'Pontuação',
    burnsLabel: '🔥 Os Burns',
    feedbackLabel: '💼 Feedback Real',
    suggestionsLabel: '🎯 Corrija assim',
    summaryLabel: 'Resumo',
    galleryTitle: 'Roasts públicos recentes',
    galleryEmpty: 'Nenhum roast público ainda. Seja o primeiro!',
    pricingTitle: 'Preços',
    freeTier: 'Grátis',
    freePrice: 'R$0',
    freeFeatures: ['3 roasts por dia', 'Todos os 3 modos', 'Galeria pública', 'Links compartilháveis'],
    proTier: 'Pro',
    proPrice: 'R$25',
    proPeriod: '/mês',
    proFeatures: [
      'Roasts ilimitados',
      'Upload de CV em PDF',
      'Importar URL do LinkedIn',
      'Gerador de carta de apresentação',
      'Sem marca d\'água',
      'Modelo de IA prioritário',
    ],
    proCta: 'Atualizar para Pro',
    comingSoon: 'Em breve',
    remaining: 'roasts restam hoje',
    rateLimited: 'Você atingiu o limite diário. Volte amanhã!',
    footerMadeBy: 'Feito com 🔥 por humanos + IA',
    footerNoStore: 'Nenhum CV é armazenado além do resultado do roast.',
    errorGeneric: 'Algo deu errado. Tente novamente.',
    errorTooShort: 'CV muito curto. Cole pelo menos 50 caracteres.',
    errorTooLong: 'CV muito longo. Mantenha abaixo de 12000 caracteres.',
    closeBtn: 'Fechar',
    langMenuLabel: 'Idioma',
    signInBtn: 'Entrar',
    proActiveLabel: 'Pro ativo',
    manageSubscriptionBtn: 'Gerenciar assinatura',
    upgradingBtn: 'Redirecionando...',
    upgradeSuccessTitle: '🔥 Bem-vindo ao Pro!',
    upgradeSuccessMsg: 'Agora você tem roasts ilimitados. Comece!',
    proUnlimited: 'Ilimitado',
  },
  ru: {
    navBrand: 'RoastMy.cv',
    navGallery: 'Галерея',
    navPricing: 'Цены',
    navGithub: 'Звезда на GitHub',
    heroBadge: 'Рост резюме с ИИ',
    heroTitle1: 'Пусть ИИ',
    heroTitle2: 'ростит твоё резюме',
    heroSubtitle:
      'Вставь резюме. Выбери режим. Получи брутально честный отзыв за 10 секунд. Бесплатно, анонимно, можно поделиться.',
    heroCta: 'Рости меня сейчас',
    heroSecondary: 'Смотреть галерею',
    inputTitle: 'Вставь резюме',
    inputSubtitle: 'Вставь текст резюме ниже. Без регистрации.',
    placeholder:
      'Вставь резюме сюда...\n\nИван Иванов\nSenior Software Engineer\n\nОпыт:\n- Создал X на Y\n- Руководил командой из N\n...',
    modeLabel: 'Выбери свою судьбу',
    targetJobLabel: 'Целевая должность',
    targetJobPlaceholder: 'напр. Senior Frontend Engineer в Stripe',
    makePublicLabel: 'Сделать мой рост публичным (анонимный ник)',
    submitBtn: '🔥 Рости меня',
    submitBtnLoading: 'Ростим...',
    resultTitle: 'Твой рост готов',
    shareBtn: 'Поделиться в X',
    shareTweetText: 'ИИ ростил моё резюме: «{title}» 🔥\n\nПопробуй своё:',
    copyBtn: 'Скопировать ссылку',
    copiedBtn: 'Скопировано!',
    newRoastBtn: 'Ещё рост',
    scoreLabel: 'Оценка',
    burnsLabel: '🔥 Бернсы',
    feedbackLabel: '💼 Реальный отзыв',
    suggestionsLabel: '🎯 Исправь так',
    summaryLabel: 'Сводка',
    galleryTitle: 'Недавние публичные росты',
    galleryEmpty: 'Публичных ростов пока нет. Будь первым!',
    pricingTitle: 'Цены',
    freeTier: 'Бесплатно',
    freePrice: '0₽',
    freeFeatures: ['3 роста в день', 'Все 3 режима', 'Публичная галерея', 'Делимые ссылки'],
    proTier: 'Pro',
    proPrice: '₽400',
    proPeriod: '/мес',
    proFeatures: [
      'Безлимитные росты',
      'Загрузка PDF резюме',
      'Импорт URL LinkedIn',
      'Генератор сопроводительного письма',
      'Без водяных знаков',
      'Приоритетная модель ИИ',
    ],
    proCta: 'Перейти на Pro',
    comingSoon: 'Скоро',
    remaining: 'ростов осталось сегодня',
    rateLimited: 'Дневной лимит достигнут. Возвращайся завтра!',
    footerMadeBy: 'Сделано с 🔥 людьми + ИИ',
    footerNoStore: 'Резюме не хранятся дольше результата роста.',
    errorGeneric: 'Что-то пошло не так. Попробуй снова.',
    errorTooShort: 'Резюме слишком короткое. Вставь минимум 50 символов.',
    errorTooLong: 'Резюме слишком длинное. Сократи до 12000 символов.',
    closeBtn: 'Закрыть',
    langMenuLabel: 'Язык',
    signInBtn: 'Войти',
    proActiveLabel: 'Pro активен',
    manageSubscriptionBtn: 'Управление подпиской',
    upgradingBtn: 'Перенаправление...',
    upgradeSuccessTitle: '🔥 Добро пожаловать в Pro!',
    upgradeSuccessMsg: 'Теперь у вас безлимитные росты. Начинайте!',
    proUnlimited: 'Безлимит',
  },
  nl: {
    navBrand: 'RoastMy.cv',
    navGallery: 'Galerij',
    navPricing: 'Prijzen',
    navGithub: 'Ster op GitHub',
    heroBadge: 'AI-gedreven CV-roast',
    heroTitle1: 'Laat je CV',
    heroTitle2: 'roasten door AI',
    heroSubtitle:
      'Plak je CV. Kies je modus. Krijg brutaal eerlijke feedback in 10 seconden. Gratis, anoniem, deelbaar.',
    heroCta: 'Roast me nu',
    heroSecondary: 'Bekijk galerij',
    inputTitle: 'Plak je CV',
    inputSubtitle: 'Plak je CV-tekst hieronder. Geen registratie.',
    placeholder:
      'Plak je CV hier...\n\nJan Jansen\nSenior Software Engineer\n\nErvaring:\n- Bouwde X met Y\n- Leidde team van N\n...',
    modeLabel: 'Kies je lot',
    targetJobLabel: 'Doelfunctie',
    targetJobPlaceholder: 'bijv. Senior Frontend Engineer bij Stripe',
    makePublicLabel: 'Maak mijn roast openbaar (anonieme bijnaam)',
    submitBtn: '🔥 Roast me',
    submitBtnLoading: 'Roasten...',
    resultTitle: 'Je roast is klaar',
    shareBtn: 'Delen op X',
    shareTweetText: 'AI roastte mijn CV: "{title}" 🔥\n\nProbeer de jouwe:',
    copyBtn: 'Link kopiëren',
    copiedBtn: 'Gekopieerd!',
    newRoastBtn: 'Nog een roast',
    scoreLabel: 'Score',
    burnsLabel: '🔥 De Burns',
    feedbackLabel: '💼 Echte Feedback',
    suggestionsLabel: '🎯 Repareer zo',
    summaryLabel: 'Samenvatting',
    galleryTitle: 'Recente openbare roasts',
    galleryEmpty: 'Nog geen openbare roasts. Wees de eerste!',
    pricingTitle: 'Prijzen',
    freeTier: 'Gratis',
    freePrice: '€0',
    freeFeatures: ['3 roasts per dag', 'Alle 3 modi', 'Openbare galerij', 'Deelbare links'],
    proTier: 'Pro',
    proPrice: '€5',
    proPeriod: '/maand',
    proFeatures: [
      'Onbeperkte roasts',
      'PDF-CV-upload',
      'LinkedIn-URL import',
      'Motivatiebrief-generator',
      'Geen watermerken',
      'Prioriteits-AI-model',
    ],
    proCta: 'Upgrade naar Pro',
    comingSoon: 'Binnenkort',
    remaining: 'roasts over vandaag',
    rateLimited: 'Daglimiet bereikt. Kom morgen terug!',
    footerMadeBy: 'Gebouwd met 🔥 door mensen + AI',
    footerNoStore: 'Geen CVs opgeslagen buiten het roast-resultaat.',
    errorGeneric: 'Er ging iets mis. Probeer opnieuw.',
    errorTooShort: 'CV te kort. Plak minstens 50 tekens.',
    errorTooLong: 'CV te lang. Houd onder 12000 tekens.',
    closeBtn: 'Sluiten',
    langMenuLabel: 'Taal',
    signInBtn: 'Inloggen',
    proActiveLabel: 'Pro actief',
    manageSubscriptionBtn: 'Abonnement beheren',
    upgradingBtn: 'Doorsturen...',
    upgradeSuccessTitle: '🔥 Welkom bij Pro!',
    upgradeSuccessMsg: 'Je hebt nu onbeperkte roasts. Begin maar!',
    proUnlimited: 'Onbeperkt',
  },
  zh: {
    navBrand: 'RoastMy.cv',
    navGallery: '画廊',
    navPricing: '价格',
    navGithub: '在 GitHub 上加星',
    heroBadge: 'AI 简历吐槽',
    heroTitle1: '让你的简历',
    heroTitle2: '被 AI 吐槽',
    heroSubtitle:
      '粘贴你的简历。选择模式。10 秒内获得残酷诚实的反馈。免费、匿名、可分享。',
    heroCta: '现在吐槽我',
    heroSecondary: '看画廊',
    inputTitle: '粘贴你的简历',
    inputSubtitle: '在下方粘贴简历文本。无需注册。',
    placeholder:
      '把简历粘贴到这里...\n\n张三\n高级软件工程师\n\n经历：\n- 用 Y 构建了 X\n- 带领 N 人团队\n...',
    modeLabel: '选择你的命运',
    targetJobLabel: '目标职位',
    targetJobPlaceholder: '例如：Stripe 高级前端工程师',
    makePublicLabel: '公开我的吐槽（匿名昵称）',
    submitBtn: '🔥 吐槽我',
    submitBtnLoading: '吐槽中...',
    resultTitle: '你的吐槽已就绪',
    shareBtn: '分享到 X',
    shareTweetText: 'AI 吐槽了我的简历："{title}" 🔥\n\n试试你的：',
    copyBtn: '复制链接',
    copiedBtn: '已复制！',
    newRoastBtn: '再吐槽一次',
    scoreLabel: '分数',
    burnsLabel: '🔥 燃烧',
    feedbackLabel: '💼 真实反馈',
    suggestionsLabel: '🎯 这样修正',
    summaryLabel: '摘要',
    galleryTitle: '最近的公开吐槽',
    galleryEmpty: '还没有公开吐槽。成为第一个！',
    pricingTitle: '价格',
    freeTier: '免费',
    freePrice: '¥0',
    freeFeatures: ['每天 3 次吐槽', '全部 3 种模式', '公开画廊', '可分享链接'],
    proTier: '专业版',
    proPrice: '¥35',
    proPeriod: '/月',
    proFeatures: [
      '无限吐槽',
      'PDF 简历上传',
      'LinkedIn URL 导入',
      '求职信生成器',
      '无水印',
      '优先 AI 模型',
    ],
    proCta: '升级到专业版',
    comingSoon: '即将推出',
    remaining: '今日剩余',
    rateLimited: '已达每日上限。明天再来！',
    footerMadeBy: '由人类 + AI 用 🔥 打造',
    footerNoStore: '除吐槽结果外不存储简历。',
    errorGeneric: '出错了。请重试。',
    errorTooShort: '简历太短。至少粘贴 50 个字符。',
    errorTooLong: '简历太长。请控制在 12000 字符以内。',
    closeBtn: '关闭',
    langMenuLabel: '语言',
    signInBtn: '登录',
    proActiveLabel: '专业版已激活',
    manageSubscriptionBtn: '管理订阅',
    upgradingBtn: '正在跳转...',
    upgradeSuccessTitle: '🔥 欢迎升级专业版！',
    upgradeSuccessMsg: '你现在拥有无限吐槽次数。开始吧！',
    proUnlimited: '无限',
  },
};

// ============ LANGUAGE HELPERS ============
const BROWSER_LANG_MAP: Record<string, Language> = {
  en: 'en',
  'en-us': 'en',
  'en-gb': 'en',
  tr: 'tr',
  'tr-tr': 'tr',
  de: 'de',
  'de-de': 'de',
  'de-at': 'de',
  'de-ch': 'de',
  es: 'es',
  'es-es': 'es',
  'es-419': 'es',
  'es-mx': 'es',
  fr: 'fr',
  'fr-fr': 'fr',
  'fr-ca': 'fr',
  it: 'it',
  'it-it': 'it',
  pt: 'pt',
  'pt-br': 'pt',
  'pt-pt': 'pt',
  ru: 'ru',
  'ru-ru': 'ru',
  nl: 'nl',
  'nl-nl': 'nl',
  'nl-be': 'nl',
  zh: 'zh',
  'zh-cn': 'zh',
  'zh-tw': 'zh',
  'zh-hk': 'zh',
};

export function detectLanguageFromBrowser(): Language {
  if (typeof navigator === 'undefined') return 'en';
  const raw = (navigator.language || 'en').toLowerCase();
  // Try exact match first
  if (BROWSER_LANG_MAP[raw]) return BROWSER_LANG_MAP[raw];
  // Fall back to prefix match
  const prefix = raw.split('-')[0];
  if (BROWSER_LANG_MAP[prefix]) return BROWSER_LANG_MAP[prefix];
  return 'en';
}

export function normalizeLanguage(input: string | undefined | null): Language {
  if (!input) return 'en';
  const lower = input.toLowerCase();
  if (BROWSER_LANG_MAP[lower]) return BROWSER_LANG_MAP[lower];
  const prefix = lower.split('-')[0];
  if (BROWSER_LANG_MAP[prefix]) return BROWSER_LANG_MAP[prefix];
  return 'en';
}
