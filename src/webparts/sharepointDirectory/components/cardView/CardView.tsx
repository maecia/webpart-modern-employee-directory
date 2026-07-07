import * as React from 'react'
import { useTheme } from '@fluentui/react/lib/Theme'
import { Member } from '../../../../models/Member'
import { CardFieldName } from '../../../../models/DirectoryConfig'
import { usePagination } from '../../../../hooks/usePagination'
import MemberCard from './MemberCard'

interface CardViewProps {
  members: Member[]
  cardFields: CardFieldName[]
  onMemberClick: (member: Member) => void
}

const CardView: React.FC<CardViewProps> = ({
  members,
  cardFields,
  onMemberClick,
}) => {
  const { visibleItems, hasMore, loadMore } = usePagination(members, 'card')
  const theme = useTheme()
  const primaryColor = theme?.palette?.themePrimary || '#1B7A6E'
  const [loadMoreHovered, setLoadMoreHovered] = React.useState(false)

  return (
    <div style={{ padding: '16px 24px 32px' }}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(282px, 1fr))',
          gap: 16,
          width: '100%',
        }}
      >
        {visibleItems.map((member: Member) => (
          <MemberCard
            key={member.id}
            member={member}
            cardFields={cardFields}
            onClick={onMemberClick}
          />
        ))}
      </div>

      {hasMore && (
        <div
          style={{ display: 'flex', justifyContent: 'center', marginTop: 24 }}
        >
          <button
            onClick={loadMore}
            onMouseEnter={() => setLoadMoreHovered(true)}
            onMouseLeave={() => setLoadMoreHovered(false)}
            style={{
              padding: '8px 24px',
              borderRadius: 20,
              border: `1px solid ${primaryColor}`,
              background: loadMoreHovered ? '#f3f2f1' : '#ffffff',
              cursor: 'pointer',
              fontSize: 14,
              color: primaryColor,
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              transition: 'background 0.15s ease',
            }}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M7 1a1 1 0 0 1 1 1v4h4a1 1 0 1 1 0 2H8v4a1 1 0 1 1-2 0V8H2a1 1 0 1 1 0-2h4V2a1 1 0 0 1 1-1z" />
            </svg>
            Voir plus de collaborateurs
          </button>
        </div>
      )}
    </div>
  )
}

export default CardView
