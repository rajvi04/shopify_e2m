// Area Calculator
var areaOpener = document.querySelector('.area-calculator__head--inner');
if (areaOpener) {
  areaOpener.addEventListener("click", function(){
    this.closest('.area-calculator').classList.toggle('active')
  });

  const areaUnitAdd = document.getElementById('add-area');
  const areaUnitTemplate = document.getElementById('area-field-template').innerHTML;
  const areaMain = document.querySelector('.area-calculator__main--inner');

  function refreshValue() {
    let sqm = 0;
    const containers = document.querySelectorAll('.area-item');
    for (var j = 0; j < containers.length; j++) {
      let container = containers[j];
      const inputs = container.querySelectorAll('input');
      let unit_sqm = 1;
      for (var i = 0; i < inputs.length; i++) {
        const unit = inputs[i].closest('.area-item__column').querySelector('select').value;
        if (unit == 'ft')
          unit_sqm = unit_sqm * (parseFloat(inputs[i].value) || 0) * 0.3048;
        else
          unit_sqm = unit_sqm * (parseFloat(inputs[i].value) || 0);
      }
      sqm += unit_sqm;
      console.log("sqm",sqm)
      container.querySelector('.area-unit__result-detail').innerHTML = unit_sqm.toFixed(2);
    }
  
    document.querySelector('.calculation-result__details').innerHTML = sqm.toFixed(2);
    calculateTotal();
    // if (sqm > 0 && document.querySelector('#m2-qty')) {
    //   document.querySelector('#m2-qty').value = sqm.toFixed(2);
    //   const event = new Event('keyup');
    //   document.querySelector('#m2-qty').dispatchEvent(event);
    //   const changeEvent = new Event('change');
    //   document.querySelector('#m2-qty').dispatchEvent(changeEvent);
    // }
  }

  function resetPositionTexts() {
    const areaItems = document.querySelectorAll('.area-calculator__main--inner .area-item');
    if (areaItems) {
      for (var i = 0; i < areaItems.length; i++) {
        let pos = i + 1;
        areaItems[i].querySelector('.area-label').innerHTML = 'Area ' + pos;
      }
    }
  }

  function initArea(container) {
    const trash = container.querySelector('.area-unit__remove');
    if (trash) {
      trash.addEventListener("click", function(){
        this.closest('.area-item').remove();
        refreshValue();
        resetPositionTexts();
      });
    }

    const inputs = container.querySelectorAll('input');
    for (var i = 0; i < inputs.length; i++) {
      inputs[i].addEventListener("keyup", function() {
        if (!isNaN(this.value) && parseFloat(this.value) < 0) {
          this.value = 0;
        }
        refreshValue()
      });
    }

    const selects = container.querySelectorAll('select');
    for (var i = 0; i < selects.length; i++) {
      selects[i].addEventListener("change", function() {
        const unit = this.value;
        let input = this.closest('.area-item__column').querySelector('input');
        let sibling = $(this).closest('.area-item').find('select').not(this)[0];
        if (unit == 'ft') {
          if (!isNaN(input.value)) input.value = (parseFloat(input.value) / 0.3048).toFixed(2);
          if (sibling.value == 'm') {
            let siblingInput = sibling.closest('.area-item__column').querySelector('input');
            sibling.value = 'ft';
            if (!isNaN(siblingInput.value)) siblingInput.value = (parseFloat(siblingInput.value) / 0.3048).toFixed(2);
          }
        } else {
          if (!isNaN(input.value)) input.value = (parseFloat(input.value) * 0.3048).toFixed(2);
          if (sibling.value == 'ft') {
            let siblingInput = sibling.closest('.area-item__column').querySelector('input');
            sibling.value = 'm';
            if (!isNaN(siblingInput.value)) siblingInput.value = (parseFloat(siblingInput.value) * 0.3048).toFixed(2);
          }
        }
        refreshValue();
      });
    }
  }

  areaUnitAdd.addEventListener("click", function(){
    $(areaMain).append(areaUnitTemplate);
    resetPositionTexts();
    initArea(areaMain.querySelector('.area-item:last-child'));
  });
  var event = new Event('click');
  areaUnitAdd.dispatchEvent(event);
}
