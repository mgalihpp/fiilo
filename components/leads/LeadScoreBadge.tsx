import { Tag } from "antd";

// Green ≥70, orange ≥40, red below — quick visual triage.
export default function LeadScoreBadge({ score }: { score: number }) {
  const color = score >= 70 ? "green" : score >= 40 ? "orange" : "red";
  return <Tag color={color}>{Math.round(score)}</Tag>;
}
