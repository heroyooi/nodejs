# NODEJS
- Node.js를 학습하기 위한 저장소입니다.

## ES2015(ES6)+

### const, let
- const, let은 블록 스코프를 가지므로 블록 밖에서는 변수에 접근할 수 없다.
- 블록의 범위는 if, while, for, function 등의 중괄호이다.

### 객체 리터럴
```JavaScript
var sayNode = function() {
  console.log('Node');
};
var es = 'ES';

const newObject = {
  sayJS() {
    console.log('JS');
  },
  sayNode,
  [es + 6]: 'Fantastic',
};

newObject.sayNode(); // Node
newObject.sayJS();   // JS
console.log(newObject.ES6); // Fantastic
```

### 화살표 함수, this
```JavaScript
const relationship = {
  name: 'hero',
  friends: ['nero', 'zero', 'xero'],
  logFriends() {
    this.friends.forEach(friend => {
      console.log(this.name, friend);
    });
  },
};
relationship.logFriends();
```

### 프로미스
- 자바스크립트와 노드에서는 주로 비동기 프로그래밍을 한다. 특히 이벤트 주도 방식 때문에 콜백 함수를 자주 사용한다.
  ES2015부터는 자바스크립트와 노드의 API들이 콜백 대신 프로미스 기반으로 재구성 된다.

- 프로미스는 다음과 같은 규칙이 있다. 먼저 프로미스 객체를 생성해야 한다.
```JavaScript
const condition = true; // true면 resolve, false면 reject
const promise = new Promise((resolve, reject) => {
  if (condition) {
    resolve('성공');
  } else {
    reject('실패');
  }
});

promise
  .then((message) => {
    console.log(message); // 성공(resolve)한 경우 실행
  })
  .catch((error) => {
    console.log(error); // 실패(reject)한 경우 실행
  });
```
- new Promise로 프로미스를 생성할 수 있으며, 안에 resolve와 reject를 매개변수로 갖는 콜백 함수를 넣어준다.
  이렇게 만든 promise 변수에 then과 catch 메서드를 붙일 수 있다. 프로미스 내부에서 resolve가 호출되면 then이 실행되고, reject가 호출되면 catch가 실행된다.
  resolve와 reject에 넣어준 인자는 각각 then과 catch의 매개변수에서 받을 수 있다.

```JavaScript
function findAndSaveUser(Users) {
  Users.findOne({})
    .then((user) => {
      user.name = 'zero';
      return user.save();
    })
    .then((user) => {
      return Users.findOne({ gender: 'm' });
    })
    .then((user) => {
      // 생략
    })
    .catch(err => {
      console.error(err);
    })
}
```
- 코드가 깊어지지 않고, then 메서드들은 순차적으로 실행된다. 에러도 마지막 catch에서 한번에 처리할 수 있다.
  모든 콜백 함수를 위와 같이 바꿀 수 있는 것은 아니고, 메서드가 프로미스 방식을 지원해야 한다.
  위의 예제는 findOne과 save 메서드가 내부적으로 프로미스 객체를 가지고 있어서 가능하다.
  지원하지 않는 경우 프로미스로 바꿀 수 있는 방법은 따로 있다.(util 모듈의 promisify를 이용해야함)

### async/await
- 노드 7.6버전부터 지원되는 기능 / 자바스크립트 스펙은 ES2017
- 프로미스가 콜백 지옥을 해결했다지만, 여전히 코드가 장황하다. async/await 문법은 프로미스를 사용한 코드를 한 번 더 깔끔하게 줄여준다.

### 66페이지부터!