let changeColor = document.getElementById('changeColor')
chrome.storage.sync.get('color', function(data) {
  changeColor.style.backgroundColor = data.color
  changeColor.setAttribute('value', data.color)
})

changeColor.addEventListener('click', () => {
  chrome.storage.sync.set({ start: true }, function(data) {
    console.log('start...')
  })
})
