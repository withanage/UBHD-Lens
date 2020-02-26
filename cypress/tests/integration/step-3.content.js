context('Content',
    () => {
        beforeEach(() => {
            cy.visit('http://localhost:4001/?url=data/example.xml')
        })
        it('query content elements', () => {
            cy.get('[data-id="sec_meta_2"]').should('have.class', 'sec-meta').scrollIntoView()
                .should('be.visible')
        })
    })