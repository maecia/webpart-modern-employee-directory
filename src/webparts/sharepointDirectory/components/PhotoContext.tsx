import * as React from 'react'

export type GetPhotoFn = (userId: string) => Promise<string | null>

export const PhotoContext = React.createContext<GetPhotoFn | null>(null)
