import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'

function App() {

  const [user, setUser] = useState<any>(null)


  useEffect(() => {
    const accessToken = document.cookie.split(';').find((cookie) => cookie.includes('access_token'))
    console.log(accessToken)
    if (accessToken) {
      fetch('http://localhost:3000/profile', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken.split('=')[1]}`
        },
      }).then((response) => response.json())
        .then((data) => {
          console.log('Success:', data);
          setUser(data)
        })
        .catch((error) => {
          console.error('Error:', error);
        }
        );
    }
  }, [])


  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const formData = new FormData(form)
    const username = formData.get('username')
    const password = formData.get('password')

    fetch('http://localhost:3000/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        'username': username,
        'password': password,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Success:', data);
        if (data.success) {
          document.cookie = `access_token=${data.access_token};max-age=3600`
          fetch('http://localhost:3000/profile', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${data.access_token}`
            },
          }).then((response) => response.json())
            .then((data) => {
              console.log('Success:', data);
              setUser(data)
            })
            .catch((error) => {
              console.error('Error:', error);
            }
            );
        } else {
          alert('Login failed')
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }


  return (
    <>
      {user ? (
        <>
          <h1>Profile</h1>

          <div>
            <p>Username: {user.username}</p>
            <p>Email: {user.email}</p>
          </div>

        </>
      ) : (
        <>
          <form onSubmit={handleLogin}>
            username: <input type="text" name="username" />
            password: <input type="password" name="password" />
            <button type="submit">Login</button>
          </form>

        </>
      )}
    </>
  )
}

export default App
