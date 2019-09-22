const MAX = 60

const canStart = new Promise((resolve, reject) => {
  const intv = setInterval(() => {
    console.log('checking start')
    chrome.storage.sync.get('start', function(data) {
      console.log('data: ', data)
      if (data.start) {
        resolve()
        chrome.storage.sync.set({ start: false }, function(data) {
          console.log('false...')
        })
        clearInterval(intv)
      }
    })
  }, 2000)
})
const nextPage = () => {
  const container = document.querySelector('html')
  const cardHeight = document.querySelector('.recommend-card-list').offsetHeight
  console.log('container: ', container)
  console.log('cardHeight: ', cardHeight)
  container.scrollTop = cardHeight
  console.log('scarecrow0000')
  return new Promise(resolve => {
    setTimeout(() => {
      resolve()
    }, 2000)
  })
}
canStart.then(() => {
  console.log('canstart')
  let cl = document.querySelector('.recommend-card-list')
  console.log('cl.childElementCount: ', cl.childElementCount)
  nextPage().then(() => {
    console.log('nextPage')
  })
})
