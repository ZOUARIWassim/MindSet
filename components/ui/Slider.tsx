"use client";

import * as RadixSlider from "@radix-ui/react-slider";

export function Slider({
  value,
  onValueChange,
  min = 1,
  max = 5,
  step = 1,
  ariaLabel,
}: {
  value: number;
  onValueChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  ariaLabel: string;
}) {
  return (
    <RadixSlider.Root
      className="relative flex h-5 w-full touch-none items-center"
      value={[value]}
      onValueChange={([next]) => onValueChange(next)}
      min={min}
      max={max}
      step={step}
    >
      <RadixSlider.Track className="relative h-1.5 grow rounded-full bg-surface-tertiary">
        <RadixSlider.Range className="absolute h-full rounded-full bg-accent" />
      </RadixSlider.Track>
      <RadixSlider.Thumb
        aria-label={ariaLabel}
        className="block h-5 w-5 rounded-full border-2 border-surface bg-accent shadow-soft transition-transform duration-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-light active:scale-110"
      />
    </RadixSlider.Root>
  );
}
