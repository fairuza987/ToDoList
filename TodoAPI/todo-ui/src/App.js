import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
const apiUrl = 'https://localhost:7291/ToDO';

function App() {
    const [todos, setTodos] = useState([]);
    const [title, setTitle] = useState("");
    const [editId, setEditId] = useState(null);
    const [editTitle, setEditTitle] = useState("");
    const [error, setError] = useState(""); // NEW: track error message

    useEffect(() => {
        fetchTodos();
    }, []);

    const fetchTodos = () => {
        axios.get(apiUrl)
            .then(res => setTodos(res.data))
            .catch(err => console.error("Error fetching todos", err));
    };

    const addTodo = () => {
        if (!title.trim()) {
            setError("Task title cannot be empty.");
            return;
        }

        axios.post(apiUrl, { title, isCompleted: false })
            .then(() => {
                setTitle("");
                setError(""); // clear error
                fetchTodos();
            });
    };

    const deleteTodo = (id) => {
        axios.delete(`${apiUrl}/${id}`)
            .then(() => fetchTodos());
    };

    const startEdit = (todo) => {
        setEditId(todo.id);
        setEditTitle(todo.title);
        setError(""); // clear error when starting edit
    };

    const saveEdit = (id) => {
        if (!editTitle.trim()) {
            setError("Edited title cannot be empty.");
            return;
        }

        axios.put(`${apiUrl}/${id}`, { id, title: editTitle, isCompleted: todos.find(t => t.id === id).isCompleted })
            .then(() => {
                setEditId(null);
                setEditTitle("");
                setError(""); // clear error
                fetchTodos();
            });
    };

    const toggleCompleted = (todo) => {
        axios.put(`${apiUrl}/${todo.id}`, {
            id: todo.id,
            title: todo.title,
            isCompleted: !todo.isCompleted
        })
            .then(() => fetchTodos());
    };

    return (
        <div className="container mt-5">
            <h1 className="text-center mb-4">📝 To-do List</h1>

            {error && (
                <div className="alert alert-danger" role="alert">
                    {error}
                </div>
            )}

            <div className="input-group mb-3">
                <input
                    className="form-control"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    placeholder="New task..."
                />
                <button className="btn btn-primary" onClick={addTodo}>Add</button>
            </div>

            <table className="table table-bordered table-striped">
                <thead className="table-dark">
                    <tr>
                        <th>Done</th>
                        <th style={{ width: '60%' }}>Title</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {todos.map(todo => (
                        <tr key={todo.id}>
                            <td className="text-center">
                                <input
                                    type="checkbox"
                                    checked={todo.isCompleted}
                                    onChange={() => toggleCompleted(todo)}
                                />
                            </td>
                            <td style={{ textDecoration: todo.isCompleted ? "line-through" : "none" }}>
                                {editId === todo.id ? (
                                    <input
                                        className="form-control"
                                        value={editTitle}
                                        onChange={e => setEditTitle(e.target.value)}
                                    />
                                ) : (
                                    todo.title
                                )}
                            </td>
                            <td>
                                {editId === todo.id ? (
                                    <>
                                        <button className="btn btn-success btn-sm me-2" onClick={() => saveEdit(todo.id)}>Save</button>
                                        <button className="btn btn-secondary btn-sm" onClick={() => setEditId(null)}>Cancel</button>
                                    </>
                                ) : (
                                    <>
                                        <button className="btn btn-warning btn-sm me-2" onClick={() => startEdit(todo)}>Edit</button>
                                        <button className="btn btn-danger btn-sm" onClick={() => deleteTodo(todo.id)}>Delete</button>
                                    </>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default App;
