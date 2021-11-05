import React from 'react'

const AddBlog = ({
  handleSubmit,
  handleTitleChange,
  handleAuthorChange,
  handleUrlChange,
  title,
  author,
  url
}) => {
  return (
    <div>
      <h2>Create Blog</h2>
      <form onSubmit={handleSubmit}>
        <div>
          Title:
          <input name="title" id="title"
            value={title}
            onChange={handleTitleChange}
          />
          Author:
          <input name="author" id="author"
            value={author}
            onChange={handleAuthorChange}
          />
          Url:
          <input name="url" id="url"
            value={url}
            onChange={handleUrlChange}
          />
        </div>
        <button type="submit" id="create">Create</button>
      </form>
    </div>
  )
}

export default AddBlog