const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  let countlikes = 0;
  blogs.forEach((blog) => {
    countlikes += blog.likes;
  });
  return countlikes;
};

const favoriteBlog = (blogs) => {
  if (blogs.length == 0) {
    return null;
  }
  let maxlikes = 0;
  let maxlikesindex = 0;
  for (let i = 0; i < blogs.length; i++) {
    if (blogs[i].likes > maxlikes) {
      maxlikes = blogs[i].likes;
      maxlikesindex = i;
    }
  }
  return blogs[maxlikesindex];
};

const mostBlogs = (blogs) => {
  if (blogs.length == 0) {
    return null;
  }
  blogcount = {};
  blogs.forEach((blog) => {
    const author = blog.author;
    if (!(author in blogcount)) {
      blogcount[author] = 1;
    } else {
      blogcount[author] += 1;
    }
  });
  let maxAuthor = "";
  let maxCount = 0;
  for (const author in blogcount) {
    if (blogcount[author] > maxCount) {
      maxCount = blogcount[author];
      maxAuthor = author;
    }
  }
  return {
    author: maxAuthor,
    blogs: maxCount,
  };
};

const mostLikes = (blogs) => {
  if (blogs.length == 0) {
    return null;
  }
  likecount = {};
  blogs.forEach((blog) => {
    const author = blog.author;
    if (!(author in likecount)) {
      likecount[author] = blog.likes;
    } else {
      likecount[author] += blog.likes;
    }
  });
  let maxAuthor = "";
  let maxCount = 0;
  for (const author in likecount) {
    if (likecount[author] > maxCount) {
      maxCount = likecount[author];
      maxAuthor = author;
    }
  }
  return {
    author: maxAuthor,
    likes: maxCount,
  };
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
};
