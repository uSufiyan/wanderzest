(() => {
  'use strict';

  const forms = document.querySelectorAll('.needs-validation');

  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault();
        event.stopPropagation();
      }

      form.classList.add('was-validated')
    }, false)
  });
})();

// Tax-Switch
const TAX_KEY = "beforeTax";
const TAX_RATE = 1.18;

const taxSwitches = document.querySelectorAll(
  "#switchCheckDefault, #switchCheckDefaultNav"
);

function updatePrices(isBeforeTax) {
  const prices = document.querySelectorAll(".price");
  const taxInfos = document.querySelectorAll(".tax-info");

  prices.forEach(priceEl => {
    const totalPrice = Number(priceEl.dataset.price);

    priceEl.innerText = isBeforeTax
      ? Math.round(totalPrice / TAX_RATE).toLocaleString("en-IN")
      : totalPrice.toLocaleString("en-IN");
  });

  taxInfos.forEach(info => {
    info.style.display = isBeforeTax ? "none" : "inline";
  });
}

const savedState = localStorage.getItem(TAX_KEY) === "true";

taxSwitches.forEach(sw => {
  if (!sw) return;
  sw.checked = savedState;

  sw.addEventListener("change", () => {
    localStorage.setItem(TAX_KEY, sw.checked);

    taxSwitches.forEach(s => (s.checked = sw.checked));

    updatePrices(sw.checked);
  });
});

updatePrices(savedState);
