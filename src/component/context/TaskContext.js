import React, { createContext, useState, useContext } from 'react';
import axios from 'axios';
import { Cookies } from 'react-cookie';
import { useEffect } from 'react';

const TaskContext = createContext();

export const useTasks = () => {
    return useContext(TaskContext);
};

export const TaskProvider = ({ children }) => {
    const [tasks, setTasks] = useState([
        { id: 1, title: "Task 1", description: "Description", fileURL : "NONE", relatedTasks: [2,3], approval: "0", startDate: "2024-10-03T13:09", endDate: "2024-10-10T13:09", position: { x: 100, y: 100 } },
        { id: 2, title: "Task 2", description: "Description", fileURL : "NONE", relatedTasks: [4], approval: "0", startDate: "2024-10-03T13:09", endDate: "2024-10-10T13:09", position: { x: 300, y: 100 } },
        { id: 3, title: "Task 3", description: "Description", fileURL : "NONE", relatedTasks: [5], approval: "0", startDate: "2024-10-03T13:09", endDate: "2024-10-10T13:09", position: { x: 300, y: 300 } },
        { id: 4, title: "Task 4", description: "Description", fileURL : "NONE", relatedTasks: [], approval: "0", startDate: "2024-10-03T13:09", endDate: "2024-10-10T13:09", position: { x: 300, y: 600 } },
        { id: 5, title: "Task 5", description: "Description", fileURL : "NONE", relatedTasks: [6], approval: "1", startDate: "2024-10-03T13:09", endDate: "2024-10-10T13:09", position: { x: 600, y: 600 } },
        { id: 6, title: "Task 6", description: "Description", fileURL : "NONE", relatedTasks: [], approval: "2", startDate: "2024-10-03T13:09", endDate: "2024-10-10T13:09", position: { x: 600, y: 900 } },
    ]);
    const cookies = new Cookies();
    const projectId = cookies.get("projectId");
    const departId = cookies.get("departId");

    


    const setupTaskPositions = (fetchedTasks) => {
        const tasksMap = fetchedTasks.map(task => ({
            ...task,
            relatedTasks: task.related ? task.related.split(',').map(Number) : []
        }));
    
        const spacing = 180; // 기본 간격 설정
        const positions = {};
        const occupiedPositions = new Set(); // 이미 차지된 위치 저장
    
        const findAvailablePosition = (baseX, baseY, taskId) => {
            let x = baseX;
            let y = baseY;
    
            while (occupiedPositions.has(`${x},${y}`)) {
                // 위치가 occupied 되면 x를 증가시킴
                x += spacing;
                if (x > 800) { // 예를 들어, 최대 x값을 800으로 설정
                    x = baseX; // x를 초기값으로 리셋
                    y += spacing; // y를 증가
                }
            }
    
            // 새로운 위치를 occupiedPositions에 추가
            occupiedPositions.add(`${x},${y}`);
            return { x, y };
        };
    
        tasksMap.forEach(task => {
            if (!positions[task.id]) {
                const { x, y } = findAvailablePosition(0, 0, task.id); // 기본 위치 (0, 0)에서 시작
                positions[task.id] = { x, y };
            }
    
            // 연관된 작업 처리
            task.relatedTasks.forEach(relatedId => {
                if (!positions[relatedId]) {
                    const { x, y } = findAvailablePosition(positions[task.id].x + spacing, positions[task.id].y, relatedId);
                    positions[relatedId] = { x, y };
                }
            });
        });
    
        const updatedTasks = tasksMap.map(task => ({
            ...task,
            position: positions[task.id]
        }));
    
        setTasks(updatedTasks);
        return updatedTasks;
    };

    
    const approveTask = (id) => {
        // 1 승인, 2 반려
        // axios.patch(`/task/approval/${projectId}/${departId}/${id}/1`)
        // .then((response) => {
        //     axios.get(`/task/list/staff/${projectId}/${departId}`)
        //     .then((response) => {
        //         if(response.status === 200){
        //             setupTaskPositions(response.data)
        //         }
        //     })
        // });
    };

    const rejectTask = (id) => {
        // axios.patch(`/task/approval/${projectId}/${departId}/${id}/2`)
        // .then((response) => {
        //     axios.get(`/task/list/staff/${projectId}/${departId}`)
        //     .then((response) => {
        //         if(response.status === 200){
        //             setupTaskPositions(response.data)
        //         }
        //     })
        // });
        
    };
   

    const removeTask = (id) => {
        // axios.delete(`/task/delete/${projectId}/${departId}/${id}`)
        // .then((response) => {
        //     axios.get(`/task/list/staff/${projectId}/${departId}`)
        //     .then((response) => {
        //         if(response.status === 200){
        //             setupTaskPositions(response.data)
        //         }
        //     })
        // })
        
    };

    return (
        <TaskContext.Provider value={{ tasks, rejectTask, approveTask, removeTask, setupTaskPositions }}>
            {children}
        </TaskContext.Provider>
    );
};
