import { Badge } from "@/components/ui/badge";
import ScoreTooltip from "@/components/ats/ScoreTooltip";
import { computeCompositeScore } from "@/lib/computeCompositeScore";

export interface ScoreChipsProps {
  ai?: number | null;
  task?: number | null;
  interview?: number | null;
}

export default function ScoreChips({ ai, task, interview }: ScoreChipsProps) {
  const composite = computeCompositeScore({ ai, task, interview });

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <ScoreTooltip content={<span>AI score (model-based)</span>}>
        <Badge variant="outline" className="text-xs">AI {fmt(ai)}</Badge>
      </ScoreTooltip>
      <ScoreTooltip content={<span>Task & timesheet performance</span>}>
        <Badge variant="outline" className="text-xs">Task {fmt(task)}</Badge>
      </ScoreTooltip>
      <ScoreTooltip content={<span>Interview average</span>}>
        <Badge variant="outline" className="text-xs">Int {fmt(interview)}</Badge>
      </ScoreTooltip>
      <ScoreTooltip content={<span>Composite (AI 30% / Task 40% / Int 30%)</span>}>
        <Badge className="text-xs">Σ {fmt(composite)}</Badge>
      </ScoreTooltip>
    </div>
  );
}

function fmt(n?: number | null) {
  if (n == null) return "-";
  return `${Math.round(n * 10) / 10}/10`;
}
