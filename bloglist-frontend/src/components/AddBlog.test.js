import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import AddBlog from './AddBlog'

test('form gets all props with correct info', () => {

  const createBlog = jest.fn()

  const component = render(
    <AddBlog handleSubmit={createBlog} />
  )

  const title_input = component.container.querySelector('#title')
  const author_input = component.container.querySelector('#author')
  const url_input = component.container.querySelector('#url')
  const form = component.container.querySelector('form')

  fireEvent.change(title_input, {
    target: { value: 'this could be easier' }
  })
  fireEvent.submit(form)
  fireEvent.change(author_input, {
    target: { value: 'this could be easier author' }
  })
  fireEvent.submit(form)
  fireEvent.change(url_input, {
    target: { value: 'this.com' }
  })
  fireEvent.submit(form)

  expect(createBlog.mock.calls).toHaveLength(3)
  expect(title_input.value).toBe('this could be easier')
  expect(author_input.value).toBe('this could be easier author')
  expect(url_input.value).toBe('this.com')
})