import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import Blog from './Blog'

test('renders blogs title and author', () => {
  const blog = {
    title: 'my test title',
    author: 'my test author',
    url: 'mytesturl.com',
    likes: 1
  }

  const component = render(
    <Blog blog={blog} />
  )

  const content = component.getByText(
    'my test title - my test author'
  )
  expect(content).toBeDefined()
})

test('does not render likes or url at first', () => {
  const blog = {
    title: 'my test title',
    author: 'my test author',
    url: 'mytesturl.com',
    likes: 1
  }

  const component = render(
    <Blog blog={blog} />
  )

  expect(component.likes).toBeUndefined()
  expect(component.url).toBeUndefined()
})

test('url and likes are found after button click', () => {
  const blog = {
    title: 'my test title',
    author: 'my test author',
    url: 'mytesturl.com',
    likes: 1
  }

  const mockHandler = jest.fn()

  const component = render(
    <Blog blog={blog} showAll={mockHandler} show={true} />
  )

  const button = component.getByText('View')
  fireEvent.click(button)

  const likes = component.getByText(
    'Likes: 1'
  )
  const url = component.getByText(
    'Url: mytesturl.com'
  )

  expect(likes).toBeDefined()
  expect(url).toBeDefined()
})

test('like button pressed twice', () => {
  const blog = {
    title: 'my test title',
    author: 'my test author',
    url: 'mytesturl.com',
    likes: 1
  }
  const mockHandler = jest.fn()

  const component = render(
    <Blog blog={blog} showAll={mockHandler} />
  )

  const button = component.getByText('View')
  fireEvent.click(button)
  fireEvent.click(button)

  expect(mockHandler.mock.calls).toHaveLength(2)
})