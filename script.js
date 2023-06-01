//*ENDPOINT
const endpoint = "https://striveschool-api.herokuapp.com/books";


//*chiamata api
fetch(endpoint, { headers: {} }) //promise
    .then((response) => response.json()) // response in json // promise
    .then((jsonData) => start(jsonData)) // chiama creaCard con jsonData come argomento
    .catch((err) => console.log("Error detected: ", err)); //catch error

let searchBar = document.getElementById("searchBar");
let searchButton = document.getElementById("searchButton");
let searchResult = [];

//! FUNZIONE PRINCIPALE
// books array di 50 oggetti //jasonData
function start(books) {
    console.log(books);
    CreaCards(books); // crea una card per ogni oggetto nell'array

    searchBar.addEventListener("input", () => {
        cerca(books); //ricerca in book.title
    })
}

//! FUNZIONE CERCA
function cerca(books) {
    const section = document.getElementById("section");
    searchResult = [];
    let keyword = searchBar.value;
    if (keyword.split("").length < 3) {
        section.innerHTML = "";
        CreaCards(books);
        return
    }
    section.innerHTML = "";
    for (const book of books) {
        if (book.title.toLowerCase().includes(keyword.toLowerCase())) {
            searchResult.push(book);
        }
    }
    CreaCards(searchResult);
}

//!FUNZIONE CreaCards --- aggiunge event listener al tasto add to cart
function CreaCards(books) {
    for (const book of books) {
        //elementi del dom
        let card = document.createElement("div");
        let cover = document.createElement("img");
        let cardBody = document.createElement("div");
        let cardTitle = document.createElement("p");
        let cardText = document.createElement("p");
        let buttonCart = document.createElement("a");
        let buttonDetails = document.createElement("a");
        let cartIcon = document.createElement("span");
        let skipButton = document.createElement("a");
        //classi, id
        cover.classList.add("cover", "img-fluid");
        card.classList.add("card", "card_dimension", "p-1");
        cardBody.classList.add("card-body");
        cardTitle.classList.add("card-title", "ellipsis");
        cardText.classList.add("card-text");
        buttonCart.classList.add("btn", "btn-primary", "buttonCart");
        buttonDetails.classList.add("btn", "btn-primary", "buttonDetails");
        cartIcon.classList.add("material-symbols-outlined");
        buttonDetails.href = `/dettagli.html?id=${book.asin}`;
        buttonDetails.target = "_blank";
        skipButton.classList.add("btn", "skipButton")
        //.innerHtml
        cover.src = book.img;
        cardTitle.innerText = book.title;
        cardText.innerText = parseFloat(book.price) + "€";
        buttonCart.innerText = "Add to Cart";
        buttonDetails.innerText = "Details";
        skipButton.innerHTML = `<span class="material-symbols-outlined">arrow_forward</span>`;
        //APPENDCHILD
        card.append(cover);
        card.append(cardBody);
        cardBody.append(cardTitle);
        cardBody.append(cardText);
        cardBody.append(buttonCart);
        cardBody.append(buttonDetails);
        card.append(skipButton);
        section.append(card)
        //Aggiunge un listener al tasto aggiungi al carrello
        buttonCart.addEventListener("click", () => {
            addToCart(book);
            buttonCart.innerText = "Added to cart";
        });
        skipButton.addEventListener("click", () => {
            card.classList.add("d-none");
        })
    }
}


//!FUNZIONE addToCart e remove from cart
let cartArray = [];

function addToCart(book) {
    cartArray.push(book);
    console.log(cartArray);

    createCart(cartArray);
    return cartArray;
}



function createCart(books) {
    //prima svuota il carrello, poi lo riempie con l'array contenente tutti gli oggetti aggiunti ad cartArray:
    const cart = document.getElementById("cart");
    let totalCounter = document.getElementById("totalCounter");
    let totalPrice = document.getElementById("totalPrice");
    let counter = books.length;  //*contatore oggetti nel carrello
    cart.innerHTML = "";
    let total = 0;
    if (counter === 0) {
        totalCounter.innerText = counter + " book/s in your cart";;
        /* totalPrice.innerText = "Cart Total: " + total + "€"; */
        badge.innerText = counter;
    }
    for (const book of books) {
        total += book.price;  //*calcola il totale sommando book.price
        //elementi del dom
        let newLi = document.createElement("div");
        let newLiTitle = document.createElement("div");
        let newLiPrice = document.createElement("div");
        let newLiRemove = document.createElement("button");
        let svuotaCart = document.getElementById("svuotaCart");
        let badge = document.getElementById("badge");
        let divider = document.createElement("hr");
        //class e id
        newLiRemove.classList.add("newLiRemove");
        newLi.classList.add("d-flex", "justify-content-between");
        newLiPrice.classList.add("d-flex", "align-items-center", "ms-2");
        divider.classList.add("hr", "hr-blurry");
        newLiTitle.classList.add("card-title", "pe-2")
        //innerHtml
        newLiTitle.innerText = book.title;
        newLiPrice.innerText = book.price + "€";
        totalCounter.innerText = counter + " book/s in your cart";
        badge.innerText = counter;
        newLiRemove.innerText = "x";
        //APPENDCHILD
        newLi.append(newLiTitle);
        newLi.append(newLiPrice);
        newLiPrice.append(newLiRemove);
        cart.append(newLi);
        cart.append(divider);
        //* AGGIUNGE con event listener e lancia la funzione che rimuove l'elemento selezionato dal carrello
        newLiRemove.addEventListener("click", () => {
            removeElement(books, book);
        });
        svuotaCart.addEventListener("click", () => {
            svuotaCarrello(books, book);
        })
    }
    totalPrice.innerText = "Cart Total: " + total.toFixed(2) + "€";

    //* visibilità del badge del carrello
    if (counter > 0) badge.classList.remove("d-none");
    if (counter === 0) badge.classList.add("d-none");
}

//! FUNZIONE rimuove l'elemento selezionato
function removeElement(books, book) {  //books è cartArray, cioè il carrello
    console.log(book);
    for (let i = 0; i < books.length; i++) {
        if (books[i].title.includes(book.title)) {
            let sameBooks = books.filter((item) => item.title === book.title);
            console.log(sameBooks)
            books.splice(i, 1);
            console.log(books);

            //* modifica il tasto add to cart quando elimino l'elemento dal carrello
            if (sameBooks.length === 1) {
                let cards = document.getElementsByClassName("card")
                for (let i = 0; i < cards.length; i++) {
                    if (book.title === cards[i].children[1].children[0].innerText) {
                        cards[i].children[1].children[2].innerText = "Add to Cart";
                    }
                }
            }
            break //interrompe il ciclo così da rimuovere solo un elemento nel caso ce ne fossero più di uno}
        }
    }
    createCart(books);
    return books
}



//!FUNZIONE svuota carrello
function svuotaCarrello(books) {
    books = [];
    let cards = document.getElementsByClassName("card");
    for (let i = 0; i < cards.length; i++) {
            cards[i].children[1].children[2].innerText = "Add to Cart";
    }
    createCart(books);
    return books
}
