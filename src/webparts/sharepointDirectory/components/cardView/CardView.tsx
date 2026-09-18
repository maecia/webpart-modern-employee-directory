import * as React from 'react'
import { Member } from '../../../../models/Member'
import { usePagination } from '../../../../hooks/usePagination'
import Pagination from '../shared/Pagination'
import MemberCard from './MemberCard'

interface CardViewProps {
  members: Member[]
  cardFieldOrder: string[]
  pageSize: number
  /** Changes when the search or filters change, to reset the current page. */
  resetKey?: string
  onMemberClick: (member: Member) => void
}

const CardView: React.FC<CardViewProps> = ({
  members,
  cardFieldOrder,
  pageSize,
  resetKey,
  onMemberClick,
}) => {
  const {
    pageItems,
    page,
    totalPages,
    startIndex,
    endIndex,
    totalItems,
    setPage,
    reset,
  } = usePagination(members, pageSize)

  React.useEffect(() => {
    reset()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resetKey])

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
        {pageItems.map((member) => (
          <MemberCard
            key={member.id}
            member={member}
            cardFieldOrder={cardFieldOrder}
            members={members}
            onClick={onMemberClick}
          />
        ))}
      </div>

      <Pagination
        page={page}
        totalPages={totalPages}
        startIndex={startIndex}
        endIndex={endIndex}
        totalItems={totalItems}
        onPageChange={setPage}
      />
    </div>
  )
}

export default CardView
