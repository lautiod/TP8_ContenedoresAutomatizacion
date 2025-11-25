describe('editAnimalTest', () => {
  it('Edita correctamente un animal', () => {
    // Interceptar las peticiones relevantes para sincronizar el test
    cy.intercept('POST', '**/api/Animal/create').as('createAnimal')
    cy.intercept('PUT', '**/api/Animal/update*').as('updateAnimal')
    cy.intercept('GET', '**/api/Animal/getall').as('getAll')
    cy.intercept('GET', '**/api/Animal/*').as('getAnimalById')

    // Visitar la aplicación
    cy.visit('https://tp8-front-qa.onrender.com') // URL del front
    cy.wait('@getAll', { timeout: 10000 })

    // Crear un animal primero para asegurar que hay datos para editar
    cy.get('button.float-right', { timeout: 10000 }).should('be.visible').click()
    cy.get('input[name="name"]', { timeout: 10000 }).should('be.visible').clear().type('Animal Test Cypress')
    cy.get('button[type="submit"]').should('contain', 'Create').click()
    cy.wait('@createAnimal', { timeout: 10000 })
    cy.wait('@getAll', { timeout: 10000 })

    // Asegurarse de que la tabla está visible y tiene al menos una fila
    cy.get('table tbody tr', { timeout: 10000 }).should('be.visible').should('have.length.gte', 1)

    // Haz clic en el icono de editar dentro de la primera fila
    cy.get('table tbody tr', { timeout: 10000 }).first().within(() => {
      cy.get('i.fa-edit', { timeout: 5000 }).should('be.visible').click()
    })

    // Esperar a que cargue el animal en el formulario de edición
    cy.wait('@getAnimalById', { timeout: 10000 })

    // Asegurarse de que estamos en el modo edición verificando el texto del botón
    cy.get('button[type="submit"]', { timeout: 10000 }).should('contain', 'Edit')

    // Modificar el nombre del animal
    cy.get('input[name="name"]', { timeout: 10000 })
      .should('be.visible')
      .should('not.be.disabled')
      .should('have.value', 'Animal Test Cypress') // Verificar que se cargó correctamente
      .clear()
      .type('Animal Modified Cypress')

    // Envía el formulario de edición
    cy.get('button[type="submit"]').should('contain', 'Edit').click()

    // Espera la actualización y recarga
    cy.wait('@updateAnimal', { timeout: 10000 })
    cy.wait('@getAll', { timeout: 20000 })

    // Verificación: el animal debe estar actualizado
    cy.get('table tbody tr', { timeout: 10000 }).first().find('td').eq(1).should('contain.text', 'Animal Modified Cypress')
  })
})
