import StoreProvider from "../redux/StoreProvider";
import LeftSideMenu from "../components/LeftSideMenu";

// export const revalidate = 60

export default function RootLayout(props: React.PropsWithChildren) {
  return (
    <StoreProvider>
      <html lang="en">
        <body>
            <LeftSideMenu />
            {props.children}
        </body>
      </html>
    </StoreProvider>
  );
}
