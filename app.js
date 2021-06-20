// all variables list
const spinner=document.getElementById("spinner");
const imagesArea = document.querySelector('.images');
const gallery = document.querySelector('.gallery');
const galleryHeader = document.querySelector('.gallery-header');
let headTitle=document.getElementById("head-title");
let selectedImageNumber = document.getElementById("selected-img-number");
let totalImageNumber =document.getElementById("total-img-number");
const search = document.getElementById('search');
const searchBtn = document.getElementById('search-btn');
const sliderBtn = document.getElementById('create-slider');
const sliderContainer = document.getElementById('sliders');
let errorAlertDiv =document.getElementById("error-alert-div");
let errorButton =document.getElementById("error-button");

// selected image 
let sliders = [];
const KEY = '15674931-a9d714b6e9d654524df198e00&q';

// show images 
const showImages = (images) => {
  imagesArea.style.display = 'block';
  gallery.innerHTML = '';
  // show gallery title
  galleryHeader.style.display = 'flex';
  images.forEach(image => {
    let div = document.createElement('div');
    div.className = 'col-lg-3 col-md-4 col-xs-6 img-item mb-3';
    div.innerHTML = ` <img class="img-fluid img-thumbnail" onclick=selectItem(event,"${image.webformatURL}") src="${image.webformatURL}" alt="${image.tags}">`;
    gallery.appendChild(div)
  })
  toggleSpinner(false);
  imagesArea.classList.remove("d-none"); 
}

//fuction to get image on 
const getImages = (query) => {
  toggleSpinner(true);
  imagesArea.classList.add("d-none"); 
  //load data
  fetch(`https://pixabay.com/api/?key=${KEY}=${query}&image_type=photo&pretty=true`)
    .then(response => response.json())
    .then(data => {
        // console.log(data.hits.length);
        if (data.hits.length==0) {
          generateErrorMessage();
          spinner.classList.add("d-none");
        } else {
          console.log(data.hits);
          showImages(data.hits);
          headTitle.innerHTML=search.value;
          totalImageNumber.innerHTML=data.hits.length;
          selectedImageNumber.innerHTML=0;
        }
      })
    .catch(err => console.log(err))
}
//push selected images in an array and delet desected one
let slideIndex = 0;
const selectItem = (event, img) => {
  let element = event.target;
  toggleSelectedItem(element,true);
 
  let item = sliders.indexOf(img);
  if (item === -1) {
    sliders.push(img);
  } else {
    sliders.splice(item,1);
    toggleSelectedItem(element,false);
  }
  console.log(sliders.length);
  selectedImageNumber.innerHTML=sliders.length;
}

//function to creatslider
var timer
const createSlider = () => {

  // check slider image length
  if (sliders.length < 2) {
    alert('Select at least 2 image.')
    return;
  }

  // crate slider previous next area
  sliderContainer.innerHTML = '';
  const prevNext = document.createElement('div');
  prevNext.className = "prev-next d-flex w-100 justify-content-between align-items-center";
  prevNext.innerHTML = ` 
  <span class="prev" onclick="changeItem(-1)"><i class="fas fa-chevron-left"></i></span>
  <span class="next" onclick="changeItem(1)"><i class="fas fa-chevron-right"></i></span>
  `;

  sliderContainer.appendChild(prevNext)
  document.querySelector('.main').style.display = 'block';
  // hide image area
  imagesArea.style.display = 'none';
  let inputDuration = document.getElementById('duration').value ||1000 ;
  inputDuration=Math.abs(inputDuration);
  let duration = (inputDuration >= 1000) ? inputDuration : 1000;

  sliders.forEach(slide => {
    let item = document.createElement('div')
    item.className = "slider-item";
    item.innerHTML = `<img class="w-100"
    src="${slide}"
    alt="">`;
    sliderContainer.appendChild(item)
  })
  changeSlide(0)
  timer = setInterval(function () {
    slideIndex++;
    changeSlide(slideIndex);
  }, duration);
  document.getElementById('duration').value="";
  // console.log(duration);
}

// change slider index 
const changeItem = index => {
  changeSlide(slideIndex += index);
}

// change slide item
const changeSlide = (index) => {

  const items = document.querySelectorAll('.slider-item');
  if (index < 0) {
    slideIndex = items.length - 1
    index = slideIndex;
  };

  if (index >= items.length) {
    index = 0;
    slideIndex = 0;
  }

  items.forEach(item => {
    item.style.display = "none"
  })

  items[index].style.display = "block"
}
//activating search button on enter key press
search.addEventListener('keyup', function(event) {
    event.preventDefault();
    if (event.key === "Enter") {
      searchBtn.click();
    }
});
//search botton eventlistener on click
searchBtn.addEventListener('click', ()=> {
  document.querySelector('.main').style.display = 'none';
  clearInterval(timer);
  // console.log(search);
  console.log(search.value);
  getImages(search.value)
  sliders.length = 0;

})

//activating slider button on enter key press
document.getElementById('duration').addEventListener('keyup', function(event) {
  event.preventDefault();
  if (event.key === "Enter") {
    sliderBtn.click();
  }
});
//search botton eventlistener on click
sliderBtn.addEventListener('click', function () {
  createSlider();
})

//fuction to add or remove picture boarder
const toggleSelectedItem=(item,isadded)=>{
  if (isadded===true) {
    item.classList.add('added');
  } else {
    item.classList.remove('added');
  }
}

// spinner add extra part 1
const toggleSpinner = (show) => {
  const spinner = document.getElementById('spinner');
  if (show) {
    spinner.classList.remove('d-none');
  }
  else {
    spinner.classList.add('d-none');
  }
}
//function to generate error message
let generateErrorMessage =()=>{
  errorAlertDiv.style.display="block";
  errorButton.addEventListener("click",hideErrorMessage)
  searchBtn.setAttribute("Disabled",true);
}

//hide error message
const hideErrorMessage=()=>{
  // search.value=" ";
  errorAlertDiv.style.display="none";
  searchBtn.disabled = false;
}

