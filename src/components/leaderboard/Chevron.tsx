export const Chevron = ({ open, color }: { open: boolean; color: string }) => (
  <svg
    width={11}
    height={11}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    aria-hidden="true"
    style={{
      flexShrink: 0,
      transform: open ? "rotate(90deg)" : "none",
      transition: "transform 0.2s ease",
    }}
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
  </svg>
);
