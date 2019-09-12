var searchInput = document.getElementById('cat-name')
searchInput.addEventListener('keyup', btnActivation )

function btnActivation(){
  document.getElementById("search-button").disabled = !searchInput.value.length;
}
