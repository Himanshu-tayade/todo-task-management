import Navbar from "../components/Navbar";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

const Dashboard = () => {
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const res = await api.get('/tasks');
      setTasks(res.data.tasks || res.data);
    } catch (error) {
      console.error(error);
      alert("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;

    try {
      await api.delete(`/tasks/${id}`);
      fetchTasks();
    } catch (error) {
      alert("Delete failed");
    }
  };

  const handleStatusToggle = async (task) => {
    const newStatus = task.status === "pending" ? "completed" : "pending";

    try {
      await api.patch(`/tasks/${task._id}/status`, {
        status: newStatus
      });
      fetchTasks();
    } catch (error) {
      alert("Status update failed");
    }
  };

  const filteredTasks = filter === "all" 
    ? tasks 
    : tasks.filter(t => t.status === filter);

  const highPriority = filteredTasks.filter(t => t.priority === "high");
  const mediumPriority = filteredTasks.filter(t => t.priority === "medium");
  const lowPriority = filteredTasks.filter(t => t.priority === "low");

  const TaskCard = ({ task, onDelete, onStatusChange, onView, onEdit }) => {
    const priorityColors = {
      high: {
        bg: "bg-white",
        border: "border-red-200",
        badge: "bg-red-50 text-red-600 border-red-100",
        text: "text-red-600",
        accent: "border-l-red-500"
      },
      medium: {
        bg: "bg-white",
        border: "border-yellow-200",
        badge: "bg-yellow-50 text-yellow-600 border-yellow-100",
        text: "text-yellow-600",
        accent: "border-l-yellow-500"
      },
      low: {
        bg: "bg-white",
        border: "border-green-200",
        badge: "bg-green-50 text-green-600 border-green-100",
        text: "text-green-600",
        accent: "border-l-green-500"
      }
    };

    const colors = priorityColors[task.priority] || priorityColors.low;
    const isCompleted = task.status === "completed";

    return (
      <div className={`${colors.bg} border ${colors.border} border-l-4 ${colors.accent} rounded-lg p-4 hover:shadow-md transition-all duration-200 h-full flex flex-col`}>
        <div className="flex-1 mb-4">
          <div className="flex items-start justify-between gap-2 mb-3">
            <h3 className={`text-base font-semibold text-gray-800 line-clamp-2 ${isCompleted ? 'line-through opacity-60' : ''}`}>
              {task.title}
            </h3>
            <span className={`${colors.badge} border px-2 py-0.5 rounded text-xs font-medium uppercase tracking-wide whitespace-nowrap`}>
              {task.priority}
            </span>
          </div>
          <p className={`text-gray-600 text-sm leading-relaxed line-clamp-3 ${isCompleted ? 'line-through opacity-60' : ''}`}>
            Due Date : {new Date(task.dueDate).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
            })}
          </p>
          <div className="mt-3">
            <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
              isCompleted 
                ? 'bg-green-50 text-green-600 border border-green-100' 
                : 'bg-gray-50 text-gray-600 border border-gray-200'
            }`}>
              {task.status}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 pt-3 border-t border-gray-100">
          <button
            onClick={() => onStatusChange(task)}
            className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-md text-xs font-medium transition-all ${
              isCompleted
                ? 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200'
                : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            {isCompleted ? 'Pending' : 'Complete'}
          </button>

          <button
            onClick={onView}
            className="flex items-center justify-center gap-1.5 px-3 py-2 bg-gray-50 text-gray-600 border border-gray-200 rounded-md text-xs font-medium hover:bg-gray-100 transition-all"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            View
          </button>

          <button
            onClick={onEdit}
            className="flex items-center justify-center gap-1.5 px-3 py-2 bg-gray-50 text-gray-600 border border-gray-200 rounded-md text-xs font-medium hover:bg-gray-100 transition-all"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Edit
          </button>

          <button
            onClick={() => onDelete(task._id)}
            className="flex items-center justify-center gap-1.5 px-3 py-2 bg-gray-50 text-gray-600 border border-gray-200 rounded-md text-xs font-medium hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Delete
          </button>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <svg className="animate-spin h-12 w-12 text-indigo-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="text-gray-600 font-medium">Loading your tasks...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">My Tasks</h1>
                <p className="text-gray-600">Manage and organize your tasks efficiently</p>
              </div>
              <button 
                onClick={() => navigate("/task-form")}
                className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-300 transition-all flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Task
              </button>
            </div>

            <div className="flex items-center gap-3 mt-6 pb-6 border-b border-gray-200">
              <span className="text-sm font-medium text-gray-700">Filter:</span>
              <button
                onClick={() => setFilter("all")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  filter === "all"
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                All Tasks
              </button>
              <button
                onClick={() => setFilter("pending")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  filter === "pending"
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Pending
              </button>
              <button
                onClick={() => setFilter("completed")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  filter === "completed"
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Completed
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-red-600 text-sm font-medium">High Priority</p>
                    <p className="text-2xl font-bold text-red-700 mt-1">{highPriority.length}</p>
                  </div>
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-yellow-700 text-sm font-medium">Medium Priority</p>
                    <p className="text-2xl font-bold text-yellow-800 mt-1">{mediumPriority.length}</p>
                  </div>
                  <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-700 text-sm font-medium">Low Priority</p>
                    <p className="text-2xl font-bold text-green-800 mt-1">{lowPriority.length}</p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <section className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-1 h-8 bg-red-500 rounded-full"></div>
              <h2 className="text-2xl font-bold text-red-600">High Priority</h2>
              <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-semibold">
                {highPriority.length}
              </span>
            </div>
            {highPriority.length === 0 ? (
              <div className="bg-white border-2 border-dashed border-gray-300 rounded-xl p-8 text-center">
                <svg className="w-16 h-16 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="text-gray-500 font-medium">No high priority tasks</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {highPriority.map(task => (
                  <TaskCard
                    key={task._id}
                    task={task}
                    onDelete={handleDelete}
                    onStatusChange={handleStatusToggle}
                    onView={() => navigate(`/task/${task._id}`)}
                    onEdit={() => navigate(`/task-form?id=${task._id}`)}
                  />
                ))}
              </div>
            )}
          </section>

          <section className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-1 h-8 bg-yellow-500 rounded-full"></div>
              <h2 className="text-2xl font-bold text-yellow-700">Medium Priority</h2>
              <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm font-semibold">
                {mediumPriority.length}
              </span>
            </div>
            {mediumPriority.length === 0 ? (
              <div className="bg-white border-2 border-dashed border-gray-300 rounded-xl p-8 text-center">
                <svg className="w-16 h-16 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="text-gray-500 font-medium">No medium priority tasks</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {mediumPriority.map(task => (
                  <TaskCard
                    key={task._id}
                    task={task}
                    onDelete={handleDelete}
                    onStatusChange={handleStatusToggle}
                    onView={() => navigate(`/task/${task._id}`)}
                    onEdit={() => navigate(`/task-form?id=${task._id}`)}
                  />
                ))}
              </div>
            )}
          </section>

          <section className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-1 h-8 bg-green-500 rounded-full"></div>
              <h2 className="text-2xl font-bold text-green-700">Low Priority</h2>
              <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
                {lowPriority.length}
              </span>
            </div>
            {lowPriority.length === 0 ? (
              <div className="bg-white border-2 border-dashed border-gray-300 rounded-xl p-8 text-center">
                <svg className="w-16 h-16 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="text-gray-500 font-medium">No low priority tasks</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {lowPriority.map(task => (
                  <TaskCard
                    key={task._id}
                    task={task}
                    onDelete={handleDelete}
                    onStatusChange={handleStatusToggle}
                    onView={() => navigate(`/task/${task._id}`)}
                    onEdit={() => navigate(`/task-form?id=${task._id}`)}
                  />
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </>
  );
};

export default Dashboard;