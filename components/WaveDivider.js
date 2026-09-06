export default function WaveDivider({ fromColor = '#ffffff', toColor = '#efe8d8', flip = false }) {
  return (
    <div style={{ backgroundColor: fromColor }} aria-hidden="true">
      <svg
        viewBox="0 0 1440 60"
        className="w-full h-10 sm:h-14 block"
        preserveAspectRatio="none"
        style={flip ? { transform: 'scaleY(-1)' } : undefined}
      >
        <path d="M0,30 C280,60 420,0 720,20 C1020,40 1180,0 1440,25 L1440,60 L0,60 Z" fill={toColor} />
      </svg>
    </div>
  );
}
