describe('Create Animal Test', () => {
  it('Creates a new animal successfully', () => {
    // Interceptar las peticiones relevantes
    cy.intercept('POST', '**/api/Animal/create').as('createAnimal')
    cy.intercept('GET', '**/api/Animal/getall').as('getAll')
    
    // Visitar la aplicación
    cy.visit('https://tp8-front-qa.onrender.com')
    cy.wait('@getAll', { timeout: 10000 })
    
    // Verificar que el título es correcto
    cy.get('h1').should('contain', 'Farm Animals Management')
    
    // Hacer clic en el botón de añadir
    cy.get('button.float-right', { timeout: 10000 }).should('be.visible').click()
    
    // Llenar el formulario
    cy.get('input[name="name"]', { timeout: 10000 }).should('be.visible').type('Pollo Luis')
    
    // Enviar el formulario
    cy.get('button[type="submit"]').should('contain', 'Create').click()
    
    // Esperar a que se complete la creación y recargue la lista
    cy.wait('@createAnimal', { timeout: 10000 })
    cy.wait('@getAll', { timeout: 10000 })
    
    // Verificar que el animal aparece en la tabla
    cy.contains('table tbody tr', 'Pollo Luis', { timeout: 10000 })
      .should('be.visible')
  })
})