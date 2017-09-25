$("#time").datetimePicker({
    title: '出发时间',
    min: "2017-12-12",
    max: "2022-12-12 12:12",
    onChange: function (picker, values, displayValues) {
        console.log(values);
    }
});
$("#time2").datetimePicker({
    times: function () {
        return [
            {
                values: (function () {
                    var hours = [];
                    for (var i=0; i<24; i++) hours.push(i > 9 ? i : '0'+i);
                    return hours;
                })()
            },
            {
                divider: true,  // 这是一个分隔符
                content: '-'
            }
        ];
    },
    onChange: function (picker, values, displayValues) {
        console.log(values);
    },
});
$("#time3").datetimePicker({
    times: function () {
        return [
            {
                values: ['上午', '下午']
            }
        ];
    },
    value: '2012-12-12 上午',
    onChange: function (picker, values, displayValues) {
        console.log(values);
    }
});
$("#time4").datetimePicker({
    times: function () {
        return [
            {
                values: ['上午8点', '下午2点', '晚上8点']
            }
        ];
    },
    max: '2013-12-12',
    onChange: function (picker, values, displayValues) {
        console.log(values);
    }
});

$("#time-format").datetimePicker({
    title: '自定义格式',
    yearSplit: '-',
    monthSplit: '-',
    dateSplit: '-',
    times: function () {
        return [  // 自定义的时间
            {
                values: (function () {
                    var hours = [];
                    for (var i=0; i<24; i++) hours.push(i > 9 ? i : '0'+i);
                    return hours;
                })()
            },
            {
                divider: true,  // 这是一个分隔符
                content: ':'
            },
            {
                values: (function () {
                    var minutes = [];
                    for (var i=0; i<59; i++) minutes.push(i > 9 ? i : '0'+i);
                    return minutes;
                })()
            },
            {
                divider: true,  // 这是一个分隔符
                content: ''
            }
        ];
    },
    onChange: function (picker, values, displayValues) {
        console.log(values);
    }
});
$("#time-inline").datetimePicker({
    container: '#time-container',
    onChange: function (picker, values, displayValues) {
        console.log(values);
    }
})