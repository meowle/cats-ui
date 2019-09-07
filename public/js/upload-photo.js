function UploadPhoto() {
  this.element = document.querySelector('#upload-photo')
  this.form = this.element.closest('form')
  this.addHandler()
}

UploadPhoto.prototype.addHandler = function() {
  this.element.addEventListener('change', this.handlerChange)
}

UploadPhoto.prototype.handlerChange = function() {
  this.form.submit()
}

var uploadPhoto = new UploadPhoto()