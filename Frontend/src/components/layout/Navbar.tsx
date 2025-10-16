import { Button } from "../ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"

export function Navbar() {
  return (
    <header className="w-full h-14 border-b bg-white flex items-center justify-between px-6">
      <h2 className="text-lg font-semibold">Overview</h2>
      <div className="flex items-center space-x-4">
        <Button variant="outline" className="bg-red-600 text-white border-red-700 hover:bg-red-800 hover:text-white">Log Out</Button>
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>SN</AvatarFallback>
        </Avatar>
      </div>
    </header>
  )
}
