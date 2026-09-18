import * as React from 'react'
import {
  DefaultButton,
  IconButton,
  PrimaryButton,
} from '@fluentui/react/lib/Button'
import { Text } from '@fluentui/react/lib/Text'
import { useTheme } from '@fluentui/react/lib/Theme'
import type { IStyle } from '@fluentui/react/lib/Styling'
import { strings } from '../../loc/mystrings'

interface PaginationProps {
  page: number
  totalPages: number
  startIndex: number
  endIndex: number
  totalItems: number
  onPageChange: (page: number) => void
}

/** Builds the list of page buttons, using an ellipsis when there are many pages. */
function getPageButtons(current: number, total: number): (number | 'gap')[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1)
  }

  const pages: (number | 'gap')[] = [1]
  const start = Math.max(2, current - 1)
  const end = Math.min(total - 1, current + 1)

  if (start > 2) pages.push('gap')
  for (let p = start; p <= end; p++) pages.push(p)
  if (end < total - 1) pages.push('gap')
  pages.push(total)

  return pages
}

function Chevron({ direction, color }: { direction: 'left' | 'right'; color: string }): JSX.Element {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      {direction === 'left' ? (
        <path
          d="M7.5 2.5L4 6l3.5 3.5"
          stroke={color}
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ) : (
        <path
          d="M4.5 2.5L8 6l-3.5 3.5"
          stroke={color}
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
    </svg>
  )
}

const squareStyle: IStyle = {
  minWidth: 32,
  height: 32,
  padding: 0,
}

const Pagination: React.FC<PaginationProps> = ({
  page,
  totalPages,
  startIndex,
  endIndex,
  totalItems,
  onPageChange,
}) => {
  const theme = useTheme()
  const primaryColor = theme?.palette?.themePrimary || '#1B7A6E'
  const disabledColor = theme?.palette?.neutralTertiary || 'var(--spdc-placeholder)'

  if (totalPages <= 1) {
    return null
  }

  const rangeText = strings.PaginationRange
    .replace('{0}', String(startIndex))
    .replace('{1}', String(endIndex))
    .replace('{2}', String(totalItems))

  const isFirst = page <= 1
  const isLast = page >= totalPages

  return (
    <nav
      aria-label={strings.PaginationLabel}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexWrap: 'wrap',
        gap: 12,
        marginTop: 24,
      }}
    >
      <Text
        variant="small"
        styles={{ root: { color: theme?.palette?.neutralSecondary } }}
      >
        {rangeText}
      </Text>

      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        <IconButton
          disabled={isFirst}
          ariaLabel={strings.PaginationPrevious}
          title={strings.PaginationPrevious}
          onClick={() => onPageChange(page - 1)}
          styles={{ root: squareStyle }}
          onRenderIcon={() => (
            <Chevron direction="left" color={isFirst ? disabledColor : primaryColor} />
          )}
        />

        {getPageButtons(page, totalPages).map((entry, index) =>
          entry === 'gap' ? (
            <Text
              key={`gap-${index}`}
              aria-hidden="true"
              styles={{
                root: { padding: '0 4px', color: theme?.palette?.neutralSecondary },
              }}
            >
              …
            </Text>
          ) : entry === page ? (
            <PrimaryButton
              key={entry}
              text={String(entry)}
              ariaLabel={String(entry)}
              onClick={() => onPageChange(entry)}
              {...({ 'aria-current': 'page' } as any)}
              styles={{ root: squareStyle }}
            />
          ) : (
            <DefaultButton
              key={entry}
              text={String(entry)}
              ariaLabel={String(entry)}
              onClick={() => onPageChange(entry)}
              styles={{ root: squareStyle }}
            />
          ),
        )}

        <IconButton
          disabled={isLast}
          ariaLabel={strings.PaginationNext}
          title={strings.PaginationNext}
          onClick={() => onPageChange(page + 1)}
          styles={{ root: squareStyle }}
          onRenderIcon={() => (
            <Chevron direction="right" color={isLast ? disabledColor : primaryColor} />
          )}
        />
      </div>
    </nav>
  )
}

export default Pagination
