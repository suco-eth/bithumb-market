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

3. 폴더에서 환경 설정

폴더에 확장자 `.txt` 파일이 있는데 여기를 원하는 값으로 수정

필수
- `api_key.txt` : 빗썸 api connect 키 입력 후 저장
- `api_secret.txt` : 빗썸 api 시크릿 키 입력 후 저장

옵션
- `krw_amount.txt` : 한번에 매수할 원화 금액 (기본값 10만원 )
- `krw_target_amount.txt` : 총 거래량 (기본값 10억5천만원)
- `order_currency.txt` : 거래를 원하는 코인 티커 (기본값 BTC)

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
