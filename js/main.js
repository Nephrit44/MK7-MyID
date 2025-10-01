const btnApple = document.querySelector('.ios-icon');
const btnAndroid = document.querySelector('.android-icon');
const listApple = document.querySelector('.list-iphone');
const listAndroid = document.querySelector('.list-android')

btnApple.addEventListener('click', function () {
    listApple.classList.toggle('visible');
    listAndroid.classList.add('visible');
}); 

btnAndroid.addEventListener('click', function(){
    listAndroid.classList.toggle('visible');
    listApple.classList.add('visible');
});
