const CORRECT_PASSWORD = "1234";

// 1. 映画のデータを用意する
const movies = [
  {
    title: "トイ・ストーリー",
    rating: "★★★★★",
    image: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=500",
    memo: "ウッディとバズの友情が最高。何度見ても心が温かくなる大好きな作品。"
  },
  {
    title: "グランド・ブダペスト・ホテル",
    rating: "★★★★☆",
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=500",
    memo: "構図と色使いがとにかくおしゃれで可愛い！インテリアや衣装の参考にもなる。"
  },
  {
    title: "ラ・ラ・ランド",
    rating: "★★★★★",
    image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500",
    memo: "音楽と映像美が素晴らしい。切ないけれど前向きになれるラストが好き。"
  }
];

// --- HTML要素の取得 ---
const loginScreen = document.getElementById("login-screen");
const appScreen = document.getElementById("app-screen");
const loginForm = document.getElementById("login-form");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const errorMsg = document.getElementById("error-msg");
const userDisplay = document.getElementById("user-display");
const logoutBtn = document.getElementById("logout-btn");
const movieContainer = document.getElementById("movie-list");

// --- 1. ログイン処理 ---
loginForm.addEventListener("submit", (e) => {
  e.preventDefault(); // 画面リロードを防止

  const username = usernameInput.value.trim();
  const password = passwordInput.value;

  // パスワード判定
  if (password === CORRECT_PASSWORD) {
    // ログイン成功
    errorMsg.textContent = "";
    loginScreen.classList.add("hidden");
    appScreen.classList.remove("hidden");
    userDisplay.textContent = `👤 ${username} さん`;
    
    // 映画リストを表示
    renderMovies();
  } else {
    // ログイン失敗
    errorMsg.textContent = "パスワードが正しくありません";
  }
});

// --- 2. ログアウト処理 ---
logoutBtn.addEventListener("click", () => {
  appScreen.classList.add("hidden");
  loginScreen.classList.remove("hidden");
  passwordInput.value = ""; // パスワードをクリア
});

// 3. 画面にカードを表示する処理
function renderMovies() {
  movieContainer.innerHTML = ""; // 初期化

  movies.forEach(movie => {
    // カードの箱を作る
    const card = document.createElement("div");
    card.className = "movie-card";

    // カードの中身（HTML）を組み立てる
    card.innerHTML = `
      <img class="movie-poster" src="${movie.image}" alt="${movie.title}">
      <div class="movie-info">
        <h2 class="movie-title">${movie.title}</h2>
        <div class="movie-rating">${movie.rating}</div>
        <p class="movie-memo">${movie.memo}</p>
      </div>
    `;

    // 画面（#movie-list）に追加する
    movieContainer.appendChild(card);
  });
}