Page({
    data: {
        phone: '',
        code: '',
        canLogin: false
    },
    handlePhoneInput(e) {
        let phone = e.detail.value;
        phone = phone.replace(/\D/g, '');
        this.setData({
            phone,
            canLogin: phone.length > 0 && this.data.code.length > 0
        });
    },
    handleCodeInput(e) {
        let code = e.detail.value;
        code = code.replace(/\D/g, '');
        this.setData({
            code,
            canLogin: code.length > 0 && this.data.phone.length > 0
        });
    },
    handleLogin() {
        console.log('登录成功');
    }
});    