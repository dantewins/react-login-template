import Header from "./Header";
import { Box, Container, Grid } from '@mui/material';
import Hero from "./Hero";

const Heros = () => {
  return (
    <div>
      <Header></Header>
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="103vh">
        <Grid container rowSpacing={3} justifyContent="center">
          <Grid item xs={4} container direction="row" justifyContent="center">
            <Hero></Hero>
          </Grid>
          <Grid item xs={4} container direction="row" justifyContent="center">
            <Hero></Hero>
          </Grid>
          <Grid item xs={4} container direction="row" justifyContent="center">
            <Hero></Hero>
          </Grid>
          <Grid item xs={4} container direction="row" justifyContent="center">
            <Hero></Hero>
          </Grid>
          <Grid item xs={4} container direction="row" justifyContent="center">
            <Hero></Hero>
          </Grid>
          <Grid item xs={4} container direction="row" justifyContent="center">
            <Hero></Hero>
          </Grid>
        </Grid>
      </Box>
    </div>
  )
}

export default Heros;