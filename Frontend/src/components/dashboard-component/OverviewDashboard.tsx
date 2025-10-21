import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { cn } from "../../lib/utils";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

type MonthPoint = { month: string; amount: number; count: number };

const MONTHS: MonthPoint[] = [
  { month: "Jan", amount: 0, count: 0 },
  { month: "Feb", amount: 1200, count: 2 },
  { month: "Mar", amount: 200, count: 1 },
  { month: "Apr", amount: 3000, count: 3 },
  { month: "May", amount: 52000, count: 18 },
  { month: "Jun", amount: 2500, count: 4 },
  { month: "Jul", amount: 0, count: 0 },
  { month: "Aug", amount: 51000, count: 17 },
  { month: "Sep", amount: 1500, count: 2 },
  { month: "Oct", amount: 8000, count: 5 },
  { month: "Nov", amount: 0, count: 0 },
  { month: "Dec", amount: 0, count: 0 },
];

const LOAN_CLASSIFICATION = [
  { label: "Before Due", count: 6, amount: 3624 },
  { label: "On Due", count: 0, amount: 0 },
  { label: "DPD 1-30", count: 0, amount: 0 },
  { label: "DPD 31-60", count: 1, amount: 265 },
  { label: "NPL >90", count: 5, amount: 990 },
  { label: "Total Active", count: 12, amount: 4878 },
];

const STATUS_LEGEND = [
  { key: "Draft", color: "#ffd166" },
  { key: "Submitted", color: "#ff9aa2" },
  { key: "Rejected", color: "#ff6b6b" },
  { key: "Cancelled", color: "#cbd5e1" },
  { key: "Negotiating", color: "#4fd1c5" },
  { key: "Recommended", color: "#60a5fa" },
  { key: "Approved", color: "#a78bfa" },
  { key: "Completed", color: "#2dd4bf" },
];

const STATUS_ROWS = [
  { name: "Draft", count: 38, amount: 0 },
  { name: "Submitted", count: 0, amount: 0 },
  { name: "Rejected", count: 461, amount: 50 },
  { name: "Cancelled", count: 12, amount: 0 },
  { name: "Negotiating", count: 0, amount: 0 },
  { name: "Recommended", count: 0, amount: 0 },
  { name: "Approved", count: 2, amount: 0 },
  { name: "Completed", count: 153, amount: 300 },
];

const LOCATION_DATA = [
  { name: "Phnom Penh", value: 118615 },
  { name: "Banteay Meanchey", value: 3510 },
  { name: "Mondul Kiri", value: 150 },
];

const LOCATION_COLORS = ["#2b9cf4", "#ff6b9b", "#f3c623"];

const currency = (v: number) =>
  v >= 1000 ? `$${v.toLocaleString()}` : `$${v.toFixed(0)}`;

type Timeframe = "today" | "month" | "ytd";

function aggregateForTimeframe(data: MonthPoint[], timeframe: Timeframe, field: "amount" | "count") {
  if (timeframe === "today") {
    // simulate "today" as the last non-zero month value divided by 30
    const last = [...data].reverse().find((d) => d[field] > 0) ?? data[data.length - 1];
    const value = Math.max(0, Math.round(last[field] / 30));
    return value;
  }
  if (timeframe === "month") {
    const last = [...data].reverse().find((d) => d[field] > 0) ?? data[data.length - 1];
    return last ? last[field] : 0;
  }
  return data.reduce((s, r) => s + r[field], 0);
}

export default function OverviewDashboard() {
  const [timeframe, setTimeframe] = useState<Timeframe>("today");
  const [disbursementMode, setDisbursementMode] = useState<"amount" | "count">("amount");
  const [loanPeriod, setLoanPeriod] = useState<"daily" | "monthly" | "yearly">("daily");

  const barData = MONTHS;

  const disbTargetCustomer = 10;
  const repaymentTargetCustomer = 10;
  const disbTargetAmount = 1000;
  const repaymentTargetAmount = 1000;

  const disbAchievedCustomer = useMemo(() => aggregateForTimeframe(MONTHS, timeframe, "count"), [timeframe]);
  const disbAchievedAmount = useMemo(() => aggregateForTimeframe(MONTHS, timeframe, "amount"), [timeframe]);

  const repAchievedCustomer = useMemo(() => Math.round(disbAchievedCustomer * 0.6), [disbAchievedCustomer]);
  const repAchievedAmount = useMemo(() => Math.round(disbAchievedAmount * 0.4), [disbAchievedAmount]);

  const loanPeriodRows = useMemo(() => {
    switch (loanPeriod) {
      case "daily":
        return STATUS_ROWS.map((r) => ({ ...r, count: Math.round(r.count * 0.3), amount: Math.round(r.amount * 0.0) }));
      case "monthly":
        return STATUS_ROWS;
      case "yearly":
        return STATUS_ROWS.map((r) => ({ ...r, count: Math.round(r.count * 12), amount: r.amount * 12 }));
    }
  }, [loanPeriod]);

  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-8">
          <Card className="h-full">
            <CardHeader className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="flex gap-2">
                  <Button variant="ghost" className={cn("rounded-full px-4 py-1", "bg-blue-600 text-white")}>Disbursements</Button>
                  <Button variant="ghost" className="rounded-full px-4 py-1">Account Growth</Button>
                  <Button variant="ghost" className="rounded-full px-4 py-1">Applications</Button>
                  <Button variant="ghost" className="rounded-full px-4 py-1">Approval</Button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold">Disbursements</h2>
                <div className="flex gap-2">
                  <Button size="sm" variant={disbursementMode === "amount" ? "default" : "ghost"} onClick={() => setDisbursementMode("amount")}>Amount</Button>
                  <Button size="sm" variant={disbursementMode === "count" ? "default" : "ghost"} onClick={() => setDisbursementMode("count")}>Count Application</Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div style={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <XAxis dataKey="month" tick={{ fill: "#6b7280" }} />
                    <YAxis tick={{ fill: "#6b7280" }} />
                    <Tooltip formatter={(value: any) => (disbursementMode === "amount" ? currency(value) : value)} />
                    <Bar dataKey={disbursementMode === "amount" ? "amount" : "count"} fill="#cbd5e1" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="col-span-4 flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Disbursement KPI</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-3 mb-4">
                <Button size="sm" variant={timeframe === "today" ? "default" : "ghost"} onClick={() => setTimeframe("today")}>Today</Button>
                <Button size="sm" variant={timeframe === "month" ? "default" : "ghost"} onClick={() => setTimeframe("month")}>This Month</Button>
                <Button size="sm" variant={timeframe === "ytd" ? "default" : "ghost"} onClick={() => setTimeframe("ytd")}>YTD</Button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-muted-foreground">Target Customer</div>
                  <div className="text-2xl font-bold">{disbTargetCustomer}</div>
                </div>
                <div className="border-l h-16" />
                <div>
                  <div className="text-sm text-muted-foreground">Achieved Customer</div>
                  <div className="text-2xl font-bold">{disbAchievedCustomer}</div>
                </div>
                <div className="border-l h-16" />
                <div>
                  <div className="text-sm text-muted-foreground">Target Amount</div>
                  <div className="text-2xl font-bold">{currency(disbTargetAmount)}</div>
                </div>
                <div className="border-l h-16" />
                <div>
                  <div className="text-sm text-muted-foreground">Achieved Amount</div>
                  <div className="text-2xl font-bold">{currency(disbAchievedAmount)}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Repayments KPI</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-3 mb-4">
                <Button size="sm" variant={timeframe === "today" ? "default" : "ghost"} onClick={() => setTimeframe("today")}>Today</Button>
                <Button size="sm" variant={timeframe === "month" ? "default" : "ghost"} onClick={() => setTimeframe("month")}>This Month</Button>
                <Button size="sm" variant={timeframe === "ytd" ? "default" : "ghost"} onClick={() => setTimeframe("ytd")}>YTD</Button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-muted-foreground">Target Customer</div>
                  <div className="text-2xl font-bold">{repaymentTargetCustomer}</div>
                </div>
                <div className="border-l h-16" />
                <div>
                  <div className="text-sm text-muted-foreground">Achieved Customer</div>
                  <div className="text-2xl font-bold">{repAchievedCustomer}</div>
                </div>
                <div className="border-l h-16" />
                <div>
                  <div className="text-sm text-muted-foreground">Target Amount</div>
                  <div className="text-2xl font-bold">{currency(repaymentTargetAmount)}</div>
                </div>
                <div className="border-l h-16" />
                <div>
                  <div className="text-sm text-muted-foreground">Achieved Amount</div>
                  <div className="text-2xl font-bold">{currency(repAchievedAmount)}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-4">
          <Card>
            <CardHeader className="flex items-center justify-between">
              <CardTitle>Loan</CardTitle>
              <div className="flex gap-2">
                <Button size="sm" variant={loanPeriod === "daily" ? "default" : "ghost"} onClick={() => setLoanPeriod("daily")}>Daily</Button>
                <Button size="sm" variant={loanPeriod === "monthly" ? "default" : "ghost"} onClick={() => setLoanPeriod("monthly")}>Monthly</Button>
                <Button size="sm" variant={loanPeriod === "yearly" ? "default" : "ghost"} onClick={() => setLoanPeriod("yearly")}>Yearly</Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="h-2 rounded bg-gradient-to-r from-red-500 via-green-400 to-green-500" />

                <div className="grid grid-cols-3 gap-2">
                  <div />
                </div>

                <div>
                  {loanPeriodRows.map((r) => (
                    <div key={r.name} className="flex items-center justify-between py-1">
                      <div className="flex items-center gap-3">
                        <div className="h-3 w-3 rounded" style={{ background: STATUS_LEGEND.find((s) => s.key === r.name)?.color ?? "#ddd" }} />
                        <div className="text-sm">{r.name}</div>
                      </div>
                      <div className="text-sm">{r.count} &nbsp; <span className="font-semibold">{currency(r.amount)}</span></div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="col-span-4">
          <Card>
            <CardHeader>
              <CardTitle>Loan Classification</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-3 rounded overflow-hidden mb-4 flex gap-1">
                {LOAN_CLASSIFICATION.map((c, idx) => (
                  <div key={c.label} style={{ flex: c.amount || 1, background: ["#f9d57a", "#f4b740", "#ff9aa2", "#ffd166", "#60a5fa", "#34d399"][idx % 6] }} />
                ))}
              </div>

              <div className="space-y-2">
                {LOAN_CLASSIFICATION.map((c) => (
                  <div key={c.label} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-2 rounded-full" style={{ background: "#f9d57a" }} />
                      <div className="text-sm">{c.label}</div>
                    </div>
                    <div className="text-sm"><span className="font-semibold">{c.count}</span> &nbsp; {currency(c.amount)} ({Math.round((c.amount / LOAN_CLASSIFICATION.reduce((s, r) => s + r.amount, 0)) * 100) || 0}%)</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="col-span-4">
          <Card>
            <CardHeader>
              <CardTitle>Loan Amount by Location</CardTitle>
            </CardHeader>
            <CardContent>
              <div style={{ width: "100%", height: 260 }} className="flex items-center">
                <ResponsiveContainer width="60%" height={220}>
                  <PieChart>
                    <Pie data={LOCATION_DATA} dataKey="value" nameKey="name" innerRadius={40} outerRadius={100} paddingAngle={3}>
                      {LOCATION_DATA.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={LOCATION_COLORS[index % LOCATION_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(val: number) => currency(val)} />
                  </PieChart>
                </ResponsiveContainer>

                <div className="ml-4 w-1/3">
                  {LOCATION_DATA.map((_, i) => (
                    <div key={`location-${i}`} className="flex items-center justify-between py-2">
                      <div className="flex items-center gap-3">
                        <div className="h-3 w-3 rounded" style={{ background: LOCATION_COLORS[i] }} />
                        <div>{LOCATION_DATA[i].name}</div>
                      </div>
                      <div className="font-semibold">{currency(LOCATION_DATA[i].value)}</div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
