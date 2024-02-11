class ListPicker {
  constructor (suggestions, ul, input, usedCallback, pickedCallback) {
    this.detached = false
    this.suggestions = suggestions
    this.ul = ul
    this.input = input
    this.usedCallback = usedCallback
    this.pickedCallback = pickedCallback
    this.inputListener = () => this.showAutocomplete()
    this.listListener = e => this.clickedItem(e)
    this.input.addEventListener('input', this.inputListener)
    this.ul.addEventListener('click', this.listListener)
  }
  detach () {
    this.input.removeEventListener('input', this.inputListener)
    this.ul.removeEventListener('click', this.listListener)
    this.ul.innerHTML = ''
    this.input.value = ''
  }
  showAutocomplete () {
    if (this.input.value.length < 2)
      this.ul.innerHTML = ''
    else
      this.fillList(this.input.value)
  }
  fillList (text) {
    const listelems = this.suggestions.search(text).slice(0, 8).map(result => `<li tabindex="0" data-id="${result.item.id}" data-name="${result.item.name}">${result.item.name}</li>`).join('')
    this.ul.innerHTML = listelems
    this.usedCallback()
  }
  clickedItem (event) {
    this.pickedCallback(event.target.dataset.id, event.target.dataset.name)
    this.detach()
  }
}



class ModalHandler {
  constructor (modalElement, suggestions, insertCallback) {
    this.modal = modalElement
    this.suggestions = suggestions
    this.insertCallback = insertCallback
    this.picker = null
    this.notFoundLink = this.modal.querySelector('.notFoundLink')
    this.page1Input = this.modal.querySelector('.modalPage1Input')
    this.page2Inputs = [...this.modal.querySelectorAll('.modalPage2Input')]
    this.modalCloseListener = e => this.closeModal()
    this.confirmNewListener = e => this.confirmNew()
    this.notFoundListener = e => {e.preventDefault();this.notFoundClicked()}
    this.page2InputListener = e => this.page2Validate()
    this.init()
  }

  init () {
    this.modal.addEventListener('click', this.modalCloseListener)
    this.modal.querySelector('.modalCancelBtn').addEventListener('click', this.modalCloseListener)
    this.modal.querySelector('.confirmNewBtn').addEventListener('click', this.confirmNewListener)
    this.notFoundLink.addEventListener('click', this.notFoundListener)
    this.page2Inputs.forEach(input => input.addEventListener('input', this.page2InputListener))
    this.modal.classList.add('visible')
    this.picker = new ListPicker(
      this.suggestions,
      this.modal.querySelector('.suggestionsList'),
      this.page1Input,
      () => {
        this.notFoundLink.classList.add('visible')
      },
      (id, name) => this.insert(id, name))
  }

  closeModal () {
    this.modal.classList.remove('visible', 'onPage2')
    this.modal.querySelector('.confirmNewBtn').classList.remove('visible')
    this.resetPage1()
    this.modal.removeEventListener('click', this.modalCloseListener)
    this.modal.querySelector('.modalCancelBtn').removeEventListener('click', this.modalCloseListener)
    this.modal.querySelector('.confirmNewBtn').removeEventListener('click', this.confirmNewListener)
    this.notFoundLink.removeEventListener('click', this.notFoundListener)
    this.page2Inputs.forEach(input => input.removeEventListener('input', this.page2InputListener))
    this.page2Inputs.forEach(input => input.value = '')
    this.modal = null
  }
  resetPage1 () {
    this.modal.querySelector('.notFoundLink').classList.remove('visible')
    this.picker && this.picker.detach()
    this.picker = null
  }

  notFoundClicked () {
    if (this.page2Inputs.length > 1 && this.page1Input.value.split(' ').length > 1) {
      const parts = this.page1Input.value.split(' ')
      this.page2Inputs.slice(-2)[0].value = parts.shift()
      this.page2Inputs.slice(-1)[0].value = parts.join(' ')
    } else
      this.page2Inputs.slice(-1)[0].value = this.page1Input.value
    this.resetPage1()
    this.modal.classList.add('onPage2')
    this.page2Validate()
  }

  page2Validate () {
    if (this.page2Inputs.every(input => input.value.length >= 2))
      this.modal.querySelector('.confirmNewBtn').classList.add('visible')
    else
      this.modal.querySelector('.confirmNewBtn').classList.remove('visible')
  }

  confirmNew () {
    this.insert('', this.page2Inputs.map(input => input.value).join(' '))
  }

  insert(id, name) {
    this.insertCallback(id, name)
    this.closeModal()
  }

}