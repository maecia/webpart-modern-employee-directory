import * as React from 'react'

const outlookLogoUrl = require('../../assets/outlook-logo.svg')

interface OutlookIconProps {
  size?: number
}

const OutlookIcon: React.FC<OutlookIconProps> = ({ size = 20 }) => (
  <img
    src={outlookLogoUrl}
    width={size}
    height={size}
    alt="Microsoft Outlook"
    style={{ display: 'block', objectFit: 'contain' }}
  />
)

export default OutlookIcon
