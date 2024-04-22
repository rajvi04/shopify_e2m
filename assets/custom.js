document.addEventListener("DOMContentLoaded", (event) => {

  /* This filter callback function will be called whenever filters are updated. */
  window.filterUpdatedEvent = function(){
    window.customCheckboxEvent();
    window.loadMoreProducts._init()
  }
  
  window.customCheckboxEvent = function(){
    // if(document.querySelectorAll(".custom-checkbox").length > 0){
    //   document.querySelectorAll(".custom-checkbox").forEach(el =>{
    //     if(typeof window.location.href.split("?")[1] !== "undefined"){
    //       el.closest("li").querySelector("a").href = el.closest("li").querySelector("a").href.split("?")[0] + "?" + window.location.href.split("?")[1];
    //     }
    //     el.addEventListener("change", function(e){
    //       e.preventDefault();
    //       window.location.href = e.currentTarget.closest('li').querySelector("a").href;
    //     }, true)
    //   })
    //   if((document.querySelectorAll("#FacetsWrapperDesktop > .active-facets-desktop > facet-remove").length == 0 && parseInt(document.querySelector("#FacetsWrapperDesktop > .active-facets-desktop > div facet-remove").dataset.active_tags) == 0) || (parseInt(document.querySelector(".facets-container .active-facets-mobile").dataset.mobile_active_tags) == 0 && document.querySelectorAll(".facets-container .active-facets-mobile facet-remove").length < 2)){
    //     document.querySelector("#FacetsWrapperDesktop > .active-facets-desktop > div facet-remove").classList.add("visually-hidden");
    //     document.querySelector(".facets-container .active-facets-mobile").classList.add("visually-hidden");
    //   }
    //   else{
    //     document.querySelector("#FacetsWrapperDesktop > .active-facets-desktop > div facet-remove").classList.remove("visually-hidden");
    //     document.querySelector(".facets-container .active-facets-mobile").classList.remove("visually-hidden");
    //   }
  
    //   document.querySelectorAll(".mobile-facets__main details").forEach(el=>{
    //     if(el.querySelectorAll("div.mobile-facets__submenu ul li.active").length > 0){
    //       el.querySelector("summary div span").innerHTML = el.querySelector("summary div span").innerHTML + "<span> (" + el.querySelectorAll("div.mobile-facets__submenu ul li.active").length + " selected)</span>";
    //     }
    //   })
    // }
  }
  window.customCheckboxEvent();
  
  document.querySelectorAll("#FacetsWrapperDesktop details").forEach(el => {
    let clickParent = false;
    el.querySelectorAll("div.parent-display ul li").forEach(ele => {
      if(ele.querySelector("input").checked){
        clickParent = true;
      }
    })
    if(clickParent){
      el.querySelector("summary").setAttribute("aria-expanded","true");
      el.setAttribute("open","");
    }
  })

  /* Load more -- Start */
  if(document.querySelectorAll(".load-more-wrapper .load-more").length > 0){
    eventSelectors  = {
      _loadMoreButton : document.querySelector(".load-more-wrapper .load-more"),      
      _currentPage: 1
    }
    window.loadMoreProducts = {
      _init : function(){
        this._eventBinder();
        this._resetValuesOnFilterChange();
      },
      _eventBinder : function() {
        eventSelectors._loadMoreButton = document.querySelector(".load-more-wrapper .load-more");
        eventSelectors._loadMoreButton.addEventListener('click', this._handleLoadMore.bind(this), true );
      },
      _updatePageQueryParam: function (url, newPage) {
        const urlObj = new URL(url);
        urlObj.searchParams.set('page', newPage);
        return urlObj.toString();
      },
      _handleLoadMore : function(event){
        event.preventDefault();
        if(document.querySelectorAll(".pagination-wrapper").length > 0){
          eventSelectors._totalPages = parseInt(document.querySelector(".pagination-wrapper").dataset.total_pages)
          if(eventSelectors._currentPage <= eventSelectors._totalPages){
            eventSelectors._currentPage = eventSelectors._currentPage + 1;
            fetchUrl = this._updatePageQueryParam(window.location.href, eventSelectors._currentPage);
            this._fetchAndAppendProductGrids(fetchUrl);
            this._showHideLoadMoreButton()
          }
        }
      },
      _fetchAndAppendProductGrids: function(fetchUrl){
        fetch(fetchUrl)
        .then(response => response.text())
        .then(html => {
          const tempDiv = document.createElement('div');
          tempDiv.innerHTML = html;
          const productGrid = tempDiv.querySelector('#product-grid');
          if (productGrid) {
            const childElements = productGrid.children;
            const targetElement = document.querySelector('#product-grid');
            for (let i = 0; i < childElements.length; i++) {
              targetElement.appendChild(childElements[i].cloneNode(true));
            }
          } else {
            console.log('#product-grid not found in the HTML.');
          }
        })
        .catch(error => {
          console.error('Error fetching data:', error);
        });
      },
      _showHideLoadMoreButton(){
        (eventSelectors._currentPage >= eventSelectors._totalPages) ? eventSelectors._loadMoreButton.classList.add("hidden") : eventSelectors._loadMoreButton.classList.remove("hidden") ;
      },
      _resetValuesOnFilterChange: function(){
        if(document.querySelectorAll(".pagination-wrapper").length == 0){
          eventSelectors._loadMoreButton.classList.add("hidden");
        }
        eventSelectors._currentPage = 1;
      }
    }
    window.loadMoreProducts._init();
  }
  /* Load more -- End */

  /* Currency Changer -- Start */
  const currencySelectors = document.querySelectorAll('[data-disclosure-currency]');
  currencySelectors.forEach(function (currencySelector) {
    const currencyOptions = currencySelector.querySelectorAll('[data-disclosure-option]');
    currencyOptions.forEach(function (option) {
      option.addEventListener('click', function (event) {
        event.preventDefault();
        const currencyCode = option.getAttribute('data-value');
        const newUrl = `${window.location.origin}?currency=${currencyCode}`;
        fetchCurrency(newUrl);
      });
    });
    function fetchCurrency(newUrl) {
      fetch(newUrl)
      .then(response => {
        if (response.ok) {
          // On a successful response, reload the current page.
          location.reload();
        } else {
          console.error("Failed to fetch currency data.");
        }
      })
      .catch(error => {
        console.error("Error fetching currency data: ", error);
      });
    }
  });
  /* Currency Changer -- End */

});