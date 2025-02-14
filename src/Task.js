import React from 'react';

const Task = ({ task, onToggle, onDelete }) => {
  return (
    <li className={task.completed ? 'completed' : ''}>
      <input 
        type="checkbox"
        checked={task.completed}
        onChange={() => onToggle(task.id)}
      />
      <span>{task.text}</span>
      <button onClick={() => onDelete(task.id)}>Delete</button>
    </li>
  );
};

export default Task;