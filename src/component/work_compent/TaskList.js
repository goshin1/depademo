// src/components/TaskList.js
import React from 'react';
import { useTasks } from '../context/TaskContext';

const TaskList = () => {
    const { tasks, updateTask } = useTasks();

    const handleTaskClick = (taskId, relatedId) => {
        updateTask(taskId, relatedId);
    };

    return (
        <div>
            <h3>Task List</h3>
            {tasks.map(task => (
                <div key={task.id}>
                    <span>{task.title}</span>
                    <span>
                        {task.relatedTasks.length > 0 && task.relatedTasks.map(relatedId => (
                            <span 
                                key={relatedId} 
                                onClick={() => handleTaskClick(task.id, relatedId)}
                                style={{ marginLeft: '10px', cursor: 'pointer', color: 'blue' }}
                            >
                                Related: {relatedId}
                            </span>
                        ))}
                    </span>
                    <span 
                        onClick={() => handleTaskClick(task.id, task.id)} // 자기 자신 클릭 시 제거
                        style={{ marginLeft: '10px', cursor: 'pointer', color: 'red' }}
                    >
                        Remove Link
                    </span>
                </div>
            ))}
        </div>
    );
};

export default TaskList;
