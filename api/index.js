const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// ── In-memory mock data ──────────────────────────────────────────────────────

const users = [
  { id: "u1", tenant_id: "t1", email: "admin@constructflow.com", name: "Admin User", role: "admin", created_at: "2024-01-01T00:00:00Z" },
  { id: "u2", tenant_id: "t1", email: "manager@constructflow.com", name: "Jane Manager", role: "manager", created_at: "2024-01-02T00:00:00Z" },
];

const projects = [
  { id: "p1", tenant_id: "t1", name: "Downtown Office Complex", status: "active", start_date: "2024-01-15", end_date: "2024-08-30", created_at: "2024-01-10T00:00:00Z" },
  { id: "p2", tenant_id: "t1", name: "Highway Bridge Repair", status: "active", start_date: "2024-02-01", end_date: "2024-06-15", created_at: "2024-01-25T00:00:00Z" },
  { id: "p3", tenant_id: "t1", name: "Riverside Apartments", status: "planning", start_date: "2024-03-01", end_date: "2025-02-28", created_at: "2024-02-15T00:00:00Z" },
  { id: "p4", tenant_id: "t1", name: "Airport Terminal B", status: "on_hold", start_date: "2023-09-01", end_date: "2025-06-30", created_at: "2023-08-20T00:00:00Z" },
];

const tasks = [
  { id: "t1", project_id: "p1", name: "Foundation Concrete Pour", status: "completed", assigned_to: "u2", progress_pct: 100, created_at: "2024-01-16T00:00:00Z", updated_at: "2024-02-01T00:00:00Z" },
  { id: "t2", project_id: "p1", name: "Steel Frame Installation", status: "in_progress", assigned_to: "u2", progress_pct: 72, created_at: "2024-02-01T00:00:00Z", updated_at: "2024-02-20T00:00:00Z" },
  { id: "t3", project_id: "p2", name: "Bridge Deck Inspection", status: "blocked", assigned_to: "u2", progress_pct: 20, created_at: "2024-02-05T00:00:00Z", updated_at: "2024-02-18T00:00:00Z" },
  { id: "t4", project_id: "p2", name: "Rebar Placement Section B", status: "in_progress", assigned_to: "u2", progress_pct: 60, created_at: "2024-02-10T00:00:00Z", updated_at: "2024-02-22T00:00:00Z" },
];

const invoices = [
  { id: "inv1", tenant_id: "t1", project_id: "p1", invoice_number: "INV-001", amount: 45200, status: "sent", created_at: "2024-01-15T00:00:00Z", updated_at: "2024-01-15T00:00:00Z" },
  { id: "inv2", tenant_id: "t1", project_id: "p2", invoice_number: "INV-002", amount: 18750, status: "paid", created_at: "2024-01-10T00:00:00Z", updated_at: "2024-01-28T00:00:00Z" },
  { id: "inv3", tenant_id: "t1", project_id: "p3", invoice_number: "INV-003", amount: 6300, status: "draft", created_at: "2024-01-20T00:00:00Z", updated_at: "2024-01-20T00:00:00Z" },
  { id: "inv4", tenant_id: "t1", project_id: "p4", invoice_number: "INV-004", amount: 230000, status: "overdue", created_at: "2023-12-01T00:00:00Z", updated_at: "2024-01-01T00:00:00Z" },
];

const payments = [
  { id: "pay1", invoice_id: "inv2", amount: 18750, payment_date: "2024-01-28", method: "bank_transfer", created_at: "2024-01-28T00:00:00Z" },
];

// ── Auth routes ──────────────────────────────────────────────────────────────

app.post("/v1/auth/login", (req, res) => {
  const { email, password } = req.body;
  const user = users.find((u) => u.email === email);
  if (!user || password !== "password") {
    return res.status(401).json({ error: "Invalid credentials" });
  }
  return res.json({ token: "mock-jwt-token-" + user.id, user });
});

app.post("/v1/auth/logout", (req, res) => res.json({ message: "Logged out" }));

app.post("/v1/auth/refresh", (req, res) => res.json({ token: "mock-jwt-token-refreshed" }));

app.get("/v1/users/me", (req, res) => res.json(users[0]));

// ── Execution routes ─────────────────────────────────────────────────────────

app.get("/v1/projects", (req, res) => {
  const { status } = req.query;
  const filtered = status ? projects.filter((p) => p.status === status) : projects;
  res.json(filtered);
});

app.post("/v1/projects", (req, res) => {
  const project = { id: "p" + Date.now(), tenant_id: "t1", ...req.body, created_at: new Date().toISOString() };
  projects.push(project);
  res.status(201).json(project);
});

app.get("/v1/projects/:projectId/tasks", (req, res) => {
  const projectTasks = tasks.filter((t) => t.project_id === req.params.projectId);
  res.json(projectTasks);
});

app.post("/v1/projects/:projectId/tasks", (req, res) => {
  const task = { id: "t" + Date.now(), project_id: req.params.projectId, ...req.body, created_at: new Date().toISOString(), updated_at: new Date().toISOString() };
  tasks.push(task);
  res.status(201).json(task);
});

// Valid monotonic state transitions
const TASK_TRANSITIONS = {
  pending: ["in_progress"],
  in_progress: ["completed", "blocked"],
  blocked: ["in_progress"],
  completed: [],
};

app.put("/v1/tasks/:taskId/progress", (req, res) => {
  const task = tasks.find((t) => t.id === req.params.taskId);
  if (!task) return res.status(404).json({ error: "Task not found" });
  const { status, completion_percentage } = req.body;
  if (status && !TASK_TRANSITIONS[task.status].includes(status)) {
    return res.status(422).json({ error: `Invalid state transition: ${task.status} → ${status}` });
  }
  if (status) task.status = status;
  if (completion_percentage !== undefined) task.progress_pct = completion_percentage;
  task.updated_at = new Date().toISOString();
  res.json(task);
});

// ── Finance routes ───────────────────────────────────────────────────────────

app.get("/v1/invoices", (req, res) => {
  const { status, page = 1 } = req.query;
  const filtered = status ? invoices.filter((i) => i.status === status) : invoices;
  res.json({ invoices: filtered, total: filtered.length, page: Number(page) });
});

app.post("/v1/invoices", (req, res) => {
  const invoice = { id: "inv" + Date.now(), tenant_id: "t1", invoice_number: "INV-" + String(invoices.length + 1).padStart(3, "0"), status: "draft", ...req.body, created_at: new Date().toISOString(), updated_at: new Date().toISOString() };
  invoices.push(invoice);
  res.status(201).json(invoice);
});

app.get("/v1/payments", (req, res) => res.json(payments));

app.post("/v1/payments", (req, res) => {
  const payment = { id: "pay" + Date.now(), ...req.body, created_at: new Date().toISOString() };
  const invoice = invoices.find((i) => i.id === payment.invoice_id);
  if (invoice) invoice.status = "paid";
  payments.push(payment);
  res.status(201).json(payment);
});

// ── Health check ─────────────────────────────────────────────────────────────

app.get("/health", (req, res) => res.json({ status: "ok", version: "1.0.0", service: "constructflow-api" }));

app.listen(PORT, () => {
  console.log(`ConstructFlow API running on http://localhost:${PORT}`);
  console.log(`  GET  /v1/projects         - List all projects`);
  console.log(`  POST /v1/auth/login       - Authenticate (email + password)`);
  console.log(`  GET  /v1/invoices         - List invoices`);
  console.log(`  GET  /health              - Health check`);
});
