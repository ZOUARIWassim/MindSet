import React from 'react';
import { Moon, Dumbbell, Apple, BookOpen, Star, LucideIcon } from 'lucide-react';
import { HabitCategory } from '../../types/habit';
import { categoryColors } from '../../utils/categoryConfig';

interface CategoryIconProps {
  category: HabitCategory;
  size?: number;
}

const icons: Record<HabitCategory, LucideIcon> = {
  spiritual: Moon,
  workout: Dumbbell,
  nutrition: Apple,
  personal: BookOpen,
  other: Star,
};

const CategoryIcon: React.FC<CategoryIconProps> = ({ category, size = 16 }) => {
  const Icon = icons[category];
  return <Icon size={size} color={categoryColors[category]} />;
};

export default CategoryIcon;
