import axios from 'axios';
import util from '@/plugins/util.js'
import confIp from '@/plugins/conf.js'
export default async() => {
    try {
        const { data } = await axios.post(`${confIp.baseUrl6()}token/refresh`, {
          refreshToken: util.getCookie('refreshToken')
        });
        const { code, data: { accessToken, refreshToken, name, accountType } } = data || {};
        if (accessToken && refreshToken) {
            util.setCookie('accessToken', accessToken); //jwt
            util.setCookie('refreshToken', refreshToken); //刷新token
            util.setCookie('account', name); //储存账号
            util.setCookie('accountType', accountType); //储存账号类型
        }
        return { code, data: { accessToken } };
    } catch (error) {
        console.log(error);
    }
}