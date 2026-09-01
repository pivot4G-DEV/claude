/**
 * Marca da HBM — vetor redesenhado a partir da arte enviada pelo cliente
 * (monograma H+B+M com um pico duplo em azul-marinho/azul). Se o cliente
 * tiver o arquivo vetorial oficial (SVG/AI/EPS), troque este componente
 * pelo original para fidelidade 100% — isto é uma reconstrução fiel, não
 * o arquivo-fonte.
 */
export function Logo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 960 800" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <polygon points="515,90 420,280 420,790 515,790" fill="#0D1642" />
      <path
        d="M 145,790 L 145,540 C 145,455 150,410 98,358 C 145,392 178,435 178,485 L 178,790 Z"
        fill="#0D1642"
      />
      <rect x="145" y="565" width="270" height="52" fill="#0D1642" />
      <path d="M 515,90 L 592,285 L 592,790 L 515,790 Z" fill="#2E58E0" />
      <path d="M 590,300 L 590,393 C 662,393 662,300 590,300 Z" fill="#2E58E0" />
      <path d="M 590,407 L 590,502 C 662,502 662,407 590,407 Z" fill="#2E58E0" />
      <rect x="590" y="393" width="45" height="14" fill="#fff" />
      <path
        d="M 592,790 L 592,700 L 715,495 L 800,655 L 895,495 L 960,695 L 960,790 Z"
        fill="#2E58E0"
      />
    </svg>
  );
}
