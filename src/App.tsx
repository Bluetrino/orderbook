import React, { useEffect, useState } from "react";

import Footer from "./components/Footer";
import Header from "./components/Header";
import OrderBookWrapper from "./components/OrderBook";
import { clearOrdersState } from "./components/OrderBook/orderbookSlice";
import StatusMessage from "./components/StatusMessage";
import { useAppDispatch } from "./hooks";
import GlobalStyle from "./styles/global";

export const ProductIds = {
  XBTUSD: "PI_XBTUSD",
  ETHUSD: "PI_ETHUSD",
};

const options: any = {
  PI_XBTUSD: [0.5, 1, 2.5],
  PI_ETHUSD: [0.05, 0.1, 0.25],
};

export const ProductsMap: any = {
  PI_XBTUSD: "PI_ETHUSD",
  PI_ETHUSD: "PI_XBTUSD",
};

function App() {
  const [windowWidth, setWindowWidth] = useState(0);
  const [productId, setProductId] = useState(ProductIds.XBTUSD);
  const [isFeedKilled, setIsFeedKilled] = useState(false);
  const [isPageVisible, setIsPageVisible] = useState(true);
  const dispatch = useAppDispatch();

  // Window width detection
  useEffect(() => {
    window.onresize = () => {
      setWindowWidth(window.innerWidth);
    };
    setWindowWidth(() => window.innerWidth);
  }, []);

  // Page Visibility detection
  useEffect(() => {
    // Set the name of the hidden property and the change event for visibility
    let hidden = "";
    let visibilityChange = "";

    if (typeof document.hidden !== "undefined") {
      // Opera 12.10 and Firefox 18 and later support
      hidden = "hidden";
      visibilityChange = "visibilitychange";
    } else {
      if (typeof (document as any).msHidden !== "undefined") {
        hidden = "msHidden";
        visibilityChange = "msvisibilitychange";
      } else {
        if (typeof (document as any).webkitHidden !== "undefined") {
          hidden = "webkitHidden";
          visibilityChange = "webkitvisibilitychange";
        }
      }
    }

    const handleVisibilityChange = () => {
      const isHidden = document["hidden"];
      if (isHidden) {
        document.title = "Orderbook Paused";
        setIsPageVisible(false);
      } else {
        document.title = "Orderbook";
        setIsPageVisible(true);
      }
    };

    // Warn if the browser doesn't support addEventListener or the Page Visibility API
    if (typeof document.addEventListener === "undefined" || hidden === "") {
      console.log(
        "This demo requires a browser, such as Google Chrome or Firefox, that supports the Page Visibility API."
      );
    } else {
      // Handle page visibility change
      document.addEventListener(
        visibilityChange,
        handleVisibilityChange,
        false
      );
    }
  }, []);

  const toggleProductId = (): void => {
    dispatch(clearOrdersState());
    setProductId(ProductsMap[productId]);
  };

  const toggleFeed = (): void => {
    setIsFeedKilled(!isFeedKilled);
  };

  return (
    <>
      {isPageVisible ? (
        <>
          <GlobalStyle />
          <Header options={options[productId]} />
          <OrderBookWrapper
            windowWidth={windowWidth}
            productId={productId}
            isFeedKilled={isFeedKilled}
          />
          <Footer
            toggleFeedCallback={toggleProductId}
            killFeedCallback={toggleFeed}
            isFeedKilled={isFeedKilled}
          />
          <StatusMessage
            isFeedKilled={isFeedKilled}
            selectedMarket={productId}
          />
        </>
      ) : (
        "HIDDEN PAGE."
      )}
    </>
  );
}

export default App;
