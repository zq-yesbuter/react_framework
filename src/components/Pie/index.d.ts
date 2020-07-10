import * as React from 'react';
export interface IPieProps {
  animate?: boolean;
  color?: string;
  colors?: string[];
  height: number;
  hasLegend?: boolean;
  padding?: [number, number, number, number];
  percent?: number;
  data?: Array<{
    x: string | string;
    y: number;
  }>;
  total?: React.ReactNode | number | (() => React.ReactNode | number);
  title?: React.ReactNode;
  tooltip?: boolean;
  valueFormat?: (value: string) => string | React.ReactNode;
  subTitle?: React.ReactNode;
  lengendClick?:(item:any) => void;
  // expandClick: (item:any,expanded:boolean) => void;
  expandObj: any;
  expandKey: string;
  // fedBack: (item:any,expanded:boolean) => void;
}

export default class Pie extends React.Component<IPieProps, any> {}
