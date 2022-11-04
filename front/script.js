const { ipcRenderer } = require('electron');
const fields= document.querySelector('.fields');
let count=0;

function removeItem(e) {
    e.preventDefault();
    e.target.parentElement.remove();
}

function createField(e) {
    e.preventDefault();
    const label=document.createElement('label');
    label.classList.add('item')

    const textInput = document.createElement('input');
    textInput.setAttribute("type","text");
    textInput.setAttribute("placeholder","Nazwa Przedmiotu");

    const numInput = document.createElement('input');
    numInput.setAttribute("type","number");
    numInput.setAttribute("min","1");
    numInput.setAttribute("value","1");

    const removeBtn = document.createElement('button');
    removeBtn.classList.add('remove');
    console.log();
    removeBtn.textContent= "✖";
    removeBtn.addEventListener('click',(e)=>removeItem(e));

    label.appendChild(textInput);
    label.appendChild(numInput);
    if(fields.children.length !== 0){
        label.appendChild( removeBtn);
    }
    fields.appendChild(label);
    count++;

}

async function getResult(e) {
    const section = document.querySelector('.right');
    section.textContent='';
    e.preventDefault();
    const items = [...document.querySelectorAll('.item')];
    const result = items.map(label => {
        const itemName = label.querySelector('input[type="text"]').value.trim();
        const quantity=Number(label.querySelector('input[type="number"]').value);
        return {itemName,quantity}
    })

    const spinner = document.createElement('span');
    spinner.classList.add("loader");
    section.appendChild(spinner);

   const test = await ipcRenderer.invoke('request-get-prices',result);
   const table =  document.createElement('table');
    const thead =  document.createElement('thead');
    thead.innerHTML=`<tr>
    <th>Nazwa</th>
    <th>Cena za sztuke </th>
    <th>Ilosc Sztuk</th>
     <th>Razem</th>
  </tr>`
   const tbody = document.createElement('tbody');
   tbody.classList.add('result')
   test.forEach(obj=>{
       const tr=document.createElement('tr');
        tr.innerHTML=`<th>${obj.itemName}</th>  <td>${!obj.price ? "Brak" : obj.price+"B"}</td> <td>${obj.quantity}</td> <td>${!obj.price ? "Brak" : (obj.quantity *obj.price).toFixed(3)+"B"}</td> `;
       tbody.appendChild(tr);
   });
   const sum=test.reduce((prev,curr)=>prev+(curr.price * curr.quantity),0);
   section.textContent='';
   table.appendChild(thead);
   table.appendChild(tbody);
   section.appendChild(table);
   const p = document.createElement('div');
   p.innerHTML =`<b>Łącznie ${sum.toFixed(3)}B</b> `;
   section.appendChild(p);
}



function clear(e) {
    e.preventDefault()
    document.querySelector('.fields').textContent='';
    document.querySelector('.right').textContent='';
    createField(e);
}

document.querySelector('.clear_all').addEventListener('click',(e)=> clear(e))
document.querySelector('.search').addEventListener('click',(e)=> getResult(e))
document.querySelector('.create_field').addEventListener('click',(e)=> createField(e))