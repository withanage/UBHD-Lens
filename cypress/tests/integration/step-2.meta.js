context('Metadata',
    () => {
        beforeEach(() => {
            cy.visit('http://localhost:4001/?url=data/example.xml')
        })
        it('query metadata elements', () => {
            cy.get('div.content-node.cover > div.content').contains('Title')
                .should('have.class', 'title').scrollIntoView()
                .should('be.visible')


        })
    })