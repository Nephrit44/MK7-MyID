const arrColletion = [
  {
    recID: 101,
    content: "Внимание! <br />Приложение \"Мой id\" - не возможно найти в магазине Google play.",
    img: "./images/google-play-icon-logo.svg",
    imgAlt: "Иконка магазина приложений Google play. Перечёркнутая.",
  },
];

const someText = document.querySelector('.content__text');
someText.innerHTML = arrColletion[0].content;
