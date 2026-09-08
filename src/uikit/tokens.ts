export const PALETTE = [
  'navy',
  'navy-deep',
  'cyan',
  'lime',
  'orange',
  'red',
  'white',
  'black',
  'violet',
] as const
export type PaletteColor = (typeof PALETTE)[number]

export const TEXT_COLORS = ['primary', 'muted', 'onAccent', 'accent'] as const
export type TextColor = (typeof TEXT_COLORS)[number]

export const TEXT_VARIANTS = [
  'h1',
  'h2',
  'h3',
  'h3Bold',
  'h4',
  'bodyL',
  'bodyM',
  'bodyMBold',
  'bodyS',
  'logo',
  'cipher',
] as const
export type TextVariant = (typeof TEXT_VARIANTS)[number]

export const SPACINGS = [10, 14, 20, 25] as const
export type Spacing = (typeof SPACINGS)[number]

export const RADII = ['s', 'm', 'l', 'pill', 'full'] as const
export type Radius = (typeof RADII)[number]
