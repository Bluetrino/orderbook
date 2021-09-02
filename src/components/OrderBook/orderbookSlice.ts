import { createSlice, current, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../store';

export interface OrderbookState {
  market: string;
  bids: number[][];
  maxTotalBids: number;
  asks: number[][];
  maxTotalAsks: number;
}

const ORDERBOOK_LEVELS: number = 25;

const initialState: OrderbookState = {
  market: 'PI_XBTUSD', // PI_ETHUSD
  bids: [],
  maxTotalBids: 0,
  asks: [],
  maxTotalAsks: 0,
};

const removePriceLevel = (price: number, levels: number[][]): number[][] => levels.filter(level => level[0] !== price);

const updatePriceLevel = (updatedLevel: number[], levels: number[][]): number[][] => {
  return levels.map(level => {
    if (level[0] === updatedLevel[0]) {
      level = updatedLevel;
    }
    return level;
  });
};

const levelExists = (deltaLevelPrice: number, currentLevels: number[][]): boolean => currentLevels.some(level => level[0] === deltaLevelPrice);

const addPriceLevel = (deltaLevel: number[], levels: number[][]): number[][] => {
  return [...levels, deltaLevel];
};

/**
 *  If the size returned by a delta is 0 then
 that price level should be removed from the orderbook,
 otherwise you can safely overwrite the state of that
 price level with new data returned by that delta.

 - The orders returned by the feed are in the format
 of [price, size][].
 * @param currentLevels Existing price levels - `bids` or `asks`
 * @param orders Update of a price level
 */
const applyDeltas = (currentLevels: number[][], orders: number[][]): number[][] => {
  let updatedLevels: number[][] = currentLevels;

  orders.forEach((deltaLevel) => {
    const deltaLevelPrice = deltaLevel[0];
    const deltaLevelSize = deltaLevel[1];

    // If new size is zero - delete the price level
    if (deltaLevelSize === 0) {
      updatedLevels = removePriceLevel(deltaLevelPrice, updatedLevels);
    } else {
      // If the price level exists and the size is not zero, update it
      if (levelExists(deltaLevelPrice, currentLevels)) {
        updatedLevels = updatePriceLevel(deltaLevel, updatedLevels);
      } else {
        // If the price level doesn't exist in the orderbook and there are less than 25 levels, add it
        if (updatedLevels.length < ORDERBOOK_LEVELS) {
          updatedLevels = addPriceLevel(deltaLevel, updatedLevels);
        }
      }
    }
  });

  return updatedLevels;
}

const addTotalSums = (orders: number[][]): number[][] => {
  const totalSums: number[] = [];

  return orders.map((level: number[], idx) => {
    const size: number = level[1];
    const updatedLevel = [...level];
    const totalSum: number = idx === 0 ? size : size + totalSums[idx - 1];
    updatedLevel[2] = totalSum;
    totalSums.push(totalSum);
    return updatedLevel;
  });
};

const addDepths = (orders: number[][], maxTotal: number): number[][] => {
  return orders.map(order => {
    if (typeof order[3] !== 'undefined') {
      return order;
    } else {
      const calculatedTotal: number = order[2];
      const depth = (calculatedTotal / maxTotal) * 100;
      const updatedOrder = [...order];
      updatedOrder[3] = depth;
      return updatedOrder;
    }
  });
};

const getMaxTotalSum = (orders: number[][]): number => {
  const totalSums: number[] = orders.map(order => order[2]);
  return Math.max.apply(Math, totalSums);
}

export const orderbookSlice = createSlice({
  name: 'orderbook',
  initialState,
  reducers: {
    addBids: (state, { payload }) => {
      // state.bids = applyDeltas(current(state).bids,  addTotalSums(payload));
      const updatedBids: number[][] = applyDeltas(current(state).bids, addTotalSums(payload));
      state.maxTotalBids = getMaxTotalSum(updatedBids);
      state.bids = addDepths(updatedBids, current(state).maxTotalBids);
    },
    addAsks: (state, { payload }) => {
      const updatedAsks: number[][] = applyDeltas(current(state).asks, addTotalSums(payload));
      state.maxTotalAsks = getMaxTotalSum(updatedAsks);
      state.asks = addDepths(updatedAsks, getMaxTotalSum(updatedAsks));

      /*const maxTotal: number = payload[payload.length - 1][2];
      console.log(maxTotal)
      const updatedAsks: number[][] = addDepths(payload, maxTotal);
      state.maxTotalAsks = maxTotal;
      state.asks = applyDeltas(current(state).asks, updatedAsks);*/
    },
    addExistingState: (state, action: PayloadAction<any>) => {
      state.market = action.payload['product_id'];

      const bids: number[][] = addTotalSums(action.payload.bids);
      state.maxTotalBids = getMaxTotalSum(bids);
      state.bids = addDepths(bids, current(state).maxTotalBids);

      const asks: number[][] = addTotalSums(action.payload.asks);
      state.maxTotalAsks = getMaxTotalSum(asks);
      state.asks = addDepths(asks, current(state).maxTotalAsks);
    },
  }
});

export const { addBids, addAsks, addExistingState } = orderbookSlice.actions;

export const selectBids = (state: RootState): number[][] => state.orderbook.bids;
export const selectAsks = (state: RootState): number[][] => state.orderbook.asks;

export default orderbookSlice.reducer;
