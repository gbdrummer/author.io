import { attach, html, include, State } from 'aui'

const { bind, proxy } = new State({
  slide: 1
})

const hero = document.getElementById('hero')

attach(hero.querySelector('.slides'), html`
  ${bind('slide', id => {
    // return html`${id}`

    return html`${include(`./slides/${id}.js`)}`
  })}
`)

setTimeout(() => {
  proxy.slide = 2
}, 1500)

attach(hero.querySelector('nav'), html`
  NAV
`)