let attachedField = null
const autocompleteMenu = document.createElement('div')
const autocompleteList = document.createElement('ul')
autocompleteList.addEventListener('mousedown', e => {
  attachedField.value = e.target.textContent
  attachedField.previousElementSibling.value = e.target.dataset.id
})
autocompleteMenu.classList.add('autocomplete-menu')
autocompleteMenu.appendChild(autocompleteList)

autocompleteFields = document.querySelectorAll('[data-autocomplete]')
for (let i = 0; i < autocompleteFields.length; i++) {
  const autocompleteField = autocompleteFields[i];
  autocompleteField.addEventListener('blur', hideAutocomplete)
  autocompleteField.addEventListener('focus', showAutocomplete)
  autocompleteField.addEventListener('input', e => {
    e.target.previousElementSibling.value = ''
    showAutocomplete(e)
  })
}

function hideAutocomplete () {
  autocompleteMenu.remove()
  attachedField = null
}

function showAutocomplete (e) {
  hideAutocomplete()
  if (e.target.value.length < 2) {
    return
  }
  attachedField = e.target
  fillMenu(e.target.value, atData[e.target.dataset.autocomplete])
  e.target.parentElement.appendChild(autocompleteMenu)
}

function fillMenu (text, list) {
  const listelems = list.search(text).slice(0, 8).map(result => `<li data-id="${result.item.id}">${result.item.name}</li>`).join('')
  autocompleteList.innerHTML = listelems
}