import Tood from './tood'

let url = 'ws://' + window.location.host + '/websocket'
let element = document.getElementById('application')

document.Application = new Tood(url, element)
