 describe('editAnimalTest', () => {
   it('Edita correctamente un animal', () => {
    // Interceptar las peticiones relevantes para sincronizar el test
    cy.intercept('PUT', '**/api/Animal/update*').as('updateAnimal')
    cy.intercept('GET', '**/api/Animal/getall').as('getAll')

    cy.visit('https://tp8-front-qa.onrender.com') // URL del front

    // Haz clic en el botón de editar (primera fila)
    cy.get('tr:nth-child(1) td:nth-child(4) a i.fa').click();

    // Asegúrate de que el campo de texto esté visible y habilitado,
    // luego lo limpiamos y escribimos el nuevo nombre
    cy.get('.form-control')
      .should('be.visible')
      .should('not.be.disabled')
      .clear()
      .type('Animal Modified')

    // Envía el formulario
    cy.get('.btn').click();

    // Espera a que la actualización y la recarga de lista terminen
    cy.wait('@updateAnimal')
    cy.wait('@getAll')

    // Verificación más robusta: usa contain.text sobre la celda de nombre
    cy.get('table tbody tr').first().find('td').eq(1).should('contain.text', 'Animal Modified')
   });
 });
