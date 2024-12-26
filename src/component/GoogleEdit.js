import axios from "axios"
import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react";

export default function GoogleEdit(){
    const [check, setCheck] = useState(0);
    const navigate = useNavigate();


    useEffect(() => {
        // 구글 회원가입 시 필수 정보는 서버에서 기입하여 회원가입이 되었기 때문에
        // 저장된 임의의 정보를 불러와 사용자가 수정할 수 있게 설정
        // axios.get("/user/profile")
        // .then((response) => {
        //     console.log(response.data)
        //     document.querySelector("#joinId").value = response.data.username;
        //     document.querySelector("#joinNickname").value = response.data.nickname;
        //     document.querySelector("#joinEmail").value = response.data.email;
        //     document.querySelector("#joinUrl").value = response.data.url;
        // })
    }, [])

    return <div id="joinDiv">
        <div id="joinHeader">
            <img id="joinLogo" src={require("../imgs/proto_logo.png")} alt="logo"/>
            <span>추가 정보 설정</span>
        </div>
        <div id="joinBody">
            <div id="joinLeft">
                <div className="joinBlock">
                    <input type="hidden" id="joinUrl"/>
                    <input type="text" style={{width : '50%', color : check === 2 ? 'rgb(255,0,0)' : 'rgb(0,0,0)'}} id="joinId" name="id" placeholder="아이디"/>
                    <input type="button" id="idCheck" value="" onClick={() => {
                        let id = document.querySelector("#joinId").value;
                        if(id === ""){
                            alert("아이디를 입력해주세요");
                            return;
                        }
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
                        

                        if(birth === "Invalid Date"){
                            alert("생년월일을 입력해주세요.");
                            return;
                        }

                        if((id === "")){
                            alert("입력되지 않은 내용이 있습니다.");
                            return;
                        }

                        if((id === "" || pwd === "" || pwdChk === "" || email === "" || birth === "" || phone === "" || group === "" ) ||
                            (id.length < 2 || pwd.length < 2 || pwdChk.length < 2 || email.length < 2 || phone.length < 2 ||  group.length < 2)){
                            alert("입력되지 않은 내용이 있습니다.");
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

                        // 구글 회원가입은 기존 가입 정보에 수정을 하기에 회원가입과는 살짝 다른
                        // axios.post("/join/google", {
                        //     username : id,
                        //     password : pwd,
                        //     nickname : nickname,
                        //     email : email,
                        //     birth : birth.getFullYear() + "-" + ("0" + (birth.getMonth() + 1)).slice(-2) + "-" +("0" + birth.getDate()).slice(-2),
                        //     phone : phone,
                        //     group : group,
                        //     theme : "LIGHT",
                        //     url : document.querySelector("#joinUrl").value
                        // })
                        // .then((response) => {
                        //     if(response.status === 200){
                        //         alert("회원가입에 성공하셨습니다!")
                        //         navigate("/main", {
                        //             state : {
                        //                 id : id,
                        //                 access : "access"
                        //             }
                        //         });
                        //     }else{
                        //         alert("오류가 발생하셨습니다. 양식에 맞추어 입력해주세요")
                        //     }
                        // })

                        alert("회원가입에 성공하셨습니다!")
                        navigate("/main", {
                            state : {
                                id : "check",
                                access : "access"
                            }
                        });
                        
                    }}/>
                </div>

            </div>
        </div>
    </div>
}