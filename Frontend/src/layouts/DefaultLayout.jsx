import React from 'react'

const DefaultLayout = ({ children }) => {
  return (
    <div className='min-h-screen app-root'>
      {children}
    </div>
  )
}

export default DefaultLayout
