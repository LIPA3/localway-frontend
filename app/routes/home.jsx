import { createBrowserRouter } from "react-router";
import homePage from "../pages/homePage";
const route=createBrowserRouter([
    {
        path:'/',
        element:<homePage></homePage>
    }
])
export default route;