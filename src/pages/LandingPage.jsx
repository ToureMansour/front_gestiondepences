import { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './LandingPage.module.css';

const FEATURES = [
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="M12 6v12" />
        <path d="M6 10v4" />
        <path d="M18 10v4" />
      </svg>
    ),
    title: 'Notes de frais',
    desc: 'Soumettez vos depenses en un clic. Photo du justificatif, montant, categorie... tout est simplifie.',
    color: '#0F766E',
    bg: '#CCFBF1',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
    title: 'Validation admin',
    desc: 'Les administrateurs approuvent ou rejettent en un clic. Processus clair et tracable.',
    color: '#059669',
    bg: '#D1FAE5',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="M12 6v12" />
        <path d="M6 10v4" />
        <path d="M18 10v4" />
      </svg>
    ),
    title: 'Paiements centralises',
    desc: 'Marquez les depenses comme payees avec differentes methodes de paiement. Suivi en temps reel.',
    color: '#0284C7',
    bg: '#E0F2FE',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    title: 'Multi-utilisateurs',
    desc: 'Employes et administrateurs, chacun avec son espace et ses permissions. Gerable facilement.',
    color: '#7C3AED',
    bg: '#EDE9FE',
  },
];

const STEPS = [
  { number: '01', title: 'L employe soumet', desc: 'Photo du ticket + montant + description. En 30 secondes chrono.' },
  { number: '02', title: 'L admin valide', desc: 'Approbation ou rejet motive. Tout se passe dans le tableau de bord.' },
  { number: '03', title: 'Paiement effectue', desc: 'La depense est marquee payee. L historique est conserve.' },
];

function AnimatedCounter({ end, suffix }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          let start = 0;
          const duration = 1500;
          const step = Math.ceil(end / (duration / 16));
          const timer = setInterval(() => {
            start += step;
            if (start >= end) { setCount(end); clearInterval(timer); }
            else setCount(start);
          }, 16);
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [end]);

  return <span ref={ref}>{count}{suffix}</span>;
}

function LandingPage() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className={styles.page}>
      <header className={`${styles.header} ${scrolled ? styles.headerScrolled : ''}`}>
        <div className={styles.headerInner}>
          <Link to="/" className={styles.logo}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0F766E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="1" x2="12" y2="23" />
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
            <span className={styles.logoText}>Depensys</span>
          </Link>
          <nav className={styles.nav}>
            <button onClick={() => scrollTo('features')} className={styles.navLink}>Fonctionnalites</button>
            <button onClick={() => scrollTo('how')} className={styles.navLink}>Comment ca marche</button>
            <button onClick={() => scrollTo('benefits')} className={styles.navLink}>Avantages</button>
            <Link to="/login" className={styles.loginBtn}>
              Connexion
            </Link>
          </nav>
        </div>
      </header>

      <section className={styles.hero}>
        <div className={styles.heroBg} />
        <div className={styles.heroBlob1} />
        <div className={styles.heroBlob2} />
        <div className={styles.heroBlob3} />
        <div className={styles.heroParticle1} />
        <div className={styles.heroParticle2} />
        <div className={styles.heroParticle3} />
        <div className={styles.heroParticle4} />
        <div className={styles.heroContent}>
          <div className={styles.heroBadge}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            Solution complete de gestion
          </div>
          <h1 className={styles.heroTitle}>
            Simplifiez la gestion<br />
            de vos <span className={styles.heroHighlight}>depenses</span>
          </h1>
          <p className={styles.heroDesc}>
            Centralisez, suivez et controlez toutes les notes de frais de votre entreprise
            en un seul endroit. Fini le temps perdu sur Excel et la paperasse.
          </p>
          <div className={styles.heroCta}>
            <Link to="/login" className={styles.ctaPrimary}>
              Commencer maintenant
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </Link>
            <button onClick={() => scrollTo('features')} className={styles.ctaSecondary}>
              Decouvrir
            </button>
          </div>
        </div>
        <div className={styles.scrollIndicator}>
          <svg width="20" height="30" viewBox="0 0 20 30" fill="none">
            <rect x="1.5" y="1.5" width="17" height="27" rx="8.5" stroke="#0F766E" strokeWidth="2" />
            <circle cx="10" cy="10" r="2.5" fill="#0F766E" className={styles.scrollDot} />
          </svg>
        </div>
      </section>

      <section id="features" className={styles.features}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionTag}>Fonctionnalites</span>
          <h2 className={styles.sectionTitle}>Tout ce qu il vous faut</h2>
          <p className={styles.sectionDesc}>
            Un outil complet pense pour les entreprises modernes.
          </p>
        </div>
        <div className={styles.featuresGrid}>
          {FEATURES.map((feature, i) => (
            <div key={i} className={styles.featureCard} style={{ '--accent': feature.color, '--accentBg': feature.bg }}>
              <div className={styles.featureIcon} style={{ background: feature.bg, color: feature.color }}>
                {feature.icon}
              </div>
              <h3 className={styles.featureTitle}>{feature.title}</h3>
              <p className={styles.featureDesc}>{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="how" className={styles.how}>
        <div className={styles.howBg} />
        <div className={styles.sectionHeader}>
          <span className={styles.sectionTag} style={{ background: 'rgba(255,255,255,0.15)', color: '#fff' }}>Comment ca marche</span>
          <h2 className={styles.sectionTitle} style={{ color: '#fff' }}>3 etapes simples</h2>
          <p className={styles.sectionDesc} style={{ color: 'rgba(255,255,255,0.75)' }}>
            De la soumission au paiement, tout est fluide et transparent.
          </p>
        </div>
        <div className={styles.stepsGrid}>
          {STEPS.map((step, i) => (
            <div key={i} className={styles.stepCard}>
              <span className={styles.stepNumber}>{step.number}</span>
              <h3 className={styles.stepTitle}>{step.title}</h3>
              <p className={styles.stepDesc}>{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="benefits" className={styles.stats}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionTag}>Pourquoi Depensys ?</span>
          <h2 className={styles.sectionTitle}>Des chiffres qui parlent</h2>
          <p className={styles.sectionDesc}>
            Une solution adoptee par des entreprises de toutes tailles.
          </p>
        </div>
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <span className={styles.statNumber}>
              <AnimatedCounter end={100} suffix="%" />
            </span>
            <span className={styles.statLabel}>Numerise</span>
            <p className={styles.statDesc}>Plus aucun papier a traiter</p>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statNumber}>
              <AnimatedCounter end={5} suffix="x" />
            </span>
            <span className={styles.statLabel}>Plus rapide</span>
            <p className={styles.statDesc}>Traitement des depenses accelere</p>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statNumber}>
              <AnimatedCounter end={24} suffix="/7" />
            </span>
            <span className={styles.statLabel}>Disponible</span>
            <p className={styles.statDesc}>Acces a vos donnees en permanence</p>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statNumber}>
              <AnimatedCounter end={100} suffix="%" />
            </span>
            <span className={styles.statLabel}>Securise</span>
            <p className={styles.statDesc}>Donnees protegees et chiffrees</p>
          </div>
        </div>
      </section>

      <section className={styles.ctaSection}>
        <div className={styles.ctaBg} />
        <div className={styles.ctaGlow} />
        <div className={styles.ctaContent}>
          <h2 className={styles.ctaTitle}>Pret a revolutionner votre gestion ?</h2>
          <p className={styles.ctaDesc}>
            Rejoignez les entreprises qui optimisent leurs depenses avec Depensys.
          </p>
          <Link to="/login" className={styles.ctaPrimary}>
            Acceder a l application
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </Link>
        </div>
      </section>

      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <div className={styles.footerBrand}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0F766E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="1" x2="12" y2="23" />
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
            <span>Depensys</span>
          </div>
          <div className={styles.footerLinks}>
            <button onClick={() => scrollTo('features')} className={styles.footerLink}>Fonctionnalites</button>
            <button onClick={() => scrollTo('how')} className={styles.footerLink}>Comment ca marche</button>
            <button onClick={() => scrollTo('benefits')} className={styles.footerLink}>Avantages</button>
            <Link to="/login" className={styles.footerLink}>Connexion</Link>
          </div>
          <p className={styles.footerCopy}>&copy; {new Date().getFullYear()} Depensys. Tous droits reserves.</p>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
