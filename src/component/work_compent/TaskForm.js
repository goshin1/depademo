// src/components/TaskForm.js
import React, { useState } from 'react';
import { useTasks } from '../context/TaskContext';
import { Cookies } from 'react-cookie';
import axios from 'axios';
const TaskForm = () => {
    const { setupTaskPositions } = useTasks();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [file, setFile] = useState(null);
    const cookies = new Cookies();
    const member = cookies.get("member");
    const projectId = cookies.get("projectId");
    const departId = cookies.get("departId");

    

    let memberCheck = [];
    if(member.length > 0){
        for(let i = 0; i < member.length; i++){
            memberCheck.push(
                <p key={'checkbox' + i} className='checkP'>
                    {member[i].user.nickname}
                    <input type='checkbox' name='workMemberCheck' className='workMemberCheck' value={member[i].id} />
                </p>
            )
        }
    }



    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        let checked = document.querySelectorAll('input[name="workMemberCheck"]:checked');
        let distribution = "";
        if(checked.length <= 0) return;
        let memberId = checked[0].value;
        for(let i = 0; i < checked.length; i++){
        

            distribution += (checked[i].value + ",")
        }


        let formData = new FormData();
        formData.append("file", document.getElementById("workUpload").files[0]);
        if(document.getElementById("workUpload").files.length <= 0) return
        // 해당 업무에 관한 파일 업로드
        // axios.post("/upload", formData, {
        //     headers : {
        //         "Content-Type" : "multipart/form-data"
        //     }
        // }).then((response) => {
        //     if(response.status === 200){
        //         let startDay = new Date(startDate)
        //         let endDay = new Date(endDate);


        //         // 업무 생성
        //         axios.post(`/task/create/${projectId}/${departId}`,{
        //             title : title,
        //             description : description,
        //             start : startDay.getFullYear() + "-" + ("0" + (startDay.getMonth() + 1)).slice(-2) + "-" +("0" + startDay.getDate()).slice(-2) + " " + ("0" + startDay.getHours()).slice(-2) + ":" + ("0" + startDay.getMinutes()).slice(-2)+":"+("0" + startDay.getSeconds()).slice(-2),
        //             end : endDay.getFullYear() + "-" + ("0" + (endDay.getMonth() + 1)).slice(-2) + "-" +("0" + endDay.getDate()).slice(-2) + " " + ("0" + endDay.getHours()).slice(-2) + ":" + ("0" + endDay.getMinutes()).slice(-2)+":"+("0" + endDay.getSeconds()).slice(-2),                    
        //             file : response.data,
        //             related : '',
        //             distribution : distribution
        //         })
        //          .then((response) => {
        //             if(response.status === 200){
        //                 // 업무 목록 불러오기
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

        const fileURL = file ? URL.createObjectURL(file) : null;
        setTitle('');
        setDescription('');
        setStartDate('');
        setEndDate('');
        setFile(null);
    };

    return (
        <form id='taskForm' onSubmit={handleSubmit}>
            <h3>업무 생성</h3>
            <input
                type="text"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
            />
            <input
                type="datetime-local"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
            />
            <input
                type="datetime-local"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
            />
            <p style={{width : '90%', marginLeft : '5%', fontWeight : 'bold'}}>멤버 목록</p>
            <div style={{width : '90%', marginLeft : '5%', height : '70px', overflowX : 'none', overflowY : 'auto'}}>
                {memberCheck}
            </div>
            <textarea
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
            />
            <input type="file" id='workUpload'  onChange={handleFileChange} style={{cursor : 'pointer', display : 'block', marginLeft : '10px'}}/>
            <button type="submit" className='taskFormBtn' style={{margin : '5px 10px'}}>업무 생성</button>
        </form>
    );
};

export default TaskForm;
