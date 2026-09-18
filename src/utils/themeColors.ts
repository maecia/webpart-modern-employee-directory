import { ITheme } from '@fluentui/react/lib/Theme'

/**
 * Theme-aware color tokens exposed as CSS custom properties.
 *
 * The light values are exactly the colors that were hard-coded before, so the
 * light theme rendering is byte-for-byte identical. The dark values use the
 * Fluent dark palette so the web part stays readable on dark themes.
 *
 * Usage: spread `themeColorVars(theme)` on a root element, then reference
 * `var(--spdc-*)` in child styles.
 */
const LIGHT_VARS: Record<string, string> = {
  '--spdc-surface': '#ffffff',
  '--spdc-page-bg': '#faf9f8',
  '--spdc-surface-alt': '#f8f9fb',
  '--spdc-action-hover': '#f3f4f6',
  '--spdc-hover': '#f3f2f1',
  '--spdc-header-hover': '#eef0f4',
  '--spdc-divider': '#edebe9',
  '--spdc-border': '#e1dfdd',
  '--spdc-border-alt': '#e0e0e0',
  '--spdc-border-input': '#c7c9cc',
  '--spdc-border-strong': '#d1d1d1',
  '--spdc-text-muted': '#616161',
  '--spdc-text-primary': '#201f1e',
  '--spdc-text-strong': '#323130',
  '--spdc-text-secondary': '#605e5c',
  '--spdc-text-tertiary': '#8a8886',
  '--spdc-placeholder': '#a19f9d',
  '--spdc-brand-solid': '#1b7a6e',
  '--spdc-brand-text': '#1b7a6e',
  '--spdc-brand-tint': '#f0faf8',
  '--spdc-info-tint': '#f0f6ff',
  '--spdc-on-brand': '#ffffff',
}

const DARK_VARS: Record<string, string> = {
  '--spdc-surface': '#1b1a19',
  '--spdc-page-bg': '#1b1a19',
  '--spdc-surface-alt': '#252423',
  '--spdc-action-hover': '#323130',
  '--spdc-hover': '#323130',
  '--spdc-header-hover': '#3b3a39',
  '--spdc-divider': '#3b3a39',
  '--spdc-border': '#484644',
  '--spdc-border-alt': '#484644',
  '--spdc-border-input': '#6f6f6f',
  '--spdc-border-strong': '#6f6f6f',
  '--spdc-text-muted': '#c8c6c4',
  '--spdc-text-primary': '#ffffff',
  '--spdc-text-strong': '#f3f2f1',
  '--spdc-text-secondary': '#c8c6c4',
  '--spdc-text-tertiary': '#a19f9d',
  '--spdc-placeholder': '#a19f9d',
  '--spdc-brand-solid': '#1b7a6e',
  '--spdc-brand-text': '#5fc7b6',
  '--spdc-brand-tint': '#1e3a35',
  '--spdc-info-tint': '#1b2a3a',
  '--spdc-on-brand': '#0b1f1a',
}

function relativeLuminance(hex: string): number {
  const match = /^#?([0-9a-f]{6})$/i.exec((hex || '').trim())
  if (!match) return 1
  const value = parseInt(match[1], 16)
  const channels = [(value >> 16) & 255, (value >> 8) & 255, value & 255].map((c) => {
    const v = c / 255
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)
  })
  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2]
}

/**
 * Detects a dark theme. Uses, in order: the Fluent `isInverted` flag, the
 * luminance of the body background, then the luminance of the body text
 * (light text implies a dark theme).
 */
export function isDarkTheme(theme?: ITheme | null): boolean {
  if (!theme) return false
  if ((theme as any).isInverted) return true

  const background =
    theme.semanticColors?.bodyBackground || theme.palette?.white || ''
  if (relativeLuminance(background) < 0.5) return true

  const text = theme.semanticColors?.bodyText || theme.palette?.neutralPrimary || ''
  return relativeLuminance(text) > 0.6
}

/** Returns the CSS custom properties to spread on a root element. */
export function themeColorVars(theme?: ITheme | null): Record<string, string> {
  return isDarkTheme(theme) ? DARK_VARS : LIGHT_VARS
}
