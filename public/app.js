// API endpoints
const API_URL = window.location.origin + '/api';
const BOOKS_API = `${API_URL}/books`;
const AUTHORS_API = `${API_URL}/authors`;

// Bootstrap modal instances
let bookModal;
let authorModal;

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    bookModal = new bootstrap.Modal(document.getElementById('bookModal'));
    authorModal = new bootstrap.Modal(document.getElementById('authorModal'));
    loadBooks();
    loadAuthorsForSelect();
});

// Navigation functions
function showBooks() {
    document.getElementById('booksSection').style.display = 'block';
    document.getElementById('authorsSection').style.display = 'none';
    loadBooks();
}

function showAuthors() {
    document.getElementById('booksSection').style.display = 'none';
    document.getElementById('authorsSection').style.display = 'block';
    loadAuthors();
}

// Book functions
async function loadBooks() {
    try {
        const response = await fetch(BOOKS_API);
        const books = await response.json();
        const booksList = document.getElementById('booksList');
        booksList.innerHTML = '';
        
        books.forEach(book => {
            const card = document.createElement('div');
            card.className = 'col-md-4 mb-4';
            card.innerHTML = `
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">${book.title}</h5>
                        <p class="card-text">ISBN: ${book.isbn || 'N/A'}</p>
                        <p class="card-text">Author: ${book.author ? `${book.author.firstName} ${book.author.lastName}` : 'Unknown'}</p>
                        <p class="card-text">Published: ${book.publishedYear || 'N/A'}</p>
                        <p class="card-text book-price">Price: $${book.price || '0.00'}</p>
                        <div class="btn-group">
                            <button class="btn btn-primary btn-sm" onclick="editBook(${book.id})">Edit</button>
                            <button class="btn btn-danger btn-sm" onclick="deleteBook(${book.id})">Delete</button>
                        </div>
                    </div>
                </div>
            `;
            booksList.appendChild(card);
        });
    } catch (error) {
        console.error('Error loading books:', error);
    }
}

async function loadAuthorsForSelect() {
    try {
        const response = await fetch(AUTHORS_API);
        const authors = await response.json();
        const select = document.getElementById('bookAuthor');
        select.innerHTML = '<option value="">Select an author</option>';
        authors.forEach(author => {
            select.innerHTML += `
                <option value="${author.id}">${author.firstName} ${author.lastName}</option>
            `;
        });
    } catch (error) {
        console.error('Error loading authors:', error);
    }
}

function showBookForm(bookId = null) {
    document.getElementById('bookForm').reset();
    document.getElementById('bookId').value = '';
    if (!bookId) {
        document.getElementById('bookModalLabel').textContent = 'Add New Book';
    }
    bookModal.show();
}

async function editBook(id) {
    try {
        const response = await fetch(`${BOOKS_API}/${id}`);
        const book = await response.json();
        
        document.getElementById('bookId').value = book.id;
        document.getElementById('bookTitle').value = book.title;
        document.getElementById('bookIsbn').value = book.isbn;
        document.getElementById('bookYear').value = book.publishedYear;
        document.getElementById('bookDescription').value = book.description;
        document.getElementById('bookPrice').value = book.price;
        document.getElementById('bookAuthor').value = book.authorId;
        
        document.getElementById('bookModalLabel').textContent = 'Edit Book';
        bookModal.show();
    } catch (error) {
        console.error('Error loading book details:', error);
    }
}

async function saveBook() {
    const bookId = document.getElementById('bookId').value;
    const bookData = {
        title: document.getElementById('bookTitle').value,
        isbn: document.getElementById('bookIsbn').value,
        publishedYear: parseInt(document.getElementById('bookYear').value) || null,
        description: document.getElementById('bookDescription').value,
        price: parseFloat(document.getElementById('bookPrice').value) || 0,
        authorId: parseInt(document.getElementById('bookAuthor').value)
    };

    // Validate required fields
    if (!bookData.title) {
        alert('Title is required');
        return;
    }
    if (!bookData.authorId) {
        alert('Please select an author');
        return;
    }

    try {
        const url = bookId ? `${BOOKS_API}/${bookId}` : BOOKS_API;
        const method = bookId ? 'PUT' : 'POST';
        
        console.log('Sending book data:', { url, method, bookData });
        
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(bookData)
        });

        const data = await response.json();
        
        if (!response.ok) {
            console.error('Server error:', {
                status: response.status,
                statusText: response.statusText,
                data
            });
            
            let errorMessage = 'Failed to save book. ';
            if (data.errors) {
                errorMessage += data.errors.map(e => `${e.field}: ${e.message}`).join(', ');
            } else if (data.message) {
                errorMessage += data.message;
            }
            
            alert(errorMessage);
            return;
        }

        console.log('Book saved successfully:', data);
        document.getElementById('bookForm').reset();
        bookModal.hide();
        await loadBooks();
    } catch (error) {
        console.error('Error saving book:', error);
        alert('Network error while saving book. Please check your connection and try again.');
    }
}

async function deleteBook(id) {
    if (confirm('Are you sure you want to delete this book?')) {
        try {
            const response = await fetch(`${BOOKS_API}/${id}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                loadBooks();
            }
        } catch (error) {
            console.error('Error deleting book:', error);
        }
    }
}

// Author functions
async function loadAuthors() {
    try {
        const response = await fetch(AUTHORS_API);
        const authors = await response.json();
        const authorsList = document.getElementById('authorsList');
        authorsList.innerHTML = '';
        
        authors.forEach(author => {
            const card = document.createElement('div');
            card.className = 'col-md-4 mb-4';
            card.innerHTML = `
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">${author.firstName} ${author.lastName}</h5>
                        <p class="card-text">Birth Date: ${author.birthDate ? new Date(author.birthDate).toLocaleDateString() : 'N/A'}</p>
                        <p class="card-text">${author.biography || 'No biography available'}</p>
                        <div class="btn-group">
                            <button class="btn btn-primary btn-sm" onclick="editAuthor(${author.id})">Edit</button>
                            <button class="btn btn-danger btn-sm" onclick="deleteAuthor(${author.id})">Delete</button>
                        </div>
                    </div>
                </div>
            `;
            authorsList.appendChild(card);
        });
    } catch (error) {
        console.error('Error loading authors:', error);
    }
}

function showAuthorForm(authorId = null) {
    document.getElementById('authorForm').reset();
    document.getElementById('authorId').value = '';
    if (!authorId) {
        document.getElementById('authorModalLabel').textContent = 'Add New Author';
    }
    authorModal.show();
}

async function editAuthor(id) {
    try {
        const response = await fetch(`${AUTHORS_API}/${id}`);
        const author = await response.json();
        
        document.getElementById('authorId').value = author.id;
        document.getElementById('authorFirstName').value = author.firstName;
        document.getElementById('authorLastName').value = author.lastName;
        document.getElementById('authorBiography').value = author.biography;
        document.getElementById('authorBirthDate').value = author.birthDate ? author.birthDate.split('T')[0] : '';
        
        document.getElementById('authorModalLabel').textContent = 'Edit Author';
        authorModal.show();
    } catch (error) {
        console.error('Error loading author details:', error);
    }
}

async function saveAuthor() {
    const authorId = document.getElementById('authorId').value;
    const authorData = {
        firstName: document.getElementById('authorFirstName').value,
        lastName: document.getElementById('authorLastName').value,
        biography: document.getElementById('authorBiography').value,
        birthDate: document.getElementById('authorBirthDate').value
    };

    try {
        const url = authorId ? `${AUTHORS_API}/${authorId}` : AUTHORS_API;
        const method = authorId ? 'PUT' : 'POST';
        
        console.log('Sending author data:', { url, method, authorData });
        
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(authorData)
        });

        const data = await response.json();
        
        if (!response.ok) {
            console.error('Server error:', {
                status: response.status,
                statusText: response.statusText,
                data
            });
            
            let errorMessage = 'Failed to save author. ';
            if (data.errors) {
                errorMessage += data.errors.map(e => `${e.field}: ${e.message}`).join(', ');
            } else if (data.message) {
                errorMessage += data.message;
            }
            
            alert(errorMessage);
            return;
        }

        console.log('Author saved successfully:', data);
        document.getElementById('authorForm').reset();
        authorModal.hide();
        await loadAuthors();
        await loadAuthorsForSelect();
    } catch (error) {
        console.error('Error saving author:', error);
        alert('Network error while saving author. Please check your connection and try again.');
    }
}

async function deleteAuthor(id) {
    if (confirm('Are you sure you want to delete this author? This will also delete all books by this author.')) {
        try {
            const response = await fetch(`${AUTHORS_API}/${id}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                loadAuthors();
                loadBooks(); // Refresh books list as some might have been deleted
            }
        } catch (error) {
            console.error('Error deleting author:', error);
        }
    }
}
