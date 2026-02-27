import Link from "next/link";

const invoices = [
  { id: "INV-001", project: "Downtown Office Complex", client: "Metro Corp", amount: "$45,200", status: "sent", date: "2024-01-15", due: "2024-02-14" },
  { id: "INV-002", project: "Highway Bridge Repair", client: "City DOT", amount: "$18,750", status: "paid", date: "2024-01-10", due: "2024-02-09" },
  { id: "INV-003", project: "Riverside Apartments", client: "Green Living LLC", amount: "$6,300", status: "draft", date: "2024-01-20", due: "2024-02-19" },
  { id: "INV-004", project: "Airport Terminal B", client: "National Airport Authority", amount: "$230,000", status: "overdue", date: "2023-12-01", due: "2023-12-31" },
  { id: "INV-005", project: "Downtown Office Complex", client: "Metro Corp", amount: "$32,800", status: "paid", date: "2023-12-15", due: "2024-01-14" },
  { id: "INV-006", project: "Highway Bridge Repair", client: "City DOT", amount: "$22,100", status: "sent", date: "2024-01-25", due: "2024-02-24" },
];

const payments = [
  { id: "PAY-001", invoice: "INV-002", amount: "$18,750", date: "2024-01-28", method: "Bank Transfer" },
  { id: "PAY-002", invoice: "INV-005", amount: "$32,800", date: "2024-01-12", method: "Check" },
];

const financeSummary = [
  { label: "Total Revenue", value: "$412,800", sub: "This quarter" },
  { label: "Outstanding", value: "$296,050", sub: "3 invoices" },
  { label: "Overdue", value: "$230,000", sub: "1 invoice" },
  { label: "Collected", value: "$51,550", sub: "2 payments" },
];

const statusBadge: Record<string, string> = {
  sent: "bg-blue-100 text-blue-800",
  paid: "bg-green-100 text-green-800",
  draft: "bg-gray-100 text-gray-800",
  overdue: "bg-red-100 text-red-800",
};

export default function FinancePage() {
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
          <Link href="/finance" className="flex items-center gap-3 px-3 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium">
            <span>💰</span> Finance
          </Link>
          <Link href="/tasks" className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-300 hover:bg-gray-800 text-sm">
            <span>✅</span> Tasks
          </Link>
          <Link href="/reports" className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-300 hover:bg-gray-800 text-sm">
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
            <h2 className="text-xl font-semibold text-gray-900">Finance</h2>
            <p className="text-sm text-gray-500">Invoices and payment management</p>
          </div>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700">
            + New Invoice
          </button>
        </header>

        <div className="p-8 space-y-6">
          {/* Finance Summary */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {financeSummary.map((item) => (
              <div key={item.label} className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                <p className="text-xl font-bold text-gray-900">{item.value}</p>
                <p className="text-sm text-gray-600 mt-1">{item.label}</p>
                <p className="text-xs text-gray-400 mt-0.5">{item.sub}</p>
              </div>
            ))}
          </div>

          {/* Invoices Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-base font-semibold text-gray-900">Invoices</h3>
              <div className="flex gap-2">
                {["all", "draft", "sent", "paid", "overdue"].map((f) => (
                  <button
                    key={f}
                    className={`text-xs px-3 py-1 rounded-full border ${f === "all" ? "bg-blue-600 text-white border-blue-600" : "text-gray-600 border-gray-300 hover:bg-gray-50"}`}
                  >
                    {f.charAt(0).toUpperCase() + f.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Invoice</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Project / Client</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Due Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {invoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{inv.id}</td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-900">{inv.project}</p>
                      <p className="text-xs text-gray-500">{inv.client}</p>
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">{inv.amount}</td>
                    <td className="px-6 py-4">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusBadge[inv.status]}`}>
                        {inv.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{inv.date}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{inv.due}</td>
                    <td className="px-6 py-4">
                      <button className="text-xs text-blue-600 hover:underline mr-3">View</button>
                      {inv.status === "draft" && <button className="text-xs text-green-600 hover:underline">Send</button>}
                      {inv.status === "sent" && <button className="text-xs text-green-600 hover:underline">Record Payment</button>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Recent Payments */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-base font-semibold text-gray-900">Recent Payments</h3>
            </div>
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Payment ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Invoice</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Method</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {payments.map((pay) => (
                  <tr key={pay.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{pay.id}</td>
                    <td className="px-6 py-4 text-sm text-blue-600">{pay.invoice}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-green-700">{pay.amount}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{pay.date}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{pay.method}</td>
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
