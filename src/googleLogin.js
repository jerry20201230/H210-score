import React from 'react';

import { GoogleLogin } from '@react-oauth/google';

const GoogleLoginBtn = () => {

    return (
        <GoogleLogin
            onSuccess={credentialResponse => {
                console.log(credentialResponse);
            }}
            onError={() => {
                console.log('Login Failed');
            }}
        />
    )
}

export default GoogleLoginBtn;