import Spinner from '../ui/Spinner/Spinner';

function LoadingScreen() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '60vh',
      gap: '16px',
    }}>
      <Spinner size="lg" />
      <p style={{ color: '#94A3B8', fontSize: '14px', margin: 0 }}>
        Chargement...
      </p>
    </div>
  );
}

export default LoadingScreen;
