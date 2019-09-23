const MAX = 60
console.log('scarecrow')
const canStart = new Promise((resolve, reject) => {
  const intv = setInterval(() => {
    console.log('checking start')
    chrome.storage.sync.get('start', function(data) {
      console.log('data: ', data)
      if (data.start) {
        chrome.storage.sync.set({ start: false }, function(data) {
          console.log('false...: ', data)
        })
        resolve()
        clearInterval(intv)
      }
    })
  }, 2000)
})
// const nextPage = () => {
//   const container = document.querySelector('html')
//   const cardHeight = document.querySelector('.recommend-card-list').offsetHeight
//   console.log('container: ', container)
//   console.log('cardHeight: ', cardHeight)
//   container.scrollTop = cardHeight
//   console.log('scarecrow0000')
//   return new Promise(resolve => {
//     setTimeout(() => {
//       resolve()
//     }, 2000)
//   })
// }
// canStart.then(() => {
//   console.log('canstart')
//   let cl = document.querySelector('.recommend-card-list')
//   console.log('cl.childElementCount: ', cl.childElementCount)
//   nextPage().then(() => {
//     console.log('nextPage')
//   })
// })
const xhr = new XMLHttpRequest()
// 分页获取牛人列表
const getData = (page = 1) => {
  xhr.open(
    'GET',
    `https://www.zhipin.com/wapi/zpboss/h5/boss/recommendGeekList?jobid=6a05d269f98c98540nF82du9FVU~&status=0&refresh=1569203836533&source=1&switchJobFrequency=-1&salary=406&age=16,-1&school=-1&degree=203,204,205&experience=106&intention=701,704,703&jobId=6a05d269f98c98540nF82du9FVU~&page=${page}&_=1569203836848`,
    true
  )
  xhr.send()
  return new Promise((resolve, reject) => {
    xhr.onreadystatechange = function() {
      if (xhr.readyState == 4 && xhr.status == 200) {
        resolve(JSON.parse(xhr.responseText).zpData.geekList)
      }
    }
  })
}
const sayHi = options => {
  const data = new FormData()
  xhr.open(
    'POST',
    `https://www.zhipin.com/wapi/zpboss/h5/chat/start?_=${+new Date()}`,
    true
  )
  const keys = Object.keys(options)
  keys.forEach(key => {
    data.append(key, options[key])
  })
  xhr.send(data)
}
canStart.then(() => {
  let count = 0
  for (let i = 1; i <= 11; i++) {
    setTimeout(() => {
      getData(i).then(geekList => {
        if (!Array.isArray(geekList)) return
        geekList.filter(geek => {
          const {
            geekCard,
            showEdus,
            showWorks,
            talkTimeDesc,
            haveChatted
          } = geek
          const {
            geekDegree,
            geekWorkYear,
            ageDesc,
            salary,
            applyStatusDesc,
            encryptGeekId,
            expectId,
            lid,
            geekName
          } = geekCard
          console.log(
            geekName,
            geekDegree,
            geekWorkYear,
            ageDesc,
            salary,
            applyStatusDesc,
            showEdus[showEdus.length - 1].school,
            showWorks[0].company
          )
          if (
            talkTimeDesc ||
            haveChatted ||
            !ageDesc ||
            applyStatusDesc === '在职-暂不考虑' ||
            parseInt(geekWorkYear) < 5 ||
            parseInt(ageDesc) < 28 ||
            parseInt(ageDesc) > 32 ||
            parseInt(salary) < 30
          ) {
            return false
          }
          console.warn(
            geekName,
            geekDegree,
            geekWorkYear,
            ageDesc,
            salary,
            applyStatusDesc,
            showEdus[showEdus.length - 1].school,
            showWorks[0].company
          )
          setTimeout(() => {
            sayHi({
              gid: encryptGeekId,
              suid: '',
              jid: '6a05d269f98c98540nF82du9FVU~',
              expectId,
              lid,
              from: ''
            })
          }, count++ * 1000)
        })
      })
    }, i * 1000)
  }
})
