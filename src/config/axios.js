import axios from 'axios';

export const getRequest = (url) => {
    return axios({
        method: 'get',
        url: `${url}`,
        headers: {
            'Authorization' : 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjIwMTg2MTAwQHFxLmNvbSIsImV4cCI6MTYwNTY3MDU2MywiaWF0IjoxNjA1NjY2OTYzfQ.b9o2lYsXWEGbxfzwu_mzaX-vc05wgVLYHUdpmHOw4yM'
        }
    });
};
