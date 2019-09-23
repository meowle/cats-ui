;(function() {
  var form = document.getElementById('sorting')

  form.querySelectorAll('select').forEach(element => {
    element.addEventListener('change', function() {
      form.submit()
    })
  })
})()