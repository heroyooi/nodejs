const express = require('express');
const path = require('path');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const session = require('express-session');

const app = express();

app.set('port', process.env.PORT || 3000);

// 미들웨어들 간에는 순서가 중요하다. (성능 이슈)
app.use(morgan('dev'));
app.use('/', express.static(__dirname, 'public'));
app.use(cookieParser('heroyooipassword'));
app.use(session({
  resave: false,
  saveUninitialized: false,
  secret: 'heroyooipassword',
  cookie: {
    httpOnly: true,
  },
  // name: 'mySession', // 기본값: connect.sid
}));
app.use('/', (req, res, next) => {
  if (req.session.id) {
    express.static(__dirname, 'public')(req, res, next)
  } else {
    next();
  }
});
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res, next) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/', (req, res) => {
  res.send('hello express');
});

app.get('/about', (req, res) => {
  res.send('hello express');
});

app.use((req, res, next) => {
  res.status(404).send('404 처리 미들웨어입니다.');
});

app.use((err, req, res, next) => { // 에러 처리 미들웨어 - 반드시 매개변수로 4개를 다 써야한다.
  console.error(err);
  res.status(500).send('에러가 발생했습니다.');
});

app.listen(app.get('port'), () => { // 위에서 선언한 port 속성을 가져온다.
  console.log('익스프레스 서버 실행');
});