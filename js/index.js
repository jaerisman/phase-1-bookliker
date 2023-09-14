document.addEventListener("DOMContentLoaded", function() {
    const booksList = document.getElementById('list');
    const showPanel = document.getElementById('show-panel');

    fetch('http://localhost:3000/books')
        .then(response => response.json())
        .then(data => {
            data.forEach(book => {
                const booksListRow = document.createElement('li');
                booksListRow.textContent = book.title;
                
                booksListRow.addEventListener('click', function(){
                    //Clear existing content in show-panel
                    showPanel.innerHTML = '';

                    //Create thumbnail element
                    const thumbnail = document.createElement('img');
                    thumbnail.src = book.img_url;
                    showPanel.appendChild(thumbnail)

                    //Create description element
                    const description = document.createElement('p');
                    description.textContent = book.description;
                    showPanel.appendChild(description);

                    //Create heading for users list
                    const userListHeading = document.createElement('h4');
                    userListHeading.textContent = "Users Who Have Liked This Book:";
                    showPanel.appendChild(userListHeading);

                    //Create list of users who have liked the book
                    const userList = document.createElement('ul');
                    book.users.forEach(user => {
                        const userItem = document.createElement('li');
                        userItem.textContent = user.username;
                        userList.appendChild(userItem);
                    });
                    showPanel.appendChild(userList);

                    //Create Like Button
                    const likeButton = document.createElement('button');
                    likeButton.textContent = 'Like';
                    showPanel.appendChild(likeButton);

                    //Add Event Listener to Like Button
                    likeButton.addEventListener('click', function() {
                        const currentUser = { "id": 1, "username": "pouros" };
                        
                        if (!book.users.some(user => user.id === currentUser.id)) {
                        book.users.push(currentUser);
                        const updatedData = { users: book.users };
                        
                        fetch(`http://localhost:3000/books/${book.id}`, {
                            method: 'PATCH',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(updatedData)
                        })
                        .then(response => response.json())
                        .then(updatedBook => {
                            userList.innerHTML = '';

                            updatedBook.users.forEach(user => {
                                const userItem = document.createElement('li');
                                userItem.textContent = user.username;
                                userList.appendChild(userItem);
                            });
                            const currentUserItem = document.createElement('li');
                            currentUserItem.textContent = currentUser.username;
                            userList.appendChild(currentUserItem);
                        })
                        .catch(error => {
                            console.error('Error:', error);
                        });
                    }
                    });
                });
                
                booksList.appendChild(booksListRow);
            });
        });
});