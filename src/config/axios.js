import axios from 'axios';

export const getRequest = (url, params) => {
    return axios({
        method: 'get',
        url: `${url}`,
        params: params,
        headers: {
            'Authorization' : 'eyJ0eXAiOiJKV1QiLCJhbiOiJIUzI1NiJ9.eyJzdWIiOiIxMjIwMTg2MTAwQHFxLmNvbSIsImV4cCI6MTYwNTYwMTAwNywiaWF0IjoxNjA1NTk3NDA3fQ.FbvAxahpQFE_4Pospg8P9M7R5ozG9bbcLk6RAETutgA'
        }
    });
};
