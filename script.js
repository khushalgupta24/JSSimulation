'use strict';

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const buttonScrollTo = document.querySelector(".btn--scroll-to");
const section1 = document.querySelector("#section--1");
const tabs = document.querySelectorAll(".operations__tab");
const tabsContainer = document.querySelector(".operations__tab-container");
const tabsContent = document.querySelectorAll(".operations__content");
const nav = document.querySelector("nav");
const header = document.querySelector(".header");
const navHeight = nav.getBoundingClientRect().height;
const allSections = document.querySelectorAll(".section");
const imgTargets = document.querySelectorAll("img[data-src]");
const slides = document.querySelectorAll(".slide");
const slider = document.querySelector(".slider");
const sliderBtnLeft = document.querySelector(".slider__btn--left");
const sliderBtnRight = document.querySelector(".slider__btn--right");
const dotContainer = document.querySelector('.dots')

///////////////////////////////////////
// Modal window

const openModal = function () {
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

for (let i = 0; i < btnsOpenModal.length; i++)
  btnsOpenModal[i].addEventListener('click', openModal);

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});


///////////////////////////////////////
//Button Scrolling


buttonScrollTo.addEventListener('click', function(e){
  e.preventDefault();
  const s1coords = section1.getBoundingClientRect();
  section1.scrollIntoView({behavior: 'smooth'});
})


///////////////////////////////////////
//Page Navigation using Event Delegation

//Add event listener to common parent element
//Determine what element originated the event

document.querySelector(".nav__links").addEventListener('click', function(e){
  e.preventDefault();

  //Matching strategy
  if(e.target.classList.contains("nav__link")){
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({behavior:'smooth'});
  }
})

///////////////////////////////////////
//Tabbed Component


tabsContainer.addEventListener('click', (e)=>{
  e.preventDefault();
  const clicked = e.target.closest(".operations__tab");
  //Guard Clause
  if(!clicked) return;

  //Active Tab
  tabs.forEach((t) => t.classList.remove("operations__tab--active"));
  clicked.classList.add("operations__tab--active");

  //Activate Tab Content
  tabsContent.forEach((t) => t.classList.remove("operations__content--active"));
  document.querySelector(`.operations__content--${clicked.dataset.tab}`).classList.add("operations__content--active");
});

///////////////////////////////////////
//Menu fade animation

const handleOpacity = (e) => {
  if(e.target.classList.contains("nav__link")){
    const link = e.target;
    const siblings = link.closest(".nav").querySelectorAll(".nav__link");
    const logo = link.closest(".nav").querySelector("img");

    siblings.forEach((el) => {
      if(el !== link) el.style.opacity = this;
    });
    logo.style.opacity = this;
  }
}

nav.addEventListener('mouseover', handleOpacity.bind(0.5));

nav.addEventListener('mouseout', handleOpacity.bind(1));


///////////////////////////////////////
//Sticky Navigation

const stickyNav = function (entries){
  const [entry] = entries;
  if(!entry.isIntersecting){
    nav.classList.add('sticky');
  }else{
    nav.classList.remove('sticky');
  }
}

const headerObserver = new IntersectionObserver(stickyNav, {root: null, threshold: 0, rootMargin: `${navHeight}px`});
headerObserver.observe(header);

///////////////////////////////////////
//Reveal Sections

const revealSection = (entries, observer) => {
  const [entry] = entries;
  if(!entry.isIntersecting) return
  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
}

const sectionObserver = new IntersectionObserver(revealSection, {root: null, threshold: 0.1})

allSections.forEach(function(section){
  // section.classList.add('section--hidden');
  sectionObserver.observe(section);
})


///////////////////////////////////////
//Lazy Loading Images

const loadImg = function(entries, observer){
  const [entry] = entries;
  if(!entry.isIntersecting) return;
  entry.target.src = entry.target.dataset.src;
  entry.target.addEventListener('load', () => entry.target.classList.remove('lazy-img'));
  observer.unobserve(entry.target);
}

const imgObserver = new IntersectionObserver(loadImg, {root: null, threshold: 0, rootMargin: '200px'});
imgTargets.forEach(function(img){imgObserver.observe(img)} );

///////////////////////////////////////
//Slider

let currSlide = 0;
const maxSlide = slides.length;

const createDots = function(){
  
  slides.forEach((_, i) => {
    dotContainer.insertAdjacentHTML('beforeend', `<button class="dots__dot" data-slide="${i}"></button>`)
  })
}

const activateDot = function(slide){
  document.querySelectorAll('.dots__dot').forEach((dot)=>dot.classList.remove('dots__dot--active'));
  document.querySelector(`.dots__dot[data-slide ="${slide}"]`).classList.add('dots__dot--active');
}

const goToSlide = function(slide){
  slides.forEach((s, i) => s.style.transform = `translateX(${(i - slide) * 100}%)` );
}

const init = function(){
  goToSlide(0);
  createDots();
  activateDot(0);
}

const nextSlide = function(){
  if(currSlide == maxSlide - 1){
    currSlide = 0;
  }else{
  currSlide++;  
  }
  goToSlide(currSlide);
  activateDot(currSlide);
}

const prevSlide = function(){
  if(currSlide == 0){
    currSlide = maxSlide - 1;
  }else{
    currSlide--;
  }
  goToSlide(currSlide);
  activateDot(currSlide);
}

init(); 

sliderBtnRight.addEventListener('click', nextSlide);
sliderBtnLeft.addEventListener('click', prevSlide);
document.addEventListener('keydown', function(e){
  if(e.key === 'ArrowRight') nextSlide();
  e.key === 'ArrowLeft' && prevSlide();
})

dotContainer.addEventListener('click', function(e){
  if(e.target.classList.contains("dots__dot")){
    const slide = e.target.dataset.slide;
    goToSlide(slide);
    activateDot(slide);
  }
})

////////////////////////////////////////////////////////
//Practice


// const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);

// const randomColor = () => `rgb(${randomInt(0,255)},${randomInt(0,255)},${randomInt(0,255)})`

// document.querySelector(".nav__link").addEventListener('click', function(e) {
//   this.style.backgroundColor = randomColor();
//   console.log('LINK', e.target, e.currentTarget);
// });

// document.querySelector(".nav__links").addEventListener('click', function(e) {
//   this.style.backgroundColor = randomColor();
//   console.log('LINK', e.target, e.currentTarget);
// });

// document.querySelector("nav").addEventListener('click', function(e) {
//   this.style.backgroundColor = randomColor();
//   console.log('LINK', e.target, e.currentTarget);
// });