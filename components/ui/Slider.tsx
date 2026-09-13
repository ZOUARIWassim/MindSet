"use client";

import * as RadixSlider from "@radix-ui/react-slider";

export function Slider({
  value,
  onValueChange,
  min = 1,
  max = 5,
  step = 1,
}: {
  value: number;
  onValueChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
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
      <RadixSlider.Thumb className="block h-4 w-4 rounded-full bg-accent shadow focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-light" />
    </RadixSlider.Root>
  );
}
