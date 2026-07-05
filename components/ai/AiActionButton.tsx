"use client";

import { LoadingOutlined } from "@ant-design/icons";

function SparklesIcon() {
  const id = "sparkle-grad";
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={id} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8b5cf6" />
          <stop offset="50%" stopColor="#6366f1" />
          <stop offset="100%" stopColor="#3b82f6" />
        </linearGradient>
      </defs>
      {/* Main 4-point star */}
      <path
        d="M12 2L13.8 8.4L20 10L13.8 11.6L12 18L10.2 11.6L4 10L10.2 8.4L12 2Z"
        fill={`url(#${id})`}
      />
      {/* Small star top-right */}
      <path
        d="M19 14L19.8 16.2L22 17L19.8 17.8L19 20L18.2 17.8L16 17L18.2 16.2L19 14Z"
        fill={`url(#${id})`}
        opacity="0.8"
      />
      {/* Small star bottom-left */}
      <path
        d="M5 14L5.6 15.6L7.2 16.2L5.6 16.8L5 18.4L4.4 16.8L2.8 16.2L4.4 15.6L5 14Z"
        fill={`url(#${id})`}
        opacity="0.6"
      />
      {/* Tiny sparkle dot */}
      <circle cx="17" cy="6" r="1" fill="#a78bfa" opacity="0.7" />
      <circle cx="7" cy="19" r="0.8" fill="#818cf8" opacity="0.5" />
    </svg>
  );
}

export default function AiActionButton({
  label,
  loading,
  disabled,
  onClick,
}: {
  label: string;
  loading?: boolean;
  disabled?: boolean;
  onClick: () => void;
}) {
  const off = loading || disabled;
  return (
    <button
      type="button"
      className="ai-spark-btn"
      onClick={onClick}
      disabled={off}
      title={label}
      aria-label={label}
      style={{
        position: "relative",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: 28,
        height: 28,
        border: "1px solid #e4e4e7",
        borderRadius: 8,
        cursor: off ? "not-allowed" : "pointer",
        background: "#ffffff",
      }}
    >
      {loading ? (
        <LoadingOutlined style={{ color: "#8b5cf6" }} />
      ) : (
        <SparklesIcon />
      )}
    </button>
  );
}
