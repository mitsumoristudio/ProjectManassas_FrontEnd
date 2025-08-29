describe('Login page', () => {
    it("should test all the login functionality", () => {
        cy.visit('http://localhost:3000/login')
        cy.get('[data-cy=login-title]').should("exist")
            .should("have.text", "Login")
        cy.get('[data-cy=email-headline]').should("exist")
            .should("have.text", "Email")
        cy.get('[data-cy=password-headline]').should("exist")
            .should("have.text", "Password")

        cy.get('[data-cy="error-email"]').should('exist')
        cy.get('[data-cy="error-password"]').should('exist')
        cy.get('[data-cy="submit"]').click()
    })
    it('should test email address and password type', () => {
        cy.visit('http://localhost:3000/login')
        cy.get('[data-cx="input-email"]').type("admin@gmail.com")
        cy.get('[data-cx="input-password"]').type("123456")
        cy.get('[data-cy="submit2"]').click()
        cy.url().should('contain', '/register')
    })
})