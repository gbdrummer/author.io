document.body.querySelectorAll('main > header > nav a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', evt => {
    evt.preventDefault()

    document.querySelector(anchor.getAttribute('href'))?.scrollIntoView({
      behavior: 'smooth'
    })
  })
})