import React from "react"
import { NavLink } from "react-router-dom"
import ApperIcon from "@/components/ApperIcon"
import { cn } from "@/utils/cn"

const Sidebar = ({ isOpen, onClose }) => {
  const navigation = [
    { name: "Dashboard", href: "", icon: "LayoutDashboard" },
    { name: "Students", href: "students", icon: "Users" },
    { name: "Grades", href: "grades", icon: "Trophy" },
    { name: "Attendance", href: "attendance", icon: "Calendar" },
    { name: "Assignments", href: "assignments", icon: "FileText" }
  ]

  // Desktop sidebar (static)
  const DesktopSidebar = () => (
    <div className="hidden lg:block w-64 bg-white border-r border-gray-200 h-full">
      <div className="flex flex-col h-full">
        <div className="flex-1 py-6">
          <nav className="px-4 space-y-2">
            {navigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                className={({ isActive }) =>
                  cn(
                    "flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200",
                    isActive
                      ? "bg-gradient-to-r from-primary to-blue-600 text-white shadow-lg"
                      : "text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:text-primary"
                  )
                }
              >
                <ApperIcon name={item.icon} size={20} className="mr-3" />
                {item.name}
              </NavLink>
            ))}
          </nav>
        </div>
        
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-blue-600 rounded-full flex items-center justify-center shadow-md">
              <ApperIcon name="GraduationCap" size={20} className="text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-800 truncate">ClassTrack Pro</p>
              <p className="text-xs text-gray-600">Education Management</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  // Mobile sidebar (overlay with transform)
  const MobileSidebar = () => (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={cn(
        "lg:hidden fixed top-0 left-0 w-64 h-full bg-white border-r border-gray-200 z-50 transition-transform duration-300 transform",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-blue-600 rounded-lg flex items-center justify-center">
                <ApperIcon name="GraduationCap" size={20} className="text-white" />
              </div>
              <h2 className="text-lg font-bold text-gray-800">ClassTrack</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <ApperIcon name="X" size={20} className="text-gray-600" />
            </button>
          </div>

          <div className="flex-1 py-6">
            <nav className="px-4 space-y-2">
              {navigation.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.href}
                  onClick={onClose}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200",
                      isActive
                        ? "bg-gradient-to-r from-primary to-blue-600 text-white shadow-lg"
                        : "text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:text-primary"
                    )
                  }
                >
                  <ApperIcon name={item.icon} size={20} className="mr-3" />
                  {item.name}
                </NavLink>
              ))}
            </nav>
          </div>
          
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-blue-600 rounded-full flex items-center justify-center shadow-md">
                <ApperIcon name="GraduationCap" size={20} className="text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 truncate">ClassTrack Pro</p>
                <p className="text-xs text-gray-600">Education Management</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )

  return (
    <>
      <DesktopSidebar />
      <MobileSidebar />
    </>
  )
}

export default Sidebar