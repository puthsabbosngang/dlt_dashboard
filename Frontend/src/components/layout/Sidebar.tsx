import { Button } from "../ui/button"

export function Sidebar() {
  return (
    <aside className="w-64 h-screen border-r bg-white flex flex-col p-4">
      <h1 className="text-xl font-bold mb-6">DLT Dashboard</h1>
      <nav className="flex flex-col space-y-2">
        <Button variant="ghost" className="justify-start">🏠 Overview</Button>
        <Button variant="ghost" className="justify-start">📈 Customer Support</Button>
        <Button variant="ghost" className="justify-start">💳 Credit</Button>
        <Button variant="ghost" className="justify-start">📈 Collection</Button>
        <Button variant="ghost" className="justify-start">💰 Finance</Button>
        <Button variant="ghost" className="justify-start">📈 HR</Button>
        <Button variant="ghost" className="justify-start">📈 Reports</Button>
        <Button variant="ghost" className="justify-start">📈 User Management</Button>
      </nav>
    </aside>
  )
}
