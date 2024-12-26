import axios from "axios";
import "./login.css"
import { useNavigate } from "react-router-dom";
import { Cookies } from "react-cookie";
import { useEffect } from "react";

export default function Login(){
    const navigate = useNavigate();
    const cookie = new Cookies();

    useEffect(() => {
        // 기존에 브라우저에 로그인을 하였는지 확인 후 맞으면 메인 페이지 이동
        // axios.get("/user/profile")
        // .then((response) => {
        //     console.log(response.headers)
        //     if(response.status === 200){
        //         navigate("/main", {
        //             state : {
        //                 id : response.data.username,
        //                 access : ""
        //             }
        //         });
        //     }
        // }).catch((error) => {
        //     // 로그인 아직 안한 상태
        // })
    }, []);
    


    return <div id="loginDiv">
        <img id="loginLogo" src={require("../imgs/proto_logo.png")} alt="logo"/>
        <input type="text" id="loginId" name="id" placeholder="아이디"/>
        <input type="password" id="loginPwd" name="password" placeholder="비밀번호"/>
        <input type="button" id="loginBtn" value="로그인" onClick={() => {
            navigate("/main", {
                state : {
                    id : "test",
                    access : "check"
                }
            });
            // let id = document.querySelector("#loginId").value;
            // let pwd = document.querySelector("#loginPwd").value;

            // if(id === "" || pwd === "")
            //     return

            // let formData = new FormData();
            // formData.append("username", id);
            // formData.append("password", pwd);

            // // 로그인요청
            // axios.post("/login", formData, {
            //     headers : {
            //         "Content-Type" : "multipart/form-data"
            //     }
            // })
            // .then((response) => {
            //     if(response.status === 200){
                
            //         navigate("/main", {
            //             state : {
            //                 id : id,
            //                 access : response.headers.access
            //             }
            //         });
            //     }
            // })

        }} style={{marginTop : '70px'}}/>
        <input type="button" value="구글 로그인" onClick={() => {
            // 구글 로그인/회원가입 요청
            // window.location.href = "http://localhost:8080/oauth2/authorization/google";

        }} style={{margin : '20px auto'}}/>

       
        <input type="button" value="회원가입" onClick={()=>{navigate("/sign")}}/>
    </div>
}



