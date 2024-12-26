import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./main.css";
import { Cookies } from "react-cookie";


export default function Main(){
    const navigate = useNavigate();
    const location = useLocation();
    const cookies = new Cookies();
    const [state, setState] = useState(location.state);
    const [profile, setProfile] = useState();
    const [project, setProject] = useState([]); // 프로젝트 목록
    const [projectInfo, setProjectInfo] = useState([]);
    const [remote, setRemote] = useState("none"); // 어떤 팝업인지
    const [remoteBlock, setRemoteBlock] = useState(); // 해당 팝업에 html태그 내용


    
    useEffect(() => {
        // private Long id;
        // private String title;
        // private String comment;
        // private String invitation;
        // private String status;
        setProfile({
            id : 'test',
            username : 'test',
            password : 'test',
            nickname : 'test',
            email : 'test@test.com',
            birth : '2000-01-01',
            phone : '010-0000-0000',
            group : 'test',
            url : 'test',
            status : 'status'
        })
        let projects = [
            {id : 0, title : 'project_1', comment : 'test', invitation : '1111', status : 'ACTIVE'},
            {id : 1, title : 'project_2', comment : 'test', invitation : '1111', status : 'ACTIVE'},
            {id : 2, title : 'project_3', comment : 'test', invitation : '1111', status : 'ACTIVE'},
        ];

        let temp = [];
        for(let i = 0; i < projects.length; i++){
            temp.push(
                <div className="project" onClick={() => {
                    if(projects[i].status === "ACTIVE"){
                        const cProfile = {
                            id : 'test',
                            username : 'test',
                            password : 'test',
                            nickname : 'test',
                            email : 'test@test.com',
                            birth : '2000-01-01',
                            phone : '010-0000-0000',
                            group : 'test',
                            url : 'test',
                            status : 'status'
                        }
                        navigate("/project", {
                            state : {
                                nickname : cProfile.nickname,
                                id : cProfile.username,
                                project : projects[i]
                            }
                        });
                    }
                }}>
                    {projects[i].title}
                </div>
            )
        }
        setProject([...temp]);
        setProjectInfo([...projects]);

        // 사용자 정보요청
        // axios.get("/user/profile")
        // .then((res) => {
        //     if(res.status === 200){
        //         cookies.set("profile", res.data)
        //         setProfile(res.data);
        //         // 사용자가 참여중인 프로젝트 목록 조회
        //         axios.get("/user/project/list")
        //         .then((response) => {
        //             let temp = [];
        //             for(let i = 0; i < response.data.length; i++){
        //                 temp.push(
        //                     <div className="project" onClick={() => {
        //                         if(response.data[i].status === "ACTIVE"){
        //                             const cProfile = cookies.get("profile")
        //                             navigate("/project", {
        //                                 state : {
        //                                     nickname : cProfile.nickname,
        //                                     id : cProfile.username,
        //                                     project : response.data[i]
        //                                 }
        //                             });
        //                         }
        //                     }}>
        //                         {response.data[i].title}
        //                     </div>
        //                 )
        //             }
        //             setProject([...temp]);
        //             setProjectInfo([...response.data]);
        //         })
        //     }
        // }).catch((error) => {
        //     navigate("/");
        // })


    }, []);

    return <div id="mainDiv">
        
        <div id="projects">
            {/* 아래 태그가 각 프로젝트 이동 버튼이 될 블록 */}
            {project}

            
            <div className="project" id="projectAdd" onClick={()=>{
                    setRemote("New");
                    setRemoteBlock(<NewProject></NewProject>)
                }}>
                    프로젝트 참가/생성
            </div>

            <div className="project" id="projectAdd" onClick={()=>{
                    setRemote("Remove");
                    setRemoteBlock(<ProRemove></ProRemove>)
                }}>
                    프로젝트 탈퇴
            </div>
        </div>
        <div id="mainInfo">
            
            <div id="mainRemote" style={{height : remote === 'none' ? '0px' : '600px'}}>
                {remoteBlock}
                <input type="button" id="cancelBtn" value="닫기" onClick={()=>{
                    setRemote("none");
                    setRemoteBlock();
                }}/>
            </div>

            <ShowCalender></ShowCalender>
        </div>
        <div id="mainSetting">
            <div id="profile">
                <div id="profileImg">
                    <img src={require("../imgs/proto_logo.png")} style={{width : '100%'}}/>
                </div>
                <div id="profileName">{profile?.nickname}</div>
                <div id="profileCmt">어서오세요!</div>
            </div>


            <input className="logoutBtn" value="로그아웃" type="button" onClick={() => {
                // 로그아웃
                navigate("/");
                // axios.post("/logout")
                // .then((response) => {
                //     console.log(response.data)
                //     navigate("/");
                // })
            }}/>


            <input id="setting" type="button" onClick={()=>{
                setRemote("Set");
                setRemoteBlock(<SetBtn></SetBtn>)
            }}/>
        </div>
    </div>


    // 일정 팝업
    function ShowCalender(){
        const [toDay, setToDay] = useState(new Date());
        const [month, setMonth] = useState((toDay.getMonth() + 1) < 10 ?  "0" + (toDay.getMonth() + 1) : (toDay.getMonth() + 1) + "");
        const [alarm, setAlarm] = useState("");
        const [listDate, setListDate] = useState("");
        const [dateBlock, setDateBlock] = useState({});
        const [dayTodo, setDayTodo] = useState([]);
        const [selectDay, setSelectDay] = useState(0); // 스케줄 id
        const [selectDate, setSelectDate] = useState(0); // 스케줄 일자

        // 캘린더 전부 초기화
        function clearCalender(){
            let monthBlock = document.getElementsByClassName("calBlock");
            let cnt = 1;
            if(monthBlock.item(0) !== null){
                for(let i = 0; i < 42; i++){
                    monthBlock.item(i).innerHTML = "";
                }
            }
        }

        // 일정이 있으면 오렌지 박스에 색깔 증가
        function checkSchedule(){
            // 사용자의 개인 일정을 조회
            // axios.get("/schedule/list/personal")
            //     .then((response) => {
            //         setDayTodo(response.data)
            //         for(let i = 0; i < response.data.length; i++){

            //             let start = new Date(response.data[i].start);
            //             let end = new Date(response.data[i].end);
            //             if(start.getMonth() !== toDay.getMonth()) continue;
            //             if(start.getFullYear() !== toDay.getFullYear()) continue;

            //             for(let d = start.getDate(); d <= end.getDate(); d++){
            //                 if(document.getElementById("scheduleBlock-"+d) !== null){
            //                     document.getElementById("scheduleBlock-"+d).innerHTML = Number(document.getElementById("scheduleBlock-"+d).innerHTML) + 1;
            //                 }
            //             }
            //         }

            //         let scheduleBlock = document.getElementsByClassName("scheduleBlock");
            //         for(let i = 0; i < scheduleBlock.length; i++){
            //             if(scheduleBlock[i].innerHTML !== "0"){
            //                 scheduleBlock[i].style.opacity = "100%";
            //             }
            //         }
            //     })
        }

        // 달을 바꾸면 다시 그리는 함수
        function changeCalender(){
            const start = new Date(toDay.getFullYear().toString() + "-" + month + "-" + "01").getDay();
            let monthBlock = document.getElementsByClassName("calBlock");
            let cnt = 1;
            if(monthBlock.item(0) !== null){
                if(toDay.getMonth() === 1){
                    let year = toDay.getFullYear();
                    if(year%4==0 && year%100!=0 || year%400==0){
                        for(let i = 0; i < 42; i++){
                            if(i < start)
                                continue;
                            monthBlock.item(i).innerHTML = cnt <= 29 ? cnt : "";
                            if((cnt <= 29 ? cnt : "") !== ""){
                                let alarmBlock = document.createElement("div");
                                alarmBlock.setAttribute("id", "scheduleBlock-"+(cnt <= 29 ? cnt : ""));
                                alarmBlock.setAttribute("class", "scheduleBlock")
                                alarmBlock.innerHTML = 0;
                                monthBlock.item(i).append(alarmBlock)
                            }
                            
                            cnt++;
                            
                        }
                    }else{
                        for(let i = 0; i < 42; i++){
                            if(i < start)
                                continue;
                            monthBlock.item(i).innerHTML = cnt <= 28 ? cnt : "";
                            if((cnt <= 28 ? cnt : "") !== ""){
                                let alarmBlock = document.createElement("div");
                                alarmBlock.setAttribute("id", "scheduleBlock-"+(cnt <= 28 ? cnt : ""));
                                alarmBlock.setAttribute("class", "scheduleBlock")
                                alarmBlock.innerHTML = 0;
                                monthBlock.item(i).append(alarmBlock)
                            }
                            
                            cnt++;
                            
                        }
                    }
                }else{
                    for(let i = 0; i < 42; i++){
                        if(i < start)
                            continue;
                        monthBlock.item(i).innerHTML = cnt <= 31 ? cnt : "";
                        if((cnt <= 31 ? cnt : "") !== ""){
                            let alarmBlock = document.createElement("div");
                            alarmBlock.setAttribute("id", "scheduleBlock-"+(cnt <= 31 ? cnt : ""));
                            alarmBlock.setAttribute("class", "scheduleBlock")
                            alarmBlock.innerHTML = 0;
                            monthBlock[i].append(alarmBlock)
                        }
                        
                        cnt = cnt + 1;

                    }
                }
            }
        }
        
        useEffect(() => {
            changeCalender();
            checkSchedule();
            let monthBlock = document.getElementsByClassName("calBlock");
            // 있는지 확인
            if(monthBlock.item(0) !== null){
                for(let i = 0; i < 42; i++){
                    
                    monthBlock.item(i).addEventListener("click", (event) => {
                        
                        if(monthBlock.item(i).children.length === 0) return;
                        // if(monthBlock.item(i).children[0].innerHTML === "0") return;
                        let day = event.currentTarget.innerHTML.split("<div")[0];
                        if(day !== ""){
                            setListDate(day);
                        }
                    })
                    
                }
            }
        }, [,  month]);

        function AddAlarm(){
            return <div id="alarmCalender" style={{display : alarm === "" ? "none" : "block"}}>
                    <h3>{alarm === "create" ? "생성" : "수정"}</h3>
                    <input type="text" id="titleDay" placeholder=" 제목"/>
                    <div id="alarmDate">
                        <label>시작일 <input id="startDay" type="datetime-local"/></label>
                        <label>종료일 <input id="endDay" type="datetime-local"/></label>
                    </div>
                    <textarea id="contentDay" placeholder=" 일정 내용">

                    </textarea>
                    <div>
                        <input type="button" value={alarm === "create" ? "생성" : "수정"} onClick={() => {

                            let startDay = new Date(document.getElementById("startDay").value);
                            let endDay = new Date(document.getElementById("endDay").value);
                            let title = document.getElementById("titleDay").value;
                            let content = document.getElementById("contentDay").value;

                            if(alarm === "create"){
                                // 일정 생성
                                // axios.post("/schedule/create", {
                                //     title : title,
                                //     detail : content,
                                //     start : startDay.getFullYear() + "-" + ("0" + (startDay.getMonth() + 1)).slice(-2) + "-" +("0" + startDay.getDate()).slice(-2) + " " + ("0" + startDay.getHours()).slice(-2) + ":" + ("0" + startDay.getMinutes()).slice(-2)+":"+("0" + startDay.getSeconds()).slice(-2),
                                //     end : endDay.getFullYear() + "-" + ("0" + (endDay.getMonth() + 1)).slice(-2) + "-" +("0" + endDay.getDate()).slice(-2) + " " + ("0" + endDay.getHours()).slice(-2) + ":" + ("0" + endDay.getMinutes()).slice(-2)+":"+("0" + endDay.getSeconds()).slice(-2),
                                // })
                                //  .then((response) => {
                                //     setAlarm("")
                                //     changeCalender();
                                //     checkSchedule();
                                //     let monthBlock = document.getElementsByClassName("calBlock");
                                //     // 있는지 확인
                                //     if(monthBlock.item(0) !== null){
                                //         for(let i = 0; i < 42; i++){
                                            
                                //             monthBlock.item(i).addEventListener("click", (event) => {
                                                
                                //                 if(monthBlock.item(i).children.length === 0) return;
                                //                 // if(monthBlock.item(i).children[0].innerHTML === "0") return;
                                //                 let day = event.currentTarget.innerHTML.split("<div")[0];
                                //                 if(day !== ""){
                                //                     setListDate(day);
                                //                 }
                                //             })
                                            
                                //         }
                                //     }
                                //  })
                            }else{
                                // 일정 수정
                                // axios.patch("/schedule/update/"+selectDay, {
                                //     title : title,
                                //     detail : content,
                                //     start : startDay.getFullYear() + "-" + ("0" + (startDay.getMonth() + 1)).slice(-2) + "-" +("0" + startDay.getDate()).slice(-2) + " " + ("0" + startDay.getHours()).slice(-2) + ":" + ("0" + startDay.getMinutes()).slice(-2)+":"+("0" + startDay.getSeconds()).slice(-2),
                                //     end : endDay.getFullYear() + "-" + ("0" + (endDay.getMonth() + 1)).slice(-2) + "-" +("0" + endDay.getDate()).slice(-2) + " " + ("0" + endDay.getHours()).slice(-2) + ":" + ("0" + endDay.getMinutes()).slice(-2)+":"+("0" + endDay.getSeconds()).slice(-2),
                                // })
                                //  .then((response) => {
                                //     setAlarm("")
                                //     changeCalender();
                                //     checkSchedule();
                                //     let monthBlock = document.getElementsByClassName("calBlock");
                                //     // 있는지 확인
                                //     if(monthBlock.item(0) !== null){
                                //         for(let i = 0; i < 42; i++){
                                            
                                //             monthBlock.item(i).addEventListener("click", (event) => {
                                                
                                //                 if(monthBlock.item(i).children.length === 0) return;
                                //                 // if(monthBlock.item(i).children[0].innerHTML === "0") return;
                                //                 let day = event.currentTarget.innerHTML.split("<div")[0];
                                //                 if(day !== ""){
                                //                     setListDate(day);
                                //                 }
                                //             })
                                            
                                //         }
                                //     }
                                //  })
                            }

                        }}/>
                        <input type="button" value="닫기" onClick={() => {setAlarm("")}}/>
                    </div>
                </div>
        }

        function ShowDate(){
            // 일정을 보다 블럭 클릭 시 상세 내용으로 변경
            const [dateDetail, setDateDetail] = useState("list");
            const [detailTemp, setDetailTemp] = useState({
                title : "",
                info : "",
                content : ""
            }); 
            

            let days = [];
            
           if(dayTodo.length > 0){
            if(listDate === "") return;
            for(let i = 0; i < dayTodo.length; i++){

                let start = new Date(dayTodo[i].start);
                let end = new Date(dayTodo[i].end);
                if(start.getMonth() !== toDay.getMonth()) continue;
                
                if(start.getDate() <= listDate && listDate <= end.getDate()){
                    days.push(
                        <div className="listDateBlock" onClick={(event) => {
                            setDetailTemp({
                                id : dayTodo[i].id,
                                title : dayTodo[i].title,
                                info : dayTodo[i].user.nickname + " " + dayTodo[i].start + " ~ " + dayTodo[i].end,
                                content : dayTodo[i].detail
                            })
                            setDateDetail("detail")
                            setSelectDay(dayTodo[i].id)
                            setSelectDate();
                        }}>
                            <div className="dateTitle">{dayTodo[i].title}</div>
                            <div className="dateContent">
                                <div className="dateSummary">
                                    {dayTodo[i].user.nickname}
                                </div>
                                <div className="dateCreate">
                                    {dayTodo[i].start} ~ {dayTodo[i].end}
                                </div>
                            </div>

                        </div>
                    )
                }
            }
           }


            return <div id="listDate" style={{display : listDate === "" ? "none" : "block"}}>
                <div id="listHeader">
                    {toDay.getFullYear() + "년 " + (toDay.getMonth() + 1) + "월 " + listDate+"일"}

                    {dateDetail === "list" ? <input type="button" value="생성" onClick={() => {
                        setAlarm("create");
                    }}/> : <input type="button" value="수정" onClick={() => {
                        setAlarm("modify");
                    }}/>}
                    
                    <input type="button" value="삭제" style={{marginRight : "10px", display : dateDetail === "list" ? "none" : "block"}} onClick={() => {
                        // 일정 삭제
                        // axios.delete("/schedule/delete/"+selectDay)
                        //     .then((response) => {
                        //         if(response.status === 200){
                        //             changeCalender();
                        //             checkSchedule();
                        //             let monthBlock = document.getElementsByClassName("calBlock");
                        //             // 있는지 확인
                        //             if(monthBlock.item(0) !== null){
                        //                 for(let i = 0; i < 42; i++){
                                            
                        //                     monthBlock.item(i).addEventListener("click", (event) => {
                                                
                        //                         if(monthBlock.item(i).children.length === 0) return;
                        //                         // if(monthBlock.item(i).children[0].innerHTML === "0") return;
                        //                         let day = event.currentTarget.innerHTML.split("<div")[0];
                        //                         if(day !== ""){
                        //                             setListDate(day);
                        //                         }
                        //                     })
                                            
                        //                 }
                        //             }
                        //         }
                        //     })
                    }}/>
                </div>

                {dateDetail === "list" ?
                    <div id="listDateBlocks">
                        { days }
                    </div> : 
                    <div id="dateBlockDetail">
                        <p id="detailTitle">{detailTemp.title}</p>
                        <p id="detailInfo">{detailTemp.info}</p>
                        <div id="detailContent">{detailTemp.content}</div>
                    </div>
                
                }

                <div id="listRemote">
                    <input type="button" value="닫기" onClick={() => {setListDate("")}}/>
                </div>
            </div>
        }

        return <div>
                
                <AddAlarm></AddAlarm>
                <ShowDate></ShowDate>
                <img id="mainLogo" src={require("../imgs/proto_logo.png")}/>
                <div id="projectCalenderBtns" style={{marginTop : '30px'}}>
                    <input type="button" value="<" onClick={() => {
                        
                        clearCalender();
                        toDay.setMonth(toDay.getMonth() - 1);
                        setMonth((toDay.getMonth() + 1) < 10 ?  "0" + (toDay.getMonth() + 1) : (toDay.getMonth() + 1) + "");
                        setToDay(toDay);
                    }}/>

                    {month}
                    
                    <input type="button" value=">" onClick={() => {
                        clearCalender();
                        toDay.setMonth(toDay.getMonth() + 1);
                        setMonth((toDay.getMonth() + 1) < 10 ?  "0" + (toDay.getMonth() + 1) : (toDay.getMonth() + 1) + "");
                        setToDay(toDay);
                    }}/>
                </div>
                <div id="projectCalender">
                <table>
                    <thead>
                        <tr>
                            <th>일</th>
                            <th>월</th>
                            <th>화</th>
                            <th>수</th>
                            <th>목</th>
                            <th>금</th>
                            <th>토</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="calBlock"></td>
                            <td className="calBlock"></td>
                            <td className="calBlock"></td>
                            <td className="calBlock"></td>
                            <td className="calBlock"></td>
                            <td className="calBlock"></td>
                            <td className="calBlock"></td>
                        </tr>
                        <tr>
                            <td className="calBlock"></td>
                            <td className="calBlock"></td>
                            <td className="calBlock"></td>
                            <td className="calBlock"></td>
                            <td className="calBlock"></td>
                            <td className="calBlock"></td>
                            <td className="calBlock"></td>
                        </tr>
                        <tr>
                            <td className="calBlock"></td>
                            <td className="calBlock"></td>
                            <td className="calBlock"></td>
                            <td className="calBlock"></td>
                            <td className="calBlock"></td>
                            <td className="calBlock"></td>
                            <td className="calBlock"></td>
                        </tr>
                        <tr>
                            <td className="calBlock"></td>
                            <td className="calBlock"></td>
                            <td className="calBlock"></td>
                            <td className="calBlock"></td>
                            <td className="calBlock"></td>
                            <td className="calBlock"></td>
                            <td className="calBlock"></td>
                        </tr>
                        <tr>
                            <td className="calBlock"></td>
                            <td className="calBlock"></td>
                            <td className="calBlock"></td>
                            <td className="calBlock"></td>
                            <td className="calBlock"></td>
                            <td className="calBlock"></td>
                            <td className="calBlock"></td>
                        </tr>
                        <tr>
                            <td className="calBlock"></td>
                            <td className="calBlock"></td>
                            <td className="calBlock"></td>
                            <td className="calBlock"></td>
                            <td className="calBlock"></td>
                            <td className="calBlock"></td>
                            <td className="calBlock"></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    }


    function NewProject(){

        return <div id="mainAddNew">
            <div id="joinProject">
                <h1 >프로젝트 참가</h1>
                <p >참여하실 프로젝트의 초대 코드를 입력해주세요</p>
                <img id="projectIcon" src={require("../imgs/invite.png")}/>
                <input type="text" name="Code" id="ProjectCode" placeholder="Project code"/>
                <input type="button" id="CodeBtn" value="참가" onClick={() => {
                    let code = document.getElementById("ProjectCode").value;
                    // 초대코드를 통한 프로젝트 참가
                    // axios.post("/user/project/invitation", {
                    //     invitation : code
                    // }).then((response) => {
                    //     if(response.status === 200){
                    //         // 성공 시 프로젝트 리스트 다시
                    //         axios.get("/user/project/list")
                    //         .then((response) => {
                                
                    //             let temp = [];
                    //             for(let i = 0; i < response.data.length; i++){
                    //                 temp.push(
                    //                     <div className="project" onClick={() => {
                    //                         if(response.data[i].status === "ACTIVE"){
                    //                             const cProfile = cookies.get("profile")
                    //                             navigate("/project", {
                    //                                 state : {
                    //                                     id : cProfile.username,
                    //                                     project : response.data[i]
                    //                                 }
                    //                             });
                    //                         }
                    //                     }}>
                    //                         {response.data[i].title}
                    //                     </div>
                    //                 )
                    //             }
                    //             setProject([...temp]);
                    //             setProjectInfo([...response.data]);
                    //         })
                    //     }   
                    // })
                }}/>
            </div>

            <div id="ProjectSet">
                <h1>프로젝트 생성</h1>
                <img id="SetIcon" src={require("../imgs/setting.png")}/>

                <div id="SetProject">
                    <input type="text" name="Code" id="ProjectSetCode" placeholder="초대코드"/>
                    <br/>
                    <input type="text" name="Code" id="ProjectSetName" placeholder="프로젝트 명"/>
                    <br/>
                    <input type="text" name="Code" id="ProjectSetComment" placeholder="프로젝트 설명"/>
                    
                    <input type="button" id="NameBtn" Value="생성" onClick={() => {
                        let title = document.getElementById("ProjectSetName").value;
                        let code = document.getElementById("ProjectSetCode").value;
                        let comment = document.getElementById("ProjectSetComment").value;
                        // 프로젝트 생성
                        // axios.post("/project/create", {
                        //     title : title,
                        //     comment : comment,
                        //     invitation : code
                        // }).then((response) => {
                        //     if(response.status === 200){
                        //         // 성공 시 프로젝트 리스트 다시
                               

                        //         axios.get("/user/project/list")
                        //         .then((response) => {
                                    
                        //             let temp = [];
                        //             for(let i = 0; i < response.data.length; i++){
                        //                 temp.push(
                        //                     <div className="project" onClick={() => {
                        //                         if(response.data[i].status === "ACTIVE"){
                        //                             const cProfile = cookies.get("profile")
                        //                             navigate("/project", {
                        //                                 state : {
                        //                                     id : cProfile.username,
                        //                                     project : response.data[i]
                        //                                 }
                        //                             });
                        //                         }
                        //                     }}>
                        //                         {response.data[i].title}
                        //                     </div>
                        //                 )
                        //             }
                        //             setProject([...temp]);
                        //             setProjectInfo([...response.data]);
                        //         })
                        //     }   
                        // }).catch((error) => {
                        //     // 제목이 중복이면 TITLE, 초대코드 중복이면 INVITATION
                        // })
                    }}/>
                    
                </div>
            </div>
        </div>
    }

    function ProRemove(){
        return <div> 
        <div id="RemoveMain"> 
                <h1>프로젝트 탈퇴</h1>
                <div id="RemoveExplain">
                <p>프로젝트를 탈퇴하시려면 "프로젝트 명"을 입력해주시기 바랍니다.</p>
                <input type="text" id="ProjectWrite" placeholder="해당 프로젝트명"/>
                <input type="button" id="RemoveBtn" Value="제거" onClick={() => {
                    let title = document.getElementById("ProjectWrite").value;
                    if(title === "") return;
                    let id = 0;
                    for(let i = 0; i < projectInfo.length; i++){
                        if(projectInfo[i].title === title){
                            id = projectInfo[i].id;
                            break;
                        }
                    }
                    if(id === 0) return;
                    // axios.delete(`/project/${id}/delete`)
                    // .then((response) => {
                    //     if(response.status === 200){
                    //         axios.get("/user/project/list")
                    //         .then((response) => {
                    //             let temp = [];
                    //             for(let i = 0; i < response.data.length; i++){
                    //                 temp.push(
                    //                     <div className="project" onClick={() => {
                    //                         if(response.data[i].status === "ACTIVE"){
                    //                             const cProfile = cookies.get("profile")
                    //                             navigate("/project", {
                    //                                 state : {
                    //                                     id : cProfile.username,
                    //                                     project : response.data[i]
                    //                                 }
                    //                             });
                    //                         }
                    //                     }}>
                    //                         {response.data[i].title}
                    //                     </div>
                    //                 )
                    //             }
                    //             setProject([...temp]);
                    //             setProjectInfo([...response.data]);
                    //         })
                    //     }
                    // });
                }}/>
                </div>
            </div>
        </div> 
    }
    
    function SetBtn(){
        const [content, setContent] = useState(
            <div id="ProfileMainSet">
                <div style={{width : '100%'}}>
                    <img style={{width : '150px'}} src={require("../imgs/setting.png")}/>
                </div>
                <h1>본인확인</h1>
                <p>현재 사용중이신 아이디를 입력해주세요.</p>
                <input type="text" id="SettingUsername" placeholder="아이디"/>
                <input type="button" id="SettingPwd" value="확인" onClick={()  => {
                    let username = document.getElementById("SettingUsername").value;
                    setContent(
                        <>
                            <div id="joinHeader">
                                <img id="joinLogo" src={require("../imgs/proto_logo.png")} alt="logo"/>
                                <span>정보수정</span>
                            </div>
                            <div id="joinBody" style={{minHeight : '220px'}}>
                                <div id="joinLeft">
                                    
                                    <div className="joinBlock">
                                        <input type="text" defaultValue={"기존 닉네임"} id="joinNickname" name="email" placeholder="이름"/>
                                    </div>
                                    <div className="joinBlock">
                                        <input type="text" defaultValue={"기존 이메일"} id="joinEmail" name="email" placeholder="이메일"/>
                                    </div>
                                    <div className="joinBlock">
                                        <input type="text" defaultValue={"기존 전화번호"} id="joinPhone" name="phone" placeholder="전화번호(000-0000-0000)"/>
                                    </div>
                                </div>

                                <div id="joinRight">
                                    
                                    <div className="joinBlock">
                                        생년월일 <input type="date" id="joinBirth" name="birth"/>
                                    </div>
                                    <div className="joinBlock">
                                        <input type="text" defaultValue={"기존 소속"} id="joinGroup" name="group" placeholder="소속"/>
                                    </div>
                                    <div className="joinBlock">
                                        <input type="button" id="joinBtn" value="정보수정" onClick={()=>{
                                            
                                            
                                            let nickname = document.querySelector("#joinNickname").value;
                                            let email = document.querySelector("#joinEmail").value;
                                            let birth = new Date(document.querySelector("#joinBirth").value);
                                            let phone = document.querySelector("#joinPhone").value;
                                            let group = document.querySelector("#joinGroup").value;
                                            
                                            
                     

                                            if((email === "" || birth === "" || phone === "" || group === "" ) ||
                                                (email.length < 2 || phone.length < 2 ||  group.length < 2)){
                                                alert("입력되지 않은 내용이 있습니다.");
                                                return;
                                            }

                                            if(email.indexOf("@") === -1 || email.indexOf(".") === -1 || email.indexOf(".") < email.indexOf("@")){
                                                alert("이메일을 다시 입력해주세요.");
                                                return;
                                            }

                                            if(birth === "Invalid Date"){
                                                alert("생년월일을 입력해주세요.");
                                                return;
                                            }

                                            if(birth.indexOf("-") < 4 ||  birth.split("-").length !== 3){
                                                alert("날짜 양식을 지켜서 입력해주세요");
                                                return;
                                            }

                                            if(phone.indexOf("-") < 3 ||  phone.split("-").length !== 3){
                                                alert("전화번호 양식을 지켜서 입력해주세요");
                                                return;
                                            }

                                     
                                            setRemote("none");
                                            setRemoteBlock();

                                            
                                            
                                        }}/>
                                    </div>
                                </div>
                            </div>
                        </>
                    )
                    // if(username === "") return
                    // axios.post("/user/check", {
                    //     username : username
                    // }).then((response) => {
                    //     if(response.status === 200){

                    //         axios.get("/user/profile")
                    //         .then((response) => {
                    //             if(response.status === 200){
                    //                 setContent(
                    //                     <>
                    //                         <div id="joinHeader">
                    //                             <img id="joinLogo" src={require("../imgs/proto_logo.png")} alt="logo"/>
                    //                             <span>정보수정</span>
                    //                         </div>
                    //                         <div id="joinBody" style={{minHeight : '220px'}}>
                    //                             <div id="joinLeft">
                                                    
                    //                                 <div className="joinBlock">
                    //                                     <input type="text" defaultValue={response.data.nickname} id="joinNickname" name="email" placeholder="이름"/>
                    //                                 </div>
                    //                                 <div className="joinBlock">
                    //                                     <input type="text" defaultValue={response.data.email} id="joinEmail" name="email" placeholder="이메일"/>
                    //                                 </div>
                    //                                 <div className="joinBlock">
                    //                                     <input type="text" defaultValue={response.data.phone} id="joinPhone" name="phone" placeholder="전화번호(000-0000-0000)"/>
                    //                                 </div>
                    //                             </div>
        
                    //                             <div id="joinRight">
                                                    
                    //                                 <div className="joinBlock">
                    //                                     생년월일 <input type="date" id="joinBirth" name="birth"/>
                    //                                 </div>
                    //                                 <div className="joinBlock">
                    //                                     <input type="text" defaultValue={response.data.group} id="joinGroup" name="group" placeholder="소속"/>
                    //                                 </div>
                    //                                 <div className="joinBlock">
                    //                                     <input type="button" id="joinBtn" value="정보수정" onClick={()=>{
                                                            
                                                            
                    //                                         let nickname = document.querySelector("#joinNickname").value;
                    //                                         let email = document.querySelector("#joinEmail").value;
                    //                                         let birth = new Date(document.querySelector("#joinBirth").value);
                    //                                         let phone = document.querySelector("#joinPhone").value;
                    //                                         let group = document.querySelector("#joinGroup").value;
                                                            
                                                            
                                     
        
                    //                                         if((email === "" || birth === "" || phone === "" || group === "" ) ||
                    //                                             (email.length < 2 || phone.length < 2 ||  group.length < 2)){
                    //                                             alert("입력되지 않은 내용이 있습니다.");
                    //                                             return;
                    //                                         }
        
                    //                                         if(email.indexOf("@") === -1 || email.indexOf(".") === -1 || email.indexOf(".") < email.indexOf("@")){
                    //                                             alert("이메일을 다시 입력해주세요.");
                    //                                             return;
                    //                                         }

                    //                                         if(birth === "Invalid Date"){
                    //                                             alert("생년월일을 입력해주세요.");
                    //                                             return;
                    //                                         }
        
                    //                                         if(birth.indexOf("-") < 4 ||  birth.split("-").length !== 3){
                    //                                             alert("날짜 양식을 지켜서 입력해주세요");
                    //                                             return;
                    //                                         }
        
                    //                                         if(phone.indexOf("-") < 3 ||  phone.split("-").length !== 3){
                    //                                             alert("전화번호 양식을 지켜서 입력해주세요");
                    //                                             return;
                    //                                         }
        
                                                     
    
                    //                                         axios.post("/user/profile/update", {
                                                                
                    //                                             nickname : nickname,
                    //                                             email : email,
                    //                                             birth : birth.getFullYear() + "-" + ("0" + (birth.getMonth() + 1)).slice(-2) + "-" +("0" + birth.getDate()).slice(-2),
                    //                                             phone : phone,
                    //                                             group : group,
                    //                                             this : "LIGHT",
                    //                                             url : ""                            
                    //                                         })
                    //                                         .then((response) => {
                    //                                             if(response.status === 200){
                    //                                                 setRemote("none");
                    //                                                 setRemoteBlock();
                    //                                             }else{
                    //                                                 alert("오류")
                    //                                             }
                    //                                         })
        
                                                            
                                                            
                    //                                     }}/>
                    //                                 </div>
                    //                             </div>
                    //                         </div>
                    //                     </>
                    //                 )
                    //             }
                    //         })

                            
                    //     }
                    // })
                    
                    
                    
                }}/>
            </div>)
    
        return<div>
            {content}
            
        </div>
    
    }
}


