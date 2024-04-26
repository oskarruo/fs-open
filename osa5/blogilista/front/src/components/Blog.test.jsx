import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'
import BlogForm from './CreateBlog'

test('renders short content', () => {
  const blog = {
    title: 'Testing Title',
    author: 'Tester Mann',
    url: 'testurl.xyz',
    likes: 1
  }

  const { container } = render(<Blog blog={blog} />)

  const div = container.querySelector('.blog')
  expect(div).toHaveTextContent(
    'Testing Title'
  )
  expect(div).toHaveTextContent(
    'Tester Mann'
  )
  expect(div).not.toHaveTextContent(
    'testurl.xyz'
  )
})

test('renders long content', async () => {
  const blog = {
    title: 'Testing Title',
    author: 'Tester Mann',
    url: 'testurl.xyz',
    likes: 1,
    user: {
      username: 'testuser',
      name: 'Test User'
    }
  }
  const user = {
    username: 'testuser'
  }

  const { container } = render(<Blog blog={blog} user={user} />)

  const userr = userEvent.setup()
  const button = screen.getByText('view')
  await userr.click(button)

  const div = container.querySelector('.blog')
  expect(div).toHaveTextContent(
    'Testing Title'
  )
  expect(div).toHaveTextContent(
    'Tester Mann'
  )
  expect(div).toHaveTextContent(
    'testurl.xyz'
  )
  expect(div).toHaveTextContent(
    'likes 1'
  )
  expect(div).toHaveTextContent(
    'Test User'
  )
})

test('like button works', async () => {
  const blog = {
    title: 'Testing Title',
    author: 'Tester Mann',
    url: 'testurl.xyz',
    likes: 1,
    user: {
      username: 'testuser',
      name: 'Test User'
    }
  }
  const user = {
    username: 'testuser'
  }
  const mockHandler = vi.fn()

  render(<Blog blog={blog} user={user} handleLike={mockHandler} id={123} />)

  const userr = userEvent.setup()
  const button = screen.getByText('view')
  await userr.click(button)

  const buttonn = screen.getByText('like')
  await userr.click(buttonn)
  await userr.click(buttonn)

  expect(mockHandler.mock.calls).toHaveLength(2)
})

test('blog adding works', async () => {
  const handleCreate = vi.fn()

  render(<BlogForm handleCreate={handleCreate}/>)

  const inputtitle = screen.getByPlaceholderText('title')
  const inputauthor = screen.getByPlaceholderText('author')
  const inputurl = screen.getByPlaceholderText('url')
  const createButton = screen.getByText('create')

  await userEvent.type(inputtitle, 'Test Blog' )
  await userEvent.type(inputauthor, 'Blog Tester' )
  await userEvent.type(inputurl, 'blog.test' )
  await userEvent.click(createButton)

  expect(handleCreate.mock.calls).toHaveLength(1)
  expect(handleCreate.mock.calls[0][0]).toBe('Test Blog' )
  expect(handleCreate.mock.calls[0][1]).toBe('Blog Tester' )
  expect(handleCreate.mock.calls[0][2]).toBe('blog.test' )
})

