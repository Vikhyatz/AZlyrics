let input = document.getElementById('input')
let btn = document.getElementById('btn')
let form = document.getElementById('form')

form.addEventListener('submit', async (e) => {
    e.preventDefault()
    let query = input.value
    let personalizedQuery = query.replace(/ /g, "+")

    try {
        const response = await fetch(`/input?queryInput=${encodeURIComponent(personalizedQuery)}`);
        const { songs } = await response.json();
        console.log(songs)

        // Clear existing table data
        const tableBody = document.getElementById('songTableBody');
        tableBody.innerHTML = "";

        // Populate the table with the new data
        songs.forEach(song => {
            const row = document.createElement('tr');
            const nameCell = document.createElement('td');
            const artistCell = document.createElement('td');

            nameCell.textContent = song.name;
            artistCell.textContent = song.artist;

            row.appendChild(nameCell);
            row.appendChild(artistCell);
            row.setAttribute('data-link', `${song.link}`)

            tableBody.appendChild(row);

            row.addEventListener('click', async () => {
                let link = row.getAttribute('data-link');

                try {
                    const response = await fetch(`/lyrics?link=${encodeURIComponent(link)}`);
                    const { lyrics } = await response.json();

                    // Show lyrics in the modal
                    const lyricsContent = document.getElementById('lyricsContent');
                    lyricsContent.innerHTML = lyrics;

                    // Display the modal
                    const modal = document.getElementById('lyricsModal');
                    modal.style.display = 'block';
                } catch (err) {
                    console.log('Error:', err);
                }
            });

            // Close modal when close button is clicked
            const closeModal = document.querySelector('.close');
            closeModal.addEventListener('click', () => {
                const modal = document.getElementById('lyricsModal');
                modal.style.display = 'none';
            });
        });
    }
    catch (err) {
        console.log('Error:', err)
    }
})