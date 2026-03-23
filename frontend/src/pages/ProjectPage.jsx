import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import api from '../api/axios'
import Navbar from '../components/Navbar'

export default function ProjectPage() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [project, setProject] = useState(null)
    const [tasks, setTasks] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [isCreateTaskModalOpen, setIsCreateTaskModalOpen] = useState(false)
    const [newTask, setNewTask] = useState({ title: '', description: '', priority: 'medium', status: 'todo' })
    const [submitting, setSubmitting] = useState(false)

    const fetchData = async () => {
        try {
            const [projRes, tasksRes] = await Promise.all([
                api.get(`/projects/${id}/`),
                api.get(`/projects/${id}/tasks/`)
            ])
            setProject(projRes.data)
            setTasks(tasksRes.data)
        } catch (err) {
            setError('Failed to load project details')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
    }, [id])

    const handleCreateTask = async (e) => {
        e.preventDefault()
        setSubmitting(true)
        try {
            const { data } = await api.post(`/projects/${id}/tasks/`, newTask)
            setTasks([data, ...tasks])
            setNewTask({ title: '', description: '', priority: 'medium', status: 'todo' })
            setIsCreateTaskModalOpen(false)
        } catch (err) {
            alert('Failed to create task')
        } finally {
            setSubmitting(false)
        }
    }

    const handleDeleteProject = async () => {
        if (!window.confirm('Are you sure you want to delete this project? All tasks will be lost.')) return
        try {
            await api.delete(`/projects/${id}/`)
            navigate('/')
        } catch (err) {
            alert('Failed to delete project')
        }
    }

    if (loading) return (
        <div className="page-container">
            <Navbar />
            <div className="flex-center flex-1">
                <div className="spinner lg" />
            </div>
        </div>
    )

    if (error) return (
        <div className="page-container">
            <Navbar />
            <div className="main-content">
                <div className="form-error-banner">{error}</div>
                <Link to="/" className="btn btn-ghost mt-16">Back to Dashboard</Link>
            </div>
        </div>
    )

    return (
        <div className="page-container">
            <Navbar />

            <main className="main-content">
                <div className="breadcrumb">
                    <Link to="/">Projects</Link> / <span>{project.name}</span>
                </div>

                <header className="content-header border-bottom pb-24 mb-32">
                    <div className="project-header-info">
                        <div className="flex-align-center gap-12 mb-8">
                            <h1>{project.name}</h1>
                            <span className={`badge badge-${project.status}`}>{project.status}</span>
                        </div>
                        <p className="text-muted">{project.description || 'No description'}</p>
                    </div>
                    <div className="flex-align-center gap-12">
                        <button className="btn btn-danger" onClick={handleDeleteProject}>Delete Project</button>
                        <button className="btn btn-primary" onClick={() => setIsCreateTaskModalOpen(true)}>Add Task</button>
                    </div>
                </header>

                <div className="task-section">
                    <div className="task-section-header">
                        <h2>Tasks ({tasks.length})</h2>
                    </div>

                    {tasks.length === 0 ? (
                        <div className="empty-state card">
                            <p>No tasks yet. Start by adding one!</p>
                            <button className="btn btn-ghost btn-sm" onClick={() => setIsCreateTaskModalOpen(true)}>Add Task</button>
                        </div>
                    ) : (
                        <div className="task-list">
                            {tasks.map(task => (
                                <Link key={task.id} to={`/tasks/${task.id}`} className="task-item">
                                    <div className="task-item-left">
                                        <div className={`priority-dot priority-${task.priority}`} title={`Priority: ${task.priority}`} />
                                        <span className="task-title">{task.title}</span>
                                    </div>
                                    <div className="task-item-right">
                                        <span className={`badge badge-${task.status}`}>{task.status.replace('_', ' ')}</span>
                                        <span className="task-date">{task.due_date || 'No due date'}</span>
                                        <span className="comment-pill">
                                            {task.comment_count} comments
                                        </span>
                                        <div className="chevron-icon">→</div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </main>

            {isCreateTaskModalOpen && (
                <div className="modal-overlay" onClick={() => setIsCreateTaskModalOpen(false)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>New Task</h2>
                            <button className="modal-close" onClick={() => setIsCreateTaskModalOpen(false)}>&times;</button>
                        </div>
                        <form onSubmit={handleCreateTask} className="modal-form">
                            <div className="form-group">
                                <label className="form-label">Task Title</label>
                                <input
                                    className="form-input"
                                    value={newTask.title}
                                    onChange={e => setNewTask({ ...newTask, title: e.target.value })}
                                    placeholder="What needs to be done?"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Description</label>
                                <textarea
                                    className="form-input"
                                    rows="3"
                                    value={newTask.description}
                                    onChange={e => setNewTask({ ...newTask, description: e.target.value })}
                                    placeholder="Optional details..."
                                />
                            </div>
                            <div className="form-row">
                                <div className="form-group flex-1">
                                    <label className="form-label">Priority</label>
                                    <select
                                        className="form-input"
                                        value={newTask.priority}
                                        onChange={e => setNewTask({ ...newTask, priority: e.target.value })}
                                    >
                                        <option value="low">Low</option>
                                        <option value="medium">Medium</option>
                                        <option value="high">High</option>
                                    </select>
                                </div>
                                <div className="form-group flex-1">
                                    <label className="form-label">Status</label>
                                    <select
                                        className="form-input"
                                        value={newTask.status}
                                        onChange={e => setNewTask({ ...newTask, status: e.target.value })}
                                    >
                                        <option value="todo">To Do</option>
                                        <option value="in_progress">In Progress</option>
                                        <option value="done">Done</option>
                                    </select>
                                </div>
                            </div>
                            <div className="modal-actions">
                                <button type="button" className="btn btn-ghost" onClick={() => setIsCreateTaskModalOpen(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary" disabled={submitting}>
                                    {submitting ? <div className="spinner" /> : 'Create Task'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
