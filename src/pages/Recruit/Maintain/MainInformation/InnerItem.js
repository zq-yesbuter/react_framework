import React, { Component } from 'react';
import { routerRedux, Route, Switch, Redirect, Link } from 'dva/router';
import { connect } from 'dva';

function InnerItem({ match, routerData, location, dispatch }) {
  return (
   <div>wosersjskajdk </div>
  );
}

const mapStateToProps = ({ recruit = {} }) => ({ recruit });
export default connect(mapStateToProps)(InnerItem);
