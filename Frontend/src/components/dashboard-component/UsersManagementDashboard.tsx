// "use client"

// import * as React from "react"
// import {
//   type ColumnDef,
//   getCoreRowModel,
//   getPaginationRowModel,
//   getFilteredRowModel,
//   useReactTable,
//   type ColumnFiltersState,
//   type VisibilityState,
// } from "@tanstack/react-table"
// import { Button } from "../ui/button"
// import { Input } from "../ui/input"
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "../ui/table"
// import {
//   DropdownMenu,
//   DropdownMenuCheckboxItem,
//   DropdownMenuContent,
//   DropdownMenuTrigger,
// } from "../ui/dropdown-menu"
// import { ChevronDown } from "lucide-react"
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../ui/dialog"
// import { Label } from "../ui/label"

// const API_BASE_URL =
//   import.meta.env.VITE_API_URL || "http://localhost:5000/api"

// export type StaffUser = {
//   id: number
//   full_name: string
//   username: string
//   role: string
//   phone: string
//   status: string
//   department: string
// }

// function getDepartmentFromRole(role: string): string {
//   const map: Record<string, string> = {
//     CS_officer: "Customer Support",
//     CS_supervisor: "Customer Support",
//     CD_officer: "Credit",
//     CD_supervisor: "Credit",
//     Finance_officer: "Finance",
//     Finance_supervisor: "Finance",
//     IT_admin: "IT",
//     IT_support: "IT",
//     Marketing_officer: "Marketing",
//     Marketing_supervisor: "Marketing",
//   }
//   return map[role] || "General"
// }

// export function UsersManagementDashboard() {
//   const [data, setData] = React.useState<StaffUser[]>([])
//   const [loading, setLoading] = React.useState(true)
//   const [error, setError] = React.useState<string | null>(null)
//   const [openDialog, setOpenDialog] = React.useState(false)
//   const [isEditing, setIsEditing] = React.useState(false)
//   const [form, setForm] = React.useState({
//     id: 0,
//     username: "",
//     password: "",
//     full_name: "",
//     role: "",
//     phone: "",
//   })

//   const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
//   const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
//   const [rowSelection, setRowSelection] = React.useState({})

//   // 🔹 Fetch users
//   async function fetchUsers() {
//     try {
//       setLoading(true)
//       const res = await fetch(`${API_BASE_URL}/users?type=staff`)
//       if (!res.ok) throw new Error("Failed to fetch staff users")
//       const staffs = await res.json()
//       const mapped = staffs.map((s: any) => ({
//         id: s.user?.id,
//         username: s.user?.username,
//         full_name: s.full_name,
//         role: s.role,
//         phone: s.phone || "-",
//         status: s.user?.status || "active",
//         department: getDepartmentFromRole(s.role),
//       }))
//       mapped.sort((a: any, b: any) => a.id - b.id)
//       setData(mapped)
//     } catch (err: any) {
//       setError(err.message)
//     } finally {
//       setLoading(false)
//     }
//   }

//   React.useEffect(() => {
//     fetchUsers()
//   }, [])

//   // 🔹 Delete
//   async function handleDelete(id: number) {
//     if (!confirm("Are you sure you want to delete this user?")) return
//     try {
//       const res = await fetch(`${API_BASE_URL}/users/${id}`, { method: "DELETE" })
//       if (!res.ok) throw new Error("Failed to delete user")
//       alert("User deleted successfully!")
//       fetchUsers()
//     } catch (error: any) {
//       alert("Error: " + error.message)
//     }
//   }

//   // 🔹 Open Add / Edit Dialog
//   function openAddUser() {
//     setIsEditing(false)
//     setForm({ id: 0, username: "", password: "", full_name: "", role: "", phone: "" })
//     setOpenDialog(true)
//   }

//   function openEditUser(user: StaffUser) {
//     setIsEditing(true)
//     setForm({
//       id: user.id,
//       username: user.username,
//       password: "",
//       full_name: user.full_name,
//       role: user.role,
//       phone: user.phone,
//     })
//     setOpenDialog(true)
//   }

//   // 🔹 Save (Create / Update)
//   async function handleSave() {
//     try {
//       if (isEditing) {
//         const res = await fetch(`${API_BASE_URL}/users/${form.id}`, {
//           method: "PUT",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({
//             username: form.username,
//             full_name: form.full_name,
//             role: form.role,
//             phone: form.phone,
//             type: "staff",
//             status: "active",
//           }),
//         })
//         if (!res.ok) throw new Error("Failed to update user")
//         alert("User updated successfully!")
//       } else {
//         const res = await fetch(`${API_BASE_URL}/users`, {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({
//             username: form.username,
//             password: form.password,
//             full_name: form.full_name,
//             role: form.role,
//             phone: form.phone,
//             type: "staff",
//           }),
//         })
//         if (!res.ok) throw new Error("Failed to create user")
//         alert("User created successfully!")
//       }
//       setOpenDialog(false)
//       fetchUsers()
//     } catch (error: any) {
//       alert("Error: " + error.message)
//     }
//   }

//   const columns: ColumnDef<StaffUser>[] = [
//     {
//       id: "index",
//       header: "#",
//       cell: ({ row }) => <div>{row.index + 1}</div>,
//     },
//     { accessorKey: "id", header: "ID" },
//     { accessorKey: "username", header: "Username" },
//     { accessorKey: "full_name", header: "Full Name" },
//     { accessorKey: "role", header: "Role" },
//     { accessorKey: "department", header: "Department" },
//     { accessorKey: "phone", header: "Phone" },
//     { accessorKey: "status", header: "Status" },
//     {
//       id: "actions",
//       header: "Actions",
//       cell: ({ row }) => {
//         const user = row.original
//         return (
//           <div className="flex gap-2">
//             <Button variant="outline" size="sm" onClick={() => openEditUser(user)}>
//               Edit
//             </Button>
//             <Button variant="destructive" size="sm" onClick={() => handleDelete(user.id)}>
//               Delete
//             </Button>
//           </div>
//         )
//       },
//     },
//   ]

//   const table = useReactTable({
//     data,
//     columns,
//     getCoreRowModel: getCoreRowModel(),
//     getPaginationRowModel: getPaginationRowModel(),
//     getFilteredRowModel: getFilteredRowModel(),
//     onColumnFiltersChange: setColumnFilters,
//     onColumnVisibilityChange: setColumnVisibility,
//     onRowSelectionChange: setRowSelection,
//     state: { columnFilters, columnVisibility, rowSelection },
//     initialState: { pagination: { pageSize: 10 } },
//   })

//   if (loading)
//     return <div className="text-center py-10 text-muted-foreground">Loading...</div>
//   if (error)
//     return <div className="text-center py-10 text-destructive">Failed to load users: {error}</div>

//   return (
//     <div className="w-full">
//       {/* 🔍 Toolbar */}
//       <div className="flex items-center py-4 gap-2">
//         <Button onClick={openAddUser}>+ Add User</Button>
//         <Input
//           placeholder="Filter username..."
//           value={(table.getColumn("username")?.getFilterValue() as string) ?? ""}
//           onChange={(event) =>
//             table.getColumn("username")?.setFilterValue(event.target.value)
//           }
//           className="max-w-sm"
//         />
//         <DropdownMenu>
//           <DropdownMenuTrigger asChild>
//             <Button variant="outline" className="ml-auto">
//               Columns <ChevronDown />
//             </Button>
//           </DropdownMenuTrigger>
//           <DropdownMenuContent align="end">
//             {table.getAllColumns()
//               .filter((column) => column.getCanHide())
//               .map((column) => (
//                 <DropdownMenuCheckboxItem
//                   key={column.id}
//                   checked={column.getIsVisible()}
//                   onCheckedChange={(value) => column.toggleVisibility(!!value)}
//                 >
//                   {column.id}
//                 </DropdownMenuCheckboxItem>
//               ))}
//           </DropdownMenuContent>
//         </DropdownMenu>
//       </div>

//       {/* 📋 Table */}
//       <div className="overflow-hidden rounded-md border">
//         <Table>
//           <TableHeader>
//             {table.getHeaderGroups().map((headerGroup) => (
//               <TableRow key={headerGroup.id}>
//                 {headerGroup.headers.map((header) => (
//                   <TableHead key={header.id}>
//                     {typeof header.column.columnDef.header === "function"
//                       ? header.column.columnDef.header(header.getContext())
//                       : header.column.columnDef.header}
//                   </TableHead>
//                 ))}
//               </TableRow>
//             ))}
//           </TableHeader>
//           <TableBody>
//             {table.getRowModel().rows.length ? (
//               table.getRowModel().rows.map((row) => (
//                 <TableRow key={row.id}>
//                   {row.getVisibleCells().map((cell) => (
//                     <TableCell key={cell.id}>
//                       {typeof cell.column.columnDef.cell === "function"
//                         ? cell.column.columnDef.cell(cell.getContext())
//                         : cell.column.columnDef.cell}
//                     </TableCell>
//                   ))}
//                 </TableRow>
//               ))
//             ) : (
//               <TableRow>
//                 <TableCell colSpan={columns.length} className="h-24 text-center">
//                   No results found.
//                 </TableCell>
//               </TableRow>
//             )}
//           </TableBody>
//         </Table>
//       </div>

//       {/* 🔁 Pagination */}
//       <div className="flex items-center justify-between py-4">
//         <p className="text-sm text-muted-foreground">
//           Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
//         </p>
//         <div className="space-x-2">
//           <Button
//             variant="outline"
//             size="sm"
//             onClick={() => table.previousPage()}
//             disabled={!table.getCanPreviousPage()}
//           >
//             Previous
//           </Button>
//           <Button
//             variant="outline"
//             size="sm"
//             onClick={() => table.nextPage()}
//             disabled={!table.getCanNextPage()}
//           >
//             Next
//           </Button>
//         </div>
//       </div>

//       {/* 🧾 Add/Edit Dialog */}
//       <Dialog open={openDialog} onOpenChange={setOpenDialog}>
//         <DialogContent className="sm:max-w-md">
//           <DialogHeader>
//             <DialogTitle>{isEditing ? "Edit User" : "Add New User"}</DialogTitle>
//           </DialogHeader>

//           <div className="grid gap-4 py-4">
//             <div>
//               <Label>Username</Label>
//               <Input
//                 value={form.username}
//                 onChange={(e) => setForm({ ...form, username: e.target.value })}
//               />
//             </div>
//             {!isEditing && (
//               <div>
//                 <Label>Password</Label>
//                 <Input
//                   type="password"
//                   value={form.password}
//                   onChange={(e) => setForm({ ...form, password: e.target.value })}
//                 />
//               </div>
//             )}
//             <div>
//               <Label>Full Name</Label>
//               <Input
//                 value={form.full_name}
//                 onChange={(e) => setForm({ ...form, full_name: e.target.value })}
//               />
//             </div>
//             <div>
//               <Label>Role</Label>
//               <Input
//                 value={form.role}
//                 onChange={(e) => setForm({ ...form, role: e.target.value })}
//               />
//             </div>
//             <div>
//               <Label>Phone</Label>
//               <Input
//                 value={form.phone}
//                 onChange={(e) => setForm({ ...form, phone: e.target.value })}
//               />
//             </div>
//           </div>

//           <DialogFooter>
//             <Button onClick={handleSave}>{isEditing ? "Update" : "Create"}</Button>
//             <Button variant="outline" onClick={() => setOpenDialog(false)}>
//               Cancel
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
//     </div>
//   )
// }


"use client"

import * as React from "react"
import {
  type ColumnDef,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  useReactTable,
  type ColumnFiltersState,
  type VisibilityState,
} from "@tanstack/react-table"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu"
import { ChevronDown } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../ui/dialog"
import { Label } from "../ui/label"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../ui/select"

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api"

export type StaffUser = {
  id: number
  full_name: string
  username: string
  role: string
  phone: string
  status: string
  department: string
}

function getDepartmentFromRole(role: string): string {
  const map: Record<string, string> = {
    CS_officer: "Customer Support",
    CS_supervisor: "Customer Support",
    CD_officer: "Credit",
    CD_supervisor: "Credit",
    CD_committee: "Credit",
    CO_officer: "Collection",
    CO_supervisor: "Collection",
    AC_AP: "Accounting",
    AC_AR: "Accounting",
    AC_supervisor: "Accounting",
  }
  return map[role] || "General"
}

export function UsersManagementDashboard() {
  const [data, setData] = React.useState<StaffUser[]>([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  const [openDialog, setOpenDialog] = React.useState(false)
  const [isEditing, setIsEditing] = React.useState(false)
  const [form, setForm] = React.useState({
    id: 0,
    username: "",
    password: "",
    full_name: "",
    role: "",
    phone: "",
  })

  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})

  const roleOptions = [
    "CS_Officer",
    "CS_Supervisor",
    "CD_Officer",
    "CD_Supervisor",
    "CD_Committee",
    "CO_Officer",
    "CO_Supervisor",
    "AC_AP",
    "AC_AR",
    "AC_Supervisor",
  ]

  async function fetchUsers() {
    try {
      setLoading(true)
      const res = await fetch(`${API_BASE_URL}/users?type=staff`)
      if (!res.ok) throw new Error("Failed to fetch staff users")
      const staffs = await res.json()
      const mapped = staffs.map((s: any) => ({
        id: s.user?.id,
        username: s.user?.username,
        full_name: s.full_name,
        role: s.role,
        phone: s.phone || "-",
        status: s.user?.status || "active",
        department: getDepartmentFromRole(s.role),
      }))
      mapped.sort((a: any, b: any) => a.id - b.id)
      setData(mapped)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  React.useEffect(() => {
    fetchUsers()
  }, [])

  async function handleDelete(id: number) {
    if (!confirm("Are you sure you want to delete this user?")) return
    try {
      const res = await fetch(`${API_BASE_URL}/users/${id}`, { method: "DELETE" })
      if (!res.ok) throw new Error("Failed to delete user")
      alert("User deleted successfully!")
      fetchUsers()
    } catch (error: any) {
      alert("Error: " + error.message)
    }
  }

  function openAddUser() {
    setIsEditing(false)
    setForm({ id: 0, username: "", password: "", full_name: "", role: "", phone: "" })
    setOpenDialog(true)
  }

  function openEditUser(user: StaffUser) {
    setIsEditing(true)
    setForm({
      id: user.id,
      username: user.username,
      password: "",
      full_name: user.full_name,
      role: user.role,
      phone: user.phone,
    })
    setOpenDialog(true)
  }

  async function handleSave() {
    try {
      const method = isEditing ? "PUT" : "POST"
      const url = isEditing
        ? `${API_BASE_URL}/users/${form.id}`
        : `${API_BASE_URL}/users`

      const body = {
        username: form.username,
        password: isEditing ? undefined : form.password,
        full_name: form.full_name,
        role: form.role,
        phone: form.phone,
        type: "staff",
        status: "active",
      }

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })

      if (!res.ok) throw new Error(isEditing ? "Failed to update user" : "Failed to create user")

      alert(isEditing ? "User updated successfully!" : "User created successfully!")
      setOpenDialog(false)
      fetchUsers()
    } catch (error: any) {
      alert("Error: " + error.message)
    }
  }

  const columns: ColumnDef<StaffUser>[] = [
    { id: "index", header: "#", cell: ({ row }) => <div>{row.index + 1}</div> },
    { accessorKey: "id", header: "ID" },
    { accessorKey: "username", header: "Username" },
    { accessorKey: "full_name", header: "Full Name" },
    { accessorKey: "role", header: "Role" },
    { accessorKey: "department", header: "Department" },
    { accessorKey: "phone", header: "Phone" },
    { accessorKey: "status", header: "Status" },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const user = row.original
        return (
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => openEditUser(user)}>
              Edit
            </Button>
            <Button variant="destructive" size="sm" onClick={() => handleDelete(user.id)}>
              Delete
            </Button>
          </div>
        )
      },
    },
  ]

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: { columnFilters, columnVisibility, rowSelection },
    initialState: { pagination: { pageSize: 10 } },
  })

  if (loading)
    return <div className="text-center py-10 text-muted-foreground">Loading...</div>
  if (error)
    return <div className="text-center py-10 text-destructive">Failed to load users: {error}</div>

  return (
    <div className="w-full">
      {/* 🔍 Toolbar */}
      <div className="flex items-center py-4 gap-2">
        <Button onClick={openAddUser}>+ Add User</Button>
        <Input
          placeholder="Filter username..."
          value={(table.getColumn("username")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("username")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table.getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
                >
                  {column.id}
                </DropdownMenuCheckboxItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* 📋 Table */}
      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {typeof header.column.columnDef.header === "function"
                      ? header.column.columnDef.header(header.getContext())
                      : header.column.columnDef.header}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {typeof cell.column.columnDef.cell === "function"
                        ? cell.column.columnDef.cell(cell.getContext())
                        : cell.column.columnDef.cell}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* 🔁 Pagination */}
      <div className="flex items-center justify-between py-4">
        <p className="text-sm text-muted-foreground">
          Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
        </p>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>

      {/* 🧾 Add/Edit Dialog */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{isEditing ? "Edit User" : "Add New User"}</DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div>
              <Label>Username</Label>
              <Input
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
              />
            </div>

            {!isEditing && (
              <div>
                <Label>Password</Label>
                <Input
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
              </div>
            )}

            <div>
              <Label>Full Name</Label>
              <Input
                value={form.full_name}
                onChange={(e) => setForm({ ...form, full_name: e.target.value })}
              />
            </div>

            <div>
              <Label>Role</Label>
              <Select
                value={form.role}
                onValueChange={(value) => setForm({ ...form, role: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  {roleOptions.map((role) => (
                    <SelectItem key={role} value={role}>
                      {role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Phone</Label>
              <Input
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
            </div>
          </div>

          <DialogFooter>
            <Button onClick={handleSave}>{isEditing ? "Update" : "Create"}</Button>
            <Button variant="outline" onClick={() => setOpenDialog(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
