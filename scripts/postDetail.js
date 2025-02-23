(() => {
  // 쿠키에서 특정 이름의 값을 반환 (순수함수)
  const getCookie = (name) =>
    document.cookie
      .split("; ")
      .reduce((acc, curr) => {
        const [key, value] = curr.split("=");
        return key === name ? decodeURIComponent(value) : acc;
      }, "");

  // 댓글 작성 API 호출 함수 (Async/Await 사용)
  const submitComment = async (articleId, commentContent) => {
    const userId = getCookie("user_id");
    if (!userId) {
      alert("로그인 정보가 없습니다.");
      return;
    }
    try {
      const response = await fetch(`/articles/${articleId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId, comment_content: commentContent })
      });
      const data = await response.json();
      return { status: response.status, data };
    } catch (error) {
      console.error(error);
      alert("네트워크 오류 발생했습니다.");
    }
  };

  // 댓글 수정 API 호출 함수 (Async/Await 사용)
  const updateComment = async (commentId, newContent) => {
    const userId = getCookie("user_id");
    if (!userId) {
      alert("로그인 정보가 없습니다.");
      return;
    }
    try {
      const response = await fetch(`/articles/comments/${commentId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId, comment_content: newContent })
      });
      const data = await response.json();
      return { status: response.status, data };
    } catch (error) {
      console.error(error);
      alert("네트워크 오류 발생했습니다.");
    }
  };

  // 댓글 삭제 API 호출 함수 (Async/Await 사용)
  const deleteComment = async (commentId) => {
    const userId = getCookie("user_id");
    if (!userId) {
      alert("로그인 정보가 없습니다.");
      return;
    }
    try {
      const response = await fetch(`/articles/comments/${commentId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId })
      });
      const data = await response.json();
      return { status: response.status, data };
    } catch (error) {
      console.error(error);
      alert("네트워크 오류 발생했습니다.");
    }
  };

  document.addEventListener("DOMContentLoaded", () => {
    // 헤더 관련 요소
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

    // 게시글 상세 관련 처리
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get("id");

    const dummyComments = {
      1: [
        { id: 101, author: "alex", date: "2025-02-17 10:00:00", content: "첫 번째 댓글!" },
        { id: 102, author: "이윤빈", date: "2025-02-17 11:00:00", content: "두 번째 댓글!" }
      ],
      2: [
        { id: 103, author: "케빈", date: "2025-02-17 12:30:00", content: "출근길 힘들죠..." }
      ]
    };

    fetch("../data/posts.json")
      .then((res) => res.json())
      .then((posts) => {
        const post = posts.find((p) => p.id == postId);
        if (!post) {
          alert("존재하지 않는 게시글입니다.");
          window.location.href = "main.html";
          return;
        }
        renderPostDetail(post);

        const commentData = dummyComments[post.id] || [];
        renderComments(commentData);
      })
      .catch((err) => {
        console.error(err);
        alert("게시글 정보를 불러오는 중 오류가 발생했습니다.");
        window.location.href = "main.html";
      });

    function renderPostDetail(post) {
      const postHeader = document.getElementById("postHeader");

      const titleElem = document.createElement("h2");
      titleElem.className = "post-header-title";
      titleElem.textContent = post.title;

      const headerMeta = document.createElement("div");
      headerMeta.className = "post-header-meta";

      const authorDateElem = document.createElement("div");
      authorDateElem.className = "post-author-date";
      authorDateElem.textContent = `${post.author} | ${post.date}`;

      const actionsElem = document.createElement("div");
      actionsElem.className = "post-actions";

      const editBtn = document.createElement("button");
      editBtn.className = "action-btn";
      editBtn.textContent = "수정";
      editBtn.addEventListener("click", () => {
        window.location.href = `postEdit.html?id=${post.id}`;
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

      // 게시글 본문 설정
      const postBody = document.getElementById("postBody");
      postBody.textContent = post.content;

      const postFooter = document.getElementById("postFooter");
      postFooter.innerHTML = `
        <div class="footer-item">
          <span>${post.views}</span>
          <label>조회수</label>
        </div>
        <div class="footer-item">
          <span>${post.likes}</span>
          <label>좋아요</label>
        </div>
        <div class="footer-item">
          <span>${post.comments}</span>
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

        // 댓글 수정 버튼 (수정 입력창 및 "수정 완료" 버튼 생성)
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
            if (result.status === 201 && result.data.code === "SU") {
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

        // 댓글 삭제 버튼
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

    // 모달 관련 요소들
    const deleteModal = document.getElementById("deleteModal");
    const modalCancelBtn = document.getElementById("modalCancelBtn");
    const modalConfirmBtn = document.getElementById("modalConfirmBtn");

    modalCancelBtn.addEventListener("click", () => {
      deleteModal.style.display = "none";
    });

    modalConfirmBtn.addEventListener("click", () => {
      alert("게시글이 삭제되었습니다 (예시).");
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
      // 댓글 삭제 API 호출
      const result = await deleteComment(selectedCommentId);
      if (result.status === 201 && result.data.code === "SU") {
        alert("댓글이 삭제되었습니다!");
        window.location.reload();
      } else {
        alert(result.data.message || "댓글 삭제에 실패했습니다.");
      }
      commentDeleteModal.style.display = "none";
      selectedCommentId = null;
    });

    // 댓글 작성 API 연동 (등록 후 페이지 리셋)
    const commentSubmitBtn = document.getElementById("commentSubmitBtn");
    commentSubmitBtn.addEventListener("click", async () => {
      const commentInput = document.getElementById("commentInput");
      const newComment = commentInput.value.trim();
      if (!newComment) {
        alert("댓글을 입력해주세요!");
        return;
      }
      const result = await submitComment(postId, newComment);
      if (result.data.code === "SU") {
        window.location.reload();
      } else {
        alert("댓글 등록에 실패했습니다.");
      }
    });
  });
})();
