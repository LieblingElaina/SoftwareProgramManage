Page({
  data: {
    searchValue: '',
    filteredNewsList: [],
    newsList: [
      { id: 1, year: '2024', amount: '5000万', title: '全国挑战赛', views: '8825', date: '比赛截止日期2024-12-31', participating: false },
      { id: 2, year: '2024', amount: '100万', title: '年度总决赛', views: '99999+', date: '比赛截止日期2024-12-31', participating: false },
      { id: 3, year: '2024', amount: '200万', title: '年度特别赛事', views: '5956', date: '比赛截止日期2024-12-31', participating: false },
      { id: 4, year: '2024', amount: '500万', title: '大型区域赛', views: '86781', date: '比赛截止日期2024-12-31', participating: false },
      { id: 5, year: '2024', amount: '300万', title: '创新挑战赛', views: '32418', date: '比赛截止日期2024-12-31', participating: false },
      { id: 6, year: '2024', amount: '800万', title: '技术精英赛', views: '21837', date: '比赛截止日期2024-12-31', participating: false },
      { id: 7, year: '2024', amount: '150万', title: '新秀挑战杯', views: '12345', date: '比赛截止日期2024-12-31', participating: false },
      { id: 8, year: '2024', amount: '750万', title: '高手对决赛', views: '98765', date: '比赛截止日期2024-12-31', participating: false }
    ]
  },

  updateSearchValue(e) {
    this.setData({
      searchValue: e.detail.value
    });
  },

  searchContest() {
    const searchValue = this.data.searchValue.toLowerCase();
    const filteredNewsList = this.data.newsList.filter(item => item.title.toLowerCase().includes(searchValue));
    this.setData({ filteredNewsList });
    if (filteredNewsList.length === 0) {
      wx.showToast({
        title: '未找到匹配的比赛',
        icon: 'none'
      });
    }
  },

  toggleParticipation(e) {
    const id = e.currentTarget.dataset.id;
    const newsListUpdated = this.data.newsList.map(item => {
      if (item.id === id) {
        item.participating = !item.participating;
      }
      return item;
    });
    this.setData({
      newsList: newsListUpdated,
      filteredNewsList: newsListUpdated.filter(item => item.title.toLowerCase().includes(this.data.searchValue.toLowerCase()))
    });
  },

  onLoad() {
    this.setData({
      filteredNewsList: this.data.newsList
    });
  }
});
