import { getRequest } from '@/config/axios';


export const hello = () => {
    const params = '';
    const url = '/getHello';
    return getRequest(url,params)
};
