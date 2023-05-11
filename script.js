// ...
const element = document.querySelector(".element");

let dragging = false;
let startX = 0;
let startY = 0;
element.addEventListener("mousedown", (e) => {
  dragging = true;

  // Нам потребуется вначале вычислить стиль элемента
  // через window.getComputedStyle(), а затем узнать значение
  // свойства transform.
  const style = window.getComputedStyle(element);

  // Мы могли бы просто считать значение style.transform,
  // но это бы нам не сильно помогло.
  // При обычном считывании мы бы получили нечто вроде:
  //     matrix(1, 0, 0, 1, 27, 15);
  //
  // Это матрица афинных преобразований.
  // Её можно представить в виде:
  //     matrix(scaleX, skewY, skewX, scaleY, translateX, translateY);
  // где:
  //     - scaleX — масштабирование по горизонтали,
  //     - scaleY — масштабирование по вертикали,
  //     - skewX — перекос по горизонтали,
  //     - skewY — перекос по вертикали,
  //     - translateX — смещение по горизонтали,
  //     - translateY — смещение по вертикали.
  //
  // Но даже учитывая, что у нас есть все необходимые числа,
  // работать с этим неудобно — это же просто строка.
  //
  // К счастью мы можем воспользоваться DOMMatrixReadOnly,
  // который преобразует эту матрицу в удобную для использования:
  const transform = new DOMMatrixReadOnly(style.transform);

  // Теперь мы можем воспользоваться свойствами,
  // которые содержат в себе значения translateX и translateY.
  const translateX = transform.m41;
  const translateY = transform.m42;

  // Дальше только вычитаем не top и left,
  // а translateX и translateY.
  startX = e.pageX - translateX;
  startY = e.pageY - translateY;
});
// добавляем возможность отпустить элемент при отжатии клавиши
document.body.addEventListener("mouseup", () => {
  dragging = false;
});

// ...

document.body.addEventListener("mousemove", (e) => {
  if (!dragging) return;

  const x = e.pageX - startX;
  const y = e.pageY - startY;

  // Мы можем объединить обновлённые координаты
  // в одну запись translate, которую потом
  // присвоим в качестве значения свойству transform.
  element.style.transform = `translate(${x}px, ${y}px)`;
});
