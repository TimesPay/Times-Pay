import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity
} from 'react-native';
import React, {Component} from 'react'
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen'
import { COLOR } from 'react-native-material-ui';


export interface CountUpOptions { // (default)
  startVal?: number; // number to start at (0)
  decimalPlaces?: number; // number of decimal places (0)
  duration?: number; // animation duration in seconds (2)
  useGrouping?: boolean; // example: 1,000 vs 1000 (true)
  useEasing?: boolean; // ease animation (true)
  smartEasingThreshold?: number; // smooth easing for large numbers above this if useEasing (999)
  smartEasingAmount?: number; // amount to be eased for numbers above threshold (333)
  separator?: string; // grouping separator (,)
  decimal?: string; // decimal (.)
  // easingFn: easing function for animation (easeOutExpo)
  easingFn?: (t: number, b: number, c: number, d: number) => number;
  formattingFn?: (n: number) => string; // this function formats result
  prefix?: string; // text prepended to result
  suffix?: string; // text appended to result
  numerals?: string[]; // numeral glyph substitution
}

export default class WalletBalanceCounter extends Component
{
  private defaults: CountUpOptions = {
    startVal: 0,
    endVal: 0,
    decimalPlaces: 0,
    duration: 2,
    useEasing: true,
    useGrouping: true,
    smartEasingThreshold: 999,
    smartEasingAmount: 333,
    separator: ',',
    decimal: '.',
    prefix: '',
    suffix: '',
  };

  private rAF: any;
  private startTime: number;
  private decimalMult: number;
  private remaining: number;
  private finalEndVal: number = null; // for smart easing
  private useEasing = true;
  private countDown = false;
  formattingFn: (num: number) => string;
  easingFn?: (t: number, b: number, c: number, d: number) => number;
  startVal = 0;
  duration: number;
  enableRefresh = true;
  frameVal: number;

  constructor(props){
    super(props)
    this.options = {
      ...this.defaults,
      ...this.props
    }

    this.formattingFn = this.formatNumber;
    this.easingFn = this.easeOutExpo;
    this.startVal = this.validateValue(this.options.startVal);
    this.frameVal = this.startVal;
    this.endVal = this.validateValue(this.options.endVal);
    this.options.decimalPlaces = Math.max(0 || this.options.decimalPlaces);
    this.decimalMult = Math.pow(10, this.options.decimalPlaces);

    this.resetDuration();
    this.options.separator = String(this.options.separator);
    this.useEasing = this.options.useEasing;
    if (this.options.separator === '') {
      this.options.useGrouping = false;
    }

    this.state = {
      printVal: this.formattingFn(this.startVal),
    }
  }

  componentDidUpdate(prevProps) {
    if(prevProps.endVal != this.props.endVal) {
      if(this.props.endVal) {
        this.refresh();
      }
    }
  }
  private resetDuration() {
    this.startTime = null;
    this.duration = Number(this.options.duration) * 1000;
    this.remaining = this.duration;
  }

  // determines where easing starts and whether to count down or up
  private determineDirectionAndSmartEasing() {
    const end = (this.finalEndVal) ? this.finalEndVal : this.endVal;
    this.countDown = (this.startVal > end);
    const animateAmount = end - this.startVal;
    if (Math.abs(animateAmount) > this.options.smartEasingThreshold) {
      this.finalEndVal = end;
      const up = (this.countDown) ? 1 : -1;
      this.endVal = end + (up * this.options.smartEasingAmount);
      this.duration = this.duration / 2;
    } else {
      this.endVal = end;
      this.finalEndVal = null;
    }
    if (this.finalEndVal) {
      this.useEasing = false;
    } else {
      this.useEasing = this.options.useEasing;
    }
  }

  start = () => {
    if (this.duration > 0) {
      this.determineDirectionAndSmartEasing();
      this.enableRefresh = false;
      this.rAF = requestAnimationFrame(this.count);
    } else {
      this.printValue(this.endVal);
    }
  }

  refresh = () => {
    console.log("refresh")
    cancelAnimationFrame(this.rAF);
    this.enableRefresh = true;
    this.resetDuration();
    this.startVal = this.validateValue(this.options.startVal);
    this.frameVal = this.startVal;
    this.start()
  }

  // pass a new endVal and start animation
  update(newEndVal: string | number) {
    cancelAnimationFrame(this.rAF);
    this.startTime = null;
    this.endVal = this.validateValue(newEndVal);
    if (this.endVal === this.frameVal) {
      return;
    }
    this.startVal = this.frameVal;

    if (!this.finalEndVal) {
      this.resetDuration();
    }
    this.determineDirectionAndSmartEasing();
    this.rAF = requestAnimationFrame(this.count);
  }

  count = (timestamp: number) => {
    if (!this.startTime) { this.startTime = timestamp; }

    const progress = timestamp - this.startTime;
    this.remaining = this.duration - progress;

    // to ease or not to ease
    if (this.useEasing) {
      if (this.countDown) {
        this.frameVal = this.startVal - this.easingFn(progress, 0, this.startVal - this.endVal, this.duration);
      } else {
        this.frameVal = this.easingFn(progress, this.startVal, this.endVal - this.startVal, this.duration);
      }
    } else {
      if (this.countDown) {
        this.frameVal = this.startVal - ((this.startVal - this.endVal) * (progress / this.duration));
      } else {
        this.frameVal = this.startVal + (this.endVal - this.startVal) * (progress / this.duration);
      }
    }

    // don't go past endVal since progress can exceed duration in the last frame
    if (this.countDown) {
      this.frameVal = (this.frameVal < this.endVal) ? this.endVal : this.frameVal;
    } else {
      this.frameVal = (this.frameVal > this.endVal) ? this.endVal : this.frameVal;
    }

    // decimal
    this.frameVal = Math.round(this.frameVal * this.decimalMult) / this.decimalMult;

    // format and print value
    this.printValue(this.frameVal);

    // whether to continue
    if (progress < this.duration) {
      this.rAF = requestAnimationFrame(this.count);
    } else if (this.finalEndVal !== null) {
      // smart easing
      this.update(this.finalEndVal);
    }

    if(this.finalEndVal == null){
      this.enableRefresh = true
    }
  }

  printValue(val: number) {
    console.log("printValue", val)
    let result = this.formattingFn(val)
    this.setState({
      printVal: result
    })
  }

  formatNumber = (num: number): string => {
    const neg = (num < 0) ? '-' : '';
    let result: string,
    x: string[],
    x1: string,
    x2: string,
    x3: string;
    result = Math.abs(num).toFixed(this.options.decimalPlaces);
    result += '';
    x = result.split('.');
    x1 = x[0];
    x2 = x.length > 1 ? this.options.decimal + x[1] : '';
    if (this.options.useGrouping) {
      x3 = '';
      for (let i = 0, len = x1.length; i < len; ++i) {
        if (i !== 0 && (i % 3) === 0) {
          x3 = this.options.separator + x3;
        }
        x3 = x1[len - i - 1] + x3;
      }
      x1 = x3;
    }
    // optional numeral substitution
    if (this.options.numerals && this.options.numerals.length) {
      x1 = x1.replace(/[0-9]/g, (w) => this.options.numerals[+w]);
      x2 = x2.replace(/[0-9]/g, (w) => this.options.numerals[+w]);
    }
    return neg + this.options.prefix + x1 + x2 + this.options.suffix;
  }

  easeOutExpo = (t: number, b: number, c: number, d: number): number => {
   return c * (-Math.pow(2, -10 * t / d) + 1) * 1024 / 1023 + b
  }

  validateValue(value: string | number): number {
    const newValue = Number(value);
    if (!this.ensureNumber(newValue)) {
      return null;
    } else {
      return newValue;
    }
  }

  ensureNumber(n: any) {
    return (typeof n === 'number' && !isNaN(n));
  }

  render() {
    return(
      <View style={styles.balanceCounter}>
        <Text style={styles.balanceText}>{this.state.printVal}</Text>
        <TouchableOpacity onPress={this.refresh} style={styles.refreshBtn} disabled={!this.enableRefresh}>
          <FontAwesomeIcon name="refresh" size={wp('3%')} color="black" style={{alignSelf: "center"}}/>
        </TouchableOpacity>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  balanceCounter: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
  },

  balanceText: {
    flex: 12,
    fontWeight: "bold",
    fontSize: wp("4.5%"),
    color: "black",
    fontFamily: "Feather",
    alignSelf: "center"
  },

  refreshBtn: {
    flex: 1,
    padding: wp('1.2%')
  }
})
