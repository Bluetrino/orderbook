import React from "react";

import PriceLevelRow from "./PriceLevelRow";
import { PriceLevelRowContainer } from "./PriceLevelRow/styles";
import TitleRow from "./TitleRow";
import { Container, TableContainer } from "./styles";
import { MOBILE_WIDTH } from "../../constants";
import { formatNumber } from "../../helpers";
import DepthVisualizer from "../DepthVisualizer";
import Loader from "../Loader";
import Spread from "../Spread";

export enum OrderType {
  BIDS,
  ASKS,
}

interface OrderBookProps {
  windowWidth: number;
  bids: number[][];
  asks: number[][];
}

export const OrderBook = ({ windowWidth, bids, asks }: OrderBookProps) => {
  const formatPrice = (arg: number): string => {
    return arg.toLocaleString("en", {
      useGrouping: true,
      minimumFractionDigits: 2,
    });
  };

  const buildPriceLevels = (
    levels: number[][],
    orderType: OrderType = OrderType.BIDS
  ): React.ReactNode => {
    const sortedLevelsByPrice: number[][] = [...levels].sort(
      (currentLevel: number[], nextLevel: number[]): number => {
        let result = 0;
        if (orderType === OrderType.BIDS || windowWidth < MOBILE_WIDTH) {
          result = nextLevel[0] - currentLevel[0];
        } else {
          result = currentLevel[0] - nextLevel[0];
        }
        return result;
      }
    );

    return sortedLevelsByPrice.map((level, idx) => {
      const calculatedTotal: number = level[2];
      const total: string = formatNumber(calculatedTotal);
      const depth = level[3];
      const size: string = formatNumber(level[1]);
      const price: string = formatPrice(level[0]);

      return (
        <PriceLevelRowContainer key={idx + depth}>
          <DepthVisualizer
            key={depth}
            windowWidth={windowWidth}
            depth={depth}
            orderType={orderType}
          />
          <PriceLevelRow
            key={size + total}
            total={total}
            size={size}
            price={price}
            reversedFieldsOrder={orderType === OrderType.ASKS}
            windowWidth={windowWidth}
          />
        </PriceLevelRowContainer>
      );
    });
  };

  return (
    <Container>
      {bids.length && asks.length ? (
        <>
          <TableContainer>
            {windowWidth > MOBILE_WIDTH && (
              <TitleRow windowWidth={windowWidth} reversedFieldsOrder={false} />
            )}
            <div>{buildPriceLevels(bids, OrderType.BIDS)}</div>
          </TableContainer>
          <Spread bids={bids} asks={asks} />
          <TableContainer>
            <TitleRow windowWidth={windowWidth} reversedFieldsOrder={true} />
            <div>{buildPriceLevels(asks, OrderType.ASKS)}</div>
          </TableContainer>
        </>
      ) : (
        <Loader />
      )}
    </Container>
  );
};

export default OrderBook;
