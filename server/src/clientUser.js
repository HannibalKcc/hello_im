class ClientUser {
    constructor() {
        this._loginMap = {
            'customer': false,
            'customerService': false,
        };
    }

    isConnectAble(tryLoginType) {
        return !this._loginMap [tryLoginType];
    }

    logInOut(isLogin, loginType) {
        if (!['customer', 'customerService'].includes(loginType)) {
            throw '参数 loginType 值错误';
        }

        this._loginMap[loginType] = isLogin;
    }
}

const clientUser = new ClientUser();

module.exports = clientUser;
