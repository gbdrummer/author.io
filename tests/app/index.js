import { attach, html } from 'aui'

attach(document.body, html`<button id="button">Click Me</button>`({
  on: {
    click: () => console.log('Clicked')
  }
}))