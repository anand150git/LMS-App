import React from 'react'
import Logo from './Logo'
import SidebarRoutes from './SidebarRoutes'

const Sidebar = () => {
  return (
    <div className='h-full border-r flex-col overflow-y-auto bg-white shadow-sm'>
      <div className='px-4 py-6 mb-4'>
        <Logo/>
      </div>
      <div className='flex flex-col wo-full'>
        <SidebarRoutes/>
      </div>
    </div>
  )
}

export default Sidebar