const searchInput = document.getElementById("searchInput");
const searchSubmitBtn = document.getElementById("searchSubmitBtn");
const divCreated = document.getElementById("searchResults");
const backBtn = document.getElementById("backBtn");
searchSubmitBtn.addEventListener('click', function(){
    const url = "https://api.coingecko.com/api/v3/search?query=";
    let query = searchInput.value;
    console.log("user searched for: ",query);
    fetch(url + query)
    .then((response)=>{
        return response.json();
        })
        .then((data)=> {
            console.log("data fetched: ", data);
            divCreated.innerHTML = ``;
            if(data.coins.length == 0){
                divCreated.innerHTML += `<h2 class='no-results'>No results found</h2>`;
            }
            else{
                data.coins.forEach(element => {
                    displayData(element)
                });
            }
        });
    
});

function displayData(data){
    const coinName = data.name;
    const coinRank = data.market_cap_rank;
    const coinImgUrl = data.thumb;
    const coinid = data.id;
    console.log("coinnname:  ", coinName);
    console.log("coinrank:   ", coinRank);
    console.log("coinImgURL:  ",coinImgUrl);
    const resultsChild = document.createElement('div');
    resultsChild.classList = "resultsChild";
    resultsChild.innerHTML += `<img src=${coinImgUrl} alt="${coinName}" />`;
    resultsChild.innerHTML += `<h2 class='resultTitle'>${coinName}</h2>`;
    // resultsChild.innerHTML += `<p><strong>Market Rank: </strong> ${coinRank}</p>`;
    resultsChild.innerHTML += `<button id="viewDetails" class="viewDetailsBtn" data-coinid="${coinid}"> Details </button>`;
    console.log("innerHTMKL: ", resultsChild);
    divCreated.appendChild(resultsChild);    
}


divCreated.addEventListener('click', function (event) {
    if (event.target.classList.contains('viewDetailsBtn')) {
        const coinid = event.target.getAttribute('data-coinid');
        window.location.href = `coinDetails.html?coinid=${coinid}`;
    }
});

backBtn.addEventListener('click',function(){
    window.location.href = `index.html?homePgae`;
});