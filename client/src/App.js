import { Routes, Route } from "react-router-dom";
import Header from "./Components/Header";
import Home from "./Components/Home";
import Login from "./Components/Login";
import Signup from "./Components/Signup";
import ForgotPassword from "./Components/ForgotPassword";
import ResetPassword from "./Components/ResetPassword";
import PersistLogin from "./Components/PersistLogin";
import ProtectedRoute from "./Components/ProtectedRoute";
import { createTheme, ThemeProvider } from '@mui/material/styles';

const defaultTheme = createTheme({
  typography: {
      fontFamily: [
          'Montserrat',
          'sans-serif'
      ].join(',')
  }
});

function App() {
  return (
    <ThemeProvider theme={defaultTheme}>
      <Routes>
        <Route element={<PersistLogin></PersistLogin>}>
          <Route path="/login" element={<Login></Login>}></Route>
          <Route path="/sign-up" element={<Signup></Signup>}></Route>
          <Route path="/forgot-password" element={<ForgotPassword></ForgotPassword>}></Route>
          <Route path="/reset-password/:token" exact element={<ResetPassword></ResetPassword>}></Route>
          <Route element={<ProtectedRoute allowedRole="user" />}>
            <Route element={<Header></Header>}>
              <Route path="/" element={<Home></Home>}></Route>
            </Route>
          </Route>
        </Route>
      </Routes>
    </ThemeProvider>
  );
}

export default App;
