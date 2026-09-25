// Aluguel Fácil — MVP frontend.
// Em produção, substitua MOCK_LISTINGS por dados vindos de uma API/banco.

const MOCK_LISTINGS = [
  {
    id: 1, title: "Casa iluminada perto do centro", type: "Casa",
    city: "Congonhas", neighborhood: "Praia", price: 1650, rooms: 2, area: 72,
    quality: 91, distance: 2.4, verified: true,
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=80",
    description: "Ambientes bem conservados, boa iluminação e acesso fácil a comércio e transporte."
  },
  {
    id: 2, title: "Apartamento novo com ótima localização", type: "Apartamento",
    city: "Congonhas", neighborhood: "Centro", price: 1850, rooms: 2, area: 65,
    quality: 94, distance: 1.1, verified: true,
    image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80",
    description: "Imóvel moderno, condomínio organizado e próximo a serviços essenciais."
  },
  {
    id: 3, title: "Casa espaçosa com quintal", type: "Casa",
    city: "Congonhas", neighborhood: "Jardim Profeta", price: 2200, rooms: 3, area: 110,
    quality: 89, distance: 5.7, verified: true,
    image: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=900&q=80",
    description: "Boa opção para família, com quintal e ambientes amplos."
  },
  {
    id: 4, title: "Apartamento compacto e econômico", type: "Apartamento",
    city: "Congonhas", neighborhood: "Boa Vista", price: 1250, rooms: 1, area: 42,
    quality: 78, distance: 7.2, verified: false,
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=900&q=80",
    description: "Compacto e funcional, indicado para quem prioriza economia."
  },
  {
    id: 5, title: "Casa reformada em bairro tranquilo", type: "Casa",
    city: "Congonhas", neighborhood: "Alvorada", price: 1950, rooms: 3, area: 95,
    quality: 96, distance: 9.8, verified: true,
    image: "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=900&q=80",
    description: "Reformada recentemente, com boa conservação e região residencial."
  },
  {
    id: 6, title: "Apartamento com varanda", type: "Apartamento",
    city: "Ouro Branco", neighborhood: "Centro", price: 1700, rooms: 2, area: 68,
    quality: 88, distance: 24.5, verified: true,
    image: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=900&q=80",
    description: "Varanda, boa ventilação e acesso rápido a comércio e serviços."
  }
];

let userLocation = null;
let currentResults = [...MOCK_LISTINGS];

const $ = (id) => document.getElementById(id);
const money = (n) => n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

/*
  Índice de melhor anúncio:
  - preço competitivo: 40%
  - qualidade: 30%
  - distância: 20%
  - verificação: 10%
  O objetivo é valor pelo dinheiro, não simplesmente o menor preço.
*/
function valueScore(item, pool) {
  const prices = pool.map(x => x.price);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const priceScore = maxPrice === minPrice ? 100 : 100 - ((item.price - minPrice) / (maxPrice - minPrice)) * 100;
  const distanceScore = Math.max(0, 100 - item.distance * 7);
  const verifiedScore = item.verified ? 100 : 45;
  return Math.round(priceScore * .40 + item.quality * .30 + distanceScore * .20 + verifiedScore * .10);
}

function render(list) {
  const container = $("listings");
  container.innerHTML = "";
  $("resultsCount").textContent = `${list.length} anúncio${list.length === 1 ? "" : "s"} encontrado${list.length === 1 ? "" : "s"}`;
  $("emptyState").classList.toggle("hidden", list.length !== 0);

  list.forEach(item => {
    const score = valueScore(item, list.length ? list : MOCK_LISTINGS);
    const card = document.createElement("article");
    card.className = "card";
    card.innerHTML = `
      <div class="photo" style="background-image:url('${item.image}')">
        ${score >= 80 ? '<span class="badge">⭐ Bom negócio</span>' : ""}
      </div>
      <div class="card-body">
        <div class="card-title-row">
          <div>
            <h3>${item.title}</h3>
            <div class="meta">${item.type} · ${item.neighborhood}, ${item.city}</div>
          </div>
          <button class="favorite" aria-label="Favoritar">♡</button>
        </div>
        <div class="price">${money(item.price)} <small>/ mês</small></div>
        <div class="meta">${item.rooms} quarto${item.rooms !== 1 ? "s" : ""} · ${item.area} m² · ${item.distance.toFixed(1).replace(".", ",")} km de referência</div>
        <p class="description">${item.description}</p>
        <div class="card-bottom">
          <span class="score">Índice ${score}/100 · Qualidade ${item.quality}/100 ${item.verified ? "· ✓ verificado" : ""}</span>
          <button class="contact" onclick="alert('No app real, este botão abrirá o contato com o anunciante.')">Ver anúncio</button>
        </div>
      </div>
    `;
    container.appendChild(card);
  });
}

function applyFilters() {
  const query = $("search").value.trim().toLowerCase();
  const maxPrice = Number($("maxPrice").value) || Infinity;
  const minQuality = Number($("minQuality").value) || 0;
  const rooms = Number($("rooms").value) || 0;
  const maxDistance = Number($("maxDistance").value) || 999;
  const selectedTypes = [...document.querySelectorAll('input[name="type"]:checked')].map(x => x.value);

  let result = MOCK_LISTINGS.filter(item => {
    const matchesText = !query || `${item.title} ${item.city} ${item.neighborhood} ${item.type}`.toLowerCase().includes(query);
    const matchesPrice = item.price <= maxPrice;
    const matchesQuality = item.quality >= minQuality;
    const matchesRooms = item.rooms >= rooms;
    const matchesDistance = item.distance <= maxDistance;
    const matchesType = !selectedTypes.length || selectedTypes.includes(item.type);
    return matchesText && matchesPrice && matchesQuality && matchesRooms && matchesDistance && matchesType;
  });

  const sort = $("sort").value;
  if (sort === "priceAsc") result.sort((a,b) => a.price - b.price);
  if (sort === "quality") result.sort((a,b) => b.quality - a.quality);
  if (sort === "distance") result.sort((a,b) => a.distance - b.distance);
  if (sort === "best") result.sort((a,b) => valueScore(b, result.length ? result : MOCK_LISTINGS) - valueScore(a, result.length ? result : MOCK_LISTINGS));

  currentResults = result;
  render(result);
}

function useGeolocation() {
  const status = $("locationStatus");
  if (!navigator.geolocation) {
    status.textContent = "Seu navegador não oferece geolocalização.";
    return;
  }
  status.textContent = "Obtendo sua localização…";

  navigator.geolocation.getCurrentPosition(
    ({ coords }) => {
      userLocation = { lat: coords.latitude, lon: coords.longitude };
      status.textContent = "✓ Localização obtida. Os resultados podem ser priorizados pela proximidade.";
      $("userPosition").textContent = `📍 ${coords.latitude.toFixed(4)}, ${coords.longitude.toFixed(4)}`;
      // Aqui entraria uma chamada ao backend para calcular distâncias reais.
      applyFilters();
    },
    () => {
      status.textContent = "Não foi possível obter sua localização. Você ainda pode buscar por cidade ou bairro.";
      $("userPosition").textContent = "Localização não definida";
    },
    { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
  );
}

$("searchForm").addEventListener("submit", e => {
  e.preventDefault();
  applyFilters();
});

["rooms", "maxDistance", "sort", "minQuality"].forEach(id => $(id).addEventListener("change", applyFilters));
["maxPrice", "search"].forEach(id => $(id).addEventListener("input", applyFilters));
document.querySelectorAll('input[name="type"]').forEach(el => el.addEventListener("change", applyFilters));
$("locationBtn").addEventListener("click", useGeolocation);

$("clearFilters").addEventListener("click", () => {
  $("search").value = "";
  $("maxPrice").value = "";
  $("minQuality").value = "0";
  $("rooms").value = "0";
  $("maxDistance").value = "999";
  $("sort").value = "best";
  document.querySelectorAll('input[name="type"]').forEach(el => el.checked = false);
  applyFilters();
});

render(currentResults);
