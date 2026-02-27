import Link from "next/link";

const tasks = [
  { id: "1", name: "Foundation Concrete Pour", project: "Downtown Office Complex", assignee: "Mike Torres", status: "completed", progress: 100, priority: "high" },
  { id: "2", name: "Steel Frame Installation", project: "Downtown Office Complex", assignee: "Carlos Reyes", status: "in_progress", progress: 72, priority: "high" },
  { id: "3", name: "Electrical Rough-In Floor 3", project: "Downtown Office Complex", assignee: "David Kim", status: "in_progress", progress: 45, priority: "medium" },
  { id: "4", name: "Bridge Deck Inspection", project: "Highway Bridge Repair", assignee: "Anna Lee", status: "blocked", progress: 20, priority: "critical" },
  { id: "5", name: "Rebar Placement Section B", project: "Highway Bridge Repair", assignee: "Jose Martinez", status: "in_progress", progress: 60, priority: "high" },
  { id: "6", name: "Site Survey & Grading", project: "Riverside Apartments", assignee: "Tom Wilson", status: "completed", progress: 100, priority: "medium" },
  { id: "7", name: "Permits & Approvals", project: "Riverside Apartments", assignee: "Lisa Chen", status: "pending", progress: 0, priority: "high" },
  { id: "8", name: "Facade Cladding Install", project: "Airport Terminal B", assignee: "Robert Park", status: "blocked", progress: 15, priority: "critical" },
];

const statusBadge: Record<string, string> = {
  completed: "bg-green-100 text-green-800",
  in_progress: "bg-blue-100 text-blue-800",
  pending: "bg-gray-100 text-gray-800",
  blocked: "bg-red-100 text-red-800",
};

const priorityBadge: Record<string, string> = {
  critical: "bg-red-500 text-white",
  high: "bg-orange-100 text-orange-800",
  medium: "bg-yellow-100 text-yellow-800",
  low: "bg-gray-100 text-gray-600",
};

export default function TasksPage() {
  const byStatus = {
    pending: tasks.filter((t) => t.status === "pending"),
    in_progress: tasks.filter((t) => t.status === "in_progress"),
    blocked: tasks.filter((t) => t.status === "blocked"),
    completed: tasks.filter((t) => t.status === "completed"),
  };

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
          <Link href="/tasks" className="flex items-center gap-3 px-3 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium">
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
            <h2 className="text-xl font-semibold text-gray-900">Tasks</h2>
            <p className="text-sm text-gray-500">Field execution tracking</p>
          </div>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700">
            + New Task
          </button>
        </header>

        <div className="p-8">
          {/* Kanban Board */}
          <div className="grid grid-cols-4 gap-4">
            {Object.entries(byStatus).map(([status, statusTasks]) => (
              <div key={status} className="bg-gray-100 rounded-xl p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-gray-700 capitalize">{status.replace("_", " ")}</h3>
                  <span className="bg-gray-200 text-gray-600 text-xs px-2 py-0.5 rounded-full">{statusTasks.length}</span>
                </div>
                <div className="space-y-3">
                  {statusTasks.map((task) => (
                    <div key={task.id} className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                      <div className="flex items-start justify-between mb-2">
                        <p className="text-sm font-medium text-gray-900 leading-tight">{task.name}</p>
                        <span className={`text-xs px-1.5 py-0.5 rounded font-medium ml-2 flex-shrink-0 ${priorityBadge[task.priority]}`}>
                          {task.priority}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mb-3">{task.project}</p>
                      {task.status !== "pending" && task.status !== "completed" && (
                        <div className="mb-3">
                          <div className="flex justify-between text-xs text-gray-500 mb-1">
                            <span>Progress</span>
                            <span>{task.progress}%</span>
                          </div>
                          <div className="bg-gray-100 rounded-full h-1.5">
                            <div
                              className={`h-1.5 rounded-full ${task.status === "blocked" ? "bg-red-400" : "bg-blue-500"}`}
                              style={{ width: `${task.progress}%` }}
                            />
                          </div>
                        </div>
                      )}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <div className="w-5 h-5 rounded-full bg-gray-300 flex items-center justify-center text-xs">
                            {task.assignee.charAt(0)}
                          </div>
                          <span className="text-xs text-gray-500">{task.assignee.split(" ")[0]}</span>
                        </div>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${statusBadge[task.status]}`}>
                          {task.status.replace("_", " ")}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
