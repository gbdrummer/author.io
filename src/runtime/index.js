document.body.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', evt => {
    evt.preventDefault()

    document.querySelector(anchor.getAttribute('href'))?.scrollIntoView({
      behavior: 'smooth'
    })
  })
})

document.querySelectorAll('.current_year').forEach(span => {
  span.innerHTML = new Date().getFullYear()
})