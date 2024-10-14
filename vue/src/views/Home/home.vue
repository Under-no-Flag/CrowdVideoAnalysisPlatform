<template>
    <div class="container">
        <div class="video-box">
            <p class="monitoring-title">实时监控</p>
            <video ref="videoPlayer1" :src="videoSrc1" @play="onPlay1" @pause="onPause1" @ended="onEnded1" controls>
                视频类型有误。
            </video>
        </div>
        <div class="video-box">
            <p class="monitoring-title">分析结果</p>
            <video ref="videoPlayer2" :src="videoSrc2" @play="onPlay2" @pause="onPause2" @ended="onEnded2" controls>
                视频类型有误。
            </video>
        </div>
        <div class="image-box">
            <p class="monitoring-title">结果统计</p>
            <div ref="lineChart" style="width: 100%; height: 250px;"></div>
        </div>
        <div class="image-box">
            <p class="monitoring-title">结果统计</p>
        </div>
    </div>
</template>

<script>
import * as echarts from 'echarts';
export default {
    data() {
        return {
            videoSrc1: '/src/assets/20241014-155324.mp4',
            videoSrc2: '/src/assets/20241014-155324.mp4',
            isPlaying1: false,
            isPlaying2: false,
            
        };
    },
    methods: {
        initLineChart() {
      const myChart = echarts.init(this.$refs.lineChart);
      const option = {
        title: {
          text: '区域风险指数'
        },
        xAxis: {
          data: ['周一', '周二', '周三', '周四', '周五']
        },
        yAxis: {},
        series: [
          {
            name: '销量',
            type: 'line',
            data: [120, 200, 150, 80, 70],
            smooth: true
          }
        ]
      };
      myChart.setOption(option);
    },
        togglePlay1() {
            const video = this.$refs.videoPlayer1;
            if (this.isPlaying1) {
                video.pause();
            } else {
                video.play();
            }
        },
        onPlay1() {
            this.isPlaying1 = true;
        },
        onPause1() {
            this.isPlaying1 = false;
        },
        onEnded1() {
            this.isPlaying1 = false;
        },
        togglePlay2() {
            const video = this.$refs.videoPlayer2;
            if (this.isPlaying2) {
                video.pause();
            } else {
                video.play();
            }
        },
        onPlay2() {
            this.isPlaying2 = true;
        },
        onPause2() {
            this.isPlaying2 = false;
        },
        onEnded2() {
            this.isPlaying2 = false;
        },
    },
    mounted() {
    this.initLineChart();
  },
};
</script>

<style scoped>
.video-player {
    display: flex;
    flex-direction: column;
    align-items: center;
}

button {
    margin-top: 10px;
}

.container {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
}

.video-box,
.image-box {
    width: 45%;
    margin: 10px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    align-items: center;
}

video,
img {
    width: 85%;
    height: auto;
    max-width: 100%;
    max-height: 100vh;
    aspect-ratio: 16 / 9;
    margin-bottom: 10px;
    margin-top: 10px;
}

.monitoring-title {
    font-size: 22px;
    text-align: center;
    margin-bottom: 10px;
    margin-top: 10px;

}
</style>