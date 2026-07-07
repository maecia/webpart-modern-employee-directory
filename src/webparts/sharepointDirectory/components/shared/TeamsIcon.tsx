import * as React from 'react'

interface TeamsIconProps {
  size?: number
}

const teamsLogoUrl = require('../../assets/teams-logo.png')

const TeamsIcon: React.FC<TeamsIconProps> = ({ size = 20 }) => (
  <img
    src={teamsLogoUrl}
    width={size}
    height={size}
    alt="Microsoft Teams"
    style={{ display: 'block', objectFit: 'contain' }}
  />
)

export default TeamsIcon
