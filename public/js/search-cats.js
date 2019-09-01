;(function() {
  const gendersList = ['female', 'male', 'unisex']
  for (let i = 0; i < gendersList.length; i++) {
    const gendersInput = document.getElementsByName(gendersList[i])[0]
    gendersInput.addEventListener('change', submitForm)
    console.log(gendersInput)
  }
  function submitForm() {
    document.getElementsByClassName('cats-search')[0].submit()
  }
})()
