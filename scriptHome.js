const cryptoSelect = document.getElementById("cryptoSelect");
document.getElementById("searchButton").addEventListener("click", function () {
  window.location.href = `searchPage.html?searchPage`;
});

// Function to fetch trending coins and create cards
function fetchTrendingCoins() {
  const trendingCoinsContainer = document.getElementById(
    "trendingCoinsContainer"
  );
  const apiUrl = "https://api.coingecko.com/api/v3/search/trending";

  fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
      const trendingCoins = data.coins;
      trendingCoins.forEach((coin) => {
        const card = createTrendingCard(coin);
        trendingCoinsContainer.appendChild(card);
      });
    })
    .catch((error) => {
      console.error("Error fetching trending coins:", error);
    });
}

// Function to create a card for a trending coin
function createTrendingCard(coin) {
  const card = document.createElement("div");
  card.classList.add("trending-coin-card");
  card.classList.add("coin-card");

  const coinName = coin.item.name;
  const coinImage = coin.item.thumb;
  const marketPrice = (coin.item.price_btc).toFixed(9);

  card.innerHTML = `
          <h3 class="coin-name">${coinName}</h3>
          <img class="coin-image" src="${coinImage}" alt="${coinName}">
          <p>Market Price: ${marketPrice} BTC</p>
      `;

  return card;
}

// Call the function to fetch and display trending coins
fetchTrendingCoins();

// Function to destroy the existing chart
function destroyChart() {
  const existingChart = Chart.getChart("priceChart");
  if (existingChart) {
    existingChart.destroy();
  }
}

// Function to fetch cryptocurrency price data and create a chart
function fetchCryptoPriceChart(cryptoId) {
  destroyChart();
  const apiUrl = `https://api.coingecko.com/api/v3/coins/${cryptoId}/market_chart?vs_currency=inr&days=5&interval=daily&precision=2`;

  fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
      
      const priceData = data.prices;

      // Extract timestamps and prices from the data
      const timestamps = priceData.map((item) => item[0]);
      const prices = priceData.map((item) => item[1]);

      // Filter the data to include only the last 5 data points
      const last5Timestamps = timestamps.slice(-5);
      const last5Prices = prices.slice(-5);

      // Format timestamps in the desired format
      const formattedTimestamps = last5Timestamps.map((timestamp) => {
        const date = new Date(timestamp);
        return `${(date.getMonth() + 1).toString().padStart(2, "0")}/${date
          .getDate()
          .toString()
          .padStart(2, "0")}/${date.getFullYear()}, ${date.toLocaleTimeString(
          "en-US",
          {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: true,
          }
        )}`;
      });

      // Create a Chart.js chart with only the last 5 data points
      const ctx = document.getElementById("priceChart").getContext("2d");
      new Chart(ctx, {
        type: "line",
        data: {
          labels: formattedTimestamps, // X-axis labels (formatted timestamps)
          datasets: [
            {
              label: `${cryptoId.toUpperCase()} Price (INR)`,
              data: last5Prices, // Y-axis data (prices)
              borderColor: "rgb(75, 192, 192)",
              fill: false,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: {
              beginAtZero: false,
            },
            y: {
              beginAtZero: false,
            },
          },
        },
      });
    })
    .catch((error) => {
      console.error(`Error fetching ${cryptoId} price data:`, error);
    });
}

// Function to populate the dropdown with cryptocurrency names from CoinGecko API
function populateCryptoDropdown() {
  const listApiUrl = "https://api.coingecko.com/api/v3/coins/list";

  fetch(listApiUrl)
    .then((response) => response.json())
    .then((data) => {
      data.forEach((crypto) => {
        const option = document.createElement("option");
        option.value = crypto.id;
        option.textContent = crypto.name;
        cryptoSelect.appendChild(option);
      });
    })
    .catch((error) => {
      console.error("Error fetching cryptocurrency list:", error);
    });
}

// Load chart for the selected cryptocurrency when the "Load Chart" button is clicked
document.getElementById("loadChartButton").addEventListener("click", () => {
  const selectedCryptoId = cryptoSelect.value;
  fetchCryptoPriceChart(selectedCryptoId);
});

// Load the cryptocurrency dropdown options
populateCryptoDropdown();

// Load a chart for Bitcoin by default
fetchCryptoPriceChart("bitcoin");