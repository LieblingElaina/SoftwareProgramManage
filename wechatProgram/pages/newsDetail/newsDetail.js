Page({
    data: {
        newsId: '',
        newsContent: ''
    },
    onLoad(options) {
        const { newsId } = options;
        const newsList = [
            { id: 1, title: '新闻1', content: '新闻内容1' },
            { id: 2, title: '新闻2', content: '新闻内容2' },
            { id: 3, title: '新闻3', content: '新闻内容3' }
        ];
        const news = newsList.find(item => item.id === parseInt(newsId));
        if (news) {
            this.setData({
                newsId,
                newsContent: news.content
            });
        }
    }
})