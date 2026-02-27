import Link from "next/link";

const stats = [
  { label: "Active Projects", value: "12", change: "+2 this month", color: "bg-blue-500" },
  { label: "Open Invoices", value: "$284,500", change: "8 pending", color: "bg-yellow-500" },
  { label: "Tasks In Progress", value: "47", change: "5 blocked", color: "bg-orange-500" },
  { label: "Payments Received", value: "$128,000", change: "This month", color: "bg-green-500" },
];

const recentProjects = [
  { id: "1", name: "Downtown Office Complex", status: "active", progress: 65, budget: "$2.4M" },
  { id: "2", name: "Highway Bridge Repair", status: "active", progress: 42, budget: "$890K" },
  { id: "3", name: "Riverside Apartments", status: "planning", progress: 10, budget: "$5.1M" },
  { id: "4", name: "Airport Terminal B", status: "on_hold", progress: 30, budget: "$12.3M" },
];

const recentInvoices = [
  { id: "INV-001", project: "Downtown Office Complex", amount: "$45,200", status: "sent", date: "2024-01-15" },
  { id: "INV-002", project: "Highway Bridge Repair", amount: "$18,750", status: "paid", date: "2024-01-10" },
  { id: "INV-003", project: "Riverside Apartments", amount: "$6,300", status: "draft", date: "2024-01-20" },
];

const statusBadge: Record<string, string> = {
  active: "bg-green-100 text-green-800",
  planning: "bg-blue-100 text-blue-800",
  on_hold: "bg-yellow-100 text-yellow-800",
  completed: "bg-gray-100 text-gray-800",
  sent: "bg-blue-100 text-blue-800",
  paid: "bg-green-100 text-green-800",
  draft: "bg-gray-100 text-gray-800",
  overdue: "bg-red-100 text-red-800",
};

export default function DashboardPage() {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white flex flex-col">
        <div className="p-6 border-b border-gray-700">
          <h1 className="text-xl font-bold text-white">ConstructFlow</h1>
          <p className="text-xs text-gray-400 mt-1">Construction ERP</p>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          <Link href="/" className="flex items-center gap-3 px-3 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium">
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
            <h2 className="text-xl font-semibold text-gray-900">Dashboard</h2>
            <p className="text-sm text-gray-500">Welcome back! Here&apos;s what&apos;s happening.</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500">Acme Construction Co.</span>
            <Link href="/projects" className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700">
              + New Project
            </Link>
          </div>
        </header>

        <div className="p-8 space-y-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat) => (
              <div key={stat.label} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className={`w-10 h-10 ${stat.color} rounded-lg mb-4`}></div>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-sm font-medium text-gray-600 mt-1">{stat.label}</p>
                <p className="text-xs text-gray-400 mt-1">{stat.change}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Projects */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <h3 className="text-base font-semibold text-gray-900">Recent Projects</h3>
                <Link href="/projects" className="text-sm text-blue-600 hover:underline">View all</Link>
              </div>
              <div className="divide-y divide-gray-100">
                {recentProjects.map((project) => (
                  <div key={project.id} className="px-6 py-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium text-gray-900">{project.name}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusBadge[project.status]}`}>
                        {project.status.replace("_", " ")}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 bg-gray-100 rounded-full h-1.5">
                        <div
                          className="bg-blue-500 h-1.5 rounded-full"
                          style={{ width: `${project.progress}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-500">{project.progress}%</span>
                      <span className="text-xs text-gray-500">{project.budget}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Invoices */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <h3 className="text-base font-semibold text-gray-900">Recent Invoices</h3>
                <Link href="/finance" className="text-sm text-blue-600 hover:underline">View all</Link>
              </div>
              <div className="divide-y divide-gray-100">
                {recentInvoices.map((invoice) => (
                  <div key={invoice.id} className="px-6 py-4 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{invoice.id}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{invoice.project}</p>
                      <p className="text-xs text-gray-400">{invoice.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-gray-900">{invoice.amount}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusBadge[invoice.status]}`}>
                        {invoice.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
