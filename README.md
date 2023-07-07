# Nwitter

<br>

![](https://velog.velcdn.com/images/rlawodh123/post/6e90ea11-23a9-405f-ba15-1ae62cd18ccf/image.gif)

<br>

> 😎 [클론 사이트 바로가기](https://kim-jaeoh.github.io/nwitter/#/)<br>
> [🔍 자세한 내용 보러가기 (velog 포스팅)](https://velog.io/@rlawodh123/series/%ED%8A%B8%EC%9C%84%ED%84%B0-%ED%81%B4%EB%A1%A0)

<br>

## 📋 Project

- 해당 프로젝트는 Firebase와 Redux를 연습하며 이해하는 것과 css 라이브러리 없이 순수 css로 제작하는 것이 목표였습니다. 처음으로 긴 시간동안 애정을 가지고 혼자 열심히 작업한 웹앱입니다.
  - Nomad Coder의 "트위터 클론코딩" 강의를 수강하고 만든 작업물에 최대한 트위터와 비슷하게 기능과 디자인을 추가했습니다. 추가된 내용들은 페이지별로 나누어서 작성했습니다.

<br>

## 🛠️ 사용 기술

- `React`, `Css-Module`
- `Redux`, `Mui`, `browser-image-compression`, `emoji-picker-react`, `React-Router-Dom`
- `Firebase`
- Deploy : `gh-page`

<br>

## **✨ 전체 기능 및 특징**

- `Firebase`를 사용해 회원가입/로그인 구현 및 실시간 업데이트
- 반응형 웹
- 트윗 작성
  - 별도의 버튼 추가 (홈이 아닌 다른 페이지에서 글을 쓰고자 할 때)
  - 이미지 추가 및 삭제 가능 (`browser-image-compression` 를 사용하여 이미지 용량 압축)
  - 이모지 모달 추가 (pc 버전만 사용 가능)
  - 트윗 수정/삭제
- 반응형 액션 (답글, 리트윗, 좋아요, 북마크)
- 검색창 및 팔로우 할 유저 추천 추가
  - 유저 팔로우, 언팔로우 가능

<br>

## 💫 페이지별 기능 및 특징

<details>
<summary>가입/로그인</summary>
<div markdown="1">

[가입/로그인 링크](https://velog.io/@rlawodh123/React-%ED%8A%B8%EC%9C%84%ED%84%B0-%ED%81%B4%EB%A1%A0-Auth)

- 회원가입/로그인
  - 토글 버튼으로 회원가입/로그인을 따로 노출
  - 일반 이메일 형식이 아닌 구글, 깃허브 아이디로도 가입 가능
  - 사이트에 들어왔을 때 유저의 상태 변화 추적 가능
    - 로그인, 로그아웃, 어플리케이션 초기화(새로고침 or 재시작) 시 변화 추적
  - 구글, 깃허브가 아닌 일반 이메일 형식으로 회원가입/로그인 할 때 발생하는 에러 문구를`includes`와 `replace` 메소드를 이용하여 표기

</div>
</details>

<details>
<summary>홈</summary>
<div markdown="2">

[홈 링크](https://velog.io/@rlawodh123/React-%ED%8A%B8%EC%9C%84%ED%84%B0-%ED%81%B4%EB%A1%A0-Firebase-Main)

- 실시간 업데이트
- 유저 정보 확인
  - 로그아웃 가능
- 트윗 작성
  - 별도의 버튼 추가 (홈이 아닌 다른 페이지에서 글을 쓰고자 할 때)
  - 이미지 추가 및 삭제 가능
  - 이모지 추가 (pc 버전에서만 지원하도록)
  - 수정/삭제
- 반응형 액션 (답글, 리트윗, 좋아요, 북마크)
- 검색창 및 팔로우 할 유저 추천 추가
  - 유저 팔로우, 언팔로우 가능

</div>
</details>

<details>
<summary>탐색하기</summary>
<div markdown="3">

[탐색하기 링크](https://velog.io/@rlawodh123/React-%ED%8A%B8%EC%9C%84%ED%84%B0-%ED%81%B4%EB%A1%A0-Firebase-Explore)<br>
※ '탐색하기'에서의 대부분 기능들은 Home(main)과 같으며 반복되는 코드들을 하나의 컴포넌트들로 묶어 재사용할 수 있게 했습니다.

- 검색창 및 트윗·사용자 탭
  - 반응형 액션 (답글, 리트윗, 좋아요, 북마크)
  - 유저 팔로우, 언팔로우 가능

</div>
</details>

<details>
<summary>알림, 북마크</summary>
<div markdown="4">

[알림, 북마크 링크](https://velog.io/@rlawodh123/React-%ED%8A%B8%EC%9C%84%ED%84%B0-%ED%81%B4%EB%A1%A0-Firebase-Notice)

- 카테고리 세분화 및 각각 정보들이 업데이트 될 때마다 실시간으로 확인 가능
- 라우터 내의 각 탭에서 렌더링 되는 정보들은 하나의 컴포넌트로 만들어서 재사용
- 노출되는 목록 오브젝트 클릭 시 라우터 이동과 시간 노출 부분은 따로 custom hooks로 빼내어 사용
  - (내용을 감싸고 있는 태그와 내용들(이미지, 닉네임)의 라우터가 다름)
  - 감싸고 있는 태그에 `<Link>`를 주게 될 시 내용들을 클릭할 때마다 원하는 라우터가 아닌 감싸진 태그의 라우터로 이동됨
  - `ref`로 if문을 작성해 `useHistory()`로 구현

</div>
</details>

<details>
<summary>프로필</summary>
<div markdown="5">

[프로필 링크](https://velog.io/@rlawodh123/React-%ED%8A%B8%EC%9C%84%ED%84%B0-%ED%81%B4%EB%A1%A0-Firebase-Profile)

- 카테고리 세분화 및 '프로필 수정', '북마크' 탭은 본인 프로필에서만 보일 수 있게 함
- '프로필 수정' 클릭 시 모달창이 활성화 되어 배경·프로필 이미지, 닉네임·자기소개 추가/변경/삭제 가능
- 가입일과 팔로잉, 팔로워 숫자 확인
  - Right Bar 팔로우 추천에서의 팔로우를 다른 유저의 프로필 탭에서도 가능
- 프로필 탭에서도 로그아웃 가능

</div>
</details>
