const util = require('../../utils/util')

Page({
    data: {
        currentDate: {}
    },
    onLoad() {
        const now = new Date();
        const formattedDate = util.formatDate(now);
        this.setData({
            currentDate: formattedDate
        });
    }
});    