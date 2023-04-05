@charset "UTF-8";
/* Global styles */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: Garamond, serif;
}

body {
  background-image: url("./images/backgr.png");
  background-repeat: no-repeat;
  background-size: cover;
  background-color: #f7f7f7;
  font-family: Garamond, serif;
}

a {
  text-decoration: none;
  color: #bbcc00;
}

h1, h2, h3 {
  margin-bottom: 20px;
}

/* Header */
header {
  background-color: #333333;
  color: #f7f7f7;
  padding: 10px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 999;
}

.logo {
  display: flex;
  align-items: center;
  font-size: 15px;
  font-weight: bold;
  color: #bbcc00;
  text-transform: uppercase;
  letter-spacing: 2px;
}

.logo img {
  width: 25px;
  height: 25px;
  margin-right: 10px;
}

header a {
  color: #f7f7f7;
  margin-left: 20px;
}

nav {
  display: flex;
}

nav ul {
  display: flex;
  list-style: none;
  margin-left: 20px;
}

nav ul li {
  margin-right: 20px;
  max-width: 150px; /* Максимальна ширина елементу */
  text-align: center;
  display: flex;
  justify-content: center; /* Вирівнювання по горизонталі */
  align-items: center; /* Вирівнювання по вертикалі */
  flex-direction: column; /* Змінюємо напрямок контейнера на колонку */
  height: 100%; /* Щоб елементи займали всю висоту */
}

.login-container {
  margin: 80px auto;
  max-width: 400px;
  padding: 20px;
  border: 1px solid #ccc;
  background-color: #f8f8f8;
}
.login-container h1 {
  font-size: 28px;
  text-align: center;
  margin-bottom: 20px;
  font-family: Garamond, serif;
}
.login-container form {
  display: flex;
  flex-direction: column;
  font-family: Garamond, serif;
}
.login-container form label {
  margin-bottom: 10px;
  font-family: Garamond, serif;
}
.login-container form input {
  height: 40px;
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
  margin-bottom: 20px;
  font-family: Garamond, serif;
}

.buttons {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
  margin-top: 5px;
  text-align: center;
  display: inline-block;
  background-color: #bbcc00;
  color: #fff;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  padding: 10px;
  cursor: pointer;
  font-family: Garamond, serif;
  transition: all 0.2s ease-in-out;
  text-decoration: none;
}
.buttons a.buttons:hover {
  background-color: #8c9900;
}

/* Footer */
footer {
  background-color: #333333;
  color: #f7f7f7;
  padding: 10px 20px;
  text-align: center;
  position: fixed;
  bottom: 0;
  width: 100%;
}

/*# sourceMappingURL=login-page-styles.cs.map */
