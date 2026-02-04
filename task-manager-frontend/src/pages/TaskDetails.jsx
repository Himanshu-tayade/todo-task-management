import Navbar from "../components/Navbar";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/api";

const TaskDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch single task
  useEffect(() => {
    const fetchTask = async () => {
      try {
        const res = await api.get(`/tasks/${id}`);
        setTask(res.data);
      } catch (err) {
        setError("Task not found or access denied");
      } finally {
        setLoading(false);
      }
    };

    fetchTask();
  }, [id]);

  // Priority badge colors
  const getPriorityClasses = (priority) => {
    const classes = {
      low: "bg-green-100 text-green-800 border-green-200",
      medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
      high: "bg-red-100 text-red-800 border-red-200"
    };
    return classes[priority] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg">Loading task...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="text-center bg-white p-8 rounded-lg shadow-md max-w-md">
            <div className="text-red-500 text-5xl mb-4">⚠️</div>
            <p className="text-red-600 text-lg font-semibold mb-6">{error}</p>
            <button
              onClick={() => navigate("/dashboard")}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition duration-200"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-gray-800">Task Details</h2>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
          {/* Task Title */}
          <div className="mb-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              {task.title}
            </h3>
            
            {/* Status and Priority Badges */}
            <div className="flex flex-wrap gap-3">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                task.status === "completed" 
                  ? "bg-green-100 text-green-800 border border-green-200" 
                  : "bg-blue-100 text-blue-800 border border-blue-200"
              }`}>
                {task.status === "completed" ? "✅ Completed" : "⏳ Pending"}
              </span>
              
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getPriorityClasses(task.priority)}`}>
                {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} Priority
              </span>
            </div>
          </div>

          {/* Task Details */}
          <div className="space-y-6">
            {/* Description */}
            <div>
              <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
                Description
              </h4>
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {task.description || "No description provided"}
              </p>
            </div>

            {/* Due Date */}
            <div>
              <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
                Due Date
              </h4>
              <p className="text-gray-900 font-medium">
                {new Date(task.dueDate).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={() => navigate(`/task-form?id=${task._id}`)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition duration-200 shadow-sm hover:shadow-md"
            >
              Edit Task
            </button>

            <button
              onClick={() => navigate("/dashboard")}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-6 rounded-lg transition duration-200"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetails;