describe('Blog app', function () {
  beforeEach(function () {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    const user = {
      name: 'Test User',
      username: 'test123',
      password: 'myTestPassword'
    }
    cy.request('POST', 'http://localhost:3003/api/users/', user)
    cy.visit('http://localhost:3000')
  })

  it('Login form is shown', function () {
    cy.visit('http://localhost:3000')
    cy.contains('login')
    cy.contains('username')
    cy.contains('password')
  })

  describe('Login', function () {
    it('succeeds with correct credentials', function () {
      cy.contains('login').click()
      cy.get('#username').type('test123')
      cy.get('#password').type('myTestPassword')
      cy.get('#login-button').click()

      cy.contains('blogs')
      cy.contains('create new')
    })

    it('fails with wrong credentials', function () {
      cy.contains('login').click()
      cy.get('#username').type('test123')
      cy.get('#password').type('wrong')
      cy.get('#login-button').click()

      cy.contains('wrong username or password, try again')
    })
  })

  describe('When logged in', function() {
    beforeEach(function() {
      cy.contains('login').click()
      cy.get('#username').type('test123')
      cy.get('#password').type('myTestPassword')
      cy.get('#login-button').click()
    })

    it('A blog can be created', function() {
      cy.contains('create new blog').click()
      cy.get('#title').type('a new test blog created')
      cy.get('#author').type('test123')
      cy.get('#url').type('newtest.com')
      cy.get('#create').click()
      cy.contains('a new test blog created')
      cy.contains('a new blog a new test blog created by test123 added')
    })
  })

  describe('When blog is added', function() {
    beforeEach(function() {
      cy.contains('login').click()
      cy.get('#username').type('test123')
      cy.get('#password').type('myTestPassword')
      cy.get('#login-button').click()
      cy.contains('create new blog').click()
      cy.get('#title').type('a new test blog created')
      cy.get('#author').type('test123')
      cy.get('#url').type('newtest.com')
      cy.get('#create').click()
    })

    it('A blog can be liked', function() {
      cy.contains('View').click()
      cy.get('#like').click()
      cy.contains('Likes: 1')
      cy.contains('you liked test123s post')
    })

    it('A blog can be deleted by author', function() {
      cy.contains('View').click()
      cy.get('#remove').click()
      cy.contains('blogs').not('a new test blog created removed')
    })
  })
})

describe('Blogs are sorted so that most liked one is first', function() {
  beforeEach(function() {
    cy.get('#title').type('a new test blog created')
    cy.get('#author').type('test123')
    cy.get('#url').type('newtest.com')
    cy.get('#create').click()
    cy.get('#title').type('a new test blog created2')
    cy.get('#author').type('test123.2')
    cy.get('#url').type('newtest2.com')
    cy.get('#create').click()
    cy.contains('blogs')
  })

  it('order is correct', function() {
    cy.get('#view').click()
    cy.get('#view').click()
    cy.get('#like').click()
    cy.get('#like').click()
    cy.contains('Likes: 2').then((t) => {
      const likes = t.text
      cy.contains('Likes: 0').should((e) => {
        expect(likes)
        expect(e)
      })
    })
  })
})