/* 
 Tasks: 
 - Acessar rota de cadastro - feito;
 - Acessar roata de login; 
 - Salvar token retornado pelo login para acessar as rotas privadas
*/

const redirect = document.getElementById('entrar');
const cadastro = document.getElementById('cadastre-se');
const cad = document.querySelector('.cadastro');
const log = document.querySelector('.login')

document.getElementById('myFormCad').addEventListener('submit',async(event) => {
    event.preventDefault();

    const form = event.target;
    
    const name = document.getElementById('input-apelido').value;
    const email = document.getElementById('input-email-cad').value;
    const password = document.getElementById('input-password-cad').value;

    const req = await fetch(form.action, {
        method:'Post',
        body: JSON.stringify({
            name: name,
            email: email,
            password: password
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    });
    const json = await req.json();
    form.reset();
})


redirect.addEventListener('click', (event) => {
    event.preventDefault();
    cad.style.display = 'none';
    log.style.display = 'flex';
})

/* --- Login --- */

document.getElementById('myFormLog').addEventListener('submit', async(event) => {
    event.preventDefault();

    const form = event.target;

    const email = document.getElementById('input-email').value;
    const password = document.getElementById('input-password').value;

    const req = await fetch(form.action, {
        method:'Post',
        body: JSON.stringify({
            email: email,
            password: password
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    })

    const json = await req.json();
    sessionStorage.setItem('token', JSON.stringify(json));
    console.log(json);
    form.reset();
})

cadastro.addEventListener('click', (event) => {
    event.preventDefault();
    cad.style.display = 'flex';
    log.style.display = 'none';
})