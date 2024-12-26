import "./join.css";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";

export default function Join(){
    const [check, setCheck] = useState(0);
    const navigate = useNavigate();

    return <div id="joinDiv">
        <div id="joinHeader">
            <img id="joinLogo" src={require("../imgs/proto_logo.png")} alt="logo"/>
            <span>계정 생성</span>
        </div>
        <div id="joinBody">
            <div id="joinLeft">
                <div className="joinBlock">
                    <input type="text" style={{width : '50%', color : check === 2 ? 'rgb(255,0,0)' : 'rgb(0,0,0)'}} id="joinId" name="id" placeholder="아이디"/>
                    <input type="button" id="idCheck" value="" onClick={() => {
                        alert("사용가능한 아이디 입니다.");
                        setCheck(1);
                        // let id = document.querySelector("#joinId").value;
                        // if(id === ""){
                        //     alert("아이디를 입력해주세요");
                        //     return;
                        // }
                        // // 중복되는 아이디가 있는지 확인
                        // axios.get("/duplicate/"+id)
                        //     .then((response) => {
                        //         if(response.status === 200){
                        //             alert("사용가능한 아이디 입니다.");
                        //             setCheck(1);
                        //         }else{
                        //             alert("중복되는 아이디입니다.")
                        //         }
                        //     }).catch((error) => {
                        //         alert("중복되는 아이디입니다.")
                        //     })

                    }}/>
                </div>
                <div className="joinBlock">
                    <input type="password" id="joinPwd" name="pwd" placeholder="비밀번호"/>
                </div>
                <div className="joinBlock">
                    <input type="password" id="joinPwdChk" name="pwdChk" placeholder="비밀번호 확인"/>
                </div>
                <div className="joinBlock">
                    <input type="text" id="joinNickname" name="email" placeholder="이름"/>
                </div>
                <div className="joinBlock">
                    <input type="email" id="joinEmail" name="email" placeholder="이메일"/>
                </div>
            </div>

            <div id="joinRight">
                <div className="joinBlock">
                    <input type="text" id="joinPhone" name="phone" placeholder="전화번호(000-0000-0000)"/>
                </div>
                <div className="joinBlock">
                    생년월일 <input type="date" id="joinBirth" name="birth"/>
                </div>
                <div className="joinBlock">
                    <input type="text" id="joinGroup" name="group" placeholder="소속"/>
                </div>
                <div className="joinBlock">
                    <input type="button" id="joinBtn" value="회원가입" onClick={()=>{
                        let id = document.querySelector("#joinId").value;
                        let pwd = document.querySelector("#joinPwd").value;
                        let pwdChk = document.querySelector("#joinPwdChk").value;
                        let nickname = document.querySelector("#joinNickname").value;
                        let email = document.querySelector("#joinEmail").value;
                        let birth = new Date(document.querySelector("#joinBirth").value);
                        let phone = document.querySelector("#joinPhone").value;
                        let group = document.querySelector("#joinGroup").value;
                        
                        
                        
                        if((id === "")){
                            alert("입력되지 않은 내용이 있습니다.");
                            return;
                        }

                        if((id === "" || pwd === "" || pwdChk === "" || email === "" || birth === "" || phone === "" || group === "" ) ||
                            (id.length < 2 || pwd.length < 2 || pwdChk.length < 2 || email.length < 2 || birth.length < 2 || phone.length < 2 ||  group.length < 2)){
                            alert("입력되지 않은 내용이 있습니다.");
                            return;
                        }

                        if(birth === "Invalid Date"){
                            alert("생년월일을 입력해주세요.");
                            return;
                        }

                        if(email.indexOf("@") === -1 || email.indexOf(".") === -1 || email.indexOf(".") < email.indexOf("@")){
                            alert("이메일을 다시 입력해주세요.");
                            return;
                        }

                        
                        if(phone.indexOf("-") < 3 ||  phone.split("-").length !== 3){
                            alert("전화번호 양식을 지켜서 입력해주세요");
                            return;
                        }

                        if(pwd !== pwdChk){
                            alert("비밀번호가 일치하지 않습니다.");
                            return;
                        }

                        if(check != 1){
                            alert("아이디 중복 확인을 해주세요.");
                            return;
                        }

                        alert("회원가입에 성공하셨습니다!")
                        navigate("/main", {
                            state : {
                                id : "test",
                                access : "check"
                            }
                        });

                        
                        
                    }}/>
                </div>

            </div>
        </div>
    </div>
}