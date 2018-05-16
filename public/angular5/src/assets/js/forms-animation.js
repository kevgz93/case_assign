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

// Function to get the value of the selected value from a dropdown
function changeDropdownValue(element){
  var siblings = $(element).parent().parent().siblings();
  var input = siblings[0];
  $(input).val($(element).text());
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
