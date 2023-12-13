import React from 'react';

import { GoogleLogin } from '@react-oauth/google';

const GoogleLoginBtn = ({ set, callback }) => {

    return (
        <GoogleLogin
            onSuccess={credentialResponse => {
                console.log(credentialResponse);
                fetch("/auth/googlelogin", {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ credential: credentialResponse.credential }),
                })
                    .then(res => res.json())
                    .then(res => {
                        console.log(res.data)
                        if (res.ok) {
                            //alert("登入成功")
                            set(true)
                            // localStorage.setItem("loginedUserid", userid)
                            callback(res)
                            //window.location.reload()
                        } else {
                            alert(res.message)
                            window.location.reload()
                            // AlertDialog({ title: "登入失敗", message: res.message })
                        }
                    })
            }}
            onError={() => {
                alert("發生錯誤，暫時無法使用Google登入")
                console.log('Login Failed');
            }}
        />
    )
}

export default GoogleLoginBtn;