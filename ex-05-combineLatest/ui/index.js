const nameInput = document.getElementById('name');
const categoryInput = document.getElementById('category');
const inStockInput = document.getElementById('in-stock');

function requestFn() {
  let timer;
  let ctrl;

  return ({ name, category, inStock }) => {
    clearTimeout(timer);
    if (ctrl) ctrl.abort();

    ctrl = new AbortController();

    timer = setTimeout(
      () =>
        fetch(`/api/search?name=${name}&category=${category}&inStock=${Number(inStock)}`, {
          signal: ctrl.signal,
        })
          .then(r => r.json())
          .then(drawResult),
      200,
    );
  };
}

const performRequest = requestFn();

const data = {
  name: nameInput.value,
  category: categoryInput.value,
  inStock: inStockInput.checked,
};

function handleName(evt) {
  data.name = evt.target.value;
  performRequest(data);
}
function handleCat(evt) {
  data.category = evt.target.value;
  performRequest(data);
}
function handleStock(evt) {
  data.inStock = evt.target.checked;
  performRequest(data);
}

performRequest(data);

nameInput.addEventListener('input', handleName);
categoryInput.addEventListener('change', handleCat);
inStockInput.addEventListener('change', handleStock);
