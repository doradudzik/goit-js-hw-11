import axios from 'axios';
import { lightbox } from './js/simplelightbox';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const searchForm = document.querySelector('.search-form');
const searchFormTextInput = document.querySelector('.search-form input');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');

loadMoreBtn.classList.add('is-hidden');

let isShown = 0; //Zmienna mówiąca ile obrazów jest aktualnie wyświetlanych na stronie
let pageNumber = 1; //Domyślny numer strony podczas pobierania zdjęć

async function fetchPhotos() {
  //pobieranie zdjęć z API serwisu Pixabay za pomocą biblioteki axios
  try {
    let imagesPerPage = 40;
    let searchFormValue = searchFormTextInput.value;

    const response = await axios.get('https://pixabay.com/api/', {
      params: {
        key: '34808365-79ec0dd825bcd7358497b4699',
        q: `${searchFormValue}`,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: 'true',
        page: `${pageNumber}`,
        per_page: `${imagesPerPage}`,
      },
    });

    const data = response.data;
    return data;
  } catch (error) {
    console.error(error);
  }
}

const resetPage = () => {
  //reset numeru strony gdy wywołana zostanie funkcja onSearch
  pageNumber = 1;
};

const onSearch = event => {
  event.preventDefault();
  gallery.innerHTML = '';
  const textInput = searchFormTextInput.value.trim();
  resetPage();

  fetchPhotos(textInput) //zbieranie value z input
    .then(data => {
      if (textInput === '') {
        Notify.warning('Please, fill the main field');
        return;
      }

      if (!data.hits.length) {
        Notify.failure(
          `Sorry, there are no images matching your search query. Please try again.`
        );
        loadMoreBtn.classList.add('is-hidden');
        gallery.innerHTML = '';
        return;
      }
      createPhotoGallery(data.hits); //tworzenie galerii z danych na podstawie aktualnego textInput
      isShown += data.hits.length;

      if (isShown < data.totalHits) {
        Notify.success(`Hooray! We found ${data.totalHits} images.`);
        loadMoreBtn.classList.remove('is-hidden');
      }
    })
    .catch(error => {
      console.log(error);
    });
};

function createPhotoGallery(photos) {
  const markup = photos
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `<div class="photo-card">
            <a href="${largeImageURL}">
                <img class="photo-img" src="${webformatURL}" alt="${tags}" loading="lazy" />
            </a>
            <div class="info">
               <p class="info-item">
                   <b>Likes</b>
                     ${likes}
               </p>
               <p class="info-item">
                   <b>Views</b>
                     ${views}
               </p>
               <p class="info-item">
                   <b>Comments</b>
                     ${comments}
               </p>
               <p class="info-item">
                   <b>Downloads</b>
                     ${downloads}
               </p>
            </div>
          </div>`;
      }
    )
    .join('');
  gallery.insertAdjacentHTML('beforeend', markup);
  lightbox.refresh();
}

searchForm.addEventListener('submit', onSearch);
loadMoreBtn.addEventListener('click', async () => {
  pageNumber = pageNumber + 1;
  const newData = await fetchPhotos();
  createPhotoGallery(newData.hits);

  isShown += newData.hits.length;

  if (isShown >= newData.totalHits) {
    Notify.info("We're sorry, but you've reached the end of search results.");
    loadMoreBtn.classList.add('is-hidden');
  }
});
