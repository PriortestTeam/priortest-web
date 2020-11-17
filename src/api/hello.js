import { getRequest } from '@/config/axios';


export const hello = () => {
    const params = '';
    const url = '/api/getHello';
    return getRequest(url,params)
};
