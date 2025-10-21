import { Button } from "../ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { useNavigate, useLocation } from "react-router-dom"
import { authAPI } from "../../../service/api/autAPI"
import { useState, useEffect } from "react"

export function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()
  const [staffName, setStaffName] = useState<string>("")

  useEffect(() => {
    // Get staff name from localStorage
    const userData = localStorage.getItem('userData')
    if (userData) {
      try {
        const user = JSON.parse(userData)
        if (user.staff?.full_name) {
          setStaffName(user.staff.full_name)
        } else {
          setStaffName(user.username)
        }
      } catch (error) {
        console.error('Error parsing user data:', error)
      }
    }
  }, [])

  const handleLogout = () => {
    authAPI.logout()
    navigate('/login')
  }

  // Get initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const routeTitles : Record<string, string> ={
    "/dashboard/overview": "Overview",
    "/dashboard/information-technology-department": "Information Technology Department",
    "/dashboard/digital-marketing-department": "Digital Marketing Department",
    "/dashboard/customer-support-department": "Customer Support Department",
    "/dashboard/credit-department": "Credit Department",
    "/dashboard/collection-department": "Collection Department",
    "/dashboard/finance-department": "Finance Department",
    "/dashboard/human-resources-department": "Human Resources Department",
    "/dashboard/reports": "Reports",
    "/dashboard/users-management": "User Management"
  }

  const title = routeTitles[location.pathname] || "Overview"

  return (
    <header className="w-full h-14 border-b bg-white flex items-center justify-between px-6">
      <h2 className="text-lg font-semibold">{title}</h2>
      <div className="flex items-center space-x-4">
        <Button 
          variant="outline" 
          className="bg-red-800 text-white border-red-800 hover:bg-red-900 hover:text-white"
          onClick={handleLogout}
        >
          Log Out
        </Button>
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>{getInitials(staffName || "User")}</AvatarFallback>
        </Avatar>
      </div>
    </header>
  )
}
