let addToy = false;

document.addEventListener('DOMContentLoaded', () => {
  const toyForm = document.querySelector('.add-toy-form');
  const toyCollection = document.getElementById('toy-collection');
  
  // Fetch toys from the API and render them in cards
  fetch('http://localhost:3000/toys')
      .then(response => response.json())
      .then(toys => {
          toys.forEach(toy => {
              renderToyCard(toy);
          });
      });
  
  // Add event listener to the toy form
  toyForm.addEventListener('submit', event => {
      event.preventDefault();
      
      // Get new toy data from the form
      const name = document.getElementById('name').value;
      const image = document.getElementById('image').value;
      
      // Create a new toy object
      const newToy = {
          name: name,
          image: image,
          likes: 0
      };
      
      // Add new toy to the server
      fetch('http://localhost:3000/toys', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json'
          },
          body: JSON.stringify(newToy)
      })
      .then(response => response.json())
      .then(addedToy => {
          // Render the new toy card
          renderToyCard(addedToy);
          
          // Clear the form fields
          document.getElementById('name').value = '';
          document.getElementById('image').value = '';
      });
  });
  
  // Add event listener to the like button of each toy card
  toyCollection.addEventListener('click', event => {
      if (event.target.classList.contains('like-btn')) {
          const toyId = event.target.dataset.id;
          
          // Fetch toy by ID
          fetch(`http://localhost:3000/toys/${toyId}`)
              .then(response => response.json())
              .then(toy => {
                  // Increase the like count
                  toy.likes++;
                  
                  // Update toy's likes on the server
                  fetch(`http://localhost:3000/toys/${toyId}`, {
                      method: 'PATCH',
                      headers: {
                          'Content-Type': 'application/json',
                          Accept: 'application/json'
                      },
                      body: JSON.stringify({
                          likes: toy.likes
                      })
                  })
                  .then(response => response.json())
                  .then(updatedToy => {
                      // Update toy's like count in the DOM
                      const likeCount = document.querySelector(`.like-btn[data-id="${toyId}"]`).previousElementSibling;
                      likeCount.innerText = `${updatedToy.likes} Likes`;
                  });
              });
      }
  });
  
  function renderToyCard(toy) {
      // Create a toy card for the given toy
      const card = document.createElement('div');
      card.className = 'card';
      card.innerHTML = `
          <h2>${toy.name}</h2>
          <img src="${toy.image}" class="toy-avatar" />
          <p>${toy.likes} Likes</p>
          <button class="like-btn" data-id="${toy.id}">Like ❤️</button>
      `;
      
      // Append the card to the toy collection
      toyCollection.appendChild(card);
  }
});
