// Add your JavaScript code here
const API_URL = '/blog';
const AUTH_URL = '/auth';

const blogPostsElement = document.getElementById('blog-posts');
const blogForm = document.getElementById('blog-form');
const titleInput = document.getElementById('title-input');
const contentInput = document.getElementById('content-input');
const usernameElement = document.getElementById('username');
const logoutButton = document.getElementById('logout-btn');

let token = '';

// Helper function to make API requests with the authorization token
async function fetchAPI(url, options = {}) {
  if (token) {
    options.headers = {
      ...options.headers,
      Authorization: `Bearer ${token}`,
    };
  }
  const response = await fetch(url, options);
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'An error occurred');
  }
  return data;
}

// Display the blog posts on the page
async function displayBlogPosts() {
  try {
    const blogPosts = await fetchAPI(API_URL);
    blogPostsElement.innerHTML = '';
    blogPosts.forEach((post) => {
      const postElement = document.createElement('div');
      postElement.classList.add('blog-post');
      postElement.innerHTML = `
        <h3>${post.title}</h3>
        <p>${post.content}</p>
        <small>By ${post.author}</small>
      `;
      blogPostsElement.appendChild(postElement);
    });
  } catch (err) {
    console.error('Error fetching blog posts:', err);
  }
}

// Create a new blog post
async function createBlogPost() {
  const title = titleInput.value;
  const content = contentInput.value;

  try {
    await fetchAPI(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title, content }),
    });
    titleInput.value = '';
    contentInput.value = '';
    displayBlogPosts();
  } catch (err) {
    console.error('Error creating blog post:', err);
  }
}

// Logout the user
function logout() {
  token = '';
  usernameElement.textContent = '';
  blogForm.style.display = 'none';
  logoutButton.style.display = 'none';
}

// Event listener for the blog form submission
blogForm.addEventListener('submit', (e) => {
  e.preventDefault();
  createBlogPost();
});

// Event listener for the logout button
logoutButton.addEventListener('click', logout);

// Check if the user is logged in
async function checkLoggedIn() {
  const tokenFromStorage = localStorage.getItem('token');
  if (tokenFromStorage) {
    token = tokenFromStorage;
    try {
      const response = await fetchAPI(`${AUTH_URL}/profile`);
      usernameElement.textContent = response.username;
      blogForm.style.display = 'block';
      logoutButton.style.display = 'inline-block';
    } catch (err) {
      console.error('Error checking logged in:', err);
    }
  }
}

// Initialize the page
displayBlogPosts();
checkLoggedIn();
