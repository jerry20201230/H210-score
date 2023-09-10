import * as React from 'react'
import TopBar from '../Topbar'

export function Score({ data, user }) {

  const [scorelist, setScoreList] = React.useState([
    { title: "", id: "" }
  ])

  function getScore() {
    fetch("/api/getscore", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}),
    })
      .then(res => res.json())
      .then(res => {
        console.log(res)

        fetch("/api/getscoremap", {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({}),
        })
          .then(res2 => res2.json())
          .then(res2 => {
            console.log(res2)
            var list = []
            for (let i = 0; i < res2.data.result.length; i++) {
              list.push({ title: res2.data.result[i].scoreName, id: res2.data.result[i].uid })
            }
            setScoreList(list)
          })
      })
  }

  React.useEffect(() => {
    getScore()
  }, [])

  return (
    <TopBar logined={true} data={data.data} user={user} title={"首頁"} />
  )
}