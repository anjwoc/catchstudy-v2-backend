# CatchStudy V2 Backend

현재 비용 문제와 도메인 기간 만료로 접속할 수 없습니다.

## Description

[원본 프로젝트](https://github.com/anjwoc/CatchDev)
위 링크의 프로젝트를 리뉴얼 하는 중입니다.
스터디를 만들어 구인할 수 도 있고 직접 참여할 수 있는 서비스를 만들어봤습니다.

## 새로 적용한 부분

- Typescript 도입
  - 발생하지 않아도 될 간단한 타입으로 인한 버그들로 소모되는 시간으로 필요성을 느낌
  - 기존의 JS로 작성된 모든 코드들을 TS로 옮겼다.
- Jenkins를 통해 CI/CD 구성
  - 기존에는 수동으로 AWS or GCP에 배포
  - Jenkins를 이용해 CI/CD를 구성
- 프로젝트 구조 변경
  - 아래 링크를 참조하고 기존 프로젝트는 나쁜예의 프로젝트 구조로 되어있었다.
  - 포스트의 내용처럼 컴포넌트 기반으로 묶어서 구성
  - https://github.com/goldbergyoni/nodebestpractices/blob/master/sections/projectstructre/breakintcomponents.korean.md

## 추후 적용할 기술

- TDD
  - CI/CD를 구성하고나니 테스트가 얼마나 중요한지 깨달았다.
  - 테스트없는 배포 자동화는 무의미한 배포일뿐이였다.

## Tech Stack

Frontend: Vue.js, Nuxt, html, css, scss

Backend: Node.js, typescript, sequelize, express

DataBase: Mysql for AWS RDS

DevOps: AWS, Ubuntu, Jenkins, Docker

- CI/CD 구성은 다음과 같습니다.
- 초기에는 AWS를 통해 서버를 구성했으나 비용의 부담으로 저전력 피씨로 개인 서버를 구축
- VMware OS를 올려서 필요한 만큼 인스턴스에 할당해 서버를 구성
- 별도의 Jenkins를 서버를 할당하고 세팅
- Github Webhook을 통해 특정 브랜치에 푸시될 시 Jenkins에서 빌드 후 도커 허브로 푸시
- CI 작업이 끝나면 Jenkins측에서 원격지에 구성해둔 스크립트를 실행
- 스크립트에서는 Jenkins측에서 푸시했던 도커 허브의 이미지를 풀 명령어로 가져온다.
- 도커 컴포즈를 새로 실행하여 업데이트 된 부분을 반영한다.

etc: github

## Build Setup

```bash
# install dependencies
$ npm install

# serve with hot reload at localhost:3000
$ npm run dev

# build for production and launch server
$ npm start
```
