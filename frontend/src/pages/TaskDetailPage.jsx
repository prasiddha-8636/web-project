import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import api from '../api/axios'
import Navbar from '../components/Navbar'

export default function TaskDetailPage() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [task, setTask] = useState(null)
    const [comments, setComments] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [newComment, setNewComment] = useState('')
    const [submittingComment, setSubmittingComment] = useState(false)
    const [isEditing, setIsEditing] = useState(false)
    const [editedTask, setEditedTask] = useState({})

    const fetchData = async () => {
        try {
            const { data } = await api.get(`/tasks/${id}/`)
            setTask(data)
            setEditedTask(data)
            const commRes = await api.get(`/tasks/${id}/comments/`)
            setComments(commRes.data)
        } catch (err) {
            setError('Failed to load task details')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
    }, [id])

    const handleUpdateTask = async (e) => {
        e.preventDefault()
        try {
            const { data } = await api.patch(`/tasks/${id}/`, editedTask)
            setTask(data)
            setIsEditing(false)
        } catch (err) {
            alert('Failed to update task')
        }
    }

    const handleDeleteTask = async () => {
        if (!window.confirm('Are you sure you want to delete this task?')) return
        try {
            await api.delete(`/tasks/${id}/`)
            navigate(`/projects/${task.project}`)
        } catch (err) {
            alert('Failed to delete task')
        }
    }

    const handleAddComment = async (e) => {
        e.preventDefault()
        if (!newComment.trim()) return
        setSubmittingComment(true)
        try {
            const { data } = await api.post(`/tasks/${id}/comments/`, { body: newComment })
            setComments([...comments, data])
            setNewComment('')
        } catch (err) {
            alert('Failed to add comment')
        } finally {
            setSubmittingComment(false)
        }
    }

    const handleDeleteComment = async (commentId) => {
        try {
            await api.delete(`/comments/${commentId}/`)
            setComments(comments.filter(c => c.id !== commentId))
        } catch (err) {
            alert('Failed to delete comment')
        }
    }

    const updateProperty = async (name, value) => {
        try {
            const { data } = await api.patch(`/tasks/${id}/`, { [name]: value })
            setTask(data)
            setEditedTask(data)
        } catch (err) {
            alert('Failed to update task')
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
                    <Link to="/">Projects</Link> / <Link to={`/projects/${task.project}`}>Project</Link> / <span>{task.title}</span>
                </div>

                <div className="task-detail-grid">
                    <section className="task-main">
                        <div className="card p-24 mb-24">
                            {isEditing ? (
                                <form onSubmit={handleUpdateTask} className="edit-task-form">
                                    <div className="form-group mb-16">
                                        <label className="form-label">Title</label>
                                        <input
                                            className="form-input"
                                            value={editedTask.title}
                                            onChange={e => setEditedTask({ ...editedTask, title: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="form-group mb-16">
                                        <label className="form-label">Description</label>
                                        <textarea
                                            className="form-input"
                                            rows="4"
                                            value={editedTask.description}
                                            onChange={e => setEditedTask({ ...editedTask, description: e.target.value })}
                                        />
                                    </div>
                                    <div className="flex-align-center gap-12">
                                        <button type="submit" className="btn btn-primary">Save Changes</button>
                                        <button type="button" className="btn btn-ghost" onClick={() => setIsEditing(false)}>Cancel</button>
                                    </div>
                                </form>
                            ) : (
                                <>
                                    <div className="task-detail-header mb-16">
                                        <h1>{task.title}</h1>
                                        <div className="flex-align-center gap-12">
                                            <button className="btn btn-ghost btn-sm" onClick={() => setIsEditing(true)}>Edit</button>
                                            <button className="btn btn-danger btn-sm" onClick={handleDeleteTask}>Delete</button>
                                        </div>
                                    </div>
                                    <p className="task-detail-description text-muted mb-24">
                                        {task.description || 'No description provided.'}
                                    </p>
                                </>
                            )}
                        </div>

                        <div className="comments-section">
                            <h2 className="mb-16">Comments ({comments.length})</h2>

                            <div className="comment-list mb-24">
                                {comments.length === 0 ? (
                                    <p className="text-faint italic py-16">No comments yet. Be the first to comment!</p>
                                ) : (
                                    comments.map(comment => (
                                        <div key={comment.id} className="comment-item">
                                            <div className="comment-avatar">
                                                {comment.author.username.charAt(0).toUpperCase()}
                                            </div>
                                            <div className="comment-body">
                                                <div className="comment-header">
                                                    <span className="comment-author">{comment.author.username}</span>
                                                    <span className="comment-date">{new Date(comment.created_at).toLocaleString()}</span>
                                                    <button className="comment-delete" onClick={() => handleDeleteComment(comment.id)} title="Delete comment">&times;</button>
                                                </div>
                                                <p className="comment-text">{comment.body}</p>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>

                            <form onSubmit={handleAddComment} className="comment-form card p-16">
                                <textarea
                                    className="form-input mb-12"
                                    placeholder="Write a comment..."
                                    rows="3"
                                    value={newComment}
                                    onChange={e => setNewComment(e.target.value)}
                                    required
                                />
                                <div className="flex-justify-end">
                                    <button type="submit" className="btn btn-primary btn-sm" disabled={submittingComment}>
                                        {submittingComment ? <div className="spinner" /> : 'Post Comment'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </section>

                    <aside className="task-side">
                        <div className="card p-24 sticky-side">
                            <h3 className="mb-16">Properties</h3>

                            <div className="property-group mb-20">
                                <label className="form-label">Status</label>
                                <select
                                    className="form-input mt-4"
                                    value={task.status}
                                    onChange={e => updateProperty('status', e.target.value)}
                                >
                                    <option value="todo">To Do</option>
                                    <option value="in_progress">In Progress</option>
                                    <option value="done">Done</option>
                                </select>
                            </div>

                            <div className="property-group mb-20">
                                <label className="form-label">Priority</label>
                                <select
                                    className="form-input mt-4"
                                    value={task.priority}
                                    onChange={e => updateProperty('priority', e.target.value)}
                                >
                                    <option value="low">Low</option>
                                    <option value="medium">Medium</option>
                                    <option value="high">High</option>
                                </select>
                            </div>

                            <div className="property-group mb-20">
                                <label className="form-label">Created</label>
                                <div className="text-muted mt-4 font-size-14">
                                    {new Date(task.created_at).toLocaleDateString()}
                                </div>
                            </div>

                            <div className="property-group">
                                <label className="form-label">Last Updated</label>
                                <div className="text-muted mt-4 font-size-14">
                                    {new Date(task.updated_at).toLocaleDateString()}
                                </div>
                            </div>
                        </div>
                    </aside>
                </div>
            </main>
        </div>
    )
}
