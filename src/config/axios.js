import axios from 'axios';

export const getRequest = (url, params) => {
    return axios({
        method: 'get',
        url: `${url}`,
        params: params,
        headers: {
            'Authorization' : '\teyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjIwMTg2MTAwQHFxLmNvbSIsImV4cCI6MTYwNTYyNTQ4NiwiaWF0IjoxNjA1NjIxODg2fQ.ZzUHAdgMJGipQTX9_IsW60pE5OLHkbfgQnK-kcJcaPM'
        }
    });
};
