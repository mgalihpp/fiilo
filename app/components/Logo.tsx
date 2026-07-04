import Image from "next/image";

/**
 * Logo — official Fiilo brand mark served straight from /public/logo.svg
 * (orange icon + "Fiilo" wordmark).
 *
 * @param className - extra classes for sizing/spacing in different contexts
 */
export default function Logo({ className = "" }: { className?: string }) {
  return (
    <a
      href="/"
      className={`inline-flex items-center ${className}`}
      aria-label="Fiilo home"
    >
      <Image
        src="/logo.svg"
        alt="Fiilo"
        width={106}
        height={45}
        priority
        className="h-10 w-auto"
      />
    </a>
  );
}
