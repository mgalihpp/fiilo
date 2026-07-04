import Image from "next/image";

export default function Logo({
  className = "",
  href = "/",
  size = 40,
}: {
  className?: string;
  href?: string;
  size?: number;
}) {
  return (
    <a
      href={href}
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
        style={{ height: size, width: "auto" }}
      />
    </a>
  );
}
