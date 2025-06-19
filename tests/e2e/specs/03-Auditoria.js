describe('Menú Seguridad', () => {
    before(() => {
        sessionStorage.removeItem("usuarioLoggeado")
        sessionStorage.removeItem("usuarioNombre")
        cy.visit('/')
        cy.contains('Inicio de sesión')
        cy.TipearLogin('Fer', 'Fer')
        cy.get('[data-cy=IconoSesionIniciada]')
    })

    it('Debe mostrar Auditoría y navegar correctamente', () => {
        cy.contains('SEGURIDAD').click()
        cy.contains('Auditoría').should('exist')
        cy.contains('Auditoría').click()
        cy.url().should('include', '/Auditoria')
    })
})

