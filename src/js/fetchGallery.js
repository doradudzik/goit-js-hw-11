// import axios from 'axios';

// export default class galleryApi {
//   constructor() {
//     this.pageNumber = 1;
//     this.imagesPerPage = 40;
//     this.searchFormValue = '';
//   }
//   async fetchPhotos() {
//     try {
//       const response = await axios.get('https://pixabay.com/api/', {
//         params: {
//           key: '34808365-79ec0dd825bcd7358497b4699',
//           q: `${this.searchFormValue}`,
//           image_type: 'photo',
//           orientation: 'horizontal',
//           safesearch: 'true',
//           page: `${this.pageNumber}`,
//           per_page: `${this.imagesPerPage}`,
//         },
//       });
//       this.loadNextPage();
//       const data = response.data;
//       return data;
//     } catch (error) {
//       console.error(error);
//     }
//   }

//   loadNextPage() {
//     this.pageNumber = +1;
//   }
//   resetPage() {
//     this.page = 1;
//   }

//   get searchValue() {
//     return this.searchFormValue;
//   }
//   set searchValue(newValue) {
//     this.searchFormValue = newValue;
//   }
// }
