const PORT = 8080;
// const IP = '43.201.248.108';
const IP = 'localhost';
const SERVER = `http://${IP}:${PORT}`;

// TODO: 별로 맘에 안드는데....
const urls = {
    // server base (keep full URL for axios baseURL or socket connections)
    server: SERVER,

    // API paths (no SERVER prefix) — can be used directly with axios baseURL
    facilities: '/facilities',
    getFacilityById: (id) => `/facilities/${id}`,
    getFacilityReviewById: (id) => `/reviews/${id}`,

    // SNS login endpoints
    loginNaver: '/user/sns/login/naver',
    loginKakao: '/user/sns/login/kakao',
    loginGoogle: '/user/sns/login/google',
    loginRefreshToken: '/user/sns/login/refresh-token',

    // community
    communities: '/community',

    // user favorites
    userLike: (userId, facilityId) => `/user/${userId}/favorites/${facilityId}`,
    getFavorites: (userId) => `/user/${userId}/favorites`,

    // geolocation
    getGeoLocation: '/user/geolocation',

    // reservations
    reservationsList: '/facilities/reservations/list',
    reservationById: (id) => `/facilities/reservations/${id}`,
    createFacilityReservation: (facilityId) =>
        `/facilities/${facilityId}/reservation`,

    // search
    searchVoice: '/search/voice',
};

export default urls;

// adb reverse tcp:8080 tcp:8080
