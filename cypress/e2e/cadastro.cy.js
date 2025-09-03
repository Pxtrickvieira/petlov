import donationPoint from '../fixtures/donationPoint.json'

describe('Formulário de Ponto de Doação', () => {

  beforeEach(() => {
    cy.visit('/signup')
    cy.contains('h1', 'Cadastro de ponto de doação').should('be.visible')
  })

  it('Deve cadastrar um ponto de doação', () => {
    cy.intercept('GET', `https://viacep.com.br/ws/${donationPoint.address.zipCode}/json/`, {
      statusCode: 200,
      body: {
        cep: donationPoint.address.zipCode,
        logradouro: donationPoint.address.street,
        complemento: donationPoint.address.additionalInfo,
        bairro: donationPoint.address.district,
        localidade: donationPoint.address.city,
        uf: donationPoint.address.state,
      }
    }).as('getCep');

    cy.fillDonationForm(donationPoint)
    cy.verifyDisabledFields(donationPoint.address)

    cy.get('button[type="submit"]').click()
    cy.wait('@getCep')

    cy.contains('Você fez a diferençaw!').should('be.visible')
  })

  context('Campos Obrigatórios', () => {
    it('Não deve cadastrar quando o nome não é informado', () => {
      const invalidDonationPoint = { ...donationPoint, name: '' }
      cy.fillDonationForm(invalidDonationPoint)
      cy.get('button[type="submit"]').click()
      cy.get('.alert-error').should('be.visible').and('have.text', 'Informe o seu nome completo')
    })

    it('Não deve cadastrar quando o email não é informado', () => {
      const invalidDonationPoint = { ...donationPoint, email: '' }
      cy.fillDonationForm(invalidDonationPoint)
      cy.get('button[type="submit"]').click()
      cy.get('.alert-error').should('be.visible').and('have.text', 'Informe o seu melhor email')
    })

    it('Não deve cadastrar quando o CEP não é informado', () => {
      const invalidDonationPoint = { ...donationPoint, address: { ...donationPoint.address, zipCode: '' } }
      cy.fillDonationForm(invalidDonationPoint)
      cy.get('button[type="submit"]').click()
      cy.get('.alert-error').should('be.visible').and('have.text', 'Informe o seu CEP')
    })

    it('Não deve cadastrar quando o número é menor ou igual a zero', () => {
      const invalidDonationPoint = { ...donationPoint, address: { ...donationPoint.address, number: 0 } }
      cy.fillDonationForm(invalidDonationPoint)
      cy.get('button[type="submit"]').click()
      cy.get('.alert-error').should('be.visible').and('have.text', 'Informe um número maior que zero')
    })
  })
})
