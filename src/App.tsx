import Home from "./pages/Home.tsx";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import MainPageLayout from "./components/layout/MainPageLayout.tsx";
import AlbumPage from "./pages/AlbumPage.tsx";
import LoginPage from "./pages/LoginPage.tsx";



function App() {
    return (
        <BrowserRouter>
                <Routes>
                    <Route path="/login" element={<LoginPage />}></Route>
                    <Route path="/" element={<MainPageLayout />}>
                        <Route index element={<Home />} />
                        <Route path="album/:id" element={<AlbumPage />} />
                    </Route>
                </Routes>
        </BrowserRouter>
    );
}

export default App;
