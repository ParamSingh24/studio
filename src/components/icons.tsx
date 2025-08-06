import {
  type LucideIcon,
  File as FileIcon,
  Gamepad2,
  Briefcase,
  CodeXml,
  Globe,
  PlayCircle,
  Palette,
  Shield,
  HardDrive,
} from 'lucide-react';
import type { Category } from '@/lib/types';

export const CategoryIcons: Record<Category, LucideIcon> = {
  Games: Gamepad2,
  Productivity: Briefcase,
  Development: CodeXml,
  Browsers: Globe,
  Media: PlayCircle,
  Graphics: Palette,
  Security: Shield,
  "System Tools": HardDrive,
  Other: FileIcon,
};
