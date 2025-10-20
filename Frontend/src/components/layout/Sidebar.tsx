import { NavLink } from "react-router-dom";
import { Home, UserCheck, User, Users, CreditCard, FileText, DollarSign, Briefcase, BarChart, Cpu } from "lucide-react";

interface MenuItem {
  label: string;
  icon: React.ReactNode;
  path: string;
}

const menuItems: MenuItem[] = [
  { label: "Overview", icon: <Home className="h-4 w-4 mr-2" />, path: "/dashboard/overview" },
  { label: "Information Technology", icon: <Cpu className="h-4 w-4 mr-2" />, path: "/dashboard/information-technology-department" },
  { label: "Digital Marketing", icon: <Briefcase className="h-4 w-4 mr-2" />, path: "/dashboard/digital-marketing-department" },
  { label: "Customer Support", icon: <User className="h-4 w-4 mr-2" />, path: "/dashboard/customer-support-department" },
  { label: "Credit", icon: <CreditCard className="h-4 w-4 mr-2" />, path: "/dashboard/credit-department" },
  { label: "Collection", icon: <FileText className="h-4 w-4 mr-2" />, path: "/dashboard/collection-department" },
  { label: "Finance", icon: <DollarSign className="h-4 w-4 mr-2" />, path: "/dashboard/finance-department" },
  { label: "Human Resources", icon: <UserCheck className="h-4 w-4 mr-2" />, path: "/dashboard/human-resources-department" },
  { label: "Reports", icon: <BarChart className="h-4 w-4 mr-2" />, path: "/dashboard/reports" },
  { label: "User Management", icon: <Users className="h-4 w-4 mr-2" />, path: "/dashboard/users-management" },
];

export function Sidebar() {
  return (
    <aside className="w-64 h-screen border-r bg-gray-900 flex flex-col p-4 text-white">
      <h1 className="text-xl font-bold mb-6">DLT Dashboard</h1>
      <nav className="flex flex-col space-y-2">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center px-2 py-2 rounded-md hover:bg-gray-800 transition-colors ${
                isActive ? "bg-gray-700 font-semibold" : "font-medium"
              }`
            }
          >
            {item.icon}
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
