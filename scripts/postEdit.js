(() => {
  // 쿠키에서 특정 이름의 값을 반환 (순수함수)
  const getCookie = (name) =>
    document.cookie
      .split("; ")
      .reduce((acc, curr) => {
        const [key, value] = curr.split("=");
        return key === name ? decodeURIComponent(value) : acc;
      }, "");

  // 특정 게시글 반환 API 호출 함수 (Async/Await 사용)
  const getArticle = async (articleId) => {
    try {
      const response = await fetch(`/articles/${articleId}`);
      const data = await response.json();
      return { status: response.status, data };
    } catch (error) {
      console.error(error);
      alert("네트워크 오류 발생했습니다.");
    }
  };

  // 게시글 수정 API 호출 함수 (Async/Await 사용)
  const updateArticle = async (articleId, userId, title, content, image) => {
    try {
      const response = await fetch(`/articles/${articleId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: userId,
          article_title: title,
          article_content: content,
          article_image: image
        })
      });
      const data = await response.json();
      return { status: response.status, data };
    } catch (error) {
      console.error(error);
      alert("네트워크 오류 발생했습니다.");
    }
  };

  document.addEventListener("DOMContentLoaded", async () => {
    // 헤더 및 프로필 메뉴 처리
    const headerIcon = document.getElementById("headerIcon");
    const profileMenu = document.getElementById("profileMenu");

    // 쿠키에 저장된 profil_image 값으로 헤더 아이콘 업데이트
    const profilImageFromCookie = getCookie("profil_image");
    if (profilImageFromCookie) {
      headerIcon.src = profilImageFromCookie;
    }
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

    // 내비게이션 버튼 처리
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
      alert("로그아웃 되었습니다 (예시).");
    });

    // 게시글 수정 페이지 관련 요소
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get("id");
    const editTitleInput = document.getElementById("editTitle");
    const editContentInput = document.getElementById("editContent");
    const editImageInput = document.getElementById("editImage");
    const editForm = document.getElementById("editForm");

    // 게시글 반환 API 호출하여 수정폼에 기존 데이터 채우기
    const articleResult = await getArticle(postId);
    if (articleResult && articleResult.status === 200 && articleResult.data.code === "SU") {
      const article = articleResult.data;
      editTitleInput.value = article.article_title;
      editContentInput.value = article.article_content;
    } else {
      alert("게시글 정보를 불러오는 중 오류가 발생했습니다.");
      window.location.href = "main.html";
      return;
    }

    // 게시글 수정 폼 제출 이벤트 처리
    editForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const titleVal = editTitleInput.value.trim();
      const contentVal = editContentInput.value.trim();
      const imageVal = editImageInput.value.trim() || "";

      if (!titleVal || !contentVal) {
        alert("제목과 내용을 입력해주세요!");
        return;
      }

      const userId = getCookie("user_id");
      if (!userId) {
        alert("로그인 정보가 없습니다.");
        return;
      }

      const updateResult = await updateArticle(postId, userId, titleVal, contentVal, imageVal);
      if (updateResult && updateResult.data.code === "SU") {
        alert("게시글이 수정되었습니다!");
        window.location.href = `postDetail.html?id=${postId}`;
      } else {
        alert("게시글 수정에 실패했습니다.");
      }
    });
  });
})();
