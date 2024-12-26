// src/components/Board.js
import React from 'react';
import { useTasks } from '../context/TaskContext';
import Card from './Card';
import { Cookies } from 'react-cookie';
import axios from 'axios';

const Board = () => {

    const { tasks, setTakes, setupTaskPositions } = useTasks();
    const cookies = new Cookies();
    const member = cookies.get("member");
    let memberBlock = [];
    for(let i = 0; i < member.length; i++){
        memberBlock.push(
            <div className='workMember' id={"worker" + i} key={"worker" + i} onClick={(event) => {

                let workers = document.getElementsByClassName("workMember");
                for(let i = 0; i < workers.length; i++){
                    if(event.currentTarget.id === workers[i].id){
                        workers[i].style.height = 'auto';
                        cookies.set("memberId", member[i].id)
                        // 업무 목록조회
                        // axios.get(`/task/list/manager/${member[i].project.id}/${member[i].depart.id}/${member[i].id}`)
                        // .then((response) => {
                        //     setupTaskPositions(response.data);
                        // })

                    }else{
                        workers[i].style.height = '50px';
                    }
                }
            }}>
                <h3>{member[i].user.nickname}</h3>
                {tasks.map(task => (
                    <Card key={task.id} task={task} />
                ))}
            </div>
        )
    }


    return (
        <div id='cardBoard'>
            {memberBlock}
        </div>
    );
};

export default Board;
