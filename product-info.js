if (!customElements.get('product-info')) {
  customElements.define(
    'product-info',
    class ProductInfo extends HTMLElement {
      abortController = undefined;
      onVariantChangeUnsubscriber = undefined;
      pendingRequestUrl = null;
      preProcessHtmlCallbacks = [];
      postProcessHtmlCallbacks = [];
      cartUpdateUnsubscriber = undefined;

      constructor() {
        super();
        this.endPointMiddleware = window?.shopGlobalConfig?.middlewareUrl || "https://middleware-staging.jaspal.com";
        this.storeCode = window?.shopGlobalConfig?.countryCode || "CPS";
      }

      get variantSelectors() {
        return this.querySelector('variant-selects');
      }

      get productId() {
        return this.getAttribute('data-product-id');
      }

      get sectionId() {
        return this.dataset.originalSection || this.dataset.section;
      }

      get pickupAvailability() {
        return this.querySelector(`pickup-availability`);
      }

      get productForm() {
        return this.querySelector('form[is="product-form"]');
      }

      get quantityInput() {
        return this.querySelector('quantity-input input');
      }

      connectedCallback() {
        this.enableSizePreference = document.querySelector('.size-preference--true') ? true : false;
        this.initializeProductSwapUtility();
        this.form = document.getElementById(`product-form-${this.dataset.section}`);

        this.onVariantChangeUnsubscriber = FoxTheme.pubsub.subscribe(
          FoxTheme.pubsub.PUB_SUB_EVENTS.optionValueSelectionChange,
          this.handleOptionValueChange.bind(this)
        );
        if (this.enableSizePreference) {
          this.setSizeOption();
          this.onSubmitHandler();
          this.onSubmitBuyItNowHandler();
        }

        this.initQuantityHandlers();

        this.currentVariant = this.getSelectedVariant(this);
        if (this.currentVariant) {
          this.updateMedia(this.currentVariant);
        }
      }

      disconnectedCallback() {
        this.onVariantChangeUnsubscriber();
        this.cartUpdateUnsubscriber?.();
      }

      initializeProductSwapUtility() {
        this.postProcessHtmlCallbacks.push((newNode) => {
          window?.Shopify?.PaymentButton?.init();
          window?.ProductModel?.loadShopifyXR();
        });
      }

      handleOptionValueChange({ data: { event, target, selectedOptionValues } }) {
        if (!this.contains(event.target)) return;
        const productUrl = target.dataset.productUrl || this.pendingRequestUrl || this.dataset.url;
        const shouldSwapProduct = this.dataset.url !== productUrl;
        const shouldFetchFullPage = this.dataset.updateUrl === 'true' && shouldSwapProduct;
        const viewMode = this.dataset.viewMode || 'main-product';

        this.renderProductInfo({
          requestUrl: this.buildRequestUrlWithParams(productUrl, selectedOptionValues, shouldFetchFullPage),
          targetId: target.id,
          callback: shouldSwapProduct
            ? this.handleSwapProduct(productUrl, shouldFetchFullPage, viewMode)
            : this.handleUpdateProductInfo(productUrl, viewMode),
        });
      }

      handleSwapProduct(productUrl, updateFullPage, viewMode) {
        return (html) => {
          const quickView = html.querySelector('#MainProduct-quick-view__content');
          if (quickView && viewMode === 'quick-view') {
            html = quickView.content.cloneNode(true);
          }
          const selector = updateFullPage ? "product-info[id^='MainProduct']" : 'product-info';
          const variant = this.getSelectedVariant(html.querySelector(selector));

          this.updateURL(productUrl, variant?.id);

          if (updateFullPage) {
            document.querySelector('head title').innerHTML = html.querySelector('head title').innerHTML;
            HTMLUpdateUtility.viewTransition(
              document.querySelector('main'),
              html.querySelector('main'),
              this.preProcessHtmlCallbacks,
              this.postProcessHtmlCallbacks
            );
            HTMLUpdateUtility.viewTransition(
              document.getElementById('shopify-section-sticky-atc-bar'),
              html.getElementById('shopify-section-sticky-atc-bar'),
              this.preProcessHtmlCallbacks,
              this.postProcessHtmlCallbacks
            );

            if (!variant) {
              this.setUnavailable();
              return;
            }
          } else {
            HTMLUpdateUtility.viewTransition(
              this,
              html.querySelector('product-info'),
              this.preProcessHtmlCallbacks,
              this.postProcessHtmlCallbacks
            );
          }

          this.currentVariant = variant;
        };
      }

      handleUpdateProductInfo(productUrl, viewMode) {
        return (html) => {
          const quickView = html.querySelector('#MainProduct-quick-view__content');
          if (quickView && viewMode === 'quick-view') {
            html = quickView.content.cloneNode(true);
          }
          const variant = this.getSelectedVariant(html);

          this.pickupAvailability?.update(variant);
          this.updateOptionValues(html);
          this.updateURL(productUrl, variant?.id);
          this.updateShareUrl(variant?.id);
          this.updateVariantInputs(variant?.id);

          if (!variant) {
            this.setUnavailable();
            return;
          }

          this.updateMedia(variant);

          const updateSourceFromDestination = (id, shouldHide = (source) => false) => {
            const source = html.getElementById(`${id}-${this.sectionId}`);
            const destination = this.querySelector(`#${id}-${this.dataset.section}`);
            if (source && destination) {
              destination.innerHTML = source.innerHTML;
              destination.classList.toggle('hidden', shouldHide(source));
            }
          };

          updateSourceFromDestination('price');
          updateSourceFromDestination('Sku');
          updateSourceFromDestination('Inventory');
          updateSourceFromDestination('Badges');
          updateSourceFromDestination('PricePerItem');
          updateSourceFromDestination('Volume');

          this.updateQuantityRules(this.sectionId, this.productId, html);
          updateSourceFromDestination('QuantityRules');
          updateSourceFromDestination('VolumeNote');

          HTMLUpdateUtility.viewTransition(
            document.querySelector(`#SizeChart-${this.sectionId}`),
            html.querySelector(`#SizeChart-${this.sectionId}`),
            this.preProcessHtmlCallbacks,
            this.postProcessHtmlCallbacks
          );

          const addButtonUpdated = html.getElementById(`ProductSubmitButton-${this.sectionId}`);
          this.toggleAddButton(
            addButtonUpdated ? addButtonUpdated.hasAttribute('disabled') : true,
            FoxTheme.variantStrings.soldOut
          );

          const stickyAtcBar = document.getElementById(`shopify-section-sticky-atc-bar`);
          if (stickyAtcBar) {
            stickyAtcBar.classList.remove('hidden');
          }

          FoxTheme.pubsub.publish(FoxTheme.pubsub.PUB_SUB_EVENTS.variantChange, {
            data: {
              sectionId: this.sectionId,
              html,
              variant,
            },
          });

          document.dispatchEvent(
            new CustomEvent('variant:changed', {
              detail: {
                variant: variant,
              },
            })
          );
        };
      }

      buildRequestUrlWithParams(url, optionValues, shouldFetchFullPage = false) {
        const params = [];

        !shouldFetchFullPage && params.push(`section_id=${this.sectionId}`);

        if (optionValues.length) {
          params.push(`option_values=${optionValues.join(',')}`);
        }

        return `${url}?${params.join('&')}`;
      }

      getSelectedVariant(productInfoNode) {
        const selectedVariant = productInfoNode.querySelector('variant-selects [data-selected-variant]')?.innerHTML;
        return !!selectedVariant ? JSON.parse(selectedVariant) : null;
      }

      renderProductInfo({ requestUrl, targetId, callback }) {
        this.abortController?.abort();
        this.abortController = new AbortController();

        fetch(requestUrl, { signal: this.abortController.signal })
          .then((response) => response.text())
          .then((responseText) => {
            this.pendingRequestUrl = null;
            const html = new DOMParser().parseFromString(responseText, 'text/html');
            callback(html);
          })
          .then(() => {
            // set focus to last clicked option value
            document.querySelector(`#${targetId}`)?.focus();
          })
          .catch((error) => {
            if (error.name === 'AbortError') {
              console.log('Fetch aborted by user');
            } else {
              console.error(error);
            }
          });
      }

      updateOptionValues(html) {
        const variantSelects = html.querySelector('variant-selects');
        if (variantSelects) {
          HTMLUpdateUtility.viewTransition(this.variantSelectors, variantSelects, this.preProcessHtmlCallbacks);
        }
      }

      updateURL(url, variantId) {
        if (this.dataset.updateUrl === 'false') return;
        window.history.replaceState({}, '', `${url}${variantId ? `?variant=${variantId}` : ''}`);
      }

      updateVariantInputs(variantId) {
        document
          .querySelectorAll(`#product-form-${this.dataset.section}, #product-form-installment-${this.dataset.section}`)
          .forEach((productForm) => {
            const input = productForm.querySelector('input[name="id"]');
            input.value = variantId ?? '';
            input.dispatchEvent(new Event('change', { bubbles: true }));
          });
      }

      updateMedia(variant) {
        const productMedia = this.querySelector(`[id^="MediaGallery-${this.dataset.section}"]`);
        if (!productMedia) return; // Early return if productMedia is not found

        const setActiveMedia = () => {
          if (typeof productMedia.setActiveMedia === 'function') {
            productMedia.init();
            productMedia.setActiveMedia(variant);
            return true; // Indicate success
          }
          return false; // Indicate failure
        };

        if (!setActiveMedia()) {
          this.timer = setInterval(() => {
            if (setActiveMedia()) {
              clearInterval(this.timer);
            }
          }, 100);
        }
      }

      updateShareUrl(variantId) {
        if (!variantId) return;
        const shareButton = document.getElementById(`ProductShare-${this.dataset.section}`);
        if (!shareButton || !shareButton.updateUrl) return;
        shareButton.updateUrl(`${window.shopUrl}${this.dataset.url}?variant=${variantId}`);
      }

      toggleAddButton(disable = true, text, modifyClass = true) {
        const productForm = document.getElementById(`product-form-${this.dataset.section}`);
        if (!productForm) return;
        const addButton = productForm.querySelector('[name="add"]');
        const addButtonText = productForm.querySelector('[name="add"] > span');
        if (!addButton) return;

        if (disable) {
          addButton.setAttribute('disabled', 'disabled');
          if (text) addButtonText.textContent = this.decoded(text);
        } else {
          addButton.removeAttribute('disabled');
          addButtonText.textContent = this.decoded(FoxTheme.variantStrings.addToCart);
        }

        if (!modifyClass) return;
      }

      decoded(text) {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = text;
        const decoded = tempDiv.textContent;
        return decoded;
      }

      setUnavailable() {
        this.toggleAddButton(true, FoxTheme.variantStrings.unavailable);
        const price = document.getElementById(`price-${this.dataset.section}`);
        const inventory = document.getElementById(`Inventory-${this.dataset.section}`);
        const sku = document.getElementById(`Sku-${this.dataset.section}`);
        const volumePricing = document.getElementById(`Volume-${this.dataset.section}`);
        const stickyAtcBar = document.getElementById(`shopify-section-sticky-atc-bar`);

        if (price) price.classList.add('hidden');
        if (inventory) inventory.classList.add('hidden');
        if (sku) sku.classList.add('hidden');
        if (volumePricing) volumePricing.classList.add('hidden');
        if (stickyAtcBar) stickyAtcBar.classList.add('hidden');
      }

      initQuantityHandlers() {
        if (!this.quantityInput) return;

        this.setQuantityBoundries();
        if (!this.hasAttribute('data-original-section')) {
          this.cartUpdateUnsubscriber = FoxTheme.pubsub.subscribe(
            FoxTheme.pubsub.PUB_SUB_EVENTS.cartUpdate,
            this.fetchQuantityRules.bind(this)
          );
        }
      }

      setQuantityBoundries() {
        FoxTheme.pubsub.publish(FoxTheme.pubsub.PUB_SUB_EVENTS.quantityBoundries, {
          data: {
            sectionId: this.sectionId,
            productId: this.productId,
          },
        });
      }

      fetchQuantityRules() {
        const currentVariantId = this.productForm?.productIdInput?.value;
        if (!currentVariantId) return;

        this.querySelector('.quantity__rules-cart')?.classList.add('btn--loading');

        fetch(`${this.getAttribute('data-url')}?variant=${currentVariantId}&section_id=${this.sectionId}`)
          .then((response) => response.text())
          .then((responseText) => {
            const parsedHTML = new DOMParser().parseFromString(responseText, 'text/html');
            this.updateQuantityRules(this.sectionId, this.productId, parsedHTML);
          })
          .catch((error) => {
            console.error(error);
          })
          .finally(() => {
            this.querySelector('.quantity__rules-cart')?.classList.remove('btn--loading');
          });
      }

      updateQuantityRules(sectionId, productId, parsedHTML) {
        if (!this.quantityInput) return;

        FoxTheme.pubsub.publish(FoxTheme.pubsub.PUB_SUB_EVENTS.quantityRules, {
          data: {
            sectionId,
            productId,
            parsedHTML,
          },
        });

        this.setQuantityBoundries();
      }

      onSubmitHandler() {
        const submitButtons = document.querySelectorAll('.product-form__submit');

        submitButtons.forEach((submitButton) => {
          submitButton.addEventListener('click', () => {
            // add size value intro localstorage
            this.saveSelectedSizeToLocalStorage('input[name^="Size"]');
          });
        });
      }

      onSubmitBuyItNowHandler() {
        const buyItNowButtons = document.querySelectorAll('.shopify-payment-button__button');

        buyItNowButtons.forEach((btnSubmit) => {
          btnSubmit.addEventListener('click', () => {
            this.saveSelectedSizeToLocalStorage('input[name^="Size"]');
          });
        });
      }

      // setSizeOption from localStorage 'recentlySizeViewed' or Customer metafields
      setSizeOption() {
        const isCustomerLoggedIn = document.body.classList.contains('customer-logged-in');
        const categoryValue = document.querySelector('input[name="category"]')?.getAttribute('value');

        // Helper function
        function selectSizeInput(sizeValue) {
          const sizeInputs = document.querySelectorAll('input[name^="Size"], input[name^="size"]');
          let found = false;
          sizeInputs.forEach(input => {
            if (input.value && input.value.toLowerCase() === String(sizeValue).toLowerCase()) {
              // input.checked = true;
              input.click();
              found = true;
            }
          });

          // Update the label in the fieldset
          // let label = document.querySelector('span[data-selected-swatch-value="Size"]');
          // if (label) {
          //   label.innerHTML = sizeValue;
          // }

          if (!found) {
            console.warn(`Size value "${sizeValue}" not found in variant selects.`);
          }
        }

        if (isCustomerLoggedIn) {
          // If the customer is logged in, fetch the size from metafield Reference Variants
          this.getDataCustomerVariant()?.then(result => {
            const dataSizeArray = result || [];
            // Find the object with matching category
            const found = Array.isArray(dataSizeArray)
              ? dataSizeArray.find(item => item.category === categoryValue)
              : null;
            const sizeValue = found ? found.size : null;
            if (sizeValue) {
              selectSizeInput(sizeValue);
            } else {
              console.warn('No size value found in customer metafields.');
            }
          });
        } else {
          const dataSizeObject = JSON.parse(localStorage.getItem('recentlySizeViewed')) || {};
          const sizeValue = dataSizeObject[categoryValue];
          if (sizeValue) {
            selectSizeInput(sizeValue);
          } else {
            console.warn('No size value found in localStorage.');
          }
        }
      }

      // This function saves the selected size to localStorage metafield Reference Variants
      saveSelectedSizeToLocalStorage(inputSelector) {
        const isCustomerLoggedIn = document.body.classList.contains('customer-logged-in');
        const STORAGE_KEY = 'recentlySizeViewed';
        let dataSizeArray;
        let itemInputSize = document.querySelectorAll(inputSelector);
        let itemInputSizeChecked = Array.from(itemInputSize).find((item) => item.checked);
        if (itemInputSizeChecked) {
          const sizeValue = itemInputSizeChecked.getAttribute('value');
          const categoryValue = this.form.querySelector('input[name="category"]').getAttribute('value');
          const pdpLink = window.location.pathname;
          if (isCustomerLoggedIn) {
            this.getDataCustomerVariant()?.then(result => {
              // Get current array from metafield (simulate with localStorage for now)
              dataSizeArray = result || [];
              // Remove any existing entry for this category
              if (Array.isArray(dataSizeArray)) {
                dataSizeArray = dataSizeArray.filter(item => item.category !== categoryValue);
              } else {
                dataSizeArray = [];
              }
              // Add new entry
              dataSizeArray.push({
                category: categoryValue,
                size: sizeValue,
                'size saved product': pdpLink
              });
              // Save to metafield (should be async API call)
              this.updateCustomerVariant(JSON.stringify(dataSizeArray));
            });
            
          } else {
            // Not logged in: use object as before
            let sizeObject = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
            sizeObject[categoryValue] = sizeValue;
            localStorage.setItem(STORAGE_KEY, JSON.stringify(sizeObject));
          }
        }
      }

      // return data from metafield Reference Variants by customer
      // This function fetches the customer variant data from the API
      getDataCustomerVariant() {
        const url = `${this.endPointMiddleware}/webhook/get-variant-by-customer?storeCode=${this.storeCode}&customer=`;
        const customerId = document.getElementById('customer-id')?.value || '';
        
        if (!customerId) {
          console.warn('No customer ID found.');
          return null;
        }
        
        return fetch(url + customerId, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        })
          .then(response => response.json())
          .then(data => {
            return data.data;
          })
          .catch(error => console.error('Error fetching customer variant data:', error));
      }

      // This function updates the customer variant via a POST request
      updateCustomerVariant(data) {
        const url = `${this.endPointMiddleware}/webhook/update-variant-by-customer?storeCode=${this.storeCode}`;
        const customerId = document.getElementById('customer-id')?.value || '';
        const payload = {
          customer: customerId,
          variant: data
        };

        fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        })
          .then(response => response.json())
          .then(data => console.log('Success:', data))
          .catch(error => console.error('Error:', error));
      }
    }
  );
}
