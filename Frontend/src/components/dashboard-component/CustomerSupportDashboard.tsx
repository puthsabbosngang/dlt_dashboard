import { Card, CardHeader, CardTitle, CardContent } from "../ui/card"

export default function CustomerSupportDashboard() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
            <CardHeader><CardTitle>Total Applications</CardTitle></CardHeader>
            <CardContent>1,23</CardContent>
        </Card>
        <Card>
            <CardHeader><CardTitle>Approved</CardTitle></CardHeader>
            <CardContent>98</CardContent>
        </Card>
        <Card>
            <CardHeader><CardTitle>Rejected</CardTitle></CardHeader>
            <CardContent>25</CardContent>
        </Card>
    </div>
  )
}
