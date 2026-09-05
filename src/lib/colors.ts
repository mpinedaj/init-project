import type { TagColor } from '../types'

export const TAG_COLORS: { id: TagColor; label: string; hex: string }[] = [
  { id: 'red', label: 'Rojo', hex: '#EF4444' },
  { id: 'orange', label: 'Naranja', hex: '#F97316' },
  { id: 'amber', label: 'Ámbar', hex: '#F59E0B' },
  { id: 'lime', label: 'Lima', hex: '#84CC16' },
  { id: 'green', label: 'Verde', hex: '#10B981' },
  { id: 'teal', label: 'Teal', hex: '#14B8A6' },
  { id: 'cyan', label: 'Cian', hex: '#06B6D4' },
  { id: 'blue', label: 'Azul', hex: '#3B82F6' },
  { id: 'violet', label: 'Violeta', hex: '#8B5CF6' },
  { id: 'pink', label: 'Rosa', hex: '#EC4899' },
]

export function getTagHex(color?: TagColor): string {
  return TAG_COLORS.find((c) => c.id === color)?.hex ?? '#9A9794'
}