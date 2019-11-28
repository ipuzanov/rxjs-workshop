const out = document.getElementById('out');

function buildItem(item) {
  const li = document.createElement('li');
  li.innerText = JSON.stringify(item);
  return li;
}

function drawResult(results) {
  out.innerHTML = '';
  const tpl = document.createElement('template');
  results.map(buildItem).forEach(item => tpl.content.appendChild(item));
  out.appendChild(tpl.content);
}
