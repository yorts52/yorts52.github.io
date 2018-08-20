/*
 * @Author: kael 
 * @Date: 2012-05-30 11:12:28 
 * @Last Modified by: kael
 * @Last Modified time: 2017-05-22 11:13:18
 */

var Calendar = function(date) {
  this.date = date ? date : new Date();
  this.cDate = {
    toString: function() {
      return this.tg + this.dz + '年(' + this.sx + ')' + this.yf + '月' + this.rq + this.sj;
    }
  };
  this.init();
  this.calc();
};

Calendar.prototype = {
  constructor: Calendar,
  cDays: [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334],
  cData: [0x41A95, 0xD4A, 0xDA5, 0x20B55, 0x56A, 0x7155B, 0x25D, 0x92D, 0x5192B, 0xA95, 0xB4A, 0x416AA, 0xAD5, 0x90AB5, 0x4BA, 0xA5B, 0x60A57, 0x52B, 0xA93, 0x40E95],
  CSTR: {
    TG: "甲乙丙丁戊己庚辛壬癸", // 天干
    DZ: "子丑寅卯辰巳午未申酉戌亥", // 地支
    SX: "鼠牛虎兔龙蛇马羊猴鸡狗猪", // 生肖
    RQ: "一二三四五六七八九十", // 日期
    YF: "正二三四五六七八九十冬腊", // 月份
    XQ: "日一二三四五六" // 星期
  },
  // month是大月还是小月
  getBit: function(index, month) {
    return (this.cData[index] >> month) & 1;
  },
  // 初始化
  init: function() {
    var total, m, n, k;
    var isEnd = false;
    var tmp = this.date.getFullYear();
    total = (tmp - 2001) * 365
      + Math.floor((tmp - 2001) / 4)
      + this.cDays[this.date.getMonth()]
      + this.date.getDate() - 23; // 2001年1月23是除夕;该句计算到起始年正月初一的天数
    if (this.date.getYear() % 4 == 0 && this.date.getMonth() > 1) {
      total++; // 当年是闰年且已过2月再加一天！
    }
    for (m = 0; ; m++) {
      k = (this.cData[m] < 0xfff) ? 11 : 12; //起始年+m闰月吗？
      for (n = k; n >= 0; n--) {
        if (total <= 29 + this.getBit(m, n)) { //已找到农历年!
          isEnd = true;
          break;
        }
        total = total - 29 - this.getBit(m, n); //寻找农历年！
      }
      if (isEnd) {
        break;
      }
    }
    this.cDate.Year = 2001 + m; //农历年
    this.cDate.Month = k - n + 1; //农历月
    this.cDate.Day = total; //农历日
    if (k == 12) { //闰年！
      if (this.cDate.Month == Math.floor(this.cData[m] / 0x10000) + 1) { //该月就是闰月！
        this.cDate.Month = 1 - this.cDate.Month;
      }
      if (this.cDate.Month > Math.floor(this.cData[m] / 0x10000) + 1) {
        this.cDate.Month--; //该月是闰月后某个月！
      }
    }
    this.cDate.Hour = Math.floor((this.date.getHours() + 1) / 2);
  },
  // 计算
  calc: function() {
    var year = this.cDate.Year - 4;
    this.cDate.tg = this.CSTR.TG.charAt(year % 10); //天干
    this.cDate.dz = this.CSTR.DZ.charAt(year % 12); //地支
    this.cDate.sx = this.CSTR.SX.charAt(year % 12); //生肖
    this.cDate.yf = this.CSTR.YF.charAt(this.cDate.Month - 1);
    if (this.cDate.Month < 1) {
      this.cDate.yf = "闰" + this.CSTR.YF.charAt(-this.cDate.Month - 1);
    }
    this.cDate.rq = (this.cDate.Day < 11) ? "初" : ((this.cDate.Day < 20) ? "十" : ((this.cDate.Day < 30) ? "廿" : "卅"));
    if (this.cDate.Day % 10 != 0 || this.cDate.Day == 10) {
      this.cDate.rq += this.CSTR.RQ.charAt((this.cDate.Day - 1) % 10);
    }
    this.cDate.sj = this.CSTR.DZ.charAt((this.cDate.Hour) % 12) + "时";
    if (this.cDate.Hour == 12) {
      this.cDate.sj = "夜" + this.cDate.sj;
    }
  }
}