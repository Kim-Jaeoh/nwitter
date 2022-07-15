import React, { useEffect, useRef, useState } from "react";
import { dbService, storageService } from "../fbase";
import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import Nweet from "../components/Nweet";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import { v4 } from "uuid";

const Home = ({ userObj }) => {
  const fileInput = useRef();
  const [nweet, setNweet] = useState("");
  const [nweets, setNweets] = useState([]);
  const [attachment, setAttachment] = useState("");

  // // getNweets 아래 로직은 오래된 방식
  // const getNweets = async () => {
  //   const dbNweets = await getDocs(collection(dbService, "nweets"));

  //   // QuerySnapShot = Collection으로 부터 Query, snapshot을 통해 받아온 데이터 타입
  //   // Collection으로부터 특정 Document를 가져왔기 때문에 forEach 반복문으로 하나씩 실행
  //   dbNweets.forEach((document) => {
  //     const nweetObject = {
  //       id: document.id,
  //       ...document.data(), // document 안에 있는 것들 꺼냄
  //     };
  //     // useState의 값 변경 함수(set~)를 쓸 때 값 대신 함수를 전달할 수 있는데
  //     // 그 때 이전 값에 접근할 수 있게 해준다
  //     setNweets((prev) => [nweetObject, ...prev]); // 새로운 것 <- 예전 것 순서
  //   });
  // };

  useEffect(() => {
    // query는 데이터를 요청할 때 사용됨
    const q = query(
      collection(dbService, "nweets"),
      orderBy("createdAt", "desc") // asc(오름차순), desc(내림차순)
    );

    // onSnapshot은 실시간으로 정보를 가져올 수 있음
    onSnapshot(q, (snapshot) => {
      // map 사용 시 - 더 적게 리렌더링 하기 때문에 map 사용이 나음
      const nweetArray = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setNweets(nweetArray);

      // // forEach 사용 시 (리턴값 반환 X)
      // const nweetArrays = snapshot.docs.forEach((doc) => {
      //   const nweetObject = {
      //     id: doc.id,
      //     ...doc.data(),
      //   };
      //   setNweets((prev) => [nweetObject, ...prev]);
      // });
    });
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    let attachmentUrl = "";

    // 빈 문자가 아닐 때 사진 URL에 주소 넣기
    if (attachment !== "") {
      //파일 경로 참조 만들기
      const attachmentfileRef = ref(storageService, `${userObj.uid}/${v4()}`);

      //storage 참조 경로로 파일 업로드 하기
      await uploadString(attachmentfileRef, attachment, "data_url");

      //storage 참조 경로에 있는 파일의 URL을 다운로드해서 attachmentUrl 변수에 넣어서 업데이트
      attachmentUrl = await getDownloadURL(ref(attachmentfileRef));
    }

    const attachmentNweet = {
      text: nweet, // nweet: nweet (useState의 nweet 값)
      createdAt: Date.now(),
      creatorId: userObj.uid,
      attachmentUrl,
    };
    await addDoc(collection(dbService, "nweets"), attachmentNweet);
    setNweet("");
    setAttachment("");
    fileInput.current.value = ""; // 완료 후 파일 문구 없애기
  };

  const onChange = (e) => {
    const {
      target: { value },
    } = e;
    setNweet(value);
  };

  const onFileChange = (e) => {
    const {
      target: { files },
    } = e;
    const theFile = files[0]; // 사진 1장만 첨부
    const reader = new FileReader();
    reader.onloadend = (finishedEvent) => {
      const {
        currentTarget: { result },
      } = finishedEvent;
      setAttachment(result);
    };
    reader.readAsDataURL(theFile);
  };

  const onClearAttachment = () => {
    setAttachment("");
    fileInput.current.value = ""; // 취소 시 파일 문구 없애기
  };

  return (
    <div>
      <form onSubmit={onSubmit}>
        <input
          type="text"
          value={nweet}
          placeholder="What's on your mind?"
          maxLength={120}
          onChange={onChange}
        />
        <input
          type="file"
          accept="image/*"
          onChange={onFileChange}
          ref={fileInput}
        />
        <input type="submit" value="Nweet" />
        {attachment && (
          <div>
            <img
              src={attachment}
              alt="upload file"
              width="50px"
              height="50px"
            />
            <button onClick={onClearAttachment}>Clear</button>
          </div>
        )}
      </form>
      <div>
        {nweets.map((nweet) => (
          <Nweet
            key={nweet.id}
            nweetObj={nweet}
            userObj={userObj}
            isOwner={nweet.creatorId === userObj.uid}
          />
        ))}
      </div>
    </div>
  );
};

export default Home;
