import {
  SafeAreaView,
  StyleSheet,
  View,
  Text
} from 'react-native';

import React, {Component} from 'react'
import {translate} from '../../utils/I18N'
import {COLOR} from 'react-native-material-ui'
import {Card} from 'native-base'
import {TouchableOpacity} from 'react-native-gesture-handler'


export default class WalletBalanceCounter extends Component
{
  constructor(props) {
    super(props);
  }

  render() {
    return(
      <Card style={styles.balanceCounter}>
          <CountUp
            start={-875.039}
            end={this.props.balance}
            delay={0}
            duration={2.75}
            separator=" "
            decimals={4}
            decimal=","
            prefix="EUR "
            suffix=" left"
          >
            {({ countUpRef, start }) => (
              <div>
                <span ref={countUpRef} />
              </div>
            )}
          </CountUp>
      </Card>
    )
  }
}

const styles = StyleSheet.create({
    balanceCounter: {
      fontSize: 30,
      color: "white",
      fontWeight: "bold",
      backgroundColor: COLOR.blue600
    }
})
