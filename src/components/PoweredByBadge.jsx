export default function PoweredByBadge() {
  return (
    <div
      className="glass-panel motion-border-gold"
      style={{
        padding: '16px 32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '24px',
        flexWrap: 'wrap',
        margin: '0 24px 0',
        borderRadius: '10px',
        animation: 'fadeInUp 0.6s ease-out both',
      }}
    >
      <span style={{ fontSize: '0.875rem', color: 'rgba(220, 196, 155, 0.7)' }}>
        ⚡ Built on{' '}
        <strong style={{ color: '#dcc49b' }}>ForgedOps.AI™</strong>
        {' '}Infrastructure
      </span>
      <a
        href="https://forgedops.ai"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          fontSize: '0.875rem',
          color: '#dcc49b',
          textDecoration: 'none',
          fontWeight: 600,
          transition: 'opacity 0.3s',
        }}
        onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.7'; }}
        onMouseLeave={(e) => { e.currentTarget.style.opacity = '1'; }}
      >
        Explore →
      </a>
    </div>
  );
}
