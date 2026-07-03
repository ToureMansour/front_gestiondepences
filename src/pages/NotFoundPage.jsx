import { useTranslation } from 'react-i18next';

function NotFoundPage() {
  const { t } = useTranslation();
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
        {t('notFound.title')}
      </p>
      <p style={{ fontSize: '14px', color: '#94A3B8', margin: 0 }}>
        {t('notFound.message')}
      </p>
    </div>
  );
}

export default NotFoundPage;
