'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, Github, Sparkles, Copy, Check, Twitter, ArrowRight, Zap, Lock, Globe, Star, ChevronDown, Loader2, Wand2, Check as CheckIcon, Crown, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import {
  UI_TEXT,
  MODE_META,
  LANGUAGES,
  detectLanguageFromBrowser,
  normalizeLanguage,
  type RoastMode,
  type Language,
  type RoastResponse,
  type GalleryItem,
} from '@/lib/roast-types';

export default function Home() {
  // ============ STATE ============
  const [lang, setLang] = useState<Language>('en');
  const [resumeText, setResumeText] = useState('');
  const [mode, setMode] = useState<RoastMode>('roast');
  const [targetJob, setTargetJob] = useState('');
  const [makePublic, setMakePublic] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [roast, setRoast] = useState<RoastResponse | null>(null);
  const [remaining, setRemaining] = useState<number | null>(null);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [galleryLoading, setGalleryLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [showPricing, setShowPricing] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [upgrading, setUpgrading] = useState(false);
  const [showUpgradeSuccess, setShowUpgradeSuccess] = useState(false);

  const { data: session, status } = useSession();
  const isPro = (session?.user as { plan?: string } | undefined)?.plan === 'pro';
  const isAuthenticated = status === 'authenticated' && !!session?.user;

  const inputRef = useRef<HTMLTextAreaElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);
  const t = UI_TEXT[lang];

  // ============ EFFECTS ============
  useEffect(() => {
    // Detect language from browser (supports 10 languages)
    setLang(detectLanguageFromBrowser());
  }, []);

  // Close lang menu on outside click
  useEffect(() => {
    if (!langMenuOpen) return;
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('[data-lang-menu]')) setLangMenuOpen(false);
    };
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, [langMenuOpen]);

  useEffect(() => {
    // Load gallery on mount
    setGalleryLoading(true);
    fetch('/api/gallery')
      .then((r) => r.json())
      .then((data) => setGallery(data.roasts || []))
      .catch(() => setGallery([]))
      .finally(() => setGalleryLoading(false));
  }, []);

  useEffect(() => {
    // Check URL hash for shared roast
    const hash = window.location.hash;
    if (hash.startsWith('#/r/')) {
      const slug = hash.replace('#/r/', '');
      loadSharedRoast(slug);
    }
  }, []);

  useEffect(() => {
    if (roast && resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [roast]);

  // ============ ACTIONS ============
  const loadSharedRoast = useCallback(async (slug: string) => {
    try {
      const res = await fetch(`/api/roast/${slug}`);
      if (!res.ok) return;
      const data = await res.json();
      setRoast({
        id: data.id,
        slug: data.slug,
        isPublic: data.isPublic,
        nickname: data.nickname,
        createdAt: data.createdAt,
        result: data.result,
        remaining: -1,
      });
      setLang(data.language ? (normalizeLanguage(data.language)) : 'en');
    } catch {}
  }, []);

  const handleSubmit = async () => {
    setError('');
    if (resumeText.trim().length < 50) {
      setError(t.errorGeneric);
      return;
    }
    setLoading(true);
    setRoast(null);
    try {
      const res = await fetch('/api/roast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resumeText,
          mode,
          language: lang,
          targetJob: mode === 'jobmatch' ? targetJob : undefined,
          makePublic,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || t.errorGeneric);
        if (res.status === 429) setRemaining(0);
        return;
      }
      setRoast(data);
      setRemaining(data.remaining);
      // Refresh gallery
      fetch('/api/gallery')
        .then((r) => r.json())
        .then((d) => setGallery(d.roasts || []));
    } catch {
      setError(t.errorGeneric);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!roast) return;
    const url = `${window.location.origin}/#/r/${roast.slug}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  const handleShare = () => {
    if (!roast) return;
    const url = `${window.location.origin}/#/r/${roast.slug}`;
    const text = t.shareTweetText.replace('{title}', roast.result.title);
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      '_blank'
    );
  };

  const handleNewRoast = () => {
    setRoast(null);
    setResumeText('');
    setError('');
    inputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // ============ STRIPE: Upgrade to Pro ============
  const handleUpgrade = async () => {
    if (!isAuthenticated) {
      // Sign in first, then they can upgrade
      await signIn('google', { callbackUrl: '/?upgrade=1' });
      return;
    }
    if (isPro) return;
    setUpgrading(true);
    try {
      const res = await fetch('/api/stripe/checkout', { method: 'POST' });
      const data = await res.json();
      if (!res.ok || !data.url) {
        throw new Error(data.error || 'Failed to start checkout');
      }
      window.location.href = data.url;
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Unknown error';
      alert(`Upgrade failed: ${msg}`);
    } finally {
      setUpgrading(false);
    }
  };

  // ============ Stripe Customer Portal (manage subscription) ============
  const handleManageSubscription = async () => {
    try {
      const res = await fetch('/api/stripe/portal', { method: 'POST' });
      const data = await res.json();
      if (!res.ok || !data.url) throw new Error(data.error || 'Failed');
      window.location.href = data.url;
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Unknown error';
      alert(`Failed: ${msg}`);
    }
  };

  // Detect ?upgraded=1 in URL after successful checkout
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('upgraded') === '1') {
      setShowUpgradeSuccess(true);
      // Clean URL
      window.history.replaceState({}, '', '/');
      // Refresh session to pick up new plan
      window.location.reload();
    }
  }, []);

  const scrollToInput = () => {
    inputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const scrollToGallery = () => {
    galleryRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // ============ RENDER ============
  return (
    <div className="min-h-screen flex flex-col bg-neutral-950 text-neutral-100">
      <Background />
      {/* NAV */}
      <header className="sticky top-0 z-30 backdrop-blur-xl bg-neutral-950/70 border-b border-neutral-800/60">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold">
            <span className="text-xl">🔥</span>
            <span className="tracking-tight">{t.navBrand}</span>
          </div>
          <nav className="flex items-center gap-2 sm:gap-4">
            <button
              onClick={scrollToGallery}
              className="text-sm text-neutral-400 hover:text-neutral-100 transition px-2 py-1"
            >
              {t.navGallery}
            </button>
            <button
              onClick={() => setShowPricing(true)}
              className="text-sm text-neutral-400 hover:text-neutral-100 transition px-2 py-1"
            >
              {t.navPricing}
            </button>
            {/* LANGUAGE PICKER */}
            <div className="relative" data-lang-menu>
              <button
                onClick={() => setLangMenuOpen((v) => !v)}
                className="flex items-center gap-1 text-sm text-neutral-400 hover:text-neutral-100 transition px-2 py-1 rounded-md hover:bg-neutral-900/60"
                aria-label={t.langMenuLabel}
              >
                <Globe size={14} />
                <span className="uppercase">{lang}</span>
                <ChevronDown size={12} className={`transition ${langMenuOpen ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {langMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-44 rounded-lg border border-neutral-800 bg-neutral-950/95 backdrop-blur-xl shadow-2xl shadow-black/60 py-1 z-50"
                  >
                    {LANGUAGES.map((l) => {
                      const active = lang === l.code;
                      return (
                        <button
                          key={l.code}
                          onClick={() => {
                            setLang(l.code);
                            setLangMenuOpen(false);
                          }}
                          className={`w-full flex items-center gap-2 px-3 py-2 text-sm transition ${
                            active
                              ? 'text-orange-400 bg-orange-500/10'
                              : 'text-neutral-300 hover:bg-neutral-900 hover:text-white'
                          }`}
                        >
                          <span className="text-base">{l.flag}</span>
                          <span className="flex-1 text-left">{l.nativeName}</span>
                          {active && <CheckIcon size={14} />}
                        </button>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <a
              href="https://github.com/titkenan/roastmy-cv"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1 text-sm text-neutral-400 hover:text-neutral-100 transition px-2 py-1"
            >
              <Github size={14} />
              <Star size={12} />
            </a>
            {/* AUTH AREA */}
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                {isPro && (
                  <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white border-0 text-[10px] px-2 py-0.5">
                    <Crown size={10} className="mr-1" /> PRO
                  </Badge>
                )}
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="flex items-center gap-1.5 text-xs text-neutral-400 hover:text-neutral-100 transition px-2 py-1 rounded-md hover:bg-neutral-900/60"
                  title={session?.user?.email || ''}
                >
                  {session?.user?.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={session.user.image}
                      alt=""
                      className="w-5 h-5 rounded-full"
                    />
                  ) : (
                    <span className="w-5 h-5 rounded-full bg-neutral-700 flex items-center justify-center text-[10px] font-bold">
                      {(session?.user?.name || '?').charAt(0).toUpperCase()}
                    </span>
                  )}
                  <LogOut size={12} className="hidden sm:block" />
                </button>
              </div>
            ) : (
              <Button
                onClick={() => signIn('google', { callbackUrl: '/' })}
                size="sm"
                variant="ghost"
                className="text-xs text-neutral-300 hover:text-white hover:bg-neutral-900/60 px-2 py-1 h-auto"
              >
                {t.signInBtn}
              </Button>
            )}
          </nav>
        </div>
      </header>

      {/* HERO */}
      <section className="relative z-10 px-4 sm:px-6 pt-16 sm:pt-24 pb-12">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge className="mb-6 bg-orange-500/10 text-orange-400 border-orange-500/30 hover:bg-orange-500/20">
              <Sparkles size={12} className="mr-1" />
              {t.heroBadge}
            </Badge>
          </motion.div>
          <motion.h1
            className="text-5xl sm:text-7xl font-black tracking-tight leading-[0.95] mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <span className="text-neutral-100">{t.heroTitle1}</span>
            <br />
            <span className="bg-gradient-to-r from-orange-400 via-red-500 to-orange-400 bg-clip-text text-transparent">
              {t.heroTitle2}
            </span>
          </motion.h1>
          <motion.p
            className="text-base sm:text-lg text-neutral-400 max-w-2xl mx-auto mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {t.heroSubtitle}
          </motion.p>
          <motion.div
            className="flex flex-col sm:flex-row gap-3 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Button
              size="lg"
              onClick={scrollToInput}
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-400 hover:to-red-400 text-white border-0 shadow-lg shadow-orange-500/30 px-8 text-base"
            >
              <Flame size={18} className="mr-2" />
              {t.heroCta}
              <ArrowRight size={16} className="ml-2" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={scrollToGallery}
              className="bg-neutral-900/50 border-neutral-800 text-neutral-300 hover:bg-neutral-800 hover:text-white px-8 text-base"
            >
              {t.heroSecondary}
            </Button>
          </motion.div>

          {/* Social proof */}
          <motion.div
            className="mt-12 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-xs text-neutral-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <div className="flex items-center gap-1.5">
              <div className="flex -space-x-1.5">
                {['🔥', '💀', '🤡', '🌶️', '⚡'].map((e, i) => (
                  <div
                    key={i}
                    className="w-6 h-6 rounded-full bg-neutral-800 border border-neutral-700 flex items-center justify-center text-xs"
                  >
                    {e}
                  </div>
                ))}
              </div>
              <span>10,000+ roasts served</span>
            </div>
            <div className="flex items-center gap-1">
              <Star size={12} className="fill-yellow-500 text-yellow-500" />
              <Star size={12} className="fill-yellow-500 text-yellow-500" />
              <Star size={12} className="fill-yellow-500 text-yellow-500" />
              <Star size={12} className="fill-yellow-500 text-yellow-500" />
              <Star size={12} className="fill-yellow-500 text-yellow-500" />
              <span>4.9/5 from devs</span>
            </div>
            <div className="flex items-center gap-1">
              <Lock size={12} />
              <span>Anonymous & free</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* INPUT SECTION */}
      <section className="relative z-10 px-4 sm:px-6 pb-12" ref={inputRef}>
        <div className="max-w-3xl mx-auto">
          <Card className="bg-neutral-900/60 backdrop-blur border-neutral-800 p-6 sm:p-8 shadow-2xl shadow-orange-500/5">
            <div className="mb-6">
              <h2 className="text-2xl sm:text-3xl font-bold mb-1">{t.inputTitle}</h2>
              <p className="text-sm text-neutral-500">{t.inputSubtitle}</p>
            </div>

            {/* MODE PICKER */}
            <div className="mb-6">
              <Label className="text-sm font-medium text-neutral-300 mb-3 block">{t.modeLabel}</Label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {(Object.keys(MODE_META) as RoastMode[]).map((m) => {
                  const meta = MODE_META[m];
                  const active = mode === m;
                  return (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setMode(m)}
                      className={`relative text-left p-3 rounded-lg border transition-all ${
                        active
                          ? 'border-orange-500/60 bg-orange-500/10'
                          : 'border-neutral-800 bg-neutral-950/40 hover:border-neutral-700'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xl">{meta.emoji}</span>
                        <span className="font-semibold text-sm">{meta.label[lang]}</span>
                      </div>
                      <p className="text-xs text-neutral-500 leading-snug">{meta.tagline[lang]}</p>
                      {active && (
                        <motion.div
                          layoutId="mode-active"
                          className="absolute inset-0 rounded-lg ring-2 ring-orange-500/40 pointer-events-none"
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* TARGET JOB (only for jobmatch) */}
            <AnimatePresence>
              {mode === 'jobmatch' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-6 overflow-hidden"
                >
                  <Label htmlFor="target-job" className="text-sm font-medium text-neutral-300 mb-2 block">
                    {t.targetJobLabel}
                  </Label>
                  <Input
                    id="target-job"
                    value={targetJob}
                    onChange={(e) => setTargetJob(e.target.value)}
                    placeholder={t.targetJobPlaceholder}
                    className="bg-neutral-950/60 border-neutral-800 focus:border-orange-500/60"
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* RESUME INPUT */}
            <div className="mb-4">
              <Textarea
                ref={inputRef}
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                placeholder={t.placeholder}
                className="min-h-[200px] sm:min-h-[260px] bg-neutral-950/60 border-neutral-800 focus:border-orange-500/60 font-mono text-sm resize-y leading-relaxed"
              />
              <div className="flex justify-between mt-1 text-xs text-neutral-600">
                <span>{resumeText.length} / 12000</span>
                {remaining !== null && remaining >= 0 && (
                  <span className={remaining === 0 ? 'text-red-400' : 'text-neutral-500'}>
                    {remaining} {t.remaining}
                  </span>
                )}
              </div>
            </div>

            {/* PUBLIC SWITCH */}
            <div className="mb-6 flex items-center gap-3">
              <Switch
                id="public"
                checked={makePublic}
                onCheckedChange={setMakePublic}
                className="data-[state=checked]:bg-orange-500"
              />
              <Label htmlFor="public" className="text-sm text-neutral-400 cursor-pointer">
                {t.makePublicLabel}
              </Label>
            </div>

            {/* ERROR */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-3 rounded-md bg-red-500/10 border border-red-500/30 text-red-400 text-sm"
              >
                {error}
              </motion.div>
            )}

            {/* SUBMIT */}
            <Button
              onClick={handleSubmit}
              disabled={loading || resumeText.trim().length < 50}
              size="lg"
              className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-400 hover:to-red-400 text-white border-0 shadow-lg shadow-orange-500/20 disabled:opacity-50 disabled:shadow-none text-base font-semibold"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="mr-2 animate-spin" />
                  {t.submitBtnLoading}
                </>
              ) : (
                <>
                  <Wand2 size={18} className="mr-2" />
                  {t.submitBtn}
                </>
              )}
            </Button>
          </Card>
        </div>
      </section>

      {/* RESULT */}
      <AnimatePresence>
        {roast && (
          <section ref={resultRef} className="relative z-10 px-4 sm:px-6 pb-12 scroll-mt-16">
            <div className="max-w-3xl mx-auto">
              <RoastResultCard roast={roast} t={t} onShare={handleShare} onCopy={handleCopy} onNew={handleNewRoast} copied={copied} />
            </div>
          </section>
        )}
      </AnimatePresence>

      {/* GALLERY */}
      <section ref={galleryRef} className="relative z-10 px-4 sm:px-6 pb-16 scroll-mt-16">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-baseline justify-between mb-6">
            <h2 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
              <Globe size={24} className="text-orange-400" />
              {t.galleryTitle}
            </h2>
          </div>
          {galleryLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-44 rounded-lg bg-neutral-900/50 animate-pulse border border-neutral-800/60" />
              ))}
            </div>
          ) : gallery.length === 0 ? (
            <Card className="bg-neutral-900/40 border-neutral-800 p-12 text-center">
              <p className="text-neutral-500">{t.galleryEmpty}</p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {gallery.map((item, i) => (
                <GalleryCard key={item.id} item={item} onClick={() => loadSharedRoast(item.slug)} index={i} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* PRICING (inline at bottom) */}
      <section className="relative z-10 px-4 sm:px-6 pb-16 border-t border-neutral-800/60 pt-12">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8">{t.pricingTitle}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* FREE */}
            <Card className="bg-neutral-900/40 border-neutral-800 p-6">
              <div className="text-sm text-neutral-500 mb-1">{t.freeTier}</div>
              <div className="text-4xl font-bold mb-4">{t.freePrice}<span className="text-base font-normal text-neutral-500">/mo</span></div>
              <ul className="space-y-2 text-sm text-neutral-400">
                {t.freeFeatures.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <Check size={14} className="text-green-500 mt-0.5 shrink-0" /> {f}
                  </li>
                ))}
              </ul>
            </Card>
            {/* PRO */}
            <Card className="relative bg-gradient-to-br from-orange-500/10 to-red-500/5 border-orange-500/30 p-6 overflow-hidden">
              <Badge className="absolute top-3 right-3 bg-orange-500 text-white">PRO</Badge>
              <div className="text-sm text-orange-400 mb-1">{t.proTier}</div>
              <div className="text-4xl font-bold mb-1">
                {t.proPrice}<span className="text-base font-normal text-neutral-500">{t.proPeriod}</span>
              </div>
              {isPro ? (
                <div className="text-xs text-green-400 mb-4 flex items-center gap-1">
                  <Check size={12} /> {t.proActiveLabel}
                </div>
              ) : (
                <div className="text-xs text-green-400 mb-4 flex items-center gap-1">
                  <Check size={12} /> {t.proAvailability}
                </div>
              )}
              <ul className="space-y-2 text-sm text-neutral-300">
                {t.proFeatures.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <Zap size={14} className="text-orange-400 mt-0.5 shrink-0" /> {f}
                  </li>
                ))}
              </ul>
              {isPro ? (
                <Button
                  onClick={handleManageSubscription}
                  variant="outline"
                  className="w-full mt-5 bg-neutral-900 border-neutral-700 hover:bg-neutral-800 text-neutral-300"
                >
                  {t.manageSubscriptionBtn}
                </Button>
              ) : (
                <Button
                  onClick={handleUpgrade}
                  disabled={upgrading}
                  className="w-full mt-5 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-400 hover:to-red-400 text-white border-0 shadow-lg shadow-orange-500/30 disabled:opacity-60"
                >
                  {upgrading ? (
                    <>
                      <Loader2 size={16} className="mr-2 animate-spin" />
                      {t.upgradingBtn}
                    </>
                  ) : (
                    <>
                      <Crown size={16} className="mr-2" />
                      {t.proCta}
                    </>
                  )}
                </Button>
              )}
            </Card>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="mt-auto border-t border-neutral-800/60 py-6 px-4 sm:px-6 text-center text-xs text-neutral-600">
        <p>{t.footerMadeBy}</p>
        <p className="mt-1">© 2026 {t.navBrand}. No resumes are stored beyond the roast result.</p>
      </footer>

      {/* PRICING MODAL (mobile) */}
      <AnimatePresence>
        {showPricing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowPricing(false)}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="max-w-md w-full"
            >
              <Card className="bg-neutral-900 border-neutral-800 p-6">
                <div className="text-sm text-orange-400 mb-1">{t.proTier}</div>
                <div className="text-4xl font-bold mb-1">
                  {t.proPrice}<span className="text-base font-normal text-neutral-500">{t.proPeriod}</span>
                </div>
                {isPro ? (
                  <div className="text-xs text-green-400 mb-4 flex items-center gap-1">
                    <Check size={12} /> {t.proActiveLabel}
                  </div>
                ) : (
                  <div className="text-xs text-green-400 mb-4 flex items-center gap-1">
                    <Check size={12} /> {t.proAvailability}
                  </div>
                )}
                <ul className="space-y-2 text-sm text-neutral-300 mb-4">
                  {t.proFeatures.map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <Zap size={14} className="text-orange-400 mt-0.5 shrink-0" /> {f}
                    </li>
                  ))}
                </ul>
                {isPro ? (
                  <Button
                    onClick={handleManageSubscription}
                    variant="outline"
                    className="w-full bg-neutral-900 border-neutral-700 hover:bg-neutral-800 text-neutral-300"
                  >
                    {t.manageSubscriptionBtn}
                  </Button>
                ) : (
                  <Button
                    onClick={() => {
                      setShowPricing(false);
                      handleUpgrade();
                    }}
                    disabled={upgrading}
                    className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-400 hover:to-red-400 text-white border-0"
                  >
                    {upgrading ? (
                      <>
                        <Loader2 size={16} className="mr-2 animate-spin" />
                        {t.upgradingBtn}
                      </>
                    ) : (
                      <>
                        <Crown size={16} className="mr-2" />
                        {t.proCta}
                      </>
                    )}
                  </Button>
                )}
                <Button variant="ghost" onClick={() => setShowPricing(false)} className="w-full mt-2 text-neutral-500">
                  {t.closeBtn}
                </Button>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ============ SUB-COMPONENTS ============

function Background() {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl" />
      <div className="absolute top-1/3 -left-40 w-96 h-96 bg-red-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl" />
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage:
            'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'40\' height=\'40\'%3E%3Cpath d=\'M0 0h40v40H0z\' fill=\'none\'/%3E%3Cpath d=\'M0 0h1v40H0zM0 0h40v1H0z\' fill=\'%23ffffff\'/%3E%3C/svg%3E")',
        }}
      />
    </div>
  );
}

function RoastResultCard({
  roast,
  t,
  onShare,
  onCopy,
  onNew,
  copied,
}: {
  roast: RoastResponse;
  t: (typeof UI_TEXT)['en'];
  onShare: () => void;
  onCopy: () => void;
  onNew: () => void;
  copied: boolean;
}) {
  const r = roast.result;
  const scoreColor = r.score >= 70 ? 'text-green-400' : r.score >= 40 ? 'text-orange-400' : 'text-red-400';
  const scoreRing = r.score >= 70 ? 'stroke-green-400' : r.score >= 40 ? 'stroke-orange-400' : 'stroke-red-400';
  const circumference = 2 * Math.PI * 42;
  const offset = circumference - (Math.max(0, Math.min(100, r.score)) / 100) * circumference;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="bg-neutral-900/70 backdrop-blur border-neutral-800 p-6 sm:p-8 shadow-2xl shadow-orange-500/10 relative overflow-hidden">
        {/* Glow */}
        <div className="absolute -top-20 -right-20 w-60 h-60 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative">
          {/* Title + score */}
          <div className="flex items-start gap-4 mb-6">
            <div className="flex-shrink-0 relative w-24 h-24 flex items-center justify-center">
              <svg className="absolute inset-0 -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="42" fill="none" strokeWidth="6" className="stroke-neutral-800" />
                <motion.circle
                  cx="50"
                  cy="50"
                  r="42"
                  fill="none"
                  strokeWidth="6"
                  strokeLinecap="round"
                  className={scoreRing}
                  strokeDasharray={circumference}
                  initial={{ strokeDashoffset: circumference }}
                  animate={{ strokeDashoffset: offset }}
                  transition={{ duration: 1.2, ease: 'easeOut' }}
                />
              </svg>
              <div className="text-center">
                <div className={`text-3xl font-black ${scoreColor}`}>{r.score}</div>
                <div className="text-[10px] text-neutral-500 uppercase tracking-wider">{t.scoreLabel}</div>
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-4xl mb-1">{r.emoji}</div>
              <h3 className="text-xl sm:text-2xl font-bold leading-tight">{r.title}</h3>
              {roast.nickname && (
                <p className="text-xs text-neutral-500 mt-1">
                  — {roast.nickname}
                </p>
              )}
            </div>
          </div>

          {/* Summary */}
          <div className="mb-6 p-4 rounded-lg bg-neutral-950/60 border border-neutral-800/60">
            <div className="text-xs uppercase tracking-wider text-neutral-500 mb-1">{t.summaryLabel}</div>
            <p className="text-sm text-neutral-300 leading-relaxed">{r.summary}</p>
          </div>

          {/* Burns */}
          {r.burns?.length > 0 && (
            <div className="mb-6">
              <h4 className="text-sm font-bold uppercase tracking-wider text-orange-400 mb-2 flex items-center gap-2">
                <Flame size={14} /> {t.burnsLabel}
              </h4>
              <ul className="space-y-2">
                {r.burns.map((b, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + i * 0.08 }}
                    className="text-sm text-neutral-300 flex items-start gap-2 p-3 rounded-md bg-orange-500/5 border border-orange-500/10"
                  >
                    <span className="text-orange-400 shrink-0">🔥</span>
                    <span>{b}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          )}

          {/* Feedback */}
          {r.feedback?.length > 0 && (
            <div className="mb-6">
              <h4 className="text-sm font-bold uppercase tracking-wider text-blue-400 mb-2 flex items-center gap-2">
                💼 {t.feedbackLabel}
              </h4>
              <ul className="space-y-2">
                {r.feedback.map((b, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + i * 0.06 }}
                    className="text-sm text-neutral-300 flex items-start gap-2 p-3 rounded-md bg-blue-500/5 border border-blue-500/10"
                  >
                    <span className="text-blue-400 shrink-0">▸</span>
                    <span>{b}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          )}

          {/* Suggestions */}
          {r.suggestions?.length > 0 && (
            <div className="mb-6">
              <h4 className="text-sm font-bold uppercase tracking-wider text-green-400 mb-2 flex items-center gap-2">
                🎯 {t.suggestionsLabel}
              </h4>
              <ul className="space-y-2">
                {r.suggestions.map((b, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + i * 0.06 }}
                    className="text-sm text-neutral-300 flex items-start gap-2 p-3 rounded-md bg-green-500/5 border border-green-500/10"
                  >
                    <span className="text-green-400 shrink-0">→</span>
                    <span>{b}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-wrap gap-2 pt-4 border-t border-neutral-800/60">
            <Button
              onClick={onShare}
              size="sm"
              className="bg-neutral-100 text-neutral-950 hover:bg-white"
            >
              <Twitter size={14} className="mr-1" /> {t.shareBtn}
            </Button>
            <Button
              onClick={onCopy}
              size="sm"
              variant="outline"
              className="bg-neutral-900 border-neutral-800 hover:bg-neutral-800"
            >
              {copied ? <Check size={14} className="mr-1" /> : <Copy size={14} className="mr-1" />}
              {copied ? t.copiedBtn : t.copyBtn}
            </Button>
            <Button
              onClick={onNew}
              size="sm"
              variant="ghost"
              className="ml-auto text-neutral-400 hover:text-white"
            >
              {t.newRoastBtn} <ArrowRight size={14} className="ml-1" />
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

function GalleryCard({
  item,
  onClick,
  index,
}: {
  item: GalleryItem;
  onClick: () => void;
  index: number;
}) {
  const scoreColor =
    item.score >= 70 ? 'text-green-400' : item.score >= 40 ? 'text-orange-400' : 'text-red-400';
  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: Math.min(index * 0.04, 0.5) }}
      onClick={onClick}
      className="text-left"
    >
      <Card className="bg-neutral-900/60 border-neutral-800 p-4 hover:border-orange-500/40 hover:bg-neutral-900/90 transition h-full flex flex-col">
        <div className="flex items-start justify-between gap-2 mb-2">
          <span className="text-2xl">{item.emoji}</span>
          <div className="text-right">
            <div className={`text-xl font-black ${scoreColor}`}>{item.score}</div>
            <div className="text-[9px] text-neutral-600 uppercase">score</div>
          </div>
        </div>
        <h3 className="text-sm font-semibold mb-2 line-clamp-2 leading-snug">{item.title}</h3>
        <p className="text-xs text-neutral-500 line-clamp-3 mb-3 flex-1">{item.summary}</p>
        <div className="flex items-center justify-between text-[10px] text-neutral-600">
          <span>{item.nickname || 'Anon'}</span>
          <span>{new Date(item.createdAt).toLocaleDateString()}</span>
        </div>
      </Card>
    </motion.button>
  );
}
