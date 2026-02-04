const TaskCard = ({ task, onDelete, onStatusChange, onView, onEdit }) => {
  return (
    <div className={`task-card ${task.priority}`}>
      <h4>{task.title}</h4>
      <p>Due: {new Date(task.dueDate).toLocaleDateString()}</p>
      <p>Status: {task.status}</p>

      <div className="task-actions">
        <button onClick={() => onStatusChange(task)}>
          {task.status === "pending" ? "Mark Completed" : "Mark Pending"}
        </button>

        <button onClick={onView}>View</button>
        <button onClick={onEdit}>Edit</button>
        <button onClick={() => onDelete(task._id)}>Delete</button>
      </div>
    </div>
  );
};

export default TaskCard;

