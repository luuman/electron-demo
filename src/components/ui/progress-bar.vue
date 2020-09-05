<template>
  <section class="container">
    <!-- <div>{{numBase}} {{checkNum}}</div> -->
    <!-- <div class="li" v-for="(item, index) in List" :key="item">
      <input type="radio" class="radio" name="progress" :value="item" :id="item" :checked="checkNum === item">
      <label :for="item" class="label" @click="tabCheck">{{index}}%</label>
    </div> -->
    <div class="progress" :class="checkNum">
      <div class="progress-bar" :style="`${numBase === 0 ? '' : 'width: ' + numBase * 100 + '%'}`"></div>
    </div>
  </section>
</template>

<script>
  export default {
    props: {
      numBase: Number
    },
    watch: {
      numBase (value) {
        let name = this.checkNum
        Object.keys(this.List).forEach(item => {
          if (item < value * 100) name = this.List[item]
          else return false
        })
        this.checkNum = name || 'five'
      }
    },
    data () {
      return {
        checkNum: '',
        List: {
          5: 'five',
          25: 'twentyfive',
          50: 'fifty',
          75: 'seventyfive',
          100: 'onehundred'
        }
      }
    },
    methods: {
      tabCheck (item) {
        console.log(item)
        this.checkNum = item
      }
    },
    mounted () {
    }
  }
</script>

<style lang="scss" scoped>
.li{
  display: inline;
}
.container {
  margin: 20px auto;
  // width: 640px;
  text-align: center;
  .progress {
    margin: 0 auto;
    // width: 400px;
  }
}

.progress {
  padding: 4px;
  background: rgba(0, 0, 0, 0.25);
  border-radius: 6px;
  -webkit-box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.25), 0 1px rgba(255, 255, 255, 0.08);
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.25), 0 1px rgba(255, 255, 255, 0.08);
}

.progress-bar {
  position: relative;
  height: 16px;
  border-radius: 4px;
  -webkit-transition: 0.4s linear;
  -moz-transition: 0.4s linear;
  -o-transition: 0.4s linear;
  transition: 0.4s linear;
  -webkit-transition-property: width, background-color;
  -moz-transition-property: width, background-color;
  -o-transition-property: width, background-color;
  transition-property: width, background-color;
  -webkit-box-shadow: 0 0 1px 1px rgba(0, 0, 0, 0.25), inset 0 1px rgba(255, 255, 255, 0.1);
  box-shadow: 0 0 1px 1px rgba(0, 0, 0, 0.25), inset 0 1px rgba(255, 255, 255, 0.1);
}
.progress-bar:before, .progress-bar:after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
}
.progress-bar:before {
  bottom: 0;
  background: url("../../assets/image/stripes.png") 0 0 repeat;
  border-radius: 4px 4px 0 0;
}
.progress-bar:after {
  z-index: 2;
  bottom: 45%;
  border-radius: 4px;
  background-image: -webkit-linear-gradient(top, rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.05));
  background-image: -moz-linear-gradient(top, rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.05));
  background-image: -o-linear-gradient(top, rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.05));
  background-image: linear-gradient(to bottom, rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.05));
}

/*
 * Note: using adjacent or general sibling selectors combined with
 *       pseudo classes doesn't work in Safari 5.0 and Chrome 12.
 *       See this article for more info and a potential fix:
 *       http://css-tricks.com/webkit-sibling-bug/
 */
.five .progress-bar {
  width: 5%;
  background-color: #f63a0f;
}

.twentyfive .progress-bar {
  width: 25%;
  background-color: #f27011;
}

.fifty .progress-bar {
  width: 50%;
  background-color: #f2b01e;
}

.seventyfive .progress-bar {
  width: 75%;
  background-color: #f2d31b;
}

.onehundred .progress-bar {
  width: 100%;
  background-color: #86e01e;
}

.radio {
  display: none;
}

.label {
  display: inline-block;
  margin: 0 5px 20px;
  padding: 3px 8px;
  color: #aaa;
  text-shadow: 0 1px black;
  border-radius: 3px;
  cursor: pointer;
}
.radio:checked + .label {
  color: white;
  background: rgba(0, 0, 0, 0.25);
}
</style>
