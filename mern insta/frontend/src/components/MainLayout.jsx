import React from 'react'
import { Outlet } from 'react-router-dom'
import { Sidebar } from 'lucide-react'

const MainLayout = () => {
  return (
    <div>
         <Sidebar/>
        <div>
            <Outlet/>
        </div>
    </div>
  )
}

export default MainLayout
