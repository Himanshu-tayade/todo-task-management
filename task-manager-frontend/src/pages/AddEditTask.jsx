import Navbar from "../components/Navbar";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "../api/api";

const AddEditTask = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const taskId = searchParams.get("id"); // null = add mode

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("medium");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const isEditMode = Boolean(taskId);

  // Priority mapping for slider
  const priorityMap = {
    low: 0,
    medium: 1,
    high: 2
  };

  const priorityLabels = ["low", "medium", "high"];

  // Fetch task data if edit mode
  useEffect(() => {
    if (!isEditMode) return;

    const fetchTask = async () => {
      try {
        const res = await api.get(`/tasks/${taskId}`);
        const task = res.data;

        setTitle(task.title);
        setDescription(task.description);
        setDueDate(task.dueDate.split("T")[0]);
        setPriority(task.priority);
      } catch (err) {
        alert("Failed to load task");
        navigate("/dashboard");
      }
    };

    fetchTask();
  }, [taskId, isEditMode, navigate]);

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isEditMode) {
        // UPDATE TASK
        await api.put(`/tasks/${taskId}`, {
          title,
          description,
          dueDate,
          priority
        });
      } else {
        // CREATE TASK
        await api.post("/tasks", {
          title,
          description,
          dueDate,
          priority
        });
      }

      navigate("/dashboard");
    } catch (err) {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // Get slider color based on priority
  const getSliderColor = () => {
    switch (priority) {
      case "high":
        return "bg-red-500";
      case "medium":
        return "bg-yellow-500";
      case "low":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  // Get priority badge color
  const getPriorityBadgeColor = () => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-700 border-red-300";
      case "medium":
        return "bg-yellow-100 text-yellow-700 border-yellow-300";
      case "low":
        return "bg-green-100 text-green-700 border-green-300";
      default:
        return "bg-gray-100 text-gray-700 border-gray-300";
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-3xl mx-auto">
          {/* Header Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {isEditMode ? "Edit Task" : "Create New Task"}
                </h1>
                <p className="text-gray-600 text-sm mt-1">
                  {isEditMode ? "Update your task details" : "Add a new task to your list"}
                </p>
              </div>
            </div>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-red-700 font-medium">{error}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title Input */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Task Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter task title..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all outline-none text-gray-900 placeholder-gray-400"
                />
              </div>

              {/* Description Textarea */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  placeholder="Add task description (optional)..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows="4"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all outline-none text-gray-900 placeholder-gray-400 resize-none"
                />
              </div>

              {/* Due Date Input */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Due Date <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all outline-none text-gray-900"
                  />
                  <svg className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>

              {/* Priority Slider */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Priority Level <span className="text-red-500">*</span>
                </label>
                
                {/* Current Priority Badge */}
                <div className="flex items-center justify-between mb-4">
                  <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border-2 font-semibold text-sm uppercase tracking-wide ${getPriorityBadgeColor()}`}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                    </svg>
                    {priority.charAt(0).toUpperCase() + priority.slice(1)} Priority
                  </span>
                </div>

                {/* Custom Slider - Centered and Smaller */}
                <div className="flex justify-center">
                  <div className="relative pt-2 pb-6 w-80">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      step="0.1"
                      value={priorityMap[priority] * 50}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value);
                        if (val < 33.33) setPriority("low");
                        else if (val < 66.67) setPriority("medium");
                        else setPriority("high");
                      }}
                      className="w-full h-3 rounded-lg appearance-none cursor-pointer"
                      style={{
                        background: priority === "low" 
                          ? "linear-gradient(to right, #22c55e 0%, #22c55e 100%)"
                          : priority === "medium"
                          ? "linear-gradient(to right, #22c55e 0%, #eab308 50%, #eab308 100%)"
                          : "linear-gradient(to right, #22c55e 0%, #eab308 50%, #ef4444 100%)"
                      }}
                    />
                    
                    {/* Slider Labels */}
                    <div className="flex justify-between mt-2 px-1">
                      <span className={`text-xs font-semibold ${priority === "low" ? "text-green-600" : "text-gray-400"}`}>
                        Low
                      </span>
                      <span className={`text-xs font-semibold ${priority === "medium" ? "text-yellow-600" : "text-gray-400"}`}>
                        Medium
                      </span>
                      <span className={`text-xs font-semibold ${priority === "high" ? "text-red-600" : "text-gray-400"}`}>
                        High
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <button
                  type="submit"
                  disabled={loading}
                  className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold text-white transition-all ${
                    loading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-indigo-600 hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-300"
                  }`}
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Saving...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {isEditMode ? "Update Task" : "Create Task"}
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => navigate("/dashboard")}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 focus:ring-4 focus:ring-gray-300 transition-all"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Cancel
                </button>
              </div>
            </form>
          </div>

          {/* Help Text */}
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="text-blue-800 text-sm font-medium">Quick Tip</p>
                <p className="text-blue-700 text-sm mt-1">
                  Use the priority slider to set how urgent your task is. High priority tasks will appear at the top of your dashboard.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        input[type="range"]::-webkit-slider-thumb {
          appearance: none;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: white;
          cursor: pointer;
          border: 3px solid ${priority === "high" ? "#ef4444" : priority === "medium" ? "#eab308" : "#22c55e"};
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
        }

        input[type="range"]::-moz-range-thumb {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: white;
          cursor: pointer;
          border: 3px solid ${priority === "high" ? "#ef4444" : priority === "medium" ? "#eab308" : "#22c55e"};
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
        }
      `}</style>
    </>
  );
};

export default AddEditTask;