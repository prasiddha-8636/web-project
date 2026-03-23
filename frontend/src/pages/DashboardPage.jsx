import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/axios'
import Navbar from '../components/Navbar'

export default function DashboardPage() {
    const [projects, setProjects] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
    const [newProject, setNewProject] = useState({ name: '', description: '' })
    const [submitting, setSubmitting] = useState(false)

    const fetchProjects = async () => {
        try {
            const { data } = await api.get('/projects/')
            setProjects(data)
        } catch (err) {
            setError('Failed to load projects')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchProjects()
    }, [])

    const handleCreateProject = async (e) => {
        e.preventDefault()
        setSubmitting(true)
        try {
            const { data } = await api.post('/projects/', newProject)
            setProjects([data, ...projects])
            setNewProject({ name: '', description: '' })
            setIsCreateModalOpen(false)
        } catch (err) {
            alert('Failed to create project')
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <div className="page-container">
            <Navbar />

            <main className="main-content">
                <header className="content-header">
                    <div>
                        <h1>My Projects</h1>
                        <p className="text-muted">Manage and track your active projects</p>
                    </div>
                    <button
                        className="btn btn-primary"
                        onClick={() => setIsCreateModalOpen(true)}
                    >
                        New Project
                    </button>
                </header>

                {loading ? (
                    <div className="flex-center py-48">
                        <div className="spinner lg" />
                    </div>
                ) : error ? (
                    <div className="form-error-banner">{error}</div>
                ) : projects.length === 0 ? (
                    <div className="empty-state">
                        <p>No projects found. Create your first project to get started!</p>
                        <button
                            className="btn btn-ghost"
                            onClick={() => setIsCreateModalOpen(true)}
                        >
                            Create Project
                        </button>
                    </div>
                ) : (
                    <div className="project-grid">
                        {projects.map(project => (
                            <Link key={project.id} to={`/projects/${project.id}`} className="project-card">
                                <div className="project-card-header">
                                    <span className={`badge badge-${project.status}`}>
                                        {project.status === 'active' ? 'Active' : 'Archived'}
                                    </span>
                                    <span className="project-date">
                                        {new Date(project.created_at).toLocaleDateString()}
                                    </span>
                                </div>
                                <h3 className="project-title">{project.name}</h3>
                                <p className="project-description">{project.description || 'No description provided.'}</p>
                                <div className="project-footer">
                                    <span className="task-count">
                                        <strong>{project.open_task_count}</strong> open tasks
                                    </span>
                                    <div className="chevron-icon">→</div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </main>

            {isCreateModalOpen && (
                <div className="modal-overlay" onClick={() => setIsCreateModalOpen(false)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>New Project</h2>
                            <button className="modal-close" onClick={() => setIsCreateModalOpen(false)}>&times;</button>
                        </div>
                        <form onSubmit={handleCreateProject} className="modal-form">
                            <div className="form-group">
                                <label className="form-label">Project Name</label>
                                <input
                                    className="form-input"
                                    value={newProject.name}
                                    onChange={e => setNewProject({ ...newProject, name: e.target.value })}
                                    placeholder="e.g. Website Redesign"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Description</label>
                                <textarea
                                    className="form-input"
                                    rows="3"
                                    value={newProject.description}
                                    onChange={e => setNewProject({ ...newProject, description: e.target.value })}
                                    placeholder="Optional project details..."
                                />
                            </div>
                            <div className="modal-actions">
                                <button type="button" className="btn btn-ghost" onClick={() => setIsCreateModalOpen(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary" disabled={submitting}>
                                    {submitting ? <div className="spinner" /> : 'Create Project'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
