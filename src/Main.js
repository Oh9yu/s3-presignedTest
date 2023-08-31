import React, { useState } from "react";
import styled from "styled-components";

const Main = () => {
  const [file, setFile] = useState([]);
  const [img, setImg] = useState();

  // 1. 이미지를 올린다 => input file 태그에 onChange 함수가 실행되면 file useState에 저장 (서버 통신없음)
  const handleFileUpload = (e) => {
    setFile(e.target.files[0]);
  };

  const submitHandler = () => {
    //2. 이미지 업로드한다 => 서버에 주소 요청을 해서 presigned URL을 받아온다
    fetch("http://54.180.86.175:3000/presignedUrl", {
      headers: { "Content-Type": "application/json" },
      method: "PUT",
      //이름설정 : 뒤에서 4개 제거
      body: JSON.stringify({ name: file.name.slice(0, -4) }),
    })
      .then((res) => res.json())
      //3. 통신 성공 후 presigned URL이 들어오면 주소에 file을 업로드
      .then((data) => {
        fetch(`${data.presignedUrl}`, {
          headers: {
            "Content-Type": file.type,
          },
          method: "PUT",
          body: file,
        });
      });
  };

  const getImgHandler = () => {
    //4. useState에 저장된 file이름을 query에 넣고 이미지 GET요청
    fetch(
      `http://54.180.86.175:3000/presignedUrl?name=${file.name.slice(0, -4)}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
        method: "GET",
      }
    )
      .then((res) => res.json())
      //5. 통신 성공 후 이미지 들어오면 img useState에 이미지 s3주소 저장.
      .then((data) => setImg(data.presignedUrl));
  };

  return (
    <Container>
      <Body>
        <InputSection>
          <InputWrapper>
            <ImgInput type="file" onChange={handleFileUpload} />
            <Button onClick={submitHandler}>Submit!</Button>
            <Button onClick={getImgHandler}>Get!</Button>
          </InputWrapper>
        </InputSection>
        {/* 6. 이미지 저장 주소를 이미지태그에 바인딩 */}
        <Result>{img && <Img src={img} alt="img" />}</Result>
      </Body>
    </Container>
  );
};

export default Main;

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
`;

const Body = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 400px;
  height: 600px;
  padding: 10px;
  border: 2px solid #ddd;
`;

const InputSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100px;
  border-bottom: 1px solid #ddd;
`;
const InputWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 80%;
`;

const ImgInput = styled.input``;

const Button = styled.button`
  width: max-content;
  padding: 0 5px;
  height: 25px;
  background-color: #fff;
  border: 1px solid #aaa;
  cursor: pointer;
  &:hover {
    background-color: #eee;
  }
`;

const Result = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 500px;
`;

const Img = styled.img`
  width: 80%;
`;
