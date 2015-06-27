export default function log(environment) {
  switch (environment) {
  case 'debug':
    window.log = function() {
      console.log.apply(console, arguments)
    }
  case 'release':
  default:
    window.log = function() {}
  }
}

