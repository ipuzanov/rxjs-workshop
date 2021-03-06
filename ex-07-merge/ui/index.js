const nameInput = document.getElementById('name');
const categoryInput = document.getElementById('category');
const inStockInput = document.getElementById('in-stock');
const out = document.getElementById('out');

function requestFactory() {
  let timer = null;
  let ctrl = null;

  return ({ name, category, inStock }) => {
    clearTimeout(timer);
    if (ctrl) ctrl.abort();
    ctrl = new AbortController();

    timer = setTimeout(
      () =>
        fetch(`/api/search?name=${name}&category=${category}&inStock=${inStock}`, {
          signal: ctrl.signal,
        })
          .then(r => r.json())
          .then(drawResult),
      200,
    );
  };
}

const performRequest = requestFactory();

const data = {
  name: nameInput.value,
  category: categoryInput.value,
  inStock: inStockInput.checked,
};

function handleName(evt) {
  data.name = evt.target.value;
  performRequest(data);
}
function handleCategory(evt) {
  data.category = evt.target.value;
  performRequest(data);
}
function handleInStock(evt) {
  data.inStock = evt.target.checked;
  performRequest(data);
}

performRequest(data);

nameInput.addEventListener('input', handleName);
categoryInput.addEventListener('change', handleCategory);
inStockInput.addEventListener('change', handleInStock);
