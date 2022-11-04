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
    removeBtn.textContent= "Usuń";
    removeBtn.addEventListener('click',(e)=>removeItem(e));

    label.appendChild(textInput);
    label.appendChild(numInput);
    label.appendChild(removeBtn);
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
   const ul = document.createElement('ul');
   ul.classList.add('result')
   test.forEach(obj=>{
       const li=document.createElement('li');
        li.innerHTML=`<b>${obj.itemName}:</b> ${obj.price ? `<em>1szt.=${obj.price}B <em>${obj.quantity}szt.=${+obj.price * obj.quantity}B</em>` :"<span style='color: darkred'>Brak Ceny</span>"}`;
        ul.appendChild(li);
   });
   section.textContent='';
   section.appendChild(ul);
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