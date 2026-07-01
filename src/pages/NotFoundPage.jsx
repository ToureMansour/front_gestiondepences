function NotFoundPage() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '60vh',
      textAlign: 'center',
    }}>
      <h1 style={{ fontSize: '72px', fontWeight: 800, color: '#0F766E', margin: '0 0 8px' }}>
        404
      </h1>
      <p style={{ fontSize: '18px', color: '#64748B', margin: '0 0 4px' }}>
        Page introuvable
      </p>
      <p style={{ fontSize: '14px', color: '#94A3B8', margin: 0 }}>
        La page que vous cherchez n&apos;existe pas.
      </p>
    </div>
  );
}

export default NotFoundPage;
