# NODEJS

## 1. 노드의 정의

- Node.js는 크롬 V8 자바스크립트 엔진으로 빌드된 자바스크립트 런타임(실행기)입니다.
- 노드는 싱글 스레드 모델에 비동기 I/O

### 이벤트 기반

- 이벤트가 발생할 때 미리 지정해둔 작업을 수행하는 방식<br />
  · 이벤트의 예: 클릭, 네트워크 요청, 타이머 등<br />
  · 이벤트 리스너: 이벤트를 등록하는 함수<br />
  · 콜백 함수: 이벤트가 발생했을 떄 실행될 함수

### 논블로킹 I/O

- 오래 걸리는 함수를 백그라운드로 보내서 다음 코드가 먼저 실행되게 하고, 나중에 오래 걸리는 함수를 실행<br />
  · 논 블로킹 방식 하에서 일부 코드는 백그라운드에서 병렬로 실행됨
  · 일부 코드 I/O 작업(파일 시스템 접근, 네트워크 요청), 압축, 암호화 등
  · 나머지 코드는 블로킹 방식으로 실행됨

- 블로킹은 순서대로 실행, 논블로킹은 순서대로 실행되지 않음(규칙은 있음, 이벤트 루프)
  동기는 실행 컨텍스트(this, scope), 비동기는 이벤트 루프를 알아야 한다.

### 프로세스 vs 스레드

- 프로세스: 운영체제에서 할당하는 작업의 단위, 프로세스 간 자원 공유X
  스레드: 프로세스 내에서 실행되는 작업의 단위, 부모 프로세스 자원 공유
- 노드 프로세스는 멀티 스레드이지만 직접 다룰 수 있는 스레드는 하나이기 때문에 싱글 스레드라고 표현
- 노드는 주로 멀티 스레드 대신 멀티 프로세스 활용
- 노드는 14버전부터 멀티 스레드 사용 가능


## 2.1 호출 스택, 이벤트 루프

```JavaScript
function first() {
  second();
  console.log('첫 번째');
}
function second() {
  third();
  console.log('두 번째');
}
function third() {
  console.log('세 번째');
}
first(); // 세 번째, 두 번째, 첫 번째
```

### 호출 스택(함수의 호출, 자료구조의 스택)

- Anonymous은 가상의 전역 컨텍스트(항상 있다고 생각하는게 좋음)
- 함수 호출 순서대로 쌓이고, 역순으로 실행됨
- 함수 실행이 완료되면 스택에서 빠짐
- LIFO 구조라서 스택이라고 불림

```JavaScript
function run() {
  console.log('3초 후 실행');
}
console.log('시작');
setTimeout(run, 3000); // '백그라운드'로 보내줌. 호출 스택과 동시 실행
console.log('끝'); // '호출 스택' 먼저 처리 이후, 3초 뒤에 '태스크 큐'에서 run 실행(백그라운드 비워짐), 호출 스택이 run 실행
// 시작, 끝, 3초 후 실행
```
- 호출 스택, 백그라운드, 태스크 큐에 대한 개념이 있어야 한다.
- 백그라운드는 다른 스레드에서 사용
- 호출 스택, 백그라운드 둘이 동작하면 멀티 스레드인 것이다.
- 백그라운드로 보낼 수 있는 것들에 대한 제한이 있다.
- 백그라운드는 C++, 백그라운드, 태스크 큐는 자바스크립트가 아니다.

- Promise.then/catch, process.nextTick 이 두가지는 타이머보다 빨리 실행된다.


## 2.2 ES2015+

### const, let

- ES2015 이전에는 VAR로 변수를 선언
- ES2015부터는 const와 let이 대체
- 가장 큰 차이점: 블록 스코프(var는 함수 스코프)

```JavaScript
if (true) {
  var x = 3;
}
console.log(x); // 3

if (true) { // 블록 스코프
  const y = 3;
}
console.log(y); // y is not defined
```

### 객체 리터럴

```JavaScript
let es = 'ES';
const newObject = {
  sayJS() {
    console.log('JS');
  },
  sayNode,
  [es + 6]: 'Fantastic',
};
newObject.sayNode(); // Node
newObject.sayJS(); // JS
console.log(newObject.ES6); // Fantastic
```

### 화살표 함수

```JavaScript
function add1(x, y) {
  return x + y;
}
const add2 = (x, y) => {
  return x + y;
}
const add3 = (x, y) => x + y;
const add4 = (x, y) => (x + y);

function not1(x) {
  return !x;
}
const not2 = x => !x;

const obj1 = (x, y) => {
  return { x, y };
}
const obj2 = (x, y) => ({ x, y }); // 객체를 리턴하는 경우는 소괄호로 싸준다.
```

```JavaScript
var relationship1 = {
  name: 'zero',
  friends: ['nero', 'hero', 'xero'],
  logFriends: function() {
    var that = this; // relationship1을 가리키는 this를 that에 저장
    this.friends.forEach(function(friend) {
      console.log(this.name, friend);
    })
  }
}
relationship1.logFriends();

const relationship2 = {
  name: 'zero',
  friends: ['nero', 'hero', 'xero'],
  logFriends() {
    this.friends.forEach(friend => {
      console.log(this.name, friend);
    });
  }
}
relationship2.logFriends();
```
- 화살표 함수는 부모의 this를 물려받는다.

```JavaScript
button.addEventListener('click', function(){
  console.log(this.textContent); // this는 button
})
```
```JavaScript
this;
button.addEventListener('click', (e) => {
  console.log(this.textContent); // this는 바깥의 this를 가리킨다.
  console.log(e.target.textContent); // 이렇게 해야 위의 예제와 동일
});
```
- this를 쓸꺼면 function, this를 안쓸꺼면 화살표 함수

### 구조분해 할당

```JavaScript
const example = { a: 123, b: { c: 135, d: 146 } }
const { a, b: { d } } = example;
console.log(a); // 123
console.log(d); // 146

const arr = [1, 2, 3, 4, 5];
// const x = arr[0];
// const y = arr[1];
// const z = arr[4];
const [x, y, , , z] = arr;
```
- this가 있는 경우는 구조분해 할당을 안하는 것이 좋다.

### 클래스

- 프로토타입 문법을 깔끔하게 작성할 수 있는 Class 문법 도입
- Contructor(생성자), Extends(상속) 등을 깔끔하게 처리할 수 있음
- 코드가 그룹화되어 가독성이 향상됨.

```JavaScript
class Human {
  constructor(type = 'human') {
    this.type = type;
  }

  static isHuman(human) {
    return human instanceof Human;
  }

  breathe() {
    alert('h-a-a-a-m');
  }
}

class Zero extends Human {
  constructor(type, firstName, lastName) {
    super(type);
    this.firstName = firstName;
    this.lastName = lastName;
  }

  sayName() {
    super.breathe();
    alert(`${this.firstName} ${this.lastName}`);
  }
}

const newZero = new Zero('human', 'Zero', 'Cho');
```

### 프로미스

- 콜백 헬이라고 불리는 지저분한 자바스크립트 코드이 해결책<br />
  · 프로미스: 내용이 실행은 되었지만 결과를 아직 반환하지 않은 객체<br />
  · Then을 붙이면 결과를 반환함<br />
  · 실행이 완료되지 않았으면 완료된 후에 Then 내부 함수가 실행됨<br />
  · Resolve(성공리턴값) -> then으로 연결<br />
  · Reject(실패리턴값) -> catch로 연결<br />
  · Finally 부분은 무조건 실행됨

```JavaScript
const condition = true;
const promise = new Promise((resolve, reject) => {
  if (condition) {
    resolve('성공');
  } else {
    reject('실패');
  }
});

// 다른 코드가 들어갈 수 있음
promise
  .then((message) => {
    console.log(message); // 성공(resolve)한 경우 실행
  })
  .catch((error) => {
    console.error(error); // 실패(reject)한 경우 실행
  })
```

```JavaScript
const promise1 = Promise.resolve('성공1');
const promise2 = Promise.resolve('성공2');
Promise.all([promise1, promise2])
  .then((result) => {
    console.log(result); // ['성공1', '성공2'];
  })
  .catch((error) => {
    console.error(error);
  });
```
- Promise.all(배열): 여러 개의 프로미스를 동시에 실행<br />
  · 하나라도 실패하면 catch로 감<br />
  · allSelttled로 실패한 것만 추려낼 수 있음

- 비동기는 실패할 가능성을 염두해야한다. 성공하면 resolve, 실패하면 reject
  resolve -> then, reject -> catch 로 간다.

### async/await

```JavaScript
function findAndSaveUser(Users) {
  Users.findOne({})
    .then((user) => {
      user.name = 'zero';
      return user.save();
    })
    .then((user) => {
      return Users.findOne({ genter: 'm' });
    })
    .then((user) => {
      // 생략
    })
    .catch((err) => {
      console.error(err);
    })
}

async function findAndSaveUser(Users) {
  let user = await Users.findOne({}); // 실행순서가 오른쪽에서 왼쪽
  user.name = 'zero';
  user = await user.save();
  user = await Users.findOne({ gender: 'm' });
  // 생략
}
```
- 프로미스 패턴 코드 async/await으로 축약<br />
  · 변수 = await 프로미스;인 경우 프로미스가 resolve된 값이 변수에 저장<br />
  · 변수 await 값;인 경우 그 값이 변수에 저장

```JavaScript
const promise = Promise.resolve('성공');

async function main() {
  try {
    const result = await promise;
    return result;
  } catch(error) {
    console.error(error);
  }
}

// 1번 방법
main().then((name) => {
  console.log(name); // 성공
});

// 2번 방법
const name = await main();
console.log(name) // 성공
```
- async/await을 쓰면서 에러 처리를 위해서 try catch문을 사용해야 한다.
- async 함수는 항상 promise를 반환(return)

### for await of
- 노드 10부터 지원
- for await (변수 of 프로미스배열)<br />
  · resolve된 프로미스가 변수에 담겨 나옴<br />
  · await을 사용하기 때문에 async 함수 안에서 해야함
```JavaScript
const promise1 = Promise.resolve('성공1');
const promise2 = Promise.resolve('성공2');
(async () => {
  for await (promise of [promise1, promise2]) {
    console.log(promise);
  }
})(); // 성공1, 성공2
```

## 2.3 프론트엔드

### AJAX
- 서버로 요청을 보내는 코드
  · 라이브러리 없이는 브라우저가 지원하는 XMLHttpRequest 객체 이용
  · AJAX 요청 시 Axios 라이브러리를 사용하는게 편함

```HTML
<script src="https://unpkg.com/axios/dist/axios.min.js"></script>
<script>
// GET 요청
axios.get('https://www.zerocho.com/api/get')
  .then((result) => {
    console.log(result);
    console.log(result.data);
  })
  .catch((error) => {
    console.error(error);
  });

// POST 요청
(async () => {
  try {
    const result = await axios.post('https://www.zerocho.com/api/post/json', {
      name: 'zerocho',
      birth: 1994,
    });
    console.log(result);
    console.log(result.data);
  } catch (error) {
    console.error(error);
  }
})();
</script>
```

### FormData
- HTML form 태그에 담긴 데이터를 AJAX 요청으로 보내고 싶은 경우
- FormDat 메서드<br />
  · append로 데이터를 하나씩 추가<br />
  · has로 데이터 존재 여부 확인<br />
  · get으로 데이터 조회<br />
  · getAll로 데이터 모두 조회<br />
  · delete로 데이터 삭제<br />
  · set으로 데이터 수정
```JavaScript
const formData = new FormData();
formData.append('name', 'zerocho');
formData.append('item', 'orange');
formData.append('item', 'melon');
formData.has('item'); // true
formData.has('money'); // false
formData.get('item'); // orange
formData.getAll('item'); // ['orange', 'melon']
```

### encodeURIComponent, decodeURIComponent

- 가끔 주소창에 한글 입력하면 서버가 처리하지 못하는 경우 발생<br />
  · encodeURIComponent로 한글 감싸줘서 처리
  · decodeURIComponent로 서버에서 한글 해석
```JavaScript
(async () => {
  try {
    const result = await axios.get(`https://www.zerocho.com/api/search/${encodeURIComponent('노드')}`);
    console.log(result.data);
  } catch(error) {
    console.error(error);
  }
})();
```

### data attribute와 dataset
- HTML 태그에 데이터를 저장하는 방법
```HTML
<ul>
  <li data-id="1" data-user-job="programmer">Zero</li>
</ul>
```
- 자바스크립트에서 태그.dataset.속성명으로 접근 가능<br />
  · data-user-job -> dataset.userJob<br />
  · data-id -> dataset.id

## 3.5 노드 내장 객체 알아보기

### console 객체

- 브라우저의 console 객체와 매우 유사
  · console.time, console.timeEnd: 시간 로깅<br />
  · console.error: 에러 로깅<br />
  · console.log: 평범한 로그<br />
  · console.dir: 객체 로깅<br />
  · console.trace: 호출스택 로깅

### 타이머 메서드

- set 메서드와 clear 메서드가 대응됨
  · set 메서드의 리턴 값(아이디)을 clear 메서드에 넣어 취소
  · setTimeout(콜백 함수, 밀리초): 주어진 밀리초(1000분의 1초) 이후에 콜백 함수를 실행합니다.
  · setInterval(콜백 함수, 밀리초): 주어진 밀리초마다 콜백 함수를 반복 실행합니다.
  · setImmediate(콜백 함수): 콜백 함수를 즉시 실행합니다.

  · clearTimeout(아이디): setTimeout을 취소합니다.
  · clearInterval(아이디): setInterval을 취소합니다.
  · clearImmediate(아이디): setImmediate를 취소합니다.

###  __filename, __dirname
- __filename: 현재 파일 경로
- __dirname: 현재 폴더(디렉터리) 경로

- server1: HTTP 서버 만들기
- server2: fs로 HTML 읽어 제공하기

### REST API
- 서버에 요청을 보낼 때는 주소를 통해 요청의 내용을 표현

- REST API(Representational State Transfer)
· 서버의 자원을 정의하고 자원에 대한 주소를 지정하는 방법<br />
· /user이면 사용자 정보에 관한 정보를 요청하는 것<br />
· /post이면 게시글에 관련된 자원을 요청하는 것

- HTTP 요청 메서드
· GET: 서버 자원을 가져오려고 할 때 사용<br />
· POST: 서버에 자원을 새로 등록하고자 할 때 사용(또는 뭘 써야할 지 애매할 때)<br />
· PUT: 서버의 자원을 요청에 들어있는 자원으로 치환하고자할 때 사용<br />
· PATCH: 서버 자원의 일부만 수정하고자 할 때 사용<br />
· DELETE: 서버의 자원을 삭제하고자할 때 사용

## 5.1 npm 알아보기

- npx SemVer
```Json (package.json)
{
  "dependencies": {
    "body-parser": "^1.19.0", // ^첫번째 자리까지만 고정
    "body-parser": "1.19.0" // 세번째 자리까지 고정
  }
}
```

## 5.4 기타 npm 명령어

- npm outdated: 어떤 패키지에 기능 변화가 생겼는지 알 수 있음(npm rm 패키지명으로도 가능)
- npm search 검색어: npm 패키지를 검색할 수 있음(npmjs.com에서도 가능)
- npm info 패키지명: 패키지의 세부 정보 파악 가능
- npm adduser: npm에 로그인을 하기 위한 명령어(npmjs.com에서 회원가입)
- npm whoami: 현재 사용자가 누구인지
- npm logout: 로그아웃

- npm version patch: 세번재 자리가 버전업 되면서, 깃 커밋까지 됨
- npm version minor: 두번재 자리가 버전업 되면서, 깃 커밋까지 됨
- npm version major: 첫번재 자리가 버전업 되면서, 깃 커밋까지 됨

- npm deprecate [패키지명][버전] [메시지]: 패키지를 설치할 때 경고 메시지를 띄우게 함(오류가 있는 패키지에 적용)
- npm publish: 자신이 만든 패키지를 배포
- npm unpublish npmtest-1234 --force: 자신이 만든 패키지를 배포 중단(배포 후 72시간 내에만 가능)<br />
  다른 사람이 내 패키지를 사용하고 있는데 배포가 중단되면 문제가 생기기 때문

- npm ls 모듈명: 해당 모듈이 사용되고 있는지 체크
- npm ls inherits: 상속받는 모듈 리스트를 보여준다.
- npm ll inherits: 상속받는 모듈 리스트를 더 상세히 보여준다.

## 6.1 Express

- learn-express

```command
npm init
npm i express
npm i -D nodemon
```

## 6.2 morgan, bodyParser, cookieParser

```command
npm i morgan cookie-parser express-session
```


## 참고 링크

[모던 JavaScript 튜토리얼](https://ko.javascript.info)
[NPM CLI Documentation](https://docs.npmjs.com/cli-documentation/cli)

## 강좌 6-6 morgan, bodyParser, cookieParser 02:00