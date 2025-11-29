const PORT = 8080;
// const IP = '43.201.248.108';
const IP = 'localhost';
// const SERVER = `http://${IP}:${PORT}`;
const SERVER = `https://yoyang2.site`;
const API_PREFIX = '/api';

const urls = {
    // server base (keep full URL for axios baseURL or socket connections)
    server: SERVER,

    // API paths (no SERVER prefix) — can be used directly with axios baseURL
    facilities: `${API_PREFIX}/facilities`,
    getFacilityById: (id) => `${API_PREFIX}/facilities/${id}`,
    getFacilityReviewById: (facilityId) =>
        `${API_PREFIX}/reviews/${facilityId}`,
    getReviewByIds: (facilityId, reviewId) =>
        `${API_PREFIX}/reviews/${facilityId}/${reviewId}`,
    createReview: (facilityId) => `${API_PREFIX}/reviews/${facilityId}`,
    editReview: (facilityId, reviewId) =>
        `${API_PREFIX}/reviews/${facilityId}/${reviewId}`,
    reportReview: (reviewId) => `${API_PREFIX}/reviews/${reviewId}/report`,
    getFacilityMenu: (facilityId) =>
        `${API_PREFIX}/facilities/${facilityId}/meals`,
    getFacilityNotices: (facilityId) =>
        `${API_PREFIX}/facilities/${facilityId}/dashboard/notices`,

    // SNS login endpoints
    snsLogin: (provider) => `${API_PREFIX}/user/sns/login/${provider}`,
    // loginNaver: `${API_PREFIX}/user/sns/login/naver`,
    // loginKakao: `${API_PREFIX}/user/sns/login/kakao`,
    // loginGoogle: `${API_PREFIX}/user/sns/login/google`,
    loginRefreshToken: `${API_PREFIX}/user/sns/login/refresh-token`,
    // 문자
    sendTelNo: `${API_PREFIX}/user/phone/send`,
    verifyTel: `${API_PREFIX}/user/phone/verify`,

    // community
    communities: `${API_PREFIX}/community`,
    getCommunityById: (communityId) => `${API_PREFIX}/community/${communityId}`,
    CommunityFormPage: `${API_PREFIX}/community`,
    reportCommunity: (communityId) =>
        `${API_PREFIX}/community/${communityId}/report`,
    comment: (communityId) => `${API_PREFIX}/community/${communityId}/comment`,
    commentById: (communityId, commentId) =>
        `${API_PREFIX}/community/${communityId}/comment/${commentId}`,
    commnetById: (communityId, commentId) =>
        `${API_PREFIX}/community/${communityId}/comment/${commentId}`,
    reportCommnet: (communityId, commentId) => `${API_PREFIX}/community/${communityId}/comment/${commentId}/report`,

    // user favorites
    userLike: (userId, facilityId) =>
        `${API_PREFIX}/user/${userId}/favorites/${facilityId}`,
    getFavorites: (userId) => `${API_PREFIX}/user/${userId}/favorites`,

    // geolocation
    getGeoLocation: `${API_PREFIX}/user/geolocation`,

    // reservations
    crateReservation: (facilityId) =>
        `${API_PREFIX}/facilities/${facilityId}/reservation`,
    reservationsList: `${API_PREFIX}/facilities/reservations/list`,
    reservationById: (reservation_id) =>
        `${API_PREFIX}/facilities/reservations/${reservation_id}`,
    createFacilityReservation: (facilityId) =>
        `${API_PREFIX}/facilities/${facilityId}/reservation`,
    cancelReservationById: (reservation_id) =>
        `${API_PREFIX}/facilities/reservations/${reservation_id}`,
    skinAnalysis: `${API_PREFIX}/exam/skin-analysis`,

    // search
    searchVoice: `${API_PREFIX}/search/voice`,

};

export default urls;

// adb reverse tcp:8080 tcp:8080
