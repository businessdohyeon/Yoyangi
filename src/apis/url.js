const PORT = 8080;
const IP = '43.203.209.92';
const SERVER = `http://localhost:${PORT}`;

// TODO: 별로 맘에 안드는데....
const urls = {
    server: SERVER,
    facilities: `${SERVER}/facilities`,
    getFacilityById: (id) => `${SERVER}/facilities/${id}`,
    getFacilityReviewById: (id) => `${SERVER}/reviews/${id}`,
    loginNaver: `${SERVER}/user/sns/login/naver`,
    logiKakao: `${SERVER}/user/sns/login/kakao`,
    loginGoogle: `${SERVER}/user/sns/login/google`,
    communites: `${SERVER}/community`,
    userLike: (userId, facilityId) =>
        `${SERVER}/user/${userId}/favorites/${facilityId}`,
    getGeoLocaton: `${SERVER}/user/geolocation`,
};

export default urls;

// adb reverse tcp:8080 tcp:8080
