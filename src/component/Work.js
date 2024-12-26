import './work.css'
import TaskForm from "./work_compent/TaskForm";
import Board from "./work_compent/Board";
import Flow from "./work_compent/Flow";
import { TaskProvider } from './context/TaskContext';
import { Cookies } from 'react-cookie';
import { useEffect } from 'react';
import axios from 'axios';

export function Work(){
    const cookies = new Cookies();
    const role = cookies.get("role")
    const projectId = cookies.get("projectId");
    const departId = cookies.get("departId");


   
   

    return <div id='workMain'>
        <TaskProvider>
            <h2>업무</h2>
            <div className='wordDiv' style={ role === "MANAGER" ? {float : "left", width : "30%", maxHeight : "650px"} : {float : "left", width : "0%", maxHeight : "650px", display : 'none'}}>
                
                <TaskForm />
                <Board />
            </div>
            <div className='workDiv' style={ role === "MANAGER" ? {float : "left", width : "68%", maxHeight : "650px"} : {float : "left", width : "99%", maxHeight : "650px"} }>
                <Flow />
            </div>
        </TaskProvider>
    </div>
}