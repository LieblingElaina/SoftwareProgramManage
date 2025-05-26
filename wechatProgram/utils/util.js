function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const weekArray = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
    const week = weekArray[date.getDay()];
    return {
        year,
        month,
        day,
        week
    };
}

module.exports = {
    formatDate
};  

