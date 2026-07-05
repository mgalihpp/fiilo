"use client";

import {
  BankOutlined,
  BulbOutlined,
  CompassOutlined,
  FileTextOutlined,
  LineChartOutlined,
  SmileOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Button, Modal } from "antd";
import type { ReactNode } from "react";

// Sparkles glyph (inline SVG — antd has no sparkles icon).
function SparklesIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2l1.9 5.1L19 9l-5.1 1.9L12 16l-1.9-5.1L5 9l5.1-1.9L12 2z" />
      <path d="M19 14l.9 2.4L22 17l-2.1.6L19 20l-.9-2.4L16 17l2.1-.6L19 14z" />
      <path d="M5 14l.7 1.8L7.5 16.5 5.7 17 5 19l-.7-2L2.5 16.5 4.3 15.8 5 14z" />
    </svg>
  );
}

// ── Types (unchanged public API) ─────────────────────────────────────────

export type AiCardType = "score" | "forecast" | "enrichment";

export type AiScoreCard = {
  type: "score";
  title: string;
  score: number;
  maxScore?: number;
  label: string;
  labelColor: string;
  description: string;
  reasoning: string;
};

export type AiForecastCard = {
  type: "forecast";
  title: string;
  probability: number;
  risk: string;
  riskColor: string;
  reasoning: string;
};

export type AiEnrichmentCard = {
  type: "enrichment";
  title: string;
  fields: { icon: ReactNode; label: string; value: string }[];
};

export type AiCard = AiScoreCard | AiForecastCard | AiEnrichmentCard;

type AiResultModalProps = {
  open: boolean;
  cards: AiCard[];
  onClose: () => void;
};

// ── Palette ──────────────────────────────────────────────────────────────

const ACCENT = "#ff5d30"; // website orange theme
const ACCENT_SOFT = "rgba(255, 93, 48, 0.12)"; // transparent orange
const ACCENT_TRACK = "rgba(255, 93, 48, 0.16)"; // gauge track
const INK = "#1e1b4b";
const MUTE = "#71717a";
const HAIRLINE = "#ecebf3";

// antd color name (from pages) → pastel pill.
const PILL: Record<string, { bg: string; text: string }> = {
  green: { bg: "#dcfce7", text: "#16a34a" },
  gold: { bg: "#fef3c7", text: "#d97706" },
  red: { bg: "#fee2e2", text: "#ef4444" },
  default: { bg: "#f4f4f5", text: "#71717a" },
};
const pill = (c: string) => PILL[c] ?? PILL.default;

const CARD_ICONS: Record<AiCardType, ReactNode> = {
  score: <SmileOutlined />,
  forecast: <LineChartOutlined />,
  enrichment: <UserOutlined />,
};

const FIELD_ICONS: Record<string, ReactNode> = {
  industry: <BankOutlined />,
  "company size": <TeamOutlined />,
  summary: <FileTextOutlined />,
  "next action": <CompassOutlined />,
};

// ── Reusable bits ────────────────────────────────────────────────────────

function Pill({ label, color }: { label: string; color: string }) {
  const c = pill(color);
  return (
    <span
      style={{
        display: "inline-block",
        padding: "2px 10px",
        borderRadius: 999,
        fontSize: 12,
        fontWeight: 500,
        background: c.bg,
        color: c.text,
        lineHeight: 1.5,
      }}
    >
      {label}
    </span>
  );
}

function Reasoning({ text }: { text: string }) {
  return (
    <div style={{ marginTop: 18, borderTop: `1px solid ${HAIRLINE}`, paddingTop: 16 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
        <BulbOutlined style={{ fontSize: 15, color: ACCENT }} />
        <span style={{ fontSize: 14, fontWeight: 600, color: INK }}>Reasoning</span>
      </div>
      <p style={{ fontSize: 14, color: "#52525b", lineHeight: 1.7, margin: 0 }}>{text}</p>
    </div>
  );
}

// ── Score gauge (open-bottom 270° arc) ───────────────────────────────────

function ScoreGauge({
  score,
  maxScore,
  numberColor,
}: {
  score: number;
  maxScore: number;
  numberColor: string;
}) {
  const pct = Math.max(0, Math.min(score / maxScore, 1));
  const r = 54;
  const c = 2 * Math.PI * r;
  const span = 0.75; // 270° arc, gap centered at bottom (rotate 135°)
  const track = span * c;

  return (
    <div style={{ position: "relative", width: 148, height: 140, flexShrink: 0 }}>
      <svg width={148} height={148} viewBox="0 0 148 148">
        <g transform="rotate(135 74 74)">
          <circle
            cx={74}
            cy={74}
            r={r}
            fill="none"
            stroke={ACCENT_TRACK}
            strokeWidth={12}
            strokeLinecap="round"
            strokeDasharray={`${track} ${c}`}
          />
          <circle
            cx={74}
            cy={74}
            r={r}
            fill="none"
            stroke={ACCENT}
            strokeWidth={12}
            strokeLinecap="round"
            strokeDasharray={`${track * pct} ${c}`}
            style={{ transition: "stroke-dasharray 0.6s ease" }}
          />
        </g>
      </svg>
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          paddingTop: 8,
        }}
      >
        <span style={{ fontSize: 40, fontWeight: 700, color: numberColor, lineHeight: 1 }}>
          {score}
        </span>
        <span style={{ fontSize: 13, color: "#a1a1aa", marginTop: 3 }}>/ {maxScore}</span>
      </div>
    </div>
  );
}

// ── Card ─────────────────────────────────────────────────────────────────

function AiCardComponent({ card }: { card: AiCard }) {
  return (
    <div
      style={{
        background:
          card.type === "score"
            ? "linear-gradient(180deg, #ffffff 55%, #fff6f2 100%)"
            : "#ffffff",
        border: `1px solid ${HAIRLINE}`,
        borderRadius: 16,
        padding: 22,
      }}
    >
      {/* header */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: 12,
            background: ACCENT_SOFT,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: ACCENT,
            fontSize: 19,
            flexShrink: 0,
          }}
        >
          {CARD_ICONS[card.type]}
        </div>
        <div>
          <div style={{ fontSize: 17, fontWeight: 600, color: INK }}>{card.title}</div>
          <span
            style={{
              display: "inline-block",
              marginTop: 4,
              fontSize: 12,
              fontWeight: 500,
              color: ACCENT,
              background: ACCENT_SOFT,
              padding: "2px 9px",
              borderRadius: 6,
            }}
          >
            AI-generated result
          </span>
        </div>
      </div>

      {/* score */}
      {card.type === "score" && (
        <>
          <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
            <ScoreGauge
              score={card.score}
              maxScore={card.maxScore ?? 100}
              numberColor={pill(card.labelColor).text}
            />
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                <span style={{ fontSize: 15, color: MUTE }}>Score</span>
                <Pill label={card.label} color={card.labelColor} />
              </div>
              <div style={{ fontSize: 15, color: "#52525b", lineHeight: 1.6 }}>
                {card.description}
              </div>
            </div>
          </div>
          <Reasoning text={card.reasoning} />
        </>
      )}

      {/* forecast */}
      {card.type === "forecast" && (
        <>
          <div style={{ display: "flex", alignItems: "flex-start" }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, color: MUTE, marginBottom: 6 }}>Win probability</div>
              <div style={{ fontSize: 30, fontWeight: 700, color: ACCENT, lineHeight: 1 }}>
                {card.probability}%
              </div>
            </div>
            <div style={{ width: 1, alignSelf: "stretch", background: HAIRLINE, margin: "0 24px" }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, color: MUTE, marginBottom: 8 }}>Risk level</div>
              <Pill label={card.risk} color={card.riskColor} />
            </div>
          </div>
          <Reasoning text={card.reasoning} />
        </>
      )}

      {/* enrichment */}
      {card.type === "enrichment" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          {card.fields.map((f) => (
            <div key={f.label} style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  width: 150,
                  flexShrink: 0,
                  color: MUTE,
                  fontSize: 14,
                }}
              >
                <span style={{ color: ACCENT, fontSize: 16 }}>
                  {FIELD_ICONS[f.label.toLowerCase()] ?? f.icon ?? <FileTextOutlined />}
                </span>
                {f.label}
              </span>
              <span style={{ fontSize: 14, fontWeight: 500, color: INK, lineHeight: 1.5 }}>
                {f.value}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Modal ────────────────────────────────────────────────────────────────

export default function AiResultModal({ open, cards, onClose }: AiResultModalProps) {
  const multi = cards.length > 1;

  return (
    <Modal
      open={open}
      onCancel={onClose}
      width={multi ? 1040 : 560}
      centered
      footer={
        <div style={{ display: "flex", justifyContent: "flex-end", padding: "0 26px 22px" }}>
          <Button type="primary" onClick={onClose}>
            Done
          </Button>
        </div>
      }
      styles={{
        header: { display: "none" },
        container: { padding: 0, borderRadius: 20, background: "#fbfbfd", overflow: "hidden" },
        body: { padding: 0 },
        footer: { margin: 0 },
        mask: { background: "rgba(24,24,40,0.45)" },
      }}
    >
      <div style={{ padding: "26px 26px 22px" }}>
        {/* header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 22,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div
              style={{
                width: 42,
                height: 42,
                borderRadius: 12,
                background: ACCENT_SOFT,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: ACCENT,
              }}
            >
              <SparklesIcon size={20} />
            </div>
            <div>
              <div style={{ fontSize: 22, fontWeight: 700, color: INK, lineHeight: 1.15 }}>
                AI Insights
              </div>
              <div style={{ fontSize: 14, color: MUTE, marginTop: 2 }}>
                Smart insights generated from data
              </div>
            </div>
          </div>
        </div>

        {/* cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: multi ? "repeat(2, 1fr)" : "1fr",
            alignItems: "start",
            gap: 18,
          }}
        >
          {cards.map((card, i) => (
            <AiCardComponent key={`${card.type}-${i}`} card={card} />
          ))}
        </div>
      </div>
    </Modal>
  );
}
