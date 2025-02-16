document.addEventListener("DOMContentLoaded", () => {
    const postList = document.getElementById("postList");
    const createPostBtn = document.getElementById("createPostBtn");
  
    fetch("../data/posts.json")
      .then(response => {
        if (!response.ok) {
          throw new Error("네트워크 응답이 올바르지 않습니다.");
        }
        return response.json();
      })
      .then(postsData => {
        renderPosts(postsData);
      })
      .catch(error => {
        console.error("게시글을 가져오는 중 오류 발생:", error);
        postList.innerHTML = "<p>게시글을 불러오는 중 오류가 발생했습니다.</p>";
      });
  
    function renderPosts(posts) {
      postList.innerHTML = "";
  
      posts.forEach(post => {
        const postItem = document.createElement("div");
        postItem.className = "post-item";
  
        const titleElem = document.createElement("h3");
        titleElem.className = "post-title";
        titleElem.textContent = post.title;
  
        const metaRow = document.createElement("div");
        metaRow.className = "post-meta-row";
  
        const leftMeta = document.createElement("div");
        leftMeta.className = "left-meta";
        leftMeta.textContent = `조회수: ${post.views} | 댓글수: ${post.comments} | 좋아요수: ${post.likes}`;
  
        const rightMeta = document.createElement("div");
        rightMeta.className = "right-meta";
        rightMeta.textContent = post.date;
  
        metaRow.appendChild(leftMeta);
        metaRow.appendChild(rightMeta);
  
        const authorDivider = document.createElement("hr");
        authorDivider.className = "author-divider";
  
        const authorElem = document.createElement("p");
        authorElem.className = "post-author";
        authorElem.textContent = `작성자: ${post.author}`;
  
        postItem.addEventListener("click", () => {
          alert(`'${post.title}' 게시글을 클릭했습니다.`);
          // window.location.href = `postDetail.html?id=${post.id}`;
        });
  
        postItem.appendChild(titleElem);
        postItem.appendChild(metaRow);
        postItem.appendChild(authorDivider);
        postItem.appendChild(authorElem);
  
        postList.appendChild(postItem);
      });
    }
  
    createPostBtn.addEventListener("click", () => {
      alert("게시글 작성 페이지로 이동합니다 (예시)");
    });
  });
  