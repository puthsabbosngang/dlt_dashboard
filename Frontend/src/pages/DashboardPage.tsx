import DashboardLayout from "../components/layout/DashboardLayout"
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card"

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader><CardTitle>Total Applications</CardTitle></CardHeader>
          <CardContent>1,230</CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Approved</CardTitle></CardHeader>
          <CardContent>980</CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Rejected</CardTitle></CardHeader>
          <CardContent>250</CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
