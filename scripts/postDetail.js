(() => {
  const getCookie = (name) =>
    document.cookie
      .split("; ")
      .reduce((acc, curr) => {
        const [key, value] = curr.split("=");
        return key === name ? decodeURIComponent(value) : acc;
      }, "");

  const getPost = async (postId) => {
    try {
      const response = await fetch(`http://localhost:8080/posts/${postId}`);
      const text = await response.text();
      try {
        const data = JSON.parse(text);
        return data;
      } catch (parseError) {
        console.error("❌ JSON 파싱 실패:", text);
        return { code: "ERR", message: "Invalid JSON response" };
      }
    } catch (error) {
      alert("네트워크 오류 발생했습니다.");
    }
  };

  const submitComment = async (postId, commentContent) => {
    const userId = getCookie("user_id");
    console.log("userId from cookie:", userId);
    if (!userId) {
      alert("로그인 정보가 없습니다.");
      return;
    }
    try {
      const response = await fetch(`http://localhost:8080/posts/${postId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId, comment_content: commentContent })
      });
      return await response.json();
    } catch (error) {
      console.error(error);
      alert("네트워크 오류 발생했습니다.");
    }
  };

  const updateComment = async (commentId, newContent) => {
    const userId = getCookie("user_id");
    if (!userId) {
      alert("로그인 정보가 없습니다.");
      return;
    }
    try {
      const response = await fetch(`http://localhost:8080/posts/comments/${commentId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId, comment_content: newContent })
      });
      return await response.json();
    } catch (error) {
      console.error(error);
      alert("네트워크 오류 발생했습니다.");
    }
  };

  const deleteComment = async (commentId) => {
    const userId = getCookie("user_id");
    if (!userId) {
      alert("로그인 정보가 없습니다.");
      return;
    }
    try {
      const response = await fetch(`http://localhost:8080/posts/comments/${commentId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId })
      });
      return await response.json();
    } catch (error) {
      console.error(error);
      alert("네트워크 오류 발생했습니다.");
    }
  };

  const getComments = async (postId) => {
    try {
      const response = await fetch(`http://localhost:8080/posts/${postId}/comments`);
      return await response.json();
    } catch (error) {
      console.error(error);
      alert("네트워크 오류 발생했습니다.");
    }
  };

  const deletePost = async (postId) => {
    const userId = getCookie("user_id");
    if (!userId) {
      alert("로그인 정보가 없습니다.");
      return;
    }
    try {
      const response = await fetch(`http://localhost:8080/posts/${postId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId })
      });
      return await response.json();
    } catch (error) {
      console.error(error);
      alert("네트워크 오류 발생했습니다.");
    }
  };

  document.addEventListener("DOMContentLoaded", () => {
    const headerIcon = document.getElementById("headerIcon");
    const profileMenu = document.getElementById("profileMenu");

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

    document.getElementById("editInfoBtn").addEventListener("click", () => {
      window.location.href = "mypage.html";
    });
    document.getElementById("changePwBtn").addEventListener("click", () => {
      window.location.href = "changePw.html";
    });
    document.getElementById("logoutBtn").addEventListener("click", () => {
      alert("로그아웃 되었습니다 (예시).")
    });

    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get("id");

    console.log("✅ postId:", postId); // 디버깅용 로그

    getPost(postId).then((result) => {
      console.log("📦 게시글 응답:", result); // 디버깅용 로그
      if (result.code === "SU") {
        renderPostDetail(result);
        getComments(postId).then((commentsResult) => {
          console.log("💬 댓글 응답:", commentsResult); // 디버깅용 로그
          if (commentsResult && commentsResult.code === "SU") {
            const commentData = commentsResult.commentList.map((c) => ({
              id: c.comment_num,
              author: c.comment_writer,
              date: c.comment_date,
              content: c.comment_content
            }));
            renderComments(commentData);
          } else {
            renderComments([]);
          }
        });
      } else if (result.code === "NP") {
        alert("존재하지 않는 게시글입니다.");
        window.location.href = "main.html";
      } else {
        alert(result.message || "게시글을 불러올 수 없습니다.");
        window.location.href = "main.html";
      }
    }).catch((err) => {
      console.error(err);
      alert("서버 오류가 발생했습니다.");
      window.location.href = "main.html";
    });

    function renderPostDetail(post) {
      const postHeader = document.getElementById("postHeader");
    
      const titleElem = document.createElement("h2");
      titleElem.className = "post-header-title";
      titleElem.textContent = post.post_title;
    
      const headerMeta = document.createElement("div");
      headerMeta.className = "post-header-meta";
    
      const authorDateElem = document.createElement("div");
      authorDateElem.className = "post-author-date";
      const formattedDate = post.post_date.replace("T", " ");
      authorDateElem.textContent = `${post.post_writer} | ${formattedDate}`;
    
      const actionsElem = document.createElement("div");
      actionsElem.className = "post-actions";
    
      const editBtn = document.createElement("button");
      editBtn.className = "action-btn";
      editBtn.textContent = "수정";
      editBtn.addEventListener("click", () => {
        window.location.href = `postEdit.html?id=${post.post_id}`;
      });
    
      const deleteBtn = document.createElement("button");
      deleteBtn.className = "action-btn";
      deleteBtn.textContent = "삭제";
      deleteBtn.addEventListener("click", () => {
        deleteModal.style.display = "flex";
      });
    
      actionsElem.appendChild(editBtn);
      actionsElem.appendChild(deleteBtn);
    
      headerMeta.appendChild(authorDateElem);
      headerMeta.appendChild(actionsElem);
    
      postHeader.appendChild(titleElem);
      postHeader.appendChild(headerMeta);
    
      const postBody = document.getElementById("postBody");
      postBody.innerHTML = "";
    
      // 이미지가 있으면 표시
      if (post.post_image && post.post_image.trim() !== "") {
        const imgElem = document.createElement("img");
        imgElem.src = post.post_image;
        imgElem.alt = "게시글 이미지";
        imgElem.className = "post-image"; // CSS로 스타일 조절 가능
        postBody.appendChild(imgElem);
      }
    
      // 본문 텍스트 표시
      const contentElem = document.createElement("div");
      contentElem.className = "post-content";
      contentElem.textContent = post.post_content;
      postBody.appendChild(contentElem);
    
      const postFooter = document.getElementById("postFooter");
      postFooter.innerHTML = `
        <div class="footer-item">
          <span>${post.view_count}</span>
          <label>조회수</label>
        </div>
        <div class="footer-item">
          <span>${post.like_count}</span>
          <label>좋아요</label>
        </div>
        <div class="footer-item">
          <span>${post.comment_count}</span>
          <label>댓글</label>
        </div>
      `;
    }

    function renderComments(comments) {
      const commentList = document.getElementById("commentList");
      commentList.innerHTML = "";

      comments.forEach((comment) => {
        const commentItem = document.createElement("div");
        commentItem.className = "comment-item";

        const topRow = document.createElement("div");
        topRow.className = "comment-top-row";

        const authorDate = document.createElement("div");
        authorDate.className = "comment-author-date";
        authorDate.textContent = `${comment.author} | ${comment.date}`;

        const commentActions = document.createElement("div");
        commentActions.className = "comment-actions";

        const commentEditBtn = document.createElement("button");
        commentEditBtn.className = "comment-btn";
        commentEditBtn.textContent = "수정";
        commentEditBtn.addEventListener("click", () => {
          const contentElem = commentItem.querySelector(".comment-content");
          if (commentItem.querySelector("input.comment-edit-input")) return;

          const editInput = document.createElement("input");
          editInput.className = "comment-edit-input";
          editInput.type = "text";
          editInput.value = comment.content;

          const finishBtn = document.createElement("button");
          finishBtn.className = "comment-edit-finish-btn";
          finishBtn.textContent = "수정 완료";
          finishBtn.addEventListener("click", async () => {
            const newContent = editInput.value.trim();
            if (!newContent) {
              alert("댓글 내용을 입력해주세요!");
              return;
            }
            const result = await updateComment(comment.id, newContent);
            if (result.code === "SU") {
              alert("댓글 수정 성공!");
              contentElem.textContent = newContent;
            } else {
              alert("댓글 수정에 실패했습니다.");
            }
            editInput.remove();
            finishBtn.remove();
            contentElem.style.display = "";
          });

          contentElem.style.display = "none";
          commentItem.appendChild(editInput);
          commentItem.appendChild(finishBtn);
        });

        const commentDeleteBtn = document.createElement("button");
        commentDeleteBtn.className = "comment-btn";
        commentDeleteBtn.textContent = "삭제";
        commentDeleteBtn.addEventListener("click", () => {
          selectedCommentId = comment.id;
          commentDeleteModal.style.display = "flex";
        });

        commentActions.appendChild(commentEditBtn);
        commentActions.appendChild(commentDeleteBtn);

        topRow.appendChild(authorDate);
        topRow.appendChild(commentActions);

        const contentElem = document.createElement("div");
        contentElem.className = "comment-content";
        contentElem.textContent = comment.content;

        commentItem.appendChild(topRow);
        commentItem.appendChild(contentElem);
        commentList.appendChild(commentItem);
      });
    }

    const deleteModal = document.getElementById("deleteModal");
    const modalCancelBtn = document.getElementById("modalCancelBtn");
    const modalConfirmBtn = document.getElementById("modalConfirmBtn");

    modalCancelBtn.addEventListener("click", () => {
      deleteModal.style.display = "none";
    });

    modalConfirmBtn.addEventListener("click", async () => {
      const result = await deletePost(postId);
      
      if (result && result.code === "SU") {
        alert("게시글이 삭제되었습니다!");
        window.location.href = "main.html";
      } else if (result && result.code === "PE") {
        alert("게시글 삭제 권한이 없습니다.");
      } else {
        alert(result && result.message ? result.message : "게시글 삭제에 실패했습니다.");
      }
    
      deleteModal.style.display = "none";
    });

    const commentDeleteModal = document.getElementById("commentDeleteModal");
    const commentModalCancelBtn = document.getElementById("commentModalCancelBtn");
    const commentModalConfirmBtn = document.getElementById("commentModalConfirmBtn");

    let selectedCommentId = null;

    commentModalCancelBtn.addEventListener("click", () => {
      commentDeleteModal.style.display = "none";
      selectedCommentId = null;
    });

    commentModalConfirmBtn.addEventListener("click", async () => {
      const result = await deleteComment(selectedCommentId);
    
      if (result && result.code === "SU") {
        alert("댓글이 삭제되었습니다!");
        window.location.reload();
      } else if (result && result.code === "PE") {
        alert("댓글 삭제 권한이 없습니다.");
      } else {
        alert(result && result.message ? result.message : "댓글 삭제에 실패했습니다.");
      }
    
      commentDeleteModal.style.display = "none";
      selectedCommentId = null;
    });

    const commentSubmitBtn = document.getElementById("commentSubmitBtn");
    commentSubmitBtn.addEventListener("click", async () => {
      const commentInput = document.getElementById("commentInput");
      const newComment = commentInput.value.trim();
      if (!newComment) {
        alert("댓글을 입력해주세요!");
        return;
      }
      const result = await submitComment(postId, newComment);
      if (result && result.code === "SU") {
        window.location.reload();
      } else {
        alert("댓글 등록에 실패했습니다.");
      }
    });
  });
})();
