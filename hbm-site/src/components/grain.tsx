/**
 * Textura de grão bem sutil sobre a página inteira — o tipo de detalhe
 * que faz um site parecer produto caro em vez de gerado em template.
 * Puramente decorativo (aria-hidden), não interfere na leitura nem no
 * clique em nada abaixo dela.
 */
export function Grain() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[60] opacity-[0.05] mix-blend-overlay"
    >
      <svg width="100%" height="100%">
        <filter id="hbm-grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
        </filter>
        <rect width="100%" height="100%" filter="url(#hbm-grain)" />
      </svg>
    </div>
  );
}
