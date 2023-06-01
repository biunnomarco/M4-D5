const detailsEndpoint = "https://striveschool-api.herokuapp.com/books/";

if (window.location.search) {  
    const params = new URLSearchParams(window.location.search);
    const query = params.get("id");
    
    //*CHIAMATA AJAX verso detailsEndpoint + query
    fetch(detailsEndpoint + query)
        .then(res => res.json())
        .then(jsonData => createDetails(jsonData))
        .catch(error => console.log("Error: " + error));
}

//!FUNZIONE createDetails
function createDetails(book) { //books è jsonData
    console.log(book)
    //elementi del dom
    let cardImg = document.getElementById("cardImg");
    let cardTitle = document.getElementById("cardTitle");
    let cardGenere = document.getElementById("cardGenere");
    let cardPrice = document.getElementById("cardPrice");
    //inner text
    cardImg.src = book.img;
    cardTitle.innerText = book.title;
    cardGenere.innerText = book.category;
    cardPrice.innerText = book.price;
}