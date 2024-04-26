const { test, expect, beforeEach, describe } = require('@playwright/test');

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('/api/testing/reset')
    await request.post('/api/users', {
      data: {
        name: 'Tester User',
        username: 'testeruser123',
        password: 'password123'
      }
    })
    await request.post('/api/users', {
      data: {
        name: 'Second Tester User',
        username: 'secondtesteruser123',
        password: 'password12345'
      }
    })

    await page.goto('/')
  })

  test('Login form is shown', async ({ page }) => {
    const locator = await page.getByText('Log in to application')
    await expect(locator).toBeVisible()
  })
  
  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await page.getByTestId('username').fill('testeruser123')
      await page.getByTestId('password').fill('password123')

      await page.getByRole('button', { name: 'login' }).click()

      const locator = await page.getByText('Tester User logged')
      await expect(locator).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await page.getByTestId('username').fill('testeruser123')
      await page.getByTestId('password').fill('password12')

      await page.getByRole('button', { name: 'login' }).click()

      const locator = await page.getByText('wrong credentials')
      await expect(locator).toBeVisible()
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await page.getByTestId('username').fill('testeruser123')
      await page.getByTestId('password').fill('password123')

      await page.getByRole('button', { name: 'login' }).click()
    })
  
    test('a new blog can be created', async ({ page }) => {
      await page.getByRole('button', { name: 'new blog' }).click()

      await page.getByTestId('title').fill('Test Title')
      await page.getByTestId('author').fill('Test Author')
      await page.getByTestId('url').fill('testurl.com')

      await page.getByRole('button', { name: 'create' }).click()

      const locator = await page.getByText('Test Title Test Author')
      await expect(locator).toBeVisible()
    })

    describe('After creating a blog', () => {
      beforeEach(async ({ page }) => {
        await page.getByRole('button', { name: 'new blog' }).click()

        await page.getByTestId('title').fill('Test Title')
        await page.getByTestId('author').fill('Test Author')
        await page.getByTestId('url').fill('testurl.com')

        await page.getByRole('button', { name: 'create' }).click()
      })

      test('a blog can be liked', async ({ page }) => {
        await page.getByRole('button', { name: 'view' }).click()

        await page.getByRole('button', { name: 'like' }).click()

        const locator = await page.getByText('likes 1')
        await expect(locator).toBeVisible()
      })

      test('a blog can be deleted', async ({ page }) => {
        await page.getByRole('button', { name: 'view' }).click()

        await page.getByRole('button', { name: 'delete' }).click()

        await expect(page.getByText('Test Title Test Author')).not.toBeVisible()
      })
      
      test('remove button is not visible for other users', async ({ page }) => {
        await page.getByRole('button', { name: 'logout' }).click()

        await page.getByTestId('username').fill('secondtesteruser123')
        await page.getByTestId('password').fill('password12345')
  
        await page.getByRole('button', { name: 'login' }).click()

        await page.getByRole('button', { name: 'view' }).click()

        await expect(page.getByRole('button', { name: 'delete' })).not.toBeVisible()
      })

      test('blogs are shown in correct order by likes', async ({ page }) => {
        await page.getByRole('button', { name: 'new blog' }).click()

        await page.getByTestId('title').fill('Test Title 2')
        await page.getByTestId('author').fill('Test Author 2')
        await page.getByTestId('url').fill('testurl2.com')
  
        await page.getByRole('button', { name: 'create' }).click()

        await page.getByRole('button', { name: 'new blog' }).click()

        await page.getByTestId('title').fill('Test Title 3')
        await page.getByTestId('author').fill('Test Author 3')
        await page.getByTestId('url').fill('testurl3.com')
  
        await page.getByRole('button', { name: 'create' }).click()

        await page.waitForTimeout(1000)
        
        const buttons = await page.getByRole('button', { name: 'view' }).all()

        await buttons[2].click()

        await page.getByRole('button', { name: 'like' }).click()
        await page.getByRole('button', { name: 'like' }).click()
        await page.getByRole('button', { name: 'like' }).click()

        await page.getByRole('button', { name: 'hide' }).click()

        await buttons[1].click()

        await page.getByRole('button', { name: 'like' }).click()
        await page.getByRole('button', { name: 'like' }).click()

        await page.getByRole('button', { name: 'hide' }).click()

        await buttons[0].click()

        await page.getByRole('button', { name: 'like' }).click()

        await page.getByRole('button', { name: 'hide' }).click()

        const blogs = await page.getByTestId('blog').all()
        const first = await blogs[0].innerText()
        const second = await blogs[1].innerText()
        const third = await blogs[2].innerText()

        await expect(first).toContain('Test Title 3 Test Author 3')
        await expect(second).toContain('Test Title Test Author')
        await expect(third).toContain('Test Title 2 Test Author 2')
      })
    })
  })
})