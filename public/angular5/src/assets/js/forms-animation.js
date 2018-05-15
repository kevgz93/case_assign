/*
 * This script animates the input forms and elevates the label of the inputs
*/

function onFocus(event) {
  if (event.target.value === "") {
    event.target.parentNode.classList.remove('empty-value');
  }
}
function onBlur(event) {
  if (event.target.value === "") {
    event.target.parentNode.classList.add('empty-value');
  }
}

$(document).ready(function(){
  var inputs = $(".form-group > input");
  var index;
  for(index = 0; index < inputs.length; ++index){
    if(inputs[index].value != ""){
      inputs[index].parentNode.classList.remove("empty-value");
    }
  }
});
