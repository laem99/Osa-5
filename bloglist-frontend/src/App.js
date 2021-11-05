import React, { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import AddBlog from './components/AddBlog'
import Togglable from './components/Togglable'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [message, setMessage] = useState(null)
  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')
  const [visible, setVisible] = useState(false)
  const [show, setShow] = useState(false)
  const [id, setId] = useState(undefined)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs)
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username, password,
      })
      window.localStorage.setItem(
        'loggedBlogAppUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setMessage('Succesfully logged in')
      setTimeout(() => {
        setMessage(null)
      }, 5000)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setMessage('wrong username or password, try again')
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    }
  }

  const handleLogOut = async (event) => {
    event.preventDefault()
    setMessage('logged out')
    setTimeout(() => {
      setMessage(null)
    }, 5000)

    try {
      window.localStorage.removeItem('loggedBlogAppUser')
      window.localStorage.clear()
      blogService.setToken(null)
      setUser(null)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setMessage('error: cound not logout')
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    }
  }

  const addBlog = (event) => {
    setVisible(true)
    event.preventDefault()
    const blogObj = {
      title: newTitle,
      author: newAuthor,
      url: newUrl,
    }

    blogService.create(blogObj)
      .then(returnedBlog => {
        setBlogs(blogs.concat(returnedBlog))
        setVisible(false)
        setNewAuthor('')
        setNewUrl('')
        setNewTitle('')
        setMessage(`a new blog ${blogObj.title} by ${blogObj.author} added`)
        setTimeout(() => {
          setMessage(null)
        }, 5000)
      })
  }

  const like = ({ blog }) => {
    blogService.update(blog)
      .then(returnedBlog => {
        const index = blogs.findIndex((el) => el.id === returnedBlog.id)
        let newArray = [...blogs]
        newArray[index] = returnedBlog
        setBlogs(newArray)
        setMessage(`you liked ${blog.author}s post`)
        setTimeout(() => {
          setMessage(null)
        }, 5000)
      })
  }

  const removeBlog = ({ blog }) => {
    blogService.deleteBlog(blog)
      .then(setBlogs(blogs.filter(b => b.id !== blog.id)))
  }

  const showAll = ({ blog }) => {
    setId(blog.id)
    setShow(!show)
  }

  const loggedInForm = () => {
    return (
      <div>
        <form onSubmit={handleLogOut}>
          <p>{user.name} logged in</p>
          <button id="logout-button" type="submit">Logout</button>
        </form>
        <Togglable visible={visible} buttonLabel="create new blog">
          <AddBlog title={newTitle} url={newUrl} author={newAuthor}
            handleAuthorChange={({ target }) => setNewAuthor(target.value)}
            handleTitleChange={({ target }) => setNewTitle(target.value)}
            handleUrlChange={({ target }) => setNewUrl(target.value)}
            handleSubmit={addBlog} />
        </Togglable>
        <h2>blogs</h2>
        {
          blogs.sort((a, b) => b.likes - a.likes).map(blog => <Blog key={blog.id} blog={blog} parentLike={() => like({ blog })}
            parentRemove={() => removeBlog({ blog })} showAll={() => showAll({ blog })} show={(id !== undefined && id === blog.id) ? show : false} />)
        }
      </div>
    )
  }

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        username
        <input type="text" value={username} name="Username" id="username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
        <input autoComplete="on" type="password" value={password} name="Password"
          onChange={({ target }) => setPassword(target.value)} id="password"
        />
      </div>
      <button id="login-button" type="submit">login</button>
    </form>
  )

  return (
    <div>
      <Notification message={message} />
      {user === null
        ? loginForm()
        : loggedInForm()}
    </div>
  )
}

export default App