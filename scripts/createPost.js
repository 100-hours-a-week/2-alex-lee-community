(() => {
  // 쿠키에서 특정 이름의 값을 반환 (순수함수)
  const getCookie = (name) =>
    document.cookie
      .split("; ")
      .reduce((acc, curr) => {
        const [key, value] = curr.split("=");
        return key === name ? decodeURIComponent(value) : acc;
      }, "");

  // 게시글 작성 API 호출 함수 (Async/Await 사용)
  const createPostApi = async (userId, title, content, image) => {
    try {
      const response = await fetch("/articles", {
        method: "POST",
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

  document.addEventListener("DOMContentLoaded", () => {
    // 헤더 이미지 업데이트: 쿠키에 저장된 profil_image 값을 사용
    const headerIcon = document.getElementById("headerIcon");
    const profilImageFromCookie = getCookie("profil_image");
    if (profilImageFromCookie) {
      headerIcon.src = profilImageFromCookie;
    }

    // 게시글 작성 폼 제출 이벤트 처리
    const createPostForm = document.getElementById("createPostForm");
    createPostForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const postTitle = document.getElementById("postTitle").value.trim();
      const postContent = document.getElementById("postContent").value.trim();
      const articleImage =
        document.getElementById("postImageInput")?.value.trim() || "";

      if (!postTitle || !postContent) {
        alert("제목과 내용을 입력해주세요.");
        return;
      }

      // 쿠키에서 user_id 추출
      const userId = getCookie("user_id");
      if (!userId) {
        alert("로그인 정보가 없습니다.");
        return;
      }

      const result = await createPostApi(userId, postTitle, postContent, articleImage);
      if (result && result.data.code === "SU") {
        alert("게시글이 업로드되었습니다!");
        window.location.href = "main.html";
      } else {
        alert("게시글 업로드에 실패했습니다.");
      }
    });
  });
})();
