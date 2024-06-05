import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./style.scss";

import Layout from "./pages/Layout";
import Schedule from "./pages/Schedule";
function App() {
    const [count, setCount] = useState(0);

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/">
                    <Route path="/" element={<Layout />}>
                        <Route index element={<Schedule />} />
                        {/* <Route index path='recipe' element={<Recipe />} />
                        <Route index path='fridge' element={<Fridge />} />
                        <Route index path='statistic' element={<Statistic />} />
                        <Route index path='fridge/ingredients' element={<ImportIngredients />} />
                        <Route index path='fridge/category' element={<Category />} />
                        <Route index path='fridge/history' element={<History />} />
                        <Route index path='account-manage' element={<Account />} /> */}
                    </Route>
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
