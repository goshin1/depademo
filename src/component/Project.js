import "./project.css"
import "./trello.css"
import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Work } from "./Work";
import { Cookies } from "react-cookie";
import SockJS from "sockjs-client";
import axios from "axios";

export default function Project(){
    const navigate = useNavigate();
    const location = useLocation();
    const cookies = new Cookies();

    const [edit, setEdit] = useState(0);

    const [remote, setRemote] = useState("none");
    const [remoteBlock, setRemoteBlock] = useState();
    const [state, setState] = useState(location.state); // state 갱신

    const [roomInfo, setRoomInfo] = useState([]); // 채팅 방 정보 엔티티 목록
    const [roomOption, setRoomOption] = useState([]); // 채팅방 옵션 목록
    const [room, setRoom] = useState([]); // 채팅 방 태그 목록 

    const [chat, setChat] = useState([]); // 채팅 내역
    
    
    const [dateInfo, setDateInfo] = useState([]); // 일정 정보

    const [member, setMember] = useState({}) // 현재 프로젝트의 멤버 이름  
    const [memberBlock, setMemberBlock] = useState([]); // 멤버 정보 태그 목록

    const [role, setRole] = useState("WAITING"); // 현재 프로젝트에서 역할 LEADER, MANAGER, STAFF 중 
    const [memberId, setMemberId] = useState(0); // 현재 프로젝트에서 본인의 member_id 값

    const [content, setContent] = useState("main");
    
    const [token, setToken] = useState(""); // 채팅방 토큰
    const [roomId, setRoomId] = useState(0); // 채팅방 번호

    const [mInfo, setMInfo] = useState(null); // 멤버 상세 정보 팝업
    const [editRoom, setEditRoom] = useState(undefined); // 방 수정/삭제

    const [isConnected, setIsConnected] = useState(false); // 연결 상태 관리



    

    let socketRef = useRef(null);

    // 초기 설정
    useEffect(() => {
        cookies.set("projectId", state.project.id)
        
        setRole("MANAGER");
        cookies.set("role", "MANAGER");
        setMemberId(0);
        cookies.set("depart", "depart")
        let temp = [];
        let tempInfo = [];
        let tempOption = [];
        let tempTest = [];

        // private Long id;
        // private String subtitle;
        // private String token;
        // private ProjectEntity project;
        let initProjects = [
            {id : 0, subtitle : '직무회의실1', token : 'test', project : state.project},
            {id : 1, subtitle : '직무회의실2', token : 'test', project : state.project},
            {id : 2, subtitle : '직무회의실3', token : 'test', project : state.project}
        ]

        for(let i = 0; i < initProjects.length; i++){
            tempInfo.push(initProjects[i]);
            tempOption.push(<option value={initProjects[i].id}>{initProjects[i].subtitle}</option>);
            temp.push(
                <div className="chatRoom" key={i} onClick={() => {
                    // 방 클릭 시 해당 토큰 값을 설정
                    
                    if(role === "WAITING") return;
                    cookies.set("departId", initProjects[i].id)
                    setRoomId(initProjects[i].id);
                    setContent("chat")
                }}>
                    {initProjects[i].subtitle}
                    <input type="button" className="editRoomBtn" style={{display : role === "LEADER" ? "block" : "none"}} value="수정" onClick={() => {
                        setEditRoom({
                            depart : initProjects[i]
                        });
                        setRemote("editRoom");
                        setRemoteBlock(<EditRoom editRoom={{
                            depart : initProjects[i]
                        }}></EditRoom>)

                        
                        
                    }}/>
                </div>
            )
        }
        setRoom(temp);
        setRoomInfo([...tempInfo]);
        setRoomOption([...tempOption])
        tempTest = [...tempOption];


        // axios.get(`/project/${state.project.id}/user/list`)
        // .then((response) => {
        //     cookies.set("member", response.data);
        //     for(let i = 0; i < response.data.length; i++){
        //         // 채팅에서 사용할 닉네임 정보 기입
        //         if(response.data[i].user.username === state.id){
        //             setRole(response.data[i].role);
        //             cookies.set("role",response.data[i].role);
        //             setMemberId(response.data[i].id);
        //             // 대표가 아니면 직무회의실 수정 버튼을 없애버린다.
        //             let editRoomBtns = document.getElementsByClassName("editRoomBtn");
        //             if(response.data[i].role === "LEADER"){
        //                 for(let i = 0; i < editRoomBtns.length; i++){
        //                     editRoomBtns[i].style.display = "block";
        //                 }
        //             }else{
        //                 for(let i = 0; i < editRoomBtns.length; i++){
        //                     editRoomBtns[i].style.display = "none";
        //                 }
        //             }

        //             // 해당 프로젝트의 채팅 방 조회
        //             axios.get(`/project/${state.project.id}/depart/list`)
        //             .then((response) => {
                        
        //                 cookies.set("depart", response.data)
        //                 let temp = [];
        //                 let tempInfo = [];
        //                 let tempOption = [];
        //                 for(let i = 0; i < response.data.length; i++){
        //                     tempInfo.push(response.data[i]);
        //                     tempOption.push(<option value={response.data[i].id}>{response.data[i].subtitle}</option>);
        //                     temp.push(
        //                         <div className="chatRoom" onClick={() => {
        //                             // 방 클릭 시 해당 토큰 값을 설정
                                    
        //                             if(role === "WAITING") return;
        //                             cookies.set("departId", response.data[i].id)
        //                             setRoomId(response.data[i].id);
        //                             setContent("chat")
        //                         }}>
        //                             {response.data[i].subtitle}
        //                             <input type="button" className="editRoomBtn" style={{display : role === "LEADER" ? "block" : "none"}} value="수정" onClick={() => {
        //                                 setEditRoom({
        //                                     depart : response.data[i]
        //                                 });
        //                                 setRemote("editRoom");
        //                                 setRemoteBlock(<EditRoom editRoom={{
        //                                     depart : response.data[i]
        //                                 }}></EditRoom>)

                                        
                                        
        //                             }}/>
        //                         </div>
        //                     )
        //                 }
        //                 setRoom(temp);
        //                 setRoomInfo([...tempInfo]);
        //                 setRoomOption([...tempOption])
        //                 tempTest = [...tempOption];
        //             }).catch((error) => {
        //                 if(error.code === "ERR_BAD_REQUEST"){
        //                     axios.post("/reissue").then((response) => {
                               

        //                     })
        //                 }
        //             });


        //             break;
        //         }
        //     }
        // })


        let tempMember = {}
        let initMember = [
            {id : 0, role : 'MANAGER', status : "ACTIVE", user : {
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
            }, depart : {id : 0, subtitle : '직무회의실1', token : 'test', project : state.project}, project : state.project}
        ]
        let tempBlock = [];
        cookies.set("member", initMember);

        let roleCheck = "NONE";
        for(let i = 0; i < initMember.length; i++){
            // 채팅에서 사용할 닉네임 정보 기입
            if(initMember[i].user.username === state.id){
                setRole(initMember[i].role);
                cookies.set("role",initMember[i].role);
                setMemberId(initMember[i].id);
                roleCheck = initMember[i].role;
                // 대표가 아니면 직무회의실 수정 버튼을 없애버린다.
                let editRoomBtns = document.getElementsByClassName("editRoomBtn");
                if(initMember[i].role === "LEADER"){
                    for(let i = 0; i < editRoomBtns.length; i++){
                        editRoomBtns[i].style.display = "block";
                    }
                }else{
                    for(let i = 0; i < editRoomBtns.length; i++){
                        editRoomBtns[i].style.display = "none";
                    }
                }

            }

            tempMember[initMember[i].id] = initMember[i].user.nickname

            tempBlock.push(
                <div className="memberBlock" key={"member" + i} onClick={(event) => {
                    // 처음 멤버 목록 불러올 때 기본키값으로 해서 누르면 기본키를 토대로 해당 멤버의 정보를 조회해서 아래 mInfo값으로
                    
                    if(roleCheck !== "LEADER") return;
                    
                    setRemote("editMember");
                    setRemoteBlock(<EditMember mInfo={initMember[i]} roomOption={roomOption} ></EditMember>)
                }}>
                    <div className="memberIcon">
                        <img src={require("../imgs/proto_logo.png")}/>
                    </div>
                    {initMember[i].user.nickname}
                </div>
            )
            

        }
        setMember(tempMember);
        setMemberBlock([...tempBlock])


        // 프로젝트 멤버 목록을 가져와 dict형태로 만들어 chat블럭 생성 시 이름 보이게
        // axios.get(`/project/${state.project.id}/user/list`)
        // .then((response) => {
        //     cookies.set("member", response.data);
        //     let temp = {}
        //     let tempBlock = [];

        //     let roleCheck = "NONE";
        //     for(let i = 0; i < response.data.length; i++){
        //         // 채팅에서 사용할 닉네임 정보 기입
        //         if(response.data[i].user.username === state.id){
        //             setRole(response.data[i].role);
        //             cookies.set("role",response.data[i].role);
        //             setMemberId(response.data[i].id);
        //             roleCheck = response.data[i].role;
        //             // 대표가 아니면 직무회의실 수정 버튼을 없애버린다.
        //             let editRoomBtns = document.getElementsByClassName("editRoomBtn");
        //             if(response.data[i].role === "LEADER"){
        //                 for(let i = 0; i < editRoomBtns.length; i++){
        //                     editRoomBtns[i].style.display = "block";
        //                 }
        //             }else{
        //                 for(let i = 0; i < editRoomBtns.length; i++){
        //                     editRoomBtns[i].style.display = "none";
        //                 }
        //             }

        //         }

        //         temp[response.data[i].id] = response.data[i].user.nickname

        //         tempBlock.push(
        //             <div className="memberBlock" key={"member" + i} onClick={(event) => {
        //                 // 처음 멤버 목록 불러올 때 기본키값으로 해서 누르면 기본키를 토대로 해당 멤버의 정보를 조회해서 아래 mInfo값으로
                        
        //                 if(roleCheck !== "LEADER") return;
                        
        //                 setRemote("editMember");
        //                 setRemoteBlock(<EditMember mInfo={response.data[i]} roomOption={roomOption} ></EditMember>)
        //             }}>
        //                 <div className="memberIcon">
        //                     <img src={require("../imgs/proto_logo.png")}/>
        //                 </div>
        //                 {response.data[i].user.nickname}
        //             </div>
        //         )
                

        //     }
        //     setMember(temp);
        //     setMemberBlock([...tempBlock])
        // })


        


        

        // , mInfo, roomId
    }, [ , mInfo, roomId, role]);

    // 방 변경 시(id 값) => 우선 id처리를 먼저해서 채팅 방 내역을 불러온다.
    useEffect(() => {
        // db에서 해당 채팅방 톡 내용
        if(roomId !== 0){

            // 채팅 목록 가져오기
            // axios.get(`/project/${state.project.id}/${roomId}/chat/list`)
            // .then((response) => {

            //     let temp = [];
            //     for(let i = 0; i < response.data.length; i++){
            //         let tempBlock;

            //         if(response.data[i].type === "image"){
            //             tempBlock = <div className="chatContent">
            //                         <img src={response.data[i].content}/>
            //                     </div>;
            //         }else if(response.data[i].type === "file"){
            //             tempBlock = <div className="chatContent">
            //                         <a href={response.data[i].content} download>파일 다운로드</a>
            //                     </div>;
            //         }else if(response.data[i].type === "text"){
            //             tempBlock = <div className="chatContent">
            //                         {response.data[i].content}
            //                     </div>
            //         }

            //         temp.push(
            //             <div className="chatBlock" key={i+"chat"}>
            //                 <div className="chatIcon">
            //                     {member[response.data[i].member.id]}
            //                 </div>
            //                 {tempBlock}
            //             </div>
            //         )
            //     }
            //     setChat([...temp]);
                
            //     // 해당 방의 정보 불러오기
            //     axios.get(`/project/${state.project.id}/${roomId}`)
            //     .then((response) => {
                    
            //         if(response.status === 200){
            //             cookies.set("token", response.data.token);
            //             setToken(response.data.token);
            //         }
            //     }).catch((error) => {
            //         if(error.response.status === 401){
            //             axios.post("/reissue").then((response) => {
                            
                            
            //             })
            //         }else if(error.response.status === 400){
            //             setToken("")
            //             setContent("main")
            //         }
            //     });
                

            // }).catch((error) => {
            //     if(error.code === "ERR_BAD_REQUEST"){
            //         axios.post("/reissue").then((response) => {
                       
            //         })
            //     }
            // });
        }


        
    }, [roomId]);

    // 토큰 변경이 확인 된 후 연결을 바꾼다.
    
    // useEffect(() => {
    //     if (token) {
    //         // 기존 WebSocket 연결이 있다면 닫기
    //         if (socketRef.current) {
    //             socketRef.current.close();
    //         }

    //         // 새로운 WebSocket 연결 생성
    //         socketRef.current = new SockJS("/socket");

    //         // WebSocket 연결 열기
    //         socketRef.current.onopen = () => {
    //             setIsConnected(true); // 연결 상태 업데이트
    //             // 방에 JOIN 메시지를 보내서 해당 방에 입장
    //             socketRef.current.send(JSON.stringify({ chatRoomId: token, type: "JOIN" }));
    //         };

    //         // 메시지 수신 처리
    //         socketRef.current.onmessage = (e) => {
    //             const content = JSON.parse(e.data);
    //             const { type, fileType, message, user } = content;

    //             if (type === "SEND") {
    //                 let temp;

    //                 // 메시지 타입에 따라 다르게 처리
    //                 if (fileType === "image") {
    //                     temp = (
    //                         <div className="chatContent">
    //                             <img src={message} alt="chat message" />
    //                         </div>
    //                     );
    //                 } else if (fileType === "file") {
    //                     temp = (
    //                         <div className="chatContent">
    //                             <a href={message} download>
    //                                 파일 다운로드
    //                             </a>
    //                         </div>
    //                     );
    //                 } else if (fileType === "text") {
    //                     temp = (
    //                         <div className="chatContent">
    //                             {message}
    //                         </div>
    //                     );
    //                 }

    //                 // 채팅 내용 업데이트
    //                 setChat(prevChat => [
    //                     ...prevChat,
    //                     <div className="chatBlock" key={prevChat.length + "chat"}>
    //                         <div className="chatIcon">{user}</div>
    //                         {temp}
    //                     </div>
    //                 ]);
    //             }
    //         };

    //         // WebSocket 오류 처리
    //         socketRef.current.onerror = (err) => {
    //             console.error("WebSocket error:", err);
    //             setIsConnected(false); // 연결 상태 업데이트
    //             // 연결이 끊어지면 새로 연결 시도
    //             socketRef.current.close();
    //             socketRef.current = new SockJS("/socket");
    //         };

    //         // 컴포넌트가 언마운트되면 소켓을 닫는다
    //         return () => {
    //             if (socketRef.current) {
    //                 socketRef.current.close();
    //             }
    //         };
    //     }
    // }, [token]);

   

    return <div id="mainDiv">
        <div id="chattings">
            <div className="chatRoom" style={{display : role === "LEADER" ? "block" : "none"}} onClick={() => {
                // 회의실 생성
                if(role === "WAITING") return;
                setRemote("room");
                setRemoteBlock(<AddRoom></AddRoom>)
            }}>
                회의실 생성
            </div>



            {room}
        

        </div>

        <div id="mainInfo">
            <div id="mainRemote" style={{height : remote === 'none' ? '0px' : 'auto'}}>
                {remoteBlock}

                
                <input type="button" id="cancelBtn" value="닫기" onClick={()=>{
                    setRemote("none");
                    setRemoteBlock();
                }}/>
            </div>


            <div id="mainHeader">
                <img src={require("../imgs/proto_logo.png")} onClick={() => {
                    setContent("main")
                }}/>
            </div>

            <div id="mainContent">
                {content === "main" ? 
                    <div id="mainNotice">
                        <h1>{state.project.title}</h1>
                        <pre>
                            {state.project.comment}
                        </pre>
                    </div>
                     :
                     <div id="chatList">
            
                        {chat.reverse()}
                        
                        <div id="chatInsert">
                            <input type="text" id="chatText" name="chatText" onKeyUp={(event) => {

                                if(token === "") return;
                                if(event.code === "Enter" && event.nativeEvent.isComposing === false){
                                    let text = document.getElementById("chatText").value;
                                    document.getElementById("chatText").value = "";
                                    let toDay = new Date();
                                    // let month = (toDay.getMonth() + 1) < 10 ? "0" + (toDay.getMonth() + 1) : (toDay.getMonth() + 1);
                                    let log = toDay.getFullYear() + "-" +
                                    (toDay.getMonth() + 1) + "-" +
                                        toDay.getDate() + " " +
                                        toDay.getHours() + ":" + toDay.getMinutes() + ":" + toDay.getSeconds();

                                    if(text === "" || text === "\n") return;
                                    
                                    // axios.post(`/project/${state.project.id}/${roomId}/chat/save`, {
                                    //     content : text,
                                    //     type : "text",
                                    //     member_id : memberId,
                                    //     depart_id : roomId
                                    // }).then((response) => {
                                    //     let cookieToken = cookies.get("token");
                                    //     const cProfile = cookies.get("profile")
                                    //     if(response.status === 200){
                                    //         socketRef.current.send(JSON.stringify({
                                    //             chatRoomId : cookieToken,
                                    //             type : "SEND",
                                    //             message : text,
                                    //             user : cProfile.nickname,
                                    //             fileType : "text"
                                    //         }))
                                    //     }
                                    // }).catch((error) => {
                                    //     console.log(error)
                                    //     if(error.code === "ERR_BAD_REQUEST"){
                                    //         axios.post("/reissue").then((response) => {
                                                
                            
                                    //         })
                                    //     }
                                    // });
            
                                }
                            }}/>

                            <div id="chatBtns">
                                <input type="button" className="chatBtn" id="enterBtn" onClick={() => {
                                    // setRemote("Trello");
                                    // setRemoteBlock(<Trello></Trello>);
                                    setRemote("upmu");
                                    setRemoteBlock(<Work></Work>)
                                }}/>
            
                                <input type="button" className="chatBtn" id="pCalBtn" onClick={() => {

                                    setDateInfo("")
                                    setRemote("ShwoCalender");
                                    setRemoteBlock(<ShowCalender></ShowCalender>)
                                }}/>
                                <input type="button" className="chatBtn" id="uploadBtn" onClick={() => {
                                    setRemote("file");
                                    setRemoteBlock(<FileUpload></FileUpload>)
                                }}/>
                            </div>
                        </div>
                 </div>
                    
                }
            </div>
        </div>


        <div id="mainSession">
            {/* 멤버 정보 수정 팝업 */}
            

            <div id="memberList">
                {memberBlock}
            </div>
            <input className="logoutBtn" value="로그아웃" type="button" onClick={() => {
                // axios.post("/logout")
                // .then((response) => {
                //     navigate("/");
                // })
                navigate("/");
            }}/>

        </div>
    </div>




    // 멤버 수정
    function EditMember(props){
        const [test, setTest] = useState([]);
        useEffect(() => {
            // axios.get(`/project/${state.project.id}/depart/list`)
            // .then((response) => {
            //     cookies.set("depart", response.data)
            //     let tempOption = [];
            //     for(let i = 0; i < response.data.length; i++){
            //         tempOption.push(<option value={response.data[i].id}>{response.data[i].subtitle}</option>);
            //     }
            //     setTest([...tempOption])
            // })
        }, [])


        return <div id="memberInfo">
            <img src={require("../imgs/proto_logo.png")} />
            <p>이름 <span style={{display : "inline-block", float : "right"}}>{props.mInfo.user.nickname}</span></p>
            <p>역할 <select id="memberEditRole" defaultValue={props.mInfo.role}>
                    <option value="WATTING">대기</option>
                    <option value="STAFF">사원</option>
                    <option value="MANAGER">팀장</option>
                    <option value="LEADER">대표</option>
                </select></p>

            <p>회의실 <select id="memberEditDepart" defaultValue={props.mInfo.depart === null ? "" : props.mInfo.depart.id}>
                {test}
            </select></p>
            <p>
                활성화 <select id="memberEditStatus" defaultValue={props.mInfo.status}>
                    <option value="ACTIVE">활성화</option>
                    <option value="INACTIVE">비활성화</option>
                </select>
            </p>
            
            <div>
                <input type="button" id="memberUpdateBtn" value="수정" onClick={() => {
                    // mInfo는 해당 유저의 project_member 엔티티이다 이를 바탕으로 수정
                    // axios.post(`/project/${state.project.id}/assign`, {
                    //     id : props.mInfo.id,   // member_id primary key
                    //     role : document.getElementById("memberEditRole").value, // member_role
                    //     status : document.getElementById("memberEditStatus").value,
                    //     depart_id : document.getElementById("memberEditDepart").value // depart_id
                    // }).then((response) => {
                    //     if(response.status === 200){
                    //         navigate("/project", {
                    //             state : {
                    //                 id : state.id,
                    //                 project : state.project
                    //             }
                    //         });
                    //     }
                    // })
                    
                    setRemote("none");
                    setRemoteBlock()
                }}/>
                
            </div>
        </div>
    }

    // 회의실 생성
    function AddRoom(){

        return <div className="popupBorder">
            <h1>회의실 생성</h1>
            <input type="text" id="depeartName" className="underInput" placeholder="회의실 명"/>

            <div className="popupBtns">
                <input type="button" className="cancleBtn" value="취소" onClick={() => {
                    setRemote("none");
                    setRemoteBlock();
                }}/>
                <input type="button" className="addBtn" value="추가" onClick={() => {
                    let title = document.getElementById("depeartName").value;
                    if(title === "") return;

                    // axios.post(`/project/${state.project.id}/create`, {
                    //     id : null,
                    //     subtitle : title,
                    //     token : null
                    // }).then((response) => {
                    //     if(response.status === 200){

                    //         // 채팅방 목록 다시 불러오기
                    //         axios.get(`/project/${state.project.id}/depart/list`)
                    //         .then((response) => {
                    //             cookies.set("depart", response.data)
                    //             let temp = [];
                    //             for(let i = 0; i < response.data.length; i++){
                    //                 temp.push(
                    //                     <div className="chatRoom" onClick={() => {
                    //                         // 방 클릭 시 해당 토큰 값을 설정   
                    //                         if(role === "WAITING") return;
                    //                         cookies.set("departId", response.data[i].id)
                    //                         setRoomId(response.data[i].id);
                    //                         setContent("chat")
                    //                     }}>
                    //                         {response.data[i].subtitle}
                    //                         <input type="button" className="editRoomBtn" style={{display : role === "LEADER" ? "block" : "none"}} value="수정" onClick={() => {
                    //                             setEditRoom({
                    //                                 depart : response.data[i]
                    //                             });
                    //                             setRemote("editRoom");
                    //                             setRemoteBlock(<EditRoom editRoom={{
                    //                                 depart : response.data[i]
                    //                             }}></EditRoom>)
                                                
                                                
                    //                         }}/>
                    //                     </div>
                    //                 )
                    //             }
                    //             setRoom(temp);
                    //         }).catch((error) => {
                    //             if(error.code === "ERR_BAD_REQUEST"){
                    //                 axios.post("/reissue").then((response) => {
                                       
                    //                 })
                    //             }
                    //         });
                    //     }
                    // }).catch((error) => {
                    //     if(error.code === "ERR_BAD_REQUEST"){
                    //         axios.post("/reissue").then((response) => {
            
                    //         })
                    //     }
                    // });


                    setRemote("none");
                    setRemoteBlock();
                }}/>
            </div>
        </div>
    }

    // 회의실 수정
    function EditRoom(props){     



        return <div id="editRooms">
            <h3>직무회의실 수정</h3>
            <div id="editTitleInsert">
                방이름 <input type="text"  id="editTitle" defaultValue={props.editRoom?.depart.subtitle}/>
            </div>
            <div id="editBtns">
                <input type="button" value="수정" onClick={() => {
                    let editTitle = document.getElementById("editTitle").value;
                    // axios.patch(`/project/${state.project.id}/${props.editRoom?.depart.id}/update`, {
                    //     id : props.editRoom?.depart.id,
                    //     subtitle : editTitle
                    // },).then((response) => {
                    //     if(response.status === 200){
                    //         setEditRoom({
                    //             depart : response.data
                    //         })
                    //         // 채팅방 목록 다시 불러오기
                    //         axios.get(`/project/${state.project.id}/depart/list`)
                    //         .then((response) => {
                    //             cookies.set("depart", response.data)
                    //             let temp = [];
                    //             for(let i = 0; i < response.data.length; i++){
                    //                 temp.push(
                    //                     <div className="chatRoom" onClick={() => {
                    //                         // 방 클릭 시 해당 토큰 값을 설정
                             
                    //                         if(role === "WAITING") return;
                    //                         cookies.set("departId", response.data[i].id)
                    //                         setRoomId(response.data[i].id);
                    //                         setContent("chat")
                    //                     }}>
                    //                         {response.data[i].subtitle}
                    //                         <input type="button" className="editRoomBtn" style={{display : role === "LEADER" ? "block" : "none"}} value="수정" onClick={() => {
                    //                             setEditRoom({
                    //                                 depart : response.data[i]
                    //                             });
                    //                             setRemote("editRoom");
                    //                             setRemoteBlock(<EditRoom editRoom={{
                    //                                 depart : response.data[i]
                    //                             }}></EditRoom>)
                                                
                    //                         }}/>
                    //                     </div>
                    //                 )
                    //             }
                    //             setRoom(temp);
                    //         }).catch((error) => {
                    //             if(error.code === "ERR_BAD_REQUEST"){
                    //                 axios.post("/reissue").then((response) => {

                    
                    //                 })
                    //             }
                    //         });
                    //     }
                    // })

                    setEditRoom(undefined);
                    setRemote("none");
                    setRemoteBlock();
                }}/>
                <input type="button" value="삭제" onClick={() => {
                    // axios.delete(`/project/${state.project.id}/${props.editRoom?.depart.id}/delete`)
                    // .then((response) => {
                    //     if(response.status === 200){
                    //         // 채팅방 목록 다시 불러오기
                    //         axios.get(`/project/${state.project.id}/depart/list`)
                    //         .then((response) => {
                    //             cookies.set("depart", response.data)
                    //             let temp = [];
                    //             for(let i = 0; i < response.data.length; i++){
                    //                 temp.push(
                    //                     <div className="chatRoom" onClick={() => {
                    //                         // 방 클릭 시 해당 토큰 값을 설정
                    //                         if(role === "WAITING") return;
                    //                         cookies.set("departId", response.data[i].id)
                    //                         setRoomId(response.data[i].id);
                    //                         setContent("chat")
                    //                     }}>
                    //                         {response.data[i].subtitle}
                    //                         <input type="button" className="editRoomBtn" style={{display : role === "LEADER" ? "block" : "none"}} value="수정" onClick={() => {
                    //                             setEditRoom({
                    //                                 depart : response.data[i]
                    //                             });
                    //                             setRemote("editRoom");
                    //                             setRemoteBlock(<EditRoom editRoom={{
                    //                                 depart : response.data[i]
                    //                             }}></EditRoom>)
                                                
                                                
                    //                         }}/>
                    //                     </div>
                    //                 )
                    //             }
                    //             setRoom(temp);
                    //         }).catch((error) => {
                    //             if(error.code === "ERR_BAD_REQUEST"){
                    //                 axios.post("/reissue").then((response) => {

                    
                    //                 })
                    //             }
                    //         });
                    //     }
                    // })

                    setEditRoom(undefined);
                    setRemote("none");
                    setRemoteBlock();
                }}/>
            </div>
        </div>
    }

    // 파일 업로드
    function FileUpload(){


        return <div className="popupBorder">
            <h1>파일 업로드</h1>
            <p>
                업로드 유형 <select id="fileType">
                    <option value="file">파일</option>
                    <option value="image">이미지</option>
                </select>

            </p>
            <div className="uploadImage"></div>
            <div className="uploadInfo">
                <input type="file" id="chatUpload"/>
            </div>
            <div className="popupBtns">
                <input type="button" className="cancleBtn" value="취소" onClick={() => {
                    setRemote("none");
                    setRemoteBlock();
                }}/>
                <input type="button" className="addBtn" value="업로드" onClick={() => {
                    let formData = new FormData();
                    if(token === "") return;

        

                    let fileType = document.getElementById("fileType").value;
                    formData.append("file", document.getElementById("chatUpload").files[0]);
                    

                    // axios.post("/upload", formData, {
                    //     headers : {
                    //         "Content-Type" : "multipart/form-data"
                    //     }
                    // }).then((response) => {
                    //     if(response.status === 200){
                    //         axios.post(`/project/${state.project.id}/${roomId}/chat/save`, {
                    //             content : response.data,
                    //             type : fileType,
                    //             member_id : memberId,
                    //             depart_id : roomId
                    //         }).then((res) => {
                    //             if(res.status === 200){
                    //                 let cookieToken = cookies.get("token");
                    //                 const cProfile = cookies.get("profile")
                    //                 socketRef.current.send(JSON.stringify({
                    //                     chatRoomId : cookieToken,
                    //                     type : "SEND",
                    //                     message : response.data,
                    //                     user : cProfile.nickname,
                    //                     fileType : fileType
                    //                 }))
                    //             }
                    //         })
                    //     }
                       
                    // })

                    setRemote("none");
                    setRemoteBlock();
                }}/>
            </div>
        </div>
    }

    // 일정 생성
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
            // axios.get("/schedule/list/project/"+state.project.id)
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
                        
                        cnt++;

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

                            // testDay.getFullYear() + "-" + (testDay.getMonth() + 1) + "-" + testDay.getDate() + " " + testDay.getHours() + ":" + testDay.getMinutes()+":"+testDay.getSeconds()
                            
                            if(alarm === "create"){
                                // axios.post("/schedule/create/"+state.project.id, {
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
            const [comment, setComment] = useState([]);

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

                                // 
                                // axios.get(`/comment/list/${state.project.id}/${dayTodo[i].id}`)
                                // .then((response) => {
                                //     let commentTemp = []
                                //     for(let k = 0; k < response.data.length; k++){
                                //         commentTemp.push(
                                //             <div className="commentBlock">
                                //                 <div style={{float : "left", mariginLeft : "10px"}}>
                                //                     {response.data[k].user.nickname}    
                                //                 </div>
                                //                 <div style={{float: "left", marginLeft : "10px"}}>
                                //                     {response.data[k].content}
                                //                 </div>

                                //                 <input className="commentDeleteBtn" value="X" type="button" onClick={() => {
                                    
                                //                     axios.delete(`/comment/delete/${state.project.id}/${response.data[i].id}`)
                                //                     .then((response) => {
                                //                         if(response.status === 200){
                                //                             axios.get(`/comment/list/${state.project.id}/${dayTodo[i].id}`)
                                //                             .then((response) => {
                                //                                 let commentTemp = []
                                //                                 for(let k = 0; k < response.data.length; k++){
                                //                                     commentTemp.push(
                                //                                         <div className="commentBlock">
                                //                                             <div style={{float : "left", mariginLeft : "10px"}}>
                                //                                                 {response.data[k].user.nickname}    
                                //                                             </div>
                                //                                             <div style={{float: "left", marginLeft : "10px"}}>
                                //                                                 {response.data[k].content}
                                //                                             </div>

                                //                                             <input className="commentDeleteBtn" type="button" value="X" onClick={() => {
                                                         
                                //                                                 axios.delete(`/comment/update/${state.project.id}/${response.data[i].id}`)
                                //                                                 .then((response) => {
                                //                                                     if(response.status === 200){
                                                                                        
                                //                                                     }
                                //                                                 })
                                //                                             }}/>
                                //                                         </div>
                                //                                     )
                                //                                 }
                                //                                 setComment([...commentTemp]);
                                //                             })
                                //                         }
                                //                     })
                                //                 }}/>
                                //             </div>
                                //         )
                                //     }
                                //     setComment([...commentTemp]);

                                //     setDetailTemp({
                                //         id : dayTodo[i].id,
                                //         title : dayTodo[i].title,
                                //         info : dayTodo[i].user.nickname + " " + dayTodo[i].start + " ~ " + dayTodo[i].end,
                                //         content : dayTodo[i].detail
                                //     })
                                //     setDateDetail("detail")
                                //     setSelectDay(dayTodo[i].id)
                                //     setSelectDate();
                                // })
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

                    {dateDetail === "list" ? <input type="button" value="생성" style={{display : dateDetail === "list" && role === "LEADER" ? "block" : "none"}} onClick={() => {
                        setAlarm("create");
                    }}/> : <input type="button" value="수정" style={{display : dateDetail !== "list" && role === "LEADER" ? "block" : "none"}} onClick={() => {
                        setAlarm("modify");
                    }}/>}

                    <input type="button" value="삭제" style={{marginRight : "10px", display : dateDetail !== "list" && role === "LEADER" ? "block" : "none"}} onClick={() => {
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
                        <div id="commentInsert">
                            <input type="text" id="commentInput"/>
                            <input type="button" id="commentBtn" value='작성' onClick={() => {
                                let text = document.getElementById("commentInput").value;
                                if(text === "") return
                                // axios.post(`/comment/create/${state.project.id}/${selectDay}`, {
                                //     content : text
                                // })
                                // .then((response) => {
                                //     if(response.status === 200){

                                //         axios.get(`/comment/list/${state.project.id}/${selectDay}`)
                                //         .then((response) => {
                                //             let commentTemp = []
                                //             for(let k = 0; k < response.data.length; k++){
                                //                 commentTemp.push(
                                //                     <div className="commentBlock">
                                //                         <div style={{float : "left", mariginLeft : "10px"}}>
                                //                             {response.data[k].user.nickname}    
                                //                         </div>
                                //                         <div style={{float: "left", marginLeft : "10px"}}>
                                //                             {response.data[k].content}
                                //                         </div>

                                //                         <input className="commentDeleteBtn" value="X" type="button" onClick={() => {
                                            
                                //                             axios.delete(`/comment/update/${state.project.id}/${response.data[k].id}`)
                                //                             .then((response) => {
                                //                                 if(response.status === 200){
                                                                    
                                //                                 }
                                //                             })
                                //                         }}/>
                                //                     </div>
                                //                 )
                                //             }
                                //             setComment([...commentTemp]);
                                //         })
                                //     }
                                // })
                            }}/>
                        </div>
                        <div id="commentList">
                            {comment}
                        </div>
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

    // 업무 팝업
    function Trello(){
        const [popup, setPopup] = useState("none")
        const [create, setCreate] = useState("none");
        
    
        // create값이 craete이면 생성 제목이 나오며 서버가 생성을 하는 주소로 바뀌지만,
        // update로 하면 update로

        return <div id="trelloDiv">

            <div id="trelloCreate" style={{display : create === "none" ? "none" : "block"}}>
                <h3>{create === 'create' ? '생성' : '수정'}</h3>
                <input type="text" placeholder=" 제목"/>
                <div id="trelloDate">
                    <label>시작일 <input type="datetime-local"/></label>
                    <label>종료일 <input type="datetime-local"/></label>
                </div>
                <textarea placeholder="업무 내용">

                </textarea>
                <div id="trelloCreateBtns">
                    <input type="button" value={create === 'create' ? '생성' : '수정'} onClick={() => { 
                        // 주소를 삼항연산자로 바꾸는거

                        setCreate("none") 
                    }}/>
                    <input type="button" value="닫기" onClick={() => { 
                        setCreate("none") 
                    }}/>
                </div>
            </div>


            <div id="trelloPopup" style={{display : popup}}>
                <p id="popupTitle">해당 블럭 제목</p>
                <p id="popupDate">2024-10-12 ~ 2024-10-18
                    <input type="button" value="수정" onClick={() => {
                        setCreate("update")
                    }}/>
                </p>
                <div id="popupContent">
                    내용
                </div>
                <hr/>
                <div id="commentPInsert">
                    <input type="text" id="commentInput"/>
                </div>
                <div id="commentPList">
                    <div className="commentPBlock">
                        김사원 테스트
                    </div>
                    <div className="commentPBlock">
                        김사원 테스트
                    </div>
                    <div className="commentPBlock">
                        김사원 테스트
                    </div>
                </div>
                <input id="popupCloseBtn" type="button" value="닫기" onClick={() => {
                    setPopup("none");
                }}/>
            </div>
    
            <div id="trelloShow">
                
                <div className="trelloBox">
                    <div className="trelloTitle" style={{background : "rgb(202, 244, 255)"}}>
                        대기
                        <input className="trelloBtn" type="button" value="+" onClick={() => {
                            setCreate("create")
                        }}/>
                    </div>
                    <div className="trelloBlocks">
                        <div className="trelloBlock"  onClick={() => {
                            setPopup("block")
                        }}>
                            <div className="trelloBlockTitle">
                                테스트 제목
                            </div>
                            <div className="trelloBlockContent">
                                2024-09-24 10:22 ~ 2024-09-28 12:00
                            </div>
                        </div>
                        
                        
                    </div>
                    
                </div>
            
                <div className="trelloBox">
                    <div className="trelloTitle" style={{background : "rgb(127, 229, 255)"}}>
                        해야 할 일
                        <input className="trelloBtn" type="button" value="+" onClick={() => {
                            setCreate("create")
                        }}/>
                    </div>
                    <div className="trelloBlocks">
                        
                    </div>
                    
                </div>
    
                <div className="trelloBox">
                    <div className="trelloTitle" style={{background : "rgb(0, 205, 255)"}}>
                        완료
                        <input className="trelloBtn" type="button" value="+" onClick={() => {
                            setCreate("create")
                        }}/>
                    </div>
                    <div className="trelloBlocks">
                        
    
                    </div>
                    
                </div>
                
    
            </div>
        </div>
    }

    
    
}



