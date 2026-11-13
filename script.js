const CORRECT_PASSWORD = "1234";

const initialMovies = [
  {
    id: 1,
    title: "トイ・ストーリー",
    date: "2026-05-10",
    rating: "★★★★★",
    color: "navy",
    image: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=500",
    memo: "ウッディとバズの友情が最高。何度見ても心が温かくなる大好きな作品。"
  },
  {
    id: 2,
    title: "グランド・ブダペスト・ホテル",
    date: "2026-05-15",
    rating: "★★★★☆",
    color: "red",
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=500",
    memo: "構図と色使いがとにかくおしゃれで可愛い！インテリアや衣装の参考にもなる。"
  },
  {
    id: 3,
    title: "ラ・ラ・ランド",
    date: "2026-05-20",
    rating: "★★★★★",
    color: "purple",
    image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500",
    memo: "音楽と映像美が素晴らしい。切ないけれど前向きになれるラストが好き。"
  }
];

let movies = JSON.parse(localStorage.getItem("my_movies")) || initialMovies;
let currentFilter = "all"; // 最初は「すべて」を表示
const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500";

const loginScreen = document.getElementById("login-screen");
const appScreen = document.getElementById("app-screen");
const loginForm = document.getElementById("login-form");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const errorMsg = document.getElementById("error-msg");
const userDisplay = document.getElementById("user-display");
const logoutBtn = document.getElementById("logout-btn");
const movieContainer = document.getElementById("movie-list");

const addMovieForm = document.getElementById("add-movie-form");
const titleInput = document.getElementById("movie-title-input");
const dateInput = document.getElementById("movie-date-input");
const ratingInput = document.getElementById("movie-rating-input");
const colorInput = document.getElementById("movie-color-input");
const memoInput = document.getElementById("movie-memo-input");

const imageInput = document.getElementById("movie-image-input");
const imagePreview = document.getElementById("image-preview");
const previewContainer = document.getElementById("image-preview-container");
const removeImageBtn = document.getElementById("remove-image-btn");

let uploadedImageUrl = ""; // 選んだ画像を一時保存する変数

const modal = document.getElementById("movie-modal");
const closeModalBtn = document.getElementById("close-modal-btn");
const modalPoster = document.getElementById("modal-poster");
const modalTitle = document.getElementById("modal-title");
const modalDate = document.getElementById("modal-date");
const modalRating = document.getElementById("modal-rating");
const modalMemo = document.getElementById("modal-memo");

function saveMovies() {
  localStorage.setItem("my_movies", JSON.stringify(movies));
}

loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const username = usernameInput.value.trim();
  const password = passwordInput.value;

  if (password === CORRECT_PASSWORD) {
    errorMsg.textContent = "";
    loginScreen.classList.add("hidden");
    appScreen.classList.remove("hidden");
    userDisplay.textContent = `👤 ${username} さん`;
    renderMovies();
  } else {
    errorMsg.textContent = "パスワードが正しくありません";
  }
});

logoutBtn.addEventListener("click", () => {
  appScreen.classList.add("hidden");
  loginScreen.classList.remove("hidden");
  passwordInput.value = "";
});

// --- 写真が選択されたときの処理 ---
if (imageInput) {
  imageInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function(event) {
        uploadedImageUrl = event.target.result;
        imagePreview.src = uploadedImageUrl;
        previewContainer.classList.remove("hidden");
      };
      reader.readAsDataURL(file);
    }
  });
}

if (removeImageBtn) {
  removeImageBtn.addEventListener("click", () => {
    imageInput.value = "";
    uploadedImageUrl = "";
    previewContainer.classList.add("hidden");
  });
}

addMovieForm.addEventListener("submit", (e) => {
  e.preventDefault();

  /*const imageUrl = imageInput.value.trim() !== "" ? imageInput.value.trim() : DEFAULT_IMAGE;*/
  const finalImage = uploadedImageUrl && uploadedImageUrl.trim() !== "" ? uploadedImageUrl : DEFAULT_IMAGE;

  const newMovie = {
    id: Date.now(),
    title: titleInput.value,
    date: dateInput.value,
    rating: ratingInput.value,
    color: colorInput.value,
    image: finalImage,
    memo: memoInput.value
  };

  movies.unshift(newMovie);
  saveMovies();
  addMovieForm.reset();

  // 画像プレビューをリセット
  uploadedImageUrl = "";
  if (previewContainer) {
    previewContainer.classList.add("hidden");
  }
  
  renderMovies();

  const submitBtn = e.target.querySelector('button[type="submit"]');
  createPopcornBurst(submitBtn);
});

function createPopcornBurst(targetElement) {
  const rect = targetElement.getBoundingClientRect();
  const startX = rect.left + rect.width / 2;
  const startY = rect.top + rect.height / 2;

  for (let i = 0; i < 18; i++) {
    const popcorn = document.createElement("div");
    popcorn.className = "popcorn-particle";
    popcorn.textContent = "🍿";
    popcorn.style.left = `${startX}px`;
    popcorn.style.top = `${startY}px`;

    const angle = Math.random() * Math.PI * 2;
    const distance = 80 + Math.random() * 140;
    const dx = Math.cos(angle) * distance;
    const dy = Math.sin(angle) * distance - 40;

    popcorn.style.setProperty("--dx", `${dx}px`);
    popcorn.style.setProperty("--dy", `${dy}px`);

    document.body.appendChild(popcorn);
    setTimeout(() => popcorn.remove(), 900);
  }
}

function deleteMovie(event, id) {
  event.stopPropagation();
  movies = movies.filter(movie => movie.id !== id);
  saveMovies();
  renderMovies();
}

// お気に入り状態をオン/オフ切り替え
function toggleFavorite(event, id) {
  event.stopPropagation(); // カードのモーダルが開くのを防ぐ
  movies = movies.map(movie => {
    if (movie.id === id) {
      return { ...movie, isFavorite: !movie.isFavorite };
    }
    return movie;
  });
  saveMovies();
  renderMovies();
}

// フィルターバーのボタンをクリックしたときの処理
// --- にょきっと出るドロップダウンメニューの処理 ---
const dropdownContainer = document.querySelector(".dropdown-container");
const dropdownBtn = document.getElementById("dropdown-btn");
const currentFilterText = document.getElementById("current-filter-text");
const filterOptions = document.querySelectorAll(".filter-option");

// ボタンを押したら開く・閉じる
if (dropdownBtn) {
  dropdownBtn.addEventListener("click", (e) => {
    e.stopPropagation(); // 画面クリック判定とぶつからないようにする
    dropdownContainer.classList.toggle("open");
  });
}

// 選択肢を選んだときの処理
filterOptions.forEach(option => {
  option.addEventListener("click", () => {
    // 選択中の見た目を更新
    filterOptions.forEach(opt => opt.classList.remove("active"));
    option.classList.add("active");

    // ボタンの文字を選んだ項目に変える
    currentFilterText.textContent = option.textContent;

    // 絞り込みを実行してメニューを閉じる
    currentFilter = option.dataset.filter;
    dropdownContainer.classList.remove("open");
    renderMovies();
  });
});

// メニュー以外の画面のどこかをクリックしたら自動で閉じる
document.addEventListener("click", (e) => {
  if (dropdownContainer && !dropdownContainer.contains(e.target)) {
    dropdownContainer.classList.remove("open");
  }
});

function openModal(movie) {
  modalPoster.src = movie.image;
  modalTitle.textContent = movie.title;
  modalDate.textContent = movie.date;
  modalRating.textContent = movie.rating;
  modalMemo.textContent = movie.memo;
  modal.classList.remove("hidden");
}

closeModalBtn.addEventListener("click", () => {
  modal.classList.add("hidden");
});

modal.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.classList.add("hidden");
  }
});

function renderMovies() {
  movieContainer.innerHTML = "";

  // 選ばれているフィルターに応じて表示する映画を絞り込む
  const filteredMovies = movies.filter(movie => {
    if (currentFilter === "all") return true;
    if (currentFilter === "favorite") return movie.isFavorite === true;
    return movie.color === currentFilter;
  });

  filteredMovies.forEach(movie => {
    const card = document.createElement("div");
    
    const colorClass = `ticket-${movie.color || 'navy'}`;
    card.className = `movie-card ${colorClass}`;
    
    card.addEventListener("click", () => {
      openModal(movie);
    });

    // お気に入り状態ならクラスをつける
    const favClass = movie.isFavorite ? "fav-btn is-fav" : "fav-btn";

    card.innerHTML = `
      <div class="ticket-main">
        <h3 class="card-title">🎬 ${movie.title}</h3>
        <div class="card-date">📅 ${movie.date}</div>
        <div class="card-rating">${movie.rating}</div>
      </div>
      <div class="ticket-stub">
        <span class="ticket-stub-text">ADMIT ONE</span>
        <div class="ticket-actions">
          <button class="${favClass}" onclick="toggleFavorite(event, ${movie.id})" title="お気に入り">💖</button>
          <button class="delete-btn" onclick="deleteMovie(event, ${movie.id})">削除</button>
        </div>
      </div>
    `;
    movieContainer.appendChild(card);
  });
}

// --- 星が降る演出 ---
function createFallingStar() {
    const star = document.createElement("div");
    star.className = "falling-star";
    
    // 星の種類や見た目をランダムにする
    const starTypes = ["⭐"];
    star.textContent = starTypes[Math.floor(Math.random() * starTypes.length)];
    
    // 横の発生位置、落下スピード、大きさをランダムに決定
    star.style.left = Math.random() * window.innerWidth + "px";
    const duration = 8 + Math.random() * 10; // 4秒〜10秒かけて落ちる
    star.style.animationDuration = duration + "s";
    
    const size = 0.6 + Math.random() * 0.8; // 大きさのばらつき
    star.style.fontSize = size + "rem";
    
    document.body.appendChild(star);
    
    // アニメーションが終わったら要素を消す
    setTimeout(() => {
        star.remove();
    }, duration * 1000);
}

// 一定間隔（例：300ミリ秒ごと）に星をポコポコ降らせる
setInterval(createFallingStar, 300);