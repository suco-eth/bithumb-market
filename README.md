## 빗썸 시장가 매수 매도 API 예제

!! 중요 !!
빗썸 수수료 무료 쿠폰 등록하세요,,

#### 준비물 및 순서

1. Bithumb API KEY

- API 키 발급 시 1. 매수주문 2. 매도주문 // optional, 3. 회원지갑정보 권한 체크
- Connect Key, Secret Key
- API Key 활성화
- https://www.bithumb.com/react/api-support/management-api

2. Node.js 다운로드 (https://nodejs.org/en/download)

3. config.js 파일에서 API 키 추가 및 필요한 부분 수정

```
const config = {
  // 빗썸 API 키
  api_key: "",

  // 빗썸 API 시크릿
  api_secret: "",

  // 매수할 금액 원화 가치
  krw_amount: "100000", // 10 만

  // 원하는 거래량 원화
  krw_target_volume: "1000000000", // 10 억

  // 거래 페어
  order_currency: "BTC", // 비트코인

  // 지불 수단
  payment_currency: "KRW", // 원화
};
```

4. cmd 창에서 다운 받은 폴더로 이동

- `cd bithumb-market`

1. 설치

- `npm i`

### 명령어

#### 실행

```
node index.js
```

#### 원화로 전부 변경 (중간에 멈췄을 때나 끝낼 때)

```
node cleanup.js
```
