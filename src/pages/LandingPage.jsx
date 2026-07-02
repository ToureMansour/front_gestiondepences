import { useRef, useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import styles from './LandingPage.module.css';

const FEATURES = [
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="M12 6v12" />
        <path d="M6 10v4" />
        <path d="M18 10v4" />
      </svg>
    ),
    title: 'Soumission rapide',
    desc: 'Capturez vos depenses en quelques secondes. Photo, montant, categorie : tout est simplifie.',
    gradient: 'linear-gradient(135deg, #0F766E, #2DD4BF)',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
    title: 'Validation fluide',
    desc: 'Les administrateurs approuvent ou rejettent en un geste. Processus clair et instantane.',
    gradient: 'linear-gradient(135deg, #059669, #34D399)',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    title: 'Multi-roles',
    desc: 'Employes et admins, chacun son espace avec ses permissions. Gerable en un clic.',
    gradient: 'linear-gradient(135deg, #7C3AED, #A78BFA)',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="M12 6v12" />
        <path d="M6 10v4" />
        <path d="M18 10v4" />
      </svg>
    ),
    title: 'Paiements suivis',
    desc: 'Marquez les depenses comme payees. Methodes multiples, historique complet et exportable.',
    gradient: 'linear-gradient(135deg, #0284C7, #38BDF8)',
  },
];

const STEPS = [
  { num: '01', title: 'L employe soumet', desc: 'Photo du justificatif + montant. 30 secondes montre en main.' },
  { num: '02', title: 'L admin valide', desc: 'Approbation ou rejet motive depuis le tableau de bord.' },
  { num: '03', title: 'Paiement effectue', desc: 'La depense est markee payee. Historisee et exportable.' },
];

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
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
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
        <div className={styles.sectionHead} style={{ position: 'relative', zIndex: 1 }}>
          <span className={styles.tag} style={{ background: 'rgba(255,255,255,0.12)', color: '#CCFBF1' }}>Comment ca marche</span>
          <h2 className={styles.sectionTitle} style={{ color: '#fff' }}>3 etapes simples</h2>
          <p className={styles.sectionDesc} style={{ color: 'rgba(255,255,255,0.6)' }}>De la soumission au paiement, tout est fluide.</p>
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

function FeatureCard({ feature: f, index }) {
  const [ref, inView] = useInView(0.15);
  return (
    <div ref={ref} className={`${styles.featureCard} ${inView ? styles.visible : ''}`}>
      <div className={styles.featureIcon} style={{ background: f.gradient }}>{f.icon}</div>
      <h3>{f.title}</h3>
      <p>{f.desc}</p>
    </div>
  );
}

function DashboardMockup() {
  return (
    <div className={styles.mockup}>
      <div className={styles.mockupHeader}>
        <span /><span /><span />
      </div>
      <div className={styles.mockupBody}>
        <div className={styles.mockupRow}>
          <div className={styles.mockupBar} style={{ width: '60%' }} />
          <div className={styles.mockupPill} />
        </div>
        <div className={styles.mockupRow}>
          <div className={styles.mockupBar} style={{ width: '40%' }} />
          <div className={styles.mockupPill} style={{ background: '#34D399' }} />
        </div>
        <div className={styles.mockupRow}>
          <div className={styles.mockupBar} style={{ width: '75%' }} />
          <div className={styles.mockupPill} style={{ background: '#F59E0B' }} />
        </div>
        <div className={styles.mockupDivider} />
        <div className={styles.mockupGrid}>
          <div /><div /><div /><div />
        </div>
      </div>
      <div className={styles.mockupGlow} />
    </div>
  );
}

export default LandingPage;
