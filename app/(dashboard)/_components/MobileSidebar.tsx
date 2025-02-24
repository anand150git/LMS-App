import { Menu } from 'lucide-react'
import React from 'react'
import {
  Sheet,
  SheetContent,
  SheetTrigger,

} from "@/components/ui/sheet"

import { DialogTitle } from "@/components/ui/dialog"
import Sidebar from './Sidebar'

const MobileSidebar = () => {
  return (
    <Sheet>
      <SheetTrigger className='md:hidden pr-4 hover:opacity-75 transition'>
        <Menu />
      </SheetTrigger>
      <SheetContent side="left" className='p-0 bg-white'>
        <DialogTitle className='hidden'>Sidebar</DialogTitle>
        <Sidebar />
      </SheetContent>
    </Sheet>
  )
}

export default MobileSidebar