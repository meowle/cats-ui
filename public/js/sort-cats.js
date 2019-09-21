;(function () {
  var form = document.getElementById('sorting');

  form.querySelector('select').addEventListener('change', function() {
    form.submit();
  });
})();