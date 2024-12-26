// src/components/Modal.js
import React from 'react';

const Modal = ({ isOpen, onClose, task, approveTask, rejectTask }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>{task.title}</h2>
                <p>{task.description}</p>
                <h3>연계된 작업 :</h3>
                <ul>
                    {task.relatedTasks.map(relatedId => (
                        <li key={relatedId}>업무 명 : {relatedId}</li>
                    ))}
                </ul>
                <button onClick={() => approveTask(task.id)}>승인</button>
                <button onClick={() => rejectTask(task.id)}>반려</button>
                {task.fileURL && (
                    <p><a href={task.fileURL} download>첨부파일 다운로드</a></p>
                )}
                <button onClick={onClose}>닫기</button>
            </div>
        </div>
    );
};

export default Modal;
