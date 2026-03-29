export default function ParticleBackground() {
  const rings = [0, 1, 2, 3];
  const particles = Array.from({ length: 40 }, (_, idx) => ({
    id: idx,
    size: idx % 5 === 0 ? "2px" : "1px",
    left: `${(idx * 13 + 7) % 100}%`,
    top: `${(idx * 17 + 11) % 100}%`,
    color:
      idx % 3 === 0
        ? "rgba(36,230,255,0.6)"
        : idx % 3 === 1
          ? "rgba(165,107,255,0.6)"
          : "rgba(255,255,255,0.3)",
    duration: 3 + (idx % 4),
    delay: (idx * 0.3) % 5,
  }));

  return (
    <div
      className="absolute inset-0 overflow-hidden pointer-events-none"
      style={{ zIndex: 0 }}
    >
      {/* HUD rings */}
      <div
        className="absolute"
        style={{
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -60%)",
          width: "600px",
          height: "600px",
        }}
      >
        {rings.map((i) => (
          <div
            key={`ring-${i}`}
            className="absolute rounded-full"
            style={{
              inset: `${i * 50}px`,
              border: "1px solid rgba(36,230,255,0.08)",
              animation: `ring-pulse ${2 + i * 0.5}s ease-in-out infinite`,
              animationDelay: `${i * 0.3}s`,
            }}
          />
        ))}
      </div>

      {/* Left cyan arc */}
      <div
        style={{
          position: "absolute",
          left: "-150px",
          top: "20%",
          width: "400px",
          height: "400px",
          borderRadius: "50%",
          border: "2px solid rgba(36,230,255,0.15)",
          filter: "blur(30px)",
          background:
            "radial-gradient(circle, rgba(36,230,255,0.06) 0%, transparent 70%)",
        }}
      />

      {/* Right violet/magenta arc */}
      <div
        style={{
          position: "absolute",
          right: "-150px",
          top: "10%",
          width: "500px",
          height: "500px",
          borderRadius: "50%",
          border: "2px solid rgba(165,107,255,0.15)",
          filter: "blur(35px)",
          background:
            "radial-gradient(circle, rgba(165,107,255,0.06) 0%, transparent 70%)",
        }}
      />

      {/* Particle dots */}
      {particles.map((p) => (
        <div
          key={`particle-${p.id}`}
          className="absolute rounded-full"
          style={{
            width: p.size,
            height: p.size,
            left: p.left,
            top: p.top,
            background: p.color,
            animation: `ring-pulse ${p.duration}s ease-in-out infinite`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
    </div>
  );
}
