const express = require('express');
const path = require('path');

const app = express();

app.set('port', process.env.PORT || 3000); // 서버에 port라는 속성을 3000으로 설정

app.use((req, res, next) => { // 미들웨어
  console.log('1 모든 요청에 실행하고 싶어요.');
  next(); // 미들웨어는 next를 해줘야 다음으로 넘어간다.
}, (req, res, next) => {
  // throw new Error('에러가 났어요'); // 에러 테스트 코드, 에러 미들웨어로 넘어감
  try {
    // console.log(nodejs); // nodejs is not defined
    next();
  } catch (error) {
    next(error); // next에 인수가 들어가면 바로 에러처리 미들웨어로 넘어간다.
  }
});

app.get('/', (req, res, next) => {
  res.sendFile(path.join(__dirname, 'index.html'));
  if (true) {
    next('route'); // 다음 라우터가 시행됨
  } else {
    next();
  }
}, (req, res) => {
  console.log('실행되나요?')
});

app.get('/', (req, res) => {
  console.log('실행되지롱');
});

app.post('/', (req, res) => {
  res.send('hello express');
});

// app.get('/category/:name', (req, res) => { // :name 와일드카드
//   res.send(`hello ${req.params.name}`);
// });

app.get('/about', (req, res) => {
  res.send('hello express');
});

// app.get('*', (req, res) => { // 범위가 넓은 라우터는 밑에 넣어주는 것이 좋다.
//   res.send('hello everybody');
// });

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