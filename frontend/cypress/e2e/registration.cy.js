describe('registration screen', () => {
    it('should test all the placeholders and button', () => {
        cy.visit('http://localhost:3000/register')
        cy.get('[data-cy="register-title"]').should('exist')
            .should('have.text', "Register")
        cy.get('[data-cy="name-headline"]').should('exist')
            .should('have.text', "Name")

        cy.get('[data-cy="error-name').should('exist')
        cy.get('[data-cy="error-email"]').should('exist')
        cy.get('[data-cy="error-password"]').should('exist')
        cy.get('[data-cy="error-confirm_password"]').should('exist')
        cy.get('[data-cy="submit"]').click()
    })
    it('placeholders should contain a type', () => {
        cy.visit('http://localhost:3000/register')
        cy.get('[data-cx="input-name"]').type("Satoshi")
        cy.get('[data-cx="input-email"]').type("smitsumori@hotmail.com")
        cy.get('[data-cx="input-password"]').type("123456")
        cy.get('[data-cx="input-confirm_password"]').type("123456")
        cy.get('[data-cy="submit2"]').click()
        cy.url().should('contain', '/login')
    })
})