import axios from 'axios';

export const getRequest = (url, params) => {
    return axios({
        method: 'get',
        url: `${url}`,
        params: params,
        headers: {
            'Authorization' : 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjIwMTg2MTAwQHFxLmNvbSIsImV4cCI6MTYwNTYyNjg4MywiaWF0IjoxNjA1NjIzMjgzfQ.32l7L1Qb08vaPLNsHsTCAl1avZwF94WczIh-zzSN0Ww'
        }
    });
};
