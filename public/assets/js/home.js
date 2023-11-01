/* Tasks: 
- Conectar a api; -feito
- Pegar dados da categoria; -feito
- Pegar dados dos anuncios; -feito
- Acessar rota de busca -feito
*/

const categoriesResults = document.querySelector('.categorias');
const produtsResults = document.querySelector('.mais-procurados');
const inputEl = document.getElementById('search-input');
const button = document.querySelector('.search-button');

// Acessar API
const apiAcess = async(item) => {
    const response = await fetch(item);
    return response;
}

    // Acessa e lista as categorias do BD
const categories = async () => {
    try{
        const category = await apiAcess('http://localhost:2000/categories');
        const data = await category.json();

        const results = data.results;

        for(const result of results){
            const model = document.createElement('div');
            model.classList.add('model-categoria');
            const image = document.createElement('img');
            image.src = result.img;
            const span = document.createElement('span');
            span.innerText = result.name;

            model.appendChild(image);
            model.appendChild(span);
            categoriesResults.appendChild(model);
        }

    }catch(error){
        console.log('ERRO:',error);
    }
}

    // Acessa e lista todos os ads
const ads = async() => {
    const ad = await apiAcess('http://localhost:2000/ad/list');
    const data = await ad.json();

    const results = data.results;

    for( const result of results) {
        const modelProduto = document.createElement('div');
        modelProduto.classList.add('model-produto');

        const infos = document.createElement('div');
        infos.classList.add('infos');

        const price = document.createElement('div');        
        price.classList.add('price');
        price.innerText = result.price;

        const title = document.createElement('div');        
        title.classList.add('title');
        title.innerText = result.title;

        const location = document.createElement('div');        
        location.classList.add('location');
        
        const span = document.createElement('span');
        span.classList.add('material-symbols-outlined');
        span.innerText = 'location_on';

        const state = document.createElement('div');
        state.classList.add('state');
        state.innerText = result.state

        // Adiconando o elementos na estrutura html
        location.appendChild(span);
        location.appendChild(state);
        infos.appendChild(price);
        infos.appendChild(title);
        infos.appendChild(location);

        modelProduto.appendChild(infos);

        produtsResults.appendChild(modelProduto);
    }
}

let inputData = '';

const search = async () => {
    inputData = inputEl.value;

    const ads = await apiAcess(`http://localhost:2000/ad/item?title=${inputData}`);
    const data = await ads.json();
    console.log(data);
}

button.addEventListener('click', (event) => {
    event.preventDefault();
    search();
    inputEl.value = '';
})

categories();
ads();
