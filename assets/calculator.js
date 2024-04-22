var mainProduct = $('.main-product');
if (mainProduct.attr('data-calculator') === 'true') {
var totalSize;
calculatePrice();
calculateTotal();
wastageCalculate();
function calculatePrice() {
  var checkedSizeInput = document.querySelector('input[name="Size"]:checked');
  if (!checkedSizeInput) return;
  var checkedValue = checkedSizeInput.value;
  var selectedOption = $('.ProductForm__Option option[data-title*="' + checkedValue + '"]');
  var originalPrice = parseFloat(selectedOption.data('price')) || 0;
  
  var titleValue = selectedOption.data('val') || '';
  var [width, height] = titleValue.split(' X ').map(val => parseFloat(val) || 0);
  var totalTiles = $('variant-radios').data('tiles');
  
  if (width !== 0 && height !== 0 && totalTiles !== 0) {
    totalSize = width * height * totalTiles;
    updateM2Price(originalPrice);
  }
}

function updateM2Price(originalPrice) {
  var m2Price = ((originalPrice / totalSize) * 10000).toFixed(2);
  $('.m2-price').text(Shopify.formatMoney(m2Price, "€{{amount}}"));
  var orderM2Price = (parseFloat($('.unit-price-container .unit-price').text().replace('€', '')) / parseFloat($('.m2-price').text().replace('€', '')));
  $('#m2-qty').val(orderM2Price.toFixed(2));
}

function calculateTotal() {
 
  $('#unit-qty').on('input', function() {
  var unitQty = Math.ceil(parseFloat($('#unit-qty').val())) || 1;
  document.getElementById('unit-qty').value = unitQty;
  var unitPrice = parseFloat($('#m2-qty').val());
  var orderM2 = (parseFloat($('.unit-price-container .unit-price').text().replace('€', '')) / parseFloat($('.m2-price').text().replace('€', '')));
 
  var totalM2 = unitQty * orderM2;
    if ($('#m2-qty').val() !== totalM2.toFixed(2)) {
    $('#m2-qty').val(totalM2.toFixed(2));
    }
    wastageCalculate();
  });
  
  $('#m2-qty').on('input', function() {
    CalculationResult = $('#m2-qty').val();
    var OrderByBox = Math.ceil((CalculationResult * 10000) / totalSize);
    $('#unit-qty').val(OrderByBox);
    $('#unit-qty').text(OrderByBox);
    wastageCalculate();
  });

  var CalculationResult = $('.calculation-result__details').text();

  if (CalculationResult != 0) {
    var OrderByBox = Math.ceil((CalculationResult * 10000) / totalSize);
    console.log("OrderByBox", OrderByBox, CalculationResult);
    $('#unit-qty').val(OrderByBox).text(OrderByBox);
    if ($('#m2-qty').val() !== CalculationResult) {
      $('#m2-qty').val(CalculationResult);
    }
    wastageCalculate();
  }
 wastageCalculate();
}

function wastageCalculate() {

  var originalPrice = parseFloat($('.price__container .price-item--regular').text().replace('€', ''));
  var m2_qty = $('#unit-qty').val();
  var unitPrice = parseFloat($('.unit-price-container .unit-price').text().replace('€', ''));
  var totalSpan = $('#wastage_total span');
  var wastageCheckbox = $('#wastage');
  var sqmTotal = $('#sqm_total');
  
  function updateTotalValue() {
    totalValue = unitPrice * m2_qty;
    if (wastageCheckbox.prop('checked')) {
      totalValue = totalValue + unitPrice;
      var wastage = totalValue * 0.1;
      sqmTotal.removeClass('hide').show();
      $('#sqm_total span').text((totalValue / originalPrice).toFixed(2));
      updateQuantityInput(totalValue);
    } else {
      sqmTotal.addClass('hide').hide();
      totalValue = unitPrice * m2_qty;
      updateQuantityInput(totalValue);
    }
    totalSpan.text(Shopify.formatMoney(totalValue.toFixed(2), "€{{amount}}"));
     
  }

  updateTotalValue();
  wastageCheckbox.change(updateTotalValue);
}


$(document).on('click', '.full-tile-sample', function (e) {
  e.preventDefault();
  var getCurrentVariant = $('input[name="Size"]:checked').attr('value');
  var optionText = "Full Size Sample";

  var dataVal = $('variant-radios select[name="id"] option').filter(function () {
    return $(this).data('val') === optionText;
  }).attr('value');

  var id = dataVal;
  var obj = {
    id: id,
    quantity: 1,
    "properties": {
      "Full size sample": getCurrentVariant,
    }
  };
  addToCart(obj);
});

function addToCart(obj) {
  $.ajax({
    url: '/cart/add.js',
    type: 'POST',
    data: obj,
    dataType: 'json',
    success: function (data) {


      //   this.cart = document.querySelector('cart-notification') || document.querySelector('cart-drawer');
      // console.log("cartDrawer",data,this.cart)
      //   this.cart.renderContents(data);
     refreshCartDrawer();
     setTimeout(function(){
      
        $('#cart-icon-bubble')[0].click();
      },1000)
    },
    error: function (err) {
      console.log('error', err);
    }
  });
}
 

function refreshCartDrawer() {
  $.ajax({
    url: '/cart.js',
    type: 'GET',
    dataType: 'json',
    success: function (cart) {
     
      $('.cart-count-bubble span').html(cart.item_count);
    },
    error: function (err) {
      console.log('error', err);
    }
  });
}



function updateQty() {
  if (!$('.cart-drawer').hasClass('active')) {
    updateQuantityInput();
  }
}
setInterval(updateQty, 1000);
$('#unit-qty').on('input', function() {
  if (!$('.cart-drawer').hasClass('active')) {
    updateQuantityInput();
  }
});

function updateQuantityInput() {
  var OrderBox = $('#unit-qty').val();
  var wastageCheckbox = $('#wastage');
  $('quantity-input input[name="quantity"]').val(wastageCheckbox.prop('checked') ? parseInt(OrderBox) + 1 : OrderBox);
}
}