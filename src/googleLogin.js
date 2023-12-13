import React from 'react';

import { GoogleLogin } from '@react-oauth/google';

const GoogleLoginBtn = () => {

    return (
        <GoogleLogin
            onSuccess={credentialResponse => {
                console.log(credentialResponse);
                fetch("/auth/googlelogin", {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ credentialResponse }),
                })
                    .then(res => res.json())
                    .then(res => {
                        console.log(res.data)
                        if (res.ok) {

                        } else {

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