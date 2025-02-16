document.addEventListener("DOMContentLoaded", () => {
    const headerIcon = document.getElementById("headerIcon");
    const profileMenu = document.getElementById("profileMenu");
  
    headerIcon.addEventListener("click", (e) => {
      e.stopPropagation();
      profileMenu.style.display = (profileMenu.style.display === "block") ? "none" : "block";
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
      alert("로그아웃 되었습니다 (예시)");
    });
  
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get("id");
  
    fetch("../data/posts.json")
      .then(res => res.json())
      .then(posts => {
        const post = posts.find(p => p.id == postId);
        if (!post) {
          alert("존재하지 않는 게시글입니다.");
          window.location.href = "main.html";
          return;
        }
        document.getElementById("editTitle").value = post.title;
        document.getElementById("editContent").value = post.content;
      })
      .catch(err => {
        console.error(err);
        alert("게시글 정보를 불러오는 중 오류가 발생했습니다.");
        window.location.href = "main.html";
      });
  
    const editForm = document.getElementById("editForm");
    editForm.addEventListener("submit", (e) => {
      e.preventDefault();
  
      const titleVal = document.getElementById("editTitle").value.trim();
      const contentVal = document.getElementById("editContent").value.trim();
  
      if (!titleVal || !contentVal) {
        alert("제목과 내용을 입력해주세요!");
        return;
      }
  
      alert("게시글이 수정되었습니다 (예시).");
  
      window.location.href = `postDetail.html?id=${postId}`;
    });
  });
  