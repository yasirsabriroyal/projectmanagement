import Link from "next/link";

const monthlyData = [
  { month: "Aug", revenue: 38000, expenses: 29000 },
  { month: "Sep", revenue: 52000, expenses: 41000 },
  { month: "Oct", revenue: 47000, expenses: 38000 },
  { month: "Nov", revenue: 61000, expenses: 49000 },
  { month: "Dec", revenue: 55000, expenses: 43000 },
  { month: "Jan", revenue: 68000, expenses: 52000 },
];

const maxVal = Math.max(...monthlyData.flatMap((d) => [d.revenue, d.expenses]));

export default function ReportsPage() {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white flex flex-col">
        <div className="p-6 border-b border-gray-700">
          <h1 className="text-xl font-bold text-white">ConstructFlow</h1>
          <p className="text-xs text-gray-400 mt-1">Construction ERP</p>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          <Link href="/" className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-300 hover:bg-gray-800 text-sm">
            <span>📊</span> Dashboard
          </Link>
          <Link href="/projects" className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-300 hover:bg-gray-800 text-sm">
            <span>🏗️</span> Projects
          </Link>
          <Link href="/finance" className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-300 hover:bg-gray-800 text-sm">
            <span>💰</span> Finance
          </Link>
          <Link href="/tasks" className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-300 hover:bg-gray-800 text-sm">
            <span>✅</span> Tasks
          </Link>
          <Link href="/reports" className="flex items-center gap-3 px-3 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium">
            <span>📈</span> Reports
          </Link>
        </nav>
        <div className="p-4 border-t border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-sm font-bold">A</div>
            <div>
              <p className="text-sm font-medium text-white">Admin User</p>
              <p className="text-xs text-gray-400">admin@constructflow.com</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Reports & Analytics</h2>
            <p className="text-sm text-gray-500">Financial and operational insights</p>
          </div>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700">
            Export Report
          </button>
        </header>

        <div className="p-8 space-y-6">
          {/* KPI Row */}
          <div className="grid grid-cols-3 gap-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <p className="text-sm text-gray-500">Gross Margin</p>
              <p className="text-3xl font-bold text-green-600 mt-2">23.5%</p>
              <p className="text-xs text-gray-400 mt-1">↑ 2.1% vs last quarter</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <p className="text-sm text-gray-500">On-Time Delivery</p>
              <p className="text-3xl font-bold text-blue-600 mt-2">78%</p>
              <p className="text-xs text-gray-400 mt-1">9 of 12 projects on schedule</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <p className="text-sm text-gray-500">Budget Variance</p>
              <p className="text-3xl font-bold text-yellow-600 mt-2">-4.2%</p>
              <p className="text-xs text-gray-400 mt-1">Under budget on avg.</p>
            </div>
          </div>

          {/* Revenue vs Expenses Chart */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-base font-semibold text-gray-900 mb-6">Revenue vs Expenses (Last 6 Months)</h3>
            <div className="flex items-end gap-4 h-48">
              {monthlyData.map((d) => (
                <div key={d.month} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full flex gap-1 items-end" style={{ height: "160px" }}>
                    <div
                      className="flex-1 bg-blue-500 rounded-t"
                      style={{ height: `${(d.revenue / maxVal) * 160}px` }}
                      title={`Revenue: $${d.revenue.toLocaleString()}`}
                    />
                    <div
                      className="flex-1 bg-orange-400 rounded-t"
                      style={{ height: `${(d.expenses / maxVal) * 160}px` }}
                      title={`Expenses: $${d.expenses.toLocaleString()}`}
                    />
                  </div>
                  <p className="text-xs text-gray-500">{d.month}</p>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-6 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded" />
                <span className="text-xs text-gray-600">Revenue</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-orange-400 rounded" />
                <span className="text-xs text-gray-600">Expenses</span>
              </div>
            </div>
          </div>

          {/* Project Performance Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-base font-semibold text-gray-900">Project Performance</h3>
            </div>
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Project</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Budget</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Spent</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Variance</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Timeline</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {[
                  { name: "Downtown Office Complex", budget: "$2,400,000", spent: "$1,560,000", variance: "-3.2%", timeline: "On Track" },
                  { name: "Highway Bridge Repair", budget: "$890,000", spent: "$373,800", variance: "+1.5%", timeline: "Delayed" },
                  { name: "Riverside Apartments", budget: "$5,100,000", spent: "$510,000", variance: "0%", timeline: "On Track" },
                  { name: "Airport Terminal B", budget: "$12,300,000", spent: "$3,690,000", variance: "+8.1%", timeline: "On Hold" },
                ].map((row) => (
                  <tr key={row.name} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900">{row.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{row.budget}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{row.spent}</td>
                    <td className={`px-6 py-4 text-sm font-medium ${row.variance.startsWith("+") ? "text-red-600" : row.variance === "0%" ? "text-gray-500" : "text-green-600"}`}>
                      {row.variance}
                    </td>
                    <td className={`px-6 py-4 text-sm ${row.timeline === "On Track" ? "text-green-600" : row.timeline === "Delayed" ? "text-red-600" : "text-yellow-600"}`}>
                      {row.timeline}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
