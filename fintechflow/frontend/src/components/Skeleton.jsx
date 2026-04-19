export function SkeletonCard({ height = 80 }) {
  return <div className="skeleton" style={{ height }} />;
}

export function SkeletonRow() {
  return (
    <div className="skeleton-row">
      <div className="skeleton" style={{ width: 40, height: 40, borderRadius: '50%' }} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div className="skeleton" style={{ width: '60%', height: 16 }} />
        <div className="skeleton" style={{ width: '40%', height: 12 }} />
      </div>
      <div className="skeleton" style={{ width: 80, height: 20 }} />
    </div>
  );
}
