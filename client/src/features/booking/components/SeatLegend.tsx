export function SeatLegend() {
  const items = [
    {
      label: 'Ghế đã bán',
      box: { background: '#9ca3af', border: '1px solid #6b7280' },
    },
    {
      label: 'Ghế đang chọn',
      box: { background: '#16a34a', border: '1px solid #15803d' },
    },
    {
      label: 'Ghế thường',
      box: { background: '#ffffff', border: '1px solid #d1d5db' },
    },
    {
      label: 'Ghế VIP',
      box: { background: '#ffffff', border: '2px solid #ca8a04' },
    },
    {
      label: 'Ghế đôi',
      box: { background: '#ffffff', border: '2px solid #e879a9' },
    },
    {
      label: 'Đang giữ',
      box: { background: '#fde68a', border: '2px solid #f59e0b' },
    },
  ];

  return (
    <div
      style={{
        marginTop: 24,
        paddingTop: 16,
        borderTop: '1px solid #e5e7eb',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '12px 20px',
        justifyContent: 'center',
      }}
    >
      {items.map((item) => (
        <div
          key={item.label}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            fontSize: 12,
            color: '#374151',
          }}
        >
          <div
            style={{
              width: 22,
              height: 22,
              borderRadius: '3px 3px 1px 1px',
              ...item.box,
              boxShadow: '0 1px 2px rgba(0,0,0,0.06)',
            }}
          />
          <span>{item.label}</span>
        </div>
      ))}
    </div>
  );
}
