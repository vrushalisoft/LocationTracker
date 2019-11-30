var local = 'http://localhost:3000'
var online = 'https://laptopsoft.herokuapp.com'
var used_host = online
const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000
});

function notifyUser(type, message) {
  Toast.fire({
    type: type,
    title: message
  })
}