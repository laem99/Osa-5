import React from 'react'
const Blog = ({ blog, parentLike, parentRemove, showAll, show }) => {

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const like = () => {
    const blogObj = {
      userId: blog.id.toString(),
      title: blog.title,
      author: blog.author,
      url: blog.url,
      likes: blog.likes++
    }
    parentLike(blogObj)
  }

  const removeBlog = () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      parentRemove(blog)
    }
  }

  return (
    <div style={blogStyle}>
      {blog.title} - {blog.author}
      <button id="view" onClick={() => showAll({ blog })}>View</button>
      {show
        ? <div>
          <p>Url: {blog.url}</p>
          <p>Likes: {blog.likes}</p>
          <button id="like" onClick={like}>Like</button>
          <p>Author: {blog.author}</p>
          <button id="remove" onClick={removeBlog}>Remove</button>
        </div>
        : null}
    </div>
  )
}

export default Blog