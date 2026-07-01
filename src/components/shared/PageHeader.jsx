function PageHeader({ title, description, actions }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      gap: '16px',
      marginBottom: '24px',
      flexWrap: 'wrap',
    }}>
      <div>
        <h1 style={{
          fontSize: '24px',
          fontWeight: 700,
          color: '#1E293B',
          margin: '0 0 4px',
        }}>
          {title}
        </h1>
        {description && (
          <p style={{ margin: 0, fontSize: '14px', color: '#64748B' }}>
            {description}
          </p>
        )}
      </div>
      {actions && (
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          {actions}
        </div>
      )}
    </div>
  );
}

export default PageHeader;
