import axios from 'axios';

export const getRequest = (url) => {
    return axios({
        method: 'get',
        url: `${url}`,
        headers: {
            'Authorization' : 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjIwMTg2MTAwQHFxLmNvbSIsImV4cCI6MTYwNTY2NTUzNSwiaWF0IjoxNjA1NjYxOTM1fQ.7LSEcQ9_Pfpya8_wNEdusET-FyewtwLj0kIHwqzZqMk'
        }
    });
};
