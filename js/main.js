const btnApple = document.querySelector('.ios-icon');
const btnAndroid = document.querySelector('.android-icon');
const btnError = document.querySelector('.help-icon');

const listApple = document.querySelector('.list-iphone');
const listAndroid = document.querySelector('.list-android');
const listError = document.querySelector('.list-error');

const counterApple = document.querySelectorAll('.counter-apple');
const counterAndroid = document.querySelectorAll('.counter-android');


btnApple.addEventListener('click', function () {
    listApple.classList.toggle('visible');
    listAndroid.classList.add('visible');
    listError.classList.add('visible');
    generateCounter(counterApple);
}); 

btnAndroid.addEventListener('click', function(){
    listAndroid.classList.toggle('visible');
    listApple.classList.add('visible');
    listError.classList.add('visible');
    generateCounter(counterAndroid);
});

btnError.addEventListener('click', function(){
    listError.classList.toggle('visible');
    listAndroid.classList.add('visible');
    listApple.classList.add('visible');
    generateCounter(counterAndroid);
});

function generateCounter (listCollection){
    let i = 1;
    listCollection.forEach(element => {
        element.textContent = i;
        i++;
    });
}