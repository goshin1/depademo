// src/components/Flow.js
import React, { useState, useEffect } from 'react';
import ReactFlow, { MiniMap, Controls, Background } from 'react-flow-renderer';
import { useTasks } from '../context/TaskContext';
import { Cookies } from 'react-cookie';
import axios from 'axios';
const Flow = () => {
    const cookies = new Cookies();
    const member = cookies.get("member");
    const projectId = cookies.get("projectId");
    const departId = cookies.get("departId");

    let memberCheck = [];
    if(member.length > 0){
        for(let i = 0; i < member.length; i++){
            memberCheck.push(
                <p key={'checkbox' + i} className='checkP' style={{width : '300px'}}>
                    {member[i].user.nickname}
                    <input type='checkbox' name='workMemberCheck' className='workMemberCheck' value={member[i].id} />
                </p>
            )
        }
    }


    const role = cookies.get("role");
    const { tasks, approveTask, rejectTask, removeTask, setupTaskPositions } = useTasks();
    const [highlightedNodeId, setHighlightedNodeId] = useState(null);
    const [selectedTask, setSelectedTask] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editedTitle, setEditedTitle] = useState('');
    const [editedDescription, setEditedDescription] = useState('');
    const [editedStartDate, setEditedStartDate] = useState('');
    const [editedEndDate, setEditedEndDate] = useState('');
    const [file, setFile] = useState(null);

    

    const [workComment, setWorkComment] = useState([]);

    useEffect(() => {
        // 해당 프로젝트의 업무 목록
        // axios.get(`/task/list/staff/${projectId}/${departId}`)
        // .then((response) => {
        //     if(response.status === 200){

        //         setupTaskPositions(response.data)
        //     }
        // })
    }, [])



    const handleNodeClick = (event, node) => {
        setHighlightedNodeId(node.id);
        const taskDetails = tasks.find(task => task.id.toString() === node.id);
        // setWorkComment([...temp]);
        setSelectedTask(taskDetails);
        setEditedTitle(taskDetails.title);
        setEditedDescription(taskDetails.description);
        setEditedStartDate(taskDetails.startDate);
        setEditedEndDate(taskDetails.endDate);
        // 업무 댓글 불러오기
        // axios.get(`/question/list/${projectId}/${departId}/${taskDetails.id}`)
        // .then((response) => {
        //     let temp = [];
        //     if(response.status === 200){
        //         for(let i = 0; i < response.data.length; i++){
        //             temp.push(
        //                 <div className="commentBlock" key={"workcomment" + i}>
        //                     <div style={{float : "left", mariginLeft : "10px", marginTop : "10px"}}>
        //                         {response.data[i].member.user.nickname}
        //                     </div>
        //                     <div style={{float: "left", marginLeft : "10px", marginTop : "10px"}}>
        //                         {response.data[i].content}
        //                     </div>

        //                     <input className="commentDeleteBtn" value="X" type="button" onClick={() => {
        //                         axios.delete(`/question/delete/${projectId}/${departId}/${response.data[i].id}`)
        //                         .then((response) => {
        //                             if(response.status === 200){
                                        
        //                             }
        //                         })
        //                     }}/>
        //                 </div>
        //             )
        //         }
        //         setWorkComment([...temp]);
        //         setSelectedTask(taskDetails);
        //         setEditedTitle(taskDetails.title);
        //         setEditedDescription(taskDetails.description);
        //         setEditedStartDate(taskDetails.startDate);
        //         setEditedEndDate(taskDetails.endDate);
        //     }
            
        // })


        
    };



    const handleClosePopup = () => {
        setSelectedTask(null);
        setIsEditing(false);
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };


    // 상태에 따른 배경색 설정 함수
    const getNodeBackgroundColor = (status) => {
        switch (status) {
            case "1":
                return '#87CEFA'; // 하늘색 (승인됨)
            case "2":
                return '#FF6F61'; // 빨간색 (반려됨)
            default:
                return '#FFFFFF'; // 흰색 (기본)
        }
    };

    return (
        <div style={{ height: 650 }}>
            <ReactFlow
                nodes={tasks.map((task) => ({
                    id: task.id.toString(),
                    data: { label: task.title },
                    position: task.position,
                    style: {
                        backgroundColor: getNodeBackgroundColor(task.approval), // 상태에 따른 배경색 설정
                    },
                }))}
                edges={tasks.flatMap(task =>
                    task.relatedTasks.map(relatedId => ({
                        id: `edge-${task.id}-${relatedId}`,
                        source: task.id.toString(),
                        target: relatedId.toString(),
                        animated: true
                    }))
                )}
                onNodeClick={handleNodeClick}
            >
                <MiniMap />
                <Controls />
                <Background />
            </ReactFlow>

            {selectedTask && (
                <div className="task-details">
                    {isEditing ? <h4>업무 수정</h4> : <h4>업무 상세</h4>}
                    {isEditing ? (
                        <form id='editTaskForm'>
                            <input
                                type="text"
                                value={editedTitle}
                                onChange={(e) => setEditedTitle(e.target.value)}
                                required
                            />
                             <input
                                type="datetime-local"
                                value={editedStartDate}
                                onChange={(e) => setEditedStartDate(e.target.value)}
                                required
                            />
                            
                            <input
                                type="datetime-local"
                                value={editedEndDate}
                                onChange={(e) => setEditedEndDate(e.target.value)}
                                required
                            />
                            <textarea
                                value={editedDescription}
                                onChange={(e) => setEditedDescription(e.target.value)}
                                required
                            />
                            <p style={{width : '90%', marginLeft : '5%'}}>멤버 목록</p>
                            {memberCheck}
                            <input type="file" id='workEditUpload' onChange={handleFileChange} />
                            <p>
                                <input className='taskBtn' type="button" value="수정" onClick={() => {
                  
                                    let checked = document.querySelectorAll('input[name="workMemberCheck"]:checked');
                                    let distribution = "";
                                    if(checked.length <= 0) return;
                                    let memberId = checked[0].value;
                                    for(let i = 0; i < checked.length; i++){                            
                                        distribution += (checked[i].value + ",")
                                    }
                            
                                    let startDay = new Date(editedStartDate)
                                    let endDay = new Date(editedEndDate);
                            
                            
                                    let formData = new FormData();
                                    formData.append("file", document.getElementById("workEditUpload").files[0]);
                                    if(document.getElementById("workEditUpload").files.length <= 0) return
                                    // axios.post("/upload", formData, {
                                    //     headers : {
                                    //         "Content-Type" : "multipart/form-data"
                                    //     }
                                    // }).then((response) => {
                                    //     if(response.status === 200){
                              
                                    //         axios.patch(`/task/update/${projectId}/${departId}/${selectedTask.id}`,{
                                    //             title : editedTitle,
                                    //             description : editedDescription,
                                    //             start : startDay.getFullYear() + "-" + ("0" + (startDay.getMonth() + 1)).slice(-2) + "-" +("0" + startDay.getDate()).slice(-2) + " " + ("0" + startDay.getHours()).slice(-2) + ":" + ("0" + startDay.getMinutes()).slice(-2)+":"+("0" + startDay.getSeconds()).slice(-2),
                                    //             end : endDay.getFullYear() + "-" + ("0" + (endDay.getMonth() + 1)).slice(-2) + "-" +("0" + endDay.getDate()).slice(-2) + " " + ("0" + endDay.getHours()).slice(-2) + ":" + ("0" + endDay.getMinutes()).slice(-2)+":"+("0" + endDay.getSeconds()).slice(-2),                    
                                    //             file : response.data,
                                    //             related : '',
                                    //             distribution : distribution
                                    //         })
                                    //          .then((response) => {
                                    //             if(response.status === 200){
                                    //                 axios.get(`/task/list/staff/${projectId}/${departId}`)
                                    //                 .then((response) => {
                                    //                     if(response.status === 200){
                                    //                         setupTaskPositions(response.data)
                                    //                     }
                                    //                 })
                                    
                                    //             }
                                    //          })
                                    //     }
                                    // })
                            
                                    setEditedTitle("")
                                    setEditedDescription('');
                                    setEditedStartDate('');
                                    setEditedEndDate('');
                                    setFile(null);
                                }}/>
                                <button className='taskBtn' type="button" onClick={() => setIsEditing(false)}>취소</button>
                            </p>
                        </form>
                    ) : (
                        <>
                            <p style={{fontWeight : 'bold'}}>{selectedTask.title}</p>
                            <p>{selectedTask.start} ~ {selectedTask.end}</p>
                            <p className='taskDescription'>
                                {selectedTask.description}  
                            </p>

                            {selectedTask.file === "" ? "" : <p><a href={selectedTask.file} download>파일다운로드</a></p>}
                            {role === "MANAGER" ? selectedTask.work === "" ? 
                                <p>
                                    <a href='/#/project'>아직 제출되지 않았습니다.</a>
                                </p> : 
                                <p>
                                    <a href={`${selectedTask.work}`} download>제출된 업무 다운로드</a>
                                </p> 
                            : 
                            <p>
                                <input id='approvalFile' type="file"/> 
                                <input type="button" value="업무 제출" onClick={() => {
                                    if(document.getElementById("approvalFile").files.length <= 0) return;
                                    let formData = new FormData();
                                    formData.append("file", document.getElementById("approvalFile").files[0]);

                                    // axios.post("/upload", formData, {
                                    //     headers : {
                                    //         "Content-Type" : "multipart/form-data"
                                    //     }
                                    // }).then((response) => {
                                    //     if(response.status === 200){
                                    //         axios.patch(`/task/submit/${projectId}/${departId}/${selectedTask.id}?approval=${response.data}`)
                                    //         .then((response) => {
                                    //            if(response.status === 200){
                                    //                 alert("업무가 제출되었습니다.")
                                    //                 handleClosePopup();
                                    //            } 
                                    //         })
                                    //     }
                                    // })
                                }}/>   
                            </p>}
                            
                            <p style={{background : 'rgb(250,250,250)', borderRadius : '5px'}}>
                                <button className='taskBtn' style={{display : role === "MANAGER" ? "inline-block" : "none"}} onClick={() => setIsEditing(true)}>수정</button>
                                <button className='taskBtn' style={{display : role === "MANAGER" ? "inline-block" : "none"}} onClick={() => approveTask(selectedTask.id)}>승인</button>
                                <button className='taskBtn' style={{display : role === "MANAGER" ? "inline-block" : "none"}} onClick={() => rejectTask(selectedTask.id)}>반려</button>
                                <button className='taskBtn' style={{display : role === "MANAGER" ? "inline-block" : "none"}} onClick={() => removeTask(selectedTask.id)}>삭제</button>
                                <button className='taskBtn' onClick={handleClosePopup}>닫기</button>
                            </p>
                            <div id="commentInsert">
                            <input type="text" id="commentInput"/>
                            <input type="button" id="commentBtn" value='작성' onClick={() => {
                                let commentText = document.getElementById("commentInput").value;
                                if(commentText === "") return;
                                // axios.post(`/question/create/${projectId}/${departId}/${selectedTask.id}`, {
                                //     content : commentText,
                                // }).then((response) => {
                                //     if(response.status === 200){
                                //         axios.get(`/question/list/${projectId}/${departId}/${selectedTask.id}`)
                                //         .then((response) => {
                                //             let temp = [];
                                //             if(response.status === 200){
                                //                 for(let i = 0; i < response.data.length; i++){
                                //                     temp.push(
                                //                         <div className="commentBlock" key={"workcomment" + i}>
                                //                             <div style={{float : "left", mariginLeft : "10px", marginTop : "10px"}}>
                                //                                 {response.data[i].member.user.nickname}
                                //                             </div>
                                //                             <div style={{float: "left", marginLeft : "10px", marginTop : "10px"}}>
                                //                                 {response.data[i].content}
                                //                             </div>

                                //                             <input className="commentDeleteBtn" value="X" type="button" onClick={() => {
                                //                                 axios.delete(`/question/delete/${projectId}/${departId}/${response.data[i].id}`)
                                //                                 .then((response) => {
                                //                                     if(response.status === 200){
                                //                                         handleClosePopup();
                                //                                     }
                                //                                 })
                                //                             }}/>
                                //                         </div>
                                //                     )
                                //                 }
                                //                 setWorkComment([...temp]);
                                //             }
                                            
                                //         })
                                //     }
                                // })
                            }}/>
                            </div>
                            <div id="commentList" style={{height : '100px', overflowX : 'none', overflowY : 'auto'}}>
                                {workComment}
                            </div>
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

export default Flow;
