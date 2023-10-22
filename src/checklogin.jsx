import * as React from 'react'

export function CheckLogin() {

    React.useEffect(() => {
        fetch("/api/checklogin", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                page: window.location.href + window.location.search
            }),
        })
            .then(res => res.json())
            .then(res => {
                if (!res.logined) {
                    alert("請重新登入")
                    window.location.reload()
                }
            })
    }, [])

    return <></>
}