# classum_nestjs
> [클라썸] 백엔드 개발 과제 입니다⚡

[![NODE][node-image]][node-url]
[![NPM][npm-image]][npm-url]
[![NEST][nest-image]][nest-url]
[![TYPESCRIPT][typescript-image]][typescript-url]

![](https://image.rocketpunch.com/company/76051/classum_logo_1554124591.png?s=200x200&t=inside)

## ERD & API
> [ERD](https://www.erdcloud.com/d/3isExpPmuidHgTe9x) 
> 
> [API 리스트업](https://docs.google.com/spreadsheets/d/1tFb5m51IQNT_7lvGX1y6zu_76ar34isw/edit?usp=sharing&ouid=106044797241147965583&rtpof=true&sd=true)

## 실행 방법
```bash
# development mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## 개발 일지
* 2021.12.26  ERD 설계 & API 리스트업
* 2021.12.27  프로젝트 SETUP
* 2021.12.30-12.31 Nest.js / Typeorm 학습
* 2022.01.01-01.02 User / Auth Module 개발
  * User CRUD / Soft delete & Restore
  * Login / JWT Authorization
* 2022.01.02-01.04 Space / Post / Chat Module 개발
  * Space CRUD / Soft delete & Restore
  * Post CRUD / Soft delete & Restore
  * Chat Create
* 2022.01.04-01.05 Finish Chat / Configuration분리
  * Update getPostDetail with Chat
  * Chat Soft delete & Restore
  * Configuration dev/prod
  * 공유를 위해 .env파일을 ignore에 추가하지 않았습니다.
  * prod의 설정은 가상의 변수입니다.

## 정보

장영욱 – ghwar100@gmail.com


<!-- Markdown link & img dfn's -->
[npm-image]: https://img.shields.io/badge/npm-CB3837.svg?&style=for-the-badge&logo=npm&logoColor=white
[npm-url]: https://www.npmjs.com/

[node-image]: https://img.shields.io/badge/NodeJs-339933.svg?&style=for-the-badge&logo=Node.js&logoColor=white
[node-url]: https://nodejs.org/

[nest-image]: https://img.shields.io/badge/NestJS-E0234E.svg?&style=for-the-badge&logo=NestJS&logoColor=white
[nest-url]: https://nestjs.com/

[typescript-image]: https://img.shields.io/badge/Typescript-3178C6.svg?&style=for-the-badge&logo=Typescript&logoColor=white
[typescript-url]: https://www.typescriptlang.org/