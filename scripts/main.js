(() => {
  // 쿠키에서 특정 데이터 반환 (순수함수)
  const getCookie = (name) =>
    document.cookie
      .split("; ")
      .reduce((acc, curr) => {
        const [key, value] = curr.split("=");
        return key === name ? decodeURIComponent(value) : acc;
      }, "");

  // 모든 게시글 반환 API 호출 함수 (Async/Await 사용)
  const getArticles = async () => {
    try {
      const response = await fetch("/articles");
      const data = await response.json();
      return { status: response.status, data };
    } catch (error) {
      console.error(error);
      alert("네트워크 오류 발생했습니다.");
    }
  };

  document.addEventListener("DOMContentLoaded", async () => {
    const postList = document.getElementById("postList");
    const createPostBtn = document.getElementById("createPostBtn");

    const headerIcon = document.getElementById("headerIcon");
    const profileMenu = document.getElementById("profileMenu");

    headerIcon.addEventListener("click", (e) => {
      e.stopPropagation();
      profileMenu.style.display =
        profileMenu.style.display === "block" ? "none" : "block";
    });

    document.addEventListener("click", () => {
      profileMenu.style.display = "none";
    });
    profileMenu.addEventListener("click", (e) => {
      e.stopPropagation();
    });

    const editInfoBtn = document.getElementById("editInfoBtn");
    const changePwBtn = document.getElementById("changePwBtn");
    const logoutBtn = document.getElementById("logoutBtn");

    editInfoBtn.addEventListener("click", () => {
      window.location.href = "mypage.html";
    });
    changePwBtn.addEventListener("click", () => {
      window.location.href = "changePw.html";
    });
    logoutBtn.addEventListener("click", () => {
      // 로그아웃 처리 코드 추가 가능
    });

    // 헤더 아이콘 업데이트 (쿠키에 저장된 profil_image 사용)
    const profilImageFromCookie = getCookie("profil_image");
    if (profilImageFromCookie) {
      headerIcon.src = profilImageFromCookie;
    }

    // 모든 게시글 반환 API 호출
    const result = await getArticles();
    if (result && result.data.code === "SU") {
      renderPosts(result.data.articleList);
    } else {
      console.error("게시글을 불러오는 중 오류 발생:", result);
    }

    createPostBtn.addEventListener("click", () => {
      window.location.href = "createPost.html";
    });
  });

  // 게시글 목록 렌더링 함수
  function renderPosts(articles) {
    const postList = document.getElementById("postList");
    postList.innerHTML = "";

    articles.forEach((article) => {
      const postItem = document.createElement("div");
      postItem.className = "post-item";

      const titleElem = document.createElement("h3");
      titleElem.className = "post-title";
      titleElem.textContent = article.article_title;

      const metaRow = document.createElement("div");
      metaRow.className = "post-meta-row";

      const leftMeta = document.createElement("div");
      leftMeta.className = "left-meta";
      leftMeta.textContent = `조회수: ${article.view_count} | 댓글수: ${article.comment_count} | 좋아요수: ${article.like_count}`;

      const rightMeta = document.createElement("div");
      rightMeta.className = "right-meta";
      rightMeta.textContent = article.article_date;

      metaRow.appendChild(leftMeta);
      metaRow.appendChild(rightMeta);

      const authorDivider = document.createElement("hr");
      authorDivider.className = "author-divider";

      const authorElem = document.createElement("p");
      authorElem.className = "post-author";
      authorElem.textContent = `작성자: ${article.article_writer}`;

      // 게시글 클릭 시 상세 페이지로 이동
      postItem.addEventListener("click", () => {
        window.location.href = `postDetail.html?id=${article.article_num}`;
      });

      postItem.appendChild(titleElem);
      postItem.appendChild(metaRow);
      postItem.appendChild(authorDivider);
      postItem.appendChild(authorElem);

      postList.appendChild(postItem);
    });
  }
})();
