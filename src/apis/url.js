const port = 8080;
const server = `http://10.0.2.2:${port}`;

// TODO: 별로 맘에 안드는데....
const urls = {
    server,
    facilities: `${server}/facilities`,
    getFacilityById: (id) => `${server}/facilities/${id}`,
    getFacilityReviewById: (id) => `${server}/reviews/${id}`,
    loginNaver: `${server}/user/sns/login/naver`,
    logiKakao: `${server}/user/sns/login/kakao`,
    loginGoogle: `${server}/user/sns/login/google`,
    communites: `${server}/community`,
};

export default urls;
