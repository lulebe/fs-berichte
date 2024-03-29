let attachedField = null
const autocompleteMenu = document.createElement('div')
const autocompleteList = document.createElement('ul')
autocompleteList.addEventListener('mousedown', e => {
  attachedField.value = e.target.textContent
  //fill hidden field
  attachedField.previousElementSibling.value = e.target.dataset.id
  attachedField.blur()
  resetAutocomplete()
})
autocompleteMenu.classList.add('autocomplete-menu')
autocompleteMenu.appendChild(autocompleteList)

autocompleteFields = document.querySelectorAll('[data-autocomplete]')
for (let i = 0; i < autocompleteFields.length; i++) {
  const autocompleteField = autocompleteFields[i];
  autocompleteField.addEventListener('blur', () => hideAutocomplete(e))
  autocompleteField.addEventListener('focus', showAutocomplete)
  autocompleteField.addEventListener('input', e => {
    //clear hidden field
    e.target.previousElementSibling.value = ''
    showAutocomplete(e)
  })
}

function hideAutocomplete (e) {
  resetAutocomplete()
}

function resetAutocomplete () {
  autocompleteMenu.remove()
  attachedField = null
}

function showAutocomplete (e) {
  resetAutocomplete()
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