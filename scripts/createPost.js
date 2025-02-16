document.addEventListener("DOMContentLoaded", () => {
    // 뒤로가기 아이콘 클릭 시 메인 페이지로 이동
    const backBtn = document.getElementById("backBtn");
    backBtn.addEventListener("click", () => {
      window.location.href = "main.html"; 
      // 경로 주의: createPost.html과 main.html이 같은 폴더에 있다고 가정
    });
  
    // 폼 제출 시
    const createPostForm = document.getElementById("createPostForm");
    createPostForm.addEventListener("submit", (e) => {
      e.preventDefault();
  
      // 간단한 예: 입력값 확인
      const postTitle = document.getElementById("postTitle").value.trim();
      const postContent = document.getElementById("postContent").value.trim();
      // const postImage = document.getElementById("postImage").files[0]; // 이미지 파일
  
      if (!postTitle || !postContent) {
        alert("제목과 내용을 입력해주세요.");
        return;
      }
  
      // 실제 데이터 저장 로직 (JSON Server나 백엔드가 없으니 생략)
      // 여기서는 단순히 알림만 띄우고 메인 페이지로 이동
      alert("게시글이 업로드되었습니다!");
  
      // 메인 페이지로 이동
      window.location.href = "main.html";
    });
  });
  