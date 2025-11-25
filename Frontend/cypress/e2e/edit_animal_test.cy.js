describe('editAnimalTest', () => {
  it('Edita correctamente un animal', () => {
    // Interceptar las peticiones relevantes para sincronizar el test
    // Match update endpoint regardless of HTTP verb to be more robust
    cy.intercept('**/api/Animal/update*').as('updateAnimal')
    cy.intercept('GET', '**/api/Animal/getall').as('getAll')

    // Visitar y esperar a que la lista se cargue
    cy.visit('https://tp8-front-qa.onrender.com') // URL del front
    cy.wait('@getAll')

    // Asegurarse de que hay al menos una fila en la tabla
    cy.get('table tbody tr').should('have.length.gte', 1)

    // Haz clic en el icono de editar dentro de la primera fila (selector más tolerante)
    cy.get('table tbody tr').first().within(() => {
      cy.get('i.fa').first().click()
    })

    // Asegúrate de que el campo de texto esté visible y habilitado,
    // luego lo limpiamos y escribimos el nuevo nombre
    cy.get('.form-control')
      .should('be.visible')
      .should('not.be.disabled')
      .clear()
      .type('Animal Modified')

    // Envía el formulario
    cy.get('.btn').click()

    // Espera a que la recarga de la lista termine. Evitamos depender exclusivamente
    // de la petición `updateAnimal` (algunas implementaciones pueden usar otro verb).
    // Aumentamos el timeout para entornos que tardan más en procesar.
    cy.wait('@getAll', { timeout: 20000 })

    // Verificación más robusta: usa contain.text sobre la celda de nombre
    cy.get('table tbody tr').first().find('td').eq(1).should('contain.text', 'Animal Modified')
  })
})
