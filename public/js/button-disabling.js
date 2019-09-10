var searchInput = document.getElementById('cat-name')
searchInput.addEventListener('keyup', btnActivation )

function btnActivation(){

    if(!document.getElementById('cat-name').value.length){
      document.getElementById("search-button").disabled = true;
    }else{
      document.getElementById("search-button").disabled = false;

    }
  }
