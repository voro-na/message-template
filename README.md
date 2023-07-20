## Message Template

### Стек технологий:
 - React, React hooks
 - Typescript
 - MobX 
 - Module.scss , SCSS
 - Eslint, Stylelint
 - Jest

### Виджет редактирования шаблона:
В зависимости от передаваемых значений в компонент, рендериться подвиджет переменных.
При нажатии на переменную происходит ее добавление  в шаблон.
При клике на кнопку ADD [if then else] происходит добавление новых input с условием.
Повторное добавление [if then else] блока к тому же самому input невозможно.
Реализована возможность добавления вложенных [if then else] блоков.
При клике на кнопку Preview открывается Виджет предпросмотра шаблона сообщений
При клике на кнопку Save введенные данные сохраняются в localStorage
При клике на кнопку Close виджет закрывается

### Виджет предпросмотра шаблона сообщений:
При вводе значений в input переменных происходит вызов функции генерации итогового сообщения.

### Функция генерации итогового сообщения:
Для тестирования коректной работы функции используется unit тесты (Jest)
