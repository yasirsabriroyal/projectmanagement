'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authApi, projectsApi, Project } from '@/lib/api';
import { clearTokens, isAuthenticated } from '@/lib/auth';
import styles from './dashboard.module.css';

interface Me {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  organizationId?: string;
  roles: string[];
  permissions: string[];
}

export default function DashboardPage() {
  const router = useRouter();
  const [me, setMe] = useState<Me | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDesc, setNewProjectDesc] = useState('');
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState('');

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login');
      return;
    }
    loadData();
  }, [router]);

  async function loadData() {
    try {
      const [meRes, projectsRes] = await Promise.all([
        authApi.me(),
        projectsApi.list(),
      ]);
      setMe(meRes.data);
      setProjects(projectsRes.data);
    } catch {
      router.push('/login');
    } finally {
      setLoading(false);
    }
  }

  async function handleLogout() {
    const refreshToken = localStorage.getItem('refreshToken') || '';
    try {
      await authApi.logout(refreshToken);
    } catch { /* ignore */ }
    clearTokens();
    router.push('/login');
  }

  async function handleCreateProject(e: React.FormEvent) {
    e.preventDefault();
    if (!me?.organizationId) {
      setCreateError('No organization associated with your account');
      return;
    }
    setCreating(true);
    setCreateError('');
    try {
      const res = await projectsApi.create({
        name: newProjectName,
        description: newProjectDesc || undefined,
        organizationId: me.organizationId,
      });
      setProjects([res.data, ...projects]);
      setNewProjectName('');
      setNewProjectDesc('');
      setShowCreate(false);
    } catch (err: unknown) {
      const message =
        err && typeof err === 'object' && 'response' in err
          ? (err as { response?: { data?: { message?: string } } }).response?.data?.message || 'Failed to create project'
          : 'Failed to create project';
      setCreateError(message);
    } finally {
      setCreating(false);
    }
  }

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner} />
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className={styles.layout}>
      <nav className={styles.nav}>
        <div className={styles.navBrand}>🏗️ ConstructFlow</div>
        <div className={styles.navUser}>
          <span>{me?.firstName} {me?.lastName}</span>
          <span className={styles.roleTag}>{me?.roles[0] || 'User'}</span>
          <button onClick={handleLogout} className={styles.logoutBtn}>Sign out</button>
        </div>
      </nav>

      <main className={styles.main}>
        <div className={styles.header}>
          <div>
            <h1>Dashboard</h1>
            <p className={styles.subtitle}>Welcome back, {me?.firstName}!</p>
          </div>
          {me?.permissions.includes('projects.write') && (
            <button onClick={() => setShowCreate(!showCreate)} className={styles.createBtn}>
              {showCreate ? '✕ Cancel' : '+ New Project'}
            </button>
          )}
        </div>

        {showCreate && (
          <div className={styles.createCard}>
            <h3>Create New Project</h3>
            <form onSubmit={handleCreateProject} className={styles.createForm}>
              <input
                placeholder="Project name *"
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
                required
              />
              <textarea
                placeholder="Description (optional)"
                value={newProjectDesc}
                onChange={(e) => setNewProjectDesc(e.target.value)}
                rows={3}
              />
              {createError && <div className={styles.error}>{createError}</div>}
              <div className={styles.createActions}>
                <button type="submit" disabled={creating} className={styles.submitBtn}>
                  {creating ? 'Creating...' : 'Create Project'}
                </button>
              </div>
            </form>
          </div>
        )}

        <div className={styles.statsRow}>
          <div className={styles.statCard}>
            <div className={styles.statNum}>{projects.length}</div>
            <div className={styles.statLabel}>Total Projects</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statNum}>{projects.filter(p => p.status === 'ACTIVE').length}</div>
            <div className={styles.statLabel}>Active</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statNum}>{projects.filter(p => p.status === 'COMPLETED').length}</div>
            <div className={styles.statLabel}>Completed</div>
          </div>
        </div>

        <section className={styles.section}>
          <h2>Projects</h2>
          {projects.length === 0 ? (
            <div className={styles.empty}>
              <p>No projects yet.</p>
              {me?.permissions.includes('projects.write') && (
                <button onClick={() => setShowCreate(true)} className={styles.createBtn}>Create your first project</button>
              )}
            </div>
          ) : (
            <div className={styles.projectGrid}>
              {projects.map((p) => (
                <div key={p.id} className={styles.projectCard}>
                  <div className={styles.projectHeader}>
                    <h3>{p.name}</h3>
                    <span className={`${styles.status} ${styles[p.status.toLowerCase()]}`}>
                      {p.status}
                    </span>
                  </div>
                  {p.description && <p className={styles.projectDesc}>{p.description}</p>}
                  <div className={styles.projectMeta}>
                    <span>📁 {p.organization?.name || 'Unknown org'}</span>
                    {p._count && <span>👥 {p._count.memberships} members</span>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
