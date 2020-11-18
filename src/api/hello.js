import { getRequest } from '@/config/axios';



export const hello = () => {
    const url = '/api/getHello';
    return getRequest(url)
};
