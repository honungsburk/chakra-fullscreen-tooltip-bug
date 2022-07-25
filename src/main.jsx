import * as React from "react";
import * as ReactDOMClient from "react-dom/client";
import {
  Text,
  Box,
  ChakraProvider,
  useBoolean,
  Button,
  Tooltip,
} from "@chakra-ui/react";

function App() {
  const ref = React.useRef(null);
  const [isFullScreen, fullscreenAction] = useFullscreen(ref);
  return (
    <Box padding={4} ref={ref} width="100%" height={"100%"} bg={"white"}>
      <Text>isfullscreen: {isFullScreen.toString()}</Text>
      <Tooltip label="should always be visible">
        <Button onClick={fullscreenAction.toggle}>Toggle</Button>
      </Tooltip>
    </Box>
  );
}

const rootElement = document.getElementById("root");
const root = ReactDOMClient.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <ChakraProvider>
      <App />
    </ChakraProvider>
  </React.StrictMode>
);

export function useFullscreen(ref) {
  const [isFullScreen, setIsFullScreen] = useBoolean(false);

  React.useEffect(() => {
    const fn = (e) => {
      if (document.fullscreenElement === ref.current) {
        setIsFullScreen.on();
      } else {
        setIsFullScreen.off();
      }
    };
    document.addEventListener("fullscreenchange", fn);

    return () => {
      document.removeEventListener("fullscreenchange", fn);
    };
  }, []);

  return [
    isFullScreen,
    {
      enter: async () => {
        if (document.fullscreenEnabled && ref.current) {
          await ref.current.requestFullscreen({ navigationUI: "show" });
          setIsFullScreen.on();
        }
      },
      exit: async () => {
        if (document.fullscreenEnabled) {
          await document.exitFullscreen();
          setIsFullScreen.off();
        }
      },
      toggle: async () => {
        if (document.fullscreenEnabled && ref.current) {
          if (document.fullscreenElement) {
            await document.exitFullscreen();
            setIsFullScreen.off();
          } else {
            await ref.current.requestFullscreen({ navigationUI: "show" });
            setIsFullScreen.on();
          }
        }
      },
    },
  ];
}
