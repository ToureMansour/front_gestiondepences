import { useRef, useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import styles from './LandingPage.module.css';

function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setInView(true); obs.disconnect(); }
    }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView];
}

function AnimatedCounter({ end, suffix = '' }) {
  const [ref, inView] = useInView(0.5);
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let current = 0;
    const step = Math.ceil(end / 60);
    const t = setInterval(() => {
      current += step;
      if (current >= end) { setVal(end); clearInterval(t); }
      else setVal(current);
    }, 20);
    return () => clearInterval(t);
  }, [inView, end]);
  return <span ref={ref}>{val}{suffix}</span>;
}

/* ── Illustrations ── */

function IllustSoumission() {
  return (
    <svg viewBox="0 0 260 180" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.featureIllus}>
      <rect x="20" y="30" width="100" height="130" rx="10" fill="#1E293B" />
      <rect x="26" y="36" width="88" height="118" rx="6" fill="#0F172A" />
      <rect x="34" y="42" width="72" height="8" rx="3" fill="#2DD4BF" opacity="0.3" />
      <rect x="34" y="56" width="56" height="6" rx="2" fill="#fff" opacity="0.08" />
      <rect x="34" y="68" width="40" height="6" rx="2" fill="#fff" opacity="0.08" />
      <rect x="70" y="88" width="36" height="36" rx="6" fill="#0F766E" opacity="0.2" />
      <path d="M82 106l4 4 8-10" stroke="#2DD4BF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="34" y="134" width="72" height="6" rx="3" fill="#0F766E" opacity="0.3" />
      <rect x="34" y="144" width="48" height="4" rx="2" fill="#0F766E" opacity="0.15" />
      <line x1="62" y1="100" x2="62" y2="118" stroke="#2DD4BF" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.3" />
      <circle cx="62" cy="120" r="2" fill="#2DD4BF" opacity="0.4" />
      <circle cx="88" cy="106" r="2" fill="#2DD4BF" opacity="0.4" />
      <circle cx="76" cy="112" r="2" fill="#2DD4BF" opacity="0.4" />
      <path d="M130 95l15-8-4 4 4 4-15-4z" fill="#0F766E" opacity="0.4" />
      <rect x="148" y="50" width="88" height="100" rx="6" fill="#fff" stroke="#E2E8F0" strokeWidth="1" />
      <rect x="158" y="64" width="68" height="6" rx="2" fill="#0F766E" opacity="0.15" />
    </svg>
  );
}

function IllustValidation() {
  return (
    <svg viewBox="0 0 260 180" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.featureIllus}>
      <rect x="20" y="40" width="220" height="120" rx="12" fill="#fff" stroke="#E2E8F0" strokeWidth="1" />
      <rect x="20" y="40" width="220" height="32" rx="12" fill="#F8FAFC" />
      <rect x="34" y="50" width="60" height="6" rx="2" fill="#1E293B" opacity="0.3" />
      <rect x="178" y="48" width="44" height="12" rx="4" fill="#0F766E" opacity="0.1" />
      <rect x="34" y="86" width="80" height="6" rx="2" fill="#1E293B" opacity="0.2" />
      <circle cx="210" cy="89" r="8" fill="#059669" opacity="0.15" />
      <path d="M206 89l3 3 5-5" stroke="#059669" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="34" y="110" width="60" height="6" rx="2" fill="#1E293B" opacity="0.2" />
      <circle cx="210" cy="113" r="8" fill="#059669" opacity="0.15" />
      <path d="M206 113l3 3 5-5" stroke="#059669" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="34" y="134" width="70" height="6" rx="2" fill="#1E293B" opacity="0.2" />
      <circle cx="210" cy="137" r="8" fill="#F59E0B" opacity="0.15" />
      <text x="207" y="141" fill="#D97706" fontSize="10" fontWeight="700">!</text>
      <circle cx="120" cy="89" r="12" fill="#0F766E" opacity="0.08" />
      <path d="M114 89c2-4 5-6 6-6s4 2 6 6c-2 4-5 6-6 6s-4-2-6-6z" stroke="#0F766E" strokeWidth="1.5" fill="none" />
      <circle cx="120" cy="89" r="2" fill="#0F766E" />
    </svg>
  );
}

function IllustRoles() {
  return (
    <svg viewBox="0 0 260 180" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.featureIllus}>
      <g transform="translate(30, 20)">
        <path d="M30 0l30 12v36c0 28-30 52-30 52s-30-24-30-52V12L30 0z" fill="#0F766E" opacity="0.1" />
        <circle cx="30" cy="40" r="12" fill="#0F766E" opacity="0.15" />
        <path d="M24 40l4 4 8-8" stroke="#0F766E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <text x="30" y="88" fill="#0F766E" fontSize="9" fontWeight="700" textAnchor="middle">Admin</text>
      </g>
      <g transform="translate(100, 20)">
        <path d="M30 0l30 12v36c0 28-30 52-30 52s-30-24-30-52V12L30 0z" fill="#7C3AED" opacity="0.1" />
        <circle cx="30" cy="40" r="12" fill="#7C3AED" opacity="0.15" />
        <path d="M24 40l4 4 8-8" stroke="#7C3AED" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <text x="30" y="88" fill="#7C3AED" fontSize="9" fontWeight="700" textAnchor="middle">Manager</text>
      </g>
      <g transform="translate(170, 20)">
        <path d="M30 0l30 12v36c0 28-30 52-30 52s-30-24-30-52V12L30 0z" fill="#0284C7" opacity="0.1" />
        <circle cx="30" cy="40" r="12" fill="#0284C7" opacity="0.15" />
        <path d="M24 40l4 4 8-8" stroke="#0284C7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <text x="30" y="88" fill="#0284C7" fontSize="9" fontWeight="700" textAnchor="middle">Employe</text>
      </g>
      <line x1="60" y1="100" x2="100" y2="100" stroke="#E2E8F0" strokeWidth="1.5" strokeDasharray="4 3" />
      <line x1="130" y1="100" x2="170" y2="100" stroke="#E2E8F0" strokeWidth="1.5" strokeDasharray="4 3" />
      <text x="130" y="130" fill="#94A3B8" fontSize="10" textAnchor="middle">Permissions personnalisables</text>
    </svg>
  );
}

function IllustPaiements() {
  return (
    <svg viewBox="0 0 260 180" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.featureIllus}>
      <defs>
        <linearGradient id="payGrad" x1="0" y1="0" x2="200" y2="120">
          <stop offset="0%" stopColor="#0F766E" />
          <stop offset="100%" stopColor="#134E4A" />
        </linearGradient>
      </defs>
      <rect x="30" y="30" width="200" height="120" rx="14" fill="url(#payGrad)" />
      <rect x="46" y="48" width="28" height="20" rx="3" fill="rgba(255,255,255,0.2)" />
      <circle cx="210" cy="60" r="8" fill="rgba(255,255,255,0.15)" />
      <circle cx="202" cy="60" r="8" fill="rgba(255,255,255,0.1)" />
      <text x="46" y="100" fill="rgba(255,255,255,0.5)" fontFamily="monospace" fontSize="12" letterSpacing="3">4242  ••••  4242</text>
      <text x="46" y="120" fill="rgba(255,255,255,0.6)" fontSize="9" fontWeight="600" letterSpacing="1">TITULAIRE</text>
      <text x="46" y="134" fill="#fff" fontSize="11" fontWeight="600">DEPENSYS PRO</text>
      <g transform="translate(190, 100)">
        <circle cx="10" cy="10" r="10" fill="#059669" />
        <path d="M6 10l3 3 5-6" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </g>
      <rect x="60" y="80" width="160" height="34" rx="8" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="1" opacity="0.9" />
      <rect x="72" y="92" width="40" height="6" rx="2" fill="#1E293B" opacity="0.15" />
      <circle cx="196" cy="96" r="4" fill="#10B981" />
    </svg>
  );
}

function DashboardMockup() {
  return (
    <div className={styles.mockup}>
      <div className={styles.mockupHeader}>
        <span /><span /><span />
        <div className={styles.mockupHeaderTitle}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 6 }}>
            <line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
          </svg>
          Depensys
        </div>
      </div>
      <div className={styles.mockupBody}>
        <div className={styles.mockupStatRow}>
          <div className={styles.mockupStat}>
            <span className={styles.mockupStatValue}>24 500 CFA</span>
            <span className={styles.mockupStatLabel}>Total depenses</span>
          </div>
          <div className={styles.mockupStatDivider} />
          <div className={styles.mockupStat}>
            <span className={styles.mockupStatValue}>12</span>
            <span className={styles.mockupStatLabel}>En attente</span>
          </div>
          <div className={styles.mockupStatDivider} />
          <div className={styles.mockupStat}>
            <span className={styles.mockupStatValue}>8</span>
            <span className={styles.mockupStatLabel}>Approuvees</span>
          </div>
        </div>
        <div className={styles.mockupDivider} />
        <div className={styles.mockupRow}>
          <div className={styles.mockupRowDot} style={{ background: '#F59E0B' }} />
          <div className={styles.mockupRowContent}>
            <span className={styles.mockupRowTitle}>Deplacement client</span>
            <span className={styles.mockupRowMeta}>Il y a 2h | Transport</span>
          </div>
          <span className={styles.mockupRowAmount}>45 000 CFA</span>
        </div>
        <div className={styles.mockupRow}>
          <div className={styles.mockupRowDot} style={{ background: '#10B981' }} />
          <div className={styles.mockupRowContent}>
            <span className={styles.mockupRowTitle}>Fournitures bureau</span>
            <span className={styles.mockupRowMeta}>Il y a 5h | Achats</span>
          </div>
          <span className={styles.mockupRowAmount}>12 000 CFA</span>
        </div>
        <div className={styles.mockupRow}>
          <div className={styles.mockupRowDot} style={{ background: '#EF4444' }} />
          <div className={styles.mockupRowContent}>
            <span className={styles.mockupRowTitle}>Repas equipe</span>
            <span className={styles.mockupRowMeta}>Hier | Restauration</span>
          </div>
          <span className={styles.mockupRowAmount}>28 500 CFA</span>
        </div>
        <div className={styles.mockupChart}>
          <div className={styles.mockupChartBar} style={{ height: '60%' }} />
          <div className={styles.mockupChartBar} style={{ height: '85%' }} />
          <div className={styles.mockupChartBar} style={{ height: '45%' }} />
          <div className={styles.mockupChartBar} style={{ height: '70%' }} />
          <div className={styles.mockupChartBar} style={{ height: '90%' }} />
          <div className={styles.mockupChartBar} style={{ height: '55%' }} />
          <div className={styles.mockupChartBar} style={{ height: '75%' }} />
        </div>
      </div>
      <div className={styles.mockupGlow} />
    </div>
  );
}

/* ── Feature Card ── */

function FeatureCard({ feature: f, index }) {
  const [ref, inView] = useInView(0.15);
  return (
    <div ref={ref} className={`${styles.featureCard} ${inView ? styles.featureCardVisible : ''}`}>
      <div className={styles.featureIllusWrap}><f.Illustration /></div>
      <div className={styles.featureContent}>
        <div className={styles.featureIcon} style={{ background: f.gradient }}>{f.icon}</div>
        <h3>{f.title}</h3>
        <p>{f.desc}</p>
      </div>
    </div>
  );
}

/* ── Data ── */

const FEATURES = [
  {
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2" /><path d="M12 6v12" /><path d="M6 10v4" /><path d="M18 10v4" /></svg>,
    title: 'Soumission rapide',
    desc: 'Capturez vos depenses en quelques secondes. Photo, montant, categorie : tout est simplifie.',
    gradient: 'linear-gradient(135deg, #0F766E, #2DD4BF)',
    Illustration: IllustSoumission,
  },
  {
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>,
    title: 'Validation fluide',
    desc: 'Les administrateurs approuvent ou rejettent en un geste. Processus clair et instantane.',
    gradient: 'linear-gradient(135deg, #059669, #34D399)',
    Illustration: IllustValidation,
  },
  {
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>,
    title: 'Multi-roles',
    desc: 'Employes et admins, chacun son espace avec ses permissions. Gerable en un clic.',
    gradient: 'linear-gradient(135deg, #7C3AED, #A78BFA)',
    Illustration: IllustRoles,
  },
  {
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2" /><path d="M12 6v12" /><path d="M6 10v4" /><path d="M18 10v4" /></svg>,
    title: 'Paiements suivis',
    desc: 'Marquez les depenses comme payees. Methodes multiples, historique complet et exportable.',
    gradient: 'linear-gradient(135deg, #0284C7, #38BDF8)',
    Illustration: IllustPaiements,
  },
];

const STEPS = [
  { num: '01', title: 'L employe soumet', desc: 'Photo du justificatif + montant. 30 secondes montre en main.' },
  { num: '02', title: 'L admin valide', desc: 'Approbation ou rejet motive depuis le tableau de bord.' },
  { num: '03', title: 'Paiement effectue', desc: 'La depense est markee payee. Historisee et exportable.' },
];

const TESTIMONIALS = [
  {
    quote: "Depensys a transforme notre gestion des notes de frais. On est passe de 3 jours de traitement a 30 minutes.",
    author: 'Sophie Martin',
    role: 'Directrice Financiere, TechCorp',
  },
  {
    quote: "L interface est tellement intuitive que nos employs l ont adoptee des le premier jour. Un gain de temps enorme.",
    author: 'Amadou Diallo',
    role: 'CEO, InnovGroup',
  },
  {
    quote: "Le module de validation multi-niveaux nous a fait gagner en controle sans perdre en flexibilite. Je recommande.",
    author: 'Claire Dubois',
    role: 'Responsable Admin, WebAgency',
  },
];

const FAQS = [
  { q: 'Comment sont protegees mes donnees ?', a: 'Toutes les donnees sont chiffrees en transit et au repos via AES-256. Nos serveurs sont heberges en France et certifies ISO 27001.' },
  { q: 'Puis-je personnaliser les categories de depenses ?', a: 'Oui, les administrateurs peuvent creer, modifier et reorganiser les categories de depenses depuis le tableau de bord.' },
  { q: 'Combien de temps prend la mise en place ?', a: 'Moins de 5 minutes. Creez votre compte, invitez vos employs et commencez a soumettre des depenses.' },
  { q: 'Y a-t-il une version gratuite ?', a: 'Oui, nous proposons un essai gratuit de 14 jours sans engagement ni carte bancaire.' },
];

/* ── Flags ── */

function FlagFR() {
  return (
    <svg viewBox="0 0 24 18" width="18" height="14" style={{ borderRadius: 2, flexShrink: 0 }}>
      <rect width="8" height="18" fill="#002395" />
      <rect x="8" width="8" height="18" fill="#fff" />
      <rect x="16" width="8" height="18" fill="#ED2939" />
    </svg>
  );
}
function FlagEN() {
  return (
    <svg viewBox="0 0 24 18" width="18" height="14" style={{ borderRadius: 2, flexShrink: 0 }}>
      <rect width="24" height="18" fill="#012169" />
      <path d="M0,0 L24,18 M24,0 L0,18" stroke="#fff" strokeWidth="3.5" />
      <path d="M0,0 L24,18 M24,0 L0,18" stroke="#C8102E" strokeWidth="1.5" />
      <rect y="7" width="24" height="4" fill="#fff" />
      <rect y="8" width="24" height="2" fill="#C8102E" />
      <rect x="10" y="0" width="4" height="18" fill="#fff" />
      <rect x="11" y="0" width="2" height="18" fill="#C8102E" />
    </svg>
  );
}

/* ── Translations ── */

const LANG = {
  fr: {
    nav: { features: 'Fonctionnalites', how: 'Comment ca marche', reviews: 'Avis', faq: 'FAQ', login: 'Connexion' },
    hero: {
      tagline: 'Solution complete de gestion des depenses',
      title: 'Simplifiez vos',
      titleGradient: 'notes de frais',
      desc: 'Centralisez, suivez et controlez toutes les depenses de votre equipe en un clin d oeil. Fini le papier, bonjour la tranquillite.',
      cta: 'Commencer', more: 'En savoir plus',
      badges: ['Sans engagement', 'Essai gratuit 14 jours', 'Support prioritaire'],
    },
    trusted: { label: 'Ils nous font confiance' },
    features: { tag: 'Fonctionnalites', title: 'Tout ce qu il vous faut', desc: 'Un outil complet pense pour les equipes modernes.' },
    how: { tag: 'Comment ca marche', title: '3 etapes simples', desc: 'De la soumission au paiement, tout est fluide.' },
    testimonials: { tag: 'Ils parlent de nous', title: 'Ce que nos clients disent', desc: 'Des retours d experience concrets.' },
    stats: { tag: 'Pourquoi Depensys', title: 'Des chiffres qui parlent', desc: 'Adopte par des entreprises de toutes tailles.', items: [
      { end: 100, suffix: '%', label: 'Numerise', desc: 'Fini le papier' },
      { end: 5, suffix: 'x', label: 'Plus rapide', desc: 'Traitement accelere' },
      { end: 99, suffix: '%', label: 'Disponible', desc: 'Uptime garanti' },
      { end: 256, suffix: '', label: 'Bits', desc: 'Chiffrement AES' },
    ] },
    security: { tag: 'Securite', title: 'Vos donnees en toute confiance', desc: 'Des standards de securite eleves pour votre tranquilite.' },
    faq: { tag: 'FAQ', title: 'Questions frequentes', desc: 'Tout ce que vous devez savoir.' },
    cta: { title: 'Pret a transformer votre gestion ?', desc: 'Rejoignez les entreprises qui font confiance a Depensys. Essai gratuit 14 jours.', btn: 'Acceder a l application' },
    footer: { desc: 'La solution intelligente pour gerer les notes de frais de votre entreprise.', product: 'Produit', company: 'Entreprise', contact: 'Contact' },
  },
  en: {
    nav: { features: 'Features', how: 'How it works', reviews: 'Reviews', faq: 'FAQ', login: 'Login' },
    hero: {
      tagline: 'Complete expense management solution',
      title: 'Simplify your',
      titleGradient: 'expense reports',
      desc: 'Centralize, track and control all your team expenses in a blink. No more paper, hello peace of mind.',
      cta: 'Get started', more: 'Learn more',
      badges: ['No commitment', '14-day free trial', 'Priority support'],
    },
    trusted: { label: 'Trusted by' },
    features: { tag: 'Features', title: 'Everything you need', desc: 'A complete tool designed for modern teams.' },
    how: { tag: 'How it works', title: '3 simple steps', desc: 'From submission to payment, everything is smooth.' },
    testimonials: { tag: 'Testimonials', title: 'What our clients say', desc: 'Real feedback from real users.' },
    stats: { tag: 'Why Depensys', title: 'Numbers that speak', desc: 'Adopted by companies of all sizes.', items: [
      { end: 100, suffix: '%', label: 'Digitized', desc: 'No more paper' },
      { end: 5, suffix: 'x', label: 'Faster', desc: 'Accelerated processing' },
      { end: 99, suffix: '%', label: 'Uptime', desc: 'Guaranteed uptime' },
      { end: 256, suffix: '', label: 'Bits', desc: 'AES encryption' },
    ] },
    security: { tag: 'Security', title: 'Your data, safe and sound', desc: 'High security standards for your peace of mind.' },
    faq: { tag: 'FAQ', title: 'Frequently asked questions', desc: 'Everything you need to know.' },
    cta: { title: 'Ready to transform your management?', desc: 'Join the companies that trust Depensys. 14-day free trial.', btn: 'Access the app' },
    footer: { desc: 'The smart solution for managing your company expense reports.', product: 'Product', company: 'Company', contact: 'Contact' },
  },
};

/* ── Nav Dropdown ── */

function NavDropdown({ label, items, isOpen, onMouseEnter, onMouseLeave }) {
  return (
    <div className={styles.navDropdownWrapper} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
      <button className={styles.navLink}>
        {label}
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      {isOpen && (
        <div className={styles.megaMenu}>
          <div className={styles.megaMenuInner}>
            {items.map((item, i) => (
              <button key={i} className={styles.megaMenuItem} onClick={() => { document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth' }); }}>
                <div className={styles.megaMenuIcon} style={{ background: item.gradient }}>{item.icon}</div>
                <div>
                  <span className={styles.megaMenuTitle}>{item.title}</span>
                  <span className={styles.megaMenuDesc}>{item.shortDesc}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Section Divider ── */

function SectionDivider({ type, fill, prevBg }) {
  const paths = {
    wave: 'M0,40 C240,100 480,0 720,40 C960,80 1200,20 1440,60 L1440,100 L0,100 Z',
    curve: 'M0,20 C360,100 1080,100 1440,20 L1440,100 L0,100 Z',
    organic: 'M0,30 C180,100 360,0 540,50 C720,100 900,10 1080,60 C1260,100 1350,20 1440,40 L1440,100 L0,100 Z',
  };
  return (
    <div className={styles.divider}>
      <svg viewBox="0 0 1440 100" preserveAspectRatio="none" className={styles.dividerSvg}>
        {prevBg && <rect width="1440" height="100" fill={prevBg} />}
        <path d={paths[type]} fill={fill} />
      </svg>
    </div>
  );
}

/* ── Page ── */

function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [lang, setLang] = useState('fr');
  const [openDropdown, setOpenDropdown] = useState(null);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [openFaq, setOpenFaq] = useState(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const t = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 5000);
    return () => clearInterval(t);
  }, []);

  const scrollTo = useCallback((id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setOpenDropdown(null);
  }, []);

  const featuresMenu = FEATURES.map((f) => ({
    ...f,
    id: 'features',
    shortDesc: f.desc.split('.')[0] + '.',
  }));

  const t = (path) => {
    const keys = path.split('.');
    let val = LANG[lang];
    for (const k of keys) { if (val) val = val[k]; }
    return val || path;
  };

  return (
    <div className={styles.page}>
      {/* ── NAV ── */}
      <nav className={`${styles.nav} ${scrolled ? styles.navScrolled : ''}`} onMouseLeave={() => setOpenDropdown(null)}>
        <div className={styles.navInner}>
          <Link to="/" className={styles.logo}>
            <div className={styles.logoIcon}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            </div>
            <span>Depensys</span>
          </Link>
          <div className={styles.navLinks}>
            <NavDropdown
              label={t('nav.features')}
              items={featuresMenu}
              isOpen={openDropdown === 'features'}
              onMouseEnter={() => setOpenDropdown('features')}
              onMouseLeave={() => setOpenDropdown(null)}
            />
            <button onClick={() => scrollTo('how')} className={styles.navLink}>{t('nav.how')}</button>
            <button onClick={() => scrollTo('testimonials')} className={styles.navLink}>{t('nav.reviews')}</button>
            <button onClick={() => scrollTo('faq')} className={styles.navLink}>{t('nav.faq')}</button>
            <div className={styles.langToggle}>
              <button className={`${styles.langBtn} ${lang === 'fr' ? styles.langActive : ''}`} onClick={() => setLang('fr')}><FlagFR /> FR</button>
              <span className={styles.langSep}>|</span>
              <button className={`${styles.langBtn} ${lang === 'en' ? styles.langActive : ''}`} onClick={() => setLang('en')}><FlagEN /> EN</button>
            </div>
            <Link to="/login" className={styles.navCta}>{t('nav.login')}</Link>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.heroText}>
            <div className={styles.heroTagline}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
              {t('hero.tagline')}
            </div>
            <h1 className={styles.heroTitle}>
              {t('hero.title')}<br />
              <span className={styles.heroGradient}>{t('hero.titleGradient')}</span>
            </h1>
            <p className={styles.heroDesc}>
              {t('hero.desc')}
            </p>
            <div className={styles.heroActions}>
              <Link to="/login" className={styles.btnPrimary}>
                {t('hero.cta')}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
              </Link>
              <button onClick={() => scrollTo('features')} className={styles.btnGhost}>{t('hero.more')}</button>
            </div>
            <div className={styles.heroBadges}>
              {LANG[lang].hero.badges.map((b, i) => (
                <span key={i}><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#0F766E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg> {b}</span>
              ))}
            </div>
          </div>
          <div className={styles.heroVisual}><img src="/images/hero-image.png" alt="Depensys" className={styles.heroImage} /></div>
        </div>
        <div className={styles.heroMobileMockup}><img src="/images/hero-image.png" alt="Depensys" className={styles.heroImage} /></div>
      </section>

      {/* ── TRUSTED BY ── */}
      <section className={styles.trusted}>
        <div className={styles.trustedInner}>
          <p className={styles.trustedLabel}>{t('trusted.label')}</p>
          <div className={styles.trustedLogos}>
            {['TechCorp', 'InnovGroup', 'WebAgency', 'StartHub', 'CloudPlus', 'DataSoft'].map((name) => (
              <div key={name} className={styles.trustedLogo}>{name}</div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" className={styles.features}>
        <div className={styles.sectionHead}>
          <span className={styles.tag}>{t('features.tag')}</span>
          <h2 className={styles.sectionTitle}>{t('features.title')}</h2>
          <p className={styles.sectionDesc}>{t('features.desc')}</p>
        </div>
        <div className={styles.featuresGrid}>
          {FEATURES.map((f, i) => <FeatureCard key={i} feature={f} index={i} />)}
        </div>
      </section>

      <SectionDivider type="wave" fill="#0D3D3A" prevBg="#FFFFFF" />

      {/* ── HOW IT WORKS ── */}
      <section id="how" className={styles.how}>
        <div className={styles.sectionHead} style={{ position: 'relative', zIndex: 1 }}>
          <span className={styles.howTag}>{t('how.tag')}</span>
          <h2 className={styles.howTitle}>{t('how.title')}</h2>
          <p className={styles.howDesc}>{t('how.desc')}</p>
        </div>
        <div className={styles.stepsGrid}>
          {STEPS.map((s, i) => (
            <div key={i} className={styles.stepCard} style={{ animationDelay: `${i * 0.15}s` }}>
              <span className={styles.stepNum}>{s.num}</span>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <SectionDivider type="curve" fill="#F8FAFC" prevBg="#0D3D3A" />

      {/* ── TESTIMONIALS ── */}
      <section id="testimonials" className={styles.testimonials}>
        <div className={styles.sectionHead}>
          <span className={styles.tag}>{t('testimonials.tag')}</span>
          <h2 className={styles.sectionTitle}>{t('testimonials.title')}</h2>
          <p className={styles.sectionDesc}>{t('testimonials.desc')}</p>
        </div>
        <div className={styles.testimonialCarousel}>
          <div className={styles.testimonialCards}>
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className={`${styles.testimonialCard} ${i === activeTestimonial ? styles.testimonialActive : ''}`}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#0F766E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={styles.testimonialQuote}><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z" /><path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z" /></svg>
                <p>"{t.quote}"</p>
                <div>
                  <strong>{t.author}</strong>
                  <span>{t.role}</span>
                </div>
              </div>
            ))}
          </div>
          <div className={styles.testimonialDots}>
            {TESTIMONIALS.map((_, i) => (
              <button key={i} className={`${styles.testimonialDot} ${i === activeTestimonial ? styles.testimonialDotActive : ''}`} onClick={() => setActiveTestimonial(i)} />
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section id="stats" className={styles.stats}>
        <div className={styles.sectionHead} style={{ position: 'relative', zIndex: 1 }}>
          <span className={styles.statsTag}>{t('stats.tag')}</span>
          <h2 className={styles.statsTitle}>{t('stats.title')}</h2>
          <p className={styles.statsDesc}>{t('stats.desc')}</p>
        </div>
        <div className={styles.statsGrid}>
          {LANG[lang].stats.items.map((s, i) => (
            <div key={i} className={styles.statCard}>
              <span className={styles.statNum}><AnimatedCounter end={s.end} suffix={s.suffix} /></span>
              <span className={styles.statLabel}>{s.label}</span>
              <p>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <SectionDivider type="wave" fill="#FFFFFF" prevBg="#F8FAFC" />

      {/* ── SECURITY ── */}
      <section className={styles.security}>
        <div className={styles.sectionHead}>
          <span className={styles.tag}>{t('security.tag')}</span>
          <h2 className={styles.sectionTitle}>{t('security.title')}</h2>
          <p className={styles.sectionDesc}>{t('security.desc')}</p>
        </div>
        <div className={styles.securityGrid}>
          <div className={styles.securityCard}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#0F766E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
            <h4>Chiffrement AES-256</h4>
            <p>Toutes les donnees sont chiffrees au repos et en transit.</p>
          </div>
          <div className={styles.securityCard}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#0F766E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
            <h4>Certifie ISO 27001</h4>
            <p>Heberge en France sur des serveurs certifies.</p>
          </div>
          <div className={styles.securityCard}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#0F766E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
            <h4>Support 24h/24</h4>
            <p>Une equipe dediee pour vous accompagner.</p>
          </div>
          <div className={styles.securityCard}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#0F766E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" /><path d="M4.93 4.93l14.14 14.14" /></svg>
            <h4>RGPD Conforme</h4>
            <p>Vos donnees vous appartiennent. Exportez-les a tout moment.</p>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" className={styles.faq}>
        <div className={styles.sectionHead} style={{ position: 'relative', zIndex: 1 }}>
          <span className={styles.faqTag}>{t('faq.tag')}</span>
          <h2 className={styles.faqTitle}>{t('faq.title')}</h2>
          <p className={styles.faqDesc}>{t('faq.desc')}</p>
        </div>
        <div className={styles.faqList}>
          {FAQS.map((item, i) => (
            <div key={i} className={`${styles.faqItem} ${openFaq === i ? styles.faqItemOpen : ''}`}>
              <button className={styles.faqQuestion} onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                <span>{item.q}</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={styles.faqChevron}>
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>
              <div className={styles.faqAnswer}>
                <p>{item.a}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <SectionDivider type="organic" fill="#0F766E" prevBg="#0D3D3A" />

      {/* ── CTA ── */}
      <section className={styles.cta}>
        <div className={styles.ctaGlow} />
        <div className={styles.ctaContent}>
          <h2>{t('cta.title')}</h2>
          <p>{t('cta.desc')}</p>
          <Link to="/login" className={styles.btnPrimary}>
            {t('cta.btn')}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
          </Link>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <div className={styles.footerTop}>
            <div className={styles.footerCol}>
              <div className={styles.footerBrand}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0F766E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>
                Depensys
              </div>
              <p>{t('footer.desc')}</p>
            </div>
            <div className={styles.footerCol}>
              <h5>{t('footer.product')}</h5>
              <button onClick={() => scrollTo('features')}>{t('nav.features')}</button>
              <button onClick={() => scrollTo('how')}>{t('nav.how')}</button>
              <button onClick={() => scrollTo('testimonials')}>{t('nav.reviews')}</button>
            </div>
            <div className={styles.footerCol}>
              <h5>{t('footer.company')}</h5>
              <button onClick={() => scrollTo('stats')}>{t('stats.tag')}</button>
              <button onClick={() => scrollTo('faq')}>{t('nav.faq')}</button>
              <Link to="/login">{t('nav.login')}</Link>
            </div>
            <div className={styles.footerCol}>
              <h5>{t('footer.contact')}</h5>
              <span>contact@depensys.com</span>
              <span>+221 77 123 45 67</span>
              <span>Dakar, Senegal</span>
            </div>
          </div>
          <div className={styles.footerBottom}>
            <p>&copy; {new Date().getFullYear()} Depensys. Tous droits reserves.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
