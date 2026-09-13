/**
 * Progress is always framed as "N of your last M", not a bare percentage or
 * grade - the percentage is secondary detail, never the headline.
 */
export function describeProgress(count: number, total: number, subject: string): string {
  if (total === 0) return `No ${subject} logged yet.`;
  return `${count} of your last ${total} ${subject}`;
}

const MISS_COPY = [
  "That's information about the system, not a verdict on you.",
  "A missed day doesn't erase the identity behind it - it just tells you something about the system.",
  "Worth noticing, not worth guilt. What would make this easier next time?",
];

export function recoveryNote(seed: number): string {
  return MISS_COPY[seed % MISS_COPY.length];
}
