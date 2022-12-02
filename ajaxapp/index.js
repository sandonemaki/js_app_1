async function main() {
  try {
    const userId = getUserId();
    const userInfo = await fetchUserInfo(userId);
    // ここではJSONオブジェクトで解決されるPromise
    const view = createView(userInfo);
    // ここではHTML文字列で解決されるPromise
    displayView(view);
    // promiseチェーンの中で発生したエラーを受け取る
  } catch(error) {
    console.error(`エラーが発生しました(${error})`);
  }
}

function fetchUserInfo(userId) {
  // fetchの返り値のPromiseをreturnする
  return fetch(`https://api.github.com/users/${encodeURIComponent(userId)}`)
    .then(response => {
      if (!response.ok) {
        // エラーレスポンスからRejectedなPromiseを作成して返す
        return Promise.reject(new Error(`${response.status}: ${response.statusText}`));
      } else {
        return response.json();
      }
    });
}

function getUserId() {
  return document.getElementById("userId").value;
}

function createView(userInfo) {
  return escapeHTML`
  <h4>${userInfo.name} (@${userInfo.login})</h4>
  <img src="${userInfo.avatar_url}" alt="${userInfo.login}" height="100">
    <dl>
      <dt>Location</dt>
      <dd>${userInfo.location}</dd>
      <dt>Repositories</dt>
      <dd>${userInfo.public_repos}</dd>
    </dl>
    `;
}

function displayView(view) {
  const result = document.getElementById("result")
  result.innerHTML = view;
  // console.log(userInfo);
}

function escapeSpecialChars(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function escapeHTML(strings, ...values) {
  return strings.reduce((result, str, i) => {
    const value = values[i - 1];
    if (typeof value === "string") {
      return result + escapeSpecialChars(value) + str;
    } else {
      return result + String(value) + str;
    }
  });
}
/* この行は本編とは無関係であるため無視してください。 */
window.fetchUserInfo = fetchUserInfo;
