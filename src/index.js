const $app = document.getElementById('app');
const $observe = document.getElementById('observe');
const API = 'https://rickandmortyapi.com/api/character/';

const getData = api => {
  fetch(api)
    .then(response => response.json())
    .then(response => {
      const characters = response.results;
      const nextPage = response.info.next

      if(!nextPage){
        intersectionObserver.unobserve($observe)
        alert('No hay más personajes')
      }

      localStorage.setItem('next_fetch',nextPage)
      let output = characters.map(character => {
        return `
      <article class="Card">
        <img src="${character.image}" />
        <h2>${character.name}<span>${character.species}</span></h2>
      </article>
    `
      }).join('');
      let newItem = document.createElement('section');
      newItem.classList.add('Items');
      newItem.innerHTML = output;
      $app.appendChild(newItem);
    })
    .catch(error => console.log(error));
}

const loadData = () => {

  let nextPage = localStorage.getItem('next_fetch')
  
  if(nextPage){
    getData(nextPage);
  }else{
    localStorage.setItem('next_fetch',API)
    getData(API)
  }

}

const beforeunloadHandler = () => {
  
  localStorage.removeItem('next_fetch')
  firstFetch = `${API}?page=1`
  getData(firstFetch)
}

const intersectionObserver = new IntersectionObserver(entries => {
  
  if(entries[0].isIntersecting){
    loadData()
  }
}, {
  rootMargin: '0px 0px 100% 0px',
});

window.addEventListener("beforeunload",beforeunloadHandler)

intersectionObserver.observe($observe);
