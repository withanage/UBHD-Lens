
describe('Open Lens reader', function() {
    it('Check Loading', function() {
        cy.visit('http://localhost:4001/?url=data/example.xml')
       
        cy.get('div.menu-bar').contains('Contents').should('have.class','active')
        cy.get('div.menu-bar').contains('References').should('have.class','citations').click().should('have.class','active')
        cy.get('div.menu-bar').contains('Media').should('have.class','figures').click().should('have.class','active')
        cy.get('div.menu-bar').contains('Footnotes').should('have.class','footnotes').click().should('have.class','active')
    })
})