import { useRef, useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import styles from './LandingPage.module.css';

function useInView(threshold = 0.2) {
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

/* ── Feature Illustrations ── */

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
      {/* Arrow from phone to right */}
      <path d="M130 95l15-8-4 4 4 4-15-4z" fill="#0F766E" opacity="0.4" />
      {/* Receipt on right */}
      <rect x="148" y="50" width="88" height="100" rx="6" fill="#fff" stroke="#E2E8F0" strokeWidth="1" />
      <rect x="158" y="64" width="68" height="6" rx="2" fill="#0F766E" opacity="0.15" />
      <rect x="158" y="76" width="48" height="4" rx="2" fill="#94A3B8" opacity="0.3" />
      <rect x="158" y="88" width="56" height="4" rx="2" fill="#94A3B8" opacity="0.3" />
      <circle cx="210" cy="114" r="14" fill="#059669" opacity="0.15" />
      <path d="M204 114l4 4 8-8" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IllustValidation() {
  return (
    <svg viewBox="0 0 260 180" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.featureIllus}>
      <rect x="20" y="40" width="220" height="120" rx="12" fill="#fff" stroke="#E2E8F0" strokeWidth="1" />
      {/* Header */}
      <rect x="20" y="40" width="220" height="32" rx="12" fill="#F8FAFC" />
      <rect x="34" y="50" width="60" height="6" rx="2" fill="#1E293B" opacity="0.3" />
      <rect x="178" y="48" width="44" height="12" rx="4" fill="#0F766E" opacity="0.1" />
      {/* Row 1 */}
      <rect x="34" y="86" width="80" height="6" rx="2" fill="#1E293B" opacity="0.2" />
      <rect x="140" y="86" width="30" height="4" rx="2" fill="#94A3B8" opacity="0.3" />
      <circle cx="210" cy="89" r="8" fill="#059669" opacity="0.15" />
      <path d="M206 89l3 3 5-5" stroke="#059669" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      {/* Row 2 */}
      <rect x="34" y="110" width="60" height="6" rx="2" fill="#1E293B" opacity="0.2" />
      <rect x="140" y="110" width="30" height="4" rx="2" fill="#94A3B8" opacity="0.3" />
      <circle cx="210" cy="113" r="8" fill="#059669" opacity="0.15" />
      <path d="M206 113l3 3 5-5" stroke="#059669" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      {/* Row 3 */}
      <rect x="34" y="134" width="70" height="6" rx="2" fill="#1E293B" opacity="0.2" />
      <rect x="140" y="134" width="30" height="4" rx="2" fill="#94A3B8" opacity="0.3" />
      <circle cx="210" cy="137" r="8" fill="#F59E0B" opacity="0.15" />
      <text x="207" y="141" fill="#D97706" fontSize="10" fontWeight="700">!</text>
      {/* Eye icon */}
      <circle cx="120" cy="89" r="12" fill="#0F766E" opacity="0.08" />
      <path d="M114 89c2-4 5-6 6-6s4 2 6 6c-2 4-5 6-6 6s-4-2-6-6z" stroke="#0F766E" strokeWidth="1.5" fill="none" />
      <circle cx="120" cy="89" r="2" fill="#0F766E" />
    </svg>
  );
}

function IllustRoles() {
  return (
    <svg viewBox="0 0 260 180" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.featureIllus}>
      {/* Shield 1 */}
      <g transform="translate(30, 20)">
        <path d="M30 0l30 12v36c0 28-30 52-30 52s-30-24-30-52V12L30 0z" fill="#0F766E" opacity="0.1" />
        <path d="M30 4l26 10v34c0 24-26 46-26 46s-26-22-26-46V14L30 4z" fill="#0F766E" opacity="0.06" />
        <circle cx="30" cy="40" r="12" fill="#0F766E" opacity="0.15" />
        <path d="M24 40l4 4 8-8" stroke="#0F766E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <text x="30" y="88" fill="#0F766E" fontSize="9" fontWeight="700" textAnchor="middle">Admin</text>
      </g>
      {/* Shield 2 */}
      <g transform="translate(100, 20)">
        <path d="M30 0l30 12v36c0 28-30 52-30 52s-30-24-30-52V12L30 0z" fill="#7C3AED" opacity="0.1" />
        <path d="M30 4l26 10v34c0 24-26 46-26 46s-26-22-26-46V14L30 4z" fill="#7C3AED" opacity="0.06" />
        <circle cx="30" cy="40" r="12" fill="#7C3AED" opacity="0.15" />
        <path d="M24 40l4 4 8-8" stroke="#7C3AED" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <text x="30" y="88" fill="#7C3AED" fontSize="9" fontWeight="700" textAnchor="middle">Manager</text>
      </g>
      {/* Shield 3 */}
      <g transform="translate(170, 20)">
        <path d="M30 0l30 12v36c0 28-30 52-30 52s-30-24-30-52V12L30 0z" fill="#0284C7" opacity="0.1" />
        <path d="M30 4l26 10v34c0 24-26 46-26 46s-26-22-26-46V14L30 4z" fill="#0284C7" opacity="0.06" />
        <circle cx="30" cy="40" r="12" fill="#0284C7" opacity="0.15" />
        <path d="M24 40l4 4 8-8" stroke="#0284C7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <text x="30" y="88" fill="#0284C7" fontSize="9" fontWeight="700" textAnchor="middle">Employe</text>
      </g>
      {/* Connecting line */}
      <line x1="60" y1="100" x2="100" y2="100" stroke="#E2E8F0" strokeWidth="1.5" strokeDasharray="4 3" />
      <line x1="130" y1="100" x2="170" y2="100" stroke="#E2E8F0" strokeWidth="1.5" strokeDasharray="4 3" />
      <text x="130" y="130" fill="#94A3B8" fontSize="10" textAnchor="middle">Permissions personnalisables</text>
      {/* Bottom bar */}
      <rect x="40" y="148" width="180" height="4" rx="2" fill="#0F766E" opacity="0.08" />
      <circle cx="60" cy="150" r="3" fill="#0F766E" opacity="0.2" />
      <circle cx="100" cy="150" r="3" fill="#7C3AED" opacity="0.2" />
      <circle cx="140" cy="150" r="3" fill="#0284C7" opacity="0.2" />
    </svg>
  );
}

function IllustPaiements() {
  return (
    <svg viewBox="0 0 260 180" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.featureIllus}>
      {/* Card */}
      <rect x="30" y="30" width="200" height="120" rx="14" fill="url(#payGrad)" />
      <defs>
        <linearGradient id="payGrad" x1="0" y1="0" x2="200" y2="120">
          <stop offset="0%" stopColor="#0F766E" />
          <stop offset="100%" stopColor="#134E4A" />
        </linearGradient>
      </defs>
      <rect x="46" y="48" width="28" height="20" rx="3" fill="rgba(255,255,255,0.2)" />
      <circle cx="210" cy="60" r="8" fill="rgba(255,255,255,0.15)" />
      <circle cx="202" cy="60" r="8" fill="rgba(255,255,255,0.1)" />
      <text x="46" y="100" fill="rgba(255,255,255,0.5)" fontFamily="monospace" fontSize="12" letterSpacing="3">
        4242  &bull;&bull;&bull;&bull;  4242
      </text>
      <text x="46" y="120" fill="rgba(255,255,255,0.6)" fontSize="9" fontWeight="600" letterSpacing="1">
        TITULAIRE
      </text>
      <text x="46" y="134" fill="#fff" fontSize="11" fontWeight="600">
        DEPENSYS PRO
      </text>
      {/* Checkmark on card */}
      <g transform="translate(190, 100)">
        <circle cx="10" cy="10" r="10" fill="#059669" />
        <path d="M6 10l3 3 5-6" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </g>
      {/* Small secondary card */}
      <rect x="60" y="80" width="160" height="34" rx="8" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="1" opacity="0.9" />
      <rect x="72" y="92" width="40" height="6" rx="2" fill="#1E293B" opacity="0.15" />
      <rect x="126" y="92" width="40" height="6" rx="2" fill="#94A3B8" opacity="0.2" />
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
        {/* Stats row */}
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
        {/* Expense list */}
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
        {/* Chart area */}
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
    <div ref={ref} className={`${styles.featureCard} ${inView ? styles.visible : ''}`} style={{ animationDelay: `${index * 0.1}s` }}>
      <div className={styles.featureIllusWrap}>
        <f.Illustration />
      </div>
      <div className={styles.featureContent}>
        <div className={styles.featureIcon} style={{ background: f.gradient }}>{f.icon}</div>
        <h3>{f.title}</h3>
        <p>{f.desc}</p>
      </div>
    </div>
  );
}

const FEATURES = [
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="M12 6v12" />
        <path d="M6 10v4" />
        <path d="M18 10v4" />
      </svg>
    ),
    title: 'Soumission rapide',
    desc: 'Capturez vos depenses en quelques secondes. Photo, montant, categorie : tout est simplifie.',
    gradient: 'linear-gradient(135deg, #0F766E, #2DD4BF)',
    Illustration: IllustSoumission,
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
    title: 'Validation fluide',
    desc: 'Les administrateurs approuvent ou rejettent en un geste. Processus clair et instantane.',
    gradient: 'linear-gradient(135deg, #059669, #34D399)',
    Illustration: IllustValidation,
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    title: 'Multi-roles',
    desc: 'Employes et admins, chacun son espace avec ses permissions. Gerable en un clic.',
    gradient: 'linear-gradient(135deg, #7C3AED, #A78BFA)',
    Illustration: IllustRoles,
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="M12 6v12" />
        <path d="M6 10v4" />
        <path d="M18 10v4" />
      </svg>
    ),
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

/* ── Page ── */

function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = useCallback((id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  return (
    <div className={styles.page}>
      <nav className={`${styles.nav} ${scrolled ? styles.navScrolled : ''}`}>
        <div className={styles.navInner}>
          <Link to="/" className={styles.logo}>
            <div className={styles.logoIcon}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="1" x2="12" y2="23" />
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            </div>
            <span>Depensys</span>
          </Link>
          <div className={styles.navLinks}>
            <button onClick={() => scrollTo('features')} className={styles.navLink}>Fonctionnalites</button>
            <button onClick={() => scrollTo('how')} className={styles.navLink}>Comment ca marche</button>
            <button onClick={() => scrollTo('stats')} className={styles.navLink}>Statistiques</button>
            <Link to="/login" className={styles.navCta}>Connexion</Link>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className={styles.hero}>
        <div className={styles.heroBg} />
        <div className={styles.heroMesh} />
        <div className={styles.heroBlob1} />
        <div className={styles.heroBlob2} />
        <div className={styles.heroGrid} />
        <div className={styles.heroContent}>
          <div className={styles.heroText}>
            <div className={styles.heroTagline}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Solution complete de gestion des depenses
            </div>
            <h1 className={styles.heroTitle}>
              Simplifiez vos<br />
              <span className={styles.heroGradient}>notes de frais</span>
            </h1>
            <p className={styles.heroDesc}>
              Centralisez, suivez et controlez toutes les depenses de votre equipe.
              Un outil penser pour les entreprises modernes.
            </p>
            <div className={styles.heroActions}>
              <Link to="/login" className={styles.btnPrimary}>
                Commencer
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                </svg>
              </Link>
              <button onClick={() => scrollTo('features')} className={styles.btnGhost}>
                En savoir plus
              </button>
            </div>
            <div className={styles.heroBadges}>
              <span><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#0F766E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg> Sans engagement</span>
              <span><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#0F766E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg> Essai gratuit</span>
              <span><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#0F766E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg> Support prioritaire</span>
            </div>
          </div>
          <div className={styles.heroVisual}>
            <DashboardMockup />
          </div>
        </div>
        {/* Mobile mockup */}
        <div className={styles.heroMobileMockup}>
          <DashboardMockup />
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" className={styles.features}>
        <div className={styles.sectionHead}>
          <span className={styles.tag}>Fonctionnalites</span>
          <h2 className={styles.sectionTitle}>Tout ce qu il vous faut</h2>
          <p className={styles.sectionDesc}>Un outil complet pense pour les equipes modernes.</p>
        </div>
        <div className={styles.featuresGrid}>
          {FEATURES.map((f, i) => (
            <FeatureCard key={i} feature={f} index={i} />
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how" className={styles.how}>
        <div className={styles.howBg} />
        <div className={styles.sectionHead}>
          <span className={styles.howTag}>Comment ca marche</span>
          <h2 className={styles.howTitle}>3 etapes simples</h2>
          <p className={styles.howDesc}>De la soumission au paiement, tout est fluide.</p>
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

      {/* ── STATS ── */}
      <section id="stats" className={styles.stats}>
        <div className={styles.sectionHead}>
          <span className={styles.tag}>Pourquoi Depensys</span>
          <h2 className={styles.sectionTitle}>Des chiffres qui parlent</h2>
          <p className={styles.sectionDesc}>Adopte par des entreprises de toutes tailles.</p>
        </div>
        <div className={styles.statsGrid}>
          {[
            { end: 100, suffix: '%', label: 'Numerise', desc: 'Fini le papier' },
            { end: 5, suffix: 'x', label: 'Plus rapide', desc: 'Traitement accelere' },
            { end: 99, suffix: '%', label: 'Disponible', desc: 'Uptime garanti' },
            { end: 256, suffix: '', label: 'Bits', desc: 'Chiffrement AES' },
          ].map((s, i) => (
            <div key={i} className={styles.statCard}>
              <span className={styles.statNum}><AnimatedCounter end={s.end} suffix={s.suffix} /></span>
              <span className={styles.statLabel}>{s.label}</span>
              <p>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className={styles.cta}>
        <div className={styles.ctaBg} />
        <div className={styles.ctaGlow} />
        <div className={styles.ctaContent}>
          <h2>Pret a transformer votre gestion ?</h2>
          <p>Rejoignez les entreprises qui font confiance a Depensys.</p>
          <Link to="/login" className={styles.btnPrimary}>
            Acceder a l application
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
            </svg>
          </Link>
        </div>
      </section>

      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <div className={styles.footerBrand}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0F766E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
            Depensys
          </div>
          <div className={styles.footerLinks}>
            <button onClick={() => scrollTo('features')}>Fonctionnalites</button>
            <button onClick={() => scrollTo('how')}>Comment ca marche</button>
            <button onClick={() => scrollTo('stats')}>Statistiques</button>
            <Link to="/login">Connexion</Link>
          </div>
          <p>&copy; {new Date().getFullYear()} Depensys. Tous droits reserves.</p>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
