;(function() {
  var element = document.querySelector('#upload-photo')
  var form = element.closest('form')

  element.addEventListener('change', function() {
    form.submit()
  })
})()