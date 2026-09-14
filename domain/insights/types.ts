import type { InsightKind } from "../userContext";
import type { LocalDate } from "../timezone";

export interface InsightDraft {
  kind: InsightKind;
  title: string;
  body: string;
  evidence: Record<string, unknown>;
  periodStart: LocalDate;
  periodEnd: LocalDate;
}
