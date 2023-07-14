document.addEventListener('DOMContentLoaded', function(){

    const searchBtn = document.querySelector('.searchBtn');
    const searchBar = document.querySelector('.searchBar');
    const searchInput = document.getElementById('searchInput');
    const searchClose = document.getElementById('searchClose');

    searchBtn.addEventListener('click', function(){
        searchBar.style.visibility = 'visible'
        searchBar.classList.add('open');
        this.setAttribute('aria-expande', 'true');
        searchInput.focus();
    })

    searchClose.addEventListener('click', function(){
        searchBar.style.visibility = 'hidden'
        searchBar.classList.remove('open');
        this.setAttribute('aria-expande', 'false');
    })
})