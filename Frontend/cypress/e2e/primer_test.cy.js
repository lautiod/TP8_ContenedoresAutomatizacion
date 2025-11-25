   describe('Mi primera prueba', () => {
   it('Carga correctamente la página de ejemplo', () => {
     cy.visit('https://tp8-front-qa.onrender.com') // Colocar la url local o de Azure de nuestro front
     cy.get('h1').should('contain', 'Farm Animals Management') // Verifica que el título contenga "EmployeeCrudAngular"
     /* ==== Generated with Cypress Studio ==== */
     cy.get('button.float-right').click();
     cy.get('[name="name"]').click();
     cy.get('[name="name"]').type('Pollo Luis');
     cy.get('button.btn').click();
     /* ==== End Cypress Studio ==== */
   })
 })