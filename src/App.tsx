import Home from "./pages/Home.tsx";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import MainPageLayout from "./components/layout/MainPageLayout.tsx";
import AlbumPage from "./pages/AlbumPage.tsx";
import LoginPage from "./pages/LoginPage.tsx";
import PlaylistListPage from "./pages/PlaylistListPage.tsx";
import PlaylistContentPage from "./pages/PlaylistContentPage.tsx";



function App() {
    return (
        <BrowserRouter>
                <Routes>
                    <Route path="/login" element={<LoginPage />}></Route>
                    <Route path="/" element={<MainPageLayout />}>
                        <Route index element={<Home />} />
                        <Route path="playlists/me" element={<PlaylistListPage />} />
                        <Route path="album/:id" element={<AlbumPage />} />
                        <Route path="playlist/:id" element={<PlaylistContentPage />} />
                    </Route>
                </Routes>
        </BrowserRouter>
    );
}

export default App;
