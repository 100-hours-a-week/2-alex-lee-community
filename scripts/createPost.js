document.addEventListener("DOMContentLoaded", () => {
    const backBtn = document.getElementById("backBtn");
    backBtn.addEventListener("click", () => {
      window.location.href = "main.html"; 
    });
  
    const createPostForm = document.getElementById("createPostForm");
    createPostForm.addEventListener("submit", (e) => {
      e.preventDefault();
  
      const postTitle = document.getElementById("postTitle").value.trim();
      const postContent = document.getElementById("postContent").value.trim();
  
      if (!postTitle || !postContent) {
        alert("제목과 내용을 입력해주세요.");
        return;
      }
  
      alert("게시글이 업로드되었습니다!");
  
      window.location.href = "main.html";
    });
  });
  