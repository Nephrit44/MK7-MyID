
function qrGenerator(qrValue, qrElement) {
  const qrcode = new QRCode(qrElement, {
    text: qrValue, // Введите здесь текст или URL-адрес, который вы хотите закодировать в QR-код

    width: 128, // Ширина QR-кода в пикселях

    height: 128, // Высота QR-кода в пикселях
    colorDark: "#000000", // Цвет кода

    colorLight: "#ffffff", // Цвет фона

    correctLevel: QRCode.CorrectLevel.H, // уровень исправления ошибок
  });
};

qrGenerator("https://nephrit44.github.io/MK7-MyID/?clckid=95014eee", document.querySelector('.qrcode'));