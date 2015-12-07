/*! React Starter Kit | MIT License | http://www.reactstarterkit.com/ */

import React, { PropTypes, Component } from 'react';
import ReactDOM from 'react-dom';
import withStyles from '../../decorators/withStyles';
import styles from './LineChooser.scss';
import _ from 'lodash';
import moment from 'moment';
import BasApi from '../../services/bas-api';
import TRAVEL_TYPES from '../../constants/travel-types';

import store from '../../stores/store';

import {
  selectStation,
  changeTravelType,
 } from '../../actions/actions';

const AutoComplete = require('material-ui/lib/auto-complete');
const FloatingActionButton = require('material-ui/lib/floating-action-button');
const FontIcon = require('material-ui/lib/font-icon');

import TextUtils from '../../services/text-utils';
import placesJson from '../../data/places';
let allPlaces = _.pluck(placesJson, 'First');

const changeTravelTypeStyle = {
  verticalAlign: 'middle',
  margin: '0 1.4rem',
};

const stationTextStyle = {
  fontSize: '18px',
  fontWeight: 'bold',
  textTransform: 'uppercase',
  width: '256px',
  display: 'inline-block',
}

const ta_r = {
  textAlign: 'right',
}

@withStyles(styles)
class LineChooser extends Component {

  state = {
    places: [],
  };

  constructor(props) {
    super(props);
    store.subscribe(this.setPageState.bind(this));
  }

  componentWillMount() {
    this.setPageState();
  }

  setPageState() {

    this.setState(store.getState().bas);

    if(this.state.resultsError) {
      this.showResultsError();
    }
  }

  onPlaceChange(text) {
    this.setState({
      places: _.take(allPlaces.filter(this.onPlaceFilter.bind(this, text)), 10)
    });
  }

  onPlaceFilter(q, place) {
    return TextUtils.removeDiacritics(place.toLowerCase()).indexOf(TextUtils.removeDiacritics(q).toLowerCase()) === 0;
  }

  onPlaceSelected(place) {
    console.log(place);
    store.dispatch(selectStation(place));
  }

  onChangeTravelType() {
    const travelType = this.state.travelType === TRAVEL_TYPES.arrival ? TRAVEL_TYPES.departure : TRAVEL_TYPES.arrival;
    store.dispatch(changeTravelType(travelType));
  }

  render() {
    let beogradStyle = this.state.travelType === TRAVEL_TYPES.arrival ? stationTextStyle : _.extend(stationTextStyle, ta_r);
    let place1 = <span style={beogradStyle}>Beograd</span>;
    let place2 = <span>
      <AutoComplete
        searchText={this.state.station}
        animated={false}
        hintText = "Mesto"
        dataSource= {this.state.places}
        onUpdateInput={this.onPlaceChange.bind(this)}
        filter={this.onPlaceFilter.bind(this)}
        onNewRequest={this.onPlaceSelected.bind(this)} />
    </span>;


    if(this.state.travelType === TRAVEL_TYPES.arrival) {
      let tmp = place1;
      place1 = place2;
      place2 = tmp;
    }

    return (
      <div className="LineChooser">
        <div className="LineChooser-container">
          <div>
            {place1}

            <FloatingActionButton mini={true} secondary={true} onTouchTap={this.onChangeTravelType.bind(this)} style={changeTravelTypeStyle}>
              <FontIcon>
                <i className="material-icons">swap_horiz</i>
              </FontIcon>
            </FloatingActionButton>

            {place2}
          </div>
        </div>
      </div>
    );
  }

}

export default LineChooser;
