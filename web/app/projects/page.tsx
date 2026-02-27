import Link from "next/link";

const projects = [
  {
    id: "1",
    name: "Downtown Office Complex",
    client: "Metro Corp",
    status: "active",
    progress: 65,
    budget: "$2,400,000",
    spent: "$1,560,000",
    startDate: "2024-01-15",
    endDate: "2024-08-30",
    manager: "John Smith",
    tasks: { total: 48, completed: 31, blocked: 2 },
  },
  {
    id: "2",
    name: "Highway Bridge Repair",
    client: "City DOT",
    status: "active",
    progress: 42,
    budget: "$890,000",
    spent: "$373,800",
    startDate: "2024-02-01",
    endDate: "2024-06-15",
    manager: "Sarah Johnson",
    tasks: { total: 24, completed: 10, blocked: 1 },
  },
  {
    id: "3",
    name: "Riverside Apartments",
    client: "Green Living LLC",
    status: "planning",
    progress: 10,
    budget: "$5,100,000",
    spent: "$510,000",
    startDate: "2024-03-01",
    endDate: "2025-02-28",
    manager: "Mike Davis",
    tasks: { total: 12, completed: 1, blocked: 0 },
  },
  {
    id: "4",
    name: "Airport Terminal B",
    client: "National Airport Authority",
    status: "on_hold",
    progress: 30,
    budget: "$12,300,000",
    spent: "$3,690,000",
    startDate: "2023-09-01",
    endDate: "2025-06-30",
    manager: "Lisa Chen",
    tasks: { total: 86, completed: 26, blocked: 8 },
  },
  {
    id: "5",
    name: "Suburban School Renovation",
    client: "District School Board",
    status: "completed",
    progress: 100,
    budget: "$750,000",
    spent: "$723,000",
    startDate: "2023-06-01",
    endDate: "2023-12-31",
    manager: "Tom Wilson",
    tasks: { total: 32, completed: 32, blocked: 0 },
  },
];

const statusBadge: Record<string, string> = {
  active: "bg-green-100 text-green-800",
  planning: "bg-blue-100 text-blue-800",
  on_hold: "bg-yellow-100 text-yellow-800",
  completed: "bg-gray-100 text-gray-800",
};

export default function ProjectsPage() {
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
          <Link href="/projects" className="flex items-center gap-3 px-3 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium">
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
            <h2 className="text-xl font-semibold text-gray-900">Projects</h2>
            <p className="text-sm text-gray-500">{projects.length} total projects</p>
          </div>
          <div className="flex items-center gap-3">
            <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="planning">Planning</option>
              <option value="on_hold">On Hold</option>
              <option value="completed">Completed</option>
            </select>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700">
              + New Project
            </button>
          </div>
        </header>

        <div className="p-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Progress</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Budget</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tasks</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Manager</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timeline</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {projects.map((project) => (
                  <tr key={project.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{project.name}</p>
                        <p className="text-xs text-gray-500">{project.client}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusBadge[project.status]}`}>
                        {project.status.replace("_", " ")}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-gray-100 rounded-full h-2">
                          <div
                            className="bg-blue-500 h-2 rounded-full"
                            style={{ width: `${project.progress}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-600">{project.progress}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm text-gray-900">{project.budget}</p>
                        <p className="text-xs text-gray-500">Spent: {project.spent}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-xs text-gray-600">
                        <span className="text-green-600">{project.tasks.completed}</span>
                        <span className="text-gray-400"> / {project.tasks.total}</span>
                        {project.tasks.blocked > 0 && (
                          <span className="ml-1 text-red-500">({project.tasks.blocked} blocked)</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-700">{project.manager}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-xs text-gray-500">
                        <p>{project.startDate}</p>
                        <p>→ {project.endDate}</p>
                      </div>
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
