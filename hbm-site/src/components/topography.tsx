type TopographyProps = {
  className?: string;
  /** Posição do centro das curvas dentro do contêiner. */
  origin?: "bottom-right" | "top-left";
};

const RINGS = [
  { size: 380, radius: "44% 56% 62% 38% / 48% 42% 58% 52%", rotate: -6, opacity: 0.16 },
  { size: 560, radius: "58% 42% 38% 62% / 42% 58% 42% 58%", rotate: 8, opacity: 0.13 },
  { size: 740, radius: "38% 62% 55% 45% / 60% 40% 60% 40%", rotate: -3, opacity: 0.1 },
  { size: 920, radius: "50% 50% 42% 58% / 45% 55% 45% 55%", rotate: 5, opacity: 0.07 },
  { size: 1100, radius: "45% 55% 60% 40% / 55% 45% 55% 45%", rotate: -8, opacity: 0.05 },
];

/**
 * Curvas de nível (topografia) bem discretas, ecoando o pico duplo da
 * logo da HBM — dá textura às seções escuras sem virar padrão gráfico
 * chamativo. Puramente decorativo.
 */
export function Topography({ className = "", origin = "bottom-right" }: TopographyProps) {
  const anchor = origin === "bottom-right" ? "bottom-0 right-0" : "top-0 left-0";
  const translate =
    origin === "bottom-right" ? "translate-x-1/3 translate-y-1/3" : "-translate-x-1/3 -translate-y-1/3";

  return (
    <div aria-hidden className={`pointer-events-none absolute ${anchor} ${className}`}>
      {RINGS.map((ring, i) => (
        <div
          key={i}
          className={`absolute ${anchor} ${translate} border border-brand-on-dark`}
          style={{
            width: ring.size,
            height: ring.size,
            borderRadius: ring.radius,
            transform: `${origin === "bottom-right" ? "translate(33%,33%)" : "translate(-33%,-33%)"} rotate(${ring.rotate}deg)`,
            opacity: ring.opacity,
          }}
        />
      ))}
    </div>
  );
}
