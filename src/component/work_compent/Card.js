import React, { useState } from 'react';
import { useTasks } from '../context/TaskContext';
import { Cookies } from 'react-cookie';
import axios from 'axios';

const Card = ({ task }) => {
    const cookies = new Cookies();
    const projectId = cookies.get("projectId");
    const departId = cookies.get("departId");

    const { tasks, setupTaskPositions } = useTasks();
    const [selectedTaskId, setSelectedTaskId] = useState('');


    const handleLink = () => {
        if (selectedTaskId) {


            let startDay = new Date(task.start)
            let endDay = new Date(task.end);
            let relatedNew = task.related === "" ? selectedTaskId : task.related + "," + selectedTaskId

            // axios.patch(`/task/update/${projectId}/${departId}/${task.id}`,{
            //     title : task.title,
            //     description : task.description,
            //     start : startDay.getFullYear() + "-" + ("0" + (startDay.getMonth() + 1)).slice(-2) + "-" +("0" + startDay.getDate()).slice(-2) + " " + ("0" + startDay.getHours()).slice(-2) + ":" + ("0" + startDay.getMinutes()).slice(-2)+":"+("0" + startDay.getSeconds()).slice(-2),
            //     end : endDay.getFullYear() + "-" + ("0" + (endDay.getMonth() + 1)).slice(-2) + "-" +("0" + endDay.getDate()).slice(-2) + " " + ("0" + endDay.getHours()).slice(-2) + ":" + ("0" + endDay.getMinutes()).slice(-2)+":"+("0" + endDay.getSeconds()).slice(-2),                                           
            //     file : task.file,
            //     related : relatedNew,
            //     distribution : null
            // })
            //  .then((response) => {
            //     if(response.status === 200){
            //         axios.get(`/task/list/staff/${projectId}/${departId}`)
            //         .then((response) => {
            //             if(response.status === 200){
            //                 setupTaskPositions(response.data)
            //             }
            //         })
            //     }
            //  })


            setSelectedTaskId(''); // 선택 초기화
        }
    };


    return (
        <div className={`card ${task.isRejected ? 'rejected' : ''}`}>
            <h3>{task.title}</h3>

            {/* 업무 연결 드롭다운 */}
            <p>
                <select value={selectedTaskId} onChange={(e) => setSelectedTaskId(e.target.value)}>
                    <option value="">연결할 업무 선택</option>
                    {tasks.filter(t => t.id !== task.id).map(t => (
                        <option key={t.id} value={t.id}>{t.title}</option>
                    ))}
                </select>
                <button onClick={handleLink}>연계</button>
            </p>

            {/* 연결된 업무 목록 표시 */}
            {task.relatedTasks.length > 0 && (
                <div className="linked-tasks">
                    <h4>연결된 업무</h4>
                    <ul>
                        {task.relatedTasks.map(relatedId => {
                            const relatedTask = tasks.find(t => t.id === relatedId);
            
                            return (
                                <li key={relatedId} style={{ margin: '5px' }}>
                                    {/* {relatedTask ? relatedTask.title : `Task ${relatedId} (not found)`} */}
                                    { relatedTask.title }
                                    <button onClick={() => {
                                        // 업무수정 axios.patch
                                        let oldRelated = task.related;
                                        if(oldRelated.indexOf(relatedId + ",") !== -1){
                                            oldRelated = oldRelated.replace(relatedId + ",", "")
                                        }else if(oldRelated.indexOf(relatedId) !== -1){
                                            oldRelated = oldRelated.replace(relatedId, "")
                                        }

                                        
                                        let startDay = new Date(task.start)
                                        let endDay = new Date(task.end);

                                        // axios.patch(`/task/update/${projectId}/${departId}/${task.id}`,{
                                        //     title : task.title,
                                        //     description : task.desciption,
                                        //     start : startDay.getFullYear() + "-" + ("0" + (startDay.getMonth() + 1)).slice(-2) + "-" +("0" + startDay.getDate()).slice(-2) + " " + ("0" + startDay.getHours()).slice(-2) + ":" + ("0" + startDay.getMinutes()).slice(-2)+":"+("0" + startDay.getSeconds()).slice(-2),
                                        //     end : endDay.getFullYear() + "-" + ("0" + (endDay.getMonth() + 1)).slice(-2) + "-" +("0" + endDay.getDate()).slice(-2) + " " + ("0" + endDay.getHours()).slice(-2) + ":" + ("0" + endDay.getMinutes()).slice(-2)+":"+("0" + endDay.getSeconds()).slice(-2),                                           
                                        //     file : task.file,
                                        //     related : oldRelated,
                                        //     distribution : null
                                        // })
                                        //  .then((response) => {
                                        //     if(response.status === 200){
                                        //         axios.get(`/task/list/staff/${projectId}/${departId}`)
                                        //         .then((response) => {
                                        //             if(response.status === 200){
                                        //                 setupTaskPositions(response.data)
                                        //             }
                                        //         })
                                        //     }
                                        //  })
                            

                                        
                                    }}>해제</button>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            )}

        </div>
    );
};

export default Card;
